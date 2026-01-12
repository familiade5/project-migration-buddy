import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

const TEMP_PASSWORD = '@vendadiretahoje';

Deno.serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    
    // Create admin client with service role key
    const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey, {
      auth: {
        autoRefreshToken: false,
        persistSession: false,
      },
    });

    // Get the authorization header from the request
    const authHeader = req.headers.get('Authorization');
    if (!authHeader) {
      throw new Error('Missing authorization header');
    }

    // Verify the requesting user is an admin
    const supabase = createClient(supabaseUrl, Deno.env.get('SUPABASE_ANON_KEY')!, {
      global: { headers: { Authorization: authHeader } },
    });

    const { data: { user: requestingUser }, error: authError } = await supabase.auth.getUser();
    if (authError || !requestingUser) {
      throw new Error('Unauthorized');
    }

    // Check if requesting user is admin
    const { data: adminRole } = await supabaseAdmin
      .from('user_roles')
      .select('role')
      .eq('user_id', requestingUser.id)
      .eq('role', 'admin')
      .single();

    if (!adminRole) {
      throw new Error('Only admins can manage users');
    }

    const { action, userId, role } = await req.json();

    console.log(`Admin ${requestingUser.email} performing action: ${action} on user: ${userId}`);

    switch (action) {
      case 'delete': {
        // Delete user from auth (this will cascade to profiles due to trigger)
        const { error: deleteError } = await supabaseAdmin.auth.admin.deleteUser(userId);
        if (deleteError) {
          console.error('Error deleting user:', deleteError);
          throw deleteError;
        }
        console.log(`User ${userId} deleted successfully`);
        return new Response(
          JSON.stringify({ success: true, message: 'User deleted' }),
          { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }

      case 'reset-password': {
        // Reset password to temporary password
        const { error: updateError } = await supabaseAdmin.auth.admin.updateUserById(userId, {
          password: TEMP_PASSWORD,
          user_metadata: { temp_password: true },
        });
        if (updateError) {
          console.error('Error resetting password:', updateError);
          throw updateError;
        }

        // Update profile to mark temp_password
        await supabaseAdmin
          .from('profiles')
          .update({ temp_password: true })
          .eq('id', userId);

        console.log(`Password reset for user ${userId}`);
        return new Response(
          JSON.stringify({ success: true, message: 'Password reset', tempPassword: TEMP_PASSWORD }),
          { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }

      case 'set-role': {
        if (role === 'admin') {
          // Add admin role (upsert to avoid duplicates)
          const { error: insertError } = await supabaseAdmin
            .from('user_roles')
            .upsert({ user_id: userId, role: 'admin' }, { onConflict: 'user_id,role' });
          
          if (insertError) {
            console.error('Error adding admin role:', insertError);
            throw insertError;
          }
          console.log(`User ${userId} promoted to admin`);
        } else {
          // Remove admin role
          const { error: deleteError } = await supabaseAdmin
            .from('user_roles')
            .delete()
            .eq('user_id', userId)
            .eq('role', 'admin');
          
          if (deleteError) {
            console.error('Error removing admin role:', deleteError);
            throw deleteError;
          }
          console.log(`Admin role removed from user ${userId}`);
        }
        return new Response(
          JSON.stringify({ success: true, message: `Role set to ${role}` }),
          { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }

      default:
        throw new Error(`Unknown action: ${action}`);
    }
  } catch (error: unknown) {
    const err = error as Error;
    console.error('Error in manage-user function:', err);
    return new Response(
      JSON.stringify({ error: err.message }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 400,
      }
    );
  }
});
