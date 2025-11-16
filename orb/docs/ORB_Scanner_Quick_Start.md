# Pattern Pulse ORB Scanner - Quick Start Guide

## 🚀 5-Minute Setup

### Prerequisites
- TradingView account (any plan)
- Supabase project
- Basic understanding of TradingView alerts

---

## Step 1: Deploy Supabase Infrastructure (2 minutes)

### A. Create Database Table

1. Open Supabase Dashboard → SQL Editor
2. Run this SQL:

```sql
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

CREATE INDEX idx_orb_alerts_ticker ON public.orb_alerts(ticker);
CREATE INDEX idx_orb_alerts_event_timestamp ON public.orb_alerts(event_timestamp DESC);
CREATE INDEX idx_orb_alerts_created_at ON public.orb_alerts(created_at DESC);
```

### B. Deploy Edge Function

1. Install Supabase CLI (if not installed):
```bash
npm install -g supabase
```

2. Login to Supabase:
```bash
supabase login
```

3. Create function directory:
```bash
mkdir -p supabase/functions/orb-webhook
```

4. Copy the Edge Function code from `ORB_Scanner_Supabase_Setup.md` to `supabase/functions/orb-webhook/index.ts`

5. Deploy:
```bash
supabase functions deploy orb-webhook --project-ref YOUR_PROJECT_REF
```

6. Note your webhook URL:
```
https://YOUR-PROJECT.supabase.co/functions/v1/orb-webhook
```

---

## Step 2: Configure TradingView Scanner (1 minute)

### A. Add Indicator to Chart

1. Open TradingView → Any chart (e.g., SPY, 5-minute)
2. Click "Indicators" → Search "Pattern Pulse ORB Scanner"
3. Add to chart

### B. Configure Symbol List

In indicator settings, add your symbols (one per line):

```
SPY
QQQ
IWM
DIA
AAPL
MSFT
GOOGL
AMZN
TSLA
NVDA
META
NFLX
```

**Note**: Max 15 symbols recommended (stays under 40 API call limit)

### C. Adjust Settings

- **Opening Range Duration**: 30 minutes (default)
- **Session Start**: 0930 (9:30 AM ET)
- **Enable Breakout Alerts**: ✅
- **Enable Retest Alerts**: ✅
- **Show Scanner Dashboard**: ✅ (see status in top-right)

---

## Step 3: Create TradingView Alert (1 minute)

