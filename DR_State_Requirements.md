# Pattern Pulse D&R State Machine - Technical Requirements

## State Machine Overview
The D&R (Deviation & Retracement) system tracks price movement relative to Higher Timeframe (HTF) ranges through 15 distinct states.

---

## STATE 0: NEUTRAL
**Description**: Waiting for initial deviation  
**Color**: Gray  
**Entry Conditions**: 
- Initial state on new HTF bar
- Reset when new HTF High/Low is established

**Exit Conditions**:
- `currentHigh > htfHigh` → Transition to State 1 (Deviated Above)
- `currentLow < htfLow` → Transition to State 2 (Deviated Below)

**Technical Requirements**:
- Valid HTF High and HTF Low values
- Current price data (High, Low, Close)
- No break detection flags set

---

## STATE 1: DEVIATED ABOVE
**Description**: Price broke above HTF High  
**Color**: Blue  
**Entry Conditions**: 
- From State 0: `currentHigh > htfHigh`
- From State 3: `currentClose > htfHigh`
- From State 7: `currentClose < htfHigh` (false breakout)
- From State 14: `currentClose > htfHigh`

**Exit Conditions**:
- `currentClose < htfHigh` → Check retracement levels:
  - If `currentClose < bearish50Level` → State 11 (Bearish 50%)
  - Else if `currentClose < bearish25Level` → State 10 (Bearish 25%)
  - Else → State 3 (Returned from Above)

**Technical Requirements**:
- `highWasBroken = true` flag set
- Bearish retracement levels calculated from htfHigh downward
- Monitor close price relative to htfHigh

---

## STATE 2: DEVIATED BELOW
**Description**: Price broke below HTF Low  
**Color**: Orange  
**Entry Conditions**: 
- From State 0: `currentLow < htfLow`
- From State 4: `currentLow < htfLow`
- From State 9: `currentClose < htfLow`
- From State 12: `currentClose > htfLow` (false breakdown)

**Exit Conditions**:
- `currentClose > htfLow` → Check retracement levels:
  - If `currentClose > bullish50Level` → State 6 (Bullish 50%)
  - Else if `currentClose > bullish25Level` → State 5 (Bullish 25%)
  - Else → State 4 (Returned from Below)

**Technical Requirements**:
- `lowWasBroken = true` flag set
- Bullish retracement levels calculated from htfLow upward
- Monitor close price relative to htfLow

---

## STATE 3: RETURNED FROM ABOVE
**Description**: Price returned to HTF range after breaking above  
**Color**: Purple  
**Entry Conditions**: 
- From State 1: `currentClose < htfHigh` (and not deep enough for bearish retracement)

**Exit Conditions**:
- `currentClose < bearish25Level` → State 10 (Bearish 25%)
- `currentClose > htfHigh` → State 1 (Deviated Above)

**Technical Requirements**:
- Previous high break remembered
- Bearish retracement levels active
- Monitor close relative to htfHigh and bearish25Level

---

## STATE 4: RETURNED FROM BELOW
**Description**: Price returned to HTF range after breaking below  
**Color**: Purple  
**Entry Conditions**: 
- From State 2: `currentClose > htfLow` (and not high enough for bullish retracement)

**Exit Conditions**:
- `currentClose > bullish25Level` → State 5 (Bullish 25%)
- `currentClose < htfLow` → State 2 (Deviated Below)

**Technical Requirements**:
- Previous low break remembered
- Bullish retracement levels active
- Monitor close relative to htfLow and bullish25Level

---

## STATE 5: BULLISH 25%
**Description**: Price retraced 25% from HTF Low toward HTF High  
**Color**: Green (20% transparency)  
**Entry Conditions**: 
- From State 2: Direct entry if `currentClose > bullish25Level`
- From State 4: `currentClose > bullish25Level`
- From State 9: `currentClose > bullish25Level` (recovery)

**Exit Conditions**:
- `currentClose > bullish50Level` → State 6 (Bullish 50%)
- `currentClose < bullish25Level` → State 9 (Bullish Fell 25%)

**Technical Requirements**:
- `lowWasBroken = true`
- `bullish25Level = htfLow + (htfRange × 0.25)`
- Close must be between bullish25Level and bullish50Level

---

## STATE 6: BULLISH 50%
**Description**: Price retraced 50% from HTF Low toward HTF High  
**Color**: Green (0% transparency - solid)  
**Entry Conditions**: 
- From State 2: Direct entry if `currentClose > bullish50Level`
- From State 5: `currentClose > bullish50Level`
- From State 8: `currentClose > bullish50Level` (recovery)

**Exit Conditions**:
- `currentClose > htfHigh` → State 7 (Bullish 100%)
- `currentClose < bullish50Level` → State 8 (Bullish Fell 50%)

**Technical Requirements**:
- `lowWasBroken = true`
- `bullish50Level = htfLow + (htfRange × 0.50)`
- Close must be between bullish50Level and htfHigh

---

## STATE 7: BULLISH 100%
**Description**: Price completed full retracement and broke above HTF High  
**Color**: Lime (bright green)  
**Entry Conditions**: 
- From State 6: `currentClose > htfHigh`

