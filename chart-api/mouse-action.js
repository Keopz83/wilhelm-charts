/**
 * Handle mouse interactions with the chart
 * Displays tooltip with data values on mouse hover
 */

/**
 * Initialize mouse tracking on the chart
 * @param {HTMLCanvasElement} canvas - The canvas element
 * @param {CanvasRenderingContext2D} ctx - The canvas rendering context
 * @param {ChartConfig} config - ChartConfig instance with all chart settings
 * @param {Array} dataPoints - Array of data points with x, y, and date properties
 * @param {Function} redrawChart - Function to redraw the chart
 */
function initMouseTracking(canvas, ctx, config, dataPoints, redrawChart) {
    let isHovering = false;
    let hoveredPoint = null;

    // Create tooltip element if it doesn't exist
    let tooltip = document.getElementById('chart-tooltip');
    if (!tooltip) {
        tooltip = document.createElement('div');
        tooltip.id = 'chart-tooltip';
        tooltip.style.position = 'absolute';
        tooltip.style.background = 'rgba(0, 0, 0, 0.8)';
        tooltip.style.color = '#fff';
        tooltip.style.padding = '8px 12px';
        tooltip.style.borderRadius = '4px';
        tooltip.style.fontSize = '12px';
        tooltip.style.pointerEvents = 'none';
        tooltip.style.display = 'none';
        tooltip.style.zIndex = '1000';
        tooltip.style.fontFamily = 'Arial, sans-serif';
        document.body.appendChild(tooltip);
    }

    canvas.addEventListener('mousemove', (event) => {
        const rect = canvas.getBoundingClientRect();
        const mouseX = event.clientX - rect.left;
        const mouseY = event.clientY - rect.top;

        // Check if mouse is within chart area
        if (mouseX < config.marginLeft || 
            mouseX > config.marginLeft + config.chartWidth ||
            mouseY < config.marginTop || 
            mouseY > config.marginTop + config.chartHeight) {
            
            canvas.style.cursor = 'default';
            if (isHovering) {
                isHovering = false;
                hoveredPoint = null;
                tooltip.style.display = 'none';
                redrawChart();
            }
            return;
        }

        // Change cursor to crosshair when over chart area
        canvas.style.cursor = 'crosshair';

        // Find nearest data point
        let nearestPoint = null;
        let minDistance = Infinity;

        dataPoints.forEach(point => {
            const pointX = config.xScale(point.x);
            const pointY = config.yScale(point.y);
            const distance = Math.sqrt(
                Math.pow(mouseX - pointX, 2) + 
                Math.pow(mouseY - pointY, 2)
            );

            if (distance < minDistance && distance < 20) { // 20px threshold
                minDistance = distance;
                nearestPoint = point;
            }
        });

        if (nearestPoint) {
            isHovering = true;
            hoveredPoint = nearestPoint;

            // Update tooltip
            const date = new Date(nearestPoint.date);
            const formattedDate = `${date.getMonth() + 1}/${date.getDate()}/${date.getFullYear()}`;
            tooltip.innerHTML = `
                <div><strong>Date:</strong> ${formattedDate}</div>
                <div><strong>Price:</strong> $${nearestPoint.y.toFixed(2)}</div>
            `;
            tooltip.style.display = 'block';
            tooltip.style.left = `${event.clientX + 15}px`;
            tooltip.style.top = `${event.clientY - 40}px`;

            // Redraw with highlight
            redrawChart();
            highlightPoint(ctx, config, nearestPoint);
        } else {
            if (isHovering) {
                isHovering = false;
                hoveredPoint = null;
                tooltip.style.display = 'none';
                redrawChart();
            }
        }
    });

    canvas.addEventListener('mouseleave', () => {
        canvas.style.cursor = 'default';
        if (isHovering) {
            isHovering = false;
            hoveredPoint = null;
            tooltip.style.display = 'none';
            redrawChart();
        }
    });
}

/**
 * Highlight a specific point on the chart
 * @param {CanvasRenderingContext2D} ctx - The canvas rendering context
 * @param {ChartConfig} config - ChartConfig instance
 * @param {Object} point - Data point to highlight
 */
function highlightPoint(ctx, config, point) {
    const x = config.xScale(point.x);
    const y = config.yScale(point.y);

    // Draw crosshair lines
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.3)';
    ctx.lineWidth = 1;
    ctx.setLineDash([5, 5]);

    // Vertical line
    ctx.beginPath();
    ctx.moveTo(x, config.marginTop);
    ctx.lineTo(x, config.marginTop + config.chartHeight);
    ctx.stroke();

    // Horizontal line
    ctx.beginPath();
    ctx.moveTo(config.marginLeft, y);
    ctx.lineTo(config.marginLeft + config.chartWidth, y);
    ctx.stroke();

    ctx.setLineDash([]);

    // Draw larger highlight circle
    ctx.fillStyle = '#fff';
    ctx.beginPath();
    ctx.arc(x, y, 6, 0, Math.PI * 2);
    ctx.fill();

    // Draw inner colored circle
    ctx.fillStyle = '#1eb100';
    ctx.beginPath();
    ctx.arc(x, y, 4, 0, Math.PI * 2);
    ctx.fill();
}
