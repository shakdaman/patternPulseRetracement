# Financial Analysis Web Application Development Prompt

## Project Overview
Design and develop two interconnected web applications that replicate TradingView Pine Script indicators for candlestick pattern detection and Deviation & Retracement (D&R) analysis. The applications must provide real-time financial analysis capabilities outside of TradingView using modern web technologies and financial market APIs.

---

## Application 1: Pattern Pulse Radar Web App

### Core Functionality
**Purpose**: Multi-ticker, multi-timeframe candlestick pattern detection system that monitors up to 8 tickers across 5 timeframes simultaneously, displaying detected patterns in an interactive radar table.

### Pattern Detection Requirements

#### Bullish Patterns (6 Total)
1. **Hammer** - Long lower shadow (2x body size), small body, minimal upper shadow, appears after downtrend
2. **Inverted Hammer** - Long upper shadow (2x body size), small body, minimal lower shadow, appears after downtrend
3. **Dragonfly Doji** - Small body (<10% of range), long lower shadow, minimal upper shadow
4. **Piercing Line** - Two-candle pattern: bearish candle followed by bullish that penetrates 50%+ into previous body
5. **Three White Soldiers** - Three consecutive bullish candles, progressive higher closes, minimal upper shadows
   - **Early Detection**: Signal on 2nd candle (marked with *)
6. **Morning Star** - Three-candle pattern: large bearish + small body with gap + large bullish
   - **Early Detection**: Signal on 2nd candle (marked with *)

#### Bearish Patterns (6 Total)
7. **Hanging Man** - Long lower shadow (2x body size), small body, minimal upper shadow, appears after uptrend
8. **Shooting Star** - Long upper shadow (2x body size), small body, minimal lower shadow, appears after uptrend
9. **Gravestone Doji** - Small body (<10% of range), long upper shadow, minimal lower shadow
10. **Dark Cloud Cover** - Two-candle pattern: bullish candle followed by bearish that penetrates 50%+ into previous body
11. **Three Black Crows** - Three consecutive bearish candles, progressive lower closes, minimal lower shadows
    - **Early Detection**: Signal on 2nd candle (marked with *)
12. **Evening Star** - Three-candle pattern: large bullish + small body with gap + large bearish
    - **Early Detection**: Signal on 2nd candle (marked with *)

#### STRAT Patterns (2 Total)
13. **Inside Bar** - Current bar's high < previous high AND low > previous low
14. **3-2 Combo** - Outside bar (engulfs previous) followed by directional break

### Technical Requirements

#### Data Requirements
- **Historical Data**: Minimum 5 bars of OHLC (Open, High, Low, Close) data per timeframe
- **Timeframes**: 4-Hour (4H), Daily (1D), Weekly (1W), Monthly (1M), Quarterly (3M)
- **Batch System**: Support for 23 predefined ticker batches (8 tickers each)
- **Real-time Updates**: Data refresh on bar close or user-defined intervals

#### Pattern Detection Logic
- **Trend Context Validation**: 
  - Downtrend: At least 2 of last 3 closes showing lower prices
  - Uptrend: At least 2 of last 3 closes showing higher prices
- **Shadow Ratio Analysis**: Calculate upper/lower shadows relative to body size
- **Body Size Analysis**: Distinguish between doji patterns (small body) and standard candles
- **Multi-candle Patterns**: Track relationships across 2-3 consecutive candles
- **Early Detection**: Provide preliminary signals before pattern completion (with visual indicator)

#### Display Requirements
- **Radar Table Format**: 
  - Rows: 8 tickers (user-selectable batch)
  - Columns: 5 timeframes
  - Cells: Pattern names or prices (if no pattern)
- **Color Coding**:
  - Green (bullish patterns)
  - Red (bearish patterns)
  - Gray (STRAT patterns)
  - Priority: STRAT > Bearish > Bullish when multiple patterns detected
- **Pattern Abbreviations**: 
  - Hammer, InvHam, DragDoj, Pierce, 3WSold, MornStr
  - HangMan, ShootStr, GravDoj, DarkCl, 3BCrow, EvenStr
  - Inside, 3-2Combo
  - Early detection marked with asterisk (*)

