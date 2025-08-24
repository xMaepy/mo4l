
// Setup canvas and context
const canvas = document.getElementById('canvas1');
const ctx = canvas.getContext('2d');
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

ctx.strokeStyle = '#ff00ff';

// Particle class
class Particle {
    constructor(effect) {
        this.effect = effect;
        this.radius = Math.random() * 10 + 5;
        this.x = this.radius + Math.random() * (this.effect.width - this.radius * 2);
        this.y = this.radius + Math.random() * (this.effect.height - this.radius * 2);
        this.vx = Math.random() * 1 - 0.5; // velocity x
        this.vy = Math.random() * 1 - 0.5; // velocity y
    }

    // Draw particle on canvas
    draw(context) {
        const pixelSize = this.radius / 2;
        const heartShape = [
            [0, 1, 0, 1, 0],
            [1, 1, 1, 1, 1],
            [1, 1, 1, 1, 1],
            [0, 1, 1, 1, 0],
            [0, 0, 1, 0, 0]
        ];

        context.save();
        context.translate(this.x - (pixelSize * 2.5), this.y - (pixelSize * 2.5));

        context.fillStyle = '#ff00ff'; // Bright magenta for the hearts
        context.shadowColor = '#ff00ff';
        context.shadowBlur = 10;

        for (let row = 0; row < heartShape.length; row++) {
            for (let col = 0; col < heartShape[row].length; col++) {
                if (heartShape[row][col] === 1) {
                    context.fillRect(col * pixelSize, row * pixelSize, pixelSize, pixelSize);
                }
            }
        }
        context.restore();
    }

    // Update particle position
    update() {
        this.x += this.vx;
        if (this.x > this.effect.width - this.radius || this.x < this.radius) {
            this.vx *= -1;
        }

        this.y += this.vy;
        if (this.y > this.effect.height - this.radius || this.y < this.radius) {
            this.vy *= -1;
        }
    }

    // Reset particle position
    reset() {
        this.x = this.radius + Math.random() * (this.effect.width - this.radius * 2);
        this.y = this.radius + Math.random() * (this.effect.height - this.radius * 2);
    }
}

// Effect class to manage particles
class Effect {
    constructor(canvas) {
        this.canvas = canvas;
        this.width = this.canvas.width;
        this.height = this.canvas.height;
        this.particles = [];
        this.numberOfParticles = 200;
        this.createParticles();
    }

    // Create particles and add them to the particles array
    createParticles() {
        for (let i = 0; i < this.numberOfParticles; i++) {
            this.particles.push(new Particle(this));
        }
    }

    // Handle all particles (draw, update, connect)
    handleParticles(context) {
        this.connectParticles(context);
        this.particles.forEach(particle => {
            particle.draw(context);
            particle.update();
        });
    }

    // Connect particles with lines if they are close enough
    connectParticles(context) {
        const maxDistance = 100;
        for (let a = 0; a < this.particles.length; a++) {
            for (let b = a + 1; b < this.particles.length; b++) {
                const dx = this.particles[a].x - this.particles[b].x;
                const dy = this.particles[a].y - this.particles[b].y;
                const distance = Math.hypot(dx, dy);

                if (distance < maxDistance) {
                    context.save();
                    const opacity = 1 - (distance / maxDistance);
                    context.globalAlpha = opacity;
                    context.beginPath();
                    context.moveTo(this.particles[a].x, this.particles[a].y);
                    context.lineTo(this.particles[b].x, this.particles[b].y);
                    context.stroke();
                    context.restore();
                }
            }
        }
    }
    // Resize effect
    resize(width, height) {
        this.width = width;
        this.height = height;
        this.particles.forEach(particle => {
            particle.reset();
        });
    }
}

// Create a new effect
const effect = new Effect(canvas);

// Animation loop
function animate() {
    const bgGradient = ctx.createLinearGradient(0, 0, canvas.width, canvas.height);
    bgGradient.addColorStop(0, '#8e44ad');
    bgGradient.addColorStop(1, '#341f97');
    ctx.fillStyle = bgGradient;
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    effect.handleParticles(ctx);
    requestAnimationFrame(animate);
}
animate();

// Resize event listener
window.addEventListener('resize', function() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    effect.resize(canvas.width, canvas.height);
    ctx.strokeStyle = '#ff00ff';
});

// --- Music Player ---

const songs = [
    { title: 'mAnITtA - bATEMENE', url: 'mAnITtA - bATEMENE.mp3' }
];

const audioPlayer = document.getElementById('audio-player');
const playPauseBtn = document.getElementById('play-pause-btn');
const prevBtn = document.getElementById('prev-btn');
const nextBtn = document.getElementById('next-btn');
const progressBarContainer = document.getElementById('progress-bar-container');
const progressBar = document.getElementById('progress-bar');
const trackInfo = document.getElementById('track-info');

let currentTrackIndex = 0;

function playTrack(index) {
    if (index >= 0 && index < songs.length) {
        currentTrackIndex = index;
        audioPlayer.src = songs[currentTrackIndex].url;
        audioPlayer.play();
        trackInfo.textContent = songs[currentTrackIndex].title;
        playPauseBtn.textContent = 'Pause';
    }
}

function togglePlayPause() {
    if (audioPlayer.paused) {
        audioPlayer.play();
        playPauseBtn.textContent = 'Pause';
    } else {
        audioPlayer.pause();
        playPauseBtn.textContent = 'Play';
    }
}

playPauseBtn.addEventListener('click', togglePlayPause);

prevBtn.addEventListener('click', () => {
    playTrack((currentTrackIndex - 1 + songs.length) % songs.length);
});

nextBtn.addEventListener('click', () => {
    playTrack((currentTrackIndex + 1) % songs.length);
});

audioPlayer.addEventListener('ended', () => {
    nextBtn.click(); // Simulate a click on the next button
});

audioPlayer.addEventListener('timeupdate', () => {
    const progress = (audioPlayer.currentTime / audioPlayer.duration) * 100;
    progressBar.style.width = `${progress}%`;
});

progressBarContainer.addEventListener('click', (e) => {
    const width = progressBarContainer.clientWidth;
    const clickX = e.offsetX;
    const duration = audioPlayer.duration;
    audioPlayer.currentTime = (clickX / width) * duration;
});

// Initial setup
playTrack(0);
