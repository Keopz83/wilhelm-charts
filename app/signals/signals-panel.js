/**
 * Signals Panel Module
 * Manages trading signals and alerts based on technical indicators
 */

/**
 * Initialize signals panel in the container
 * @param {string} containerId - ID of the container element
 * @param {Function} onSignalClick - Callback when a signal is clicked to highlight on chart
 * @returns {Object} API object with methods to interact with signals panel
 */
function initSignalsPanel(containerId, onSignalClick) {
    const container = document.getElementById(containerId);
    
    if (!container) {
        console.error(`Container with id "${containerId}" not found`);
        return null;
    }
    
    // Create signals panel HTML structure
    container.innerHTML = `
        <div class="signals-panel">
            <h3>Trading Signals</h3>
            <div class="signals-list" id="signalsList">
                <div class="signal-item no-signals">
                    No active signals
                </div>
            </div>
        </div>
    `;
    
    const signalsList = document.getElementById('signalsList');
    
    /**
     * Check for 10-day SMA crossing signal
     * @param {Array} dataPoints - Array of data points with x and y values
     * @returns {Array} Array of signal objects
     */
    function checkSmaCrossing(dataPoints) {
        if (!dataPoints || dataPoints.length < 12) {
            return [];
        }
        
        const signals = [];
        const period = 10;
        const prices = dataPoints.map(p => p.y);
        
        // Analyze the entire time series for crossings
        for (let i = period; i < prices.length; i++) {
            const currentIdx = i;
            const previousIdx = i - 1;
            
            const currentSma = calculateSMA(prices, period, currentIdx);
            const previousSma = calculateSMA(prices, period, previousIdx);
            const currentPrice = prices[currentIdx];
            const previousPrice = prices[previousIdx];
            
            if (!currentSma || !previousSma) {
                continue;
            }
            
            // Check for bullish cross (price crosses above SMA)
            if (previousPrice <= previousSma && currentPrice > currentSma) {
                signals.push({
                    type: 'bullish',
                    name: '10-Day SMA Cross',
                    description: 'Price crossed above 10-day SMA',
                    price: currentPrice.toFixed(2),
                    sma: currentSma.toFixed(2),
                    timestamp: Date.now(),
                    dataIndex: currentIdx,
                    date: dataPoints[currentIdx].date || `Point ${currentIdx}`
                });
            }
            
            // Check for bearish cross (price crosses below SMA)
            if (previousPrice >= previousSma && currentPrice < currentSma) {
                signals.push({
                    type: 'bearish',
                    name: '10-Day SMA Cross',
                    description: 'Price crossed below 10-day SMA',
                    price: currentPrice.toFixed(2),
                    sma: currentSma.toFixed(2),
                    timestamp: Date.now(),
                    dataIndex: currentIdx,
                    date: dataPoints[currentIdx].date || `Point ${currentIdx}`
                });
            }
        }
        
        return signals;
    }
    
    /**
     * Calculate Simple Moving Average
     * @param {Array} prices - Array of prices
     * @param {number} period - SMA period
     * @param {number} index - Index to calculate SMA for
     * @returns {number|null} SMA value or null
     */
    function calculateSMA(prices, period, index) {
        if (index < period - 1) {
            return null;
        }
        
        let sum = 0;
        for (let i = index - period + 1; i <= index; i++) {
            sum += prices[i];
        }
        
        return sum / period;
    }
    
    /**
     * Analyze data points for signals
     * @param {Array} dataPoints - Array of data points
     * @param {string} ticker - Ticker symbol
     */
    function analyzeSignals(dataPoints, ticker) {
        // Check for SMA crossing signals (returns array of crossings)
        const smaCrossings = checkSmaCrossing(dataPoints);
        
        const signals = [];
        
        // Create one signal entry with all crossings
        if (smaCrossings.length > 0) {
            const bullishCount = smaCrossings.filter(c => c.type === 'bullish').length;
            const bearishCount = smaCrossings.filter(c => c.type === 'bearish').length;
            
            signals.push({
                id: 'sma-10-crossing',
                name: '10-Day SMA Crossing',
                description: `${smaCrossings.length} crossings detected (${bullishCount} bullish, ${bearishCount} bearish)`,
                ticker: ticker,
                crossings: smaCrossings,
                type: 'multiple' // Indicates this contains multiple crossing points
            });
        }
        
        // Display signals
        displaySignals(signals);
    }
    
    /**
     * Display signals in the panel
     * @param {Array} signals - Array of signal objects
     */
    function displaySignals(signals) {
        if (!signals || signals.length === 0) {
            signalsList.innerHTML = `
                <div class="signal-item no-signals">
                    No active signals
                </div>
            `;
            return;
        }
        
        signalsList.innerHTML = '';
        
        signals.forEach(signal => {
            const signalEl = document.createElement('div');
            signalEl.className = `signal-item signal-clickable`;
            
            if (signal.type === 'multiple') {
                // Handle multiple crossings signal
                const bullishCount = signal.crossings.filter(c => c.type === 'bullish').length;
                const bearishCount = signal.crossings.filter(c => c.type === 'bearish').length;
                
                signalEl.innerHTML = `
                    <div class="signal-header">
                        <span class="signal-icon">📊</span>
                        <span class="signal-name">${signal.name}</span>
                    </div>
                    <div class="signal-details">
                        <div class="signal-ticker">${signal.ticker}</div>
                        <div class="signal-description">${signal.description}</div>
                        <div class="signal-data">
                            <span style="color: #888888">▲ ${bullishCount} Bullish</span> | 
                            <span style="color: #ff6347">▼ ${bearishCount} Bearish</span>
                        </div>
                        <div class="signal-hint">Click to highlight on chart</div>
                    </div>
                `;
                
                // Add click handler
                signalEl.addEventListener('click', () => {
                    // Check if already active - toggle off
                    const wasActive = signalEl.classList.contains('active');
                    
                    // Remove active class from all signals
                    document.querySelectorAll('.signal-item').forEach(item => {
                        item.classList.remove('active');
                    });
                    
                    if (wasActive) {
                        // Was active, now deactivate - clear markers
                        if (onSignalClick) {
                            onSignalClick([]);
                        }
                    } else {
                        // Activate this signal
                        signalEl.classList.add('active');
                        
                        // Call callback with crossing points
                        if (onSignalClick) {
                            onSignalClick(signal.crossings);
                        }
                    }
                });
            } else {
                // Handle individual signal (legacy format)
                const icon = signal.type === 'bullish' ? '▲' : '▼';
                const color = signal.type === 'bullish' ? '#888888' : '#ff6347';
                
                signalEl.innerHTML = `
                    <div class="signal-header">
                        <span class="signal-icon" style="color: ${color}">${icon}</span>
                        <span class="signal-name">${signal.name}</span>
                    </div>
                    <div class="signal-details">
                        <div class="signal-ticker">${signal.ticker}</div>
                        <div class="signal-description">${signal.description}</div>
                        <div class="signal-data">
                            Price: $${signal.price} | SMA: $${signal.sma}
                        </div>
                        ${signal.date ? `<div class="signal-date">${signal.date}</div>` : ''}
                    </div>
                `;
            }
            
            signalsList.appendChild(signalEl);
        });
    }
    
    /**
     * Clear all signals
     */
    function clearSignals() {
        signalsList.innerHTML = `
            <div class="signal-item no-signals">
                No active signals
            </div>
        `;
    }
    
    // Return public API
    return {
        analyzeSignals,
        clearSignals
    };
}