#### User Controls
- Batch selection dropdown (23 batches)
- Individual pattern toggles (enable/disable specific patterns)
- Category toggles (bullish/bearish/STRAT)
- Timeframe selection
- Table position configuration
- Performance metrics display toggle
- Current price display option

---

## Application 2: D&R (Deviation & Retracement) Radar Web App

### Core Functionality
**Purpose**: Multi-ticker, multi-timeframe state machine that tracks price deviations from Higher Timeframe (HTF) ranges and retracement levels, providing 15 distinct market states.

### State Machine Requirements

#### 15 Market States

**Initial States (0-4):**
- **State 0 - Neutral**: Waiting for initial deviation (Gray)
- **State 1 - Deviated Above**: Price broke above HTF High (Blue)
- **State 2 - Deviated Below**: Price broke below HTF Low (Orange)
- **State 3 - Returned from Above**: Price returned to range after breaking high (Purple)
- **State 4 - Returned from Below**: Price returned to range after breaking low (Purple)

**Bullish Retracement States (5-9):**
- **State 5 - Bullish 25%**: Price retraced 25% from HTF Low toward HTF High (Green 20%)
- **State 6 - Bullish 50%**: Price retraced 50% from HTF Low toward HTF High (Green 0%)
- **State 7 - Bullish 100%**: Price broke above HTF High (Lime)
- **State 8 - Bullish Fell 50%**: Price fell back below 50% level (Green 40%)
- **State 9 - Bullish Fell 25%**: Price fell back below 25% level (Green 60%)

**Bearish Retracement States (10-14):**
- **State 10 - Bearish 25%**: Price retraced 25% from HTF High toward HTF Low (Red 20%)
- **State 11 - Bearish 50%**: Price retraced 50% from HTF High toward HTF Low (Red 0%)
- **State 12 - Bearish 100%**: Price broke below HTF Low (Maroon)
- **State 13 - Bearish Rose 50%**: Price rose back above 50% level (Red 40%)
- **State 14 - Bearish Rose 25%**: Price rose back above 25% level (Red 60%)

### Technical Requirements

#### Data Requirements
- **HTF Data**: High and Low for each timeframe
- **Current Ticker Data**: High, Low, Close for each ticker
- **Timeframes**: Daily (1D), Weekly (1W), Monthly (1M), Quarterly (3M), 6 Months (6M)
- **Persistent Storage**: State, break flags, HTF values, retracement levels must persist across data updates

#### Break Detection Logic
- **Initial Break**: Detect if price broke HTF High or HTF Low first
- **Break Flags**: 
  - `lowWasBroken`: Boolean flag (true when low broken first)
  - `highWasBroken`: Boolean flag (true when high broken first)
  - Only ONE can be true at a time
- **Reset Condition**: When new HTF bar forms, reset break flags and state to Neutral

#### Retracement Level Calculations

**When Low Was Broken First:**
```
htfRange = htfHigh - htfLow
bullish25Level = htfLow + (htfRange × 0.25)
bullish50Level = htfLow + (htfRange × 0.50)
bearish25Level = htfLow + (htfRange × 0.25)
bearish50Level = htfLow + (htfRange × 0.50)
```

**When High Was Broken First:**
```
htfRange = htfHigh - htfLow
bullish25Level = htfHigh - (htfRange × 0.25)
bullish50Level = htfHigh - (htfRange × 0.50)
bearish25Level = htfHigh - (htfRange × 0.25)
bearish50Level = htfHigh - (htfRange × 0.50)
```

**When No Break (Neutral State):**
```
htfRange = htfHigh - htfLow
bullish25Level = htfHigh - (htfRange × 0.25)
bullish50Level = htfHigh - (htfRange × 0.50)
bearish25Level = htfLow + (htfRange × 0.25)
bearish50Level = htfLow + (htfRange × 0.50)
```

#### State Transition Logic

**Complete State Transition Matrix** (see DR_State_Requirements.md for full details):
- State 0 → State 1 (if currentHigh > htfHigh)
- State 0 → State 2 (if currentLow < htfLow)
- State 1 → State 3, 10, or 11 (based on close price vs retracement levels)
- State 2 → State 4, 5, or 6 (based on close price vs retracement levels)
- [Complete 15-state transition matrix required]

#### Display Requirements
- **Radar Table Format**:
  - Rows: 8 tickers (user-selectable batch)
  - Columns: 5 timeframes
  - Cells: State name with color coding