**Exit Conditions**:
- `currentClose < htfHigh` → State 1 (Deviated Above - false break)
- Stay in State 7 if continues above htfHigh

**Technical Requirements**:
- Successful bullish breakout
- Close must be above htfHigh
- Represents completion of bullish cycle

---

## STATE 8: BULLISH FELL 50%
**Description**: Price was above 50% retracement but fell back below  
**Color**: Green (40% transparency)  
**Entry Conditions**: 
- From State 6: `currentClose < bullish50Level`

**Exit Conditions**:
- `currentClose > bullish50Level` → State 6 (Bullish 50% - recovery)
- `currentClose < bullish25Level` → State 9 (Bullish Fell 25%)

**Technical Requirements**:
- Previously achieved bullish 50% level
- Close now between bullish25Level and bullish50Level
- Indicates potential bullish weakness

---

## STATE 9: BULLISH FELL 25%
**Description**: Price was in bullish retracement but fell back below 25%  
**Color**: Green (60% transparency)  
**Entry Conditions**: 
- From State 5: `currentClose < bullish25Level`
- From State 8: `currentClose < bullish25Level`

**Exit Conditions**:
- `currentClose > bullish25Level` → State 5 (Bullish 25% - recovery)
- `currentClose < htfLow` → State 2 (Deviated Below)

**Technical Requirements**:
- Previously in bullish retracement
- Close now below bullish25Level but above htfLow
- Indicates bullish failure/reversal

---

## STATE 10: BEARISH 25%
**Description**: Price retraced 25% from HTF High toward HTF Low  
**Color**: Red (20% transparency)  
**Entry Conditions**: 
- From State 1: Direct entry if `currentClose < bearish25Level`
- From State 3: `currentClose < bearish25Level`
- From State 14: `currentClose < bearish25Level` (recovery)

**Exit Conditions**:
- `currentClose < bearish50Level` → State 11 (Bearish 50%)
- `currentClose > bearish25Level` → State 14 (Bearish Rose 25%)

**Technical Requirements**:
- `highWasBroken = true`
- `bearish25Level = htfHigh - (htfRange × 0.25)`
- Close must be between bearish25Level and bearish50Level

---

## STATE 11: BEARISH 50%
**Description**: Price retraced 50% from HTF High toward HTF Low  
**Color**: Red (0% transparency - solid)  
**Entry Conditions**: 
- From State 1: Direct entry if `currentClose < bearish50Level`
- From State 10: `currentClose < bearish50Level`
- From State 13: `currentClose < bearish50Level` (recovery)

**Exit Conditions**:
- `currentClose < htfLow` → State 12 (Bearish 100%)
- `currentClose > bearish50Level` → State 13 (Bearish Rose 50%)

**Technical Requirements**:
- `highWasBroken = true`
- `bearish50Level = htfHigh - (htfRange × 0.50)`
- Close must be between bearish50Level and htfLow

---

## STATE 12: BEARISH 100%
**Description**: Price completed full retracement and broke below HTF Low  
**Color**: Maroon (dark red)  
**Entry Conditions**: 
- From State 11: `currentClose < htfLow`

**Exit Conditions**:
- `currentClose > htfLow` → State 2 (Deviated Below - false break)
- Stay in State 12 if continues below htfLow

**Technical Requirements**:
- Successful bearish breakdown
- Close must be below htfLow
- Represents completion of bearish cycle

---

## STATE 13: BEARISH ROSE 50%
**Description**: Price was below 50% retracement but rose back above  
**Color**: Red (40% transparency)  
**Entry Conditions**: 
- From State 11: `currentClose > bearish50Level`

**Exit Conditions**:
- `currentClose < bearish50Level` → State 11 (Bearish 50% - recovery)
- `currentClose > bearish25Level` → State 14 (Bearish Rose 25%)

**Technical Requirements**:
- Previously achieved bearish 50% level
- Close now between bearish50Level and bearish25Level
- Indicates potential bearish weakness

---

## STATE 14: BEARISH ROSE 25%
**Description**: Price was in bearish retracement but rose back above 25%  
**Color**: Red (60% transparency)  
**Entry Conditions**: 
- From State 10: `currentClose > bearish25Level`
- From State 13: `currentClose > bearish25Level`

**Exit Conditions**:
- `currentClose < bearish25Level` → State 10 (Bearish 25% - recovery)
- `currentClose > htfHigh` → State 1 (Deviated Above)

**Technical Requirements**:
- Previously in bearish retracement
- Close now above bearish25Level but below htfHigh
- Indicates bearish failure/reversal

---

## CRITICAL TECHNICAL REQUIREMENTS FOR ALL STATES

### Data Requirements:
1. **HTF Values** (stored and persistent):
   - `htfHigh` - Higher Timeframe High
   - `htfLow` - Higher Timeframe Low
   - `htfRange = htfHigh - htfLow`

2. **Current Price Data**:
   - `currentHigh` - Current bar high
   - `currentLow` - Current bar low
   - `currentClose` - Current bar close

