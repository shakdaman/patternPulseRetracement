# Pattern Pulse D&R Radar - User Guide

## Overview

The **Pattern Pulse D&R Radar** is a real-time monitoring dashboard that displays Deviation & Retracement (D&R) states across multiple tickers and timeframes. Unlike the Pattern Radar that detects candlestick patterns, the D&R Radar monitors the current state of price action relative to Higher Timeframe (HTF) ranges.

## Key Features

### 📊 **Multi-Ticker Monitoring**
- **8 tickers** across **5 timeframes** (4H, Daily, Weekly, Monthly, 3M)
- **40 monitoring combinations** total (8 × 5)
- **23 pre-configured ticker batches** for easy switching
- **Real-time state updates** via alert system

### 🎯 **D&R State Detection**
The radar monitors **15 different D&R states**:

#### **Neutral States**
- **0: Neutral** - Waiting for deviation (Gray)

#### **Deviation States**  
- **1: Deviated Above** - Price broke above HTF High (Blue)
- **2: Deviated Below** - Price broke below HTF Low (Orange)

#### **Return States**
- **3: Returned from Above** - Price returned to range from above (Purple)
- **4: Returned from Below** - Price returned to range from below (Purple)

#### **Bullish Progression States**
- **5: Bullish 25%** - Initial bullish signal (Light Green)
- **6: Bullish 50%** - Strong bullish signal (Green)  
- **7: Bullish 100%** - HTF High broken, maximum bullish (Lime)

#### **Bullish Retracement States**
- **8: Bullish Fell 50%** - Retracement warning (Medium Green)
- **9: Bullish Fell 25%** - Deeper retracement (Dark Green)

#### **Bearish Progression States**
- **10: Bearish 25%** - Initial bearish signal (Light Red)
- **11: Bearish 50%** - Strong bearish signal (Red)
- **12: Bearish 100%** - HTF Low broken, maximum bearish (Maroon)

#### **Bearish Retracement States**
- **13: Bearish Rose 50%** - Retracement warning (Medium Red)
- **14: Bearish Rose 25%** - Deeper retracement (Dark Red)

## Architecture

### **Alert-Based System**
The D&R Radar uses an **alert-based architecture** for real-time updates:

1. **D&R Dashboard** detects state changes and sends structured alerts
2. **D&R Radar** listens for alerts and updates the display
3. **No request.security() calls** needed (much lighter than Pattern Radar)

### **Alert Message Format**
```
DR_STATE|TICKER|TIMEFRAME|STATE_CODE|STATE_TEXT|COLOR_CODE
```

**Example:**
```
DR_STATE|NASDAQ:AAPL|Daily|5|Bullish 25%|color.green
```

## Configuration

### **Ticker Batch Selection**
Choose from **23 pre-configured batches**:

- **Batches 1-22**: 8 tickers each (176 total tickers)
- **Batch 23**: 1 ticker (AAPL)
- **Empty batches**: Show "No Data" for all combinations

**Popular Batches:**
- **Batch 2**: Tech giants (AAPL, MSFT, GOOGL, AMZN, TSLA, META, NVDA, ORCL)
- **Batch 3**: Financial sector (JPM, BAC, WFC, C, GS, MS, AXP, USB)
- **Batch 4**: Energy sector (XOM, CVX, COP, EOG, SLB, KMI, WMB, OKE)

### **Display Settings**

#### **Table Position Options**
- **Top Left** / **Top Center** / **Top Right**
- **Middle Left** / **Middle Center** / **Middle Right**  
- **Bottom Left** / **Bottom Center** / **Bottom Right**

#### **Performance Monitoring**
- **Active Connections**: Shows how many ticker/timeframe combinations have recent data
- **Data Updates**: Confirms real-time alert processing
- **Dependencies**: Shows dependency on D&R Dashboard

## Usage Instructions

### **Setup Process**

1. **Add D&R Dashboard** to your chart
   - Configure the ticker you want to monitor
   - Enable "State Change Alerts" in settings
   - The dashboard will send alerts when states change

