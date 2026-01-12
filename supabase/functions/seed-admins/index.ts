import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  try {
    console.log('Starting admin seed process...')
    
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
    
    const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey, {
      auth: {
        autoRefreshToken: false,
        persistSession: false
      }
    })

    const admins = [
      { 
        email: 'neto@vendadiretahoje.com.br', 
        password: '123456', 
        fullName: 'Neto - Admin' 
      },
      { 
        email: 'iury@vendadiretahoje.com.br', 
        password: '@vendadiretahoje', 
        fullName: 'Iury - Admin' 
      }
    ]

    const results = []

    for (const admin of admins) {
      console.log(`Processing admin: ${admin.email}`)
      
      // Check if user already exists
      const { data: existingUsers } = await supabaseAdmin.auth.admin.listUsers()
      const existingUser = existingUsers?.users?.find(u => u.email === admin.email)
      
      let userId: string

      if (existingUser) {
        console.log(`User ${admin.email} already exists, updating role...`)
        userId = existingUser.id
      } else {
        // Create user
        const { data: newUser, error: createError } = await supabaseAdmin.auth.admin.createUser({
          email: admin.email,
          password: admin.password,
          email_confirm: true,
          user_metadata: {
            full_name: admin.fullName,
            temp_password: false
          }
        })

        if (createError) {
          console.error(`Error creating user ${admin.email}:`, createError)
          results.push({ email: admin.email, success: false, error: createError.message })
          continue
        }

        userId = newUser.user!.id
        console.log(`Created user ${admin.email} with id ${userId}`)
      }

      // Check if already has admin role
      const { data: existingRole } = await supabaseAdmin
        .from('user_roles')
        .select('*')
        .eq('user_id', userId)
        .eq('role', 'admin')
        .maybeSingle()

      if (!existingRole) {
        // Add admin role
        const { error: roleError } = await supabaseAdmin
          .from('user_roles')
          .insert({ user_id: userId, role: 'admin' })

        if (roleError) {
          console.error(`Error adding admin role for ${admin.email}:`, roleError)
          results.push({ email: admin.email, success: false, error: roleError.message })
          continue
        }
        console.log(`Added admin role for ${admin.email}`)
      } else {
        console.log(`User ${admin.email} already has admin role`)
      }

      results.push({ email: admin.email, success: true })
    }

    console.log('Admin seed process completed')
    
    return new Response(
      JSON.stringify({ success: true, results }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )

  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error'
    console.error('Seed admins error:', error)
    return new Response(
      JSON.stringify({ success: false, error: errorMessage }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  }
})
