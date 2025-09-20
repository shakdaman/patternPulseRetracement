# HTF Deviation & Retracement - Troubleshooting Guide

## Common Issues and Solutions

### 1. Indicator Not Appearing on Chart

**Symptoms**: Indicator loads but doesn't show on price chart

**Cause**: TradingView UI behavior - indicator renders in separate pane by default

**Solution**: 
1. Drag the indicator from the separate pane onto the main price chart
2. This is a TradingView UI limitation, not a code issue

### 2. Compilation Errors

#### "Mismatched input" errors
**Cause**: Usually related to switch statement syntax or empty case blocks

**Solution**: 
- Remove empty case blocks from switch statements
- Ensure all case blocks contain actual logic, not just comments

#### "Expected const string" errors
**Cause**: Using dynamic strings in plot titles or other const-required parameters

**Solution**:
- Use static, hardcoded strings for plot titles
- Move dynamic content to alert messages or tooltips

#### Function call compilation failures
**Cause**: Long single-line function calls causing parser instability

**Solution**:
- Format all complex function calls in multi-line format
- Each argument on its own line

### 3. Alert Issues

#### No alerts triggering
**Check**:
1. Verify the indicator is properly loaded
2. Check that price action is following the expected pattern
3. Ensure retracement percentage is appropriate for the timeframe
4. Verify that the higher timeframe setting matches your analysis

#### Duplicate alerts
**Cause**: State not being reset after alert condition

**Solution**: Ensure state is reset after alert conditions:
```pinescript
if bullishAlertCondition or bearishAlertCondition
    state := 0
```

### 4. Visual Issues

#### Range box not updating
**Cause**: Box deletion logic not working properly

**Solution**: Verify the box deletion and creation logic:
```pinescript
if htfHigh != htfHigh[1]
    box.delete(htfRangeBox[1])
    htfRangeBox := box.new(...)
```

#### Retracement levels not showing
**Cause**: State machine not in monitoring state

**Solution**: Check that state is 1, 2, 3, or 4 for retracement levels to appear

### 5. Performance Issues

#### Slow indicator execution
**Causes**:
- Too many plot operations
- Inefficient state management
- Memory leaks from undeleted objects

**Solutions**:
- Minimize plot operations
- Use `var` declarations for persistent state
- Ensure proper cleanup of visual objects

## Debugging Tips

### 1. State Monitoring
Add debug plots to monitor state changes:
```pinescript
plotchar(state, "State", "•", location.top, color.white)
```

### 2. Level Verification
Plot the calculated levels to verify correct values:
```pinescript
plot(htfHigh, "HTF High", color.blue, linewidth = 1)
plot(htfLow, "HTF Low", color.blue, linewidth = 1)
```

### 3. Alert Testing
Use simple alert conditions for testing:
```pinescript
if state == 3
    alert("State 3 - Monitoring for bullish retracement")
```

## Version Compatibility

### Pine Script v6 Specific Features Used
- `ta.crossunder()` and `ta.crossover()` functions
- Enhanced `request.security()` functionality
- Improved `box` object management
- Modern `input.timeframe()` syntax

### Backward Compatibility
This indicator requires Pine Script v6 and will not work on older versions due to:
- `ta.crossunder()`/`ta.crossover()` functions
- Modern input syntax
- Enhanced security functions

## Support and Maintenance

### Regular Maintenance Tasks
1. **Test on different timeframes**: Ensure indicator works across various chart timeframes
2. **Verify alert functionality**: Test alerts on different symbols and timeframes
3. **Check visual accuracy**: Ensure range boxes and retracement levels are correctly positioned
4. **Performance monitoring**: Watch for any slowdowns or memory issues

### Future Enhancements
- Custom color options for visual elements
- Additional retracement percentage presets
- Multi-timeframe support
- Strategy conversion for backtesting
