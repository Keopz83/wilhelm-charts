/**
 * Helper function to draw a single line on the chart
 * @param {CanvasRenderingContext2D} ctx - The canvas rendering context
 * @param {ChartConfig} config - ChartConfig instance
 * @param {Array} dataPoints - Array of data points
 * @param {Object} lineStyle - Line styling {color, lineWidth, dotRadius}
 */
function drawLine(ctx, config, dataPoints, lineStyle = {}) {
    const {
        color = '#1eb100',
        lineWidth = 1,
        dotRadius = 0
    } = lineStyle;
    
    if (dataPoints.length === 0) return;
    
    // Line style
    ctx.strokeStyle = color;
    ctx.lineWidth = lineWidth;
    
    // Draw line segments
    ctx.beginPath();
    const firstPoint = dataPoints[0];
    ctx.moveTo(config.xScale(firstPoint.x), config.yScale(firstPoint.y));
    for (let i = 1; i < dataPoints.length; i++) {
        ctx.lineTo(config.xScale(dataPoints[i].x), config.yScale(dataPoints[i].y));
    }
    ctx.stroke();
    
    // Draw dots on vertices if specified
    if (dotRadius > 0) {
        ctx.fillStyle = color;
        dataPoints.forEach(point => {
            ctx.beginPath();
            ctx.arc(config.xScale(point.x), config.yScale(point.y), dotRadius, 0, Math.PI * 2);
            ctx.fill();
        });
    }
}
