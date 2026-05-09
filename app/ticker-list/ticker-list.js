/**
 * Ticker List Module
 * Manages the display and interaction of ticker symbols in the sidebar
 * Includes search controls for loading new tickers
 */

/**
 * Initialize ticker list in the container
 * @param {string} containerId - ID of the container element
 * @param {Function} onTickerClick - Callback when a ticker is clicked
 * @param {Function} onLoad - Callback when ticker should be loaded
 * @returns {Object} API object with methods to interact with ticker list
 */
function initTickerList(containerId, onTickerClick, onLoad) {
    const container = document.getElementById(containerId);
    
    if (!container) {
        console.error(`Container with id "${containerId}" not found`);
        return null;
    }
    
    // Create ticker list HTML structure with search controls
    container.innerHTML = `
        <div class="ticker-list">
            <div class="ticker-search-controls">
                <label for="tickerInput">Ticker:</label>
                <input type="text" id="tickerInput" value="GOOGL" placeholder="e.g., AAPL, MSFT">
                <button id="loadTickerBtn">Load</button>
                <span id="tickerStatus"></span>
            </div>
            <h3>Active Tickers</h3>
            <ul id="tickerListItems">
                <!-- Ticker items will be added here dynamically -->
            </ul>
        </div>
    `;
    
    const tickerListEl = document.getElementById('tickerListItems');
    const tickerInput = document.getElementById('tickerInput');
    const loadBtn = document.getElementById('loadTickerBtn');
    const statusEl = document.getElementById('tickerStatus');
    let currentTicker = null;
    const STORAGE_KEY_COLORS = 'wilhelm_charts_ticker_colors';
    const STORAGE_KEY_TICKERS = 'wilhelm_charts_active_tickers';
    
    // Default color palette for tickers
    const DEFAULT_COLORS = ['#ffffff', '#00bfff', '#ff6347', '#ffa500', '#9370db', '#20b2aa'];
    let colorIndex = 0;
    
    // Map to store ticker colors
    const tickerColors = new Map();
    
    // Map to store ticker data (symbol -> {price, timestamp})
    const tickerData = new Map();
    
    /**
     * Get current ticker value from input
     * @returns {string} Ticker symbol (uppercase)
     */
    function getTicker() {
        return tickerInput.value.trim().toUpperCase();
    }
    
    /**
     * Set ticker value in input
     * @param {string} ticker - Ticker symbol
     */
    function setTicker(ticker) {
        tickerInput.value = ticker.toUpperCase();
    }
    
    /**
     * Update status message
     * @param {string} message - Status message
     * @param {string} type - Status type: 'loading', 'error', or '' for normal
     */
    function setStatus(message, type = '') {
        statusEl.textContent = message;
        statusEl.className = 'ticker-status ' + type;
    }
    
    /**
     * Enable or disable the load button
     * @param {boolean} enabled - Whether button should be enabled
     */
    function setEnabled(enabled) {
        loadBtn.disabled = !enabled;
        tickerInput.disabled = !enabled;
    }
    
    /**
     * Handle load button click or Enter key
     */
    function handleLoad() {
        const ticker = getTicker();
        if (ticker && onLoad) {
            onLoad(ticker);
        }
    }
    
    // Event listeners for search controls
    loadBtn.addEventListener('click', handleLoad);
    
    tickerInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            handleLoad();
        }
    });
    
    // Load colors from localStorage
    try {
        const stored = localStorage.getItem(STORAGE_KEY_COLORS);
        if (stored) {
            const data = JSON.parse(stored);
            Object.entries(data).forEach(([ticker, color]) => {
                tickerColors.set(ticker, color);
            });
        }
    } catch (error) {
        console.error('Error loading ticker colors:', error);
    }
    
    // Load ticker data from localStorage
    try {
        const stored = localStorage.getItem(STORAGE_KEY_TICKERS);
        if (stored) {
            const data = JSON.parse(stored);
            Object.entries(data).forEach(([ticker, info]) => {
                tickerData.set(ticker, info);
            });
        }
    } catch (error) {
        console.error('Error loading ticker data:', error);
    }
    
    /**
     * Save ticker colors to localStorage
     */
    function saveColors() {
        try {
            const data = Object.fromEntries(tickerColors);
            localStorage.setItem(STORAGE_KEY_COLORS, JSON.stringify(data));
        } catch (error) {
            console.error('Error saving ticker colors:', error);
        }
    }
    
    /**
     * Save active tickers to localStorage
     */
    function saveTickers() {
        try {
            const data = Object.fromEntries(tickerData);
            localStorage.setItem(STORAGE_KEY_TICKERS, JSON.stringify(data));
        } catch (error) {
            console.error('Error saving ticker data:', error);
        }
    }
    
    /**
     * Get color for a ticker (or assign default if new)
     * @param {string} ticker - Ticker symbol
     * @returns {string} Color hex code
     */
    function getTickerColor(ticker) {
        if (!tickerColors.has(ticker)) {
            const color = DEFAULT_COLORS[colorIndex % DEFAULT_COLORS.length];
            colorIndex++;
            tickerColors.set(ticker, color);
            saveColors();
        }
        return tickerColors.get(ticker);
    }
    
    /**
     * Set color for a ticker
     * @param {string} ticker - Ticker symbol
     * @param {string} color - Color hex code
     */
    function setTickerColor(ticker, color) {
        tickerColors.set(ticker, color);
        saveColors();
    }
    
    /**
     * Add or update ticker in the list
     * @param {string} ticker - Ticker symbol
     * @param {number} price - Current price
     */
    function addOrUpdateTicker(ticker, price) {
        currentTicker = ticker;
        
        // Save ticker data
        tickerData.set(ticker, {
            price: price,
            timestamp: Date.now()
        });
        saveTickers();
        
        // Check if ticker already exists
        let tickerItem = document.querySelector(`[data-ticker="${ticker}"]`);
        
        if (!tickerItem) {
            // Get or assign color for this ticker
            const tickerColor = getTickerColor(ticker);
            
            // Create new ticker item
            tickerItem = document.createElement('li');
            tickerItem.setAttribute('data-ticker', ticker);
            tickerItem.innerHTML = `
                <input type="color" class="ticker-color-picker" value="${tickerColor}" title="Chart color" />
                <span class="ticker-symbol">${ticker}</span>
                <span class="ticker-price">$${price.toFixed(2)}</span>
            `;
            
            // Add color picker change handler
            const colorPicker = tickerItem.querySelector('.ticker-color-picker');
            colorPicker.addEventListener('click', (e) => {
                e.stopPropagation(); // Prevent ticker click
            });
            colorPicker.addEventListener('change', (e) => {
                e.stopPropagation();
                setTickerColor(ticker, e.target.value);
                // Reload the chart with new color if this is active ticker
                if (currentTicker === ticker && onTickerClick) {
                    onTickerClick(ticker);
                }
            });
            
            // Add click handler for ticker item
            tickerItem.addEventListener('click', (e) => {
                // Only trigger if not clicking on color picker
                if (!e.target.classList.contains('ticker-color-picker')) {
                    if (onTickerClick) {
                        onTickerClick(ticker);
                    }
                }
            });
            
            tickerListEl.appendChild(tickerItem);
        } else {
            // Update existing ticker price
            const priceEl = tickerItem.querySelector('.ticker-price');
            priceEl.textContent = `$${price.toFixed(2)}`;
        }
        
        // Mark as active
        document.querySelectorAll('.ticker-list li').forEach(li => {
            li.classList.remove('active');
        });
        tickerItem.classList.add('active');
    }
    
    /**
     * Remove a ticker from the list
     * @param {string} ticker - Ticker symbol
     */
    function removeTicker(ticker) {
        const tickerItem = document.querySelector(`[data-ticker="${ticker}"]`);
        if (tickerItem) {
            tickerItem.remove();
            tickerData.delete(ticker);
            saveTickers();
        }
    }
    
    /**
     * Clear all tickers from the list
     */
    function clearAll() {
        tickerListEl.innerHTML = '';
        currentTicker = null;
        tickerData.clear();
        saveTickers();
    }
    
    /**
     * Get the currently active ticker
     * @returns {string|null} Current ticker symbol
     */
    function getCurrentTicker() {
        return currentTicker;
    }
    
    /**
     * Get all saved tickers from storage
     * @returns {Array} Array of {ticker, price, timestamp}
     */
    function getSavedTickers() {
        const tickers = [];
        tickerData.forEach((data, ticker) => {
            tickers.push({
                ticker: ticker,
                price: data.price,
                timestamp: data.timestamp
            });
        });
        // Sort by timestamp (most recent first)
        return tickers.sort((a, b) => b.timestamp - a.timestamp);
    }
    
    // Return public API
    return {
        addOrUpdateTicker,
        removeTicker,
        clearAll,
        getCurrentTicker,
        getTickerColor,
        setTickerColor,
        getTicker,
        setTicker,
        setStatus,
        setEnabled,
        getSavedTickers
    };
}
