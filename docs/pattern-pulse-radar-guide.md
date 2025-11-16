# Pattern Pulse Radar - User Guide

## Overview

The Pattern Pulse Radar is a sophisticated Pine Script v6 indicator that creates a multi-ticker, multi-timeframe pattern detection system. It scans for candlestick patterns and STRAT patterns across 3 configurable tickers and 5 timeframes, displaying results in an easy-to-read radar table format.

## Features

### Multi-Ticker Monitoring
- **8 Configurable Tickers**: Monitor any 8 symbols simultaneously
- **5 Timeframes**: 4H, 1D, 1W, 1M, 3M analysis
- **Real-time Updates**: Live pattern detection and price monitoring
- **Maximum Capacity**: Uses all 40 available request.security calls (Pine Script limit)

### Pattern Detection

#### Bullish Candlestick Patterns
- **Hammer**: Long lower shadow, small body, minimal upper shadow
- **Inverted Hammer**: Long upper shadow, small body, minimal lower shadow  
- **Dragonfly Doji**: Long lower shadow, no body, minimal upper shadow
- **Piercing Line**: Bullish reversal after bearish candle

#### Bearish Candlestick Patterns
- **Hanging Man**: Long lower shadow, small body (appears after uptrend)
- **Shooting Star**: Long upper shadow, small body (appears after uptrend)
- **Gravestone Doji**: Long upper shadow, no body, minimal lower shadow
- **Dark Cloud Cover**: Bearish reversal after bullish candle

#### STRAT Patterns
- **Inside Bar**: Current high < previous high AND current low > previous low
- **3-2 Combo**: Three-bar reversal followed by two-bar continuation

## Configuration

### Batch Selection System
- **23 Pre-configured Batches**: 169 unique tickers organized into batches of 8 tickers each
- **Easy Selection**: Choose from dropdown menu in indicator settings
- **Categories Include**:
  - **Batch 1**: Crypto/Blockchain ETFs (AMEX:BITO, AMEX:BLOX, CBOE:BTCI, etc.)
  - **Batch 2**: Financial Sector (NYSE:BAC, NYSE:C, NYSE:CCL, etc.)
  - **Batch 5**: Tech Giants (NASDAQ:AAPL, NASDAQ:AMD, NYSE:BMY, etc.)
  - **Batch 6**: Major Tech (NASDAQ:MSFT, NASDAQ:NFLX, NASDAQ:NVDA, etc.)
  - **Batch 7**: Sector ETFs (AMEX:XLE, AMEX:XLU, AMEX:XLK, etc.)
  - **Batch 14**: Financial Services (NYSE:GS, NYSE:JPM, NYSE:MS, etc.)
  - **Batch 16**: Healthcare (NYSE:ABBV, NASDAQ:AMGN, NYSE:BDX, etc.)
  - **Batch 19**: Energy Sector (NYSE:EPD, NYSE:HAL, NYSE:MPC, etc.)
  - And 15 more specialized batches

### How to Use Batch Selection
1. **Add Indicator**: Add "Pattern Pulse Radar" to your chart
2. **Open Settings**: Click the gear icon to open indicator settings
3. **Select Batch**: In "Ticker Batch Selection" section, choose your desired batch from the dropdown
4. **Apply Changes**: Click "OK" to apply the new ticker batch
5. **View Radar**: The radar table will update with patterns for the selected tickers

### Batch Categories Overview
- **Batches 1-4**: Mixed sectors and crypto ETFs
- **Batches 5-6**: Major technology companies
- **Batch 7**: Sector ETFs (XLE, XLU, XLK, etc.)
- **Batches 8-13**: Various sectors and individual stocks
- **Batches 14-15**: Financial services and banking
- **Batches 16-17**: Healthcare and pharmaceuticals
- **Batches 18-19**: Industrials and energy sectors
- **Batches 20-21**: Consumer staples and materials
- **Batch 22**: Utilities sector
- **Batch 23**: Single ticker (NASDAQ:TTD)

