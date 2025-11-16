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

import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.38.4";

// ============================================================================
// TYPE DEFINITIONS
// ============================================================================

interface ORBAlert {
  alert_type: string;
  event_timestamp: number;
  ticker: string;
  chart_timeframe: string;
  event_type: string;
  direction: string;
  current_price: number;
  orb_high: number;
  orb_low: number;
  orb_midpoint: number;
  orb_size: number;
  orb_size_percent: number;
  breakout_distance: number;
  breakout_distance_percent: number;
  orb_duration_minutes: number;
  session_start: string;
  volume: number;
  breakout_up_occurred: boolean;
  breakout_down_occurred: boolean;
  retest_up_confirmed: boolean;
  retest_down_confirmed: boolean;
  scanner_symbol_count: number;
}

// ============================================================================
// CORS HEADERS
// ============================================================================

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

// ============================================================================
// VALIDATION FUNCTIONS
// ============================================================================

function validateRequiredFields(payload: ORBAlert): string | null {
  const required = ["ticker", "event_type", "event_timestamp"];
  
  for (const field of required) {
    if (!payload[field as keyof ORBAlert]) {
      return `Missing required field: ${field}`;
    }
  }
  
  return null;
}

function validateAlertType(payload: ORBAlert): string | null {
  if (payload.alert_type !== "orb") {
    return `Invalid alert_type: ${payload.alert_type}. Expected 'orb'.`;
  }
  return null;
}

function validateEventType(payload: ORBAlert): string | null {
  const validEventTypes = [
    "orb_breakout_up",
    "orb_breakout_down",
    "orb_retest_up_confirmed",
    "orb_retest_down_confirmed"
  ];
  
  if (!validEventTypes.includes(payload.event_type)) {
    return `Invalid event_type: ${payload.event_type}. Must be one of: ${validEventTypes.join(", ")}`;
  }
  return null;
}

function validateDirection(payload: ORBAlert): string | null {
  if (!["LONG", "SHORT"].includes(payload.direction)) {
    return `Invalid direction: ${payload.direction}. Must be LONG or SHORT.`;
  }
  return null;
}

// ============================================================================
// MAIN HANDLER
// ============================================================================

serve(async (req: Request) => {
  // Handle preflight requests
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    // Initialize Supabase client with service role key (bypasses RLS)
    const supabaseUrl = Deno.env.get("SUPABASE_URL");
    const supabaseKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");

    if (!supabaseUrl || !supabaseKey) {
      console.error("Missing environment variables");
      return new Response(
        JSON.stringify({
          success: false,
          error: "Server configuration error: Missing Supabase credentials"
        }),
        {
          status: 500,
          headers: { ...corsHeaders, "Content-Type": "application/json" }
        }
      );
    }

    const supabase = createClient(supabaseUrl, supabaseKey);

    // Parse incoming webhook data
    let payload: ORBAlert;
    try {
      payload = await req.json();
    } catch (e) {
      return new Response(
        JSON.stringify({
          success: false,
          error: "Invalid JSON payload",
          details: e.message
        }),
        {
          status: 400,
          headers: { ...corsHeaders, "Content-Type": "application/json" }
        }
      );
    }

    // Validate payload
    const validations = [
      validateRequiredFields(payload),
      validateAlertType(payload),
      validateEventType(payload),
      validateDirection(payload)
    ];

    for (const error of validations) {
      if (error) {
        return new Response(
          JSON.stringify({ success: false, error }),
          {
            status: 400,
            headers: { ...corsHeaders, "Content-Type": "application/json" }
          }
        );
      }
    }

    // Log incoming alert (helpful for debugging)
    console.log(`ORB Alert received: ${payload.ticker} - ${payload.event_type} @ ${payload.current_price}`);

    // Insert into orb_alerts table
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
        raw_payload: payload,  // Store full payload for debugging
      })
      .select();

    if (error) {
      console.error("Database insert error:", error);
      return new Response(
        JSON.stringify({
          success: false,
          error: "Database error",
          message: error.message,
          details: error.details,
          hint: error.hint
        }),
        {
          status: 500,
          headers: { ...corsHeaders, "Content-Type": "application/json" }
        }
      );
    }

    // Success response
    console.log(`✅ ORB alert stored successfully: ${payload.ticker} (ID: ${data[0].id})`);
    
    return new Response(
      JSON.stringify({
        success: true,
        data: data[0],
        message: `ORB alert for ${payload.ticker} (${payload.event_type}) recorded successfully`
      }),
      {
        status: 200,
        headers: { ...corsHeaders, "Content-Type": "application/json" }
      }
    );

  } catch (error) {
    console.error("Unexpected error:", error);
    return new Response(
      JSON.stringify({
        success: false,
        error: "Internal server error",
        message: error.message || "Unknown error occurred"
      }),
      {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" }
      }
    );
  }
});

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

