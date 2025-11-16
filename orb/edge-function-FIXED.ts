import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.38.4"

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
}

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders })
  }

  try {
    const supabaseUrl = Deno.env.get("SUPABASE_URL")
    const supabaseKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")

    if (!supabaseUrl || !supabaseKey) {
      return new Response(
        JSON.stringify({ success: false, error: "Server configuration error" }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      )
    }

    const supabase = createClient(supabaseUrl, supabaseKey)

    let payload
    try {
      payload = await req.json()
    } catch (e) {
      return new Response(
        JSON.stringify({ success: false, error: "Invalid JSON" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      )
    }

    // Validate required fields
    if (!payload.ticker || !payload.event_type || !payload.event_timestamp) {
      return new Response(
        JSON.stringify({ success: false, error: "Missing required fields" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      )
    }

    // Validate alert type
    if (payload.alert_type !== "orb") {
      return new Response(
        JSON.stringify({ success: false, error: "Invalid alert_type" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      )
    }

    console.log(`ORB Alert: ${payload.ticker} - ${payload.event_type}`)

    const { data, error } = await supabase
      .from("orb_alerts")
      .insert({
        event_timestamp: payload.event_timestamp,
        ticker: payload.ticker,
        chart_timeframe: payload.chart_timeframe,
        event_type: payload.event_type,
        direction: payload.direction,
        current_price: payload.current_price,
        orb_high: payload.orb_high,
        orb_low: payload.orb_low,
        orb_midpoint: payload.orb_midpoint,
        orb_size: payload.orb_size,
        orb_size_percent: payload.orb_size_percent,
        breakout_distance: payload.breakout_distance,
        breakout_distance_percent: payload.breakout_distance_percent,
        orb_duration_minutes: payload.orb_duration_minutes,
        session_start: payload.session_start,
        volume: payload.volume,
        breakout_up_occurred: payload.breakout_up_occurred,
        breakout_down_occurred: payload.breakout_down_occurred,
        retest_up_confirmed: payload.retest_up_confirmed,
        retest_down_confirmed: payload.retest_down_confirmed,
        scanner_symbol_count: payload.scanner_symbol_count,
        raw_payload: payload,
      })
      .select()

    if (error) {
      console.error("Database error:", error)
      return new Response(
        JSON.stringify({ success: false, error: error.message }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      )
    }

    console.log(`✅ Stored: ${payload.ticker}`)
    
    return new Response(
      JSON.stringify({
        success: true,
        data: data[0],
        message: `ORB alert for ${payload.ticker} recorded successfully`
      }),
      { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    )

  } catch (error) {
    console.error("Error:", error)
    return new Response(
      JSON.stringify({ success: false, error: "Internal error" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    )
  }
})



