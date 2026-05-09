/**
 * Indicators Panel Module
 * Manages the display and selection of technical indicators
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
 * @param {Function} onIndicatorChange - Callback when indicator is toggled
 * @returns {Object} API object with methods to interact with indicators panel
 */
function initIndicatorsPanel(containerId, onIndicatorChange) {
    const container = document.getElementById(containerId);
    
    if (!container) {
        console.error(`Container with id "${containerId}" not found`);
        return null;
    }
    
    // Track active indicators
    const activeIndicators = new Map();
    
    // Create panel HTML
    let indicatorsHTML = '<div class="indicators-panel"><h3>Technical Indicators</h3><ul class="indicators-list">';
    
    AVAILABLE_INDICATORS.forEach(indicator => {
        const disabledClass = indicator.enabled ? '' : 'disabled';
        const disabledAttr = indicator.enabled ? '' : 'disabled';
        const badge = indicator.enabled ? '' : '<span class="indicator-badge coming-soon">Coming Soon</span>';
        
        indicatorsHTML += `
            <li class="indicator-item ${disabledClass}" data-indicator="${indicator.id}">
                <input type="checkbox" 
                       id="indicator-${indicator.id}" 
                       ${disabledAttr}
                       data-indicator-id="${indicator.id}">
                <label class="indicator-label" for="indicator-${indicator.id}">
                    ${indicator.name}
                </label>
                ${badge}
            </li>
        `;
    });
    
    indicatorsHTML += '</ul></div>';
    container.innerHTML = indicatorsHTML;
    
    // Add event listeners to checkboxes
    AVAILABLE_INDICATORS.forEach(indicator => {
        if (indicator.enabled) {
            const checkbox = document.getElementById(`indicator-${indicator.id}`);
            checkbox.addEventListener('change', (e) => {
                const isChecked = e.target.checked;
                
                if (isChecked) {
                    // Default parameters
                    const params = { period: indicator.config.defaultPeriod };
                    activeIndicators.set(indicator.id, {
                        config: indicator.config,
                        params: params
                    });
                } else {
                    activeIndicators.delete(indicator.id);
                }
                
                if (onIndicatorChange) {
                    onIndicatorChange(Array.from(activeIndicators.values()));
                }
            });
        }
    });
    
    /**
     * Get all active indicators
     * @returns {Array} Array of active indicator configs with params
     */
    function getActiveIndicators() {
        return Array.from(activeIndicators.values());
    }
    
    /**
     * Check if an indicator is active
     * @param {string} indicatorId - Indicator ID
     * @returns {boolean} True if active
     */
    function isActive(indicatorId) {
        return activeIndicators.has(indicatorId);
    }
    
    /**
     * Toggle an indicator programmatically
     * @param {string} indicatorId - Indicator ID
     * @param {boolean} active - Whether to activate or deactivate
     */
    function toggle(indicatorId, active) {
        const checkbox = document.getElementById(`indicator-${indicatorId}`);
        if (checkbox && !checkbox.disabled) {
            checkbox.checked = active;
            checkbox.dispatchEvent(new Event('change'));
        }
    }
    
    /**
     * Clear all active indicators
     */
    function clearAll() {
        activeIndicators.forEach((_, id) => {
            toggle(id, false);
        });
    }
    
    // Return public API
    return {
        getActiveIndicators,
        isActive,
        toggle,
        clearAll
    };
}
