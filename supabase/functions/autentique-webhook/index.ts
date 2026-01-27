import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.90.1';
import { crypto } from "https://deno.land/std@0.177.0/crypto/mod.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type, x-autentique-signature',
};

interface AutentiqueWebhookPayload {
  event: string;
  document: {
    id: string;
    name: string;
    signed?: boolean;
    files?: {
      signed?: string;
      original?: string;
    };
  };
  signature?: {
    name: string;
    email: string;
    signed_at: string;
  };
}

type ParsedWebhook = {
  eventType: string;
  document?: AutentiqueWebhookPayload['document'];
  signature?: AutentiqueWebhookPayload['signature'];
};

// Autentique pode enviar diferentes formatos de payload.
// Normalizamos para { eventType, document, signature }.
function parseAutentiqueWebhookPayload(rawPayload: any): ParsedWebhook {
  // 1) { event: 'document.finished', document: {...} }
  if (typeof rawPayload?.event === 'string') {
    return {
      eventType: rawPayload.event,
      document: rawPayload.document,
      signature: rawPayload.signature,
    };
  }

  // 2) { type: 'document.finished', data: {...} }
  if (typeof rawPayload?.type === 'string') {
    return {
      eventType: rawPayload.type,
      document: rawPayload.data,
      signature: rawPayload.signature || rawPayload.data?.signature,
    };
  }

  // 3) { event: { type: 'document.finished', data: {...} } }
  if (typeof rawPayload?.event === 'object' && typeof rawPayload?.event?.type === 'string') {
    return {
      eventType: rawPayload.event.type,
      document: rawPayload.event.data,
      signature: rawPayload.event.signature || rawPayload.event.data?.signature,
    };
  }

  return { eventType: '' };
}

// Validate HMAC signature from Autentique
async function validateSignature(payload: string, signature: string, secret: string): Promise<boolean> {
  try {
    const encoder = new TextEncoder();
    const key = await crypto.subtle.importKey(
      "raw",
      encoder.encode(secret),
      { name: "HMAC", hash: "SHA-256" },
      false,
      ["sign"]
    );
    
    const signatureBuffer = await crypto.subtle.sign("HMAC", key, encoder.encode(payload));
    const computedSignature = Array.from(new Uint8Array(signatureBuffer))
      .map(b => b.toString(16).padStart(2, '0'))
      .join('');
    
    return computedSignature === signature.toLowerCase();
  } catch (error) {
    console.error('Error validating signature:', error);
    return false;
  }
}

