/**
 * Ticker List Module
 * Manages the display and interaction of ticker symbols in the sidebar
 */

/**
 * Initialize ticker list in the container
 * @param {string} containerId - ID of the container element
 * @param {Function} onTickerClick - Callback when a ticker is clicked
 * @returns {Object} API object with methods to interact with ticker list
 */
function initTickerList(containerId, onTickerClick) {
    const container = document.getElementById(containerId);
    
    if (!container) {
        console.error(`Container with id "${containerId}" not found`);
        return null;
    }
    
    // Create ticker list HTML structure
    container.innerHTML = `
        <div class="ticker-list">
            <h3>Active Tickers</h3>
            <ul id="tickerListItems">
                <!-- Ticker items will be added here dynamically -->
            </ul>
        </div>
    `;
    
    const tickerListEl = document.getElementById('tickerListItems');
    let currentTicker = null;
    
    /**
     * Add or update ticker in the list
     * @param {string} ticker - Ticker symbol
     * @param {number} price - Current price
     */
    function addOrUpdateTicker(ticker, price) {
        currentTicker = ticker;
        
        // Check if ticker already exists
        let tickerItem = document.querySelector(`[data-ticker="${ticker}"]`);
        
        if (!tickerItem) {
            // Create new ticker item
            tickerItem = document.createElement('li');
            tickerItem.setAttribute('data-ticker', ticker);
            tickerItem.innerHTML = `
                <span class="ticker-symbol">${ticker}</span>
                <span class="ticker-price">$${price.toFixed(2)}</span>
            `;
            
            // Add click handler
            tickerItem.addEventListener('click', () => {
                if (onTickerClick) {
                    onTickerClick(ticker);
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
        }
    }
    
    /**
     * Clear all tickers from the list
     */
    function clearAll() {
        tickerListEl.innerHTML = '';
        currentTicker = null;
    }
    
    /**
     * Get the currently active ticker
     * @returns {string|null} Current ticker symbol
     */
    function getCurrentTicker() {
        return currentTicker;
    }
    
    // Return public API
    return {
        addOrUpdateTicker,
        removeTicker,
        clearAll,
        getCurrentTicker
    };
}
