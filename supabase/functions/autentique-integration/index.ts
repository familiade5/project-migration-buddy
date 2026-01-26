import { Hono } from 'https://deno.land/x/hono@v3.11.7/mod.ts';
import { cors } from 'https://deno.land/x/hono@v3.11.7/middleware/cors/index.ts';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.90.1';

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
  action: 'SIGN' | 'WITNESS' | 'APPROVE';
}

interface CreateDocumentInput {
  name: string;
  content_base64: string;
  signers: SignerInput[];
  sandbox?: boolean;
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

    const body: CreateDocumentInput = await c.req.json();
    const { name, content_base64, signers, sandbox = false } = body;

    if (!name || !content_base64 || !signers || signers.length === 0) {
      return c.json({ error: 'Missing required fields: name, content_base64, signers' }, 400);
    }

    console.log(`Creating document: ${name} with ${signers.length} signers`);

    // GraphQL mutation to create document
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

    console.log('Document created successfully:', result.data.createDocument.id);

    return c.json({
      success: true,
      document: result.data.createDocument,
    });
  } catch (error) {
    console.error('Error creating document:', error);
    return c.json({ error: 'Internal server error' }, 500);
  }
});

// Get document status
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

    return c.json({
      success: true,
      document: result.data.document,
    });
  } catch (error) {
    console.error('Error getting document:', error);
    return c.json({ error: 'Internal server error' }, 500);
  }
});

// Health check
app.get('/health', (c) => {
  return c.json({ status: 'ok', service: 'autentique-integration' });
});

Deno.serve(app.fetch);
