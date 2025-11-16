# Pattern Pulse ORB Scanner - Supabase Setup Guide

## Overview
This guide provides complete setup instructions for capturing ORB (Opening Range Breakout) alerts from TradingView and storing them in Supabase.

---

## 1. Supabase Table Schema

### Table: `orb_alerts`

```sql
-- ============================================================================
-- ORB Alerts Table
-- Stores all Opening Range Breakout events from TradingView scanner
-- ============================================================================

CREATE TABLE public.orb_alerts (
    -- Primary Key
    id BIGSERIAL PRIMARY KEY,
    
    -- Event Identification
    event_timestamp BIGINT NOT NULL,  -- Unix timestamp in milliseconds from TradingView
    ticker VARCHAR(20) NOT NULL,
    chart_timeframe VARCHAR(10) NOT NULL,
    event_type VARCHAR(50) NOT NULL,  -- orb_breakout_up, orb_breakout_down, orb_retest_up_confirmed, orb_retest_down_confirmed
    direction VARCHAR(10) NOT NULL,   -- LONG or SHORT
    
    -- Price Data
    current_price DECIMAL(12, 4) NOT NULL,
    orb_high DECIMAL(12, 4) NOT NULL,
    orb_low DECIMAL(12, 4) NOT NULL,
    orb_midpoint DECIMAL(12, 4) NOT NULL,
    orb_size DECIMAL(12, 6) NOT NULL,
    orb_size_percent DECIMAL(8, 4),
    
    -- Breakout Metrics
    breakout_distance DECIMAL(12, 6),
    breakout_distance_percent DECIMAL(8, 4),
    
    -- ORB Configuration
    orb_duration_minutes INTEGER NOT NULL,
    session_start VARCHAR(4) NOT NULL,  -- HHMM format (e.g., "0930")
    
    -- Additional Context
    volume DECIMAL(20, 2),
    breakout_up_occurred BOOLEAN DEFAULT FALSE,
    breakout_down_occurred BOOLEAN DEFAULT FALSE,
    retest_up_confirmed BOOLEAN DEFAULT FALSE,
    retest_down_confirmed BOOLEAN DEFAULT FALSE,
    scanner_symbol_count INTEGER,
    
    -- Metadata
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()),
    raw_payload JSONB,  -- Store original JSON for debugging
    
    -- Indexes for fast queries
    CONSTRAINT orb_alerts_event_timestamp_check CHECK (event_timestamp > 0),
    CONSTRAINT orb_alerts_direction_check CHECK (direction IN ('LONG', 'SHORT'))
);

-- ============================================================================
-- INDEXES for Performance
-- ============================================================================

-- Primary query patterns
CREATE INDEX idx_orb_alerts_ticker ON public.orb_alerts(ticker);
CREATE INDEX idx_orb_alerts_event_timestamp ON public.orb_alerts(event_timestamp DESC);
CREATE INDEX idx_orb_alerts_event_type ON public.orb_alerts(event_type);
CREATE INDEX idx_orb_alerts_direction ON public.orb_alerts(direction);
CREATE INDEX idx_orb_alerts_created_at ON public.orb_alerts(created_at DESC);

-- Composite indexes for common query combinations
CREATE INDEX idx_orb_alerts_ticker_timestamp ON public.orb_alerts(ticker, event_timestamp DESC);
CREATE INDEX idx_orb_alerts_ticker_event_type ON public.orb_alerts(ticker, event_type);
CREATE INDEX idx_orb_alerts_direction_timestamp ON public.orb_alerts(direction, event_timestamp DESC);

-- JSONB index for flexible raw_payload queries
CREATE INDEX idx_orb_alerts_raw_payload ON public.orb_alerts USING GIN(raw_payload);

-- ============================================================================
-- Row Level Security (RLS) - Optional but recommended
-- ============================================================================

ALTER TABLE public.orb_alerts ENABLE ROW LEVEL SECURITY;

-- Policy: Allow service role full access (for Edge Function)
CREATE POLICY "Allow service role full access"
ON public.orb_alerts
FOR ALL
TO service_role
USING (true)
WITH CHECK (true);

-- Policy: Allow authenticated users to read (for frontend)
CREATE POLICY "Allow authenticated users to read"
ON public.orb_alerts
FOR SELECT
TO authenticated
USING (true);

-- Policy: Allow anon users to read recent data (if you want public access)
CREATE POLICY "Allow anon read recent"
ON public.orb_alerts
FOR SELECT
TO anon
USING (created_at > NOW() - INTERVAL '7 days');

-- ============================================================================
-- Helpful Views
-- ============================================================================

-- View: Latest ORB alerts per ticker (last 24 hours)
CREATE OR REPLACE VIEW public.orb_alerts_latest AS
SELECT DISTINCT ON (ticker)
    id,
    ticker,
    event_type,
    direction,
    current_price,
    orb_high,
    orb_low,
    breakout_distance_percent,
    event_timestamp,
    created_at
FROM public.orb_alerts
WHERE created_at > NOW() - INTERVAL '24 hours'
ORDER BY ticker, event_timestamp DESC;

-- View: Breakout summary statistics
CREATE OR REPLACE VIEW public.orb_breakout_stats AS
SELECT
    ticker,
    DATE(TO_TIMESTAMP(event_timestamp / 1000)) as trade_date,
    COUNT(*) FILTER (WHERE event_type = 'orb_breakout_up') as breakouts_up,
    COUNT(*) FILTER (WHERE event_type = 'orb_breakout_down') as breakouts_down,
    COUNT(*) FILTER (WHERE event_type = 'orb_retest_up_confirmed') as retests_up,
    COUNT(*) FILTER (WHERE event_type = 'orb_retest_down_confirmed') as retests_down,
    AVG(orb_size_percent) as avg_orb_size_percent,
    AVG(breakout_distance_percent) as avg_breakout_distance_percent
FROM public.orb_alerts
GROUP BY ticker, DATE(TO_TIMESTAMP(event_timestamp / 1000))
ORDER BY trade_date DESC, ticker;

-- ============================================================================
-- Cleanup Function (optional - delete old data)
-- ============================================================================

CREATE OR REPLACE FUNCTION cleanup_old_orb_alerts()
RETURNS void AS $$
BEGIN
    DELETE FROM public.orb_alerts
    WHERE created_at < NOW() - INTERVAL '90 days';
END;
$$ LANGUAGE plpgsql;

-- Schedule cleanup (requires pg_cron extension)
-- SELECT cron.schedule('cleanup-old-orb-alerts', '0 2 * * *', 'SELECT cleanup_old_orb_alerts();');
```

