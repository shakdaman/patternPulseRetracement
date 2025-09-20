# CURSORRULES.md - Pine Script Development Guidelines

## Pine Script v6 Development Rules

### Code Formatting and Compiler Stability

1. **CRITICAL: Multi-line String Handling**: Pine Script v6 requires string concatenation for long strings to avoid "end of line without line continuation" errors:
   ```pinescript
   // ❌ INCORRECT - Long strings cause line continuation error
   tooltip = "This is a very long tooltip string that exceeds the recommended length and causes compilation errors in Pine Script v6"
   
   // ✅ CORRECT - Use string concatenation for long strings
   tooltip = "This is a very long tooltip string that exceeds " +
             "the recommended length and causes compilation " +
             "errors in Pine Script v6"
   ```

2. **Multi-line Function Calls**: Always format complex function calls in multi-line format to prevent Pine Script compiler instability:
   ```pinescript
   // ✅ CORRECT - Multi-line format
   box.new(
        left = bar_index,
        top = htfHigh,
        right = bar_index,
        bottom = htfLow,
        border_color = color.new(color.gray, 40),
        border_style = line.style_dashed,
        extend = extend.right,
        bgcolor = na
   )
   
   // ❌ INCORRECT - Single line causes compilation errors
   box.new(left=bar_index, top=htfHigh, right=bar_index, bottom=htfLow, border_color=color.gray, border_style=line.style_dashed, extend=extend.right, bgcolor=na)
   ```

2. **Reserved Keywords**: Never use Pine Script reserved keywords as variable names:
   ```pinescript
   // ❌ INCORRECT - 'range' is reserved
   var float range = htfHigh - htfLow
   
   // ✅ CORRECT - Use descriptive names
   var float htfRange = htfHigh - htfLow
   ```

3. **Switch Statement Syntax**: Never include empty case blocks, even with comments:
   ```pinescript
   // ❌ INCORRECT - Empty cases cause "Mismatched input" errors
   switch state
       0 => // Neutral state
       1 => // Deviated Above
       2 => // Deviated Below
       3 => // Empty case
       4 => // Empty case
   
   // ✅ CORRECT - Only include cases with actual logic
   switch state
       0 => if high > htfHigh then state := 1
       1 => if close < htfHigh then state := 3
   ```

4. **Const String Requirements**: Plot titles and other const-required parameters must use static strings:
   ```pinescript
   // ❌ INCORRECT - Dynamic titles cause compilation errors
   plot(series, title = "Level " + str.tostring(percent) + "%")
   
   // ✅ CORRECT - Use static titles
   plot(series, title = "Retracement Level")
   ```

### State Management and Logic

5. **State Machine Pattern**: Use state machines for complex trading logic:
   ```pinescript
   // State management with proper reset logic
   var int state = 0
   if htfHigh != htfHigh[1]  // Reset on new HTF bar
       state := 0
   
   // Alert conditions reset state to prevent duplicates
   if bullishAlertCondition or bearishAlertCondition
       state := 0
   ```

6. **Memory Management**: Always clean up visual objects to prevent memory leaks:
   ```pinescript
   var box htfRangeBox = na
   if htfHigh != htfHigh[1]
       box.delete(htfRangeBox[1])  // Delete old object
       htfRangeBox := box.new(...) // Create new object
   ```

### Performance and Best Practices

7. **Conditional Plotting**: Only plot elements when they're relevant:
   ```pinescript
   // Only plot retracement levels during active monitoring
   plot(series = state == 1 or state == 3 ? bullishRetraceLevel : na, ...)
   ```

8. **Repainting Prevention**: Always use proper `request.security()` configuration:
   ```pinescript
   [htfHigh, htfLow] = request.security(
        symbol = syminfo.tickerid,
        timeframe = i_htf,
        expression = [high[1], low[1]],
        lookahead = barmerge.lookahead_off  // Prevent repainting
   )
   ```

9. **Variable Declarations**: Use appropriate variable types:
   ```pinescript
   var int state = 0           // Persistent state
   var box htfRangeBox = na    // Persistent visual object
   htfRange = htfHigh - htfLow // Calculated value (not var)
   ```

### Error Prevention

10. **Incremental Development**: Test compilation after each major change
11. **Input Validation**: Use appropriate min/max values for user inputs
12. **Alert Management**: Ensure alerts don't trigger duplicates by resetting state
13. **Visual Cleanup**: Delete old objects before creating new ones

### Pine Script v6 Specific Features

14. **Use Modern Functions**: Leverage Pine Script v6 improvements:
    - `ta.crossunder()` and `ta.crossover()` for reliable cross detection
    - Enhanced `request.security()` functionality
    - Modern `input.timeframe()` syntax
    - Improved `box` object management

15. **Version Compatibility**: This project requires Pine Script v6 and will not work on older versions

## General Development Guidelines

- Always check for duplicate methods/functions before creating new ones
- Use PowerShell-compatible commands (no `&&` operators)
- Follow Windows-compatible command syntax
- Test on multiple timeframes and symbols
- Document complex logic with clear comments
- Use descriptive variable and function names
- Group related functionality logically
- Maintain clean, readable code structure

## File Organization

- Place all Pine Script files in the root directory
- Store documentation in `/docs` directory
- Use descriptive file names with `.pine` extension
- Keep related files together (indicator + documentation)
- Remove temporary files after completion

## Testing and Validation

- Test compilation after each change
- Verify functionality across different timeframes
- Check alert behavior on various symbols
- Validate visual accuracy of plotted elements
- Ensure no memory leaks or performance issues
