# Debug Webhook 500 Error

## Check These in Order:

### 1. Verify Table Exists

Go to: https://supabase.com/dashboard/project/aihoazkzytaprtcpgfwx/editor

Run this query:
```sql
SELECT table_name 
FROM information_schema.tables 
WHERE table_schema = 'public' 
AND table_name = 'orb_alerts';
```

**Expected result:** Should show `orb_alerts` table

If **no results**, the table doesn't exist. Run the SQL from `create-table.sql`

---

### 2. Check Edge Function Logs

Go to: https://supabase.com/dashboard/project/aihoazkzytaprtcpgfwx/functions/orb-webhook/logs

Look for the most recent error. Common errors:

**Error: "relation \"public.orb_alerts\" does not exist"**
- **Fix:** Table not created. Run `create-table.sql`

**Error: "new row violates row-level security policy"**
- **Fix:** Disable RLS temporarily:
```sql
ALTER TABLE public.orb_alerts DISABLE ROW LEVEL SECURITY;
```

**Error: "permission denied"**
- **Fix:** Edge Function needs service_role key (already configured)

---

### 3. Test Table Directly

Go to SQL Editor and run:
```sql
-- Test insert
INSERT INTO public.orb_alerts (
    event_timestamp, ticker, chart_timeframe, event_type, direction,
    current_price, orb_high, orb_low, orb_midpoint, orb_size, 
    orb_size_percent, orb_duration_minutes, session_start,
    breakout_up_occurred, breakout_down_occurred, 
    retest_up_confirmed, retest_down_confirmed, scanner_symbol_count
) VALUES (
    1730736600000, 'TEST', '5', 'orb_breakout_up', 'LONG',
    100.00, 99.50, 98.00, 98.75, 1.50,
    1.50, 30, '0930',
    true, false, false, false, 12
);

-- Verify
SELECT * FROM orb_alerts WHERE ticker = 'TEST';
```

**If this fails**, there's a table schema issue.

**If this works**, the Edge Function has an issue.

---

### 4. Re-Deploy Edge Function (if needed)

If table is fine but webhook still fails, re-deploy the function:

1. Go to: https://supabase.com/dashboard/project/aihoazkzytaprtcpgfwx/functions
2. Click on `orb-webhook`
3. Click **Edit**
4. Make sure the code matches `supabase-edge-function-orb-webhook.ts`
5. Click **Save** / **Deploy**

---

## Quick Fix Checklist

Run these queries in order:

```sql
-- 1. Check if table exists
SELECT COUNT(*) FROM information_schema.tables 
WHERE table_schema = 'public' AND table_name = 'orb_alerts';

-- 2. If exists, disable RLS (if enabled)
ALTER TABLE public.orb_alerts DISABLE ROW LEVEL SECURITY;

-- 3. Test direct insert
INSERT INTO public.orb_alerts (
    event_timestamp, ticker, chart_timeframe, event_type, direction,
    current_price, orb_high, orb_low, orb_midpoint, orb_size,
    orb_duration_minutes, session_start,
    breakout_up_occurred, breakout_down_occurred,
    retest_up_confirmed, retest_down_confirmed
) VALUES (
    1730736600000, 'TEST', '5', 'orb_breakout_up', 'LONG',
    575.82, 575.50, 574.20, 574.85, 1.30,
    30, '0930',
    true, false, false, false
);

-- 4. Verify insert worked
SELECT * FROM orb_alerts ORDER BY created_at DESC LIMIT 1;
```

---

## After Fixing

Re-run the webhook test:
```powershell
$url = 'https://aihoazkzytaprtcpgfwx.supabase.co/functions/v1/orb-webhook'
$key = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFpaG9hemt6eXRhcHJ0Y3BnZnd4Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2MDcyNzE1OCwiZXhwIjoyMDc2MzAzMTU4fQ.qvSfLB8v8P8SwB1OoVr1QTzxTiq4Y4g9u3TEFfb0DeQ'
$payload = '{"alert_type":"orb","event_timestamp":1730736600000,"ticker":"SPY","chart_timeframe":"5","event_type":"orb_breakout_up","direction":"LONG","current_price":575.82,"orb_high":575.50,"orb_low":574.20,"orb_midpoint":574.85,"orb_size":1.30,"orb_size_percent":0.23,"breakout_distance":0.32,"breakout_distance_percent":24.62,"orb_duration_minutes":30,"session_start":"0930","volume":1250000.50,"breakout_up_occurred":true,"breakout_down_occurred":false,"retest_up_confirmed":false,"retest_down_confirmed":false,"scanner_symbol_count":12}'
$response = Invoke-RestMethod -Uri $url -Method Post -Headers @{'Content-Type'='application/json';'Authorization'="Bearer $key"} -Body $payload
$response | ConvertTo-Json
```

**Expected:** `{"success": true, "message": "ORB alert for SPY recorded successfully"}`



