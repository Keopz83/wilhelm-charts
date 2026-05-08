// Multiple time-series datasets
const datasets = [
    {
        name: 'Temperature',
        color: '#2196F3',
        data: [
            { date: new Date('2026-05-01'), value: 22 },
            { date: new Date('2026-05-02'), value: 23 },
            { date: new Date('2026-05-03'), value: 21 },
            { date: new Date('2026-05-04'), value: 24 },
            { date: new Date('2026-05-05'), value: 25 },
            { date: new Date('2026-05-06'), value: 26 },
            { date: new Date('2026-05-07'), value: 24 },
            { date: new Date('2026-05-08'), value: 25 }
        ]
    },
    {
        name: 'Humidity',
        color: '#F44336',
        data: [
            { date: new Date('2026-05-01'), value: 65 },
            { date: new Date('2026-05-02'), value: 68 },
            { date: new Date('2026-05-03'), value: 70 },
            { date: new Date('2026-05-04'), value: 62 },
            { date: new Date('2026-05-05'), value: 60 },
            { date: new Date('2026-05-06'), value: 58 },
            { date: new Date('2026-05-07'), value: 63 },
            { date: new Date('2026-05-08'), value: 61 }
        ]
    },
    {
        name: 'Pressure',
        color: '#4CAF50',
        data: [
            { date: new Date('2026-05-01'), value: 1013 },
            { date: new Date('2026-05-02'), value: 1015 },
            { date: new Date('2026-05-03'), value: 1012 },
            { date: new Date('2026-05-04'), value: 1018 },
            { date: new Date('2026-05-05'), value: 1020 },
            { date: new Date('2026-05-06'), value: 1017 },
            { date: new Date('2026-05-07'), value: 1014 },
            { date: new Date('2026-05-08'), value: 1016 }
        ]
    }
];

// Canvas setup
const canvas = document.getElementById('chart');
const ctx = canvas.getContext('2d');
const width = canvas.width;
const height = canvas.height;

// Chart margins
const margin = { top: 30, right: 30, bottom: 60, left: 70 };
const chartWidth = width - margin.left - margin.right;
const chartHeight = height - margin.top - margin.bottom;

// Find global date range (same for all datasets)
const allDates = datasets[0].data.map(d => d.date);
const minDate = allDates[0];
const maxDate = allDates[allDates.length - 1];

// Find value range for each dataset
const allValues = datasets.flatMap(ds => ds.data.map(d => d.value));
const minValue = Math.min(...allValues) * 0.95;
const maxValue = Math.max(...allValues) * 1.05;

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

// Draw grid
function drawGrid() {
    ctx.strokeStyle = '#e0e0e0';
    ctx.lineWidth = 1;

    // Horizontal grid lines
    for (let i = 0; i <= 6; i++) {
        const y = margin.top + (chartHeight / 6) * i;
        ctx.beginPath();
        ctx.moveTo(margin.left, y);
        ctx.lineTo(margin.left + chartWidth, y);
        ctx.stroke();
    }

    // Vertical grid lines
    allDates.forEach(date => {
        const x = xScale(date);
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

    // X-axis labels
    ctx.textAlign = 'center';
    allDates.forEach(date => {
        const x = xScale(date);
        const dateStr = date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
        ctx.save();
        ctx.translate(x, margin.top + chartHeight + 15);
        ctx.rotate(-Math.PI / 4);
        ctx.fillText(dateStr, 0, 0);
        ctx.restore();
    });

    // Y-axis labels
    ctx.textAlign = 'right';
    ctx.textBaseline = 'middle';
    for (let i = 0; i <= 6; i++) {
        const value = minValue + (maxValue - minValue) * (i / 6);
        const y = margin.top + chartHeight - (chartHeight / 6) * i;
        ctx.fillText(value.toFixed(0), margin.left - 10, y);
    }

    // Axis title
    ctx.fillStyle = '#333';
    ctx.font = 'bold 14px Arial';
    ctx.textAlign = 'center';
    ctx.fillText('Date', width / 2, height - 10);
}

// Draw a single line series
function drawLineSeries(dataset) {
    ctx.strokeStyle = dataset.color;
    ctx.lineWidth = 2.5;
    ctx.lineJoin = 'round';
    ctx.lineCap = 'round';

    // Draw line
    ctx.beginPath();
    dataset.data.forEach((d, i) => {
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
    ctx.fillStyle = dataset.color;
    dataset.data.forEach(d => {
        const x = xScale(d.date);
        const y = yScale(d.value);
        
        ctx.beginPath();
        ctx.arc(x, y, 4, 0, Math.PI * 2);
        ctx.fill();
        
        // White border
        ctx.strokeStyle = 'white';
        ctx.lineWidth = 2;
        ctx.stroke();
    });
}

// Main render function
function render() {
    ctx.clearRect(0, 0, width, height);
    
    drawGrid();
    drawAxes();
    drawLabels();
    
    // Draw all line series
    datasets.forEach(dataset => {
        drawLineSeries(dataset);
    });
}

// Mouse interaction
canvas.addEventListener('mousemove', (e) => {
    const rect = canvas.getBoundingClientRect();
    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;

    // Find all values at the closest x position
    let closestX = null;
    let closestDistance = Infinity;

    allDates.forEach(date => {
        const x = xScale(date);
        const distance = Math.abs(mouseX - x);
        
        if (distance < closestDistance && distance < 30) {
            closestDistance = distance;
            closestX = date;
        }
    });

    const info = document.getElementById('info');
    if (closestX) {
        const dateStr = closestX.toLocaleDateString('en-US', { 
            year: 'numeric', 
            month: 'short', 
            day: 'numeric' 
        });
        
        // Show all values at this date
        const values = datasets.map(ds => {
            const point = ds.data.find(d => d.date.getTime() === closestX.getTime());
            return `${ds.name}: ${point.value.toFixed(1)}`;
        }).join(' | ');
        
        info.innerHTML = `<strong>${dateStr}</strong> — ${values}`;
        info.style.color = '#333';
    } else {
        info.textContent = 'Hover over the chart to see values';
        info.style.color = '#666';
    }
});

// Initial render
render();
