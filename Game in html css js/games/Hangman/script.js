const words = ["javascript", "hangman", "programming", "developer"];
let selectedWord, guessedWord, attempts;

function startGame() {
    selectedWord = words[Math.floor(Math.random() * words.length)];
    guessedWord = Array(selectedWord.length).fill('_');
    attempts = 6; // Number of attempts
    updateDisplay();
    resetHangman();
}

function resetHangman() {
    document.getElementById("head").classList.add("hidden");
    document.getElementById("body").classList.add("hidden");
    document.getElementById("leftArm").classList.add("hidden");
    document.getElementById("rightArm").classList.add("hidden");
    document.getElementById("leftLeg").classList.add("hidden");
    document.getElementById("rightLeg").classList.add("hidden");
}

function updateDisplay() {
    document.getElementById("wordDisplay").textContent = guessedWord.join(' ');
    document.getElementById("totalCharacters").textContent = `Total Characters: ${selectedWord.length}`;
    document.getElementById("hangmanImage").textContent = `Attempts left: ${attempts}`;
    document.getElementById("message").textContent = '';

    if (attempts <= 0 && guessedWord.join('') !== selectedWord) {
        endGame();
    }
}

function makeGuess() {
    const guessInput = document.getElementById("guessInput");
    const guess = guessInput.value.toLowerCase();
    guessInput.value = '';

    if (guess.length === 1 && /[a-z]/.test(guess)) { // Validate single letter guess
        let correctGuess = false;

        if (selectedWord.includes(guess)) {
            for (let i = 0; i < selectedWord.length; i++) {
                if (selectedWord[i] === guess) {
                    guessedWord[i] = guess;
                }
            }
            correctGuess = true;
        }

        if (!correctGuess) {
            attempts--;
            updateHangmanFigure();
        }

        if (guessedWord.join('') === selectedWord) {
            document.getElementById("message").textContent = 'Congratulations! You won!';
            endGame();
        } else if (attempts <= 0) {
            endGame();
        }

        updateDisplay();
    } else {
        document.getElementById("message").textContent = 'Please enter a single letter.';
    }
}

function updateHangmanFigure() {
    switch (attempts) {
        case 5:
            document.getElementById("head").classList.remove("hidden");
            break;
        case 4:
            document.getElementById("body").classList.remove("hidden");
            break;
        case 3:
            document.getElementById("leftArm").classList.remove("hidden");
            break;
        case 2:
            document.getElementById("rightArm").classList.remove("hidden");
            break;
        case 1:
            document.getElementById("leftLeg").classList.remove("hidden");
            break;
        case 0:
            document.getElementById("rightLeg").classList.remove("hidden");
            break;
    }
}
function resetHangman() {
    document.getElementById("head").classList.add("hidden");
    document.getElementById("body").classList.add("hidden");
    document.getElementById("leftArm").classList.add("hidden");
    document.getElementById("rightArm").classList.add("hidden");
    document.getElementById("leftLeg").classList.add("hidden");
    document.getElementById("rightLeg").classList.add("hidden");
}

function endGame() {
    document.getElementById("guessInput").style.display = 'none';
    document.querySelector("button[onclick='makeGuess()']").style.display = 'none';
    document.getElementById("tryAgainButton").style.display = 'block';
    document.getElementById("resetButton").style.display = 'none'; // Hide Reset button when game is over

    if (attempts === 0 && guessedWord.join('') !== selectedWord) {
        document.getElementById("message").textContent = `Game over! The word was "${selectedWord}".`;
    } else if (guessedWord.join('') === selectedWord) {
        document.getElementById("message").textContent = 'Congratulations! You won!';
    }
}

function tryAgain() {
    document.getElementById("guessInput").style.display = 'inline-block';
    document.querySelector("button[onclick='makeGuess()']").style.display = 'inline-block';
    document.getElementById("tryAgainButton").style.display = 'none';
    document.getElementById("resetButton").style.display = 'inline-block'; // Show Reset button during try again
    document.getElementById("message").textContent = '';
    document.getElementById("head").classList.add("hidden");
    document.getElementById("body").classList.add("hidden");
    document.getElementById("leftArm").classList.add("hidden");
    document.getElementById("rightArm").classList.add("hidden");
    document.getElementById("leftLeg").classList.add("hidden");
    document.getElementById("rightLeg").classList.add("hidden");
    startGame(); // Restart the current game
}

function resetGame() {
    document.getElementById("guessInput").style.display = 'inline-block';
    document.querySelector("button[onclick='makeGuess()']").style.display = 'inline-block';
    document.getElementById("tryAgainButton").style.display = 'none';
    document.getElementById("resetButton").style.display = 'inline-block'; // Ensure Reset button is visible
    startGame(); // Start a new game from scratch
}

window.onload = () => {
    startGame();
    document.getElementById("tryAgainButton").addEventListener("click", tryAgain);
    document.getElementById("resetButton").addEventListener("click", resetGame);
};
