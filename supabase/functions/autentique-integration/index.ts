import { Hono } from 'https://deno.land/x/hono@v3.11.7/mod.ts';
import { cors } from 'https://deno.land/x/hono@v3.11.7/middleware/cors/index.ts';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.90.1';

interface SignatureLink {
  contract_id: string;
  document_id: string;
  public_id: string;
  signer_name: string;
  signer_email: string;
  short_link: string | null;
}

// Use basePath to handle the function name prefix in routes
const app = new Hono().basePath('/autentique-integration');

// Enable CORS
app.use('*', cors({
  origin: '*',
  allowHeaders: ['authorization', 'x-client-info', 'apikey', 'content-type'],
}));

const AUTENTIQUE_API_URL = 'https://api.autentique.com.br/v2/graphql';

interface SignerInput {
  email: string;
  name: string;
  // Autentique ActionEnum não inclui WITNESS (gera erro 400)
  action: 'SIGN' | 'APPROVE';
}

interface CreateDocumentInput {
  name: string;
  content_base64: string;
  signers: SignerInput[];
  sandbox?: boolean;
}

// Helper: Generate signing link for a signature using createLinkToSignature mutation
async function generateSigningLink(publicId: string, autentiqueApiKey: string): Promise<string | null> {
  try {
    const mutation = `
      mutation {
        createLinkToSignature(public_id: "${publicId}") {
          short_link
        }
      }
    `;

    const response = await fetch(AUTENTIQUE_API_URL, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${autentiqueApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ query: mutation }),
    });

    const result = await response.json();
    
    if (result.errors) {
      console.error(`Error generating link for ${publicId}:`, result.errors);
      return null;
    }

    return result.data?.createLinkToSignature?.short_link || null;
  } catch (error) {
    console.error(`Error generating link for ${publicId}:`, error);
    return null;
  }
}