---

## 2. Supabase Edge Function

### File: `supabase/functions/orb-webhook/index.ts`

```typescript
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.38.4";

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

serve(async (req) => {
  // CORS headers
  const corsHeaders = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  };

  // Handle preflight requests
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    // Initialize Supabase client
    const supabaseUrl = Deno.env.get("SUPABASE_URL") ?? "";
    const supabaseKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "";
    const supabase = createClient(supabaseUrl, supabaseKey);

    // Parse incoming webhook data
    const payload: ORBAlert = await req.json();

    // Validate required fields
    if (!payload.ticker || !payload.event_type || !payload.event_timestamp) {
      return new Response(
        JSON.stringify({ 
          success: false, 
          error: "Missing required fields: ticker, event_type, or event_timestamp" 
        }),
        { 
          status: 400, 
          headers: { ...corsHeaders, "Content-Type": "application/json" } 
        }
      );
    }

    // Validate alert_type
    if (payload.alert_type !== "orb") {
      return new Response(
        JSON.stringify({ 
          success: false, 
          error: "Invalid alert_type. Expected 'orb'." 
        }),
        { 
          status: 400, 
          headers: { ...corsHeaders, "Content-Type": "application/json" } 
        }
      );
    }

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
          error: error.message,
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
    return new Response(
      JSON.stringify({ 
        success: true, 
        data: data,
        message: `ORB alert for ${payload.ticker} (${payload.event_type}) recorded successfully` 
      }),
      { 
        status: 200, 
        headers: { ...corsHeaders, "Content-Type": "application/json" } 
      }
    );

  } catch (error) {
    console.error("Edge function error:", error);
    return new Response(
      JSON.stringify({ 
        success: false, 
        error: error.message || "Unknown error occurred" 
      }),
      { 
        status: 500, 
        headers: { ...corsHeaders, "Content-Type": "application/json" } 
      }
    );
  }
});
```

---

## 3. Test JSON Payloads

### Test 1: ORB Breakout Up (SPY)

