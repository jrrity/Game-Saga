const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
const scoreDisplay = document.getElementById('score');
const startButton = document.getElementById('startButton');
const messageDisplay = document.getElementById('message');

const ball = {
    x: canvas.width / 2,
    y: canvas.height / 2,
    radius: 10,
    speed: 5,
    dx: 5,
    dy: 5
};

const paddleHeight = 100;
const paddleWidth = 10;

const leftPaddle = {
    x: 0,
    y: canvas.height / 2 - paddleHeight / 2,
    width: paddleWidth,
    height: paddleHeight,
    dy: 5
};

const rightPaddle = {
    x: canvas.width - paddleWidth,
    y: canvas.height / 2 - paddleHeight / 2,
    width: paddleWidth,
    height: paddleHeight,
    dy: 5
};

let player1Score = 0;
let player2Score = 0;
let gameRunning = false;
const winningScore = 10;

function drawBall() {
    ctx.beginPath();
    ctx.arc(ball.x, ball.y, ball.radius, 0, Math.PI * 2);
    ctx.fillStyle = '#fff';
    ctx.fill();
    ctx.closePath();
}

function drawPaddle(paddle) {
    ctx.fillStyle = '#fff';
    ctx.fillRect(paddle.x, paddle.y, paddle.width, paddle.height);
}

function movePaddles() {
    if (keys.w && leftPaddle.y > 0) {
        leftPaddle.y -= leftPaddle.dy;
    }
    if (keys.s && leftPaddle.y < canvas.height - leftPaddle.height) {
        leftPaddle.y += leftPaddle.dy;
    }

    moveAIPaddle();
}

function moveAIPaddle() {
    const paddleCenter = rightPaddle.y + rightPaddle.height / 2;
    const ballCenter = ball.y;
    const mistakeChance = Math.random(); // Random value between 0 and 1 to determine if AI makes a mistake

    // Adjust AI movement with some randomness
    if (mistakeChance < 0.08) { // 15% chance to make a mistake
        // Simulate random movement by the AI
        if (Math.random() > 0.5) {
            rightPaddle.y += 1.09*rightPaddle.dy; // Move down
        } else {
            rightPaddle.y -= 1.09*rightPaddle.dy; // Move up
        }
    } else {
        if (paddleCenter < ballCenter - 40) {
            rightPaddle.y += 1.09*rightPaddle.dy;
        } else if (paddleCenter > ballCenter + 40) {
            rightPaddle.y -= 1.09*rightPaddle.dy;
        }
    }

    // Ensure AI paddle does not go out of bounds
    rightPaddle.y = Math.max(0, Math.min(canvas.height - rightPaddle.height, rightPaddle.y));
}

function moveBall() {
    ball.x += ball.dx;
    ball.y += ball.dy;

    // Ball collision with top and bottom
    if (ball.y + ball.radius > canvas.height || ball.y - ball.radius < 0) {
        ball.dy *= -1;
    }

    // Ball collision with paddles
    if (
        (ball.x - ball.radius < leftPaddle.x + leftPaddle.width &&
            ball.y > leftPaddle.y &&
            ball.y < leftPaddle.y + leftPaddle.height) ||
        (ball.x + ball.radius > rightPaddle.x &&
            ball.y > rightPaddle.y &&
            ball.y < rightPaddle.y + rightPaddle.height)
    ) {
        let paddle = ball.dx < 0 ? leftPaddle : rightPaddle;
        let collisionPoint = ball.y - (paddle.y + paddle.height / 2);
        collisionPoint = collisionPoint / (paddle.height / 2);

        let angle = collisionPoint * Math.PI / 4;
        let direction = ball.dx > 0 ? -1 : 1;

        // Adjust ball direction based on collision point and speed
        ball.dx = direction * ball.speed * Math.cos(angle);
        ball.dy = ball.speed * Math.sin(angle);

        // Adjust ball speed based on impact point
        const speedMultiplier = Math.random() * 0.5 + 0.75; // Random value between 0.75 and 1.25
        ball.speed *= speedMultiplier;

        // Reset ball speed to reasonable range
        ball.speed = Math.min(Math.max(ball.speed, 5), 10);
        ball.dx = Math.sign(ball.dx) * ball.speed;
        ball.dy = Math.sign(ball.dy) * ball.speed;
    }

    // Check if the ball is out of bounds
    if (ball.x + ball.radius > canvas.width) {
        player1Score++;
        resetBall();
    } else if (ball.x - ball.radius < 0) {
        player2Score++;
        resetBall();
    }

    updateScore();
    checkGameEnd();
}

function resetBall() {
    ball.x = canvas.width / 2;
    ball.y = canvas.height / 2;
    ball.speed = 5;
    ball.dx = (Math.random() > 0.5 ? 1 : -1) * ball.speed;
    ball.dy = (Math.random() > 0.5 ? 1 : -1) * ball.speed;
}

function updateScore() {
    scoreDisplay.textContent = `Player: ${player1Score} | Computer: ${player2Score}`;
}

function checkGameEnd() {
    if (player1Score >= winningScore) {
        gameRunning = false;
        messageDisplay.textContent = `You win! Final Score - Player: ${player1Score} | Computer: ${player2Score}`;
        messageDisplay.style.color = '#0f0'; // Green for win
        startButton.style.display = 'block';
    } else if (player2Score >= winningScore) {
        gameRunning = false;
        messageDisplay.textContent = `You lose! Final Score - Player: ${player1Score} | Computer: ${player2Score}`;
        messageDisplay.style.color = '#f00'; // Red for loss
        startButton.style.display = 'block';
    }
}

function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    drawBall();
    drawPaddle(leftPaddle);
    drawPaddle(rightPaddle);
}

function gameLoop() {
    if (gameRunning) {
        movePaddles();
        moveBall();
        draw();
        requestAnimationFrame(gameLoop);
    }
}

const keys = {};

document.addEventListener('keydown', (e) => {
    keys[e.key] = true;
});

document.addEventListener('keyup', (e) => {
    keys[e.key] = false;
});

function startGame() {
    player1Score = 0;
    player2Score = 0;
    gameRunning = true;
    updateScore();
    resetBall();
    messageDisplay.textContent = '';
    startButton.style.display = 'none';
    gameLoop();
}

startButton.addEventListener('click', startGame);
