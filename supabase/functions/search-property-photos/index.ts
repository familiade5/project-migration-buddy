import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface PlaceResult {
  name: string;
  photos?: Array<{
    photo_reference: string;
    height: number;
    width: number;
  }>;
  place_id: string;
  formatted_address?: string;
  types?: string[];
  geometry?: {
    location: { lat: number; lng: number };
  };
}

// Helper function to convert image URL to base64
async function urlToBase64(url: string): Promise<string | null> {
  try {
    const response = await fetch(url);
    if (!response.ok) {
      console.error(`Failed to fetch image: ${response.status}`);
      return null;
    }
    
    const contentType = response.headers.get('content-type') || 'image/jpeg';
    const arrayBuffer = await response.arrayBuffer();
    const uint8Array = new Uint8Array(arrayBuffer);
    
    let binary = '';
    for (let i = 0; i < uint8Array.length; i++) {
      binary += String.fromCharCode(uint8Array[i]);
    }
    const base64 = btoa(binary);
    
    return `data:${contentType};base64,${base64}`;
  } catch (error) {
    console.error(`Error converting image to base64:`, error);
    return null;
  }
}

// Fallback: get Street View images for an address
async function getStreetViewImages(
  address: string,
  apiKey: string
): Promise<Array<{ url: string; reference: string }>> {
  const photos: Array<{ url: string; reference: string }> = [];
  
  // Different headings to capture multiple angles
  const headings = [0, 90, 180, 270];
  const pitches = [0, 15];

  for (const heading of headings.slice(0, 3)) {
    for (const pitch of pitches.slice(0, 1)) {
      const svUrl = `https://maps.googleapis.com/maps/api/streetview?size=800x600&location=${encodeURIComponent(address)}&heading=${heading}&pitch=${pitch}&fov=90&key=${apiKey}`;
      
      // Check if Street View is available for this location
      const metaUrl = `https://maps.googleapis.com/maps/api/streetview/metadata?location=${encodeURIComponent(address)}&key=${apiKey}`;
      
      try {
        const metaResp = await fetch(metaUrl);
        const metaData = await metaResp.json();
        
        if (metaData.status === 'OK') {
          const base64 = await urlToBase64(svUrl);
          if (base64) {
            photos.push({
              url: base64,
              reference: `streetview_${heading}_${pitch}`
            });
          }
        } else {
          console.log(`Street View not available for heading ${heading}: ${metaData.status}`);
          break; // If not available for this address, skip all headings
        }
      } catch (err) {
        console.error(`Error fetching Street View for heading ${heading}:`, err);
      }
    }
  }

  return photos;
}

