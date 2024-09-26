const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
const scoreDisplay = document.getElementById('score');
const levelDisplay = document.getElementById('level');
const livesDisplay = document.getElementById('lives');
const startButton = document.getElementById('startButton');

// Game constants
const PADDLE_WIDTH = 100;
const PADDLE_HEIGHT = 10;
const BALL_RADIUS = 8;
const BRICK_WIDTH = 75;
const BRICK_HEIGHT = 20;
const BRICK_PADDING = 10;
const BRICK_OFFSET_TOP = 30;
const BRICK_OFFSET_LEFT = 30;

// Game variables
let score = 0;
let lives = 3;
let level = 1;
let gameLoop;
let bricks = [];
let balls = [];
let powerUps = [];

// Game objects
const paddle = {
    x: canvas.width / 2 - PADDLE_WIDTH / 2,
    y: canvas.height - PADDLE_HEIGHT,
    width: PADDLE_WIDTH,
    height: PADDLE_HEIGHT,
    dx: 7
};

// Power-up types
const POWER_UP_TYPES = {
    MULTI_BALL: 'MULTI_BALL',
    ENLARGE_PADDLE: 'ENLARGE_PADDLE',
    FIREBALL: 'FIREBALL'
};

// Initialize bricks
function initBricks() {
    bricks = [];
    const levelStructures = [
        [
            [1,1,1,1,1,1,1,1],
            [1,1,1,1,1,1,1,1],
            [1,1,1,1,1,1,1,1],
            [1,1,1,1,1,1,1,1],
            [1,1,1,1,1,1,1,1]
        ],
        [
            [0,1,1,1,1,1,1,0],
            [1,1,2,1,1,2,1,1],
            [1,2,2,2,2,2,2,1],
            [1,1,2,1,1,2,1,1],
            [0,1,1,1,1,1,1,0]
        ],
        [
            [1,1,2,2,2,2,1,1],
            [1,2,3,3,3,3,2,1],
            [2,3,0,3,3,0,3,2],
            [1,2,3,3,3,3,2,1],
            [1,1,2,2,2,2,1,1]
        ],
        [
            [3,3,3,1,1,3,3,3],
            [3,2,2,2,2,2,2,3],
            [3,2,1,1,1,1,2,3],
            [3,2,2,2,2,2,2,3],
            [3,3,3,1,1,3,3,3]
        ],
        [
            [1,2,3,4,4,3,2,1],
            [2,3,4,0,0,4,3,2],
            [3,4,0,4,4,0,4,3],
            [2,3,4,0,0,4,3,2],
            [1,2,3,4,4,3,2,1]
        ]
    ];

    const structure = levelStructures[level - 1];
    for (let c = 0; c < structure[0].length; c++) {
        bricks[c] = [];
        for (let r = 0; r < structure.length; r++) {
            if (structure[r][c] > 0) {
                bricks[c][r] = { 
                    x: 0, 
                    y: 0, 
                    status: structure[r][c], 
                    powerUp: Math.random() < 0.1 ? getRandomPowerUp() : null 
                };
            } else {
                bricks[c][r] = { status: 0 };
            }
        }
    }
}

function getRandomPowerUp() {
    const powerUps = Object.values(POWER_UP_TYPES);
    return powerUps[Math.floor(Math.random() * powerUps.length)];
}

// Draw ball
function drawBall(ball) {
    ctx.beginPath();
    ctx.arc(ball.x, ball.y, ball.radius, 0, Math.PI * 2);
    ctx.fillStyle = ball.fireball ? '#FF4500' : '#0095DD';
    ctx.fill();
    ctx.closePath();
}

// Draw paddle
function drawPaddle() {
    ctx.beginPath();
    ctx.rect(paddle.x, paddle.y, paddle.width, paddle.height);
    ctx.fillStyle = '#0095DD';
    ctx.fill();
    ctx.closePath();
}

