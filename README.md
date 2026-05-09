# Wilhelm Charts

An open-source JavaScript charting API tailored for stock analysis, built from scratch using Canvas API.

## Overview

Wilhelm Charts is a modular, lightweight charting library designed specifically for financial data visualization. Built without external dependencies (except for data fetching), it provides a clean, extensible architecture for stock market analysis.

## Features

- **Real-time stock data** - Yahoo Finance integration via proxy server
- **Interactive charts** - Mouse hover with crosshair and data tooltips
- **Date-based X-axis** - Automatic date formatting and labeling
- **Dynamic Y-axis** - Auto-scaling based on price ranges
- **Grid system** - Configurable horizontal grid lines
- **Modular architecture** - Separate modules for chart, search, and ticker list
- **Dark theme** - Optimized for financial trading interfaces

## Project Structure

```
example-mine-from-scratch/
├── app/
│   ├── chart/              # Chart rendering module
│   ├── ticker-search/      # Ticker input and load controls
│   ├── ticker-list/        # Active tickers sidebar
│   ├── stock-broker/       # Yahoo Finance data fetcher
│   └── index.html/css/js   # Main application
├── chart-api/              # Core chart components
│   ├── chart-config.js     # Configuration and scaling
│   ├── line-config.js      # Line styling
│   ├── axis.js             # Axis rendering
│   ├── draw-grid.js        # Grid lines
│   ├── draw-chart.js       # Main drawing orchestration
│   └── mouse-action.js     # Mouse interactions
├── proxy-server.js         # CORS proxy for Yahoo Finance
└── package.json

```

## Quick Start

1. Install dependencies:
```bash
npm install
```

2. Start the proxy server:
```bash
npm start
```

3. Open in browser:
```
http://localhost:3000/app/index.html
```

## Current Status

**Working:**
- Stock data fetching from Yahoo Finance
- Line chart rendering with dates
- Mouse hover interactions
- Multiple ticker tracking
- Dynamic scaling

**In Development:**
- Technical indicators (moving averages, etc.)
- Candlestick charts
- Drawing tools (trendlines, support/resistance)
- Time period selectors
- Multiple timeframes

## Objective

Develop a production-ready, open-source charting library that rivals commercial solutions like TradingView, with a focus on:
- Performance and responsiveness
- Extensibility for custom indicators
- Clean, maintainable codebase
- Zero external charting dependencies

## License

MIT License - see [LICENSE](LICENSE) file for details
