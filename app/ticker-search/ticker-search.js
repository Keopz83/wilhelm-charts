/**
 * Ticker Search Module
 * Manages ticker input and load controls
 */

/**
 * Initialize ticker search controls
 * @param {string} containerId - ID of the container element
 * @param {Function} onLoad - Callback when ticker should be loaded
 * @returns {Object} API object with methods to interact with search controls
 */
function initTickerSearch(containerId, onLoad) {
    const container = document.getElementById(containerId);
    
    if (!container) {
        console.error(`Container with id "${containerId}" not found`);
        return null;
    }
    
    // Create ticker search HTML structure
    container.innerHTML = `
        <div class="controls">
            <label for="ticker">Ticker:</label>
            <input type="text" id="ticker" value="GOOGL" placeholder="Enter ticker (e.g., AAPL, MSFT, TSLA)">
            <button id="loadBtn">Load Chart</button>
            <span id="status"></span>
        </div>
    `;
    
    const tickerInput = document.getElementById('ticker');
    const loadBtn = document.getElementById('loadBtn');
    const statusEl = document.getElementById('status');
    
    /**
     * Get current ticker value
     * @returns {string} Ticker symbol (uppercase)
     */
    function getTicker() {
        return tickerInput.value.trim().toUpperCase();
    }
    
    /**
     * Set ticker value
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
        statusEl.className = type;
    }
    
    /**
     * Enable or disable the load button
     * @param {boolean} enabled - Whether button should be enabled
     */
    function setEnabled(enabled) {
        loadBtn.disabled = !enabled;
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
    
    // Event listeners
    loadBtn.addEventListener('click', handleLoad);
    
    tickerInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            handleLoad();
        }
    });
    
    // Return public API
    return {
        getTicker,
        setTicker,
        setStatus,
        setEnabled
    };
}