```json
{
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
}
```

### Test 2: ORB Breakout Down (QQQ)

```json
{
  "alert_type": "orb",
  "event_timestamp": 1730737200000,
  "ticker": "QQQ",
  "chart_timeframe": "5",
  "event_type": "orb_breakout_down",
  "direction": "SHORT",
  "current_price": 488.15,
  "orb_high": 489.80,
  "orb_low": 488.50,
  "orb_midpoint": 489.15,
  "orb_size": 1.30,
  "orb_size_percent": 0.27,
  "breakout_distance": 0.35,
  "breakout_distance_percent": 26.92,
  "orb_duration_minutes": 30,
  "session_start": "0930",
  "volume": 2150000.75,
  "breakout_up_occurred": false,
  "breakout_down_occurred": true,
  "retest_up_confirmed": false,
  "retest_down_confirmed": false,
  "scanner_symbol_count": 12
}
```

### Test 3: ORB Retest Up Confirmed (IWM)

```json
{
  "alert_type": "orb",
  "event_timestamp": 1730738400000,
  "ticker": "IWM",
  "chart_timeframe": "5",
  "event_type": "orb_retest_up_confirmed",
  "direction": "LONG",
  "current_price": 219.85,
  "orb_high": 219.50,
  "orb_low": 218.80,
  "orb_midpoint": 219.15,
  "orb_size": 0.70,
  "orb_size_percent": 0.32,
  "breakout_distance": 0.35,
  "breakout_distance_percent": 50.00,
  "orb_duration_minutes": 30,
  "session_start": "0930",
  "volume": 850000.25,
  "breakout_up_occurred": true,
  "breakout_down_occurred": false,
  "retest_up_confirmed": true,
  "retest_down_confirmed": false,
  "scanner_symbol_count": 12
}
```

### Test 4: ORB Retest Down Confirmed (DIA)

```json
{
  "alert_type": "orb",
  "event_timestamp": 1730739000000,
  "ticker": "DIA",
  "chart_timeframe": "5",
  "event_type": "orb_retest_down_confirmed",
  "direction": "SHORT",
  "current_price": 432.10,
  "orb_high": 433.50,
  "orb_low": 432.80,
  "orb_midpoint": 433.15,
  "orb_size": 0.70,
  "orb_size_percent": 0.16,
  "breakout_distance": 0.70,
  "breakout_distance_percent": 100.00,
  "orb_duration_minutes": 30,
  "session_start": "0930",
  "volume": 450000.00,
  "breakout_up_occurred": false,
  "breakout_down_occurred": true,
  "retest_up_confirmed": false,
  "retest_down_confirmed": true,
  "scanner_symbol_count": 12
}
```

---

## 4. SQL Test Inserts

### Manual Insert Test (for validation)

```sql
-- Test Insert 1: Breakout Up
INSERT INTO public.orb_alerts (
    event_timestamp, ticker, chart_timeframe, event_type, direction,
    current_price, orb_high, orb_low, orb_midpoint, orb_size, orb_size_percent,
    breakout_distance, breakout_distance_percent, orb_duration_minutes, session_start,
    volume, breakout_up_occurred, breakout_down_occurred, retest_up_confirmed, retest_down_confirmed,
    scanner_symbol_count, raw_payload
) VALUES (
    1730736600000, 'SPY', '5', 'orb_breakout_up', 'LONG',
    575.82, 575.50, 574.20, 574.85, 1.30, 0.23,
    0.32, 24.62, 30, '0930',
    1250000.50, true, false, false, false,
    12, '{"test": true}'::jsonb
);

-- Test Insert 2: Breakout Down
INSERT INTO public.orb_alerts (
    event_timestamp, ticker, chart_timeframe, event_type, direction,
    current_price, orb_high, orb_low, orb_midpoint, orb_size, orb_size_percent,
    breakout_distance, breakout_distance_percent, orb_duration_minutes, session_start,
    volume, breakout_up_occurred, breakout_down_occurred, retest_up_confirmed, retest_down_confirmed,
    scanner_symbol_count, raw_payload
) VALUES (
    1730737200000, 'QQQ', '5', 'orb_breakout_down', 'SHORT',
    488.15, 489.80, 488.50, 489.15, 1.30, 0.27,
    0.35, 26.92, 30, '0930',
    2150000.75, false, true, false, false,
    12, '{"test": true}'::jsonb
);

-- Verify inserts
SELECT 
    id,
    ticker,
    event_type,
    direction,
    current_price,
    orb_high,
    orb_low,
    breakout_distance_percent,
    TO_TIMESTAMP(event_timestamp / 1000) as event_time,
    created_at
FROM public.orb_alerts
ORDER BY created_at DESC
LIMIT 10;
```

