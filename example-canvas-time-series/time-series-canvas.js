// Sample time-series data
const data = [
    { date: new Date('2026-05-01'), value: 100 },
    { date: new Date('2026-05-02'), value: 105 },
    { date: new Date('2026-05-03'), value: 102 },
    { date: new Date('2026-05-04'), value: 110 },
    { date: new Date('2026-05-05'), value: 108 },
    { date: new Date('2026-05-06'), value: 115 },
    { date: new Date('2026-05-07'), value: 112 },
    { date: new Date('2026-05-08'), value: 120 }
];

// Canvas setup
const canvas = document.getElementById('chart');
const ctx = canvas.getContext('2d');
const width = canvas.width;
const height = canvas.height;

// Chart margins
const margin = { top: 20, right: 20, bottom: 60, left: 60 };
const chartWidth = width - margin.left - margin.right;
const chartHeight = height - margin.top - margin.bottom;

// Find data ranges
const minDate = data[0].date;
const maxDate = data[data.length - 1].date;
const minValue = Math.min(...data.map(d => d.value)) - 5;
const maxValue = Math.max(...data.map(d => d.value)) + 5;

// Scale functions (map data to pixels)
function xScale(date) {
    const timeRange = maxDate - minDate;
    const position = (date - minDate) / timeRange;
    return margin.left + position * chartWidth;
}

function yScale(value) {
    const valueRange = maxValue - minValue;
    const position = (value - minValue) / valueRange;
    return margin.top + chartHeight - position * chartHeight;
}

// Draw grid
function drawGrid() {
    ctx.strokeStyle = '#e0e0e0';
    ctx.lineWidth = 1;

    // Horizontal grid lines (5 lines)
    for (let i = 0; i <= 5; i++) {
        const y = margin.top + (chartHeight / 5) * i;
        ctx.beginPath();
        ctx.moveTo(margin.left, y);
        ctx.lineTo(margin.left + chartWidth, y);
        ctx.stroke();
    }

    // Vertical grid lines (data points)
    data.forEach(d => {
        const x = xScale(d.date);
        ctx.beginPath();
        ctx.moveTo(x, margin.top);
        ctx.lineTo(x, margin.top + chartHeight);
        ctx.stroke();
    });
}

// Draw axes
function drawAxes() {
    ctx.strokeStyle = '#333';
    ctx.lineWidth = 2;

    // X-axis
    ctx.beginPath();
    ctx.moveTo(margin.left, margin.top + chartHeight);
    ctx.lineTo(margin.left + chartWidth, margin.top + chartHeight);
    ctx.stroke();

    // Y-axis
    ctx.beginPath();
    ctx.moveTo(margin.left, margin.top);
    ctx.lineTo(margin.left, margin.top + chartHeight);
    ctx.stroke();
}

// Draw labels
function drawLabels() {
    ctx.fillStyle = '#666';
    ctx.font = '12px Arial';
    ctx.textAlign = 'center';

    // X-axis labels (dates)
    data.forEach(d => {
        const x = xScale(d.date);
        const dateStr = d.date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
        ctx.save();
        ctx.translate(x, margin.top + chartHeight + 15);
        ctx.rotate(-Math.PI / 4);
        ctx.fillText(dateStr, 0, 0);
        ctx.restore();
    });

    // Y-axis labels
    ctx.textAlign = 'right';
    ctx.textBaseline = 'middle';
    for (let i = 0; i <= 5; i++) {
        const value = minValue + (maxValue - minValue) * (i / 5);
        const y = margin.top + chartHeight - (chartHeight / 5) * i;
        ctx.fillText(value.toFixed(1), margin.left - 10, y);
    }

    // Axis titles
    ctx.fillStyle = '#333';
    ctx.font = 'bold 14px Arial';
    ctx.textAlign = 'center';
    ctx.fillText('Date', width / 2, height - 10);

    ctx.save();
    ctx.translate(15, height / 2);
    ctx.rotate(-Math.PI / 2);
    ctx.fillText('Value', 0, 0);
    ctx.restore();
}

// Draw the line chart
function drawLine() {
    ctx.strokeStyle = '#2196F3';
    ctx.lineWidth = 3;
    ctx.lineJoin = 'round';
    ctx.lineCap = 'round';

    ctx.beginPath();
    data.forEach((d, i) => {
        const x = xScale(d.date);
        const y = yScale(d.value);
        
        if (i === 0) {
            ctx.moveTo(x, y);
        } else {
            ctx.lineTo(x, y);
        }
    });
    ctx.stroke();

    // Draw points
    ctx.fillStyle = '#2196F3';
    data.forEach(d => {
        const x = xScale(d.date);
        const y = yScale(d.value);
        
        ctx.beginPath();
        ctx.arc(x, y, 4, 0, Math.PI * 2);
        ctx.fill();
        
        // White border around points
        ctx.strokeStyle = 'white';
        ctx.lineWidth = 2;
        ctx.stroke();
    });
}

// Main render function
function render() {
    // Clear canvas
    ctx.clearRect(0, 0, width, height);
    
    // Draw all elements
    drawGrid();
    drawAxes();
    drawLabels();
    drawLine();
}

// Mouse interaction - show tooltip
canvas.addEventListener('mousemove', (e) => {
    const rect = canvas.getBoundingClientRect();
    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;

    // Find closest data point
    let closestPoint = null;
    let closestDistance = Infinity;

    data.forEach(d => {
        const x = xScale(d.date);
        const y = yScale(d.value);
        const distance = Math.sqrt(Math.pow(mouseX - x, 2) + Math.pow(mouseY - y, 2));
        
        if (distance < closestDistance && distance < 20) {
            closestDistance = distance;
            closestPoint = d;
        }
    });

    const info = document.getElementById('info');
    if (closestPoint) {
        const dateStr = closestPoint.date.toLocaleDateString('en-US', { 
            year: 'numeric', 
            month: 'short', 
            day: 'numeric' 
        });
        info.textContent = `${dateStr}: ${closestPoint.value.toFixed(2)}`;
        info.style.color = '#2196F3';
        info.style.fontWeight = 'bold';
    } else {
        info.textContent = 'Hover over the chart to see values';
        info.style.color = '#666';
        info.style.fontWeight = 'normal';
    }
});

// Initial render
render();
