// Initialize modules
const chart = initChart('chart', 900, 400);
const tickerList = initTickerList('tickerListContainer', (ticker) => {
    // Handle ticker click from list
    loadStockChart(ticker);
}, (ticker) => {
    // Handle load from search
    loadStockChart(ticker);
});

// Store current stock data for redrawing with indicators
let currentStockData = null;
let currentTicker = null;
let currentSignalMarkers = [];

// Initialize indicators panel
const indicatorsPanel = initIndicatorsPanel('indicatorsContainer', (activeIndicators) => {
    // Redraw chart with updated indicators
    if (currentStockData && chart && currentTicker) {
        const tickerColor = tickerList ? tickerList.getTickerColor(currentTicker) : null;
        chart.drawStockChart(
            currentStockData.dataPoints,
            currentStockData.minY,
            currentStockData.maxY,
            currentStockData.xTickInterval,
            activeIndicators,
            tickerColor,
            currentSignalMarkers
        );
    }
});

// Initialize signals panel
const signalsPanel = initSignalsPanel('signalsContainer', (crossings) => {
    // Handle signal click - highlight crossings on chart
    currentSignalMarkers = crossings;
    
    if (currentStockData && chart && currentTicker) {
        const activeIndicators = indicatorsPanel ? indicatorsPanel.getActiveIndicators() : [];
        const tickerColor = tickerList ? tickerList.getTickerColor(currentTicker) : null;
        chart.drawStockChart(
            currentStockData.dataPoints,
            currentStockData.minY,
            currentStockData.maxY,
            currentStockData.xTickInterval,
            activeIndicators,
            tickerColor,
            currentSignalMarkers
        );
    }
});

// Async function to load and display stock data
async function loadStockChart(ticker = 'GOOGL') {
    if (!chart || !tickerList) return;
    
    try {
        // Update status
        tickerList.setStatus(`Loading ${ticker}...`, 'loading');
        tickerList.setEnabled(false);
        
        // Reset signal markers when loading new ticker
        currentSignalMarkers = [];
        
        // Fetch stock data for the last 100 days
        const stockData = await getStockChartData(ticker, 100, '1y');
        
        // Store current stock data
        currentStockData = stockData;
        currentTicker = ticker;
        
        // Get active indicators
        const activeIndicators = indicatorsPanel ? indicatorsPanel.getActiveIndicators() : [];
        
        // Get ticker color
        const tickerColor = tickerList ? tickerList.getTickerColor(ticker) : null;
        
        // Draw the chart with indicators (no signal markers initially)
        chart.drawStockChart(
            stockData.dataPoints,
            stockData.minY,
            stockData.maxY,
            stockData.xTickInterval,
            activeIndicators,
            tickerColor,
            []
        );
        
        // Update ticker list with latest price
        const latestPrice = stockData.dataPoints[stockData.dataPoints.length - 1].y;
        if (tickerList) {
            tickerList.addOrUpdateTicker(ticker, latestPrice);
        }
        
        // Analyze signals
        if (signalsPanel) {
            signalsPanel.analyzeSignals(stockData.dataPoints, ticker);
        }
        
        // Update status
        tickerList.setStatus(`${ticker} loaded successfully`, '');
        console.log('Stock chart loaded successfully!');
    } catch (error) {
        console.error('Failed to load stock data:', error.message);
        
        // Update status
        tickerList.setStatus(`Failed to load ${ticker}: ${error.message}`, 'error');
        
        console.log('Using mock data instead...');
        
        // Fallback to mock data if API fails
        useMockData();
    } finally {
        tickerList.setEnabled(true);
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

// Load saved tickers or initial chart
if (tickerList) {
    const savedTickers = tickerList.getSavedTickers();
    
    if (savedTickers && savedTickers.length > 0) {
        // Restore all saved tickers to the display
        savedTickers.forEach(saved => {
            tickerList.addOrUpdateTicker(saved.ticker, saved.price);
        });
        
        // Load the most recent ticker (first in sorted array)
        const mostRecent = savedTickers[0];
        console.log('Loading saved ticker:', mostRecent.ticker);
        loadStockChart(mostRecent.ticker);
    } else {
        // Load default ticker
        loadStockChart(tickerList.getTicker());
    }
}

