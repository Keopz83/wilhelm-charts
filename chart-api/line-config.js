/**
 * LineConfig class to manage line chart styling and display options
 */
class LineConfig {
    /**
     * @param {Object} options - Styling options
     * @param {string} [options.lineColor='#0f8400'] - Color of the line
     * @param {number} [options.lineWidth=1] - Width of the line in pixels
     * @param {number} [options.dotRadius=3] - Radius of dots on vertices in pixels
     * @param {boolean} [options.showLabels=true] - Whether to show labels on first and last points
     * @param {string} [options.labelFont='12px Arial'] - Font for labels
     * @param {string} [options.labelPosition='top'] - Label position: 'top', 'bottom', 'left', 'right'
     */
    constructor(options = {}) {
        this.lineColor = options.lineColor ?? '#0f8400';
        this.lineWidth = options.lineWidth ?? 1;
        this.dotRadius = options.dotRadius ?? 3;
        this.showLabels = options.showLabels ?? true;
        this.labelFont = options.labelFont ?? '12px Arial';
        this.labelPosition = options.labelPosition ?? 'top';
    }
}
