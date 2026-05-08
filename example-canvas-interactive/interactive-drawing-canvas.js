// Sample data
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
const chartCanvas = document.getElementById('chartCanvas');
const drawCanvas = document.getElementById('drawCanvas');
const chartCtx = chartCanvas.getContext('2d');
const drawCtx = drawCanvas.getContext('2d');

const width = chartCanvas.width;
const height = chartCanvas.height;
const margin = { top: 20, right: 20, bottom: 60, left: 60 };
const chartWidth = width - margin.left - margin.right;
const chartHeight = height - margin.top - margin.bottom;

// Data ranges
const minDate = data[0].date;
const maxDate = data[data.length - 1].date;
const minValue = Math.min(...data.map(d => d.value)) - 5;
const maxValue = Math.max(...data.map(d => d.value)) + 5;

// Scale functions
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

function pixelToDate(x) {
    const position = (x - margin.left) / chartWidth;
    return new Date(minDate.getTime() + position * (maxDate - minDate));
}

function pixelToValue(y) {
    const position = (margin.top + chartHeight - y) / chartHeight;
    return minValue + position * (maxValue - minValue);
}

// Drawing state
let drawMode = 'select';
let isDrawing = false;
let drawStart = null;
const drawings = [];

// Draw the chart (static layer)
function renderChart() {
    chartCtx.clearRect(0, 0, width, height);
    
    // Grid
    chartCtx.strokeStyle = '#e0e0e0';
    chartCtx.lineWidth = 1;
    for (let i = 0; i <= 5; i++) {
        const y = margin.top + (chartHeight / 5) * i;
        chartCtx.beginPath();
        chartCtx.moveTo(margin.left, y);
        chartCtx.lineTo(margin.left + chartWidth, y);
        chartCtx.stroke();
    }

    // Axes
    chartCtx.strokeStyle = '#333';
    chartCtx.lineWidth = 2;
    chartCtx.beginPath();
    chartCtx.moveTo(margin.left, margin.top + chartHeight);
    chartCtx.lineTo(margin.left + chartWidth, margin.top + chartHeight);
    chartCtx.lineTo(margin.left, margin.top);
    chartCtx.stroke();

    // Labels
    chartCtx.fillStyle = '#666';
    chartCtx.font = '12px Arial';
    chartCtx.textAlign = 'center';
    data.forEach(d => {
        const x = xScale(d.date);
        const dateStr = d.date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
        chartCtx.save();
        chartCtx.translate(x, margin.top + chartHeight + 15);
        chartCtx.rotate(-Math.PI / 4);
        chartCtx.fillText(dateStr, 0, 0);
        chartCtx.restore();
    });

    chartCtx.textAlign = 'right';
    chartCtx.textBaseline = 'middle';
    for (let i = 0; i <= 5; i++) {
        const value = minValue + (maxValue - minValue) * (i / 5);
        const y = margin.top + chartHeight - (chartHeight / 5) * i;
        chartCtx.fillText(value.toFixed(1), margin.left - 10, y);
    }

    // Line chart
    chartCtx.strokeStyle = '#2196F3';
    chartCtx.lineWidth = 3;
    chartCtx.beginPath();
    data.forEach((d, i) => {
        const x = xScale(d.date);
        const y = yScale(d.value);
        if (i === 0) chartCtx.moveTo(x, y);
        else chartCtx.lineTo(x, y);
    });
    chartCtx.stroke();

    // Points
    chartCtx.fillStyle = '#2196F3';
    data.forEach(d => {
        const x = xScale(d.date);
        const y = yScale(d.value);
        chartCtx.beginPath();
        chartCtx.arc(x, y, 4, 0, Math.PI * 2);
        chartCtx.fill();
        chartCtx.strokeStyle = 'white';
        chartCtx.lineWidth = 2;
        chartCtx.stroke();
    });
}

