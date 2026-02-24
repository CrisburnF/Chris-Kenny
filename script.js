// --- 1. Curtain Logic ---
function openCurtains() {
    document.querySelector('.left-curtain').style.transform = 'translateX(-100%)';
    document.querySelector('.right-curtain').style.transform = 'translateX(100%)';
    document.querySelector('.curtain-text').style.opacity = '0';
    
    // Remove curtain from DOM after animation so it doesn't block clicks
    setTimeout(() => {
        document.getElementById('curtain-container').style.display = 'none';
    }, 1500);
}

// --- 2. Scratch-off Logic ---
const canvas = document.getElementById('scratch-canvas');
const ctx = canvas.getContext('2d');
let isDrawing = false;
let revealed = false;

canvas.width = 280;
canvas.height = 80;

// Fill the canvas with a gold color
ctx.fillStyle = '#d4af37'; 
ctx.fillRect(0, 0, canvas.width, canvas.height);

// Add some text to the scratch layer
ctx.fillStyle = '#ffffff';
ctx.font = '20px Playfair Display';
ctx.textAlign = 'center';
ctx.fillText('Scratch Here', canvas.width / 2, canvas.height / 2 + 7);

function scratch(e) {
    if (!isDrawing) return;
    
    // Makes the drawn line transparent, revealing the HTML below
    ctx.globalCompositeOperation = 'destination-out';
    ctx.lineWidth = 30;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';

    const rect = canvas.getBoundingClientRect();
    const x = (e.clientX || e.touches[0].clientX) - rect.left;
    const y = (e.clientY || e.touches[0].clientY) - rect.top;

    ctx.lineTo(x, y);
    ctx.stroke();

    checkReveal();
}

canvas.addEventListener('mousedown', (e) => { isDrawing = true; scratch(e); ctx.beginPath(); });
canvas.addEventListener('mousemove', scratch);
canvas.addEventListener('mouseup', () => { isDrawing = false; ctx.beginPath(); });
canvas.addEventListener('touchstart', (e) => { isDrawing = true; scratch(e); ctx.beginPath(); });
canvas.addEventListener('touchmove', scratch);
canvas.addEventListener('touchend', () => { isDrawing = false; ctx.beginPath(); });

// Check how much is scratched off to trigger confetti
function checkReveal() {
    if (revealed) return;
    
    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    let transparentPixels = 0;
    for (let i = 3; i < imageData.data.length; i += 4) {
        if (imageData.data[i] === 0) transparentPixels++;
    }
    
    const percentRevealed = (transparentPixels / (canvas.width * canvas.height)) * 100;
    
    // Trigger confetti at 40% scratched
    if (percentRevealed > 40) {
        revealed = true;
        document.getElementById('getting-married-text').style.opacity = '1';
        document.getElementById('getting-married-text').style.transition = 'opacity 1s';
        
        // Fire Confetti!
        confetti({
            particleCount: 100,
            spread: 70,
            origin: { y: 0.6 },
            colors: ['#8b0000', '#d4af37', '#ffffff'] // Red, Gold, White
        });
        
        // Optional: clear the rest of the canvas automatically
        ctx.clearRect(0, 0, canvas.width, canvas.height);
    }
}

// --- 3. Countdown Logic ---
const weddingDate = new Date("Sept 10, 2027 00:00:00").getTime();

setInterval(function() {
    const now = new Date().getTime();
    const distance = weddingDate - now;

    const days = Math.floor(distance / (1000 * 60 * 60 * 24));
    const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));

    document.getElementById("days").innerText = days.toString().padStart(3, '0');
    document.getElementById("hours").innerText = hours.toString().padStart(2, '0');
    document.getElementById("minutes").innerText = minutes.toString().padStart(2, '0');
}, 1000);
