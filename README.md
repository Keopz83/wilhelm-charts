# Canvas Time-Series Chart Examples

Four progressively more complex examples: three from-scratch Canvas implementations and one production-ready TradingView Lightweight Charts example.

## Files

### 1. `time-series-canvas.html`
**Basic single-line time-series chart**

Features:
- Canvas rendering from scratch
- Time-based X-axis with date labels
- Value-based Y-axis
- Grid lines
- Line chart with data points
- Mouse hover interaction to show values

**Concepts demonstrated:**
- Canvas 2D context API
- Scale functions (data → pixels)
- Drawing paths, circles, text
- Mouse event handling
- Coordinate transformations

### 2. `multi-line-canvas.html`
**Multiple superimposed time-series lines**

Features:
- Three different data series on the same chart
- Color-coded lines
- Legend
- Synchronized X-axis
- Unified Y-axis scaling
- Hover shows all values at a time point

**Additional concepts:**
- Multiple datasets rendering
- Color management
- Legend creation
- Cross-series interaction

### 3. `interactive-drawing-canvas.html`
**Interactive drawing tools on chart**

Features:
- Two-layer canvas (chart + drawings)
- Drawing modes: Select, Trendline, Horizontal Line
- Drag to create trendlines
- Click to add horizontal support/resistance lines
- Clear all drawings
- Preview while drawing

**Additional concepts:**
- Multi-canvas layering
- Drawing mode state management
- User interaction patterns (drag, click)
- Pixel ↔ data coordinate conversion
- Drawing persistence

### 4. `lightweight-charts-example.html`
**TradingView Lightweight Charts - Production ready**

Features:
- Professional financial charting library
- Candlestick, line, and area chart types
- Volume histogram with separate price scale
- Simple Moving Average (SMA) indicator
- Real-time crosshair with OHLCV display
- Responsive design with zoom/pan
- Dark theme optimized for trading

**Key advantages:**
- Battle-tested library (used by TradingView)
- Excellent performance (Canvas-based)
- Professional appearance out of the box
- Active development and community support
- No need to implement features from scratch

## How to Run

Simply open any HTML file in a web browser:

```bash
# Windows
start time-series-canvas.html

# Or just double-click the file
```

## Key Technical Concepts

### Scale Functions
Convert between data space and pixel space:

```javascript
// Data → Pixels
function xScale(date) {
    const timeRange = maxDate - minDate;
    const position = (date - minDate) / timeRange;
    return margin.left + position * chartWidth;
}

// Pixels → Data (for mouse interactions)
function pixelToDate(x) {
    const position = (x - margin.left) / chartWidth;
    return new Date(minDate.getTime() + position * (maxDate - minDate));
}
```

### Canvas Rendering Pipeline

```
1. Clear canvas
2. Draw background elements (grid)
3. Draw axes
4. Draw data (lines, points)
5. Draw labels/text
6. Draw overlays (crosshair, drawings)
```

### Multi-Canvas Architecture
```
┌─────────────────────────┐
│ Bottom Canvas (Static)  │ ← Chart, axes, grid
├─────────────────────────┤
| Production ready | Needs work | ✓ Yes | With effort |
| Financial charts | Build everything | ✓ Built-in | Build everything |
│ Top Canvas (Dynamic)    │ ← User drawings, crosshair
└─────────────────────────┘
```

Benefits:
- Only redraw what changes
- Separate concerns
- Better performance

## Comparison: From-Scratch vs Libraries

| Aspect | From-Scratch | Lightweight Charts | D3.js |
|--------|-------------|-------------------|-------|
| Lines of code | ~300 | ~50 | ~200 |
| Performance | Good | Excellent | Good (SVG) |
| Customization | Full control | Limited | Full control |
| Learning curve | Medium | Easy | Steep |
| Drawing tools | Manual (~200 LOC) | Manual (~200 LOC) | Easier (SVG) |
| Time to market | Slow | Fast | Medium |

## When to Use Each Approach

**Build from scratch:**
- Learning exercise ✓
- Very simple charts
- Complete control needed
- No dependencies allowed
 ✓
- Performance critical ✓
- Standard financial charts ✓
- Fast development ✓
- Professional appearance ✓ical
- Standard financial charts
- Fast development

**Use D3.js:**
- Custom visualizations
- Complex interactions
- Data journalism
- Unique requirements

## Next Steps
**For learning:**
1. Start with: `time-series-canvas.html` (understand basics)
2. Progress to: `multi-line-canvas.html` (multiple series)
3. Advanced: `interactive-drawing-canvas.html` (user interactions)

**For production:**
1. **Use Lightweight Charts** (`lightweight-charts-example.html`) for:
   - Trading platforms
   - Financial dashboards
   - Stock/crypto apps
   - Real-time data visualization

2. **Build from scratch** only if:
   - Very specific custom requirements
   - Learning exercise
   - No dependencies allowed
   - Unique visualization needs

To build a production trading chart:

1. **Recommended**: Start with `lightweight-charts-example.html`
2. **Customize**: Add your data source (REST API, WebSocket)
3. **Enhance**: Add more indicators as needed
4. **For drawings**: Implement custom overlay layer

Or **build from scratch** starting with `interactive-drawing-canvas.html` and add:
   - Candlestick rendering
   - Volume bars
   - Zoom/pan gestures
   - Multiple timeframes
   - Technical indicators
3. **Consider switching to**: Lightweight Charts or D3.js for advanced features

## Resources

- [Canvas API Documentation](https://developer.mozilla.org/en-US/docs/Web/API/Canvas_API)
- [TradingView Lightweight Charts](https://tradingview.github.io/lightweight-charts/)
- [Lightweight Charts Documentation](https://tradingview.github.io/lightweight-charts/docs)
- [D3.js](https://d3js.org/)

## Summary

This repository demonstrates:
- **Examples 1-3**: How Canvas charting works at a fundamental level
- **Example 4**: Production-ready approach with Lightweight Charts

**For learning and understanding**: Study the Canvas examples  
**For building real applications**: Use Lightweight Charts (Example 4)