3. **Break Detection Flags** (persistent across bars):
   - `lowWasBroken` - Boolean flag
   - `highWasBroken` - Boolean flag
   - Only ONE can be true at a time
   - Reset when new HTF bar forms

4. **Retracement Levels**:
   **When Low Was Broken** (`lowWasBroken = true`):
   - `bullish25Level = htfLow + (htfRange × 0.25)`
   - `bullish50Level = htfLow + (htfRange × 0.50)`
   - `bearish25Level = htfLow + (htfRange × 0.25)` (same as bullish)
   - `bearish50Level = htfLow + (htfRange × 0.50)` (same as bullish)

   **When High Was Broken** (`highWasBroken = true`):
   - `bullish25Level = htfHigh - (htfRange × 0.25)`
   - `bullish50Level = htfHigh - (htfRange × 0.50)`
   - `bearish25Level = htfHigh - (htfRange × 0.25)` (same as bullish)
   - `bearish50Level = htfHigh - (htfRange × 0.50)` (same as bullish)

   **When No Break** (neutral state):
   - `bullish25Level = htfHigh - (htfRange × 0.25)`
   - `bullish50Level = htfHigh - (htfRange × 0.50)`
   - `bearish25Level = htfLow + (htfRange × 0.25)`
   - `bearish50Level = htfLow + (htfRange × 0.50)`

5. **State Persistence**:
   - `currentState` - Integer (0-14) that persists across bars
   - Must use `var` keyword in Pine Script for persistence
   - State only changes when explicit transition conditions are met

### HTF Bar Reset Logic:
- **Single Ticker** (Dashboard): 
  ```pinescript
  if htfHigh != htfHigh[1] or htfLow != htfLow[1]
      newState := 0 // Reset to neutral
      lowWasBroken := false
      highWasBroken := false
  ```

- **Multi-Ticker** (Radar):
  - **PROBLEM**: `[1]` indexing doesn't work reliably
  - **NEEDED**: Alternative HTF bar change detection method
  - **OPTIONS**: 
    - Compare against stored previous HTF values per ticker
    - Use HTF bar_index comparison
    - Implement ticker-specific bar tracking

### Priority Order in State Machine:
1. Check HTF bar reset first (if implemented)
2. Evaluate current state
3. Check all exit conditions for current state
4. Apply first matching transition
5. Return new state

### Data Flow:
```
HTF Data → Storage → Break Detection → Retracement Calculation → State Machine → Display
```

### Multi-Ticker Specific Requirements:
- **Separate storage** for each ticker/timeframe combination
- **Arrays** to hold HTF values, break flags, retracement levels, and states
- **Index mapping**: `array_index = (ticker_idx × num_timeframes) + timeframe_idx`
- **Persistent arrays** declared with `var` keyword outside processing loop
- **Per-ticker price data** from `request.security()` for each ticker
- **Independent state machines** for each ticker/timeframe combination

---

## STATE TRANSITION MATRIX

| From State | To State | Condition |
|------------|----------|-----------|
| 0 | 1 | currentHigh > htfHigh |
| 0 | 2 | currentLow < htfLow |
| 1 | 3 | currentClose < htfHigh (no deep retrace) |
| 1 | 10 | currentClose < bearish25Level |
| 1 | 11 | currentClose < bearish50Level |
| 2 | 4 | currentClose > htfLow (no high retrace) |
| 2 | 5 | currentClose > bullish25Level |
| 2 | 6 | currentClose > bullish50Level |
| 3 | 1 | currentClose > htfHigh |
| 3 | 10 | currentClose < bearish25Level |
| 4 | 2 | currentClose < htfLow |
| 4 | 5 | currentClose > bullish25Level |
| 5 | 6 | currentClose > bullish50Level |
| 5 | 9 | currentClose < bullish25Level |
| 6 | 7 | currentClose > htfHigh |
| 6 | 8 | currentClose < bullish50Level |
| 7 | 1 | currentClose < htfHigh |
| 8 | 6 | currentClose > bullish50Level |
| 8 | 9 | currentClose < bullish25Level |
| 9 | 2 | currentClose < htfLow |
| 9 | 5 | currentClose > bullish25Level |
| 10 | 11 | currentClose < bearish50Level |
| 10 | 14 | currentClose > bearish25Level |
| 11 | 12 | currentClose < htfLow |
| 11 | 13 | currentClose > bearish50Level |
| 12 | 2 | currentClose > htfLow |
| 13 | 11 | currentClose < bearish50Level |
| 13 | 14 | currentClose > bearish25Level |
| 14 | 1 | currentClose > htfHigh |
| 14 | 10 | currentClose < bearish25Level |
| ANY | 0 | New HTF bar forms (reset) |

---

## DEBUGGING CHECKLIST

For each ticker/timeframe combination, verify:
- [ ] HTF High and Low are valid (not NA)
- [ ] Current prices are valid (not NA)
- [ ] Break flags are set correctly (only one can be true)
- [ ] Retracement levels calculated correctly based on break direction
- [ ] State transitions follow the matrix above
- [ ] State persists across bars (doesn't reset to 0 every bar)
- [ ] HTF bar changes detected properly (or disabled for multi-ticker)

