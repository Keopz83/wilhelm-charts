/**
 * Draw a line chart with data points
 * @param {CanvasRenderingContext2D} ctx - The canvas rendering context
 * @param {ChartConfig} config - ChartConfig instance with all chart settings
 * @param {Array} dataPoints - Array of data points with x and y properties
 * @param {LineConfig} lineConfig - LineConfig instance with styling settings
 */
function drawChart(ctx, config, dataPoints, lineConfig) {

    // Line style
    ctx.strokeStyle = lineConfig.lineColor;
    ctx.lineWidth = lineConfig.lineWidth;

    // Draw line segments
    ctx.beginPath();
    const firstPoint = dataPoints[0];
    ctx.moveTo(config.xScale(firstPoint.x), config.yScale(firstPoint.y));
    for (let i = 1; i < dataPoints.length; i++) {
        ctx.lineTo(config.xScale(dataPoints[i].x), config.yScale(dataPoints[i].y));
    }
    ctx.stroke();

    // Draw dots on vertices
    ctx.fillStyle = lineConfig.lineColor;
    dataPoints.forEach(point => {
        ctx.beginPath();
        ctx.arc(config.xScale(point.x), config.yScale(point.y), lineConfig.dotRadius, 0, Math.PI * 2);
        ctx.fill();
    });

    // Draw data labels on first and last points
    if (lineConfig.showLabels) {
        ctx.fillStyle = lineConfig.lineColor;
        ctx.font = lineConfig.labelFont;
        ctx.textBaseline = 'bottom';

        // First point label
        const firstPt = dataPoints[0];
        ctx.textAlign = 'center';
        ctx.fillText(firstPt.y.toString(), config.xScale(firstPt.x), config.yScale(firstPt.y) - 7);

        // Last point label
        const lastPt = dataPoints[dataPoints.length - 1];
        ctx.textAlign = 'center';
        ctx.fillText(lastPt.y.toString(), config.xScale(lastPt.x), config.yScale(lastPt.y) - 7);
    }
}