- **Color Intensity**: 
  - 0% transparency = strongest signal
  - 20% = moderate signal
  - 40% = weakening signal
  - 60% = weakest signal
- **Debug Tables** (optional):
  - HTF High/Low values
  - Current prices
  - Break detection status
  - Retracement level values
  - State transition details

#### User Controls
- Batch selection dropdown (same 23 batches as Pattern Radar)
- Timeframe selection
- Table position configuration
- Debug information toggle
- Performance metrics toggle

---

## Shared Technical Requirements

### API Integration Requirements

#### Market Data APIs (Choose One or Multiple)
Research and recommend best practices for:
1. **Alpha Vantage** - Free tier limitations, historical data access
2. **Polygon.io** - Real-time and historical data, WebSocket support
3. **Finnhub** - Multi-exchange support, candlestick data quality
4. **IEX Cloud** - Data accuracy, API rate limits
5. **Yahoo Finance (yfinance)** - Free alternative considerations
6. **TradingView API** - Direct integration if available

#### API Requirements Analysis
- **Rate Limits**: How to handle 40+ simultaneous ticker/timeframe combinations
- **Data Freshness**: Real-time vs delayed data implications
- **Historical Data**: Minimum 5 bars needed for pattern detection
- **Cost Analysis**: Free tier vs paid plans for production use
- **WebSocket Support**: Real-time updates vs polling strategies
- **Data Quality**: Missing data handling, gap management
- **Multi-Exchange Support**: NYSE, NASDAQ, AMEX, CBOE coverage

### Technology Stack Recommendations

#### Frontend Requirements
- **Framework**: React, Vue.js, or Angular (recommend with justification)
- **State Management**: Redux, Vuex, or Context API for persistent state
- **Data Visualization**: 
  - Interactive tables (AG Grid, Material-UI DataGrid)
  - Color-coded cells with hover tooltips
  - Responsive design for mobile/tablet
- **Real-time Updates**: WebSocket integration or polling mechanism
- **Performance**: Handle 40+ simultaneous data streams efficiently

#### Backend Requirements
- **Language/Framework**: Node.js, Python (FastAPI/Flask), or Go (recommend with justification)
- **Pattern Detection Engine**: 
  - Implement all 14 candlestick patterns
  - Implement 15-state D&R state machine
  - Historical data analysis
  - Trend context validation
- **Data Management**:
  - Caching strategy for historical data
  - State persistence (database or in-memory)
  - Break detection flag management
  - HTF value storage
- **API Design**: RESTful or GraphQL endpoints
- **WebSocket Server**: For real-time updates if applicable

#### Database Requirements
- **Time-Series Database**: InfluxDB, TimescaleDB, or MongoDB (recommend with justification)
- **Schema Design**:
  - OHLC data storage
  - Pattern detection results
  - State machine history
  - User preferences and configurations
- **Query Optimization**: Fast retrieval for multi-ticker analysis
- **Data Retention**: Historical data storage policies

### Specific Implementation Challenges to Address

#### Challenge 1: Multi-Ticker State Persistence
**Problem**: How to maintain 40+ independent state machines (8 tickers × 5 timeframes) with persistent break detection flags and retracement levels?

**Requirements**:
- Separate storage for each ticker/timeframe combination
- State must persist across data updates
- Break flags must persist until HTF bar change
- HTF values must update only on confirmed bars

#### Challenge 2: HTF Bar Change Detection
**Problem**: How to detect when a Higher Timeframe bar completes for state reset in a multi-ticker environment?

**Requirements**:
- Track bar index or timestamp per HTF timeframe
- Compare current vs previous HTF bar identification
- Reset state and break flags only on new HTF bar
- Handle asynchronous bar timing across different tickers

#### Challenge 3: Trend Context Validation
**Problem**: How to efficiently validate trend context (2 of 3 bars showing trend direction) for pattern detection?

**Requirements**:
- Maintain at least 5 bars of historical data per ticker/timeframe
- Calculate trend direction for previous 3 closes
- Apply trend context to relevant patterns only
- Update trend status on each new bar

#### Challenge 4: Pattern Detection Optimization
**Problem**: How to efficiently detect 14 patterns across 40 ticker/timeframe combinations in real-time?

