# ORB Scanner - Quick Setup for Project aihoazkzytaprtcpgfwx

## ✅ Status Check

- [x] Edge Function deployed (`orb-webhook`)
- [ ] Database table created (`orb_alerts`)
- [ ] Webhook tested successfully
- [ ] TradingView alert configured

---

## Next Step: Create the Database Table

### Go to Supabase SQL Editor

**Direct Link:** https://supabase.com/dashboard/project/aihoazkzytaprtcpgfwx/editor

### Run This SQL

Click "New Query" and paste:

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

-- Create indexes for fast queries
CREATE INDEX idx_orb_alerts_ticker ON public.orb_alerts(ticker);
CREATE INDEX idx_orb_alerts_event_timestamp ON public.orb_alerts(event_timestamp DESC);
CREATE INDEX idx_orb_alerts_created_at ON public.orb_alerts(created_at DESC);
```

Click **Run** (F5)

You should see: **"Success. No rows returned"**

---

## Then Test the Webhook Again

Run this PowerShell command:

```powershell
$url = 'https://aihoazkzytaprtcpgfwx.supabase.co/functions/v1/orb-webhook'
$key = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFpaG9hemt6eXRhcHJ0Y3BnZnd4Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2MDcyNzE1OCwiZXhwIjoyMDc2MzAzMTU4fQ.qvSfLB8v8P8SwB1OoVr1QTzxTiq4Y4g9u3TEFfb0DeQ'
$payload = '{"alert_type":"orb","event_timestamp":1730736600000,"ticker":"SPY","chart_timeframe":"5","event_type":"orb_breakout_up","direction":"LONG","current_price":575.82,"orb_high":575.50,"orb_low":574.20,"orb_midpoint":574.85,"orb_size":1.30,"orb_size_percent":0.23,"breakout_distance":0.32,"breakout_distance_percent":24.62,"orb_duration_minutes":30,"session_start":"0930","volume":1250000.50,"breakout_up_occurred":true,"breakout_down_occurred":false,"retest_up_confirmed":false,"retest_down_confirmed":false,"scanner_symbol_count":12}'
$response = Invoke-RestMethod -Uri $url -Method Post -Headers @{'Content-Type'='application/json';'Authorization'="Bearer $key"} -Body $payload
$response | ConvertTo-Json
```

You should see:
```json
{
  "success": true,
  "message": "ORB alert for SPY recorded successfully"
}
```

---

## Verify Data in Database

Go to SQL Editor and run:

```sql
SELECT * FROM orb_alerts ORDER BY created_at DESC LIMIT 5;
```

You should see your test SPY record!

---

## Finally: Configure TradingView

1. Add `Pattern Pulse ORB Scanner` indicator to chart
2. Configure symbols (one per line):
   ```
   SPY
   QQQ
   IWM
   DIA
   AAPL
   MSFT
   ```
3. Create Alert:
   - **Webhook URL:** `https://aihoazkzytaprtcpgfwx.supabase.co/functions/v1/orb-webhook`
   - **Frequency:** Once Per Bar Close
   - Create

---

## Done! 🎉

During market hours (9:30 AM - 4:00 PM ET), your scanner will:
1. Monitor all configured symbols
2. Detect ORB breakouts and retests
3. Send JSON to your Supabase webhook
4. Store data in `orb_alerts` table
5. Ready to display on your frontend!

---

## Need Help?

Check the Edge Function logs:
https://supabase.com/dashboard/project/aihoazkzytaprtcpgfwx/functions/orb-webhook/logs

