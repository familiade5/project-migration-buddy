import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

// Prompts for each category and context
const categoryPrompts: Record<string, string[]> = {
  tips: [
    "Professional real estate photo, Brazilian family receiving house keys from agent, bright natural daylight, warm welcoming atmosphere, modern office, ultra high resolution",
    "Professional real estate photo, young Brazilian couple signing property documents, happy smiling, bright office setting, natural light, ultra high resolution",
    "Professional real estate photo, Brazilian middle-class family touring a modest apartment, excited expressions, clean modern interior, natural daylight, ultra high resolution",
    "Professional real estate photo, real estate agent showing property details on tablet to clients, modern office, bright natural light, ultra high resolution",
    "Professional real estate photo, happy Brazilian family in front of their new modest home, keys in hand, sunny day, suburban neighborhood, ultra high resolution",
    "Professional real estate photo, couple reviewing mortgage documents with banker, professional setting, bright natural lighting, ultra high resolution",
    "Professional real estate photo, Brazilian family celebrating home purchase, confetti or champagne, bright cheerful atmosphere, ultra high resolution",
  ],
  process: [
    "Professional real estate photo, document folder with property papers and house keys on desk, bright office lighting, organized workspace, ultra high resolution",
    "Professional real estate photo, step by step checklist on clipboard with property documents, pen, bright natural light, ultra high resolution",
    "Professional real estate photo, real estate agent explaining contract to Brazilian clients on laptop, modern office, bright setting, ultra high resolution",
    "Professional real estate photo, calendar with marked dates for property visits, organized desk, bright office, ultra high resolution",
    "Professional real estate photo, Brazilian couple at bank discussing financing options, professional banker, bright modern interior, ultra high resolution",
    "Professional real estate photo, property inspection scene with agent taking notes, modest apartment interior, natural daylight, ultra high resolution",
    "Professional real estate photo, digital tablet showing property listings, hands scrolling, modern office background, bright light, ultra high resolution",
  ],
  stories: [
    "Professional real estate photo, emotional Brazilian family receiving keys to their first home, tears of joy, bright sunny day, ultra high resolution",
    "Professional real estate photo, before and after moving scene, boxes and furniture, happy family, bright interior, ultra high resolution",
    "Professional real estate photo, grandmother showing new home to grandchildren, emotional moment, cozy interior, warm natural light, ultra high resolution",
    "Professional real estate photo, young Brazilian professional celebrating first apartment purchase alone, happy expression, modern modest apartment, ultra high resolution",
    "Professional real estate photo, multi-generational Brazilian family in front of new house, proud expressions, sunny day, suburban setting, ultra high resolution",
    "Professional real estate photo, couple unpacking boxes in new home, excited happy mood, natural daylight through windows, ultra high resolution",
    "Professional real estate photo, Brazilian family hanging first photo frame in new home, emotional moment, cozy interior, warm lighting, ultra high resolution",
  ],
  institutional: [
    "Professional corporate photo, modern real estate agency office interior, clean professional design, bright natural lighting, ultra high resolution",
    "Professional corporate photo, team of real estate agents in meeting room, diverse group, modern office, bright atmosphere, ultra high resolution",
    "Professional corporate photo, real estate company reception area with logo wall, welcoming design, bright natural light, ultra high resolution",
    "Professional corporate photo, agent shaking hands with satisfied client, professional office background, bright setting, ultra high resolution",
    "Professional corporate photo, real estate training session with agents taking notes, modern conference room, bright lighting, ultra high resolution",
    "Professional corporate photo, award ceremony for top performing real estate agents, professional setting, bright atmosphere, ultra high resolution",
    "Professional corporate photo, real estate office with city view through windows, modern interior design, natural daylight, ultra high resolution",
  ],
};

serve(async (req) => {
  // Handle CORS preflight
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    const { category, slideIndex } = await req.json();
    
    console.log(`Generating new image for category: ${category}, slideIndex: ${slideIndex}`);

    const LOVABLE_API_KEY = Deno.env.get('LOVABLE_API_KEY');
    if (!LOVABLE_API_KEY) {
      throw new Error('LOVABLE_API_KEY not configured');
    }

    // Get prompts for category and pick one randomly
    const prompts = categoryPrompts[category] || categoryPrompts.tips;
    const randomPrompt = prompts[Math.floor(Math.random() * prompts.length)];
    
    // Add variation to prompt
    const variations = [
      ", 16:9 aspect ratio, photorealistic",
      ", wide angle shot, professional photography",
      ", cinematic lighting, high quality",
      ", editorial style photography",
      ", lifestyle photography, authentic feel",
    ];
    const randomVariation = variations[Math.floor(Math.random() * variations.length)];
    const finalPrompt = randomPrompt + randomVariation;

    console.log(`Using prompt: ${finalPrompt}`);

    // Call Lovable AI image generation
    const response = await fetch('https://ai.gateway.lovable.dev/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${LOVABLE_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'google/gemini-2.5-flash-image',
        messages: [
          {
            role: 'user',
            content: finalPrompt,
          },
        ],
        modalities: ['image', 'text'],
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('AI API error:', errorText);
      throw new Error(`AI API error: ${response.status}`);
    }

    const data = await response.json();
    console.log('AI response received');

    // Extract image URL from response
    const imageUrl = data.choices?.[0]?.message?.images?.[0]?.image_url?.url;
    
    if (!imageUrl) {
      console.error('No image in response:', JSON.stringify(data));
      throw new Error('No image generated');
    }

    console.log('Image generated successfully');

    return new Response(
      JSON.stringify({ 
        success: true, 
        imageUrl,
        prompt: finalPrompt,
      }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      }
    );

  } catch (error: unknown) {
    console.error('Error generating image:', error);
    const errorMessage = error instanceof Error ? error.message : 'Failed to generate image';
    return new Response(
      JSON.stringify({ 
        success: false, 
        error: errorMessage,
      }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500,
      }
    );
  }
});
