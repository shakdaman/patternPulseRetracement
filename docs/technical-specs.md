# HTF Deviation & Retracement - Technical Specifications

## Pine Script v6 Implementation Details

### Core Architecture

The indicator is built around a state machine that tracks the progression of the trading setup through 5 distinct states:

```pinescript
// State Management
var int state = 0
// 0: Neutral, 1: Deviated Above, 2: Deviated Below, 3: Returned from Above, 4: Returned from Below
```

### Data Retrieval

Uses `request.security()` to fetch higher timeframe data:

```pinescript
[htfHigh, htfLow] = request.security(
     symbol = syminfo.tickerid,
     timeframe = i_htf,
     expression = [high[1], low[1]],
     lookahead = barmerge.lookahead_off
)
```

**Key Points:**
- Uses `high[1], low[1]` to get the PREVIOUS closed candle
- `lookahead = barmerge.lookahead_off` prevents repainting
- Fetches data from user-configurable higher timeframe

### State Machine Logic

The state machine handles the complete setup lifecycle:

1. **State 0 (Neutral)**: Monitors for range breaks
2. **State 1 (Deviated Above)**: Price broke above HTF high, waiting for return
3. **State 2 (Deviated Below)**: Price broke below HTF low, waiting for return
4. **State 3 (Returned from Above)**: Monitoring for bullish retracement cross
5. **State 4 (Returned from Below)**: Monitoring for bearish retracement cross

### Retracement Calculation

```pinescript
htfRange = htfHigh - htfLow
retraceValue = htfRange * (i_retracePercent / 100.0)
bullishRetraceLevel = htfHigh - retraceValue
bearishRetraceLevel = htfLow + retraceValue
```

### Alert Conditions

- **Bullish**: `state == 3 and ta.crossunder(low, bullishRetraceLevel)`
- **Bearish**: `state == 4 and ta.crossover(high, bearishRetraceLevel)`

### Visualization Strategy

- **Range Box**: Single box object extended right, previous deleted on new HTF bar
- **Retracement Levels**: Circles plotted only during active monitoring states
- **Signals**: Labels plotted only on alert condition bars
- **Background**: Color coding for current state

## Performance Considerations

- State machine resets on new HTF bar formation
- Alert conditions reset state to prevent duplicate signals
- Efficient use of `var` declarations for persistent state
- Minimal plot operations to reduce computational overhead
