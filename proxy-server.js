const express = require('express');
const cors = require('cors');
const fetch = require('node-fetch');

const app = express();
const PORT = 3000;

// Enable CORS for all requests
app.use(cors());

// Serve static files from current directory
app.use(express.static(__dirname));

// Proxy endpoint for Yahoo Finance
app.get('/api/stock/:symbol', async (req, res) => {
    const { symbol } = req.params;
    const { period = '1y', interval = '1d' } = req.query;
    
    const url = `https://query1.finance.yahoo.com/v8/finance/chart/${symbol}?period1=0&period2=9999999999&interval=${interval}&range=${period}`;
    
    try {
        const response = await fetch(url);
        const data = await response.json();
        res.json(data);
    } catch (error) {
        console.error('Error fetching from Yahoo Finance:', error);
        res.status(500).json({ error: 'Failed to fetch stock data' });
    }
});

app.listen(PORT, () => {
    console.log(`Proxy server running at http://localhost:${PORT}`);
    console.log(`Open http://localhost:${PORT}/app/index.html to view the chart`);
});
