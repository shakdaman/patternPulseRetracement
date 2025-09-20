# Pattern Pulse Retracement

A comprehensive Pine Script indicator system for Higher Timeframe (HTF) deviation and retracement analysis with multi-ticker dashboard monitoring.

## 🚀 Features

### Core HTF Deviation & Retracement Indicator
- **Smart HTF Detection**: Automatically identifies previous closed HTF bar ranges
- **Dynamic Retracement**: Calculates retracement levels based on actual break direction
- **Trading Signals**: Generates LONG/SHORT signals with visual labels
- **Multiple Retracement Levels**: 12.5%, 25%, 50% retracement monitoring
- **Comprehensive Alerts**: Full alert system for all signal types

### HTF Dashboard Indicator
- **Multi-Ticker Monitoring**: Watch up to 8 tickers simultaneously
- **Real-time Dashboard**: Clean table display with color-coded signals
- **Individual Alerts**: Separate alert conditions for each ticker
- **Customizable Settings**: Flexible HTF timeframe and retracement percentage

## 📁 Files

- `HTF_Deviation_Retracement.pine` - Main indicator for individual chart analysis
- `HTF_Dashboard.pine` - Dashboard indicator for multi-ticker monitoring
- `BYTEROVER_HANDOFF.md` - Comprehensive technical documentation

## 🎯 How It Works

### Signal Logic
1. **Price breaks** above HTF High or below HTF Low
2. **Price returns** to the HTF range
3. **Price hits** retracement level
4. **Signal generated** (LONG for low breaks, SHORT for high breaks)

### Retracement Direction
- **Low broken**: Retracement calculated from low (0%) to high (100%)
- **High broken**: Retracement calculated from high (0%) to low (100%)

## 🛠️ Installation

1. Copy the Pine Script code from either file
2. Open TradingView Pine Editor
3. Paste the code and save
4. Add to your chart

## ⚙️ Configuration

### Main Indicator Settings
- **Higher Timeframe**: Choose HTF timeframe (D, W, M, etc.)
- **Retracement Percentage**: Main retracement level (default: 50%)
- **Colors**: Customize line and label colors
- **Alerts**: Enable/disable specific alert types

### Dashboard Settings
- **Tickers**: Enter up to 8 ticker symbols
- **HTF**: Select higher timeframe
- **Retrace %**: Set retracement percentage
- **Debug**: Toggle debug information

## 📊 Alert Types

### Main Indicator
- **Bullish Signal**: LONG trading opportunity
- **Bearish Signal**: SHORT trading opportunity
- **12.5% Bullish/Bearish Alert**: Specific retracement level alerts
- **25% Bullish/Bearish Alert**: Specific retracement level alerts
- **50% Bullish/Bearish Alert**: Specific retracement level alerts

### Dashboard Indicator
- **T1-T8 LONG/SHORT**: Individual ticker signal alerts

## 🔧 Technical Details

- **Pine Script Version**: v6
- **Overlay**: Main indicator (true), Dashboard (false)
- **Memory Management**: Optimized for performance
- **Alert System**: Comprehensive with proper frequency control

## 📈 Usage Examples

### Individual Chart Analysis
1. Add HTF_Deviation_Retracement to any chart
2. Set HTF timeframe to "D" for daily analysis
3. Configure retracement percentage
4. Set alerts for trading signals

### Multi-Ticker Monitoring
1. Add HTF_Dashboard to any chart
2. Enter tickers: SPY, QQQ, IWM, AAPL, MSFT, GOOGL, NVDA, TSLA
3. Set HTF timeframe
4. Monitor dashboard for real-time signals

## 🐛 Troubleshooting

### Common Issues
- **Moving Lines**: Ensure HTF data is properly confirmed
- **Missing Alerts**: Check that alert conditions are enabled
- **Debug Information**: Use debug toggle for troubleshooting

### Debug Mode
Enable debug information to see:
- HTF High/Low values
- Break detection status
- State machine information
- Bar confirmation status

## 📝 License

This project is open source and available under the MIT License.

## 🤝 Contributing

Contributions are welcome! Please feel free to submit pull requests or open issues for bugs and feature requests.

## 📞 Support

For technical support or questions, please refer to the `BYTEROVER_HANDOFF.md` file for detailed technical documentation.

---

**Repository**: [patternPulseRetracement](https://github.com/shakdaman/patternPulseRetracement)