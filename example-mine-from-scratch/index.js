// Get the canvas and context
const canvas = document.getElementById('chart');
const ctx = canvas.getContext('2d');

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

// Create chart configuration (canvas dimensions with automatic margin/layout calculation)
const config = new ChartConfig(canvas.width, canvas.height);

// Create line configuration
const lineConfig = new LineConfig({
    lineColor: '#1eb100',
    lineWidth: 1,
    dotRadius: 3,
    showLabels: true
});

// Draw the chart with data points
drawChart(ctx, config, dataPoints, lineConfig);