2. **Add D&R Radar** to your chart
   - Select desired ticker batch
   - Choose table position
   - Enable performance info if desired

3. **Monitor States**
   - The radar will display current D&R states for all tickers/timeframes
   - States update in real-time when D&R Dashboard sends alerts
   - "No Data" appears for stale or missing data

### **Multi-Radar Setup**

You can run **multiple D&R Radar instances** simultaneously:

1. **Different Positions**: Use different table positions to avoid overlap
2. **Different Batches**: Monitor different ticker sets
3. **Complementary Analysis**: Combine with Pattern Radar for comprehensive analysis

**Example Setup:**
- **D&R Radar 1**: Top Left, Batch 2 (Tech stocks)
- **D&R Radar 2**: Top Right, Batch 3 (Financial stocks)  
- **Pattern Radar**: Bottom Left, Batch 1 (Crypto/Alternative assets)

## Data Flow

### **State Update Process**

1. **Price Action**: Current price moves relative to HTF ranges
2. **State Detection**: D&R Dashboard detects state changes using identical logic
3. **Alert Generation**: Dashboard sends structured alert message
4. **Radar Update**: D&R Radar receives alert and updates display
5. **Visual Refresh**: Table shows new state with appropriate color

### **Fallback Handling**

- **Stale Data**: Data older than 100 bars shows "No Data"
- **Missing Dependencies**: Requires D&R Dashboard to be active
- **Alert Failures**: Performance table shows connection status

## Performance Characteristics

### **Advantages**
- **Lightweight**: No request.security() calls (much faster than Pattern Radar)
- **Real-time**: Instant updates when states change
- **Scalable**: Can monitor up to 40 ticker/timeframe combinations
- **Efficient**: Alert-based system reduces computational overhead

### **Dependencies**
- **D&R Dashboard Required**: Must be active on charts you want to monitor
- **Alert System**: Relies on TradingView's alert infrastructure
- **State Logic**: Uses identical logic to D&R Dashboard for consistency

## Troubleshooting

### **Common Issues**

#### **"No Data" Showing**
- **Cause**: D&R Dashboard not active or alerts not enabled
- **Solution**: Add D&R Dashboard to chart and enable "State Change Alerts"

#### **States Not Updating**
- **Cause**: Alert system not working or stale data
- **Solution**: Check D&R Dashboard alert settings and refresh chart

#### **Performance Issues**
- **Cause**: Too many radar instances or complex ticker batches
- **Solution**: Reduce number of radar instances or use simpler batches

### **Best Practices**

1. **Use D&R Dashboard**: Always run D&R Dashboard for tickers you want to monitor
2. **Enable Alerts**: Ensure "State Change Alerts" is enabled in D&R Dashboard
3. **Monitor Performance**: Check performance table for connection status
4. **Position Tables**: Use different positions for multiple radar instances
5. **Batch Selection**: Choose appropriate ticker batches for your analysis needs

## Integration with Pattern Pulse System

The D&R Radar is part of the comprehensive **Pattern Pulse ecosystem**:

- **Pattern Radar**: Candlestick pattern detection
- **D&R Radar**: Deviation & Retracement state monitoring  
- **D&R Dashboard**: Individual ticker D&R analysis
- **Alert Logger**: Centralized alert management

**Combined Analysis:**
- **Pattern Radar**: Shows when patterns form
- **D&R Radar**: Shows current market structure state
- **Together**: Provides complete technical analysis picture

## Technical Specifications

- **Pine Script Version**: v6
- **Maximum Tickers**: 8 per radar instance
- **Timeframes**: 4H, Daily, Weekly, Monthly, 3M
- **State Types**: 15 different D&R states
- **Update Frequency**: Real-time via alerts
- **Memory Usage**: Minimal (no request.security calls)
- **Compatibility**: Requires D&R Dashboard for data source

---

*For technical support or feature requests, refer to the main Pattern Pulse documentation.*
