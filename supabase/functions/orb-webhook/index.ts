// ============================================================================
// Supabase Edge Function: orb-webhook
// Receives ORB alerts from TradingView and stores them in Supabase
// ============================================================================
// 
// Deployment Instructions:
// 1. Place this file at: supabase/functions/orb-webhook/index.ts
// 2. Deploy with: supabase functions deploy orb-webhook --project-ref YOUR_PROJECT_REF
// 3. Set webhook URL in TradingView: https://YOUR-PROJECT.supabase.co/functions/v1/orb-webhook
//
// ============================================================================

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

// ============================================================================
// USAGE EXAMPLES
// ============================================================================

/*

Test with curl:

curl -X POST https://YOUR-PROJECT.supabase.co/functions/v1/orb-webhook \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_ANON_KEY" \
  -d '{
    "alert_type": "orb",
    "event_timestamp": 1730736600000,
    "ticker": "SPY",
    "chart_timeframe": "5",
    "event_type": "orb_breakout_up",
    "direction": "LONG",
    "current_price": 575.82,
    "orb_high": 575.50,
    "orb_low": 574.20,
    "orb_midpoint": 574.85,
    "orb_size": 1.30,
    "orb_size_percent": 0.23,
    "breakout_distance": 0.32,
    "breakout_distance_percent": 24.62,
    "orb_duration_minutes": 30,
    "session_start": "0930",
    "volume": 1250000.50,
    "breakout_up_occurred": true,
    "breakout_down_occurred": false,
    "retest_up_confirmed": false,
    "retest_down_confirmed": false,
    "scanner_symbol_count": 12
  }'

*/

