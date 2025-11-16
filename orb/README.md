# Opening Range Breakout (ORB) Indicators

This directory contains Pine Script implementations for detecting and trading Opening Range Breakouts.

## 📂 Files in this Directory

### Pine Script Indicators

1. **`Advanced_ORB_Detector.pine`**
   - Single-chart ORB detector with visualization
   - Monitors current chart symbol for ORB breakouts and retests
   - Features: Visual markers, information panel, range lines
   - Multi-symbol support: Can process 1-20 symbols (webhook alerts only)
   - Best for: Active trading on a single chart

2. **`Pattern Pulse ORB Scanner.pine`** ⭐ NEW
   - Optimized multi-symbol ORB scanner
   - Monitors 10-15 tickers simultaneously
   - Sends JSON webhooks to Supabase for frontend integration
   - Efficient: Only 2 `request.security()` calls per symbol
   - Features: Real-time dashboard, alert deduplication, breakout/retest detection
   - Best for: Building a frontend dashboard with live ORB alerts

### Documentation

- **`docs/ORB_Scanner_Supabase_Setup.md`** - Complete Supabase integration guide
- **`docs/ORB_Scanner_Quick_Start.md`** - 5-minute setup guide
- **`docs/Pine Script ORB Strategy Research.md`** - Strategy research and references

### Supabase Integration

- **`supabase-edge-function-orb-webhook.ts`** - Edge Function for receiving webhooks
- **`test-webhook.ps1`** - PowerShell test script (Windows)
- **`test-webhook.sh`** - Bash test script (Linux/Mac)

### Implementation Plans

- **`ORB_MultiTicker_Implementation_Plan.md`** - Multi-ticker strategy planning

---

## 🚀 Quick Start

### Option 1: Single Chart Trading (Simple)

1. Open TradingView
2. Add `Advanced_ORB_Detector.pine` to your chart
3. Configure session start and duration
4. Trade based on visual breakout signals

### Option 2: Multi-Symbol Dashboard (Advanced)

1. Follow **`docs/ORB_Scanner_Quick_Start.md`**
2. Deploy Supabase infrastructure
3. Configure `Pattern Pulse ORB Scanner.pine`
4. Set up TradingView webhook alerts
5. Build frontend to display live ORB alerts

---

## 📊 What is an Opening Range Breakout (ORB)?

### Definition
The **Opening Range** is the high and low price range during the first N minutes of the trading session (typically 30 minutes).

A **Breakout** occurs when price closes outside this range, indicating potential momentum in that direction.

### Event Types

| Event | Description | Signal |
|-------|-------------|--------|
| **Breakout Up** | Price closes above ORB high | Bullish - Consider LONG |
| **Breakout Down** | Price closes below ORB low | Bearish - Consider SHORT |
| **Retest Up Confirmed** | Price returns to ORB high after breakout up, then bounces | Strong bullish confirmation |
| **Retest Down Confirmed** | Price returns to ORB low after breakout down, then bounces | Strong bearish confirmation |

### Why Trade ORBs?

✅ **Clear entry levels** - ORB high/low are objective price levels  
✅ **Momentum indication** - Breakouts suggest strong directional move  
✅ **Risk management** - Stop loss can be placed just beyond the ORB  
✅ **Works across timeframes** - From 5-minute to daily charts  
✅ **High probability** - Especially when combined with market context

---

## 🎯 Scanner Features

### Pattern Pulse ORB Scanner

**Real-time Dashboard:**
```
┌─────────────────────────┐
│ ORB Scanner Status      │
├─────────────────────────┤
│ Symbols      12/12      │ ← Monitoring 12 symbols
│ API Calls    24/40      │ ← Using 24/40 request limit
│ ORB Duration 30m @ 0930 │ ← 30-min ORB from 9:30 AM
│ Breakout Alerts ON      │
│ Retest Alerts ON (+2 bars)│
│ Total Alerts 5          │
│   ↳ Breakouts 3         │
│   ↳ Retests   2         │
└─────────────────────────┘
```

**JSON Webhook Payload:**
```json
{
  "alert_type": "orb",
  "ticker": "SPY",
  "event_type": "orb_breakout_up",
  "direction": "LONG",
  "current_price": 575.82,
  "orb_high": 575.50,
  "orb_low": 574.20,
  "breakout_distance_percent": 24.62,
  "orb_size_percent": 0.23
}
```

**Key Metrics:**
- ORB size (absolute and percentage)
- Breakout distance (how far price moved beyond ORB)
- Volume on breakout bar
- Scanner symbol count
- Session configuration

---

## 💾 Supabase Integration

