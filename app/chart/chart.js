/**
 * Chart Module
 * Main chart initialization and drawing logic
 */

/**
 * Initialize chart canvas
 * @param {string} canvasId - ID of the canvas element
 * @param {number} width - Canvas width
 * @param {number} height - Canvas height
 * @returns {Object} API object with methods to interact with chart
 */
function initChart(canvasId, width, height) {
    const canvas = document.getElementById(canvasId);
    
    if (!canvas) {
        console.error(`Canvas with id "${canvasId}" not found`);
        return null;
    }
    
    const ctx = canvas.getContext('2d');
    canvas.width = width;
    canvas.height = height;
    
    // Create line configuration
    const lineConfig = new LineConfig({
        lineColor: '#888888',
        lineWidth: 1,
        dotRadius: 0, // No dots for stock data (too many points)
        showLabels: false
    });
    
    // Store current chart data
    let currentConfig = null;
    let currentDataPoints = null;
    let currentIndicators = [];
    let currentSignalMarkers = [];
    
    /**
     * Draw a triangle marker at a specific point
     * @param {Object} config - Chart configuration
     * @param {number} dataIndex - Index in the data array
     * @param {string} type - 'bullish' or 'bearish'
     */
    function drawTriangleMarker(config, dataIndex, type) {
        if (!currentDataPoints || dataIndex < 0 || dataIndex >= currentDataPoints.length) {
            return;
        }
        
        const point = currentDataPoints[dataIndex];
        const x = config.xScale(point.x);
        const y = config.yScale(point.y);
        
        // Triangle size
        const size = 8;
        const color = type === 'bullish' ? '#1eb100' : '#ff6347';
        
        ctx.save();
        ctx.fillStyle = color;
        
        ctx.beginPath();
        if (type === 'bullish') {
            // Upward triangle (below the point)
            ctx.moveTo(x, y + size * 1.5);
            ctx.lineTo(x - size, y + size * 2.5);
            ctx.lineTo(x + size, y + size * 2.5);
        } else {
            // Downward triangle (above the point)
            ctx.moveTo(x, y - size * 1.5);
            ctx.lineTo(x - size, y - size * 2.5);
            ctx.lineTo(x + size, y - size * 2.5);
        }
        ctx.closePath();
        ctx.fill();
        
        ctx.restore();
    }
    
    /**
     * Clear the canvas
     */
    function clear() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
    }
    
    /**
     * Draw chart with stock data and indicators
     * @param {Array} dataPoints - Array of {x, y, date} data points
     * @param {number} minY - Minimum Y value
     * @param {number} maxY - Maximum Y value
     * @param {number} xTickInterval - X-axis tick interval
     * @param {Array} indicators - Array of indicator configs to draw
     * @param {string} lineColor - Optional color for the main chart line
     * @param {Array} signalMarkers - Optional array of signal crossing objects to mark
     */
    function drawStockChart(dataPoints, minY, maxY, xTickInterval, indicators = [], lineColor = null, signalMarkers = []) {
        // Update line color if provided
        if (lineColor) {
            lineConfig.lineColor = lineColor;
        }
        
        // Clear canvas
        clear();
        
        // Create chart configuration with dynamic Y-axis range
        const config = new ChartConfig(canvas.width, canvas.height, {
            minX: 1,
            maxX: dataPoints.length,
            minY: minY,
            maxY: maxY,
            xTickInterval: xTickInterval,
            yTickInterval: Math.ceil((maxY - minY) / 10)
        });
        
        // Store for mouse tracking
        currentConfig = config;
        currentDataPoints = dataPoints;
        currentIndicators = indicators;
        currentSignalMarkers = signalMarkers;
        
        // Draw the chart
        drawChart(ctx, config, dataPoints, lineConfig);
        
        // Draw indicators
        indicators.forEach(indicator => {
            const indicatorData = indicator.config.calculate(dataPoints, indicator.params);
            drawLine(ctx, config, indicatorData, {
                color: indicator.config.color,
                lineWidth: indicator.config.lineWidth,
                dotRadius: 0
            });
        });
        
        // Draw signal markers
        signalMarkers.forEach(marker => {
            drawTriangleMarker(config, marker.dataIndex, marker.type);
        });
        
        // Initialize mouse tracking
        initMouseTracking(canvas, ctx, config, dataPoints, () => {
            // Redraw everything on hover
            clear();
            drawChart(ctx, currentConfig, currentDataPoints, lineConfig);
            currentIndicators.forEach(indicator => {
                const indicatorData = indicator.config.calculate(currentDataPoints, indicator.params);
                drawLine(ctx, currentConfig, indicatorData, {
                    color: indicator.config.color,
                    lineWidth: indicator.config.lineWidth,
                    dotRadius: 0
                });
            });
            // Redraw signal markers
            currentSignalMarkers.forEach(marker => {
                drawTriangleMarker(currentConfig, marker.dataIndex, marker.type);
            });
        });
    }
    
    /**
     * Draw chart with mock data (for testing)
     * @param {Array} dataPoints - Array of {x, y} data points
     */
    function drawMockChart(dataPoints) {
        clear();
        
        const config = new ChartConfig(canvas.width, canvas.height, {
            minX: 1,
            maxX: dataPoints.length
        });
        
        drawChart(ctx, config, dataPoints, lineConfig);
    }
    
    /**
     * Get current configuration
     * @returns {Object} Current ChartConfig
     */
    function getConfig() {
        return currentConfig;
    }
    
    /**
     * Get current data points
     * @returns {Array} Current data points
     */
    function getDataPoints() {
        return currentDataPoints;
    }
    
    // Return public API
    return {
        clear,
        drawStockChart,
        drawMockChart,
        getConfig,
        getDataPoints
    };
}
