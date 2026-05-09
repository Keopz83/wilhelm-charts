/**
 * Draw X and Y axes with ticks and labels
 * @param {CanvasRenderingContext2D} ctx - The canvas rendering context
 * @param {ChartConfig} config - ChartConfig instance with all chart settings
 * @param {Array} dataPoints - Array of data points with date property
 */
function drawAxes(ctx, config, dataPoints) {

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
    const xTicks = new Set();
    
    // Add ticks at intervals starting from minX
    for (let x = config.minX; x <= config.maxX; x += config.xTickInterval) {
        xTicks.add(x);
    }
    
    // Always include the first and last ticks
    xTicks.add(config.minX);
    xTicks.add(config.maxX);
    
    // Draw all ticks
    xTicks.forEach(x => {
        const canvasX = config.xScale(x);
        
        // Draw tick mark
        ctx.beginPath();
        ctx.moveTo(canvasX, config.marginTop + config.chartHeight);
        ctx.lineTo(canvasX, config.marginTop + config.chartHeight + 5);
        ctx.stroke();
        
        // Draw label - show date instead of x value
        const dataIndex = Math.round(x) - 1; // Convert x (1-based) to array index (0-based)
        if (dataIndex >= 0 && dataIndex < dataPoints.length && dataPoints[dataIndex].date) {
            const date = new Date(dataPoints[dataIndex].date);
            const label = `${date.getMonth() + 1}/${date.getDate()}`; // Format as MM/DD
            ctx.fillText(label, canvasX, config.marginTop + config.chartHeight + 7);
        } else {
            ctx.fillText(Math.round(x).toString(), canvasX, config.marginTop + config.chartHeight + 7);
        }
    });

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
    // Start from the first tick aligned with the interval
    const firstYTick = Math.floor(config.minY / config.yTickInterval) * config.yTickInterval;
    for (let y = firstYTick; y <= config.maxY; y += config.yTickInterval) {
        // Skip if below minY
        if (y < config.minY) continue;
        
        const canvasY = config.yScale(y);
        
        // Draw tick mark
        ctx.beginPath();
        ctx.moveTo(rightX, canvasY);
        ctx.lineTo(rightX + 5, canvasY);
        ctx.stroke();
        
        // Draw label
        ctx.fillText(y.toFixed(0), rightX + 7, canvasY);
    }
}