### Database Schema

```sql
CREATE TABLE orb_alerts (
    id BIGSERIAL PRIMARY KEY,
    event_timestamp BIGINT NOT NULL,
    ticker VARCHAR(20) NOT NULL,
    event_type VARCHAR(50) NOT NULL,
    direction VARCHAR(10) NOT NULL,
    current_price DECIMAL(12, 4) NOT NULL,
    orb_high DECIMAL(12, 4) NOT NULL,
    orb_low DECIMAL(12, 4) NOT NULL,
    breakout_distance_percent DECIMAL(8, 4),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    -- ... additional fields
);
```

### Edge Function

Deploy the webhook handler:
```powershell
supabase functions deploy orb-webhook --project-ref YOUR_PROJECT_REF
```

### Test Webhook

Run the test script (Windows):
```powershell
.\test-webhook.ps1
```

Or bash (Linux/Mac):
```bash
chmod +x test-webhook.sh
./test-webhook.sh
```

---

## 📈 Frontend Queries

### Get Latest ORB Alerts

```typescript
const { data } = await supabase
  .from('orb_alerts')
  .select('*')
  .order('event_timestamp', { ascending: false })
  .limit(50)
```

### Real-time Subscription

```typescript
supabase
  .channel('orb-channel')
  .on('postgres_changes', {
    event: 'INSERT',
    schema: 'public',
    table: 'orb_alerts'
  }, (payload) => {
    console.log('New ORB alert:', payload.new)
  })
  .subscribe()
```

### Statistics by Ticker

```sql
SELECT 
    ticker,
    COUNT(*) FILTER (WHERE event_type = 'orb_breakout_up') as breakouts_up,
    COUNT(*) FILTER (WHERE event_type = 'orb_breakout_down') as breakouts_down,
    AVG(orb_size_percent) as avg_orb_size,
    MAX(breakout_distance_percent) as max_breakout_distance
FROM orb_alerts
WHERE created_at > NOW() - INTERVAL '7 days'
GROUP BY ticker;
```

---

## ⚙️ Configuration

### Scanner Settings

| Setting | Default | Range | Description |
|---------|---------|-------|-------------|
| **ORB Duration** | 30 min | 1-120 min | Length of opening range period |
| **Session Start** | 0930 | HHMM | Session start time (exchange timezone) |
| **Max Symbols** | 15 | 1-15 | Number of tickers to monitor |
| **Min Retest Bars** | 2 | 1-10 | Bars required after breakout for retest |

### Symbol Recommendations

**High-volume ETFs:**
- SPY, QQQ, IWM, DIA (indexes)
- XLF, XLE, XLK, XLV (sectors)

**Popular Stocks:**
- AAPL, MSFT, GOOGL, AMZN, TSLA, NVDA, META

**Pro Tip:** Choose liquid symbols with tight spreads for best results.

---

## 🔧 Troubleshooting

### "Too many request.security() calls"
- **Cause:** More than 15 symbols configured
- **Fix:** Reduce symbol count to 15 or fewer
- Scanner uses 2 calls per symbol (15 × 2 = 30/40 limit)

### No alerts firing
- **Check:** Market is open (9:30 AM - 4:00 PM ET)
- **Check:** At least 30 minutes have passed since session start
- **Check:** TradingView alert is active (green checkmark)
- **Check:** A symbol actually broke its opening range

### Webhook not working
- **Check:** Edge Function is deployed
- **Check:** Webhook URL is correct in TradingView
- **Check:** Supabase Edge Function logs for errors
- **Test:** Run `test-webhook.ps1` to verify endpoint

---

## 📚 Strategy Ideas

### 1. Momentum Continuation
- Enter on first ORB breakout
- Stop: Just beyond opposite ORB boundary
- Target: 2-3x ORB size

### 2. Retest Entry
- Wait for retest confirmation before entering
- Lower risk, but fewer opportunities
- Higher win rate

### 3. Multiple Timeframe
- Use 30-min ORB for direction
- Use 5-min chart for precise entries
- Combine with volume analysis

### 4. Scanner-Based
- Monitor 15 symbols simultaneously
- Only trade symbols with clean breakouts
- Focus on high relative volume

---

## 🎓 Resources

- **Full Setup Guide:** `docs/ORB_Scanner_Supabase_Setup.md`
- **Quick Start:** `docs/ORB_Scanner_Quick_Start.md`
- **Research:** `docs/Pine Script ORB Strategy Research.md`

---

## 📝 License

These indicators are provided as-is for educational and trading purposes. Use at your own risk.

---

**Questions?** Check the documentation or review the inline comments in the Pine Script files.

