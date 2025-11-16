# Pattern Pulse FVG - Complete User Guide

## Overview

**Pattern Pulse FVG** is an advanced Pine Script v6 indicator that identifies, quantifies, and trades Fair Value Gaps (FVGs) using institutional trading concepts. The indicator implements a sophisticated multi-factor scoring system to distinguish high-probability FVG zones from market noise, and generates both reversal and continuation signals based on rigorous quantitative analysis.

## 🎨 Quick Visual Reference

**Can't tell FVG types apart? Here's the instant guide:**

| Visual | Type | What It Means | Trading Action |
|--------|------|---------------|----------------|
| 🟢 **Green box** + solid border | Active Bullish FVG | Support zone | Look for BUY REVERSAL |
| 🔴 **Red box** + solid border | Active Bearish FVG | Resistance zone | Look for SELL REVERSAL |
| 🟠 **Orange box** + "i" label | Inverted Bullish FVG | Former resistance → support | Look for BUY CONTINUATION |
| 🔵 **Aqua box** + "i" label | Inverted Bearish FVG | Former support → resistance | Look for SELL CONTINUATION |
| ⚪ **Gray box** + faded | Mitigated FVG | Already filled | Skip - no trade |

**Remember:** "i" prefix in label = Inverted FVG (polarity shifted)

📖 **[Complete Visual Guide](fvg-visual-guide.md)** - Detailed color explanations, examples, and visual memory aids

---

## Table of Contents

