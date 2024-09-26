const grid = document.getElementById('grid');
const diamondCountDisplay = document.getElementById('diamond-count');
const newGameBtn = document.getElementById('new-game-btn');
const difficultySelect = document.getElementById('difficulty');

const GRID_SIZE = 5;
const TOTAL_CELLS = GRID_SIZE * GRID_SIZE;
let BOMB_COUNT, DIAMOND_COUNT;
let cells = [];
let diamondsFound = 0;
let gameOver = false;

function setDifficulty() {
    const difficulty = difficultySelect.value;
    switch (difficulty) {
        case 'easy':
            BOMB_COUNT = 3;
            DIAMOND_COUNT = TOTAL_CELLS - BOMB_COUNT;
            break;
        case 'medium':
            BOMB_COUNT = 8;
            DIAMOND_COUNT = TOTAL_CELLS - BOMB_COUNT;
            break;
        case 'hard':
            BOMB_COUNT = 15;
            DIAMOND_COUNT = TOTAL_CELLS - BOMB_COUNT;
            break;
        case 'extreme':
            BOMB_COUNT = TOTAL_CELLS - 1;
            DIAMOND_COUNT = 1;
            break;
    }
}

function createGrid() {
    setDifficulty();
    grid.innerHTML = '';
    cells = [];
    diamondsFound = 0;
    gameOver = false;
    diamondCountDisplay.textContent = `Diamonds: 0 / ${DIAMOND_COUNT}`;

    for (let i = 0; i < TOTAL_CELLS; i++) {
        const cell = document.createElement('div');
        cell.classList.add('cell');
        cell.addEventListener('click', revealCell);
        grid.appendChild(cell);
        cells.push({
            element: cell,
            isBomb: false,
            isDiamond: false,
            isRevealed: false
        });
    }

    placeBombsAndDiamonds();
}

function placeBombsAndDiamonds() {
    // Place bombs
    for (let i = 0; i < BOMB_COUNT; i++) {
        let randomIndex;
        do {
            randomIndex = Math.floor(Math.random() * TOTAL_CELLS);
        } while (cells[randomIndex].isBomb);
        cells[randomIndex].isBomb = true;
    }

    // Place diamonds in remaining cells
    for (let i = 0; i < TOTAL_CELLS; i++) {
        if (!cells[i].isBomb) {
            cells[i].isDiamond = true;
        }
    }
}

function revealCell(event) {
    if (gameOver) return;
    const cell = cells[Array.from(grid.children).indexOf(event.target)];
    if (cell.isRevealed) return;

    cell.isRevealed = true;
    cell.element.classList.add('revealed');

    if (cell.isBomb) {
        cell.element.textContent = '💣';
        gameOver = true;
        revealAllCells();
        alert('Game Over! You hit a bomb.');
    } else if (cell.isDiamond) {
        cell.element.textContent = '💎';
        diamondsFound++;
        diamondCountDisplay.textContent = `Diamonds: ${diamondsFound} / ${DIAMOND_COUNT}`;
        if (diamondsFound === DIAMOND_COUNT) {
            gameOver = true;
            revealAllCells();
            alert('Congratulations! You found all the diamonds!');
        }
    }
}

function revealAllCells() {
    cells.forEach(cell => {
        if (!cell.isRevealed) {
            cell.isRevealed = true;
            cell.element.classList.add('revealed');
            if (cell.isBomb) {
                cell.element.textContent = '💣';
            } else if (cell.isDiamond) {
                cell.element.textContent = '💎';
            }
        }
    });
}

newGameBtn.addEventListener('click', createGrid);
difficultySelect.addEventListener('change', createGrid);

createGrid();