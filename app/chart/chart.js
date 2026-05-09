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
        lineColor: '#1eb100',
        lineWidth: 1,
        dotRadius: 0, // No dots for stock data (too many points)
        showLabels: false
    });
    
    // Store current chart data
    let currentConfig = null;
    let currentDataPoints = null;
    
    /**
     * Clear the canvas
     */
    function clear() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
    }
    
    /**
     * Draw chart with stock data
     * @param {Array} dataPoints - Array of {x, y, date} data points
     * @param {number} minY - Minimum Y value
     * @param {number} maxY - Maximum Y value
     * @param {number} xTickInterval - X-axis tick interval
     */
    function drawStockChart(dataPoints, minY, maxY, xTickInterval) {
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
        
        // Draw the chart
        drawChart(ctx, config, dataPoints, lineConfig);
        
        // Initialize mouse tracking
        initMouseTracking(canvas, ctx, config, dataPoints, () => {
            clear();
            drawChart(ctx, currentConfig, currentDataPoints, lineConfig);
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
