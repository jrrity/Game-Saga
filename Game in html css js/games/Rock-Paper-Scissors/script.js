let playerScore = 0;
let computerScore = 0;
let playerName = "";
let winningScore = 10;

document.getElementById('startGame').addEventListener('click', startGame);
document.getElementById('quitGame').addEventListener('click', resetGame);

function startGame() {
    playerName = document.getElementById('playerName').value || "Player";
    winningScore = parseInt(document.getElementById('winningScore').value);
    document.getElementById('setup').style.display = 'none';
    document.getElementById('game').style.display = 'block';
    document.getElementById('gameImage').classList.add('hidden'); // Hide game image
    updateScoreDisplay();
    resetImagesAndResults(); // Ensure images and results are reset when starting a new game
}

document.querySelectorAll('.choice').forEach(button => {
    button.addEventListener('click', () => playRound(button.dataset.choice));
});

function playRound(playerChoice) {
    const choices = ['rock', 'paper', 'scissors'];
    const computerChoice = choices[Math.floor(Math.random() * choices.length)];
    
    const result = getResult(playerChoice, computerChoice);

    // Update the result text at the top
    document.getElementById('resultText').textContent = `You chose ${playerChoice}, computer chose ${computerChoice}. You ${result}!`;

    // Update the player's chosen image and result
    document.getElementById('playerChoiceImage').innerHTML = `
        <img src="images/${playerChoice}.png" alt="${playerChoice}" class="choice-image">
        <span>${playerChoice}</span>`;

    // Update the computer's chosen image and result
    document.getElementById('computerChoiceImage').innerHTML = `
        <img src="images/${computerChoice}.png" alt="${computerChoice}" class="choice-image">
        <span>${computerChoice}</span>`;

    // Update scores
    if (result === 'win') {
        playerScore++;
    } else if (result === 'lose') {
        computerScore++;
    }

    updateScoreDisplay();
    checkForWinner();
}

function getResult(player, computer) {
    if (player === computer) return 'tie';
    if ((player === 'rock' && computer === 'scissors') ||
        (player === 'paper' && computer === 'rock') ||
        (player === 'scissors' && computer === 'paper')) {
        return 'win';
    }
    return 'lose';
}

function updateScoreDisplay() {
    document.getElementById('playerScore').textContent = `${playerName}: ${playerScore}`;
    document.getElementById('computerScore').textContent = `Computer: ${computerScore}`;
}

function checkForWinner() {
    if (playerScore === winningScore) {
        alert(`Congratulations ${playerName}! You won the game!`);
        resetGame();
    } else if (computerScore === winningScore) {
        alert('Computer won the game! Better luck next time.');
        resetGame();
    }
}

function resetGame() {
    playerScore = 0;
    computerScore = 0;
    document.getElementById('setup').style.display = 'block';
    document.getElementById('game').style.display = 'none';
    document.getElementById('resultText').textContent = '';
    document.getElementById('gameImage').classList.remove('hidden'); // Show game image
    resetImagesAndResults(); // Ensure images and results are cleared when resetting the game
}

function resetImagesAndResults() {
    document.getElementById('playerChoiceImage').innerHTML = '';
    document.getElementById('computerChoiceImage').innerHTML = '';
}