1. Click the **Alert** button (⏰) in TradingView
2. **Condition**: "Pattern Pulse ORB Scanner"
3. **Alert name**: `ORB Multi-Symbol Webhook`
4. **Message**: Leave as default (uses script's JSON)
5. **Webhook URL**: `https://YOUR-PROJECT.supabase.co/functions/v1/orb-webhook`
6. **Frequency**: "Once Per Bar Close"
7. Click **Create**

---

## Step 4: Verify Data Flow (1 minute)

### A. Check Scanner Dashboard

Look at top-right corner of TradingView chart:

```
┌─────────────────────────┐
│ ORB Scanner Status      │
├─────────────────────────┤
│ Symbols      12/12      │ ← Should show your symbol count
│ API Calls    24/40      │ ← Should be under 40
│ ORB Duration 30m @ 0930 │
│ Breakout Alerts ON      │
│ Retest Alerts ON (+2 bars)│
│ Total Alerts 0          │ ← Will increment when events fire
│   ↳ Breakouts 0         │
│   ↳ Retests   0         │
└─────────────────────────┘
```

### B. Test with Manual Insert

Run this in Supabase SQL Editor to verify table works:

```sql
INSERT INTO public.orb_alerts (
    event_timestamp, ticker, chart_timeframe, event_type, direction,
    current_price, orb_high, orb_low, orb_midpoint, orb_size, orb_size_percent,
    breakout_distance, breakout_distance_percent, orb_duration_minutes, session_start,
    volume, breakout_up_occurred, scanner_symbol_count
) VALUES (
    1730736600000, 'TEST', '5', 'orb_breakout_up', 'LONG',
    100.50, 100.00, 99.00, 99.50, 1.00, 1.00,
    0.50, 50.00, 30, '0930',
    1000000, true, 12
);

-- Verify
SELECT * FROM public.orb_alerts ORDER BY created_at DESC LIMIT 5;
```

### C. Wait for Live Alert

- Market must be open (9:30 AM - 4:00 PM ET)
- Wait for a symbol to break its 30-minute opening range
- Check Supabase → Edge Functions → Logs for webhook calls
- Check `orb_alerts` table for new rows

---

## Understanding ORB Events

### Event Types

| Event Type | Description | When It Fires |
|-----------|-------------|---------------|
| `orb_breakout_up` | Price closes above ORB high | First bar close above opening range high |
| `orb_breakout_down` | Price closes below ORB low | First bar close below opening range low |
| `orb_retest_up_confirmed` | Bullish retest confirmed | Price dips to ORB high, then bounces back up |
| `orb_retest_down_confirmed` | Bearish retest confirmed | Price rises to ORB low, then bounces back down |

### Opening Range Definition

- **Duration**: First 30 minutes of trading (9:30 AM - 10:00 AM ET)
- **Range**: Highest high and lowest low during this period
- **Breakout**: Price closes outside this range

### Direction Field

- `LONG`: Bullish signal (breakout up or retest up)
- `SHORT`: Bearish signal (breakout down or retest down)

---

## Example Alert Flow

### 9:30 AM - 10:00 AM
- **SPY** forms opening range: High = $575.50, Low = $574.20
- Scanner stores these levels

### 10:15 AM
- **SPY** closes at $575.82 (above $575.50)
- 🔔 **Alert fires**: `orb_breakout_up`
- JSON payload sent to Supabase:
```json
{
  "ticker": "SPY",
  "event_type": "orb_breakout_up",
  "direction": "LONG",
  "current_price": 575.82,
  "orb_high": 575.50,
  "breakout_distance": 0.32,
  "breakout_distance_percent": 24.62
}
```

### 10:45 AM
- **SPY** dips to $575.45 (touches ORB high)
- Then closes at $575.92 (bounces back up)
- 🔔 **Alert fires**: `orb_retest_up_confirmed`

---

## Frontend Integration

### Fetch Latest Alerts (JavaScript/TypeScript)

```typescript
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  'https://YOUR-PROJECT.supabase.co',
  'YOUR_ANON_KEY'
)

// Get latest ORB alerts (last 24 hours)
const { data, error } = await supabase
  .from('orb_alerts')
  .select('*')
  .gte('created_at', new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString())
  .order('event_timestamp', { ascending: false })
  .limit(50)

console.log(data)
```

### Real-time Subscription

```typescript
// Subscribe to new ORB alerts in real-time
const subscription = supabase
  .channel('orb-alerts-channel')
  .on(
    'postgres_changes',
    {
      event: 'INSERT',
      schema: 'public',
      table: 'orb_alerts'
    },
    (payload) => {
      console.log('New ORB alert:', payload.new)
      // Update your frontend UI here
    }
  )
  .subscribe()
```

---

## Troubleshooting

### ❌ "Too many request.security() calls" error
- **Cause**: More than 15 symbols configured
- **Fix**: Reduce symbol count to 15 or fewer

### ❌ No alerts firing
- **Check**: Market is open (9:30 AM - 4:00 PM ET)
- **Check**: TradingView alert is active (green checkmark)
- **Check**: At least 30 minutes have passed since session start (range must form first)
- **Check**: A symbol actually broke its opening range

### ❌ Webhook not receiving data
- **Check**: Supabase Edge Function is deployed
- **Check**: Webhook URL is correct in TradingView alert
- **Check**: Edge Function logs in Supabase Dashboard (Logs tab)
- **Test**: Send manual POST request with curl (see Testing section below)

### ❌ Data not appearing in table
- **Check**: RLS policies allow inserts (disable RLS temporarily for testing)
- **Check**: Edge Function has correct `SUPABASE_SERVICE_ROLE_KEY`
- **Check**: Table schema matches expected columns

---

## Testing with Curl

Test your Edge Function directly:

```bash
curl -X POST https://YOUR-PROJECT.supabase.co/functions/v1/orb-webhook \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_ANON_KEY" \
  -d '{
    "alert_type": "orb",
    "event_timestamp": 1730736600000,
    "ticker": "TEST",
    "chart_timeframe": "5",
    "event_type": "orb_breakout_up",
    "direction": "LONG",
    "current_price": 100.50,
    "orb_high": 100.00,
    "orb_low": 99.00,
    "orb_midpoint": 99.50,
    "orb_size": 1.00,
    "orb_size_percent": 1.00,
    "breakout_distance": 0.50,
    "breakout_distance_percent": 50.00,
    "orb_duration_minutes": 30,
    "session_start": "0930",
    "volume": 1000000,
    "breakout_up_occurred": true,
    "breakout_down_occurred": false,
    "retest_up_confirmed": false,
    "retest_down_confirmed": false,
    "scanner_symbol_count": 12
  }'
```

Expected response:
```json
{
  "success": true,
  "message": "ORB alert for TEST (orb_breakout_up) recorded successfully"
}
```

---

## Performance Metrics

### Scanner Efficiency
- **Symbols monitored**: 15 max
- **API calls per symbol**: 2
- **Total API calls**: 30/40 (75% of limit)
- **Alert deduplication**: Hash-based (last 1000 alerts)
- **Memory footprint**: Minimal (map-based state management)

### Alert Latency
- **Detection**: At bar close (e.g., every 5 minutes on 5M chart)
- **Webhook call**: < 1 second
- **Database insert**: < 500ms
- **Frontend update**: Real-time via Supabase subscription

---

## Next Steps

1. ✅ Verify scanner is running (check dashboard)
2. ✅ Verify alerts are firing (wait for market hours)
3. ✅ Verify data in Supabase (check table)
4. 🔨 Build frontend dashboard to display alerts
5. 🔨 Add filters (by ticker, direction, timeframe)
6. 🔨 Add statistics/analytics (win rate, avg breakout distance)
7. 🔨 Set up push notifications for high-priority symbols

---

## Support Resources

- **Full Setup Guide**: `ORB_Scanner_Supabase_Setup.md`
- **Test Payloads**: See Section 3 in setup guide
- **SQL Queries**: See Section 6 in setup guide
- **Pine Script Source**: `Pattern Pulse ORB Scanner.pine`

---

**Happy Trading! 📈**

