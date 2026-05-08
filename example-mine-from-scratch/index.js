// Get the canvas and context
const canvas = document.getElementById('chart');
const ctx = canvas.getContext('2d');

// Create chart configuration
const config = new ChartConfig({
    marginLeft: 20,
    marginTop: 20,
    marginRight: 50,
    marginBottom: 20,
    chartWidth: 800,
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

// Create line configuration
const lineConfig = new LineConfig({
    lineColor: '#1eb100',
    lineWidth: 1,
    dotRadius: 3,
    showLabels: true
});

// Draw the chart with data points
drawChart(ctx, config, dataPoints, lineConfig);
