# ORB Breakouts Frontend Integration Guide

## 📦 What's Included

1. **`ORBBreakoutsTab.tsx`** - Complete ORB alerts table component
2. **`MainApp.tsx`** - Updated main app with ORB tab navigation
3. **`orb-styles.css`** - Dark theme styles matching your existing UI
4. **Supabase integration** - Real-time subscription for live alerts

---

## 🚀 Quick Start

### Step 1: Install Dependencies

If not already installed:

```bash
npm install @supabase/supabase-js
# or
yarn add @supabase/supabase-js
```

### Step 2: Add Your Supabase Keys

Update the Supabase client initialization in both files:

**In `ORBBreakoutsTab.tsx` and `MainApp.tsx`:**

```typescript
const supabase = createClient(
  'https://aihoazkzytaprtcpgfwx.supabase.co',
  'YOUR_SUPABASE_ANON_KEY' // Replace with your actual anon key
)
```

Get your anon key from:
https://supabase.com/dashboard/project/aihoazkzytaprtcpgfwx/settings/api

### Step 3: Copy Files to Your Project

```
your-frontend/
├── src/
│   ├── components/
│   │   ├── ORBBreakoutsTab.tsx      ← Copy here
│   │   └── MainApp.tsx               ← Copy here (or merge with existing)
│   └── styles/
│       └── orb-styles.css            ← Copy here
```

### Step 4: Import CSS

In your main CSS file or `MainApp.tsx`:

```typescript
import './styles/orb-styles.css'
```

Or if using Tailwind (recommended):

The components already use Tailwind utility classes. Just ensure Tailwind is configured in your project.

### Step 5: Integrate the Tab

If you already have a main app component, add the ORB tab:

```typescript
import ORBBreakoutsTab from './components/ORBBreakoutsTab'

// In your existing tab logic:
{activeTab === 'orb' && <ORBBreakoutsTab />}
```

---

## 🎨 UI Features

### Dark Theme Matching
- Background: `bg-gray-900`
- Cards/Inputs: `bg-gray-800`
- Borders: `border-gray-700` / `border-gray-800`
- Text: `text-white`, `text-gray-400`
- Accents: `bg-yellow-500` (matches your "Live" button)

### Direction Badges
- **LONG**: Green badge (`bg-green-500/20 text-green-400`)
- **SHORT**: Red badge (`bg-red-500/20 text-red-400`)

### Event Type Badges
- **Breakout Up**: Blue badge
- **Breakout Down**: Orange badge
- **Retest Up**: Green badge with ✓
- **Retest Down**: Red badge with ✓

### Table Columns

| Column | Description |
|--------|-------------|
| **TICKER / TIMEFRAME** | Stock symbol + chart timeframe (e.g., "SPY (5)") |
| **DIRECTION** | LONG or SHORT badge |
| **EVENT TYPE** | Breakout Up/Down or Retest Up/Down |
| **ORB RANGE** | High, Low, Size ($ and %) |
| **BREAKOUT STATS** | Current price, distance from ORB, retest status |
| **LAST UPDATED** | Time and date of alert |

---

## 🔄 Real-Time Updates

The component automatically subscribes to Supabase real-time changes:

```typescript
const channel = supabase
  .channel('orb-alerts-channel')
  .on('postgres_changes', {
    event: 'INSERT',
    schema: 'public',
    table: 'orb_alerts'
  }, (payload) => {
    // New alert received - automatically added to table
    setAlerts(prev => [payload.new as ORBAlert, ...prev])
  })
  .subscribe()
```

**No polling needed!** Alerts appear instantly when TradingView sends them.

---

## 🎯 Filters

### Available Filters

1. **Search by Ticker**
   - Real-time search as you type
   - Case-insensitive

2. **Direction Filter**
   - All Directions
   - LONG only
   - SHORT only

3. **Event Type Filter**
   - All Event Types
   - Breakouts Only (up + down)
   - Retests Only (up + down confirmed)

4. **Timeframe Filter**
   - All Timeframes
   - Dynamically populated from alerts (5, 15, 30, 60, etc.)

### View Modes

- **All Events**: Shows all alerts chronologically
- **Grouped View**: (Future enhancement) Group by ticker

---

## 📊 Data Structure

The component expects this structure from Supabase:

```typescript
interface ORBAlert {
  id: number
  event_timestamp: number           // Unix timestamp (ms)
  ticker: string                    // "SPY", "QQQ", etc.
  chart_timeframe: string           // "5", "15", "30", etc.
  event_type: string                // "orb_breakout_up", etc.
  direction: 'LONG' | 'SHORT'
  current_price: number
  orb_high: number
  orb_low: number
  orb_midpoint: number
  orb_size: number
  orb_size_percent: number
  breakout_distance: number
  breakout_distance_percent: number
  orb_duration_minutes: number      // Usually 30
  session_start: string             // "0930"
  volume: number
  breakout_up_occurred: boolean
  breakout_down_occurred: boolean
  retest_up_confirmed: boolean
  retest_down_confirmed: boolean
  scanner_symbol_count: number
  created_at: string
}
```

---

## 🔧 Customization

### Change Alert Limit

In `ORBBreakoutsTab.tsx`:

```typescript
const { data, error } = await supabase
  .from('orb_alerts')
  .select('*')
  .order('event_timestamp', { ascending: false })
  .limit(100)  // Change this number
```

### Add More Filters

Example: Add a minimum breakout distance filter:

