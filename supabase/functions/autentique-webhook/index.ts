import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.90.1';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
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

Deno.serve(async (req) => {
  // Handle CORS preflight
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    const payload: AutentiqueWebhookPayload = await req.json();
    
    console.log('Received Autentique webhook:', JSON.stringify(payload, null, 2));

    // Extract contract code from document name (format: "Contrato de Locação - LOC-001")
    const documentName = payload.document?.name || '';
    const contractCodeMatch = documentName.match(/Contrato de Locação - (.+)$/);
    const contractCode = contractCodeMatch ? contractCodeMatch[1] : null;

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

    if (contractError || !contract) {
      console.log('Contract not found:', contractCode, contractError);
      return new Response(JSON.stringify({ success: true, message: 'Contract not found' }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    console.log('Found contract:', contract.id);

    // Handle document.signed event - all signers have signed
    if (payload.event === 'document.signed' && payload.document?.files?.signed) {
      console.log('Document fully signed, downloading and archiving...');
      
      const signedFileUrl = payload.document.files.signed;
      
      // Download the signed PDF
      const pdfResponse = await fetch(signedFileUrl);
      if (!pdfResponse.ok) {
        throw new Error(`Failed to download signed PDF: ${pdfResponse.status}`);
      }
      
      const pdfBlob = await pdfResponse.blob();
      const pdfArrayBuffer = await pdfBlob.arrayBuffer();
      const pdfUint8Array = new Uint8Array(pdfArrayBuffer);
      
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

      // Get the public URL
      const { data: urlData } = supabase.storage
        .from('crm-documents')
        .getPublicUrl(fileName);

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
      await supabase
        .from('rental_contracts')
        .update({ contract_document_url: urlData.publicUrl })
        .eq('id', contract.id);

      console.log('Signed contract archived successfully:', fileName);
    }

    // Handle signature events for logging
    if (payload.event === 'signature.signed' && payload.signature) {
      console.log(`Signature received from ${payload.signature.name} (${payload.signature.email}) at ${payload.signature.signed_at}`);
    }

    return new Response(JSON.stringify({ success: true }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Webhook error:', error);
    return new Response(JSON.stringify({ error: 'Internal server error' }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
