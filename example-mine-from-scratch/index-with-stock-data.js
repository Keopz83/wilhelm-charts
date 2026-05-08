// Get the canvas and context
const canvas = document.getElementById('chart');
const ctx = canvas.getContext('2d');

// Create line configuration
const lineConfig = new LineConfig({
    lineColor: '#1eb100',
    lineWidth: 2,
    dotRadius: 0, // No dots for stock data (too many points)
    showLabels: false
});

// Async function to load and display stock data
async function loadStockChart() {
    try {
        // Fetch GOOGL stock data for the last 100 days
        const stockData = await getStockChartData('GOOGL', 100, '1y');
        
        // Create chart configuration with dynamic Y-axis range
        const config = new ChartConfig(canvas.width, canvas.height, {
            maxX: stockData.dataPoints.length - 1,
            minY: stockData.minY,
            maxY: stockData.maxY,
            xTickInterval: stockData.xTickInterval,
            yTickInterval: Math.ceil((stockData.maxY - stockData.minY) / 10)
        });
        
        // Draw the chart
        drawChart(ctx, config, stockData.dataPoints, lineConfig);
        
        console.log('Stock chart loaded successfully!');
    } catch (error) {
        console.error('Failed to load stock data:', error.message);
        console.log('Using mock data instead...');
        
        // Fallback to mock data if API fails
        useMockData();
    }
}

// Fallback function with mock data
function useMockData() {
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
    
    const config = new ChartConfig(canvas.width, canvas.height);
    drawChart(ctx, config, dataPoints, lineConfig);
}

// Load the stock chart
loadStockChart();
