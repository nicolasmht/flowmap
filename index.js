let canvas = document.querySelector('.canvas');
    ctx = canvas.getContext('2d');

    ctx.fillStyle = "black";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    
let width = canvas.width = window.innerWidth,
    height = canvas.height = window.innerHeight;

let size = 64, maxAge = 128, RADIUS = 1.25, trail = [];

let delta = 0, time = Date.now(), timePassed = 0;;

function update() {

    delta = Date.now() - time;
    timePassed += delta;

    // Clear
    ctx.fillStyle = "black";
    ctx.fillRect(0, 0, canvas.width, canvas.height);


   // age points
    trail.forEach((point, i) => {
        point.age++;

        // remove old
        if (point.age > maxAge) {
            trail.splice(i, 1);
        }
    });

    trail.forEach((point, i) => {
        drawTouch(point);
    });

    //texture.needsUpdate = true;

    requestAnimationFrame(update);
}

update();

function addTouch(point) {
    let force = 0;
    const last = trail[trail.length - 1];

    if (last) {
        const dx = last.x - point.x;
        const dy = last.y - point.y;
        const dd = dx * dx + dy * dy;
        force = Math.min(dd * 10000, 1);
    }

    trail.push({ x: point.x, y: point.y, age: 0, force });
}

function drawTouch(point) {
    const pos = {
        x: point.x * size,
        y: (1 - point.y) * size
    };

    let intensity = 1;
    
    if (point.age < maxAge * 0.3) {
        intensity = easeOutSine(point.age / (maxAge * 0.3), 0, 1, 1);
    } else {
        intensity = easeOutSine(1 - (point.age - maxAge * 0.3) / (maxAge * 0.7), 0, 1, 1 );
    }

    intensity *= point.force;

    let radius = size * RADIUS * intensity;

    const grd = ctx.createRadialGradient(
        point.x,
        point.y,
        radius * 0.25,
        point.x,
        point.y,
        radius
    );

    grd.addColorStop(0, `rgba(255, 255, 255, 0.2)`);
    grd.addColorStop(1, "rgba(0, 0, 0, 0.0)");

    ctx.beginPath();
    ctx.fillStyle = grd;
    ctx.arc(point.x, point.y, radius, 0, Math.PI * 2);
    ctx.fill();
}

window.addEventListener('mousemove', (event) => {
    addTouch({x: event.clientX, y: event.clientY});
});

const easeOutSine = (t, b, c, d) => {
    return c * Math.sin(t/d * (Math.PI/2)) + b;
};