# ORB Detector Multi-Ticker Implementation Plan

## Analysis Summary

### Retracement Radar v2 Enhanced Patterns:

1. **Multi-Ticker Input System:**
   - Uses `input.text_area()` for newline-separated symbol list
   - `f_parseSymbols()` parses symbols into string array
   - Limits to 20 symbols per instance
   - Each symbol processed independently in a loop

2. **State Management:**
   - Custom type `SymbolState` stores per-symbol state
   - Global maps: `g_symbolStateMap` (state) and `g_sentStateMap` (duplicate prevention)
   - Symbol key format: `symbol + "|" + timeframe`
   - Uses `request.security()` to fetch data for each symbol

3. **JSON Payload Generation:**
   - Manual string concatenation (Pine Script has no JSON library)
   - `f_buildJsonPayload()` constructs complete JSON object
   - Includes all relevant fields: timestamp, ticker, prices, event type, etc.

4. **Alert System:**
   - Hash-based duplicate prevention: `f_getStateHash()` creates unique identifier
   - Compares current hash vs last sent hash
   - Only sends if `current_hash != last_sent_hash`
   - Uses `alert(json_payload, alert.freq_once_per_bar_close)`

5. **Visualization:**
   - Processes all symbols but only visualizes current chart symbol
   - Alert markers optional via `show_alert_markers` input

---

## Implementation Plan for ORB Detector

### Phase 1: Add Multi-Ticker Infrastructure

#### 1.1 User Inputs
```pinescript
// Symbol Configuration
symbols_input = input.text_area(
    title="Symbols to Monitor", 
    defval="NASDAQ:AAPL\nNASDAQ:MSFT\nNASDAQ:GOOGL", 
    tooltip="Enter symbols to monitor (one per line). Max 20 symbols per script instance.", 
    group="Symbol Configuration"
)

// Alert Configuration
enable_alerts = input.bool(
    title="Enable Webhook Alerts", 
    defval=true, 
    tooltip="Enable/disable webhook alerts to Supabase", 
    group="Alert Configuration"
)
```

#### 1.2 Create ORBState Type
```pinescript
type ORBState
    string symbol
    float openingRangeHigh
    float openingRangeLow
    bool isRangeSet
    int rangeStartBar
    int rangeEndBar
    bool breakoutUpOccurred
    bool breakoutDownOccurred
    bool retestUpConfirmed
    bool retestDownConfirmed
    int breakoutUpBar
    int breakoutDownBar
    bool retestUpTouched
    bool retestDownTouched
    int lastUpdateTime
    string eventType  // "breakout_up", "breakout_down", "retest_up", "retest_down"
```

#### 1.3 Global State Maps
```pinescript
var map<string, ORBState> g_orbStateMap = map.new<string, ORBState>()
var map<string, string> g_sentStateMap = map.new<string, string>()
```

#### 1.4 Helper Functions
```pinescript
f_parseSymbols() => // Parse newline-separated symbols
f_generateSymbolKey(symbol) => symbol + "|" + str.tostring(orbMinutesInput)
f_getStateHash(orbState, eventType) => // Create unique hash for duplicate prevention
```

---

### Phase 2: Refactor ORB Logic for Multi-Symbol Processing

#### 2.1 Create Symbol Processing Function
```pinescript
f_processSymbol(symbol) =>
    // Use request.security() to get current symbol data
    [current_high, current_low, current_close, current_time] = request.security(
        symbol, 
        timeframe.period, 
        [high, low, close, time], 
        lookahead=barmerge.lookahead_off
    )
    
    // Get or create ORBState for this symbol
    symbol_key = f_generateSymbolKey(symbol)
    orbState = map.get(g_orbStateMap, symbol_key)
    
    // Initialize if new symbol
    if na(orbState)
        orbState := ORBState.new(...)
        map.put(g_orbStateMap, symbol_key, orbState)
    
    // Calculate session times for this symbol
    // (May need exchange-specific logic)
    
    // Run ORB detection logic (refactored from current code)
    // - Detect new day
    // - Form ORB range
    // - Detect breakouts
    // - Detect retests
    
    // Return: [event_occurred, orbState, current_price, event_type]
```

#### 2.2 Refactor Existing ORB Logic
- Extract current ORB detection into `f_updateORBState(orbState, current_high, current_low, current_close, current_time)`
- Make it symbol-agnostic (work with ORBState object)
- Handle session time detection per symbol (exchange timezone matters)

---

### Phase 3: JSON Payload Generation

#### 3.1 Build JSON Payload Function
```pinescript
f_buildJsonPayload(orbState, current_price, event_type) =>
    timestamp = math.round(time * 1000)
    
    json1 = '{"event_timestamp":' + str.tostring(timestamp)
    json2 = ',"ticker":"' + orbState.symbol + '"'
    json3 = ',"timeframe":"' + timeframe.period + '"'
    json4 = ',"event_type":"' + event_type + '"'
    json5 = ',"orb_high":' + str.tostring(orbState.openingRangeHigh, "#.####")
    json6 = ',"orb_low":' + str.tostring(orbState.openingRangeLow, "#.####")
    json7 = ',"orb_size":' + str.tostring(orbState.openingRangeHigh - orbState.openingRangeLow, "#.####")
    json8 = ',"current_price":' + str.tostring(current_price, "#.####")
    json9 = ',"orb_range_duration_minutes":' + str.tostring(orbMinutesInput)
    json10 = ',"session_start":"' + sessionStartInput + '"'
    json11 = ',"breakout_up_occurred":' + str.tostring(orbState.breakoutUpOccurred)
    json12 = ',"breakout_down_occurred":' + str.tostring(orbState.breakoutDownOccurred)
    json13 = ',"retest_up_confirmed":' + str.tostring(orbState.retestUpConfirmed)
    json14 = ',"retest_down_confirmed":' + str.tostring(orbState.retestDownConfirmed)
    
    // Calculate ATR Fuel if applicable
    // Add any other relevant fields
    
    json15 = '}'
    json1 + json2 + json3 + json4 + json5 + json6 + json7 + json8 + json9 + json10 + json11 + json12 + json13 + json14 + json15
```

