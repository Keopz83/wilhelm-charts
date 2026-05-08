/**
 * Fetch stock data from Yahoo Finance (via proxy server)
 * Note: Requires proxy-server.js to be running on localhost:3000
 */

// Set to true to use local proxy server (avoids CORS), false to try direct Yahoo Finance
const USE_PROXY = true;
const PROXY_URL = 'http://localhost:3000/api/stock';

/**
 * Fetch daily stock data for a symbol from Yahoo Finance
 * @param {string} symbol - Stock symbol (e.g., 'GOOGL')
 * @param {string} [period='1y'] - Time period: '1d', '5d', '1mo', '3mo', '6mo', '1y', '2y', '5y', '10y', 'ytd', 'max'
 * @param {string} [interval='1d'] - Data interval: '1m', '2m', '5m', '15m', '30m', '60m', '90m', '1h', '1d', '5d', '1wk', '1mo', '3mo'
 * @returns {Promise<Array>} Array of {x: timestamp, y: close price}
 */
async function fetchStockData(symbol, period = '1y', interval = '1d') {
    // Build URL based on whether we're using proxy or direct
    const url = USE_PROXY 
        ? `${PROXY_URL}/${symbol}?period=${period}&interval=${interval}`
        : `https://query1.finance.yahoo.com/v8/finance/chart/${symbol}?period1=0&period2=9999999999&interval=${interval}&range=${period}`;
    
    try {
        const response = await fetch(url);
        
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const data = await response.json();
        
        if (data.chart.error) {
            throw new Error(data.chart.error.description);
        }
        
        const result = data.chart.result[0];
        const timestamps = result.timestamp;
        const quotes = result.indicators.quote[0];
        
        // Convert to array format
        const dataPoints = timestamps.map((timestamp, index) => ({
            date: new Date(timestamp * 1000).toISOString().split('T')[0],
            timestamp: timestamp * 1000,
            open: quotes.open[index],
            high: quotes.high[index],
            low: quotes.low[index],
            close: quotes.close[index],
            volume: quotes.volume[index]
        }));
        
        // Filter out null values
        return dataPoints.filter(point => point.close !== null);
        
    } catch (error) {
        console.error('Error fetching stock data from Yahoo Finance:', error);
        
        // Check if it's a CORS error
        if (error.message.includes('CORS') || error.name === 'TypeError') {
            console.error('CORS error detected. You need to either:');
            console.error('1. Use a CORS proxy');
            console.error('2. Set up a backend server to fetch the data');
            console.error('3. Use a browser extension to disable CORS (dev only)');
        }
        
        throw error;
    }
}

/**
 * Transform stock data to chart format
 * @param {Array} stockData - Array of stock data objects
 * @param {number} maxPoints - Maximum number of points to display
 * @returns {Array} Array of {x: index, y: close price}
 */
function transformToChartData(stockData, maxPoints = 100) {
    // Take the most recent points
    const recentData = stockData.slice(-maxPoints);
    
    // Transform to simple x/y format for the chart
    return recentData.map((item, index) => ({
        x: index,
        y: item.close,
        date: item.date
    }));
}

/**
 * Get stock data formatted for the chart
 * @param {string} symbol - Stock symbol
 * @param {number} [maxDays=100] - Maximum number of days to display
 * @param {string} [period='1y'] - Time period for Yahoo Finance
 * @returns {Promise<Object>} Object with dataPoints, minY, maxY, and xTickInterval
 */
async function getStockChartData(symbol, maxDays = 100, period = '1y') {
    const stockData = await fetchStockData(symbol, period, '1d');
    const chartData = transformToChartData(stockData, maxDays);
    
    // Calculate min and max for Y-axis
    const prices = chartData.map(d => d.y);
    const minPrice = Math.min(...prices);
    const maxPrice = Math.max(...prices);
    
    // Add 5% padding to min/max
    const padding = (maxPrice - minPrice) * 0.05;
    
    return {
        dataPoints: chartData,
        minY: Math.floor(minPrice - padding),
        maxY: Math.ceil(maxPrice + padding),
        xTickInterval: Math.ceil(maxDays / 10) // Show ~10 ticks
    };
}
