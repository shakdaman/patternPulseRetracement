# Deploy ORB Scanner to Supabase - Quick Guide

**Your Project ID:** `aihoazkzytaprtcpgfwx`

---

## Option 1: Deploy via Supabase Dashboard (EASIEST - 5 minutes)

### Step 1: Create Database Table

1. Go to: https://supabase.com/dashboard/project/aihoazkzytaprtcpgfwx/editor
2. Click **SQL Editor** (left sidebar)
3. Click **New Query**
4. Copy and paste this SQL:

```sql
-- ============================================================================
-- ORB Alerts Table
-- ============================================================================

CREATE TABLE public.orb_alerts (
    id BIGSERIAL PRIMARY KEY,
    event_timestamp BIGINT NOT NULL,
    ticker VARCHAR(20) NOT NULL,
    chart_timeframe VARCHAR(10) NOT NULL,
    event_type VARCHAR(50) NOT NULL,
    direction VARCHAR(10) NOT NULL,
    current_price DECIMAL(12, 4) NOT NULL,
    orb_high DECIMAL(12, 4) NOT NULL,
    orb_low DECIMAL(12, 4) NOT NULL,
    orb_midpoint DECIMAL(12, 4) NOT NULL,
    orb_size DECIMAL(12, 6) NOT NULL,
    orb_size_percent DECIMAL(8, 4),
    breakout_distance DECIMAL(12, 6),
    breakout_distance_percent DECIMAL(8, 4),
    orb_duration_minutes INTEGER NOT NULL,
    session_start VARCHAR(4) NOT NULL,
    volume DECIMAL(20, 2),
    breakout_up_occurred BOOLEAN DEFAULT FALSE,
    breakout_down_occurred BOOLEAN DEFAULT FALSE,
    retest_up_confirmed BOOLEAN DEFAULT FALSE,
    retest_down_confirmed BOOLEAN DEFAULT FALSE,
    scanner_symbol_count INTEGER,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()),
    raw_payload JSONB,
    CONSTRAINT orb_alerts_direction_check CHECK (direction IN ('LONG', 'SHORT'))
);

-- Create indexes for fast queries
CREATE INDEX idx_orb_alerts_ticker ON public.orb_alerts(ticker);
CREATE INDEX idx_orb_alerts_event_timestamp ON public.orb_alerts(event_timestamp DESC);
CREATE INDEX idx_orb_alerts_event_type ON public.orb_alerts(event_type);
CREATE INDEX idx_orb_alerts_created_at ON public.orb_alerts(created_at DESC);
CREATE INDEX idx_orb_alerts_ticker_timestamp ON public.orb_alerts(ticker, event_timestamp DESC);
```

5. Click **Run** (or press F5)
6. You should see: "Success. No rows returned"

### Step 2: Deploy Edge Function

1. Go to: https://supabase.com/dashboard/project/aihoazkzytaprtcpgfwx/functions
2. Click **Create a new function**
3. **Function name:** `orb-webhook`
4. **Delete the default code** and paste this:

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

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

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
    return `Invalid event_type: ${payload.event_type}`;
  }
  return null;
}

function validateDirection(payload: ORBAlert): string | null {
  if (!["LONG", "SHORT"].includes(payload.direction)) {
    return `Invalid direction: ${payload.direction}`;
  }
  return null;
}

