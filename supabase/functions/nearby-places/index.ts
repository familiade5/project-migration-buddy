import { corsHeaders } from 'npm:@supabase/supabase-js@2/cors';

const GOOGLE_KEY = Deno.env.get('GOOGLE_PLACES_API_KEY');

const CATEGORIES = [
  { key: 'supermarket', label: 'Supermercados', icon: '🛒' },
  { key: 'school',      label: 'Escolas',       icon: '🎓' },
  { key: 'hospital',    label: 'Hospitais',     icon: '🏥' },
  { key: 'shopping_mall', label: 'Shoppings',   icon: '🛍️' },
  { key: 'pharmacy',    label: 'Farmácias',     icon: '💊' },
  { key: 'restaurant',  label: 'Restaurantes',  icon: '🍽️' },
];

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') return new Response('ok', { headers: corsHeaders });
  try {
    if (!GOOGLE_KEY) throw new Error('GOOGLE_PLACES_API_KEY not configured');
    const { address, lat, lng } = await req.json();

    // Geocode if lat/lng not provided
    let latitude = lat, longitude = lng;
    if ((!latitude || !longitude) && address) {
      const geo = await fetch(
        `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(address)}&key=${GOOGLE_KEY}`
      ).then(r => r.json());
      const loc = geo?.results?.[0]?.geometry?.location;
      if (loc) { latitude = loc.lat; longitude = loc.lng; }
    }
    if (!latitude || !longitude) {
      return new Response(JSON.stringify({ location: null, places: [] }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const results = await Promise.all(
      CATEGORIES.map(async (cat) => {
        const url = `https://maps.googleapis.com/maps/api/place/nearbysearch/json?location=${latitude},${longitude}&radius=1500&type=${cat.key}&key=${GOOGLE_KEY}`;
        const res = await fetch(url).then(r => r.json());
        const items = (res.results || []).slice(0, 3).map((p: any) => ({
          name: p.name,
          vicinity: p.vicinity,
          rating: p.rating || null,
        }));
        return { ...cat, items };
      })
    );

    return new Response(JSON.stringify({
      location: { lat: latitude, lng: longitude },
      categories: results.filter(c => c.items.length > 0),
    }), { headers: { ...corsHeaders, 'Content-Type': 'application/json' } });
  } catch (e: any) {
    console.error('nearby-places error', e);
    return new Response(JSON.stringify({ error: e.message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});