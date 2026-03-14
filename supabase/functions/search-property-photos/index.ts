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
    
    // Convert to base64
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

    // Se for apartamento, buscar também por "condomínio" + endereço
    if (propertyType?.toLowerCase().includes('apartamento')) {
      const condoSearchQuery = encodeURIComponent(`condomínio ${address}`);
      const condoSearchUrl = `https://maps.googleapis.com/maps/api/place/textsearch/json?query=${condoSearchQuery}&key=${GOOGLE_API_KEY}&language=pt-BR`;
      
      console.log("Searching for condominium...");
      const condoSearchResponse = await fetch(condoSearchUrl);
      const condoSearchData = await condoSearchResponse.json();
      
      if (condoSearchData.status === "OK" && condoSearchData.results?.length > 0) {
        // Procurar por resultados que parecem ser condomínios
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
    
    for (const place of foundPlaces.slice(0, 5)) { // Limitar a 5 lugares
      if (processedPlaceIds.has(place.place_id)) continue;
      processedPlaceIds.add(place.place_id);

      // Obter detalhes do lugar para mais fotos
      const detailsUrl = `https://maps.googleapis.com/maps/api/place/details/json?place_id=${place.place_id}&fields=name,photos,formatted_address&key=${GOOGLE_API_KEY}&language=pt-BR`;
      
      try {
        const detailsResponse = await fetch(detailsUrl);
        const detailsData = await detailsResponse.json();
        
        if (detailsData.status === "OK" && detailsData.result?.photos) {
          for (const photo of detailsData.result.photos.slice(0, 10)) {
            photoReferences.push({
              reference: photo.photo_reference
            });
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

    // Convert photos to base64 (limit to 12 to avoid timeout)
    const maxPhotos = Math.min(uniqueReferences.length, 12);
    const photosWithBase64: Array<{ url: string; reference: string }> = [];
    
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

    console.log(`Successfully converted ${photosWithBase64.length} photos, condominium name: ${condominiumName || 'not found'}`);

    return new Response(
      JSON.stringify({ 
        success: true, 
        condominiumName,
        photos: photosWithBase64,
        totalFound: uniqueReferences.length
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
