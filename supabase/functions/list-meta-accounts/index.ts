const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: corsHeaders });
  const token = Deno.env.get("META_ACCESS_TOKEN");
  const res = await fetch(
    `https://graph.facebook.com/v25.0/me/accounts?fields=id,name,instagram_business_account{id,username}&limit=100&access_token=${token}`,
  );
  const data = await res.json();
  return new Response(JSON.stringify(data), {
    headers: { ...corsHeaders, "Content-Type": "application/json" },
  });
});
