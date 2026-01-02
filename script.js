const dial = document.getElementById("dial");
const degEl = document.getElementById("deg");
const dirEl = document.getElementById("dir");
const btn = document.getElementById("toggle");
const statusEl = document.getElementById("status");

let active = false;
let lastHeading = null;
const SMOOTHING = 0.15; // EMA factor

function normalize(angle) {
    return (angle + 360) % 360;
}

function smooth(current) {
    if (lastHeading === null) {
        lastHeading = current;
        return current;
    }
    const delta = ((current - lastHeading + 540) % 360) - 180;
    lastHeading = normalize(lastHeading + delta * SMOOTHING);
    return lastHeading;
}

function cardinal(angle) {
    const dirs = ["N", "NE", "E", "SE", "S", "SW", "W", "NW"];
    return dirs[Math.round(angle / 45) % 8];
}

function onOrientation(e) {
    let heading = null;

    if (typeof e.webkitCompassHeading === "number") {
        heading = e.webkitCompassHeading;
    } else if (e.absolute && typeof e.alpha === "number") {
        heading = 360 - e.alpha;
    } else {
        statusEl.textContent = "Orientation available but not absolute.";
        return;
    }

    heading = smooth(normalize(heading));
    dial.style.transform = `rotate(${-heading}deg)`;

    [...dial.querySelectorAll(".direction")].forEach(el => {
        el.style.transform += ` rotate(${heading}deg)`;
    });

    degEl.textContent = `${Math.round(heading)}°`;
    dirEl.textContent = cardinal(heading);
}

async function start() {
    if (typeof DeviceOrientationEvent?.requestPermission === "function") {
        const res = await DeviceOrientationEvent.requestPermission();
        if (res !== "granted") {
            statusEl.textContent = "Permission denied.";
            return;
        }
    }

    window.addEventListener("deviceorientation", onOrientation, true);
    active = true;
    btn.textContent = "Stop Compass";
    statusEl.textContent = "Sensor active. Keep device flat for best accuracy.";
}

function stop() {
    window.removeEventListener("deviceorientation", onOrientation, true);
    active = false;
    lastHeading = null;
    degEl.textContent = "--°";
    dirEl.textContent = "Inactive";
    btn.textContent = "Start Compass";
    statusEl.textContent = "Compass stopped.";
}

btn.onclick = () => active ? stop() : start();

// ticks
const ticks = document.getElementById("ticks");
for (let i = 0; i < 360; i += 30) {
    const t = document.createElement("div");
    t.style.position = "absolute";
    t.style.width = "3px";
    t.style.height = "12px";
    t.style.background = "#777";
    t.style.left = "50%";
    t.style.top = "0";
    t.style.transformOrigin = "0 120px";
    t.style.transform = `translateX(-50%) rotate(${i}deg)`;
    ticks.appendChild(t);
}