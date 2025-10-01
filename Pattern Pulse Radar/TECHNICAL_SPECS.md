# Pattern Pulse Radar - Technical Specifications

## System Requirements

### Pine Script Version
- **Minimum**: Pine Script V6
- **Recommended**: Latest Pine Script V6 with all updates
- **Compatibility**: TradingView platform only

### Performance Limits
- **Request Limit**: 40 unique `request.security()` calls (non-professional accounts)
- **Execution Time**: 500ms per bar maximum
- **Memory Limit**: 64MB per script
- **Array Size**: 100,000 elements maximum

## Architecture Overview

### Core Components
1. **Pattern Detection Engine**: Identifies 3-2 Strat and Inside Bar patterns
2. **Multi-Timeframe Scanner**: Scans across 4H, D, W, M timeframes
3. **Batch Management System**: Handles 8 predefined ticker batches
4. **Alert System**: Provides real-time pattern notifications
5. **Visual Display System**: Table-based pattern visualization

### Data Flow
```
Ticker Input → Batch Selection → Multi-Timeframe Data Fetching → 
Pattern Detection → Color Coding → Table Display → Alert Generation
```

## Pattern Detection Specifications

### 3-2 Strat Pattern Detection

#### Primary 3-2 Patterns
```pinescript
// 3-2 Bullish (Outside Bar → 2-Up)
isThreeTwoBullish() =>
    isTwoUp() and isOutsideBar()[1]

// 3-2 Bearish (Outside Bar → 2-Down)
isThreeTwoBearish() =>
    isTwoDown() and isOutsideBar()[1]
```

#### Alternative 3-2 Patterns
```pinescript
// 3-2 Bullish Reversal (Outside Bar → 2-Down → 2-Up)
isThreeTwoBullishAlt() =>
    isTwoUp() and isTwoDown()[1] and isOutsideBar()[2]

// 3-2 Bearish Reversal (Outside Bar → 2-Up → 2-Down)
isThreeTwoBearishAlt() =>
    isTwoDown() and isTwoUp()[1] and isOutsideBar()[2]
```

### Inside Bar Pattern Detection
```pinescript
// Inside Bar (Consolidation pattern)
isInsideBar() =>
    high < high[1] and low > low[1]
```

### Strat Framework Primitives
```pinescript
// 2-Up Bar (Bullish directional)
isTwoUp() =>
    high > high[1] and low >= low[1]

// 2-Down Bar (Bearish directional)
isTwoDown() =>
    low < low[1] and high <= high[1]

// Outside Bar (3) - Engulfing pattern
isOutsideBar() =>
    high > high[1] and low < low[1]
```

## Multi-Timeframe Implementation

### Timeframe Configuration
- **4H**: 240-minute charts
- **D**: Daily charts
- **W**: Weekly charts
- **M**: Monthly charts

### Request Optimization
- **32 requests per batch**: 8 tickers × 4 timeframes
- **8 requests reserved**: For additional functionality
- **Total**: 40 requests (within Pine Script limit)

### HTF Pattern Detection
```pinescript
// HTF detection using actual HTF data for consistency
detectHTFPatterns(htfOpen, htfHigh, htfLow, htfClose, htfVolume) =>
    // Pattern detection logic using actual HTF data
    // Ensures consistent pattern detection across all chart timeframes
    // Uses historical HTF bars for accurate pattern analysis
```

## Batch Management System

### Ticker Batches
Each batch contains 8 tickers across different sectors:

1. **Major Indices & ETFs**: SPY, QQQ, IWM, DIA, GLD, SLV, TLT, HYG
2. **Tech Giants**: AAPL, MSFT, GOOGL, AMZN, META, TSLA, NVDA, NFLX
3. **Financial Sector**: JPM, BAC, WFC, GS, MS, C, USB, PNC
4. **Healthcare & Biotech**: JNJ, PFE, UNH, ABBV, MRK, TMO, ABT, DHR
5. **Consumer & Retail**: WMT, HD, PG, KO, PEP, MCD, SBUX, NKE
6. **Energy & Materials**: XOM, CVX, COP, EOG, SLB, HAL, KMI, WMB
7. **Industrial & Transportation**: BA, CAT, DE, GE, HON, MMM, UPS, FDX
8. **Real Estate & Utilities**: AMT, PLD, CCI, EQIX, PSA, EXR, AVB, EQR

### Batch Selection Logic
```pinescript
getCurrentBatch() =>
    switch i_currentBatch
        1 => tickers_batch1
        2 => tickers_batch2
        // ... additional batches
        => tickers_batch1
```

## Alert System Specifications

### Alert Conditions
1. **Inside Bar Detected**: `alertcondition(isInsideBar(), ...)`
2. **3-2 Bullish Early**: `alertcondition(isThreeTwoBullish(), ...)`
3. **3-2 Bearish Early**: `alertcondition(isThreeTwoBearish(), ...)`
4. **3-2 Bullish Reversal**: `alertcondition(isThreeTwoBullishAlt(), ...)`
5. **3-2 Bearish Reversal**: `alertcondition(isThreeTwoBearishAlt(), ...)`