// Fallback: get Google Maps Static satellite image
async function getStaticMapImage(
  address: string,
  apiKey: string
): Promise<{ url: string; reference: string } | null> {
  const mapUrl = `https://maps.googleapis.com/maps/api/staticmap?center=${encodeURIComponent(address)}&zoom=18&size=800x800&maptype=satellite&key=${apiKey}`;
  
  const base64 = await urlToBase64(mapUrl);
  if (base64) {
    return { url: base64, reference: 'staticmap_satellite' };
  }
  return null;
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { address, propertyType } = await req.json();
    
    if (!address) {
      return new Response(
        JSON.stringify({ error: "Endereço não fornecido" }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const GOOGLE_API_KEY = Deno.env.get("GOOGLE_PLACES_API_KEY");
    if (!GOOGLE_API_KEY) {
      console.error("GOOGLE_PLACES_API_KEY not configured");
      return new Response(
        JSON.stringify({ error: "API do Google não configurada" }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    console.log(`Searching for property at: ${address}, type: ${propertyType}`);

    // Primeira busca: pelo endereço exato
    const searchQuery = encodeURIComponent(address);
    const textSearchUrl = `https://maps.googleapis.com/maps/api/place/textsearch/json?query=${searchQuery}&key=${GOOGLE_API_KEY}&language=pt-BR`;
    
    console.log("Performing text search...");
    const textSearchResponse = await fetch(textSearchUrl);
    const textSearchData = await textSearchResponse.json();
    
    if (textSearchData.status !== "OK" && textSearchData.status !== "ZERO_RESULTS") {
      console.error("Google Places API error:", textSearchData.status, textSearchData.error_message);
      throw new Error(`Erro na API do Google: ${textSearchData.status}`);
    }

    let condominiumName = "";
    let photoReferences: Array<{ reference: string }> = [];
    let foundPlaces: PlaceResult[] = textSearchData.results || [];
    let firstPlaceGeometry: { lat: number; lng: number } | null = null;

    // Capture geometry from first result for Street View fallback
    if (foundPlaces.length > 0 && foundPlaces[0].geometry?.location) {
      firstPlaceGeometry = foundPlaces[0].geometry.location;
    }

    // Se for apartamento, buscar também por "condomínio" + endereço
    if (propertyType?.toLowerCase().includes('apartamento')) {
      const condoSearchQuery = encodeURIComponent(`condomínio ${address}`);
      const condoSearchUrl = `https://maps.googleapis.com/maps/api/place/textsearch/json?query=${condoSearchQuery}&key=${GOOGLE_API_KEY}&language=pt-BR`;
      
      console.log("Searching for condominium...");
      const condoSearchResponse = await fetch(condoSearchUrl);
      const condoSearchData = await condoSearchResponse.json();
      
      if (condoSearchData.status === "OK" && condoSearchData.results?.length > 0) {
        const condoResult = condoSearchData.results.find((place: PlaceResult) => 
          place.types?.some(t => 
            ['premise', 'subpremise', 'establishment', 'point_of_interest', 'real_estate_agency'].includes(t)
          ) || 
          place.name?.toLowerCase().includes('condomínio') ||
          place.name?.toLowerCase().includes('residencial') ||
          place.name?.toLowerCase().includes('edifício')
        );
        
        if (condoResult) {
          condominiumName = condoResult.name;
          foundPlaces = [condoResult, ...foundPlaces];
          console.log(`Found condominium: ${condominiumName}`);
        }
      }
    }

    // Buscar detalhes e fotos de cada local encontrado
    const processedPlaceIds = new Set<string>();
    
    for (const place of foundPlaces.slice(0, 5)) {
      if (processedPlaceIds.has(place.place_id)) continue;
      processedPlaceIds.add(place.place_id);

      const detailsUrl = `https://maps.googleapis.com/maps/api/place/details/json?place_id=${place.place_id}&fields=name,photos,formatted_address,geometry&key=${GOOGLE_API_KEY}&language=pt-BR`;
      
      try {
        const detailsResponse = await fetch(detailsUrl);
        const detailsData = await detailsResponse.json();
        
        if (detailsData.status === "OK") {
          // Capture geometry for Street View fallback
          if (!firstPlaceGeometry && detailsData.result?.geometry?.location) {
            firstPlaceGeometry = detailsData.result.geometry.location;
          }
          
          if (detailsData.result?.photos) {
            for (const photo of detailsData.result.photos.slice(0, 10)) {
              photoReferences.push({
                reference: photo.photo_reference
              });
            }
          }
        }
      } catch (err) {
        console.error(`Error fetching details for place ${place.place_id}:`, err);
      }
    }

    // Remover duplicatas
    const uniqueReferences = photoReferences.filter((photo, index, self) =>
      index === self.findIndex(p => p.reference === photo.reference)
    );

    console.log(`Found ${uniqueReferences.length} unique photo references`);

    let photosWithBase64: Array<{ url: string; reference: string }> = [];

    if (uniqueReferences.length > 0) {
      // Convert Places photos to base64 (limit to 12)
      const maxPhotos = Math.min(uniqueReferences.length, 12);
      console.log(`Converting ${maxPhotos} photos to base64...`);
      
      for (let i = 0; i < maxPhotos; i++) {
        const photoRef = uniqueReferences[i];
        const photoUrl = `https://maps.googleapis.com/maps/api/place/photo?maxwidth=800&photo_reference=${photoRef.reference}&key=${GOOGLE_API_KEY}`;
        
        const base64Url = await urlToBase64(photoUrl);
        if (base64Url) {
          photosWithBase64.push({
            url: base64Url,
            reference: photoRef.reference
          });
          console.log(`Converted photo ${i + 1}/${maxPhotos}`);
        }
      }
    }

    // FALLBACK: Se não encontrou fotos, usar Street View + Mapa Satélite
    if (photosWithBase64.length === 0) {
      console.log("No Places photos found, falling back to Street View and Satellite Map...");
      
      // Use coordinates if available, otherwise use the address string
      const locationQuery = firstPlaceGeometry 
        ? `${firstPlaceGeometry.lat},${firstPlaceGeometry.lng}`
        : address;

      // Get Street View images (multiple angles)
      const streetViewPhotos = await getStreetViewImages(locationQuery, GOOGLE_API_KEY);
      photosWithBase64.push(...streetViewPhotos);
      console.log(`Got ${streetViewPhotos.length} Street View photos`);

      // Get satellite map image
      const satellitePhoto = await getStaticMapImage(locationQuery, GOOGLE_API_KEY);
      if (satellitePhoto) {
        photosWithBase64.push(satellitePhoto);
        console.log("Got satellite map photo");
      }
    }

    console.log(`Total photos: ${photosWithBase64.length}, condominium name: ${condominiumName || 'not found'}`);

    return new Response(
      JSON.stringify({ 
        success: true, 
        condominiumName,
        photos: photosWithBase64,
        totalFound: uniqueReferences.length,
        usedFallback: uniqueReferences.length === 0 && photosWithBase64.length > 0
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error("Error searching property photos:", error);
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : "Erro ao buscar fotos" }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
