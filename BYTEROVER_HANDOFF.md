# HTF Deviation & Retracement Project - Byterover Handoff

## Project Overview
Development of Pine Script indicators for Higher Timeframe (HTF) deviation and retracement analysis with dashboard monitoring capabilities.

## Repository Status
- **GitHub Repository**: [patternPulseRetracement](https://github.com/shakdaman/patternPulseRetracement)
- **Current Status**: Active development, ready for initial commit
- **Files**: 2 Pine Script indicators + documentation

---

## Phase 1: Core HTF Deviation & Retracement Indicator ✅ COMPLETED

### File: `HTF_Deviation_Retracement.pine`

#### **Core Functionality**
- **HTF Data Retrieval**: Fetches previous closed HTF bar high/low values
- **State Machine Logic**: Tracks price deviation and return patterns
- **Retracement Calculations**: Dynamic retracement levels based on break direction
- **Alert System**: Comprehensive alert conditions for trading signals

#### **Key Features Implemented**
1. **HTF Range Detection**
   - Uses `request.security()` with proper HTF bar confirmation
   - Stores HTF values only when bars are confirmed closed
   - Prevents moving lines issue through proper data management

2. **Break Direction Logic**
   - Detects which HTF level was broken first (high or low)
   - Calculates retracement direction accordingly:
     - Low broken: Retracement from low (0%) to high (100%)
     - High broken: Retracement from high (0%) to low (100%)

3. **Signal Generation**
   - **LONG Signals**: Price breaks below HTF Low, returns, hits retracement level
   - **SHORT Signals**: Price breaks above HTF High, returns, hits retracement level
   - Visual labels: "LONG" and "SHORT" appear on chart

4. **Retracement Levels**
   - Main retracement level (customizable percentage)
   - Additional levels: 12.5%, 25%, 50%
   - Proper alignment with HTF lines

5. **Alert System**
   - Main signals: "Bullish Signal", "Bearish Signal"
   - Retracement levels: "12.5% Bullish Alert", "25% Bullish Alert", etc.
   - Clean alert dialog with only relevant conditions

#### **Technical Implementation**
- **Version**: Pine Script v6
- **Overlay**: true (displays on price chart)
- **Inputs**: HTF timeframe, retracement percentage, colors, alerts
- **Debug Toggle**: Optional debug information display
- **Memory Management**: Proper variable declaration and cleanup

#### **Critical Issues Resolved**
1. **Moving Lines Problem**: Fixed HTF data retrieval to use confirmed bars only
2. **Retracement Direction**: Corrected calculation based on actual break direction
3. **Alert Visibility**: Made retracement alerts visible in TradingView alert dialog
4. **Compilation Errors**: Resolved variable declaration order and syntax issues

---

## Phase 2: HTF Dashboard Indicator ✅ COMPLETED

### File: `HTF_Dashboard.pine`

#### **Core Functionality**
- **Multi-Ticker Monitoring**: Watches 8 tickers simultaneously
- **Dashboard Display**: Table format showing signal status
- **Real-time Updates**: Updates on every bar close
- **Individual Alerts**: Separate alert conditions for each ticker

#### **Key Features Implemented**
1. **Dashboard Table**
   - Clean table format in top-right corner
   - Color-coded signals: LONG (green), SHORT (red), WAITING (yellow)
   - Real-time updates without chart overlay

2. **Ticker Management**
   - 8 configurable ticker inputs (T1-T8)
   - Uses same HTF D&R logic for each ticker
   - Independent signal calculation per ticker

3. **Alert System**
   - Individual alerts per ticker: "T1 LONG", "T1 SHORT", etc.
   - Concise alert names and messages
   - 16 total alert conditions (8 tickers × 2 signals)

4. **Settings**
   - Short, concise input labels
   - HTF timeframe selection
   - Retracement percentage control
   - Debug toggle

#### **Technical Implementation**
- **Version**: Pine Script v6
- **Overlay**: false (separate indicator)
- **Function**: `getHTFSignal()` contains core HTF D&R logic
- **Table**: Uses `table.new()` for dashboard display
- **Alerts**: `alertcondition()` for each ticker/signal combination

---

## Critical Knowledge & Rules Documented

### **HTF Data Retrieval Rules**
- **ALWAYS use `[1]` offset** for HTF data to get previous closed bar
- **Store HTF values** only when confirmed closed to prevent moving lines
- **Use `barstate.isconfirmed`** to ensure data integrity
- **Reset tracking variables** when new HTF bars form

### **Retracement Direction Logic**
- **Low broken**: Calculate retracement from low (0%) to high (100%)
- **High broken**: Calculate retracement from high (0%) to low (100%)
- **No break**: Default to high-to-low calculation

### **Pine Script Best Practices**
- **Variable declaration order**: Declare variables before use
- **String concatenation**: Use single-line concatenation for compiler stability
- **Input labels**: Keep short and concise
- **Alert conditions**: Use `plotchar()` to make alerts visible in dialog

---

## Current Status & Next Steps

### **Completed Deliverables**
1. ✅ Core HTF Deviation & Retracement Indicator
2. ✅ HTF Dashboard Indicator
3. ✅ Comprehensive alert system
4. ✅ Debug and troubleshooting tools
5. ✅ Documentation and handoff file

### **Ready for Deployment**
- Both indicators compile successfully
- All critical issues resolved
- Alert system fully functional
- Clean, maintainable code structure

### **Repository Structure**
```
patternPulseRetracement/
├── HTF_Deviation_Retracement.pine    # Main indicator
├── HTF_Dashboard.pine                # Dashboard indicator
├── BYTEROVER_HANDOFF.md             # This documentation
└── README.md                        # Project overview (to be created)
```

---

## Usage Instructions

### **Main Indicator (HTF_Deviation_Retracement.pine)**
1. Add to any chart
2. Configure HTF timeframe and retracement percentage
3. Set alerts for "Bullish Signal" or "Bearish Signal"
4. Optional: Enable debug information for troubleshooting

### **Dashboard Indicator (HTF_Dashboard.pine)**
1. Add to any chart (overlay=false)
2. Configure 8 tickers to monitor
3. Set HTF timeframe and retracement percentage
4. Set individual alerts for each ticker's signals
5. Monitor dashboard table for real-time signal status

---

## Technical Notes for Future Development

### **Memory Management**
- HTF values are stored in `var` variables to persist across bars
- Proper cleanup of lines and labels when disabled
- State machine resets on new HTF bar formation

### **Alert Optimization**
- Uses `alert.freq_once_per_bar` to prevent spam
- Alert conditions are properly exposed via `plotchar()`
- Clean alert dialog with only relevant conditions

### **Performance Considerations**
- `request.security()` calls are optimized with proper lookahead settings
- Debug information is toggleable to reduce overhead
- Table updates only on `barstate.islast`

---

## Contact & Support

- **Repository**: [https://github.com/shakdaman/patternPulseRetracement](https://github.com/shakdaman/patternPulseRetracement)
- **Status**: Ready for production use
- **Last Updated**: January 2025

---

*This handoff document contains all critical information needed to understand, maintain, and extend the HTF Deviation & Retracement indicator system.*