#### 3.2 Event Types
- `"orb_breakout_up"` - Initial breakout above ORB High
- `"orb_breakout_down"` - Initial breakout below ORB Low
- `"orb_retest_up_confirmed"` - Bullish retest confirmed
- `"orb_retest_down_confirmed"` - Bearish retest confirmed

---

### Phase 4: Main Execution Loop

#### 4.1 Symbol Processing Loop
```pinescript
symbols = f_parseSymbols()
symbol_count = array.size(symbols)

if symbol_count > 20
    runtime.error("Too many symbols! Maximum 20 symbols allowed per script instance.")

// Process current chart symbol (for visualization)
current_symbol = syminfo.tickerid
if array.includes(symbols, current_symbol)
    f_processSymbol(current_symbol)  // For visual display

// Process all symbols in loop (for alerts)
for i = 0 to symbol_count - 1
    symbol = array.get(symbols, i)
    [event_occurred, orbState, symbol_price, event_type] = f_processSymbol(symbol)
    
    if event_occurred and not na(orbState)
        symbol_key = f_generateSymbolKey(symbol)
        current_hash = f_getStateHash(orbState, event_type)
        last_sent_hash = map.get(g_sentStateMap, symbol_key + "|" + event_type)
        
        // Only send if hash changed (prevent duplicates)
        if current_hash != last_sent_hash
            json_payload = f_buildJsonPayload(orbState, symbol_price, event_type)
            
            if enable_alerts
                alert(json_payload, alert.freq_once_per_bar_close)
            
            map.put(g_sentStateMap, symbol_key + "|" + event_type, current_hash)
```

---

### Phase 5: Visualization Updates

#### 5.1 Chart-Specific Visualization
- Only draw ORB visuals for current chart symbol (`syminfo.tickerid`)
- Check if current symbol is in symbols array before drawing
- Keep existing visualization code but wrap in symbol check

#### 5.2 Optional Alert Markers (Future Enhancement)
```pinescript
show_alert_markers = input.bool(true, "Show Alert Markers", ...)

if show_alert_markers and event_occurred and symbol == syminfo.tickerid
    // Draw flags, lines, labels for alerts on current chart
```

---

## Key Challenges & Solutions

### Challenge 1: Session Time Zone Per Symbol
**Solution:** 
- Use `request.security()` with exchange timezone
- May need symbol-specific session detection
- Consider using `syminfo.exchange` to determine market hours

### Challenge 2: New Day Detection Per Symbol
**Solution:**
- Track `lastUpdateTime` in ORBState
- Compare against daily boundaries per symbol
- Reset ORB state when new day detected

### Challenge 3: Performance with Multiple Symbols
**Solution:**
- Limit to 20 symbols (already enforced)
- Use `barstate.islast` for visualization updates only
- Process all symbols but minimize visual overhead

### Challenge 4: JSON String Escaping
**Solution:**
- Ensure symbol names don't contain special chars that break JSON
- Use proper string escaping if needed
- Test with various symbol formats

---

## Implementation Steps (Order of Execution)

1. ✅ Add multi-ticker input fields
2. ✅ Create ORBState type definition
3. ✅ Create global state maps
4. ✅ Implement `f_parseSymbols()` and `f_generateSymbolKey()`
5. ✅ Implement `f_getStateHash()` for duplicate prevention
6. ✅ Refactor existing ORB logic into `f_updateORBState()` function
7. ✅ Create `f_processSymbol()` wrapper function
8. ✅ Implement `f_buildJsonPayload()` function
9. ✅ Update main execution to process multiple symbols
10. ✅ Update visualization to only show current chart symbol
11. ✅ Test with single symbol first
12. ✅ Test with multiple symbols
13. ✅ Verify JSON payload format matches Supabase schema
14. ✅ Test alert triggering and webhook delivery

---

## Testing Checklist

- [ ] Single symbol works (backward compatibility)
- [ ] Multiple symbols processed correctly
- [ ] ORB detection works per symbol independently
- [ ] Breakout events trigger alerts
- [ ] Retest events trigger alerts
- [ ] Duplicate alerts prevented (hash system)
- [ ] JSON payload is valid JSON
- [ ] JSON contains all required fields
- [ ] Visualization only shows for current chart symbol
- [ ] Performance acceptable with 20 symbols
- [ ] Session time detection works across exchanges
- [ ] New day detection works correctly

---

## Notes

1. **Backward Compatibility:** The script should still work with single symbol (current chart) if no symbols input provided
2. **Exchange Handling:** May need special handling for different exchanges (NYSE vs NASDAQ vs Crypto)
3. **Timeframe:** Current script uses chart timeframe; consider if multi-timeframe needed
4. **Supabase Schema:** Ensure JSON payload matches your database table structure
5. **Alert Frequency:** Using `alert.freq_once_per_bar_close` prevents spam but may miss rapid-fire events

---

## Future Enhancements

1. Add symbol-specific ORB duration configuration
2. Add symbol-specific session start time
3. Add volume-based confirmation in JSON payload
4. Add ATR Fuel calculation to JSON
5. Add visual alert markers on chart
6. Add debug table showing all symbol states
7. Add filtering options (only alert on breakout, only alert on retest, etc.)



