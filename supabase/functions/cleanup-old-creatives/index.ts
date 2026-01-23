import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

Deno.serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
    
    const supabase = createClient(supabaseUrl, supabaseServiceKey)

    // Calculate 24 hours ago
    const twentyFourHoursAgo = new Date()
    twentyFourHoursAgo.setHours(twentyFourHoursAgo.getHours() - 24)
    const cutoffTime = twentyFourHoursAgo.toISOString()

    console.log(`Cleaning up creatives older than: ${cutoffTime}`)

    // Delete creatives older than 24 hours
    const { data, error, count } = await supabase
      .from('creatives')
      .delete()
      .lt('created_at', cutoffTime)
      .select('id')

    if (error) {
      console.error('Error deleting old creatives:', error)
      throw error
    }

    const deletedCount = data?.length || 0
    console.log(`Successfully deleted ${deletedCount} old creatives`)

    return new Response(
      JSON.stringify({ 
        success: true, 
        deleted: deletedCount,
        cutoff: cutoffTime 
      }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200 
      }
    )
  } catch (error: unknown) {
    console.error('Cleanup error:', error)
    const errorMessage = error instanceof Error ? error.message : 'Unknown error'
    return new Response(
      JSON.stringify({ error: errorMessage }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500 
      }
    )
  }
})
