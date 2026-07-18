import { corsHeaders } from 'npm:@supabase/supabase-js@2/cors';

const LOVABLE_API_KEY = Deno.env.get('LOVABLE_API_KEY');

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') return new Response('ok', { headers: corsHeaders });
  try {
    if (!LOVABLE_API_KEY) throw new Error('LOVABLE_API_KEY não configurada');
    const { data } = await req.json();
    if (!data) throw new Error('data obrigatório');

    const prompt = `Você é um copywriter especialista em imóveis de alto padrão. Gere textos em português (Brasil), com linguagem emocional, elegante e persuasiva — foco em experiência de morar e sensações — SEM clichês baratos ("realize seu sonho", "não perca essa oportunidade"). Escreva com sofisticação.

Dados do imóvel:
${JSON.stringify(data, null, 2)}

Responda APENAS um JSON válido no formato:
{
  "heroHeadline": "título curto e impactante (máx 60 caracteres)",
  "heroSubtitle": "subtítulo elegante com localização e sensação (máx 100 caracteres)",
  "description": "3 parágrafos curtos e emocionais sobre morar aqui — luz, espaços, rotina, vizinhança. Sem listar features técnicas.",
  "benefits": ["6 diferenciais objetivos e curtos (máx 60 chars cada), incluindo condomínio e localização"],
  "ctaText": "microtexto do botão WhatsApp (máx 30 chars)"
}`;

    const resp = await fetch('https://ai.gateway.lovable.dev/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Lovable-API-Key': LOVABLE_API_KEY,
      },
      body: JSON.stringify({
        model: 'google/gemini-3-flash-preview',
        messages: [{ role: 'user', content: prompt }],
        response_format: { type: 'json_object' },
      }),
    });

    if (!resp.ok) {
      const t = await resp.text();
      console.error('AI gateway error', resp.status, t);
      return new Response(JSON.stringify({ error: 'AI failed', status: resp.status, details: t }), {
        status: resp.status, headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }
    const j = await resp.json();
    const content = j?.choices?.[0]?.message?.content || '{}';
    let copy: any = {};
    try { copy = JSON.parse(content); } catch { copy = { description: content }; }

    return new Response(JSON.stringify({ copy }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (e: any) {
    console.error('generate-landing-copy error', e);
    return new Response(JSON.stringify({ error: e.message }), {
      status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});