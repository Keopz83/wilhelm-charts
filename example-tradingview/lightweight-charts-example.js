// Generate sample OHLC data for a stock
function generateOHLCData() {
    const data = [];
    const volumeData = [];
    let basePrice = 100;
    let baseDate = new Date('2026-01-01');
    
    for (let i = 0; i < 100; i++) {
        const date = new Date(baseDate);
        date.setDate(date.getDate() + i);
        
        // Skip weekends
        if (date.getDay() === 0 || date.getDay() === 6) {
            continue;
        }
        
        // Random price movement
        const change = (Math.random() - 0.5) * 4;
        basePrice += change;
        
        const open = basePrice;
        const high = basePrice + Math.random() * 3;
        const low = basePrice - Math.random() * 3;
        const close = low + Math.random() * (high - low);
        
        data.push({
            time: date.toISOString().split('T')[0],
            open: parseFloat(open.toFixed(2)),
            high: parseFloat(high.toFixed(2)),
            low: parseFloat(low.toFixed(2)),
            close: parseFloat(close.toFixed(2))
        });
        
        // Generate volume
        const baseVolume = 1000000;
        const volume = baseVolume + Math.random() * 2000000;
        volumeData.push({
            time: date.toISOString().split('T')[0],
            value: Math.floor(volume),
            color: close >= open ? 'rgba(38, 166, 154, 0.5)' : 'rgba(239, 83, 80, 0.5)'
        });
        
        basePrice = close;
    }
    
    return { data, volumeData };
}

// Calculate Simple Moving Average
function calculateSMA(data, period) {
    const smaData = [];
    
    for (let i = period - 1; i < data.length; i++) {
        const slice = data.slice(i - period + 1, i + 1);
        const sum = slice.reduce((acc, item) => acc + item.close, 0);
        const average = sum / period;
        
        smaData.push({
            time: data[i].time,
            value: parseFloat(average.toFixed(2))
        });
    }
    
    return smaData;
}

// Create the chart
const chartContainer = document.getElementById('chart');
const chart = LightweightCharts.createChart(chartContainer, {
    width: chartContainer.clientWidth,
    height: 500,
    layout: {
        background: { color: '#1e1e1e' },
        textColor: '#d1d4dc',
    },
    grid: {
        vertLines: { color: '#2a2a2a' },
        horzLines: { color: '#2a2a2a' },
    },
    crosshair: {
        mode: LightweightCharts.CrosshairMode.Normal,
    },
    rightPriceScale: {
        borderColor: '#3a3a3a',
    },
    timeScale: {
        borderColor: '#3a3a3a',
        timeVisible: true,
        secondsVisible: false,
    },
});

// Generate data
const { data: ohlcData, volumeData } = generateOHLCData();
const smaData = calculateSMA(ohlcData, 20);

// Add candlestick series
const candlestickSeries = chart.addCandlestickSeries({
    upColor: '#26a69a',
    downColor: '#ef5350',
    borderVisible: false,
    wickUpColor: '#26a69a',
    wickDownColor: '#ef5350',
});
candlestickSeries.setData(ohlcData);

// Store series references
let currentMainSeries = candlestickSeries;
let currentSeriesType = 'candlestick';

// Add volume series
let volumeSeries = chart.addHistogramSeries({
    color: '#26a69a',
    priceFormat: {
        type: 'volume',
    },
    priceScaleId: '',
    scaleMargins: {
        top: 0.8,
        bottom: 0,
    },
});
volumeSeries.setData(volumeData);

// Add SMA series
let smaSeries = chart.addLineSeries({
    color: '#2962ff',
    lineWidth: 2,
    title: 'SMA 20',
});
smaSeries.setData(smaData);

// Track series visibility
let showMA = true;
let showVolume = true;

