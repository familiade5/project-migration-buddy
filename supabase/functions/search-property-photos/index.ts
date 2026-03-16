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

// Fetch a URL and convert to base64 (server-side, no CORS issues)
async function fetchAsBase64(url: string): Promise<string | null> {
  try {
    const response = await fetch(url);
    if (!response.ok) return null;
    const contentType = response.headers.get('content-type') || 'image/jpeg';
    const arrayBuffer = await response.arrayBuffer();
    const bytes = new Uint8Array(arrayBuffer);
    let binary = '';
    const chunkSize = 8192;
    for (let i = 0; i < bytes.length; i += chunkSize) {
      binary += String.fromCharCode(...bytes.subarray(i, i + chunkSize));
    }
    return `data:${contentType};base64,${btoa(binary)}`;
  } catch {
    return null;
  }
}

// ─── Google Custom Search (Images) ────────────────────────────────────────────
async function searchGoogleImages(
  query: string,
  apiKey: string,
  cx: string
): Promise<string[]> {
  try {
    const url = `https://www.googleapis.com/customsearch/v1?q=${encodeURIComponent(query)}&searchType=image&num=10&key=${apiKey}&cx=${cx}&imgSize=large&imgType=photo&safe=active`;
    const res = await fetch(url);
    if (!res.ok) {
      console.log(`Custom Search failed: ${res.status}`);
      return [];
    }
    const data = await res.json();
    if (!data.items || data.items.length === 0) return [];
    return (data.items as Array<{ link: string }>).map(item => item.link);
  } catch (e) {
    console.log('Google Images search error:', e);
    return [];
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
      return new Response(
        JSON.stringify({ error: "API do Google não configurada" }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Optional: Google Custom Search Engine ID (for image search)
    const GOOGLE_CSE_ID = Deno.env.get("GOOGLE_CSE_ID");

    console.log(`Searching for: ${address}, type: ${propertyType}`);

    let photos: Array<{ url: string; reference: string }> = [];
    let condominiumName = "";

    // ─── FASE 1: Google Images (se CSE configurado) ───────────────────────────
    if (GOOGLE_CSE_ID) {
      console.log("Trying Google Images first...");
      const imageQuery = `${address} imóvel`;
      const imageUrls = await searchGoogleImages(imageQuery, GOOGLE_API_KEY, GOOGLE_CSE_ID);

      if (imageUrls.length > 0) {
        console.log(`Found ${imageUrls.length} Google Images results, converting...`);
        const MAX_IMG = Math.min(imageUrls.length, 12);
        const base64Results = await Promise.all(
          imageUrls.slice(0, MAX_IMG).map(async (imgUrl, i) => {
            const base64 = await fetchAsBase64(imgUrl);
            return base64 ? { url: base64, reference: `google_image_${i}` } : null;
          })
        );
        photos = base64Results.filter((p): p is { url: string; reference: string } => p !== null);
        console.log(`Successfully converted ${photos.length} Google Images`);
      }
    }

    // ─── FASE 2: Google Places (se não encontrou via Images) ──────────────────
    if (photos.length === 0) {
      console.log("Trying Google Places...");

      let photoReferences: string[] = [];
      let foundPlaces: PlaceResult[] = [];

      const mainQuery = encodeURIComponent(address);
      const mainSearchPromise = fetch(
        `https://maps.googleapis.com/maps/api/place/textsearch/json?query=${mainQuery}&key=${GOOGLE_API_KEY}&language=pt-BR`
      ).then(r => r.json());

      const isApartment = propertyType?.toLowerCase().includes('apartamento');
      const condoSearchPromise = isApartment
        ? fetch(
            `https://maps.googleapis.com/maps/api/place/textsearch/json?query=${encodeURIComponent(`condomínio ${address}`)}&key=${GOOGLE_API_KEY}&language=pt-BR`
          ).then(r => r.json())
        : Promise.resolve(null);

      const [mainData, condoData] = await Promise.all([mainSearchPromise, condoSearchPromise]);

      if (mainData.status === "OK") {
        foundPlaces = mainData.results || [];
      }

      if (condoData?.status === "OK" && condoData.results?.length > 0) {
        const condoResult = condoData.results.find((place: PlaceResult) =>
          place.types?.some(t =>
            ['premise', 'subpremise', 'establishment', 'point_of_interest'].includes(t)
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

      const processedIds = new Set<string>();
      const uniquePlaces = foundPlaces.slice(0, 5).filter(p => {
        if (processedIds.has(p.place_id)) return false;
        processedIds.add(p.place_id);
        return true;
      });

      const detailsResults = await Promise.all(
        uniquePlaces.map(place =>
          fetch(
            `https://maps.googleapis.com/maps/api/place/details/json?place_id=${place.place_id}&fields=name,photos&key=${GOOGLE_API_KEY}&language=pt-BR`
          ).then(r => r.json()).catch(() => null)
        )
      );

      for (const details of detailsResults) {
        if (details?.status === "OK" && details.result?.photos) {
          for (const photo of details.result.photos.slice(0, 10)) {
            photoReferences.push(photo.photo_reference);
          }
        }
      }

      photoReferences = [...new Set(photoReferences)];
      console.log(`Found ${photoReferences.length} unique Places photo references`);

      if (photoReferences.length > 0) {
        const MAX_PHOTOS = Math.min(photoReferences.length, 12);
        const base64Results = await Promise.all(
          photoReferences.slice(0, MAX_PHOTOS).map(async (ref) => {
            const photoUrl = `https://maps.googleapis.com/maps/api/place/photo?maxwidth=800&photo_reference=${ref}&key=${GOOGLE_API_KEY}`;
            const base64 = await fetchAsBase64(photoUrl);
            return base64 ? { url: base64, reference: ref } : null;
          })
        );
        photos = base64Results.filter((p): p is { url: string; reference: string } => p !== null);
        console.log(`Successfully converted ${photos.length} Places photos`);
      }
    }

    // ─── FASE 3: Street View + Satélite (fallback final) ──────────────────────
    if (photos.length === 0) {
      console.log("No photos found anywhere, falling back to Street View + Satellite...");
      const encodedAddress = encodeURIComponent(address);

      const streetViewPromises = [0, 90, 180, 270].map(async (heading) => {
        const url = `https://maps.googleapis.com/maps/api/streetview?size=800x600&location=${encodedAddress}&heading=${heading}&pitch=10&fov=80&key=${GOOGLE_API_KEY}`;
        const base64 = await fetchAsBase64(url);
        return base64 ? { url: base64, reference: `streetview_${heading}` } : null;
      });

      const satellitePromise = (async () => {
        const url = `https://maps.googleapis.com/maps/api/staticmap?center=${encodedAddress}&zoom=19&size=800x600&maptype=satellite&key=${GOOGLE_API_KEY}`;
        const base64 = await fetchAsBase64(url);
        return base64 ? { url: base64, reference: "satellite_map" } : null;
      })();

      const fallbackResults = await Promise.all([...streetViewPromises, satellitePromise]);
      photos = fallbackResults.filter((p): p is { url: string; reference: string } => p !== null);
      console.log(`Got ${photos.length} Street View + Satellite photos`);
    }

    console.log(`Total: ${photos.length} photos, condo: ${condominiumName || 'not found'}`);

    return new Response(
      JSON.stringify({ success: true, condominiumName, photos, totalFound: photos.length }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error("Error:", error);
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : "Erro ao buscar fotos" }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
