# ⚡ Quick Setup - 5 Minutes

## Step 1: Get Your Supabase Anon Key

1. Go to: https://supabase.com/dashboard/project/aihoazkzytaprtcpgfwx/settings/api
2. Copy the **anon public** key (starts with `eyJ...`)
3. Replace in both files:

**`ORBBreakoutsTab.tsx` (line 6):**
```typescript
const supabase = createClient(
  'https://aihoazkzytaprtcpgfwx.supabase.co',
  'PASTE_YOUR_ANON_KEY_HERE'
)
```

**`MainApp.tsx` (line 5):**
```typescript
const supabase = createClient(
  'https://aihoazkzytaprtcpgfwx.supabase.co',
  'PASTE_YOUR_ANON_KEY_HERE'
)
```

---

## Step 2: Copy Files

```
your-project/
├── src/
│   ├── components/
│   │   ├── ORBBreakoutsTab.tsx    ← Copy from orb/frontend/
│   │   └── MainApp.tsx             ← Merge with your existing app
│   └── styles/
│       └── orb-styles.css          ← Copy from orb/frontend/
```

---

## Step 3: Add the Tab

In your existing app component, add:

```typescript
import ORBBreakoutsTab from './components/ORBBreakoutsTab'

// Add to your tab navigation:
<button onClick={() => setActiveTab('orb')}>
  ORB Breakouts ({orbCount})
</button>

// Add to your tab content:
{activeTab === 'orb' && <ORBBreakoutsTab />}
```

---

## Step 4: Test

Open your app - you should see:

```
┌─────────────────────────────────────────────────────────┐
│ [Progression Alerts (100)] [OTE Reversals (0)] [ORB Breakouts (3)] ← New tab!
└─────────────────────────────────────────────────────────┘

Search by ticker... [                                    ]

[All Directions ▼] [All Event Types ▼] [All Timeframes ▼]

[All Events] [Grouped View]

TICKER/TIMEFRAME | DIRECTION | EVENT TYPE    | ORB RANGE       | BREAKOUT STATS      | LAST UPDATED
──────────────────────────────────────────────────────────────────────────────────────────────────────
SPY (5)         | LONG      | Breakout Up   | H: $575.50      | Price: $575.82      | 4:42:00 PM
                |           |               | L: $574.20      | Distance: 24.6%     | 11/3/2025
                |           |               | Size: $1.30(0.23%)

QQQ (5)         | SHORT     | Breakout Down | H: $489.80      | Price: $488.15      | 4:42:01 PM
                |           |               | L: $488.50      | Distance: 26.9%     | 11/3/2025
                |           |               | Size: $1.30(0.27%)

IWM (5)         | LONG      | Retest Up ✓   | H: $219.50      | Price: $219.85      | 4:42:02 PM
                |           |               | L: $218.80      | Distance: 50.0%     | 11/3/2025
                |           |               | Size: $0.70(0.32%) | ✓ Retest Confirmed
```

---

## Step 5: Enable Realtime (Important!)

For live updates, enable Realtime in Supabase:

1. Go to: https://supabase.com/dashboard/project/aihoazkzytaprtcpgfwx/database/replication
2. Find `orb_alerts` table
3. Click "Enable" on the Realtime toggle

---

## That's It! 🎉

Your ORB Breakouts tab is now:
- ✅ Fetching data from Supabase
- ✅ Subscribing to real-time updates
- ✅ Filtering by ticker, direction, event type
- ✅ Matching your dark theme UI

New alerts will appear **instantly** during market hours!

---

## Test Real-Time Updates

Run this PowerShell command to send a test alert:

```powershell
$url = 'https://aihoazkzytaprtcpgfwx.supabase.co/functions/v1/orb-webhook'
$key = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFpaG9hemt6eXRhcHJ0Y3BnZnd4Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2MDcyNzE1OCwiZXhwIjoyMDc2MzAzMTU4fQ.qvSfLB8v8P8SwB1OoVr1QTzxTiq4Y4g9u3TEFfb0DeQ'
$timestamp = [DateTimeOffset]::UtcNow.ToUnixTimeMilliseconds()
$payload = "{`"alert_type`":`"orb`",`"event_timestamp`":$timestamp,`"ticker`":`"AAPL`",`"chart_timeframe`":`"5`",`"event_type`":`"orb_breakout_up`",`"direction`":`"LONG`",`"current_price`":175.50,`"orb_high`":175.00,`"orb_low`":174.00,`"orb_midpoint`":174.50,`"orb_size`":1.00,`"orb_size_percent`":0.57,`"breakout_distance`":0.50,`"breakout_distance_percent`":50.00,`"orb_duration_minutes`":30,`"session_start`":`"0930`",`"volume`":5000000,`"breakout_up_occurred`":true,`"breakout_down_occurred`":false,`"retest_up_confirmed`":false,`"retest_down_confirmed`":false,`"scanner_symbol_count`":12}"
Invoke-RestMethod -Uri $url -Method Post -Headers @{'Content-Type'='application/json';'Authorization'="Bearer $key"} -Body $payload | ConvertTo-Json
```

**Watch the alert appear in your UI without refreshing!** 🚀

---

## Need Help?

- **No data?** Check `FRONTEND_INTEGRATION.md` troubleshooting section
- **Styling issues?** Ensure `orb-styles.css` is imported
- **Realtime not working?** Check Supabase Replication settings

**Everything working?** Configure your TradingView alert and start monitoring live ORB breakouts! 📈



