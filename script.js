const compassDial = document.getElementById('compassDial');
const degreeDisplay = document.getElementById('degreeDisplay');
const directionText = document.getElementById('directionText');
const startBtn = document.getElementById('startBtn');
const statusText = document.getElementById('status');

function getCardinalDirection(angle) {
    const directions = ['N', 'NE', 'E', 'SE', 'S', 'SW', 'W', 'NW'];
    const index = Math.round(((angle %= 360) < 0 ? angle + 360 : angle) / 45) % 8;
    return directions[index];
}

function handleOrientation(event) {
    let heading = 0;

    // iOS Device
    if (event.webkitCompassHeading) {
        heading = event.webkitCompassHeading;
    } 
    // Android Device (Absolute Orientation)
    else if (event.alpha !== null) {
        // alpha is usually 0 at North, increasing counter-clockwise
        // But implementation varies. Standard is: 360 - alpha
        heading = 360 - event.alpha;
    }

    // Update UI
    compassDial.style.transform = `rotate(${-heading}deg)`;
    
    // Update Text
    let roundedHeading = Math.round(heading);
    degreeDisplay.innerText = `${roundedHeading}°`;
    directionText.innerText = getCardinalDirection(roundedHeading);
    statusText.innerText = "Active";
}

const startCompass = () => {
    // 1. iOS 13+ Permission Handler
    if (typeof DeviceOrientationEvent !== 'undefined' && typeof DeviceOrientationEvent.requestPermission === 'function') {
        DeviceOrientationEvent.requestPermission()
            .then(response => {
                if (response === 'granted') {
                    window.addEventListener('deviceorientation', handleOrientation, true);
                    startBtn.style.display = 'none';
                    statusText.innerText = "Sensor Active (iOS)";
                } else {
                    alert("Permission denied. Compass needs sensor access.");
                }
            })
            .catch(console.error);
    } 
    // 2. Android (Absolute Orientation) and Older Devices
    else {
        // Check if the browser supports absolute orientation (True North)
        if ('ondeviceorientationabsolute' in window) {
            window.addEventListener('deviceorientationabsolute', handleOrientation, true);
            statusText.innerText = "Sensor Active (Android Absolute)";
        } else if ('ondeviceorientation' in window) {
            window.addEventListener('deviceorientation', handleOrientation, true);
            statusText.innerText = "Sensor Active (Standard)";
        } else {
            statusText.innerText = "Error: Sensors not supported on this device.";
        }
        startBtn.style.display = 'none';
    }
};

// Button Listener
startBtn.addEventListener('click', startCompass);

// Generate Ticks (Visuals)
const ticksContainer = document.querySelector('.ticks');
for (let i = 0; i < 360; i += 15) {
    const tick = document.createElement('div');
    tick.style.position = 'absolute';
    tick.style.width = i % 90 === 0 ? '4px' : '2px';
    tick.style.height = i % 90 === 0 ? '15px' : '10px';
    tick.style.backgroundColor = '#777';
    tick.style.left = '50%';
    tick.style.top = '0';
    tick.style.transformOrigin = '0 120px'; // Adjust based on your dial size
    tick.style.transform = `translateX(-50%) rotate(${i}deg)`;
    ticksContainer.appendChild(tick);
}