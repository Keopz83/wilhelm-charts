/**
 * Draw X and Y axes with ticks and labels
 * @param {CanvasRenderingContext2D} ctx - The canvas rendering context
 * @param {ChartConfig} config - ChartConfig instance with all chart settings
 */
function drawAxes(ctx, config) {

    // Axis styling
    ctx.strokeStyle = '#666';
    ctx.fillStyle = '#999';
    ctx.font = '12px Arial';

    // Draw X-axis
    ctx.textAlign = 'center';
    ctx.textBaseline = 'top';

    // Draw X-axis line
    ctx.beginPath();
    ctx.moveTo(config.marginLeft, config.marginTop + config.chartHeight);
    ctx.lineTo(config.marginLeft + config.chartWidth, config.marginTop + config.chartHeight);
    ctx.stroke();

    // Draw X-axis ticks and labels
    for (let x = 0; x <= config.maxX; x += config.xTickInterval) {
        const canvasX = config.xScale(x);
        
        // Draw tick mark
        ctx.beginPath();
        ctx.moveTo(canvasX, config.marginTop + config.chartHeight);
        ctx.lineTo(canvasX, config.marginTop + config.chartHeight + 5);
        ctx.stroke();
        
        // Draw label
        ctx.fillText(x.toString(), canvasX, config.marginTop + config.chartHeight + 7);
    }

    // Draw Y-axis
    ctx.textAlign = 'left';
    ctx.textBaseline = 'middle';

    // Draw Y-axis line (on the right side)
    const rightX = config.marginLeft + config.chartWidth;
    ctx.beginPath();
    ctx.moveTo(rightX, config.marginTop);
    ctx.lineTo(rightX, config.marginTop + config.chartHeight);
    ctx.stroke();

    // Draw Y-axis ticks and labels
    for (let y = 0; y <= config.maxY; y += config.yTickInterval) {
        const canvasY = config.yScale(y);
        
        // Draw tick mark
        ctx.beginPath();
        ctx.moveTo(rightX, canvasY);
        ctx.lineTo(rightX + 5, canvasY);
        ctx.stroke();
        
        // Draw label
        ctx.fillText(y.toString(), rightX + 7, canvasY);
    }
}
