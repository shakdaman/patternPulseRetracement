# Pattern Pulse FVG - Visual Guide

## 🎨 Complete Color Scheme Reference

### FVG State and Direction Color Matrix

| State | Bullish FVG | Bearish FVG | Label Prefix |
|-------|-------------|-------------|--------------|
| **Active** | 🟢 Green box, solid green border | 🔴 Red box, solid red border | (none) |
| **Inverted** | 🟠 Orange box, solid orange border | 🔵 Aqua box, solid aqua border | "i" prefix |
| **Mitigated** | ⚪ Gray box, faded border | ⚪ Gray box, faded border | (none) |

### Detailed Visual Breakdown

#### 1. 🟢 **Active Bullish FVG**
- **Box Color**: Green with 70% transparency
- **Border**: Solid green (no transparency), 2px width
- **Label**: 🟢 + strength score (e.g., "🟢75")
- **Label Color**: Blue background
- **Meaning**: Price gap formed by upward move, zone is support
- **Trade**: Look for reversal signals (bounces) at this level

#### 2. 🔴 **Active Bearish FVG**
- **Box Color**: Red with 70% transparency
- **Border**: Solid red (no transparency), 2px width
- **Label**: 🔴 + strength score (e.g., "🔴62")
- **Label Color**: Blue background
- **Meaning**: Price gap formed by downward move, zone is resistance
- **Trade**: Look for reversal signals (rejections) at this level

#### 3. 🟠 **Inverted Bullish FVG** (Former bearish FVG that broke upward)
- **Box Color**: Orange with 75% transparency
- **Border**: Solid orange (no transparency), 2px width
- **Label**: "i" + 🟢 + strength score (e.g., "i🟢35")
- **Label Color**: Orange background
- **Meaning**: Former bearish FVG broken upward, now acts as support
- **Trade**: Look for continuation signals (retests as support)

#### 4. 🔵 **Inverted Bearish FVG** (Former bullish FVG that broke downward)
- **Box Color**: Aqua/Cyan with 75% transparency
- **Border**: Solid aqua (no transparency), 2px width
- **Label**: "i" + 🔴 + strength score (e.g., "i🔴28")
- **Label Color**: Aqua background
- **Meaning**: Former bullish FVG broken downward, now acts as resistance
- **Trade**: Look for continuation signals (retests as resistance)

#### 5. ⚪ **Mitigated FVG** (Filled/Completed)
- **Box Color**: Gray with 85% transparency
- **Border**: Gray with 50% transparency, 1px width
- **Label**: Same as original (keeps original direction emoji)
- **Label Color**: Faded
- **Meaning**: FVG has been fully filled by price, no longer relevant
- **Trade**: No action, historical reference only

---

## 🔍 Quick Visual Reference

### On Your Chart, You'll See:

```
ACTIVE FVGs (Strong borders, less transparent):
┌──────────────────┐
│ 🟢 GREEN BOX     │ ← Bullish FVG (Support)
│ Solid borders    │
│ Label: 🟢75      │
└──────────────────┘

┌──────────────────┐
│ 🔴 RED BOX       │ ← Bearish FVG (Resistance)
│ Solid borders    │
│ Label: 🔴68      │
└──────────────────┘

INVERTED FVGs (Different colors, strong borders):
┌──────────────────┐
│ 🟠 ORANGE BOX    │ ← Former bearish, now support
│ Solid borders    │
│ Label: i🟢32     │ ← Note the "i" prefix!
└──────────────────┘

┌──────────────────┐
│ 🔵 AQUA BOX      │ ← Former bullish, now resistance
│ Solid borders    │
│ Label: i🔴28     │ ← Note the "i" prefix!
└──────────────────┘

MITIGATED FVGs (Very faded):
┌··················┐
│ ⚪ GRAY BOX      │ ← Filled, no longer active
│ Faded borders    │
└··················┘
```

---

## 📊 Understanding Labels

### Label Format: `[prefix][emoji][score]`

**Examples:**
- `🟢85` = Active Bullish FVG, strength 85
- `🔴62` = Active Bearish FVG, strength 62
- `i🟢35` = Inverted (formerly bearish), now bullish, strength 35
- `i🔴28` = Inverted (formerly bullish), now bearish, strength 28

**Key Points:**
- **"i" prefix** = This is an INVERTED FVG (iFVG)
- **Green circle 🟢** = Bullish direction (current or original)
- **Red circle 🔴** = Bearish direction (current or original)
- **Number** = Strength score (0-100)

---

## 🎯 Trading Strategy by Visual

### When You See GREEN Boxes (🟢):
**Active Bullish FVG**
- Price should bounce here
- Look for: BUY REVERSAL signals
- Entry: On bullish candle patterns
- Stop: Below the box

### When You See RED Boxes (🔴):
**Active Bearish FVG**
- Price should reject here
- Look for: SELL REVERSAL signals
- Entry: On bearish candle patterns
- Stop: Above the box

### When You See ORANGE Boxes (🟠):
**Inverted Bullish FVG** (Label starts with "i")
- Former resistance, now support
- Look for: BUY CONTINUATION signals
- Entry: On pullback retest
- Stop: Below the box

### When You See AQUA Boxes (🔵):
**Inverted Bearish FVG** (Label starts with "i")
- Former support, now resistance
- Look for: SELL CONTINUATION signals
- Entry: On pullback retest
- Stop: Above the box