// Create document for signature
app.post('/create-document', async (c) => {
  try {
    const authHeader = c.req.header('Authorization');
    if (!authHeader?.startsWith('Bearer ')) {
      return c.json({ error: 'Unauthorized' }, 401);
    }

    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseKey = Deno.env.get('SUPABASE_ANON_KEY')!;
    const autentiqueApiKey = Deno.env.get('AUTENTIQUE_API_KEY');

    if (!autentiqueApiKey) {
      console.error('AUTENTIQUE_API_KEY not configured');
      return c.json({ error: 'Autentique API key not configured' }, 500);
    }

    const supabase = createClient(supabaseUrl, supabaseKey, {
      global: { headers: { Authorization: authHeader } },
    });

    // Verify user
    const token = authHeader.replace('Bearer ', '');
    const { data: userData, error: authError } = await supabase.auth.getUser(token);
    if (authError || !userData.user) {
      return c.json({ error: 'Invalid token' }, 401);
    }

    const body: CreateDocumentInput & { contract_id?: string } = await c.req.json();
    const { name, content_base64, signers, sandbox = false, contract_id } = body;

    if (!name || !content_base64 || !signers || signers.length === 0) {
      return c.json({ error: 'Missing required fields: name, content_base64, signers' }, 400);
    }

    console.log(`Creating document: ${name} with ${signers.length} signers${contract_id ? ` for contract ${contract_id}` : ''}`);

    // GraphQL mutation to create document - request link { short_link }
    const mutation = `
      mutation CreateDocument(
        $document: DocumentInput!,
        $signers: [SignerInput!]!,
        $file: Upload!
      ) {
        createDocument(
          sandbox: ${sandbox},
          document: $document,
          signers: $signers,
          file: $file
        ) {
          id
          name
          created_at
          signatures {
            public_id
            name
            email
            signed {
              created_at
            }
            link {
              short_link
            }
          }
        }
      }
    `;

    // Prepare form data for file upload
    const formData = new FormData();
    
    const operations = JSON.stringify({
      query: mutation,
      variables: {
        document: { name },
        signers: signers.map(s => ({
          email: s.email,
          action: s.action,
          name: s.name,
        })),
        file: null,
      },
    });
    
    formData.append('operations', operations);
    formData.append('map', JSON.stringify({ '0': ['variables.file'] }));
    
    // Convert base64 to blob
    const binaryString = atob(content_base64);
    const bytes = new Uint8Array(binaryString.length);
    for (let i = 0; i < binaryString.length; i++) {
      bytes[i] = binaryString.charCodeAt(i);
    }
    const blob = new Blob([bytes], { type: 'application/pdf' });
    formData.append('0', blob, `${name}.pdf`);

    const response = await fetch(AUTENTIQUE_API_URL, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${autentiqueApiKey}`,
      },
      body: formData,
    });

    const result = await response.json();

    if (result.errors) {
      console.error('Autentique API errors:', result.errors);
      return c.json({ error: 'Failed to create document', details: result.errors }, 400);
    }

    const createdDoc = result.data.createDocument;
    console.log('Document created successfully:', createdDoc.id);

    // For each signature without a link, generate one using createLinkToSignature
    if (createdDoc.signatures) {
      for (const sig of createdDoc.signatures) {
        const shortLink = sig.link?.short_link;
        console.log(`Signer: ${sig.name} (${sig.email}) - Link from create: ${shortLink || 'null'}`);
        
        // If link is null and signature is not yet signed, generate link
        if (!shortLink && !sig.signed) {
          console.log(`Generating link for ${sig.email} using createLinkToSignature...`);
          const generatedLink = await generateSigningLink(sig.public_id, autentiqueApiKey);
          if (generatedLink) {
            sig.link = { short_link: generatedLink };
            console.log(`Generated link for ${sig.email}: ${generatedLink}`);
          } else {
            console.log(`Could not generate link for ${sig.email}`);
          }
        }
      }
    }

    // Save signature links to database if contract_id provided
    if (contract_id && createdDoc.signatures) {
      const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
      const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey);
      
      // Delete existing links for this contract
      await supabaseAdmin
        .from('autentique_signature_links')
        .delete()
        .eq('contract_id', contract_id);
      
      // Insert new links
      const linksToInsert: SignatureLink[] = createdDoc.signatures.map((sig: any) => ({
        contract_id,
        document_id: createdDoc.id,
        public_id: sig.public_id,
        signer_name: sig.name,
        signer_email: sig.email,
        short_link: sig.link?.short_link || null,
      }));
      
      const { error: insertError } = await supabaseAdmin
        .from('autentique_signature_links')
        .insert(linksToInsert);
      
      if (insertError) {
        console.error('Error saving signature links:', insertError);
      } else {
        console.log(`Saved ${linksToInsert.length} signature links to database`);
      }
    }

    return c.json({
      success: true,
      document: createdDoc,
    });
  } catch (error) {
    console.error('Error creating document:', error);
    return c.json({ error: 'Internal server error' }, 500);
  }
});

// Get document status with full details including signature links
app.get('/document/:id', async (c) => {
  try {
    const authHeader = c.req.header('Authorization');
    if (!authHeader?.startsWith('Bearer ')) {
      return c.json({ error: 'Unauthorized' }, 401);
    }

    const autentiqueApiKey = Deno.env.get('AUTENTIQUE_API_KEY');
    if (!autentiqueApiKey) {
      return c.json({ error: 'Autentique API key not configured' }, 500);
    }

    const documentId = c.req.param('id');

    // Query document with full signature details including link
    const query = `
      query {
        document(id: "${documentId}") {
          id
          name
          created_at
          signatures {
            public_id
            name
            email
            signed {
              created_at
            }
            link {
              short_link
            }
          }
        }
      }
    `;

    const response = await fetch(AUTENTIQUE_API_URL, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${autentiqueApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ query }),
    });

    const result = await response.json();

    if (result.errors) {
      console.error('Autentique API errors:', result.errors);
      return c.json({ error: 'Failed to get document', details: result.errors }, 400);
    }

    const doc = result.data.document;

    // For signatures without a link that haven't signed yet, generate links
    if (doc?.signatures) {
      for (const sig of doc.signatures) {
        if (!sig.link?.short_link && !sig.signed) {
          console.log(`Generating link for unsigned signer ${sig.email}...`);
          const generatedLink = await generateSigningLink(sig.public_id, autentiqueApiKey);
          if (generatedLink) {
            sig.link = { short_link: generatedLink };
          }
        }
      }
    }

    return c.json({
      success: true,
      document: doc,
    });
  } catch (error) {
    console.error('Error getting document:', error);
    return c.json({ error: 'Internal server error' }, 500);
  }
});

// Resend signature emails
app.post('/resend-signatures', async (c) => {
  try {
    const authHeader = c.req.header('Authorization');
    if (!authHeader?.startsWith('Bearer ')) {
      return c.json({ error: 'Unauthorized' }, 401);
    }

    const autentiqueApiKey = Deno.env.get('AUTENTIQUE_API_KEY');
    if (!autentiqueApiKey) {
      return c.json({ error: 'Autentique API key not configured' }, 500);
    }

    const { public_ids } = await c.req.json();

    if (!public_ids || !Array.isArray(public_ids) || public_ids.length === 0) {
      return c.json({ error: 'Missing required field: public_ids (array)' }, 400);
    }

    const idsString = public_ids.map((id: string) => `"${id}"`).join(', ');
    const mutation = `
      mutation {
        resendSignatures(public_ids: [${idsString}])
      }
    `;

    const response = await fetch(AUTENTIQUE_API_URL, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${autentiqueApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ query: mutation }),
    });

    const result = await response.json();

    if (result.errors) {
      console.error('Autentique API errors:', result.errors);
      return c.json({ error: 'Failed to resend signatures', details: result.errors }, 400);
    }

    return c.json({
      success: true,
      result: result.data?.resendSignatures,
    });
  } catch (error) {
    console.error('Error resending signatures:', error);
    return c.json({ error: 'Internal server error' }, 500);
  }
});

// Health check
app.get('/health', (c) => {
  return c.json({ status: 'ok', service: 'autentique-integration' });
});

Deno.serve(app.fetch);
