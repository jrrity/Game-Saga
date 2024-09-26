document.addEventListener('DOMContentLoaded', () => {
    const playerNameInput = document.getElementById('playerName');
    const gameModeSelect = document.getElementById('gameMode');
    const startGameButton = document.getElementById('startGame');
    const gameBoard = document.getElementById('gameBoard');
    const timerDisplay = document.getElementById('timer');
    const resultDisplay = document.getElementById('result');
    const playAgainButton = document.getElementById('playAgain');
    const revealAllButton = document.getElementById('revealAll');
    const gameTitle = document.getElementById('gameTitle');
    const startImage = document.getElementById('startImage');

    let cards = [];
    let flippedCards = [];
    let matchedPairs = 0;
    let totalPairs = 0;
    let gameMode = '';
    let timeLeft = 0;
    let timerInterval;

    const emojis = ['🐶', '🐱', '🐭', '🐹', '🐰', '🦊', '🐻', '🐼', '🐨', '🐯', '🦁', '🐮'];

    startGameButton.addEventListener('click', startGame);
    playAgainButton.addEventListener('click', playAgain);
    revealAllButton.addEventListener('click', revealAll);

    function startGame() {
        const playerName = playerNameInput.value.trim();
        if (!playerName) {
            alert('Please enter your name');
            return;
        }

        // Hide the setup elements
        gameTitle.style.display = 'none';
        startImage.style.display = 'none';
        playerNameInput.style.display = 'none';
        gameModeSelect.style.display = 'none';
        startGameButton.style.display = 'none';

        // Show the "Play Again" and "Reveal All" buttons
        playAgainButton.classList.remove('hidden');
        revealAllButton.classList.remove('hidden');

        gameMode = gameModeSelect.value;
        resetGame();

        switch (gameMode) {
            case 'easy':
                totalPairs = 5;
                break;
            case 'medium':
                totalPairs = 8;
                break;
            case 'hard':
            case 'extreme':
                totalPairs = 12;
                break;
        }

        if (gameMode === 'extreme') {
            timeLeft = 60;
            startTimer();
        }

        createCards();
        renderCards();
    }

    function resetGame() {
        gameBoard.innerHTML = '';
        cards = [];
        flippedCards = [];
        matchedPairs = 0;
        clearInterval(timerInterval);
        timerDisplay.textContent = '';
        resultDisplay.textContent = '';
        gameBoard.classList.remove('inactive');
    }

    function createCards() {
        const gameEmojis = emojis.slice(0, totalPairs);
        cards = [...gameEmojis, ...gameEmojis].sort(() => Math.random() - 0.5);
    }

    function renderCards() {
        cards.forEach((emoji, index) => {
            const card = document.createElement('div');
            card.className = 'card';
            card.dataset.index = index;
            card.addEventListener('click', flipCard);
            gameBoard.appendChild(card);
        });
    }

    function flipCard() {
        if (flippedCards.length === 2 || this.classList.contains('flipped')) return;

        const card = this;
        const index = card.dataset.index;

        card.classList.add('flipped');
        card.textContent = cards[index];
        flippedCards.push(card);

        if (flippedCards.length === 2) {
            setTimeout(checkMatch, 500);
        }
    }

    function checkMatch() {
        const [card1, card2] = flippedCards;

        if (card1.textContent === card2.textContent) {
            matchedPairs++;
            if (matchedPairs === totalPairs) {
                endGame(true);
            }
        } else {
            card1.classList.remove('flipped');
            card2.classList.remove('flipped');
            card1.textContent = '';
            card2.textContent = '';
        }

        flippedCards = [];
    }

    function startTimer() {
        timerInterval = setInterval(() => {
            timeLeft--;
            timerDisplay.textContent = `Time left: ${timeLeft} seconds`;

            if (timeLeft === 0) {
                endGame(false);
            }
        }, 1000);
    }

    function endGame(win) {
        clearInterval(timerInterval);
        const playerName = playerNameInput.value.trim();

        if (win) {
            resultDisplay.textContent = `Congratulations, ${playerName}! You won!`;
        } else {
            resultDisplay.textContent = `Sorry, ${playerName}. Time's up! Try again.`;
        }
    }

    function playAgain() {
        // Hide the cards and buttons
        gameBoard.innerHTML = '';
        playAgainButton.classList.add('hidden');
        revealAllButton.classList.add('hidden');

        // Show the setup elements
        gameTitle.style.display = 'block';
        startImage.style.display = 'block';
        playerNameInput.style.display = 'block';
        gameModeSelect.style.display = 'block';
        startGameButton.style.display = 'block';

        resetGame();
    }

    function revealAll() {
        // Stop the timer
        clearInterval(timerInterval);

        // Hide the setup elements
        gameTitle.style.display = 'none';
        startImage.style.display = 'none';
        playerNameInput.style.display = 'none';
        gameModeSelect.style.display = 'none';
        startGameButton.style.display = 'none';

        // Reveal all cards
        const allCards = document.querySelectorAll('.card');
        allCards.forEach(card => {
            card.classList.add('flipped');
            card.textContent = cards[card.dataset.index];
        });

        // End the game with a message
        resultDisplay.textContent = `Oh no, you gave up! 😢`;

        // Disable interaction with the game board
        gameBoard.classList.add('inactive');
    }
});
