# HTF Deviation & Retracement - Development Notes

## Pine Script v6 Compiler Challenges & Solutions

### 1. CRITICAL: Multi-line String Handling (Most Common Error)

**Problem**: "Mismatched input 'end of line without line continuation' expecting ')'" error with long strings
```pinescript
// ❌ Causes compilation error - long strings need concatenation
tooltip = "This is a very long tooltip string that exceeds the recommended length and causes compilation errors in Pine Script v6"
```

**Solution**: Use string concatenation with `+` operator for long strings
```pinescript
// ✅ Correct syntax - use string concatenation
tooltip = "This is a very long tooltip string that exceeds " +
          "the recommended length and causes compilation " +
          "errors in Pine Script v6"
```

**Lesson**: Pine Script v6 requires string concatenation for long strings. Keep tooltips under 100 characters per line and use `+` operator for multi-line strings.

### 2. Reserved Keyword Conflicts

**Problem**: Using `range` as a variable name
```pinescript
// ❌ This causes compilation error
var float range = htfHigh - htfLow
```

**Solution**: Rename to descriptive variable
```pinescript
// ✅ Compiler-safe naming
var float htfRange = htfHigh - htfLow
```

**Lesson**: Always check Pine Script reserved keywords before naming variables.

### 2. Switch Statement Parsing Issues

**Problem**: Empty case blocks with only comments
```pinescript
// ❌ Causes "Mismatched input" error
switch state
    0 => // Neutral state
    1 => // Deviated Above
    2 => // Deviated Below
    3 => // Returned from Above - empty block
    4 => // Returned from Below - empty block
```

**Solution**: Remove empty case blocks
```pinescript
// ✅ Only include cases with actual logic
switch state
    0 => // Neutral state: waiting for deviation
        if high > htfHigh
            state := 1
        else if low < htfLow
            state := 2
    1 => // Deviated Above: waiting for return
        if close < htfHigh
            state := 3
    2 => // Deviated Below: waiting for return
        if close > htfLow
            state := 4
```

**Lesson**: Pine Script compiler cannot parse empty switch cases, even with comments.

### 3. Dynamic Plot Title Restrictions

**Problem**: Attempting to use dynamic titles
```pinescript
// ❌ Compilation error - title must be const string
plot(series, title = "Retracement " + str.tostring(i_retracePercent) + "%")
```

**Solution**: Use static, descriptive titles
```pinescript
// ✅ Static title works
plot(series, title = "Bullish Retracement")
```

**Lesson**: Pine Script plot titles must be compile-time constants.

### 4. Multi-line Function Call Stability

**Problem**: Long single-line function calls cause parser instability
```pinescript
// ❌ Unstable - often causes compilation errors
box.new(left = bar_index, top = htfHigh, right = bar_index, bottom = htfLow, border_color = color.new(color.gray, 40), border_style = line.style_dashed, extend = extend.right, bgcolor = na)
```

**Solution**: Multi-line format with each argument on separate line
```pinescript
// ✅ Stable and readable
htfRangeBox := box.new(
     left = bar_index,
     top = htfHigh,
     right = bar_index,
     bottom = htfLow,
     border_color = color.new(color.gray, 40),
     border_style = line.style_dashed,
     extend = extend.right,
     bgcolor = na
)
```

**Lesson**: Always use multi-line format for complex function calls in Pine Script v6.

## Best Practices for Pine Script v6

### Code Organization
1. **Group related functionality**: Keep inputs, calculations, logic, and visuals separate
2. **Use descriptive variable names**: Avoid reserved keywords and abbreviations
3. **Comment state machine logic**: Document each state transition clearly
4. **Multi-line function calls**: Format complex functions for readability and stability

### Error Prevention
1. **Test incrementally**: Add features one at a time and test compilation
2. **Use const strings**: For plot titles, alert messages, and other compile-time requirements
3. **Avoid empty blocks**: In switch statements and conditional logic
4. **Validate inputs**: Use appropriate min/max values for user inputs

### Performance Optimization
1. **Minimize plot operations**: Only plot when necessary
2. **Use var declarations**: For persistent state variables
3. **Efficient state management**: Reset states appropriately to prevent memory leaks
4. **Clean visualization**: Delete old objects before creating new ones

## Common Pitfalls to Avoid

1. **Repainting**: Always use `lookahead = barmerge.lookahead_off` with `request.security()`
2. **Duplicate alerts**: Reset state after alert conditions to prevent multiple signals
3. **Memory leaks**: Delete old box objects before creating new ones
4. **Compilation errors**: Use multi-line format for complex function calls
5. **UI issues**: Remember that indicator placement is a TradingView UI behavior, not code-related
