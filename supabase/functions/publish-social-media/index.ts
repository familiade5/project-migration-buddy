const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const GRAPH_API = "https://graph.facebook.com/v25.0";

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    const META_ACCESS_TOKEN = Deno.env.get("META_ACCESS_TOKEN");
    if (!META_ACCESS_TOKEN) {
      throw new Error("META_ACCESS_TOKEN não configurado");
    }

    const INSTAGRAM_BUSINESS_ACCOUNT_ID = Deno.env.get("INSTAGRAM_BUSINESS_ACCOUNT_ID");
    if (!INSTAGRAM_BUSINESS_ACCOUNT_ID) {
      throw new Error("INSTAGRAM_BUSINESS_ACCOUNT_ID não configurado");
    }

    const { image_url, caption } = await req.json();

    if (!image_url || typeof image_url !== "string") {
      return new Response(
        JSON.stringify({ error: "image_url é obrigatório" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    if (!caption || typeof caption !== "string") {
      return new Response(
        JSON.stringify({ error: "caption é obrigatório" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const results: Record<string, unknown> = {};

    // ========== 1. INSTAGRAM ==========
    // Step 1a: Create media container
    const containerRes = await fetch(
      `${GRAPH_API}/${INSTAGRAM_BUSINESS_ACCOUNT_ID}/media`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          image_url,
          caption,
          access_token: META_ACCESS_TOKEN,
        }),
      }
    );
    const containerData = await containerRes.json();

    if (containerData.error) {
      results.instagram = { success: false, error: containerData.error };
    } else {
      // Step 1b: Publish container
      const publishRes = await fetch(
        `${GRAPH_API}/${INSTAGRAM_BUSINESS_ACCOUNT_ID}/media_publish`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            creation_id: containerData.id,
            access_token: META_ACCESS_TOKEN,
          }),
        }
      );
      const publishData = await publishRes.json();

      if (publishData.error) {
        results.instagram = { success: false, error: publishData.error };
      } else {
        results.instagram = { success: true, id: publishData.id };
      }
    }

    // ========== 2. FACEBOOK ==========
    // Use the FACEBOOK_PAGE_ID env var if available, otherwise try to discover it
    let fbPageId = Deno.env.get("FACEBOOK_PAGE_ID");
    let fbPageToken = META_ACCESS_TOKEN;

    if (!fbPageId) {
      // Try /me/accounts to get page info (works with User Tokens)
      const accountsRes = await fetch(
        `${GRAPH_API}/me/accounts?fields=id,name,access_token&access_token=${META_ACCESS_TOKEN}`
      );
      const accountsData = await accountsRes.json();

      if (accountsData.data && accountsData.data.length > 0) {
        const page = accountsData.data[0];
        fbPageId = page.id;
        fbPageToken = page.access_token;
      } else {
        // Token might be a Page Token - try /me to get page ID
        const meRes = await fetch(
          `${GRAPH_API}/me?fields=id,name&access_token=${META_ACCESS_TOKEN}`
        );
        const meData = await meRes.json();
        if (meData.id) {
          fbPageId = meData.id;
        }
      }
    }

    if (!fbPageId) {
      results.facebook = {
        success: false,
        error: "Não foi possível identificar a página do Facebook. Configure FACEBOOK_PAGE_ID.",
      };
    } else {
      // Post photo to Facebook Page using /{page-id}/photos
      const fbRes = await fetch(
        `${GRAPH_API}/${fbPageId}/photos`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            url: image_url,
            message: caption,
            access_token: fbPageToken,
          }),
        }
      );
      const fbData = await fbRes.json();

      if (fbData.error) {
        results.facebook = { success: false, error: fbData.error };
      } else {
        results.facebook = { success: true, id: fbData.id };
      }
    }

    return new Response(JSON.stringify(results), {
      status: 200,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Erro desconhecido";
    console.error("publish-social-media error:", message);
    return new Response(JSON.stringify({ error: message }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});