### Pattern Controls
- **Enable Bullish Patterns**: Toggle all bullish pattern detection
- **Enable Bearish Patterns**: Toggle all bearish pattern detection
- **Enable STRAT Patterns**: Toggle STRAT methodology patterns

### Individual Pattern Toggles
Each pattern can be individually enabled/disabled for fine-tuned control.

### Display Settings
- **Show Current Prices**: Display current price when no patterns detected
- **Table Position**: Choose where the radar table appears on chart (9 position options for multi-radar setups)
- **Show Performance Info**: Display request.security call statistics

## How to Use

### Basic Setup
1. Add the indicator to any chart
2. Configure your 8 desired ticker symbols
3. Enable/disable patterns as needed
4. Position the radar table where you prefer

### Multi-Radar Setup
For comprehensive market monitoring, you can create multiple radar instances on the same chart:
1. **Add multiple indicators** to the same chart with different ticker configurations
2. **Use different table positions** for each radar instance
3. **Available positions**: Top Left, Top Center, Top Right, Middle Left, Middle Center, Middle Right, Bottom Left, Bottom Center, Bottom Right
4. **Maximum setup**: 9 radar instances (one per position) monitoring up to 72 different symbols total

### Reading the Radar
- **Rows**: Each ticker symbol
- **Columns**: Each timeframe (4H, 1D, 1W, 1M, 3M)
- **Pattern Names**: Abbreviated pattern names when detected
- **Colors**: 
  - **Red background**: Bearish patterns detected (HangMan, ShootStr, GravDoj, DarkCl)
  - **Green background**: Bullish patterns detected (Hammer, InvHam, DragDoj, Pierce)
  - **Gray background**: STRAT patterns detected (Inside, 3-2Combo) or no patterns
  - **Mixed patterns**: Color priority is STRAT > Bearish > Bullish (STRAT patterns always show gray)

### Pattern Abbreviations
- **Hammer**: Hammer (bullish reversal after proper downtrend - at least 2 of last 3 candles lower)
- **InvHam**: Inverted Hammer (bullish reversal after proper downtrend - at least 2 of last 3 candles lower)
- **DragDoj**: Dragonfly Doji
- **Pierce**: Piercing Line (bullish reversal after proper downtrend - at least 2 of last 3 candles lower)
- **HangMan**: Hanging Man (bearish reversal after proper uptrend - at least 2 of last 3 candles higher)
- **ShootStr**: Shooting Star (bearish reversal after proper uptrend - at least 2 of last 3 candles higher)
- **GravDoj**: Gravestone Doji
- **DarkCl**: Dark Cloud Cover (bearish reversal after proper uptrend - at least 2 of last 3 candles higher)
- **Inside**: Inside Bar (STRAT pattern)
- **3-2Combo**: STRAT 3-2 Combo (Outside Bar + Directional Break)

## STRAT 3-2 Combo Pattern

**Definition**: A two-bar STRAT pattern consisting of:

### **Bar 3 (Outside Bar)**:
- **Engulfs** the previous candle completely
- **High > previous high** AND **Low < previous low**
- Indicates increased volatility and market indecision

### **Bar 2 (Directional Bar)**:
- **Bullish 2U**: Breaks above the Outside Bar's high
- **Bearish 2D**: Breaks below the Outside Bar's low
- Signals market intent to continue in that direction

### **Pattern Logic**:
```pinescript
// Outside Bar: Engulfs previous candle
outside_bar = prev_high > prev2_high and prev_low < prev2_low

// Directional Break: Current candle breaks Outside Bar
breaks_high = current_high > prev_high  // Bullish 2U
breaks_low = current_low < prev_low     // Bearish 2D

// Valid 3-2 Combo
outside_bar and (breaks_high or breaks_low)
```