// Draw bricks
function drawBricks() {
    for (let c = 0; c < bricks.length; c++) {
        for (let r = 0; r < bricks[c].length; r++) {
            if (bricks[c][r].status > 0) {
                const brickX = c * (BRICK_WIDTH + BRICK_PADDING) + BRICK_OFFSET_LEFT;
                const brickY = r * (BRICK_HEIGHT + BRICK_PADDING) + BRICK_OFFSET_TOP;
                bricks[c][r].x = brickX;
                bricks[c][r].y = brickY;
                ctx.beginPath();
                ctx.rect(brickX, brickY, BRICK_WIDTH, BRICK_HEIGHT);
                ctx.fillStyle = getBrickColor(bricks[c][r].status);
                ctx.fill();
                ctx.closePath();
            }
        }
    }
}

// Draw power-ups
function drawPowerUps() {
    for (let i = 0; i < powerUps.length; i++) {
        const powerUp = powerUps[i];
        ctx.beginPath();
        ctx.rect(powerUp.x, powerUp.y, 20, 20);
        ctx.fillStyle = getPowerUpColor(powerUp.type);
        ctx.fill();
        ctx.closePath();
    }
}

function getPowerUpColor(type) {
    switch (type) {
        case POWER_UP_TYPES.MULTI_BALL:
            return '#00FF00';
        case POWER_UP_TYPES.ENLARGE_PADDLE:
            return '#FFA500';
        case POWER_UP_TYPES.FIREBALL:
            return '#FF4500';
    }
}

// Get brick color based on status
function getBrickColor(status) {
    const colors = ['#FF0000', '#FF7F00', '#FFFF00', '#00FF00'];
    return colors[status - 1];
}

// Collision detection
function collisionDetection() {
    for (let c = 0; c < bricks.length; c++) {
        for (let r = 0; r < bricks[c].length; r++) {
            const b = bricks[c][r];
            if (b.status > 0) {
                for (let i = 0; i < balls.length; i++) {
                    const ball = balls[i];
                    if (ball.x > b.x && ball.x < b.x + BRICK_WIDTH && ball.y > b.y && ball.y < b.y + BRICK_HEIGHT) {
                        if (!ball.fireball) {
                            ball.dy = -ball.dy;
                        }
                        b.status--;
                        if (b.status === 0 && b.powerUp) {
                            powerUps.push({
                                x: b.x + BRICK_WIDTH / 2,
                                y: b.y + BRICK_HEIGHT,
                                type: b.powerUp,
                                dy: 2
                            });
                        }
                        score++;
                        if (score === getTotalBricks()) {
                            if (level === 5) {
                                alert('Congratulations! You\'ve completed all levels!');
                                document.location.reload();
                            } else {
                                level++;
                                initNextLevel();
                            }
                        }
                        break;
                    }
                }
            }
        }
    }
}

function getTotalBricks() {
    let total = 0;
    for (let c = 0; c < bricks.length; c++) {
        for (let r = 0; r < bricks[c].length; r++) {
            if (bricks[c][r].status > 0) {
                total++;
            }
        }
    }
    return total;
}

// Move paddle
function movePaddle() {
    if (rightPressed && paddle.x < canvas.width - paddle.width) {
        paddle.x += paddle.dx;
    } else if (leftPressed && paddle.x > 0) {
        paddle.x -= paddle.dx;
    }
}

// Move balls
function moveBalls() {
    for (let i = balls.length - 1; i >= 0; i--) {
        const ball = balls[i];
        ball.x += ball.dx;
        ball.y += ball.dy;

        // Wall collision
        if (ball.x + ball.radius > canvas.width || ball.x - ball.radius < 0) {
            ball.dx = -ball.dx;
        }
        if (ball.y - ball.radius < 0) {
            ball.dy = -ball.dy;
        }

        // Paddle collision
        if (ball.y + ball.radius > canvas.height - PADDLE_HEIGHT) {
            if (ball.x > paddle.x && ball.x < paddle.x + paddle.width) {
                ball.dy = -ball.dy;
                let hitPoint = (ball.x - paddle.x) / paddle.width;
                ball.dx = 8 * (hitPoint - 0.5); // Adjust ball direction based on hit point
            } else {
                balls.splice(i, 1);
                if (balls.length === 0) {
                    lives--;
                    if (lives === 0) {
                        alert('Game Over');
                        document.location.reload();
                    } else {
                        initBall();
                    }
                }
            }
        }
    }
}

