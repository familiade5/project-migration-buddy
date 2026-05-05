const cors = { "Access-Control-Allow-Origin": "*", "Access-Control-Allow-Headers": "*" };
Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: cors });
  const token = Deno.env.get("META_ACCESS_TOKEN")!;
  const amIg = Deno.env.get("AM_INSTAGRAM_BUSINESS_ACCOUNT_ID")!;
  const amFb = Deno.env.get("AM_FACEBOOK_PAGE_ID")!;
  const vdhIg = Deno.env.get("INSTAGRAM_BUSINESS_ACCOUNT_ID")!;
  const vdhFb = Deno.env.get("FACEBOOK_PAGE_ID")!;
  const G = "https://graph.facebook.com/v25.0";
  const get = async (url: string) => {
    const r = await fetch(url);
    return { status: r.status, body: await r.json() };
  };
  const result = {
    token_debug: await get(`${G}/debug_token?input_token=${token}&access_token=${token}`),
    me: await get(`${G}/me?access_token=${token}`),
    am_ig: await get(`${G}/${amIg}?fields=id,username&access_token=${token}`),
    am_fb: await get(`${G}/${amFb}?fields=id,name&access_token=${token}`),
    vdh_ig: await get(`${G}/${vdhIg}?fields=id,username&access_token=${token}`),
    vdh_fb: await get(`${G}/${vdhFb}?fields=id,name&access_token=${token}`),
    am_ids: { ig: amIg, fb: amFb },
    vdh_ids: { ig: vdhIg, fb: vdhFb },
  };
  return new Response(JSON.stringify(result, null, 2), { headers: { ...cors, "Content-Type": "application/json" } });
});