### **Trading Implications**:
- **Bullish 3-2**: Outside Bar + Break Above → Potential bullish continuation
- **Bearish 3-2**: Outside Bar + Break Below → Potential bearish continuation
- **Trend Context**: More reliable when aligned with prevailing trend direction

## Advanced Trend Detection

**Robust Trend Context Validation**: Pattern detection now includes sophisticated trend context validation to prevent false signals:

### **Bullish Reversal Patterns** (Hammer, Inverted Hammer, Piercing Line):
- Only detected after **proper downtrends**
- Requires **at least 2 of the last 3 candles** to show lower closes
- Prevents false signals during sideways or rising markets
- Example: Hammer will only appear after a genuine decline, not just a single down candle

### **Bearish Reversal Patterns** (Hanging Man, Shooting Star, Dark Cloud Cover):
- Only detected after **proper uptrends**  
- Requires **at least 2 of the last 3 candles** to show higher closes
- Prevents false signals during sideways or declining markets
- Example: Dark Cloud Cover will only appear after a genuine rise, not just a single up candle

### **Technical Implementation**:
- Uses **3-candle analysis** instead of simple 2-candle comparison
- More accurate trend identification reduces false positives
- Matches professional trading standards for pattern validation
- Ensures patterns only appear in their proper market context

## Technical Specifications

### Performance Optimization
- **Optimized Data Retrieval**: Uses single request.security calls per ticker/timeframe
- **Total Security Calls**: 40 calls (8 tickers × 5 timeframes)
- **Pine Script v6 Compatible**: At the maximum 40-call limit for non-pro accounts
- **Non-Repainting**: Uses lookahead=barmerge.lookahead_off for confirmed data only

### Error Handling
- **Data Validation**: Checks for valid price data before pattern analysis
- **Error Display**: Shows "ERROR" in cells where data retrieval fails
- **Performance Monitoring**: Tracks successful vs failed security calls

### Alert System
- **Pattern Type Alerts**: Separate alerts for bullish, bearish, and STRAT patterns
- **General Status Alert**: Confirms radar is actively monitoring
- **Customizable Messages**: Detailed alert messages for each pattern type

## Best Practices

### Symbol Selection
- Choose liquid symbols with good data availability
- Avoid symbols with frequent gaps or low volume
- Test with major indices or large-cap stocks first

### Timeframe Analysis
- Higher timeframes (1M, 3M) provide more reliable signals
- Lower timeframes (4H, 1D) offer more frequent opportunities
- Consider your trading timeframe when interpreting results

### Pattern Interpretation
- Single patterns provide initial signals
- Multiple patterns across timeframes strengthen conviction
- Always confirm with additional technical analysis
- Consider market context and trend direction

## Troubleshooting

### Common Issues
1. **"ERROR" in cells**: Check symbol validity and data availability
2. **Missing patterns**: Verify pattern toggles are enabled
3. **Performance issues**: Enable performance info to monitor security calls
4. **Table positioning**: Adjust table position if overlapping with other elements

### Data Requirements
- Requires historical data for multi-candle patterns (3-2 Combo needs 5 bars)
- Some patterns may not appear immediately on new symbols
- Higher timeframes may take longer to populate with sufficient data

## Advanced Features

### Performance Monitoring
Enable "Show Performance Info" to monitor:
- Total request.security calls made
- Successful data retrievals
- Failed data retrievals

### Customization
- Modify pattern detection logic in the functions
- Adjust color schemes in the table display
- Add additional timeframes by modifying the arrays
- Extend to more tickers (consider security call limits)

## Version Information
- **Pine Script Version**: v6
- **Compatibility**: TradingView platform
- **Update Frequency**: Real-time on bar close
- **Memory Usage**: Optimized for minimal resource consumption

## Support and Updates
This indicator follows modern Pine Script v6 best practices and is designed for reliability and performance. For issues or enhancements, refer to the technical documentation and ensure compliance with Pine Script limitations.
