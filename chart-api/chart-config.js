/**
 * ChartConfig class to manage chart configuration and scale functions
 */
class ChartConfig {
    /**
     * @param {number} width - Total canvas width in pixels
     * @param {number} height - Total canvas height in pixels
     * @param {Object} [options] - Optional configuration overrides
     * @param {number} [options.marginLeft=20] - Left margin in pixels
     * @param {number} [options.marginTop=20] - Top margin in pixels
     * @param {number} [options.marginRight=50] - Right margin in pixels
     * @param {number} [options.marginBottom=40] - Bottom margin in pixels
     * @param {number} [options.minX=0] - Minimum X value in data coordinates
     * @param {number} [options.maxX=800] - Maximum X value in data coordinates
     * @param {number} [options.minY=0] - Minimum Y value in data coordinates
     * @param {number} [options.maxY=500] - Maximum Y value in data coordinates
     * @param {number} [options.xTickInterval=100] - Interval between X-axis ticks
     * @param {number} [options.yTickInterval=100] - Interval between Y-axis ticks
     */
    constructor(width, height, options = {}) {

        // Set margins with defaults
        this.marginLeft = options.marginLeft ?? 20;
        this.marginTop = options.marginTop ?? 20;
        this.marginRight = options.marginRight ?? 50;
        this.marginBottom = options.marginBottom ?? 40;
        
        // Calculate chart dimensions from canvas size and margins
        this.chartWidth = width - this.marginLeft - this.marginRight;
        this.chartHeight = height - this.marginTop - this.marginBottom;
        
        // Data coordinate system
        this.minX = options.minX ?? 0;
        this.maxX = options.maxX ?? 800;
        this.minY = options.minY ?? 0;
        this.maxY = options.maxY ?? 500;
        
        // Tick intervals
        this.xTickInterval = options.xTickInterval ?? 100;
        this.yTickInterval = options.yTickInterval ?? 100;
    }

    /**
     * Convert data X coordinate to canvas X coordinate
     * @param {number} dataX - X value in data coordinates
     * @returns {number} X value in canvas coordinates
     */
    xScale(dataX) {
        const dataRange = this.maxX - this.minX;
        const normalizedX = (dataX - this.minX) / dataRange;
        return this.marginLeft + normalizedX * this.chartWidth;
    }

    /**
     * Convert data Y coordinate to canvas Y coordinate
     * @param {number} dataY - Y value in data coordinates
     * @returns {number} Y value in canvas coordinates
     */
    yScale(dataY) {
        const dataRange = this.maxY - this.minY;
        const normalizedY = (dataY - this.minY) / dataRange;
        return this.marginTop + this.chartHeight - normalizedY * this.chartHeight;
    }
}