```typescript
const [minBreakoutDistance, setMinBreakoutDistance] = useState(0)

// In filter section:
<input
  type="number"
  value={minBreakoutDistance}
  onChange={(e) => setMinBreakoutDistance(Number(e.target.value))}
  placeholder="Min breakout distance %"
/>

// In filteredAlerts:
if (alert.breakout_distance_percent < minBreakoutDistance) {
  return false
}
```

### Modify Column Display

In the table body, customize what's shown:

```typescript
{/* Add a new column */}
<td className="py-4 text-sm">
  <div>Volume: {alert.volume.toLocaleString()}</div>
</td>
```

---

## 📱 Responsive Design

The component is fully responsive:
- **Desktop**: Full table with all columns
- **Tablet**: Slightly condensed columns
- **Mobile**: Stacked layout (via CSS media queries)

Breakpoints are defined in `orb-styles.css`:

```css
@media (max-width: 768px) {
  /* Mobile styles */
}
```

---

## 🧪 Testing

### 1. Test with Existing Data

Query your Supabase table:

```sql
SELECT * FROM orb_alerts ORDER BY created_at DESC LIMIT 10;
```

You should see the 3 test records (SPY, QQQ, IWM) we inserted earlier.

### 2. Test Real-Time Updates

Run this in PowerShell to send a test alert:

```powershell
$url = 'https://aihoazkzytaprtcpgfwx.supabase.co/functions/v1/orb-webhook'
$key = 'YOUR_SERVICE_ROLE_KEY'
$payload = '{"alert_type":"orb","event_timestamp":' + [DateTimeOffset]::UtcNow.ToUnixTimeMilliseconds() + ',"ticker":"AAPL","chart_timeframe":"5","event_type":"orb_breakout_up","direction":"LONG","current_price":175.50,"orb_high":175.00,"orb_low":174.00,"orb_midpoint":174.50,"orb_size":1.00,"orb_size_percent":0.57,"breakout_distance":0.50,"breakout_distance_percent":50.00,"orb_duration_minutes":30,"session_start":"0930","volume":5000000,"breakout_up_occurred":true,"breakout_down_occurred":false,"retest_up_confirmed":false,"retest_down_confirmed":false,"scanner_symbol_count":12}'
Invoke-RestMethod -Uri $url -Method Post -Headers @{'Content-Type'='application/json';'Authorization'="Bearer $key"} -Body $payload
```

The alert should appear **instantly** in your frontend without refreshing!

### 3. Test Filters

- Type "SPY" in search → Should show only SPY alerts
- Select "LONG" direction → Should filter out SHORT alerts
- Select "Breakouts Only" → Should hide retest alerts

---

## 🎨 Color Scheme Reference

Match your existing UI:

| Element | Class | Color |
|---------|-------|-------|
| Background | `bg-gray-900` | `#111827` |
| Cards | `bg-gray-800` | `#1f2937` |
| Borders | `border-gray-700` | `#374151` |
| Text Primary | `text-white` | `#ffffff` |
| Text Secondary | `text-gray-400` | `#9ca3af` |
| Accent (Yellow) | `bg-yellow-500` | `#eab308` |
| Success (Green) | `bg-green-500` | `#22c55e` |
| Error (Red) | `bg-red-500` | `#ef4444` |
| Warning (Orange) | `bg-orange-500` | `#f97316` |
| Info (Blue) | `bg-blue-500` | `#3b82f6` |

---

## 🚨 Troubleshooting

### No Data Showing

1. **Check Supabase connection:**
   ```typescript
   console.log('Supabase URL:', supabase.supabaseUrl)
   ```

2. **Check table name:**
   - Must be `orb_alerts` (lowercase, underscore)

3. **Check RLS policies:**
   - Ensure anon key can read from `orb_alerts` table
   - Or disable RLS temporarily:
     ```sql
     ALTER TABLE orb_alerts DISABLE ROW LEVEL SECURITY;
     ```

### Real-Time Not Working

1. **Enable Realtime in Supabase:**
   - Go to Database → Replication
   - Enable replication for `orb_alerts` table

2. **Check subscription:**
   ```typescript
   console.log('Subscription status:', channel.state)
   // Should be 'SUBSCRIBED'
   ```

### Styling Issues

1. **Ensure Tailwind is configured**
2. **Import CSS file**
3. **Check class name conflicts**

---

## 📈 Performance Tips

1. **Limit initial fetch:**
   - Default: 100 alerts
   - Increase if needed, but watch performance

2. **Pagination (future):**
   ```typescript
   const [page, setPage] = useState(0)
   const pageSize = 50
   
   .range(page * pageSize, (page + 1) * pageSize - 1)
   ```

3. **Debounce search:**
   ```typescript
   import { useDebouncedValue } from '@mantine/hooks'
   const [debouncedSearch] = useDebouncedValue(searchTicker, 300)
   ```

---

## 🎯 Next Steps

1. ✅ Copy files to your project
2. ✅ Add Supabase keys
3. ✅ Import CSS
4. ✅ Test with existing data
5. ✅ Configure TradingView alert (if not done)
6. ✅ Wait for live market data!

---

## 📚 Additional Resources

- **Supabase Dashboard:** https://supabase.com/dashboard/project/aihoazkzytaprtcpgfwx
- **Table Editor:** https://supabase.com/dashboard/project/aihoazkzytaprtcpgfwx/editor
- **Realtime Docs:** https://supabase.com/docs/guides/realtime

---

**Questions?** Check the existing test data in Supabase or test the webhook again!



