import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.45.0';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

const META_API_VERSION = 'v21.0';
const MASTER_EMAIL = 'neto@vendadiretahoje.com.br';

interface InsightRow {
  date_start: string;
  date_stop: string;
  spend?: string;
  impressions?: string;
  reach?: string;
  clicks?: string;
  cpm?: string;
  cpc?: string;
  ctr?: string;
  actions?: { action_type: string; value: string }[];
  cost_per_action_type?: { action_type: string; value: string }[];
}

const sumAction = (actions: InsightRow['actions'], types: string[]) => {
  if (!actions) return 0;
  return actions
    .filter((a) => types.includes(a.action_type))
    .reduce((s, a) => s + Number(a.value || 0), 0);
};

const LEAD_TYPES = [
  'lead',
  'onsite_conversion.lead_grouped',
  'offsite_conversion.fb_pixel_lead',
  'leadgen.other',
];
const MSG_TYPES = [
  'onsite_conversion.messaging_conversation_started_7d',
  'onsite_conversion.total_messaging_connection',
  'onsite_conversion.messaging_first_reply',
];

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') return new Response(null, { headers: corsHeaders });

  try {
    // Auth: only master admin
    const authHeader = req.headers.get('Authorization');
    if (!authHeader) {
      return new Response(JSON.stringify({ error: 'Missing auth' }), {
        status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL')!,
      Deno.env.get('SUPABASE_ANON_KEY')!,
      { global: { headers: { Authorization: authHeader } } }
    );
    const { data: userData } = await supabase.auth.getUser();
    if (!userData?.user || userData.user.email !== MASTER_EMAIL) {
      return new Response(JSON.stringify({ error: 'Forbidden' }), {
        status: 403, headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const token = Deno.env.get('META_ACCESS_TOKEN');
    let adAccountId = Deno.env.get('AM_AD_ACCOUNT_ID') || '';
    if (!token || !adAccountId) {
      return new Response(JSON.stringify({ error: 'Missing META_ACCESS_TOKEN or AM_AD_ACCOUNT_ID' }), {
        status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }
    // Normalize: extract digits only and prepend act_
    const digits = adAccountId.replace(/\D/g, '');
    if (!digits) {
      return new Response(JSON.stringify({ error: 'AM_AD_ACCOUNT_ID inválido (sem dígitos)' }), {
        status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }
    adAccountId = `act_${digits}`;

    const url = new URL(req.url);
    const preset = url.searchParams.get('preset') || 'last_7d';
    const presetMap: Record<string, string> = {
      today: 'today',
      yesterday: 'yesterday',
      last_7d: 'last_7d',
      last_30d: 'last_30d',
      this_month: 'this_month',
      last_month: 'last_month',
    };
    const datePreset = presetMap[preset] || 'last_7d';

    const fields = [
      'spend', 'impressions', 'reach', 'clicks', 'cpm', 'cpc', 'ctr',
      'actions', 'cost_per_action_type',
    ].join(',');

    // Daily series
    const dailyUrl = `https://graph.facebook.com/${META_API_VERSION}/${adAccountId}/insights?fields=${fields}&date_preset=${datePreset}&time_increment=1&level=account&access_token=${token}`;
    // Aggregated totals
    const totalUrl = `https://graph.facebook.com/${META_API_VERSION}/${adAccountId}/insights?fields=${fields}&date_preset=${datePreset}&level=account&access_token=${token}`;

    const [dailyRes, totalRes] = await Promise.all([fetch(dailyUrl), fetch(totalUrl)]);
    const dailyJson = await dailyRes.json();
    const totalJson = await totalRes.json();

    if (dailyJson.error || totalJson.error) {
      return new Response(JSON.stringify({ error: dailyJson.error || totalJson.error }), {
        status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const dailyRows: InsightRow[] = dailyJson.data || [];
    const totals: InsightRow = (totalJson.data || [])[0] || { date_start: '', date_stop: '' };

    const series = dailyRows.map((r) => ({
      date: r.date_start,
      spend: Number(r.spend || 0),
      impressions: Number(r.impressions || 0),
      reach: Number(r.reach || 0),
      clicks: Number(r.clicks || 0),
      leads: sumAction(r.actions, LEAD_TYPES),
      messages: sumAction(r.actions, MSG_TYPES),
    }));

    const totalLeads = sumAction(totals.actions, LEAD_TYPES);
    const totalMessages = sumAction(totals.actions, MSG_TYPES);
    const totalSpend = Number(totals.spend || 0);

    const kpis = {
      spend: totalSpend,
      impressions: Number(totals.impressions || 0),
      reach: Number(totals.reach || 0),
      clicks: Number(totals.clicks || 0),
      cpm: Number(totals.cpm || 0),
      cpc: Number(totals.cpc || 0),
      ctr: Number(totals.ctr || 0),
      leads: totalLeads,
      messages: totalMessages,
      cpl: totalLeads > 0 ? totalSpend / totalLeads : 0,
      cpMsg: totalMessages > 0 ? totalSpend / totalMessages : 0,
      dateStart: totals.date_start,
      dateStop: totals.date_stop,
    };

    return new Response(JSON.stringify({ kpis, series, preset: datePreset }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (e) {
    console.error('am-ads-insights error', e);
    return new Response(JSON.stringify({ error: String(e) }), {
      status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});