let shiftInput, inputText, encodedMessageDiv, encodeButton, decodeButton, animationToggle;
let particles = []; // Reusing assets
let canvas;
let typingInterval; 

function setup() {
    canvas = createCanvas(windowWidth, windowHeight);
    canvas.position(0, 0);
    canvas.style('z-index', '-1'); 

    shiftInput = select('#shiftInput');
    inputText = select('#inputText');
    encodedMessageDiv = select('#encodedMessage');
    encodeButton = select('#encodeButton');
    decodeButton = select('#decodeButton');
    animationToggle = select('#animationToggle');
    fullscreenButton = select('#fullscreenButton');

    shiftInput.changed(updateShiftValue);
    encodeButton.mousePressed(encodeMessage);
    decodeButton.mousePressed(decodeMessage);
    fullscreenButton.mousePressed(toggleFullscreen);
}

function windowResized() {
    resizeCanvas(windowWidth, windowHeight);
}

function updateShiftValue() {
    const shiftValueDisplay = select('#shiftValue');
    shiftValueDisplay.html(shiftInput.value());
}

function encodeMessage() {
    const shift = int(shiftInput.value());
    const message = inputText.value();
    const encoded = caesarCipher(message, shift);
    if (animationToggle.checked()) {
        typeOutMessage(encoded, true); 
    } else {
        encodedMessageDiv.html(encoded); 
        encodedMessageDiv.style('display', 'block'); 
    }
}

function decodeMessage() {
    const shift = int(shiftInput.value());
    const message = inputText.value();
    const decoded = caesarCipher(message, -shift); 
    if (animationToggle.checked()) {
        typeOutMessage(decoded, false);
    } else {
        encodedMessageDiv.html(decoded); 
        encodedMessageDiv.style('display', 'block'); 
    }
}

function caesarCipher(message, shift) {
    let result = '';
    for (let i = 0; i < message.length; i++) {
        let char = message.charCodeAt(i);
        if (char >= 65 && char <= 90) {
            result += String.fromCharCode(((char - 65 + shift + 26) % 26) + 65);
        } else if (char >= 97 && char <= 122) {
            result += String.fromCharCode(((char - 97 + shift + 26) % 26) + 97);
        } else {
            result += message.charAt(i);
        }
    }
    return result;
}

function typeOutMessage(message, isEncoding) {
    encodedMessageDiv.html(''); 
    encodedMessageDiv.style('display', 'block'); 
    let index = 0;

    // Added this because spamming the encode button breaks the message and G G GG GENERA A A A ATE  ES MMM MMMESS SS AGES LIKE THIS
    clearInterval(typingInterval);

    typingInterval = setInterval(() => {
        if (index < message.length) { 
            if (message.charAt(index) === '\n') { // Line break
                encodedMessageDiv.html(encodedMessageDiv.html() + '<br>');
            } else {
                encodedMessageDiv.html(encodedMessageDiv.html() + message.charAt(index));
                spawnParticle(isEncoding); 
            }
            index++;
        } else {
            clearInterval(typingInterval); 
        }
    }, 100); 
}

function spawnParticle(isEncoding) {
    particles.push(new Particle(isEncoding));
}

function draw() {
    background(0, 80);
    for (let i = particles.length - 1; i >= 0; i--) {
        particles[i].update();
        particles[i].show();
        if (particles[i].isOffScreen()) {
            particles.splice(i, 1); // Kill
        }
    }
}

class Particle {
    constructor(isEncoding) {
        this.x = isEncoding ? 0 : width; 
        this.y = random(50, height - 50); 
        this.size = random(1, 10); 
        this.speed = random(2, 10); 
        this.direction = isEncoding ? 1 : -1; 
    }

    update() {
        this.x += this.speed * this.direction; 
    }

    show() {
        fill(0, 255, 0); 
        noStroke();
        rect(this.x, this.y, this.size, this.size); 
    }

    isOffScreen() {
        return (this.direction === 1) ? this.x > width : this.x < 0; 
    }
}

function toggleFullscreen() {
    if (!document.fullscreenElement) {
        document.documentElement.requestFullscreen();
    } else {
        document.exitFullscreen();
    }
}

// Prevent the website from breaking, everything loads after the website loads
window.onload = setup;