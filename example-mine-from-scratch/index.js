// Get the canvas and context
const canvas = document.getElementById('chart');
const ctx = canvas.getContext('2d');

// Get UI elements
const tickerInput = document.getElementById('ticker');
const loadBtn = document.getElementById('loadBtn');
const statusEl = document.getElementById('status');

// Create line configuration
const lineConfig = new LineConfig({
    lineColor: '#1eb100',
    lineWidth: 1,
    dotRadius: 0, // No dots for stock data (too many points)
    showLabels: false
});

// Async function to load and display stock data
async function loadStockChart(ticker = 'GOOGL') {
    try {
        // Update status
        statusEl.textContent = `Loading ${ticker}...`;
        statusEl.className = 'loading';
        loadBtn.disabled = true;
        
        // Clear canvas
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        
        // Fetch stock data for the last 100 days
        const stockData = await getStockChartData(ticker, 100, '1y');
        
        // Create chart configuration with dynamic Y-axis range
        const config = new ChartConfig(canvas.width, canvas.height, {
            minX: 1,
            maxX: stockData.dataPoints.length,
            minY: stockData.minY,
            maxY: stockData.maxY,
            xTickInterval: stockData.xTickInterval,
            yTickInterval: Math.ceil((stockData.maxY - stockData.minY) / 10)
        });
        
        // Draw the chart
        drawChart(ctx, config, stockData.dataPoints, lineConfig);
        
        // Update status
        statusEl.textContent = `${ticker} loaded successfully`;
        statusEl.className = '';
        console.log('Stock chart loaded successfully!');
    } catch (error) {
        console.error('Failed to load stock data:', error.message);
        
        // Update status
        statusEl.textContent = `Failed to load ${ticker}: ${error.message}`;
        statusEl.className = 'error';
        
        console.log('Using mock data instead...');
        
        // Fallback to mock data if API fails
        useMockData();
    } finally {
        loadBtn.disabled = false;
    }
}

// Fallback function with mock data
function useMockData() {
    const dataPoints = [
        { x: 1, y: 50 },
        { x: 2, y: 150 },
        { x: 3, y: 300 },
        { x: 4, y: 400 },
        { x: 5, y: 350 },
        { x: 6, y: 250 },
        { x: 7, y: 400 },
        { x: 8, y: 200 },
        { x: 9, y: 450 }
    ];
    
    const config = new ChartConfig(canvas.width, canvas.height, {
        minX: 1,
        maxX: 9
    });
    drawChart(ctx, config, dataPoints, lineConfig);
}

// Event listeners
loadBtn.addEventListener('click', () => {
    const ticker = tickerInput.value.trim().toUpperCase();
    if (ticker) {
        loadStockChart(ticker);
    }
});

tickerInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
        const ticker = tickerInput.value.trim().toUpperCase();
        if (ticker) {
            loadStockChart(ticker);
        }
    }
});

// Load the initial chart
loadStockChart(tickerInput.value);

