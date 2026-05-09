/**
 * Indicators Panel Module
 * Manages the display and selection of technical indicators with modal configuration
 */

/**
 * List of available indicators
 */
const AVAILABLE_INDICATORS = [
    { id: 'sma', name: 'Simple Moving Average', shortName: 'SMA', enabled: true, config: SMA_CONFIG },
    { id: 'ema', name: 'Exponential Moving Average', shortName: 'EMA', enabled: false },
    { id: 'rsi', name: 'Relative Strength Index', shortName: 'RSI', enabled: false },
    { id: 'macd', name: 'MACD', shortName: 'MACD', enabled: false },
    { id: 'bollinger', name: 'Bollinger Bands', shortName: 'BB', enabled: false },
    { id: 'volume', name: 'Volume', shortName: 'VOL', enabled: false },
    { id: 'stochastic', name: 'Stochastic Oscillator', shortName: 'STOCH', enabled: false }
];

/**
 * Initialize indicators panel
 * @param {string} containerId - ID of the container element
 * @param {Function} onIndicatorChange - Callback when indicators change
 * @returns {Object} API object with methods to interact with indicators panel
 */
function initIndicatorsPanel(containerId, onIndicatorChange) {
    const container = document.getElementById(containerId);
    
    if (!container) {
        console.error(`Container with id "${containerId}" not found`);
        return null;
    }
    
    // Track active indicator instances
    const activeIndicators = [];
    let indicatorIdCounter = 0;
    
    const STORAGE_KEY = 'wilhelm_charts_indicators';
    
    /**
     * Load indicators from localStorage
     */
    function loadFromStorage() {
        try {
            const stored = localStorage.getItem(STORAGE_KEY);
            if (stored) {
                const data = JSON.parse(stored);
                activeIndicators.length = 0;
                
                // Restore indicators with proper config objects
                data.indicators.forEach(ind => {
                    // Restore the config object based on indicator type
                    let config = null;
                    if (ind.type === 'sma') {
                        config = { ...SMA_CONFIG, color: ind.color };
                    }
                    
                    if (config) {
                        activeIndicators.push({
                            id: ind.id,
                            type: ind.type,
                            config: config,
                            params: ind.params,
                            color: ind.color
                        });
                    }
                });
                
                indicatorIdCounter = data.nextId || activeIndicators.length;
                renderActiveIndicators();
                notifyChange();
            }
        } catch (error) {
            console.error('Error loading indicators from storage:', error);
        }
    }
    
    /**
     * Save indicators to localStorage
     */
    function saveToStorage() {
        try {
            // Save only serializable data (exclude config functions)
            const serializableIndicators = activeIndicators.map(ind => ({
                id: ind.id,
                type: ind.type,
                params: ind.params,
                color: ind.color
            }));
            
            const data = {
                indicators: serializableIndicators,
                nextId: indicatorIdCounter
            };
            localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
        } catch (error) {
            console.error('Error saving indicators to storage:', error);
        }
    }
    
    // Create panel HTML
    container.innerHTML = `
        <div class="indicators-panel">
            <div class="indicators-panel-header">
                <h3>Indicators</h3>
                <button class="add-indicator-btn" id="addIndicatorBtn" title="Add Indicator">+</button>
            </div>
            <ul class="active-indicators-list" id="activeIndicatorsList">
                <!-- Active indicators will appear here -->
            </ul>
        </div>
        
        <!-- Modal -->
        <div class="indicator-modal" id="indicatorModal">
            <div class="modal-content">
                <div class="modal-header">
                    <h3>Add Indicator</h3>
                    <button class="modal-close" id="modalClose">&times;</button>
                </div>
                
                <!-- Indicator Selection -->
                <div id="indicatorSelection">
                    <ul class="indicator-selection-list">
                        ${AVAILABLE_INDICATORS.map(ind => `
                            <li class="indicator-option ${ind.enabled ? '' : 'disabled'}" 
                                data-indicator-id="${ind.id}"
                                ${ind.enabled ? `onclick="selectIndicator('${ind.id}')"` : ''}>
                                <span class="indicator-option-name">${ind.name}</span>
                                ${ind.enabled ? '' : '<span class="indicator-badge">Coming Soon</span>'}
                            </li>
                        `).join('')}
                    </ul>
                </div>
                
                <!-- SMA Configuration Form -->
                <div class="indicator-config-form" id="smaConfigForm">
                    <h4 style="margin: 0 0 15px 0; color: #888888;">Configure Simple Moving Average</h4>
                    <div class="form-group">
                        <label for="smaPeriod">Period:</label>
                        <input type="number" id="smaPeriod" value="20" min="2" max="200">
                    </div>
                    <div class="form-group">
                        <label for="smaColor">Color:</label>
                        <input type="color" id="smaColor" value="#ffa500">
                    </div>
                    <div class="form-actions">
                        <button class="btn btn-secondary" onclick="cancelIndicatorConfig()">Cancel</button>
                        <button class="btn btn-primary" onclick="addSMAIndicator()">Add Indicator</button>
                    </div>
                </div>
            </div>
        </div>
    `;
    
    // Get DOM elements
    const modal = document.getElementById('indicatorModal');
    const addBtn = document.getElementById('addIndicatorBtn');
    const closeBtn = document.getElementById('modalClose');
    const indicatorSelection = document.getElementById('indicatorSelection');
    const smaConfigForm = document.getElementById('smaConfigForm');
    const activeList = document.getElementById('activeIndicatorsList');
    
    // Open modal
    addBtn.addEventListener('click', () => {
        modal.classList.add('show');
        showIndicatorSelection();
    });
    
    // Close modal
    closeBtn.addEventListener('click', () => {
        modal.classList.remove('show');
    });
    
    // Close on outside click
    modal.addEventListener('click', (e) => {
        if (e.target === modal) {
            modal.classList.remove('show');
        }
    });
    
    /**
     * Show indicator selection screen
     */
    function showIndicatorSelection() {
        indicatorSelection.style.display = 'block';
        smaConfigForm.classList.remove('show');
    }
    
    /**
     * Show SMA configuration form
     */
    window.selectIndicator = function(indicatorId) {
        if (indicatorId === 'sma') {
            indicatorSelection.style.display = 'none';
            smaConfigForm.classList.add('show');
            
            // Reset form to defaults
            document.getElementById('smaPeriod').value = 20;
            document.getElementById('smaColor').value = '#ffa500';
        }
    };
    
    /**
     * Cancel configuration and return to selection
     */
    window.cancelIndicatorConfig = function() {
        showIndicatorSelection();
    };
    
    /**
     * Add SMA indicator with user configuration
     */
    window.addSMAIndicator = function() {
        const period = parseInt(document.getElementById('smaPeriod').value);
        const color = document.getElementById('smaColor').value;
        
        if (period < 2 || period > 200) {
            alert('Period must be between 2 and 200');
            return;
        }
        
        const indicatorInstance = {
            id: indicatorIdCounter++,
            type: 'sma',
            config: SMA_CONFIG,
            params: { period },
            color: color
        };
        
        // Override color in config
        const customConfig = { ...SMA_CONFIG, color: color };
        indicatorInstance.config = customConfig;
        
        activeIndicators.push(indicatorInstance);
        renderActiveIndicators();
        saveToStorage();
        notifyChange();
        
        // Close modal
        modal.classList.remove('show');
    };
    
    /**
     * Remove an indicator instance
     */
    window.removeIndicator = function(instanceId) {
        const index = activeIndicators.findIndex(ind => ind.id === instanceId);
        if (index !== -1) {
            activeIndicators.splice(index, 1);
            renderActiveIndicators();
            saveToStorage();
            notifyChange();
        }
    };
    
    /**
     * Render the list of active indicators
     */
    function renderActiveIndicators() {
        if (activeIndicators.length === 0) {
            activeList.innerHTML = '';
            return;
        }
        
        activeList.innerHTML = activeIndicators.map(ind => {
            const displayName = ind.config.getDisplayName(ind.params);
            const paramsStr = `Period: ${ind.params.period}`;
            
            return `
                <li class="active-indicator-item">
                    <div class="indicator-color-box" style="background: ${ind.color}"></div>
                    <div class="indicator-info">
                        <div class="indicator-name">${displayName}</div>
                        <div class="indicator-params">${paramsStr}</div>
                    </div>
                    <button class="remove-indicator-btn" onclick="removeIndicator(${ind.id})" title="Remove">×</button>
                </li>
            `;
        }).join('');
    }
    
    /**
     * Notify parent of indicator changes
     */
    function notifyChange() {
        if (onIndicatorChange) {
            onIndicatorChange(activeIndicators);
        }
    }
    
    /**
     * Get all active indicators
     * @returns {Array} Array of active indicator instances
     */
    function getActiveIndicators() {
        return activeIndicators;
    }
    
    /**
     * Clear all active indicators
     */
    function clearAll() {
        activeIndicators.length = 0;
        renderActiveIndicators();
        saveToStorage();
        notifyChange();
    }
    
    // Load saved indicators from localStorage
    loadFromStorage();
    
    // Return public API
    return {
        getActiveIndicators,
        clearAll
    };
}
