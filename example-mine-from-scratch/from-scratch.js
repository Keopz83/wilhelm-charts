// Get the canvas and context
const canvas = document.getElementById('chart');
const ctx = canvas.getContext('2d');

// Data points
const points = [
    { x: 0, y: 500 },
    { x: 100, y: 450 },
    { x: 200, y: 300 },
    { x: 300, y: 200 },
    { x: 400, y: 250 },
    { x: 500, y: 300 },
    { x: 600, y: 200 },
    { x: 700, y: 350 },
    { x: 800, y: 250 },
    { x: 900, y: 150 }
];

// Line style
ctx.strokeStyle = '#0f8400';
ctx.lineWidth = 1;

// Draw line segments
ctx.beginPath();
ctx.moveTo(points[0].x, points[0].y);
for (let i = 1; i < points.length; i++) {
    ctx.lineTo(points[i].x, points[i].y);
}
ctx.stroke();

// Draw dots on vertices
ctx.fillStyle = '#0f8400';
points.forEach(point => {
    ctx.beginPath();
    ctx.arc(point.x, point.y, 3, 0, Math.PI * 2);
    ctx.fill();
});