---

## 5. TradingView Alert Setup

### Step 1: Add Pine Script to Chart
1. Open TradingView
2. Add "Pattern Pulse ORB Scanner" indicator
3. Configure symbols (10-15 tickers, one per line)
4. Set ORB duration and session start time

### Step 2: Create Alert
1. Click "Alert" button (⏰) in TradingView
2. **Condition**: Select "Pattern Pulse ORB Scanner"
3. **Alert name**: ORB Scanner Webhook
4. **Message**: Leave as `{{strategy.order.alert_message}}` (will use script's JSON)
5. **Webhook URL**: `https://YOUR-PROJECT.supabase.co/functions/v1/orb-webhook`
6. **Frequency**: Once Per Bar Close
7. Click "Create"

### Step 3: Test Alert
- Wait for next bar close or manually trigger by adjusting symbol list
- Check Supabase table for new entries
- Monitor Edge Function logs in Supabase Dashboard

---

## 6. Query Examples for Frontend

### Get Latest ORB Alerts (Last 24 Hours)

```sql
SELECT 
    id,
    ticker,
    event_type,
    direction,
    current_price,
    orb_high,
    orb_low,
    orb_size_percent,
    breakout_distance_percent,
    TO_TIMESTAMP(event_timestamp / 1000) as event_time,
    created_at
FROM public.orb_alerts
WHERE created_at > NOW() - INTERVAL '24 hours'
ORDER BY event_timestamp DESC
LIMIT 50;
```

### Get Breakouts by Ticker

```sql
SELECT 
    ticker,
    COUNT(*) FILTER (WHERE event_type = 'orb_breakout_up') as breakouts_up,
    COUNT(*) FILTER (WHERE event_type = 'orb_breakout_down') as breakouts_down,
    COUNT(*) FILTER (WHERE retest_up_confirmed = true) as retests_up,
    COUNT(*) FILTER (WHERE retest_down_confirmed = true) as retests_down,
    AVG(orb_size_percent) as avg_orb_size,
    MAX(breakout_distance_percent) as max_breakout_distance
FROM public.orb_alerts
WHERE created_at > NOW() - INTERVAL '7 days'
GROUP BY ticker
ORDER BY (breakouts_up + breakouts_down) DESC;
```

### Get Today's ORB Events

```sql
SELECT 
    ticker,
    event_type,
    direction,
    current_price,
    breakout_distance_percent,
    TO_TIMESTAMP(event_timestamp / 1000) AT TIME ZONE 'America/New_York' as event_time_et
FROM public.orb_alerts
WHERE DATE(created_at) = CURRENT_DATE
ORDER BY event_timestamp DESC;
```

---

## 7. Deployment Checklist

- [ ] Run table creation SQL in Supabase SQL Editor
- [ ] Create Edge Function: `supabase functions deploy orb-webhook`
- [ ] Set up RLS policies (if needed)
- [ ] Test Edge Function with curl/Postman
- [ ] Configure TradingView alert with webhook URL
- [ ] Monitor Edge Function logs during market hours
- [ ] Verify data appearing in `orb_alerts` table
- [ ] Build frontend queries to display data
- [ ] Set up data retention policy (optional)

---

## 8. Troubleshooting

### No data appearing in table
- Check Edge Function logs in Supabase Dashboard
- Verify webhook URL is correct
- Check RLS policies (disable temporarily for testing)
- Verify TradingView alert is active

### Duplicate alerts
- Script has hash-based deduplication
- Check if multiple TradingView alerts are configured
- Review `alertHashes` array size (max 1000)

### Edge Function errors
- Verify environment variables are set
- Check for CORS issues
- Validate JSON payload structure matches interface
- Check Supabase service role key permissions

---

## Support

For issues or questions:
1. Check Supabase Edge Function logs
2. Review Pine Script console for errors
3. Validate JSON payload structure
4. Test Edge Function directly with curl before TradingView integration