### When You See GRAY Boxes (⚪):
**Mitigated FVG**
- Already filled by price
- No trade action needed
- Historical reference only

---

## 💡 Pro Tips for Visual Identification

### 1. **Border Thickness = Importance**
- **Thick borders (2px)**: Active or Inverted (still relevant)
- **Thin borders (1px)**: Mitigated (historical)

### 2. **Transparency = Activity Level**
- **Less transparent (70-75%)**: Currently active, watch closely
- **More transparent (85%+)**: Mitigated, less relevant

### 3. **Label Prefix "i" = Polarity Shift**
- If you see "i" at the start: This zone flipped roles
- Original bullish → Now bearish resistance
- Original bearish → Now bullish support

### 4. **Color Groups**
- **Green/Red**: Original FVG states (Active)
- **Orange/Aqua**: Inverted states (Continuation opportunities)
- **Gray**: Completed (No action needed)

### 5. **Signal Color Coordination**
Signal labels match the expected FVG type:
- **Green labels (BUY REVERSAL)** → Appear at green boxes
- **Red labels (SELL REVERSAL)** → Appear at red boxes
- **Aqua labels (BUY CONT)** → Appear at aqua boxes (inverted bearish)
- **Orange labels (SELL CONT)** → Appear at orange boxes (inverted bullish)

---

## 🔄 State Transition Visual

```
BULLISH FVG LIFECYCLE:
┌──────────┐                    ┌──────────┐                    ┌──────────┐
│ 🟢 GREEN │  Price breaks up   │ ⚪ GRAY  │  Or price closes   │ 🔵 AQUA  │
│ Active   │  ──────────────▶   │ Mitigated│  down through it   │ Inverted │
│ Support  │                    │ Filled   │  ◀────────────────│ Resistance│
└──────────┘                    └──────────┘                    └──────────┘
   REVERSAL                         EXIT                        CONTINUATION
   signals                                                      signals

BEARISH FVG LIFECYCLE:
┌──────────┐                    ┌──────────┐                    ┌──────────┐
│ 🔴 RED   │  Price breaks down │ ⚪ GRAY  │  Or price closes   │ 🟠 ORANGE│
│ Active   │  ──────────────▶   │ Mitigated│  up through it     │ Inverted │
│ Resistance│                   │ Filled   │  ◀────────────────│ Support  │
└──────────┘                    └──────────┘                    └──────────┘
   REVERSAL                         EXIT                        CONTINUATION
   signals                                                      signals
```

---

## 🎮 Interactive Checklist

Before entering a trade, visually confirm:

- [ ] **Box Color matches trade direction?**
  - Green/Orange boxes = Long trades
  - Red/Aqua boxes = Short trades

- [ ] **Border is solid and thick?**
  - Yes = Active zone
  - No = Mitigated, skip it

- [ ] **Label has "i" prefix?**
  - Yes = Continuation setup (wait for retest)
  - No = Reversal setup (price at zone now)

- [ ] **Strength score is adequate?**
  - 70+ = High probability
  - 50-69 = Moderate probability
  - Below 50 = Requires additional confluence

- [ ] **Signal label appeared?**
  - If yes, entry conditions met
  - If no, wait for pattern confirmation

---

## 📸 Visual Examples

### Example 1: Perfect Reversal Setup
```
Price action approaches green box (🟢)
Label shows: 🟢78 (high strength)
BUY REVERSAL signal appears at bottom of box
Enter long, stop below box
```

### Example 2: Continuation After Break
```
Price breaks through green box (🟢) downward
Box turns aqua (🔵), label now shows: i🔴72
Price pulls back to retest the aqua box
SELL CONTINUATION signal appears
Enter short, stop above box
```

### Example 3: Skip This Trade
```
Box is gray (⚪) and very faded
Even if signal appears, zone is already mitigated
Skip - look for active zones instead
```

---

## 🆘 Visual Troubleshooting

### "I can't tell which boxes are important"
**Solution:** Focus on boxes with:
- Bright, solid colors (not gray)
- Thick borders (2px)
- Low transparency (more opaque)

### "Too many boxes on my chart"
**Solution:** In settings, increase:
- "FVG Min Size" to filter smaller gaps
- "Reversal Min Strength" to show only strong zones
- Or decrease "Max FVGs to Display"

### "Colors look similar"
**Solution:** 
- Green vs Orange: Green has more yellow, Orange is deeper
- Red vs Aqua: Red is warm, Aqua is cool blue-green
- Use the label prefix "i" as the definitive indicator

### "Don't understand inverted zones"
**Remember:**
- **Active** = Zone holds (bounce/reject)
- **Inverted** = Zone broke, now opposite role
- Look for the "i" prefix in labels!

---

## 🎨 Quick Color Memory Aid

**"Green Means Go (Up)" → Bullish Support**  
**"Red Means Stop (Down)" → Bearish Resistance**  
**"Orange Alert" → Former bearish, be ready for continuation up**  
**"Aqua Water Falls" → Former bullish, be ready for continuation down**  
**"Gray is Gone" → Mitigated, ignore it**

---

**Visual Guide Version:** 1.0  
**Last Updated:** November 2025  
**Indicator Version:** Pattern Pulse FVG v1.0

---

*Print this guide and keep it next to your monitor for quick reference!*

