/**
 * Simple Moving Average (SMA) Indicator
 * Calculates the average price over a specified period
 */

/**
 * Calculate Simple Moving Average
 * @param {Array} dataPoints - Array of {x, y, date} data points
 * @param {number} period - Number of periods for the average (default: 20)
 * @returns {Array} Array of {x, y, date} points for the SMA line
 */
function calculateSMA(dataPoints, period = 20) {
    const smaPoints = [];
    
    for (let i = period - 1; i < dataPoints.length; i++) {
        let sum = 0;
        for (let j = 0; j < period; j++) {
            sum += dataPoints[i - j].y;
        }
        const average = sum / period;
        
        smaPoints.push({
            x: dataPoints[i].x,
            y: average,
            date: dataPoints[i].date
        });
    }
    
    return smaPoints;
}

/**
 * SMA Indicator Configuration
 */
const SMA_CONFIG = {
    name: 'Simple Moving Average',
    shortName: 'SMA',
    defaultPeriod: 20,
    color: '#ffa500', // Orange
    lineWidth: 1,
    
    /**
     * Calculate indicator values
     * @param {Array} dataPoints - Price data
     * @param {Object} params - Indicator parameters {period: number}
     * @returns {Array} Indicator data points
     */
    calculate: function(dataPoints, params = {}) {
        const period = params.period || this.defaultPeriod;
        return calculateSMA(dataPoints, period);
    },
    
    /**
     * Get display name with parameters
     * @param {Object} params - Indicator parameters
     * @returns {string} Display name
     */
    getDisplayName: function(params = {}) {
        const period = params.period || this.defaultPeriod;
        return `${this.shortName}(${period})`;
    }
};