// Draw user drawings (overlay layer)
function renderDrawings() {
    drawCtx.clearRect(0, 0, width, height);
    
    drawings.forEach(drawing => {
        drawCtx.strokeStyle = drawing.color;
        drawCtx.lineWidth = 2;
        drawCtx.setLineDash(drawing.dash || []);
        
        if (drawing.type === 'line') {
            drawCtx.beginPath();
            drawCtx.moveTo(drawing.x1, drawing.y1);
            drawCtx.lineTo(drawing.x2, drawing.y2);
            drawCtx.stroke();
        } else if (drawing.type === 'hline') {
            drawCtx.beginPath();
            drawCtx.moveTo(margin.left, drawing.y);
            drawCtx.lineTo(margin.left + chartWidth, drawing.y);
            drawCtx.stroke();
            
            // Label
            const value = pixelToValue(drawing.y);
            drawCtx.fillStyle = drawing.color;
            drawCtx.font = '12px Arial';
            drawCtx.fillText(value.toFixed(2), margin.left + chartWidth + 5, drawing.y + 4);
        }
        
        drawCtx.setLineDash([]);
    });

    // Preview while drawing
    if (isDrawing && drawStart) {
        drawCtx.strokeStyle = 'rgba(255, 0, 0, 0.5)';
        drawCtx.lineWidth = 2;
        drawCtx.setLineDash([5, 5]);
        
        if (drawMode === 'line') {
            drawCtx.beginPath();
            drawCtx.moveTo(drawStart.x, drawStart.y);
            drawCtx.lineTo(drawStart.currentX || drawStart.x, drawStart.currentY || drawStart.y);
            drawCtx.stroke();
        } else if (drawMode === 'hline') {
            drawCtx.beginPath();
            drawCtx.moveTo(margin.left, drawStart.y);
            drawCtx.lineTo(margin.left + chartWidth, drawStart.y);
            drawCtx.stroke();
        }
        
        drawCtx.setLineDash([]);
    }
}

// Mouse handlers
drawCanvas.addEventListener('mousedown', (e) => {
    if (drawMode === 'select') return;
    
    const rect = drawCanvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    if (x >= margin.left && x <= margin.left + chartWidth &&
        y >= margin.top && y <= margin.top + chartHeight) {
        isDrawing = true;
        drawStart = { x, y };
        drawCanvas.style.pointerEvents = 'auto';
    }
});

drawCanvas.addEventListener('mousemove', (e) => {
    if (!isDrawing || !drawStart) return;
    
    const rect = drawCanvas.getBoundingClientRect();
    drawStart.currentX = e.clientX - rect.left;
    drawStart.currentY = e.clientY - rect.top;
    renderDrawings();
});

drawCanvas.addEventListener('mouseup', (e) => {
    if (!isDrawing || !drawStart) return;
    
    const rect = drawCanvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    if (drawMode === 'line') {
        drawings.push({
            type: 'line',
            x1: drawStart.x,
            y1: drawStart.y,
            x2: x,
            y2: y,
            color: '#FF5722'
        });
    } else if (drawMode === 'hline') {
        drawings.push({
            type: 'hline',
            y: drawStart.y,
            color: '#9C27B0',
            dash: [5, 5]
        });
    }
    
    isDrawing = false;
    drawStart = null;
    drawCanvas.style.pointerEvents = 'none';
    renderDrawings();
    
    document.getElementById('info').textContent = `${drawings.length} drawing(s) on chart`;
});

// Button handlers
document.getElementById('selectBtn').addEventListener('click', () => {
    drawMode = 'select';
    updateButtons();
    document.getElementById('info').textContent = 'Select mode - hover to see values';
});

document.getElementById('lineBtn').addEventListener('click', () => {
    drawMode = 'line';
    updateButtons();
    document.getElementById('info').textContent = 'Draw mode - drag to create trendline';
});

document.getElementById('hlineBtn').addEventListener('click', () => {
    drawMode = 'hline';
    updateButtons();
    document.getElementById('info').textContent = 'Draw mode - click to create horizontal line';
});

document.getElementById('clearBtn').addEventListener('click', () => {
    drawings.length = 0;
    renderDrawings();
    document.getElementById('info').textContent = 'Drawings cleared';
});

function updateButtons() {
    document.querySelectorAll('button').forEach(btn => btn.classList.remove('active'));
    if (drawMode === 'select') document.getElementById('selectBtn').classList.add('active');
    else if (drawMode === 'line') document.getElementById('lineBtn').classList.add('active');
    else if (drawMode === 'hline') document.getElementById('hlineBtn').classList.add('active');
}

// Initial render
renderChart();
renderDrawings();
