// Initialize modules
const tickerSearch = initTickerSearch('tickerSearchContainer', loadStockChart);
const chart = initChart('chart', 900, 400);
const tickerList = initTickerList('tickerListContainer', (ticker) => {
    if (tickerSearch) {
        tickerSearch.setTicker(ticker);
        loadStockChart(ticker);
    }
});

// Store current stock data for redrawing with indicators
let currentStockData = null;

// Initialize indicators panel
const indicatorsPanel = initIndicatorsPanel('indicatorsContainer', (activeIndicators) => {
    // Redraw chart with updated indicators
    if (currentStockData && chart) {
        chart.drawStockChart(
            currentStockData.dataPoints,
            currentStockData.minY,
            currentStockData.maxY,
            currentStockData.xTickInterval,
            activeIndicators
        );
    }
});

// Async function to load and display stock data
async function loadStockChart(ticker = 'GOOGL') {
    if (!chart || !tickerSearch) return;
    
    try {
        // Update status
        tickerSearch.setStatus(`Loading ${ticker}...`, 'loading');
        tickerSearch.setEnabled(false);
        
        // Fetch stock data for the last 100 days
        const stockData = await getStockChartData(ticker, 100, '1y');
        
        // Store current stock data
        currentStockData = stockData;
        
        // Get active indicators
        const activeIndicators = indicatorsPanel ? indicatorsPanel.getActiveIndicators() : [];
        
        // Draw the chart with indicators
        chart.drawStockChart(
            stockData.dataPoints,
            stockData.minY,
            stockData.maxY,
            stockData.xTickInterval,
            activeIndicators
        );
        
        // Update ticker list with latest price
        const latestPrice = stockData.dataPoints[stockData.dataPoints.length - 1].y;
        if (tickerList) {
            tickerList.addOrUpdateTicker(ticker, latestPrice);
        }
        
        // Update status
        tickerSearch.setStatus(`${ticker} loaded successfully`, '');
        console.log('Stock chart loaded successfully!');
    } catch (error) {
        console.error('Failed to load stock data:', error.message);
        
        // Update status
        tickerSearch.setStatus(`Failed to load ${ticker}: ${error.message}`, 'error');
        
        console.log('Using mock data instead...');
        
        // Fallback to mock data if API fails
        useMockData();
    } finally {
        tickerSearch.setEnabled(true);
    }
}

// Fallback function with mock data
function useMockData() {
    if (!chart) return;
    
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
    
    chart.drawMockChart(dataPoints);
}

// Load the initial chart
if (tickerSearch) {
    loadStockChart(tickerSearch.getTicker());
}

