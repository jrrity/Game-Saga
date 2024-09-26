const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
const startButton = document.getElementById('startButton');
const scoreDisplay = document.getElementById('score');

canvas.width = 400;
canvas.height = 600;

const bird = {
    x: 50,
    y: canvas.height / 2,
    radius: 20,
    velocity: 0,
    gravity: 0.5,
    jump: -10
};

let pipes = [];
let score = 0;
let gameLoop;
let gameStarted = false;
let gamePaused = false;

function drawBird() {
    ctx.fillStyle = 'yellow';
    ctx.beginPath();
    ctx.arc(bird.x, bird.y, bird.radius, 0, Math.PI * 2);
    ctx.fill();
}

function drawPipes() {
    ctx.fillStyle = 'green';
    pipes.forEach(pipe => {
        ctx.fillRect(pipe.x, 0, pipe.width, pipe.top);
        ctx.fillRect(pipe.x, pipe.bottom, pipe.width, canvas.height - pipe.bottom);
    });
}

function updateBird() {
    if (!gamePaused) {
        bird.velocity += bird.gravity;
        bird.y += bird.velocity;

        if (bird.y + bird.radius > canvas.height) {
            bird.y = canvas.height - bird.radius;
            bird.velocity = 0;
        }
    }
}

function updatePipes() {
    if (!gamePaused) {
        if (pipes.length === 0 || pipes[pipes.length - 1].x < canvas.width - 200) {
            const gap = 150;
            const pipeTop = Math.random() * (canvas.height - gap - 100) + 50;
            pipes.push({
                x: canvas.width,
                top: pipeTop,
                bottom: pipeTop + gap,
                width: 50,
                counted: false
            });
        }

        pipes.forEach(pipe => {
            pipe.x -= 2;

            if (pipe.x + pipe.width < 0) {
                pipes.shift();
            }

            if (!pipe.counted && pipe.x + pipe.width < bird.x) {
                score++;
                scoreDisplay.textContent = `Score: ${score}`;
                pipe.counted = true;
            }

            if (bird.x + bird.radius > pipe.x && bird.x - bird.radius < pipe.x + pipe.width) {
                if (bird.y - bird.radius < pipe.top || bird.y + bird.radius > pipe.bottom) {
                    gameOver();
                }
            }
        });
    }
}

function gameOver() {
    gamePaused = true;
    startButton.style.display = 'block';
    gameStarted = false;
}

function drawGameOverScreen() {
    ctx.fillStyle = 'rgba(0, 0, 0, 0.5)';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = 'white';
    ctx.font = '48px Arial';
    ctx.fillText('Game Over', canvas.width / 2 - 100, canvas.height / 2);
}

function update() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    updateBird();
    updatePipes();
    
    drawPipes();
    drawBird();
    
    if (gamePaused) {
        drawGameOverScreen();
    }
    
    if (!gamePaused) {
        gameLoop = requestAnimationFrame(update);
    }
}

function jump() {
    if (gameStarted && !gamePaused) {
        bird.velocity = bird.jump;
    }
}

function startGame() {
    bird.y = canvas.height / 2;
    bird.velocity = 0;
    pipes = [];
    score = 0;
    scoreDisplay.textContent = 'Score: 0';
    startButton.style.display = 'none';
    gameStarted = true;
    gamePaused = false;
    update();
}

canvas.addEventListener('click', jump);
document.addEventListener('keydown', (e) => {
    if (e.code === 'Space') {
        jump();
    }
});

startButton.addEventListener('click', startGame);

// Initial game setup
startButton.style.display = 'block';