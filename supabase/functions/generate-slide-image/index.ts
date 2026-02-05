import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

// Prompts para cada categoria em português brasileiro
const categoryPrompts: Record<string, string[]> = {
  tips: [
    "Foto profissional imobiliária, família brasileira recebendo chaves da casa nova do corretor, luz natural do dia, atmosfera acolhedora, escritório moderno, ultra alta resolução",
    "Foto profissional imobiliária, casal jovem brasileiro assinando documentos do imóvel, sorrindo felizes, escritório iluminado, luz natural, ultra alta resolução",
    "Foto profissional imobiliária, família brasileira de classe média visitando apartamento modesto, expressões animadas, interior limpo e moderno, luz natural do dia, ultra alta resolução",
    "Foto profissional imobiliária, corretor mostrando detalhes do imóvel em tablet para clientes, escritório moderno, luz natural brilhante, ultra alta resolução",
    "Foto profissional imobiliária, família brasileira feliz em frente à casa nova modesta, chaves na mão, dia ensolarado, bairro residencial, ultra alta resolução",
    "Foto profissional imobiliária, casal revisando documentos de financiamento com bancário, ambiente profissional, iluminação natural brilhante, ultra alta resolução",
    "Foto profissional imobiliária, família brasileira comemorando compra da casa, confete ou champanhe, atmosfera alegre e iluminada, ultra alta resolução",
  ],
  process: [
    "Foto profissional imobiliária, pasta de documentos com papéis do imóvel e chaves na mesa, iluminação de escritório, espaço organizado, ultra alta resolução",
    "Foto profissional imobiliária, checklist passo a passo em prancheta com documentos do imóvel, caneta, luz natural brilhante, ultra alta resolução",
    "Foto profissional imobiliária, corretor explicando contrato para clientes brasileiros em notebook, escritório moderno, ambiente iluminado, ultra alta resolução",
    "Foto profissional imobiliária, calendário com datas marcadas para visitas ao imóvel, mesa organizada, escritório iluminado, ultra alta resolução",
    "Foto profissional imobiliária, casal brasileiro no banco discutindo opções de financiamento, bancário profissional, interior moderno e iluminado, ultra alta resolução",
    "Foto profissional imobiliária, cena de vistoria do imóvel com corretor fazendo anotações, interior de apartamento modesto, luz natural do dia, ultra alta resolução",
    "Foto profissional imobiliária, tablet digital mostrando listagem de imóveis, mãos navegando, fundo de escritório moderno, luz brilhante, ultra alta resolução",
  ],
  stories: [
    "Foto profissional imobiliária, família brasileira emocionada recebendo chaves da primeira casa, lágrimas de alegria, dia ensolarado brilhante, ultra alta resolução",
    "Foto profissional imobiliária, cena de mudança com caixas e móveis, família feliz, interior iluminado, ultra alta resolução",
    "Foto profissional imobiliária, avó mostrando casa nova para netos, momento emocionante, interior aconchegante, luz natural quente, ultra alta resolução",
    "Foto profissional imobiliária, jovem profissional brasileiro comemorando compra do primeiro apartamento sozinho, expressão feliz, apartamento modesto e moderno, ultra alta resolução",
    "Foto profissional imobiliária, família brasileira de várias gerações em frente à casa nova, expressões orgulhosas, dia ensolarado, cenário residencial, ultra alta resolução",
    "Foto profissional imobiliária, casal desempacotando caixas na casa nova, clima animado e feliz, luz natural pelas janelas, ultra alta resolução",
    "Foto profissional imobiliária, família brasileira pendurando primeiro porta-retrato na casa nova, momento emocionante, interior aconchegante, iluminação quente, ultra alta resolução",
  ],
  institutional: [
    "Foto corporativa profissional, interior de escritório de imobiliária moderna, design profissional e limpo, iluminação natural brilhante, ultra alta resolução",
    "Foto corporativa profissional, equipe de corretores de imóveis em sala de reunião, grupo diverso, escritório moderno, atmosfera iluminada, ultra alta resolução",
    "Foto corporativa profissional, recepção de empresa imobiliária com parede de logo, design acolhedor, luz natural brilhante, ultra alta resolução",
    "Foto corporativa profissional, corretor apertando mão de cliente satisfeito, fundo de escritório profissional, ambiente iluminado, ultra alta resolução",
    "Foto corporativa profissional, sessão de treinamento imobiliário com corretores fazendo anotações, sala de conferência moderna, iluminação brilhante, ultra alta resolução",
    "Foto corporativa profissional, cerimônia de premiação para corretores de destaque, ambiente profissional, atmosfera iluminada, ultra alta resolução",
    "Foto corporativa profissional, escritório imobiliário com vista da cidade pelas janelas, design interior moderno, luz natural do dia, ultra alta resolução",
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
    
    // Adicionar variação ao prompt
    const variations = [
      ", proporção 16:9, fotorrealista",
      ", foto grande angular, fotografia profissional",
      ", iluminação cinematográfica, alta qualidade",
      ", estilo editorial de fotografia",
      ", fotografia lifestyle, sensação autêntica",
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
