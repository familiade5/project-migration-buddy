const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};
const G = "https://graph.facebook.com/v25.0";

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: corsHeaders });
  const token = Deno.env.get("META_ACCESS_TOKEN");
  const get = async (p: string) => {
    const r = await fetch(`${G}/${p}${p.includes("?") ? "&" : "?"}access_token=${token}`);
    return await r.json();
  };
  const me = await get("me?fields=id,name");
  const businesses = await get("me/businesses?fields=id,name&limit=50");
  const out: Record<string, unknown> = { me, businesses };
  const list = (businesses?.data ?? []) as Array<{ id: string; name: string }>;
  for (const b of list) {
    out[`pages_${b.id}`] = await get(
      `${b.id}/owned_pages?fields=id,name,instagram_business_account{id,username}&limit=100`,
    );
    out[`igs_${b.id}`] = await get(
      `${b.id}/owned_instagram_accounts?fields=id,username&limit=100`,
    );
    out[`client_igs_${b.id}`] = await get(
      `${b.id}/client_instagram_accounts?fields=id,username&limit=100`,
    );
  }
  return new Response(JSON.stringify(out), {
    headers: { ...corsHeaders, "Content-Type": "application/json" },
  });
});
