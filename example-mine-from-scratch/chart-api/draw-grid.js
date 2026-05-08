/**
 * Draw horizontal grid lines
 * @param {CanvasRenderingContext2D} ctx - The canvas rendering context
 * @param {ChartConfig} config - ChartConfig instance with all chart settings
 * @param {Object} [options] - Optional grid styling options
 * @param {string} [options.color='#333'] - Color of the grid lines
 * @param {number} [options.lineWidth=1] - Width of the grid lines
 */
function drawGrid(ctx, config, options = {}) {
    const {
        color = '#333',
        lineWidth = 1
    } = options;

    // Grid style
    ctx.strokeStyle = color;
    ctx.lineWidth = lineWidth;

    // Draw horizontal grid lines at each Y tick interval
    for (let y = 0; y <= config.maxY; y += config.yTickInterval) {
        const canvasY = config.yScale(y);
        
        ctx.beginPath();
        ctx.moveTo(config.marginLeft, canvasY);
        ctx.lineTo(config.marginLeft + config.chartWidth, canvasY);
        ctx.stroke();
    }
}
