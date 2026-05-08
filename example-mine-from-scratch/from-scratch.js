// Get the canvas and context
const canvas = document.getElementById('chart');
const ctx = canvas.getContext('2d');

// Create chart configuration
const config = new ChartConfig({
    marginLeft: 20,
    marginTop: 20,
    marginRight: 50,
    marginBottom: 20,
    chartWidth: 860,
    chartHeight: 460,
    maxX: 800,
    maxY: 500,
    xTickInterval: 100,
    yTickInterval: 100
});

// Data points (in data coordinates, 100 apart in X)
const dataPoints = [
    { x: 0, y: 50 },
    { x: 100, y: 150 },
    { x: 200, y: 300 },
    { x: 300, y: 400 },
    { x: 400, y: 350 },
    { x: 500, y: 250 },
    { x: 600, y: 400 },
    { x: 700, y: 200 },
    { x: 800, y: 450 }
];

// Draw axes
drawAxes(ctx, config);

// Line style
ctx.strokeStyle = '#0f8400';
ctx.lineWidth = 1;

// Draw line segments
ctx.beginPath();
const firstPoint = dataPoints[0];
ctx.moveTo(config.xScale(firstPoint.x), config.yScale(firstPoint.y));
for (let i = 1; i < dataPoints.length; i++) {
    ctx.lineTo(config.xScale(dataPoints[i].x), config.yScale(dataPoints[i].y));
}
ctx.stroke();

// Draw dots on vertices
ctx.fillStyle = '#0f8400';
dataPoints.forEach(point => {
    ctx.beginPath();
    ctx.arc(config.xScale(point.x), config.yScale(point.y), 3, 0, Math.PI * 2);
    ctx.fill();
});

// Draw data labels on first and last points
ctx.fillStyle = '#0f8400';
ctx.font = '12px Arial';
ctx.textBaseline = 'bottom';

// First point label
const firstPt = dataPoints[0];
ctx.textAlign = 'left';
ctx.fillText(firstPt.y.toString(), config.xScale(firstPt.x) + 5, config.yScale(firstPt.y) - 5);

// Last point label
const lastPt = dataPoints[dataPoints.length - 1];
ctx.textAlign = 'right';
ctx.fillText(lastPt.y.toString(), config.xScale(lastPt.x) - 5, config.yScale(lastPt.y) - 5);