### Alert Configuration
- **Immediate alerts**: Trigger on pattern detection
- **Customizable messages**: Include ticker and pattern information
- **Multiple conditions**: Support for complex alert logic

## Visual Display System

### Table Structure
- **Columns**: Ticker + Timeframes + Pattern Dots
- **Rows**: 8 tickers + 1 header row
- **Position**: Configurable (top_center, top_left, etc.)

### Color Coding System
```pinescript
// Pattern color assignment
bullishPatterns = str.contains(patterns, "3-2 Bull") or str.contains(patterns, "3-2 Rev Bull")
bearishPatterns = str.contains(patterns, "3-2 Bear") or str.contains(patterns, "3-2 Rev Bear")
insideBarPatterns = str.contains(patterns, "Inside Bar")

// Color assignment
if bullishPatterns
    cellColor := color.new(color.green, 70)
else if bearishPatterns
    cellColor := color.new(color.red, 70)
else if insideBarPatterns
    cellColor := color.new(color.orange, 70)
```

### Pattern Dot Indicators
- **Maximum dots**: 4 per ticker
- **Color**: Yellow with transparency
- **Purpose**: Quick visual reference for pattern activity

## Consistency Across Timeframes

### Pattern Detection Consistency
The radar ensures consistent pattern detection regardless of the chart timeframe by:

- **Using actual HTF data**: Pattern detection uses the actual HTF bars, not the current chart's timeframe
- **Historical bar analysis**: Analyzes the actual HTF historical bars for pattern formation
- **Timeframe independence**: Same pattern will be detected whether viewing 1H, 4H, D, or W charts

### Implementation Details
```pinescript
// Request HTF data with historical bars for consistent pattern detection
[htfOpen, htfHigh, htfLow, htfClose, htfVolume] = request.security(
    ticker, tf, [open, high, low, close, volume], 
    lookahead=barmerge.lookahead_off
)

// Detect patterns using actual HTF data for consistency
patterns = detectHTFPatterns(htfOpen, htfHigh, htfLow, htfClose, htfVolume)
```

### Benefits
- **Reliable signals**: Patterns detected on monthly charts will always show as patterns
- **Timeframe flexibility**: Switch between timeframes without losing pattern accuracy
- **Consistent analysis**: Same ticker will show same patterns regardless of chart timeframe

## Performance Optimization

### Request Management
- **Efficient batching**: 32 requests per batch
- **Dynamic requests**: Within loops to minimize overhead
- **Request caching**: Where possible to reduce duplicate calls

### Memory Management
- **Object cleanup**: Regular deletion of old visual objects
- **Efficient data structures**: Minimize memory footprint
- **Variable scoping**: Proper variable declaration and cleanup

### Execution Optimization
- **Simplified HTF detection**: Single bar analysis for HTF data
- **Early exit conditions**: Minimize unnecessary calculations
- **Performance monitoring**: Track execution time and memory usage

## Error Handling

### Input Validation
- **Batch size limits**: 1-8 tickers per batch
- **Timeframe validation**: Ensure valid timeframe strings
- **Parameter bounds**: Min/max values for all inputs

### Runtime Error Prevention
- **NA value checks**: Handle missing data gracefully
- **Array bounds**: Prevent out-of-bounds access
- **Request limits**: Stay within Pine Script constraints

### Debug Features
- **Debug mode**: Additional information display
- **Performance metrics**: Execution time and memory usage
- **Error logging**: Track and report issues

## Security and Limitations

### Pine Script Constraints
- **Request limits**: 40 unique calls maximum
- **Execution time**: 500ms per bar
- **Memory limits**: 64MB per script
- **Array size**: 100,000 elements maximum

### Data Access
- **Symbol limitations**: Only publicly available symbols
- **Timeframe restrictions**: Standard TradingView timeframes
- **Historical data**: Limited by TradingView data availability

## Testing and Validation

### Test Scenarios
1. **Single timeframe pattern detection**
2. **Multi-timeframe pattern detection**
3. **Batch rotation functionality**
4. **Alert system reliability**
5. **Performance under load**

### Validation Criteria
- **Pattern detection accuracy**: > 95%
- **Alert reliability**: > 99%
- **Execution time**: < 400ms per bar
- **Memory usage**: < 50MB
- **No compilation errors**: 100% success rate

## Maintenance and Updates

### Regular Maintenance
- **Code optimization**: Continuous performance improvements
- **Bug fixes**: Address reported issues promptly
- **Feature updates**: Add new functionality based on user feedback

### Version Control
- **Semantic versioning**: Major.Minor.Patch format
- **Change logs**: Document all modifications
- **Backward compatibility**: Maintain compatibility where possible

## Conclusion

The Pattern Pulse Radar is a sophisticated Pine Script V6 application that provides comprehensive pattern detection capabilities while staying within platform limitations. The technical architecture ensures optimal performance, reliable pattern detection, and user-friendly operation across multiple markets and timeframes.

The system's focus on early 3-2 pattern detection gives traders the earliest possible entry signals, while the robust alert system ensures no opportunities are missed. The intelligent batching system allows for comprehensive market coverage while maintaining optimal performance.
