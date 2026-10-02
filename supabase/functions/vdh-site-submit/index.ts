import { createClient } from "npm:@supabase/supabase-js@2";
import { corsHeaders } from "npm:@supabase/supabase-js@2/cors";
import { z } from "npm:zod@3";

// Recebe pedidos de pré-análise do site público e cria o caso no CC VDH.
const DOC_KINDS = ["identidade", "renda", "residencia", "outros", "compositor"] as const;

const UploadSchema = z.object({
  action: z.literal("upload_urls"),
  files: z.array(z.object({
    kind: z.enum(DOC_KINDS),
    name: z.string().min(1).max(160),
  })).min(1).max(12),
});

const SubmitSchema = z.object({
  action: z.literal("submit"),
  batch: z.string().uuid(),
  property_code: z.string().regex(/^\d{6,20}$/).optional().nullable(),
  full_name: z.string().trim().min(3).max(120),
  cpf: z.string().trim().max(20).optional().default(""),
  email: z.string().trim().email().max(255).optional().or(z.literal("")),
  phone: z.string().trim().min(8).max(25),
  birth_date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/).optional().or(z.literal("")),
  marital_status: z.string().max(40).optional().default(""),
  monthly_income: z.number().min(0).max(10_000_000),
  income_type: z.string().max(40).optional().default(""),
  uses_fgts: z.boolean().default(false),
  has_coborrower: z.boolean().default(false),
  coborrower_name: z.string().max(120).optional().default(""),
  coborrower_income: z.number().min(0).max(10_000_000).optional().nullable(),
  city: z.string().max(80).optional().default(""),
  uf: z.string().max(2).optional().default(""),
  consent: z.literal(true),
  documents: z.array(z.object({ kind: z.enum(DOC_KINDS), name: z.string().max(160), path: z.string().max(300) })).max(12),
});

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: corsHeaders });
  const json = (b: unknown, status = 200) => new Response(JSON.stringify(b), { status, headers: { ...corsHeaders, "Content-Type": "application/json" } });
  try {
    const supabase = createClient(Deno.env.get("SUPABASE_URL")!, Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!);
    const raw = await req.json().catch(() => null);

    if (raw?.action === "upload_urls") {
      const p = UploadSchema.safeParse(raw);
      if (!p.success) return json({ success: false, error: "Arquivos inválidos" }, 400);
      const batch = crypto.randomUUID();
      const out = [];
      for (const [i, f] of p.data.files.entries()) {
        const ext = (f.name.split(".").pop() || "bin").toLowerCase().replace(/[^a-z0-9]/g, "").slice(0, 5) || "bin";
        const path = `${batch}/${f.kind}-${i + 1}.${ext}`;
        const { data, error } = await supabase.storage.from("vdh-site-docs").createSignedUploadUrl(path);
        if (error) throw error;
        out.push({ kind: f.kind, name: f.name, path, token: data.token });
      }
      return json({ success: true, batch, uploads: out });
    }

    const p = SubmitSchema.safeParse(raw);
    if (!p.success) return json({ success: false, error: "Confira os campos do formulário", details: p.error.flatten().fieldErrors }, 400);
    const d = p.data;
    if (d.documents.some((doc) => !doc.path.startsWith(`${d.batch}/`))) return json({ success: false, error: "Documento inválido" }, 400);

    let snapshot = null;
    if (d.property_code) {
      const { data: prop } = await supabase.from("vdh_site_properties").select("*").eq("code", d.property_code).maybeSingle();
      snapshot = prop;
    }
    const { data: lead, error } = await supabase.from("vdh_cc_leads").insert({
      full_name: d.full_name, cpf: d.cpf || null, email: d.email || null, phone: d.phone,
      birth_date: d.birth_date || null, marital_status: d.marital_status || null,
      monthly_income: d.monthly_income, income_type: d.income_type || null, uses_fgts: d.uses_fgts,
      has_coborrower: d.has_coborrower, coborrower_name: d.coborrower_name || null, coborrower_income: d.coborrower_income ?? null,
      city: snapshot?.city || d.city || null, uf: snapshot?.uf || d.uf || null,
      property_code: d.property_code || null, property_snapshot: snapshot,
      documents: d.documents, stage: d.documents.length ? "documentacao" : "novo", consent_at: new Date().toISOString(),
    }).select("id").single();
    if (error) throw error;
    await supabase.from("vdh_cc_lead_history").insert({ lead_id: lead.id, to_stage: d.documents.length ? "documentacao" : "novo", note: "Pedido enviado pelo site", user_name: "Site" });
    return json({ success: true, id: lead.id });
  } catch (e) {
    console.error("vdh-site-submit", e);
    return json({ success: false, error: "Não foi possível enviar agora. Tente novamente." }, 500);
  }
});
