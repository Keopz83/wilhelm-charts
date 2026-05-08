/**
 * ChartConfig class to manage chart configuration and scale functions
 */
class ChartConfig {
    /**
     * @param {Object} options - Configuration options
     * @param {number} [options.marginLeft=50] - Left margin in pixels
     * @param {number} [options.marginTop=20] - Top margin in pixels
     * @param {number} [options.marginRight=20] - Right margin in pixels
     * @param {number} [options.marginBottom=20] - Bottom margin in pixels
     * @param {number} [options.chartWidth=830] - Chart width in pixels
     * @param {number} [options.chartHeight=460] - Chart height in pixels
     * @param {number} [options.maxX=800] - Maximum X value in data coordinates
     * @param {number} [options.maxY=500] - Maximum Y value in data coordinates
     * @param {number} [options.xTickInterval=100] - Interval between X-axis ticks
     * @param {number} [options.yTickInterval=100] - Interval between Y-axis ticks
     */
    constructor(options = {}) {
        this.marginLeft = options.marginLeft ?? 50;
        this.marginTop = options.marginTop ?? 20;
        this.marginRight = options.marginRight ?? 20;
        this.marginBottom = options.marginBottom ?? 20;
        this.chartWidth = options.chartWidth ?? 830;
        this.chartHeight = options.chartHeight ?? 460;
        this.maxX = options.maxX ?? 800;
        this.maxY = options.maxY ?? 500;
        this.xTickInterval = options.xTickInterval ?? 100;
        this.yTickInterval = options.yTickInterval ?? 100;
    }

    /**
     * Convert data X coordinate to canvas X coordinate
     * @param {number} dataX - X value in data coordinates
     * @returns {number} X value in canvas coordinates
     */
    xScale(dataX) {
        return this.marginLeft + (dataX / this.maxX) * this.chartWidth;
    }

    /**
     * Convert data Y coordinate to canvas Y coordinate
     * @param {number} dataY - Y value in data coordinates
     * @returns {number} Y value in canvas coordinates
     */
    yScale(dataY) {
        return this.marginTop + this.chartHeight - (dataY / this.maxY) * this.chartHeight;
    }
}
