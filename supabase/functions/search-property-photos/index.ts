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
    let allPhotos: Array<{ url: string; reference: string }> = [];
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
            const photoUrl = `https://maps.googleapis.com/maps/api/place/photo?maxwidth=800&photo_reference=${photo.photo_reference}&key=${GOOGLE_API_KEY}`;
            allPhotos.push({
              url: photoUrl,
              reference: photo.photo_reference
            });
          }
        }
      } catch (err) {
        console.error(`Error fetching details for place ${place.place_id}:`, err);
      }
    }

    // Remover duplicatas
    const uniquePhotos = allPhotos.filter((photo, index, self) =>
      index === self.findIndex(p => p.reference === photo.reference)
    );

    console.log(`Found ${uniquePhotos.length} photos, condominium name: ${condominiumName || 'not found'}`);

    return new Response(
      JSON.stringify({ 
        success: true, 
        condominiumName,
        photos: uniquePhotos.slice(0, 20), // Limitar a 20 fotos
        totalFound: uniquePhotos.length
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
