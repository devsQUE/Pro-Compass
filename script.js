const compassDial = document.getElementById('compassDial');
const degreeDisplay = document.getElementById('degreeDisplay');
const directionText = document.getElementById('directionText');
const startBtn = document.getElementById('startBtn');

// Helper to convert degrees to cardinal direction
function getCardinalDirection(angle) {
    const directions = ['N', 'NE', 'E', 'SE', 'S', 'SW', 'W', 'NW'];
    // Divide 360 into 8 chunks of 45 degrees. Offset by 22.5 to center the label.
    const index = Math.round(((angle %= 360) < 0 ? angle + 360 : angle) / 45) % 8;
    return directions[index];
}

function handleOrientation(event) {
    let compass = event.webkitCompassHeading || Math.abs(event.alpha - 360);
    
    // Smooth update for the visual dial
    // Invert rotation because the dial rotates, not the needle
    compassDial.style.transform = `rotate(${-compass}deg)`;

    // Update Text
    let roundedCompass = Math.round(compass);
    degreeDisplay.innerText = `${roundedCompass}°`;
    directionText.innerText = getCardinalDirection(roundedCompass);
}

// Function to start the compass (mainly for iOS 13+)
const startCompass = () => {
    // Check if DeviceOrientationEvent is defined
    if (window.DeviceOrientationEvent && typeof window.DeviceOrientationEvent.requestPermission === 'function') {
        // iOS 13+ specific permission request
        window.DeviceOrientationEvent.requestPermission()
            .then(response => {
                if (response === 'granted') {
                    window.addEventListener('deviceorientation', handleOrientation, true);
                    startBtn.style.display = 'none'; // Hide button after granting
                } else {
                    alert("Permission denied. The compass requires access to device orientation.");
                }
            })
            .catch(console.error);
    } else {
        // Non-iOS 13+ devices (Android, older iOS)
        window.addEventListener('deviceorientation', handleOrientation, true);
        startBtn.style.display = 'none';
    }
};

// Initial check to see if we need to show the button
if (window.DeviceOrientationEvent && typeof window.DeviceOrientationEvent.requestPermission === 'function') {
    startBtn.style.display = 'block';
    startBtn.addEventListener('click', startCompass);
} else {
    // Auto-start for devices that don't need permission
    startCompass();
}

// Optional: Add simple ticks dynamically for better visual
const ticksContainer = document.querySelector('.ticks');
for (let i = 0; i < 360; i += 15) { // Tick every 15 degrees
    const tick = document.createElement('div');
    tick.style.position = 'absolute';
    tick.style.width = i % 90 === 0 ? '4px' : '2px'; // Thicker ticks for N, E, S, W
    tick.style.height = i % 90 === 0 ? '15px' : '10px';
    tick.style.backgroundColor = '#555';
    tick.style.left = '50%';
    tick.style.top = '0';
    tick.style.transformOrigin = 'bottom center';
    // Calculate rotation and position. 
    // We set transform-origin to center of the dial (relative to the tick)
    // Actually simpler: Rotate the tick wrapper or set transform origin
    tick.style.transformOrigin = `0 120px`; // Half of dial height
    tick.style.transform = `translateX(-50%) rotate(${i}deg)`;
    
    ticksContainer.appendChild(tick);
}