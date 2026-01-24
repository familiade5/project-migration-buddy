import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { imageBase64 } = await req.json();

    if (!imageBase64) {
      throw new Error('Image data is required');
    }

    // Use Lovable AI to detect the room/area type
    const response = await fetch('https://llm.lovable.dev/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'google/gemini-2.5-flash',
        messages: [
          {
            role: 'user',
            content: [
              {
                type: 'text',
                text: `Analyze this real estate photo and classify it into exactly ONE of these categories. Respond with ONLY the category name in lowercase, nothing else:

- fachada (exterior view, building facade, entrance, front of house/building)
- sala (living room, dining room, TV room, main social area)
- quarto (bedroom, any sleeping area)
- cozinha (kitchen, cooking area)
- banheiro (bathroom, toilet, shower)
- area-externa (balcony, garden, pool, terrace, backyard, external leisure area)
- garagem (garage, parking, car space)
- outros (anything else that doesn't fit above categories)

Respond with ONLY one word from: fachada, sala, quarto, cozinha, banheiro, area-externa, garagem, outros`
              },
              {
                type: 'image_url',
                image_url: {
                  url: imageBase64.startsWith('data:') ? imageBase64 : `data:image/jpeg;base64,${imageBase64}`
                }
              }
            ]
          }
        ],
        max_tokens: 20,
        temperature: 0.1,
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('AI API error:', errorText);
      throw new Error(`AI API error: ${response.status}`);
    }

    const data = await response.json();
    const detectedCategory = data.choices?.[0]?.message?.content?.trim().toLowerCase() || 'outros';

    // Validate the category
    const validCategories = ['fachada', 'sala', 'quarto', 'cozinha', 'banheiro', 'area-externa', 'garagem', 'outros'];
    const category = validCategories.includes(detectedCategory) ? detectedCategory : 'outros';

    console.log('Detected category:', category);

    return new Response(
      JSON.stringify({ category }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    console.error('Error detecting photo category:', errorMessage);
    return new Response(
      JSON.stringify({ category: 'outros', error: errorMessage }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 200 }
    );
  }
});