serve(async (req: Request) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    const supabaseUrl = Deno.env.get("SUPABASE_URL");
    const supabaseKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");

    if (!supabaseUrl || !supabaseKey) {
      return new Response(
        JSON.stringify({ success: false, error: "Server configuration error" }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const supabase = createClient(supabaseUrl, supabaseKey);

    let payload: ORBAlert;
    try {
      payload = await req.json();
    } catch (e) {
      return new Response(
        JSON.stringify({ success: false, error: "Invalid JSON payload" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

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
          { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
    }

    console.log(`ORB Alert: ${payload.ticker} - ${payload.event_type} @ ${payload.current_price}`);

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
      .select();

    if (error) {
      console.error("Database error:", error);
      return new Response(
        JSON.stringify({ success: false, error: "Database error", message: error.message }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    console.log(`✅ ORB alert stored: ${payload.ticker} (ID: ${data[0].id})`);
    
    return new Response(
      JSON.stringify({
        success: true,
        data: data[0],
        message: `ORB alert for ${payload.ticker} recorded successfully`
      }),
      { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );

  } catch (error) {
    console.error("Error:", error);
    return new Response(
      JSON.stringify({ success: false, error: "Internal server error" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
```

5. Click **Deploy**
6. Wait for deployment (should take 30-60 seconds)
7. **Copy your webhook URL:** `https://aihoazkzytaprtcpgfwx.supabase.co/functions/v1/orb-webhook`

### Step 3: Test the Webhook

1. Open PowerShell in your project directory
2. Edit `orb/test-webhook.ps1`:
   - Line 7: Set `$SUPABASE_URL = "https://aihoazkzytaprtcpgfwx.supabase.co"`
   - Line 8: Set `$SUPABASE_ANON_KEY = "YOUR_ANON_KEY"`
     - Get your anon key from: https://supabase.com/dashboard/project/aihoazkzytaprtcpgfwx/settings/api

3. Run test:
```powershell
.\orb\test-webhook.ps1
```

4. You should see green checkmarks (✓) for successful tests

### Step 4: Configure TradingView

1. Open TradingView
2. Add `Pattern Pulse ORB Scanner` to any chart (recommend 5-minute)
3. Configure symbols in settings (10-15 tickers, one per line)
4. Create Alert:
   - Click Alert button (⏰)
   - Condition: "Pattern Pulse ORB Scanner"
   - Webhook URL: `https://aihoazkzytaprtcpgfwx.supabase.co/functions/v1/orb-webhook`
   - Frequency: Once Per Bar Close
   - Create

### Step 5: Verify Data Flow

1. Wait for market hours (9:30 AM - 4:00 PM ET)
2. Check Supabase table: https://supabase.com/dashboard/project/aihoazkzytaprtcpgfwx/editor
3. Run: `SELECT * FROM orb_alerts ORDER BY created_at DESC LIMIT 10;`
4. You should see live ORB events!

---

## Option 2: Install Supabase CLI (Alternative)

If you want to use the CLI for future deployments:

### Install with Chocolatey (if you have it):
```powershell
choco install supabase
```

### Or install Scoop first, then Supabase:
```powershell
# Install Scoop
Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser
Invoke-RestMethod -Uri https://get.scoop.sh | Invoke-Expression

# Install Supabase CLI
scoop bucket add supabase https://github.com/supabase/scoop-bucket.git
scoop install supabase
```

### Then deploy:
```powershell
supabase login
supabase functions deploy orb-webhook --project-ref aihoazkzytaprtcpgfwx
```

---

## Quick Links for Your Project

- **Dashboard:** https://supabase.com/dashboard/project/aihoazkzytaprtcpgfwx
- **SQL Editor:** https://supabase.com/dashboard/project/aihoazkzytaprtcpgfwx/editor
- **Edge Functions:** https://supabase.com/dashboard/project/aihoazkzytaprtcpgfwx/functions
- **API Settings:** https://supabase.com/dashboard/project/aihoazkzytaprtcpgfwx/settings/api
- **Function Logs:** https://supabase.com/dashboard/project/aihoazkzytaprtcpgfwx/functions/orb-webhook/logs

**Webhook URL:** `https://aihoazkzytaprtcpgfwx.supabase.co/functions/v1/orb-webhook`

---

## ✅ Checklist

- [ ] Create `orb_alerts` table in Supabase
- [ ] Deploy `orb-webhook` Edge Function
- [ ] Test webhook with `test-webhook.ps1`
- [ ] Add scanner to TradingView chart
- [ ] Create TradingView alert with webhook URL
- [ ] Verify data appearing in Supabase during market hours

---

**Need help?** Check `docs/ORB_Scanner_Quick_Start.md` for detailed troubleshooting!