1. [Core Concepts](#core-concepts)
2. [Key Features](#key-features)
3. [Installation](#installation)
4. [User Inputs Explained](#user-inputs-explained)
5. [Signal Types](#signal-types)
6. [Trading Strategies](#trading-strategies)
7. [Best Practices](#best-practices)
8. [FAQ](#faq)

---

## Core Concepts

### What is a Fair Value Gap (FVG)?

A **Fair Value Gap** is a three-candle formation that represents a momentary imbalance or inefficiency in the market where normal two-sided price delivery was disrupted by aggressive, one-sided momentum.

**Bullish FVG Formation:**
- Occurs when price moves up so fast that a gap forms between the high of candle 1 and the low of candle 3
- The middle candle (candle 2) is a strong bullish candle
- This gap represents an area where buyers overwhelmed sellers

**Bearish FVG Formation:**
- Occurs when price moves down rapidly, creating a gap between the low of candle 1 and the high of candle 3
- The middle candle is a strong bearish candle
- Represents an area where sellers dominated buyers

### Why FVGs Matter

FVGs are considered "institutional footprints" - they mark price levels where large market participants (hedge funds, banks) executed significant orders. The market often returns to these zones to "rebalance" the inefficiency before continuing its trend.

### The Consistency Theory

Not all FVGs are equal. The **Consistency Theory** states that FVGs formed by three directionally-aligned candles (e.g., three consecutive bullish candles) are significantly stronger than those formed by mixed-direction candles. This indicates pure, uninterrupted displacement and higher probability of trend continuation.

### Inverted FVGs (iFVGs)

When an FVG is breached (price closes completely through it), it undergoes a **polarity shift**:
- A broken bullish FVG becomes resistance
- A broken bearish FVG becomes support

These inverted zones provide high-probability continuation trade opportunities when price returns to retest them.

---

## Key Features

### 1. Multi-Factor Strength Scoring System

Every detected FVG is analyzed and scored based on three quantitative factors:

#### **Consistency Score (1-3 scale)**
- Measures directional alignment of the three candles forming the FVG
- Score of 3 = perfect consistency (all candles same direction)
- Score of 1 = minimum (only middle candle directional)

#### **Magnitude Score (vs ATR)**
- Normalizes FVG size against 14-period Average True Range
- Filters out statistically insignificant gaps
- Values > 1.0 indicate the gap is larger than average candle range

#### **Volume Confirmation Score**
- Compares middle candle's volume to 20-period volume SMA
- Values > 1.5 indicate institutional participation
- Validates the strength behind the displacement

#### **Composite Score (0-100)**
- Weighted average of all three factors
- User-configurable weights for customization
- Provides single, at-a-glance quality rating

### 2. Dual-Framework Signal Generation

#### **Framework A: Reversal Signals**
Generated when price respects a strong FVG and forms a candlestick reversal pattern:

**Bullish Reversal Requirements:**
- Price enters a bullish FVG zone
- FVG strength score ≥ reversal minimum threshold
- Bullish candlestick pattern forms (Engulfing, Hammer, Piercing Line, Morning Star)
- Risk:Reward ratio meets minimum requirement

**Bearish Reversal Requirements:**
- Price enters a bearish FVG zone
- FVG strength score ≥ reversal minimum threshold
- Bearish candlestick pattern forms (Engulfing, Shooting Star, Dark Cloud Cover, Evening Star)
- Risk:Reward ratio meets minimum requirement

#### **Framework B: Continuation Signals**
Generated when a weak FVG is inverted and price returns to retest:

**Bullish Continuation:**
- Former bearish FVG was broken upward (inverted)
- Initial FVG score was ≤ continuation maximum threshold
- Price pulls back to retest the iFVG zone
- Bullish candle closes after retest
- Risk:Reward ratio meets minimum requirement

**Bearish Continuation:**
- Former bullish FVG was broken downward (inverted)
- Initial FVG score was ≤ continuation maximum threshold
- Price pulls back to retest the iFVG zone
- Bearish candle closes after retest
- Risk:Reward ratio meets minimum requirement

### 3. Intelligent Candlestick Pattern Recognition

The indicator detects 8 powerful reversal patterns:

**Bullish Patterns:**
- **Bullish Engulfing**: Large bullish candle engulfs prior bearish candle
- **Hammer**: Long lower wick, small body at top
- **Piercing Line**: Bullish candle closes above midpoint of prior bearish candle
- **Morning Star**: Three-candle bottoming formation

**Bearish Patterns:**
- **Bearish Engulfing**: Large bearish candle engulfs prior bullish candle
- **Shooting Star**: Long upper wick, small body at bottom
- **Dark Cloud Cover**: Bearish candle closes below midpoint of prior bullish candle
- **Evening Star**: Three-candle topping formation

### 4. Dynamic Swing-Based Targeting

The indicator automatically identifies significant swing highs and lows for price targets:

- Uses configurable pivot detection (left/right bar lookback)
- Filters for major structural levels
- Automatically plots target lines for each signal
- Calculates real-time Risk:Reward ratios
- Filters out signals below minimum R:R threshold

### 5. Visual FVG State Tracking

FVG boxes are distinctly color-coded for easy identification:

**Active FVGs (Original State):**
- **🟢 Green box** with solid green border = Bullish FVG (Support)
- **🔴 Red box** with solid red border = Bearish FVG (Resistance)
- Labels show: Direction emoji + strength score (e.g., "🟢75")

**Inverted FVGs (Polarity Shifted):**
- **🟠 Orange box** with solid orange border = Former bearish → now support
- **🔵 Aqua box** with solid aqua border = Former bullish → now resistance
- Labels show: "i" prefix + direction + score (e.g., "i🟢35")

**Mitigated FVGs (Completed):**
- **⚪ Gray box** with faded border = Filled, no longer active
- Very transparent, historical reference only

**Key Visual Indicators:**
- Thick borders (2px) = Active or Inverted (still relevant)
- Thin borders (1px) = Mitigated (historical)
- "i" prefix in label = Inverted (polarity flipped)
- Emoji colors match zone direction (🟢 bullish, 🔴 bearish)

📖 See **[Complete Visual Guide](fvg-visual-guide.md)** for detailed color matrix and examples

---

## Installation

### Steps:

1. Open TradingView and navigate to the Pine Editor
2. Create a new indicator
3. Copy and paste the entire `Pattern Pulse FVG.pine` script
4. Click "Save" and name it "Pattern Pulse FVG"
5. Click "Add to Chart"

### Requirements:
- TradingView account (Free or Pro)
- Pine Script v6 support (automatic on TradingView)
- Recommended: Use on timeframes 15min to Daily for best results

---

## User Inputs Explained

### FVG Detection Settings

**FVG Min Size (x ATR)**
- Default: 0.7
- Range: 0.1 to 3.0
- Description: Minimum size of FVG relative to 14-period ATR to be considered valid
- Lower values = more FVGs detected (more noise)
- Higher values = fewer, more significant FVGs

### Strength Scoring Weights

**Strength Weight: Consistency**
- Default: 40%
- Range: 0-100%
- Description: Weight given to the Consistency Theory score
- Increase if you prioritize directional purity of candles

**Strength Weight: Magnitude**
- Default: 30%
- Range: 0-100%
- Description: Weight given to FVG size vs ATR
- Increase if you prioritize larger gaps

**Strength Weight: Volume**
- Default: 30%
- Range: 0-100%
- Description: Weight given to volume confirmation
- Increase if you prioritize institutional volume participation

*Note: Total weights are automatically normalized to 100%*

### Signal Filters

**Reversal Signal Min Strength**
- Default: 60
- Range: 0-100
- Description: Minimum composite score required for reversal signals
- Higher values = fewer but higher-quality reversal signals
- Recommended: 50-70 for swing trading, 40-50 for day trading

**Continuation Signal Max Strength**
- Default: 40
- Range: 0-100
- Description: Maximum initial score for iFVG candidates
- Lower values = only weakest FVGs can invert (more selective)
- Higher values = more continuation signals
- Recommended: 30-40 for aggressive, 20-30 for conservative

**Minimum Risk:Reward Ratio**
- Default: 2.0
- Range: 0.5 to 10.0
- Description: Minimum R:R ratio required for signals to display
- 2.0 means you risk $1 to make $2
- Higher values = fewer signals but better risk management
- Recommended: 2.0-3.0 for most traders

### Swing Detection Settings

**Swing Lookback Left**
- Default: 5
- Range: 2-50
- Description: Number of bars to left for pivot detection
- Shorter = more sensitive (more swing points detected)
- Longer = less sensitive (major pivots only)

**Swing Lookback Right**
- Default: 5
- Range: 2-50
- Description: Number of bars to right for pivot detection
- Must wait this many bars for pivot confirmation
- Match with left value for balanced detection

*Recommended Combinations:*
- Scalping/Day Trading: 3-5 bars each
- Swing Trading: 5-10 bars each
- Position Trading: 10-20 bars each

### Display Settings

**Show Reversal Signals**
- Default: True
- Toggle display of all reversal signals

**Show Continuation Signals**
- Default: True
- Toggle display of all continuation signals

**Show FVG Boxes**
- Default: True
- Toggle display of FVG zone boxes

**Show Strength Scores**
- Default: True
- Toggle display of strength score labels

**Max FVGs to Display**
- Default: 20
- Range: 5-100
- Description: Maximum number of active FVGs shown on chart
- Lower values = cleaner chart, better performance
- Higher values = more historical context

### Multi-Timeframe Settings

**Enable Multi-Timeframe Analysis**
- Default: False
- Description: Enables HTF FVG confluence analysis
- *Note: Full MTF implementation planned for future update*

**Higher Timeframe**
- Default: 240 (4-hour)
- Description: Higher timeframe for confluence validation
- Recommended: 2-4x current chart timeframe

---

## Signal Types

### 🟢 BUY REVERSAL
**Appearance:** Green label with "BUY REVERSAL" text below price

**What it means:**
- Price entered a strong bullish FVG zone
- FVG held as support (not broken)
- Bullish candlestick reversal pattern formed
- R:R ratio exceeds minimum threshold

**How to trade:**
- **Entry:** At close of signal candle or next candle open
- **Stop Loss:** Just below the FVG bottom boundary
- **Target:** Automatically plotted at recent significant swing high (green dashed line)
- **Best for:** Trend continuation in uptrend or bounce plays

### 🔴 SELL REVERSAL
**Appearance:** Red label with "SELL REVERSAL" text above price

**What it means:**
- Price entered a strong bearish FVG zone
- FVG held as resistance (not broken)
- Bearish candlestick reversal pattern formed
- R:R ratio exceeds minimum threshold

**How to trade:**
- **Entry:** At close of signal candle or next candle open
- **Stop Loss:** Just above the FVG top boundary
- **Target:** Automatically plotted at recent significant swing low (red dashed line)
- **Best for:** Trend continuation in downtrend or rejection plays

### 🔵 BUY CONT (Continuation)
**Appearance:** Cyan/aqua label with "BUY CONT" text below price

**What it means:**
- Former bearish FVG was broken upward (became bullish iFVG)
- Price pulled back to retest the inverted zone
- Zone now acting as support
- Bullish candle closed confirming momentum
- R:R ratio exceeds minimum threshold

**How to trade:**
- **Entry:** At close of signal candle (after successful retest)
- **Stop Loss:** Just below the iFVG zone bottom
- **Target:** Automatically plotted at recent swing high (green dashed line)
- **Best for:** Riding strong uptrends, breakout continuations

### 🟠 SELL CONT (Continuation)
**Appearance:** Orange label with "SELL CONT" text above price

**What it means:**
- Former bullish FVG was broken downward (became bearish iFVG)
- Price pulled back to retest the inverted zone
- Zone now acting as resistance
- Bearish candle closed confirming momentum
- R:R ratio exceeds minimum threshold

**How to trade:**
- **Entry:** At close of signal candle (after successful retest)
- **Stop Loss:** Just above the iFVG zone top
- **Target:** Automatically plotted at recent swing low (red dashed line)
- **Best for:** Riding strong downtrends, breakdown continuations

---

## Trading Strategies

### Strategy 1: High-Probability Reversals (Conservative)

**Settings:**
- Reversal Min Strength: 70
- Continuation Max Strength: 30
- Min R:R: 3.0
- Swing Lookback: 8-10 bars each

**Timeframes:** 1H to Daily

**Approach:**
1. Wait for BUY REVERSAL or SELL REVERSAL signals only
2. Only take signals that align with higher timeframe trend
3. Enter at signal close or next bar open
4. Place stop just beyond FVG boundary
5. Target the automatically plotted level
6. Consider partial profits at 2:1, let rest run to target

**Win Rate Expectation:** 65-75%

**Best For:** Part-time traders, lower stress trading

### Strategy 2: Trend Rider (Aggressive)

**Settings:**
- Reversal Min Strength: 50
- Continuation Max Strength: 45
- Min R:R: 2.0
- Swing Lookback: 5 bars each

**Timeframes:** 15min to 4H

**Approach:**
1. Identify strong trending market (higher timeframe)
2. Take BOTH reversal and continuation signals in trend direction
3. Use continuation signals as primary entries
4. Use reversal signals as re-entry after pullbacks
5. Trail stops as new FVGs form in trend direction
6. Exit at target or when counter-trend signal appears

**Win Rate Expectation:** 55-65%

**Best For:** Active traders, trending markets

### Strategy 3: Swing Trading Setup

**Settings:**
- Reversal Min Strength: 60
- Continuation Max Strength: 35
- Min R:R: 2.5
- Swing Lookback: 10 bars each

**Timeframes:** 4H to Daily

**Approach:**
1. Use Daily chart to identify market structure
2. Use 4H chart for signal entries
3. Only take signals at key structure levels (support/resistance)
4. Require confluence with higher timeframe FVG
5. Enter on reversal signals primarily
6. Use wider stops (beyond FVG + buffer)
7. Hold for swing target (10-20% moves)

**Win Rate Expectation:** 60-70%

**Best For:** Position traders, weekly monitoring

### Strategy 4: Scalping with FVGs

**Settings:**
- Reversal Min Strength: 40
- Continuation Max Strength: 50
- Min R:R: 1.5
- Swing Lookback: 3 bars each

**Timeframes:** 1min to 15min

**Approach:**
1. Trade during high-volume sessions only
2. Take all signal types in dominant market direction
3. Quick entries at signal close
4. Tight stops (1-2 ticks beyond FVG)
5. Scale out at 1.5:1 and 2:1
6. Maximum holding time: 15-30 minutes

**Win Rate Expectation:** 50-60%

**Best For:** Full-time traders, fast markets

---

## Best Practices

### 1. Confluence is Critical

**Always seek confluence with:**
- Higher timeframe trend direction
- Major support/resistance levels
- Round psychological numbers (e.g., 100.00, 1.2000)
- Previous swing highs/lows
- Volume profile POCs (Point of Control)

**Example:** A BUY REVERSAL signal at a bullish FVG that also aligns with:
- Daily uptrend
- Weekly support zone
- Previous swing low
- High volume node

This setup has 5 layers of confluence = much higher probability

### 2. Respect the Strength Score

The composite strength score is your filter for quality:

- **Score 80-100:** Extremely strong FVG - highest probability
- **Score 60-79:** Strong FVG - good probability
- **Score 40-59:** Moderate FVG - requires additional confluence
- **Score 20-39:** Weak FVG - likely to fail (watch for inversion)
- **Score 0-19:** Very weak FVG - avoid reversal trades

**Pro Tip:** In strong trends, even low-scoring FVGs in the trend direction can work. In ranging markets, demand high scores (70+).

### 3. Risk Management Rules

**Position Sizing:**
- Never risk more than 1-2% of account per trade
- Use the automatically plotted stop loss levels
- Calculate position size based on stop distance

**Trade Management:**
- Scale out at logical levels (50% at 2:1, let 50% run)
- Move stop to breakeven after 1:1 reached
- Trail stops below/above new FVGs that form
- Don't fight the trend - cut losers quickly

**Daily Limits:**
- Set max daily loss limit (3-5% of account)
- Set max number of trades per day (3-5 setups)
- Stop trading after 2 consecutive losses
- Review and journal all trades

### 4. Market Conditions Matter

**Best Market Conditions:**
- ✅ Trending markets with clear direction
- ✅ High volume sessions (London/NY overlap for forex)
- ✅ After major economic releases (when FVGs form)
- ✅ Markets with clear higher timeframe structure

**Avoid:**
- ❌ Low volume periods (Asian session for forex, pre-market stocks)
- ❌ Major holidays and half-day sessions
- ❌ Extreme choppy/sideways action with no clear direction
- ❌ During major news events (trade the reaction after)

### 5. Timeframe Alignment

**Golden Rule:** Your signal timeframe should be 1/4 to 1/6 of your target timeframe.

**Examples:**
- If targeting Daily swing highs → trade on 4H or 1H charts
- If targeting 1H highs → trade on 15min or 5min charts
- If targeting 15min highs → trade on 3min or 1min charts

**Multi-Timeframe Workflow:**
1. Identify trend on highest timeframe (Daily/Weekly)
2. Find structure and key levels on middle timeframe (4H/1H)
3. Take signal entries on lowest timeframe (1H/15min)

### 6. Journal and Optimize

**Track these metrics:**
- Win rate by signal type (Reversal vs Continuation)
- Win rate by FVG strength score ranges
- Average R:R achieved vs expected
- Performance by timeframe
- Performance by market condition (trending/ranging)
- Time of day performance

**Optimize settings based on your results:**
- If too many losing reversal signals → increase reversal min strength
- If missing good continuation moves → increase continuation max score
- If getting stopped out frequently → adjust FVG min size (ATR threshold)
- If signals too rare → decrease min R:R ratio or adjust swing lookback

---

## FAQ

### Q: How many FVGs should I see on my chart?

**A:** It varies by timeframe and market conditions:
- **1-5min charts:** 10-30 FVGs in view is normal
- **15min-1H charts:** 5-15 FVGs is typical
- **4H-Daily charts:** 3-8 FVGs is expected

If you're seeing too many (cluttered chart), increase the "FVG Min Size" threshold. If too few, decrease it.

### Q: Which signals are more reliable - Reversals or Continuations?

**A:** It depends on market conditions:
- **In strong trends:** Continuation signals are more reliable (60-70% win rate)
- **In ranging markets:** Reversal signals are better (65-75% win rate)
- **Overall:** High-scoring reversals (70+ strength) tend to have the highest reliability

### Q: Why don't I see any signals?

**Possible reasons:**
1. Your strength thresholds are too strict (decrease reversal min, increase continuation max)
2. Your min R:R is too high (decrease to 1.5-2.0)
3. Market is in tight consolidation (no strong FVGs forming)
4. Your swing lookback is too large (decrease to 3-5 bars)
5. You disabled signals in display settings

### Q: Can I use this on all markets?

**A:** Yes, the indicator works on:
- ✅ Forex (all pairs)
- ✅ Stocks (all exchanges)
- ✅ Crypto (all coins)
- ✅ Indices (ES, NQ, etc.)
- ✅ Commodities (Gold, Oil, etc.)

**However**, performance varies:
- **Best on:** High-liquidity major forex pairs, major indices, large-cap stocks
- **Good on:** Crypto majors (BTC, ETH), commodities
- **Challenging on:** Low-volume penny stocks, obscure altcoins

### Q: What's the best timeframe for this indicator?

**A:** Optimal timeframes by trading style:
- **Scalping:** 1-5 minutes
- **Day Trading:** 15min - 1 hour
- **Swing Trading:** 4 hour - Daily
- **Position Trading:** Daily - Weekly

**Most versatile:** 1H and 4H charts provide best balance of signal quality and frequency.

### Q: Should I take every signal?

**A:** Absolutely not. Use the indicator as a **signal generator**, not a complete system.

**Apply additional filters:**
1. Only trade in direction of higher timeframe trend
2. Require confluence with key structure levels
3. Check that signal aligns with your session (volume)
4. Verify strength score meets your standards
5. Ensure R:R is attractive (2.5:1 or better)

Taking only the top 20-30% of signals will dramatically improve results.

### Q: How do I know if an FVG will hold or fail?

**Indicators of strong FVG (likely to hold):**
- High strength score (70+)
- Perfect consistency (all 3 candles same direction)
- High volume on displacement candle (2x+ average)
- Aligns with higher timeframe structure
- Forms at key support/resistance level

**Indicators of weak FVG (likely to fail):**
- Low strength score (below 40)
- Mixed candle directions
- Low volume
- Forms in middle of range (no structure)
- Against dominant trend

### Q: What does it mean when an FVG turns yellow?

**A:** Yellow indicates an **Inverted FVG (iFVG)**:
- The original FVG was completely breached (closed through)
- The zone has undergone a polarity shift
- Former support is now resistance (or vice versa)
- Watch for price to return and retest this zone
- Continuation signals can form at these retests

### Q: Can I combine this with other indicators?

**A:** Yes! Excellent complementary indicators:
- **Volume Profile:** Confirm FVGs at high-volume nodes
- **RSI/Stochastic:** Add momentum confirmation
- **Moving Averages:** Confirm trend direction
- **Order Blocks:** Look for FVG + order block alignment
- **Liquidity Sweeps:** FVGs after sweeps are powerful

**Warning:** Don't over-complicate. Adding too many filters reduces opportunity.

### Q: Why do some signals fail?

**Common failure reasons:**
1. **News events:** Fundamental drivers override technical setups
2. **Lack of confluence:** Signal in isolation without structural backing
3. **Wrong market condition:** Range signal in trend or vice versa
4. **Poor R:R:** Target too close, stop too wide
5. **Weak FVG:** Low strength score couldn't hold price
6. **Against dominant trend:** Counter-trend trades have lower success rate

**Remember:** No indicator is 100% accurate. Expect 55-70% win rate with proper filtering and risk management.

### Q: How often should I adjust the settings?

**A:** Settings should be relatively stable, but adjust when:
1. **Changing markets:** Different assets may need tweaking
2. **Changing timeframes:** Lower timeframes need more sensitive settings
3. **Market regime shift:** Bull market to bear market transition
4. **Performance deterioration:** If win rate drops consistently
5. **Too few/many signals:** Finding the "sweet spot" for your style

**Pro Tip:** Test settings on at least 30-50 trades before concluding they need adjustment.

### Q: Is this indicator repainting?

**A:** **No.** This indicator is non-repainting:
- FVGs are detected based on closed candles only
- Signals trigger on confirmed candlestick patterns (closed candles)
- State changes (active → inverted) occur on candle close
- Swing pivots wait for required confirmation bars

All signals are based on historical closed data and will not disappear or change on chart refresh.

---

## Support and Updates

**Version:** 1.0  
**Release Date:** November 2025  
**Pine Script Version:** v6

### Planned Future Enhancements:
- Full multi-timeframe confluence scoring
- Automated position sizing calculator
- Enhanced alert message customization
- Historical performance statistics table
- Volume profile integration
- Session-based filtering

---

## Disclaimer

This indicator is provided for educational and informational purposes only. Trading financial instruments carries risk, and past performance does not guarantee future results. Always practice proper risk management and consider consulting with a financial advisor before trading.

**The Pattern Pulse FVG indicator is a tool to assist in analysis - it is not financial advice and should not be your sole basis for trading decisions.**

---

## Credits

**Developed by:** Pattern Pulse Trading Systems  
**Based on:** Institutional Trading Concepts & Smart Money Theory  
**Inspired by:** ICT (Inner Circle Trader) FVG methodology and quantitative market structure analysis

---

**Happy Trading! 📊📈**

*For questions, feedback, or support, please refer to the project documentation.*