// Update stats on crosshair move
chart.subscribeCrosshairMove((param) => {
    if (param.time) {
        const data = param.seriesData.get(currentMainSeries);
        if (data) {
            if (currentSeriesType === 'candlestick') {
                document.getElementById('open').textContent = data.open.toFixed(2);
                document.getElementById('high').textContent = data.high.toFixed(2);
                document.getElementById('low').textContent = data.low.toFixed(2);
                document.getElementById('close').textContent = data.close.toFixed(2);
                
                // Color close based on change
                const closeEl = document.getElementById('close');
                if (data.close >= data.open) {
                    closeEl.classList.add('positive');
                    closeEl.classList.remove('negative');
                } else {
                    closeEl.classList.add('negative');
                    closeEl.classList.remove('positive');
                }
            } else {
                // For line/area charts
                document.getElementById('open').textContent = '--';
                document.getElementById('high').textContent = '--';
                document.getElementById('low').textContent = '--';
                document.getElementById('close').textContent = data.value ? data.value.toFixed(2) : '--';
            }
            
            const volumeData = param.seriesData.get(volumeSeries);
            if (volumeData) {
                document.getElementById('volume').textContent = 
                    (volumeData.value / 1000000).toFixed(2) + 'M';
            }
        }
    }
});

// Chart type controls
document.getElementById('candlestickBtn').addEventListener('click', () => {
    if (currentSeriesType !== 'candlestick') {
        chart.removeSeries(currentMainSeries);
        
        const newSeries = chart.addCandlestickSeries({
            upColor: '#26a69a',
            downColor: '#ef5350',
            borderVisible: false,
            wickUpColor: '#26a69a',
            wickDownColor: '#ef5350',
        });
        newSeries.setData(ohlcData);
        
        currentMainSeries = newSeries;
        currentSeriesType = 'candlestick';
        
        updateActiveButton('candlestickBtn');
    }
});

document.getElementById('lineBtn').addEventListener('click', () => {
    if (currentSeriesType !== 'line') {
        chart.removeSeries(currentMainSeries);
        
        const lineData = ohlcData.map(d => ({
            time: d.time,
            value: d.close
        }));
        
        const newSeries = chart.addLineSeries({
            color: '#2962ff',
            lineWidth: 2,
        });
        newSeries.setData(lineData);
        
        currentMainSeries = newSeries;
        currentSeriesType = 'line';
        
        updateActiveButton('lineBtn');
    }
});

document.getElementById('areaBtn').addEventListener('click', () => {
    if (currentSeriesType !== 'area') {
        chart.removeSeries(currentMainSeries);
        
        const areaData = ohlcData.map(d => ({
            time: d.time,
            value: d.close
        }));
        
        const newSeries = chart.addAreaSeries({
            topColor: 'rgba(41, 98, 255, 0.4)',
            bottomColor: 'rgba(41, 98, 255, 0.0)',
            lineColor: '#2962ff',
            lineWidth: 2,
        });
        newSeries.setData(areaData);
        
        currentMainSeries = newSeries;
        currentSeriesType = 'area';
        
        updateActiveButton('areaBtn');
    }
});

// Toggle MA
document.getElementById('toggleMA').addEventListener('click', () => {
    if (showMA) {
        chart.removeSeries(smaSeries);
        showMA = false;
        document.getElementById('toggleMA').textContent = 'Show SMA(20)';
    } else {
        const newSMA = chart.addLineSeries({
            color: '#2962ff',
            lineWidth: 2,
            title: 'SMA 20',
        });
        newSMA.setData(smaData);
        smaSeries = newSMA;
        showMA = true;
        document.getElementById('toggleMA').textContent = 'Hide SMA(20)';
    }
});

// Toggle Volume
document.getElementById('toggleVolume').addEventListener('click', () => {
    if (showVolume) {
        chart.removeSeries(volumeSeries);
        showVolume = false;
        document.getElementById('toggleVolume').textContent = 'Show Volume';
    } else {
        const newVolume = chart.addHistogramSeries({
            color: '#26a69a',
            priceFormat: {
                type: 'volume',
            },
            priceScaleId: '',
            scaleMargins: {
                top: 0.8,
                bottom: 0,
            },
        });
        newVolume.setData(volumeData);
        volumeSeries = newVolume;
        showVolume = true;
        document.getElementById('toggleVolume').textContent = 'Hide Volume';
    }
});

function updateActiveButton(activeId) {
    document.querySelectorAll('.control-group button').forEach(btn => {
        btn.classList.remove('active');
    });
    document.getElementById(activeId).classList.add('active');
}

// Handle window resize
window.addEventListener('resize', () => {
    chart.applyOptions({
        width: chartContainer.clientWidth,
    });
});

// Fit content on load
chart.timeScale().fitContent();