**Requirements**:
- Vectorized calculations where possible
- Parallel processing for multiple tickers
- Caching of intermediate calculations (shadow ratios, body sizes)
- Incremental updates rather than full recalculation

#### Challenge 5: Real-Time Data Updates
**Problem**: How to handle real-time data updates without exceeding API rate limits?

**Requirements**:
- Implement intelligent polling intervals
- Use WebSocket connections when available
- Batch API requests efficiently
- Handle API failures gracefully
- Cache data to minimize redundant requests

---

## Deliverable Requirements

### Phase 1: Research & Architecture (Week 1-2)
1. **API Selection Report**:
   - Comparison of 5+ market data APIs
   - Rate limit analysis
   - Cost-benefit analysis
   - Recommendation with justification
   - Sample API integration code

2. **Technology Stack Recommendation**:
   - Frontend framework selection with pros/cons
   - Backend framework selection with pros/cons
   - Database selection with schema design
   - Architecture diagram (system design)
   - Data flow diagrams

3. **Implementation Strategy**:
   - State persistence approach
   - HTF bar change detection method
   - Pattern detection optimization strategy
   - Real-time update mechanism
   - Error handling and fallback strategies

### Phase 2: Core Development (Week 3-6)
1. **Pattern Detection Engine**:
   - All 14 candlestick patterns implemented
   - Trend context validation
   - Early detection mechanism
   - Unit tests for each pattern
   - Performance benchmarks

2. **D&R State Machine**:
   - 15-state state machine implementation
   - Break detection logic
   - Retracement level calculations
   - State transition validation
   - Unit tests for all 15 states
   - State persistence mechanism

3. **API Integration Layer**:
   - Market data API wrapper
   - Rate limiting implementation
   - Data caching strategy
   - Error handling and retry logic
   - WebSocket integration (if applicable)

### Phase 3: Frontend Development (Week 7-8)
1. **Pattern Radar UI**:
   - Interactive 8×5 radar table
   - Pattern name display with colors
   - Hover tooltips with pattern details
   - User controls (batch selection, pattern toggles)
   - Performance metrics display
   - Responsive design

2. **D&R Radar UI**:
   - Interactive 8×5 state table
   - State name display with color intensity
   - Debug tables (optional toggle)
   - User controls (batch selection, timeframe)
   - State transition visualization
   - Responsive design

3. **Shared Components**:
   - Batch selection dropdown
   - Timeframe selector
   - Table position configurator
   - Performance dashboard
   - Alert/notification system

### Phase 4: Testing & Optimization (Week 9-10)
1. **Accuracy Testing**:
   - Compare results with TradingView Pine Script indicators
   - Validate pattern detection against historical data
   - Validate D&R states against dashboard output
   - Test edge cases (gaps, missing data, low volume)

2. **Performance Testing**:
   - Load testing with 40+ simultaneous streams
   - API rate limit stress testing
   - Database query optimization
   - Frontend rendering performance
   - Memory leak detection

3. **User Acceptance Testing**:
   - Usability testing
   - Cross-browser compatibility
   - Mobile responsiveness
   - Feature completeness validation

---

## Success Criteria

### Functional Requirements
- ✅ All 14 candlestick patterns detected accurately
- ✅ All 15 D&R states calculated correctly
- ✅ Multi-ticker support (8 tickers minimum)
- ✅ Multi-timeframe support (5 timeframes minimum)
- ✅ Real-time or near-real-time updates
- ✅ State persistence across sessions
- ✅ Early pattern detection with visual indicators
- ✅ Trend context validation
- ✅ Break detection and retracement calculations
- ✅ User-configurable settings

### Non-Functional Requirements
- ⚡ Pattern detection latency < 100ms per ticker/timeframe
- ⚡ State machine execution < 50ms per ticker/timeframe
- ⚡ Frontend render time < 200ms for full table update
- 💾 Database query time < 100ms for historical data retrieval
- 🔒 API rate limit compliance (no exceeded limits)
- 📱 Responsive design (mobile, tablet, desktop)
- 🎨 Matching color schemes and visual style to original indicators
- 🐛 Error rate < 0.1% for data processing

### Accuracy Requirements
- Pattern detection accuracy > 99% compared to TradingView
- D&R state accuracy 100% match with dashboard (same inputs)
- No false positives for trend context validation
- HTF bar change detection 100% accurate
- Retracement level calculations precise to 2 decimal places