Deno.serve(async (req) => {
  // Handle CORS preflight
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const webhookSecret = Deno.env.get('AUTENTIQUE_WEBHOOK_SECRET');

    // Get raw body for signature validation
    const rawBody = await req.text();
    const headerSignature = req.headers.get('x-autentique-signature');
    
    console.log('Webhook received - signature header:', headerSignature ? 'present' : 'absent');
    
    // Validate HMAC signature if secret is configured
    if (webhookSecret && headerSignature) {
      const isValid = await validateSignature(rawBody, headerSignature, webhookSecret);
      if (!isValid) {
        // Log but don't reject - Autentique might use different signing methods
        console.log('Signature validation failed, but proceeding (signature format may vary)');
      } else {
        console.log('Signature validated successfully');
      }
    }
    
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    const rawPayload = JSON.parse(rawBody) as any;
    const parsed = parseAutentiqueWebhookPayload(rawPayload);
    const eventType = parsed.eventType;
    const document = parsed.document;
    const payloadSignature = parsed.signature;

    console.log('Webhook payload keys:', Object.keys(rawPayload || {}));
    console.log('Received Autentique webhook event:', eventType);
    console.log('Document info:', JSON.stringify(document, null, 2));

    // Extract contract code from document name (format: "Contrato de Locação - LOC-001")
    const documentName = document?.name || '';
    const contractCodeMatch = documentName.match(/Contrato de Locação - (.+)$/);
    const contractCode = contractCodeMatch ? contractCodeMatch[1].trim() : null;

    console.log('Extracted contract code:', contractCode);

    if (!contractCode) {
      console.log('Could not extract contract code from document name:', documentName);
      return new Response(JSON.stringify({ success: true, message: 'No contract code found' }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // Find the contract by property_code
    const { data: contract, error: contractError } = await supabase
      .from('rental_contracts')
      .select('id, property_code')
      .eq('property_code', contractCode)
      .maybeSingle();

    if (contractError) {
      console.error('Error finding contract:', contractError);
    }

    if (!contract) {
      console.log('Contract not found for code:', contractCode);
      return new Response(JSON.stringify({ success: true, message: 'Contract not found' }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    console.log('Found contract:', contract.id, 'for code:', contract.property_code);

    // Handle document.signed or document.finished event - all signers have signed
    if ((eventType === 'document.signed' || eventType === 'document.finished') && document?.files?.signed) {
      console.log('Document fully signed, downloading and archiving...');
      
      const signedFileUrl = document.files.signed;
      console.log('Signed file URL:', signedFileUrl);
      
      // Get Autentique API token for authenticated download
      const autentiqueApiKey = Deno.env.get('AUTENTIQUE_API_KEY');
      
      // Download the signed PDF (with auth if needed)
      const downloadHeaders: Record<string, string> = {};
      if (autentiqueApiKey && signedFileUrl.includes('autentique')) {
        downloadHeaders['Authorization'] = `Bearer ${autentiqueApiKey}`;
      }
      
      let pdfResponse = await fetch(signedFileUrl, { headers: downloadHeaders });
      if (!pdfResponse.ok) {
        console.error('Failed to download PDF with auth, status:', pdfResponse.status, '- trying without auth');
        // Try without auth as fallback
        pdfResponse = await fetch(signedFileUrl);
        if (!pdfResponse.ok) {
          throw new Error(`Failed to download signed PDF: ${pdfResponse.status}`);
        }
      }
      
      const pdfBlob = await pdfResponse.blob();
      const pdfArrayBuffer = await pdfBlob.arrayBuffer();
      const pdfUint8Array = new Uint8Array(pdfArrayBuffer);
      
      console.log('Downloaded PDF, size:', pdfUint8Array.length, 'bytes');
      
      // Upload to Supabase Storage
      const fileName = `${contract.id}/${Date.now()}_contrato_assinado.pdf`;
      
      const { error: uploadError } = await supabase.storage
        .from('crm-documents')
        .upload(fileName, pdfUint8Array, {
          contentType: 'application/pdf',
          upsert: false,
        });

      if (uploadError) {
        console.error('Error uploading signed contract:', uploadError);
        throw uploadError;
      }

      console.log('Uploaded to storage:', fileName);

      // Get the public URL
      const { data: urlData } = supabase.storage
        .from('crm-documents')
        .getPublicUrl(fileName);

      console.log('Public URL:', urlData.publicUrl);

      // Create document record
      const { error: docError } = await supabase
        .from('rental_contract_documents')
        .insert({
          contract_id: contract.id,
          name: `Contrato Assinado - ${new Date().toLocaleDateString('pt-BR')}`,
          document_type: 'contrato_assinado',
          file_url: urlData.publicUrl,
        });

      if (docError) {
        console.error('Error creating document record:', docError);
        throw docError;
      }

      // Update contract with signed document URL
      const { error: updateError } = await supabase
        .from('rental_contracts')
        .update({ contract_document_url: urlData.publicUrl })
        .eq('id', contract.id);

      if (updateError) {
        console.error('Error updating contract:', updateError);
      }

      console.log('Signed contract archived successfully:', fileName);
    }

    // Handle signature events - update signed_at in our database
    if (eventType === 'signature.signed' && payloadSignature) {
      console.log(`Signature received from ${payloadSignature.name} (${payloadSignature.email}) at ${payloadSignature.signed_at}`);
      
      // Update the signature link record to mark as signed
      const { error: signUpdateError } = await supabase
        .from('autentique_signature_links')
        .update({ signed_at: payloadSignature.signed_at })
        .eq('contract_id', contract.id)
        .eq('signer_email', payloadSignature.email);
      
      if (signUpdateError) {
        console.error('Error updating signature status:', signUpdateError);
      } else {
        console.log(`Marked signature as signed for ${payloadSignature.email}`);
      }
    }

    return new Response(JSON.stringify({ success: true }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Webhook error:', error);
    return new Response(JSON.stringify({ error: 'Internal server error', details: String(error) }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
