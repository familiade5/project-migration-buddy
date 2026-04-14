const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const GRAPH_API = "https://graph.facebook.com/v25.0";

/**
 * Polls the container status until it's FINISHED (ready to publish).
 * Instagram needs time to process uploaded media before it can be published.
 */
const waitForContainerReady = async (
  containerId: string,
  accessToken: string,
  maxAttempts = 30,
  intervalMs = 2000,
): Promise<void> => {
  for (let i = 0; i < maxAttempts; i++) {
    const res = await fetch(
      `${GRAPH_API}/${containerId}?fields=status_code,status&access_token=${accessToken}`,
    );
    const data = await res.json();

    if (data.status_code === "FINISHED") return;
    if (data.status_code === "ERROR") {
      throw new Error(
        `Container ${containerId} falhou: ${data.status || "erro desconhecido"}`,
      );
    }

    // IN_PROGRESS — wait and retry
    await new Promise((r) => setTimeout(r, intervalMs));
  }

  throw new Error(`Container ${containerId} não ficou pronto a tempo.`);
};

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

    const body = await req.json();

    // Support both single image (image_url) and carousel (image_urls)
    const imageUrls: string[] = Array.isArray(body.image_urls)
      ? body.image_urls
      : body.image_url
        ? [body.image_url]
        : [];
    const caption: string = body.caption || "";

    if (imageUrls.length === 0) {
      return new Response(
        JSON.stringify({ error: "image_url ou image_urls é obrigatório" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } },
      );
    }

    if (!caption || typeof caption !== "string") {
      return new Response(
        JSON.stringify({ error: "caption é obrigatório" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } },
      );
    }

    const results: Record<string, unknown> = {};

    // ========== INSTAGRAM ==========
    try {
      if (imageUrls.length === 1) {
        // ── Single image post ──
        console.log("Publishing single image to Instagram...");

        const containerRes = await fetch(
          `${GRAPH_API}/${INSTAGRAM_BUSINESS_ACCOUNT_ID}/media`,
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              image_url: imageUrls[0],
              caption,
              access_token: META_ACCESS_TOKEN,
            }),
          },
        );
        const containerData = await containerRes.json();

        if (containerData.error) {
          results.instagram = { success: false, error: containerData.error };
        } else {
          await waitForContainerReady(containerData.id, META_ACCESS_TOKEN);

          const publishRes = await fetch(
            `${GRAPH_API}/${INSTAGRAM_BUSINESS_ACCOUNT_ID}/media_publish`,
            {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                creation_id: containerData.id,
                access_token: META_ACCESS_TOKEN,
              }),
            },
          );
          const publishData = await publishRes.json();

          if (publishData.error) {
            results.instagram = { success: false, error: publishData.error };
          } else {
            results.instagram = { success: true, id: publishData.id };
          }
        }
      } else {
        // ── Carousel post ──
        console.log(`Publishing carousel with ${imageUrls.length} images to Instagram...`);

        // Step 1: Create individual item containers (no caption on children)
        const childrenIds: string[] = [];

        for (let i = 0; i < imageUrls.length; i++) {
          console.log(`Creating child container ${i + 1}/${imageUrls.length}...`);

          const childRes = await fetch(
            `${GRAPH_API}/${INSTAGRAM_BUSINESS_ACCOUNT_ID}/media`,
            {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                image_url: imageUrls[i],
                is_carousel_item: true,
                access_token: META_ACCESS_TOKEN,
              }),
            },
          );
          const childData = await childRes.json();

          if (childData.error) {
            console.error(`Child container ${i + 1} error:`, JSON.stringify(childData.error));
            throw new Error(
              childData.error.error_user_msg ||
                childData.error.message ||
                `Erro ao criar item ${i + 1} do carrossel`,
            );
          }

          // Wait for each child to finish processing
          await waitForContainerReady(childData.id, META_ACCESS_TOKEN);
          childrenIds.push(childData.id);
        }

        console.log("All children ready. Creating carousel container...");

        // Step 2: Create carousel container
        const carouselRes = await fetch(
          `${GRAPH_API}/${INSTAGRAM_BUSINESS_ACCOUNT_ID}/media`,
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              media_type: "CAROUSEL",
              children: childrenIds.join(","),
              caption,
              access_token: META_ACCESS_TOKEN,
            }),
          },
        );
        const carouselData = await carouselRes.json();

        if (carouselData.error) {
          console.error("Carousel container error:", JSON.stringify(carouselData.error));
          results.instagram = { success: false, error: carouselData.error };
        } else {
          await waitForContainerReady(carouselData.id, META_ACCESS_TOKEN);

          console.log("Publishing carousel...");

          // Step 3: Publish carousel
          const publishRes = await fetch(
            `${GRAPH_API}/${INSTAGRAM_BUSINESS_ACCOUNT_ID}/media_publish`,
            {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                creation_id: carouselData.id,
                access_token: META_ACCESS_TOKEN,
              }),
            },
          );
          const publishData = await publishRes.json();

          if (publishData.error) {
            console.error("Carousel publish error:", JSON.stringify(publishData.error));
            results.instagram = { success: false, error: publishData.error };
          } else {
            console.log("Carousel published successfully:", publishData.id);
            results.instagram = {
              success: true,
              id: publishData.id,
              type: "carousel",
              slides: imageUrls.length,
            };
          }
        }
      }
    } catch (igError) {
      const igMessage = igError instanceof Error ? igError.message : "Erro no Instagram";
      console.error("Instagram error:", igMessage);
      results.instagram = { success: false, error: igMessage };
    }

    // ========== FACEBOOK (desativado) ==========
    results.facebook = {
      success: false,
      skipped: true,
      reason: "Publicação no Facebook desativada; envio somente para Instagram.",
    };

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