// Move power-ups
function movePowerUps() {
    for (let i = powerUps.length - 1; i >= 0; i--) {
        const powerUp = powerUps[i];
        powerUp.y += powerUp.dy;

        // Check for paddle collision
        if (powerUp.y + 20 > paddle.y && 
            powerUp.x + 20 > paddle.x && 
            powerUp.x < paddle.x + paddle.width) {
            activatePowerUp(powerUp.type);
            powerUps.splice(i, 1);
        }

        // Remove power-up if it goes off-screen
        if (powerUp.y > canvas.height) {
            powerUps.splice(i, 1);
        }
    }
}

function activatePowerUp(type) {
    switch (type) {
        case POWER_UP_TYPES.MULTI_BALL:
            multiplyBalls();
            break;
        case POWER_UP_TYPES.ENLARGE_PADDLE:
            enlargePaddle();
            break;
        case POWER_UP_TYPES.FIREBALL:
            activateFireball();
            break;
    }
}

function multiplyBalls() {
    const newBalls = [];
    for (let ball of balls) {
        newBalls.push(
            { ...ball, dx: ball.dx, dy: -ball.dy },
            { ...ball, dx: -ball.dx, dy: ball.dy }
        );
    }
    balls = balls.concat(newBalls);
}

function enlargePaddle() {
    paddle.width = Math.min(paddle.width * 1.5, canvas.width / 2);
    setTimeout(() => {
        paddle.width = PADDLE_WIDTH;
    }, 10000);
}

function activateFireball() {
    for (let ball of balls) {
        ball.fireball = true;
    }
    setTimeout(() => {
        for (let ball of balls) {
            ball.fireball = false;
        }
    }, 10000);
}

// Initialize next level
function initNextLevel() {
    paddle.x = (canvas.width - paddle.width) / 2;
    initBall();
    initBricks();
    powerUps = [];
}

function initBall() {
    balls = [{
        x: canvas.width / 2,
        y: canvas.height - 30,
        dx: 5 + level,
        dy: -5 - level,
        radius: BALL_RADIUS,
        fireball: false
    }];
}

// Draw game
function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    drawBricks();
    drawPaddle();
    for (let ball of balls) {
        drawBall(ball);
    }
    drawPowerUps();
    collisionDetection();
    movePaddle();
    moveBalls();
    movePowerUps();

    scoreDisplay.textContent = `Score: ${score}`;
    levelDisplay.textContent = `Level: ${level}`;
    livesDisplay.textContent = `Lives: ${lives}`;

    requestAnimationFrame(draw);
}

// Key events
let rightPressed = false;
let leftPressed = false;

document.addEventListener('keydown', keyDownHandler);
document.addEventListener('keyup', keyUpHandler);
document.addEventListener('mousemove', mouseMoveHandler);

function keyDownHandler(e) {
    if (e.key === 'Right' || e.key === 'ArrowRight') {
        rightPressed = true;
    } else if (e.key === 'Left' || e.key === 'ArrowLeft') {
        leftPressed = true;
    }
}

function keyUpHandler(e) {
    if (e.key === 'Right' || e.key === 'ArrowRight') {
        rightPressed = false;
    } else if (e.key === 'Left' || e.key === 'ArrowLeft') {
        leftPressed = false;
    }
}

function mouseMoveHandler(e) {
    const relativeX = e.clientX - canvas.offsetLeft;
    if (relativeX > 0 && relativeX < canvas.width) {
        paddle.x = relativeX - paddle.width / 2;
    }
}

// Start game
function startGame() {
    score = 0;
    lives = 3;
    level = 1;
    initBricks();
    initBall();
    startButton.style.display = 'none';
    draw();
}

startButton.addEventListener('click', startGame);