---

## Additional Considerations

### Scalability
- How to scale beyond 8 tickers (future expansion to 184 tickers from 23 batches)?
- Database partitioning strategy for time-series data
- Horizontal scaling for API requests
- Load balancing for multiple concurrent users

### Security
- API key management and rotation
- User authentication and authorization
- Data privacy for user configurations
- Rate limiting per user to prevent abuse

### Monitoring & Analytics
- API usage tracking
- Pattern detection frequency analytics
- State distribution analytics
- Performance metrics dashboard
- Error logging and alerting

### Documentation
- API endpoint documentation
- Pattern detection algorithm documentation
- State machine transition documentation
- User guide with examples
- Deployment guide
- Troubleshooting guide

---

## Questions for Research Agent

1. **API Selection**: Which market data API provides the best balance of cost, reliability, data quality, and rate limits for this use case?

2. **State Persistence**: What's the most efficient way to persist 40+ independent state machines with complex state (break flags, retracement levels, HTF values)?

3. **Real-Time Updates**: Should we use WebSocket connections, polling, or a hybrid approach for real-time data updates?

4. **HTF Bar Detection**: What's the most reliable method to detect HTF bar changes across multiple tickers with different bar timing?

5. **Pattern Detection Optimization**: How can we optimize pattern detection across 40+ combinations without sacrificing accuracy?

6. **Frontend Framework**: React vs Vue vs Angular - which provides the best balance of performance, developer experience, and community support for financial dashboards?

7. **Backend Framework**: Node.js vs Python vs Go - which is best suited for time-series data processing and state machine logic?

8. **Database Selection**: Which time-series database (InfluxDB, TimescaleDB, MongoDB) is best for storing OHLC data and pattern detection results?

9. **Deployment Strategy**: Cloud provider recommendation (AWS, GCP, Azure) and deployment architecture for production?

10. **Cost Estimation**: Total cost breakdown for development, API subscriptions, hosting, and maintenance?

---

## Reference Materials

### Source Code
- `Pattern Pulse Radar.pine` - 708 lines, 14 patterns, 40 request.security calls
- `Pattern Pulse D&R Radar.pine` - 624 lines, 15-state machine, 40 request.security calls
- `DR_State_Requirements.md` - Complete state machine technical specification
- `ticker_list.csv` - 184 unique tickers across 23 batches

### Key Algorithms
1. Shadow ratio calculation: `(high - max(open, close))` and `(min(open, close) - low)`
2. Trend detection: 2 of 3 bars showing directional movement
3. State transition: 15-state finite state machine with retracement thresholds
4. Break detection: HTF High/Low comparison with persistent flags

### Color Schemes
- Bullish patterns: Green (#00FF00) with varying transparency
- Bearish patterns: Red (#FF0000) with varying transparency  
- STRAT patterns: Gray with varying transparency
- D&R states: Gray, Blue, Orange, Purple, Green, Red, Lime, Maroon (see spec)

---

## Budget & Timeline

**Estimated Timeline**: 10-12 weeks
**Estimated Budget**: $[To be determined based on API costs, hosting, and development resources]

**Milestone Schedule**:
- Week 1-2: Research & Architecture
- Week 3-6: Core Development
- Week 7-8: Frontend Development  
- Week 9-10: Testing & Optimization
- Week 11-12: Deployment & Documentation

**Resource Requirements**:
- 1-2 Full-stack developers
- 1 Financial data specialist
- 1 UI/UX designer (part-time)
- Access to market data API subscriptions
- Cloud hosting resources

---

## Final Notes

This project replicates sophisticated financial analysis tools currently only available within TradingView. The goal is to provide standalone web applications with equivalent or superior functionality, enabling:

1. **API-driven analysis** outside of TradingView's ecosystem
2. **Custom integrations** with other trading platforms
3. **Automated alerting** based on pattern detection and state changes
4. **Historical backtesting** with saved pattern/state data
5. **Portfolio-level analysis** across multiple ticker groups
6. **Mobile accessibility** for on-the-go monitoring

The applications must maintain 100% accuracy with the original Pine Script indicators while providing enhanced features like historical data analysis, custom alerts, and API accessibility for integration with other trading systems.









