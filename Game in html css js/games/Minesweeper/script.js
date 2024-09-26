const grid = document.getElementById('grid');
const mineCountDisplay = document.getElementById('mine-count');
const newGameBtn = document.getElementById('new-game-btn');

const GRID_SIZE = 9;
const MINE_COUNT = 10;

let cells = [];
let minesLeft = MINE_COUNT;
let gameOver = false;

function createGrid() {
    grid.innerHTML = '';
    cells = [];
    minesLeft = MINE_COUNT;
    gameOver = false;
    mineCountDisplay.textContent = `Mines: ${minesLeft}`;

    for (let i = 0; i < GRID_SIZE; i++) {
        for (let j = 0; j < GRID_SIZE; j++) {
            const cell = document.createElement('div');
            cell.classList.add('cell');
            cell.dataset.row = i;
            cell.dataset.col = j;
            cell.addEventListener('click', revealCell);
            cell.addEventListener('contextmenu', flagCell);
            grid.appendChild(cell);
            cells.push({
                element: cell,
                isMine: false,
                isRevealed: false,
                isFlagged: false,
                neighborMines: 0
            });
        }
    }

    placeMines();
    calculateNeighborMines();
}

function placeMines() {
    let minesPlaced = 0;
    while (minesPlaced < MINE_COUNT) {
        const randomIndex = Math.floor(Math.random() * cells.length);
        if (!cells[randomIndex].isMine) {
            cells[randomIndex].isMine = true;
            minesPlaced++;
        }
    }
}

function calculateNeighborMines() {
    for (let i = 0; i < GRID_SIZE; i++) {
        for (let j = 0; j < GRID_SIZE; j++) {
            const cellIndex = i * GRID_SIZE + j;
            if (!cells[cellIndex].isMine) {
                cells[cellIndex].neighborMines = countNeighborMines(i, j);
            }
        }
    }
}

function countNeighborMines(row, col) {
    let count = 0;
    for (let i = -1; i <= 1; i++) {
        for (let j = -1; j <= 1; j++) {
            const newRow = row + i;
            const newCol = col + j;
            if (newRow >= 0 && newRow < GRID_SIZE && newCol >= 0 && newCol < GRID_SIZE) {
                const cellIndex = newRow * GRID_SIZE + newCol;
                if (cells[cellIndex].isMine) {
                    count++;
                }
            }
        }
    }
    return count;
}

function revealCell(event) {
    if (gameOver) return;
    const cell = cells[getCellIndex(event.target)];
    if (cell.isRevealed || cell.isFlagged) return;

    cell.isRevealed = true;
    cell.element.classList.add('revealed');

    if (cell.isMine) {
        gameOver = true;
        cell.element.classList.add('mine');
        cell.element.textContent = '💣';
        revealAllMines();
        alert('Game Over! You hit a mine.');
    } else if (cell.neighborMines > 0) {
        cell.element.textContent = cell.neighborMines;
    } else {
        revealNeighbors(parseInt(cell.element.dataset.row), parseInt(cell.element.dataset.col));
    }

    checkWinCondition();
}

function revealNeighbors(row, col) {
    for (let i = -1; i <= 1; i++) {
        for (let j = -1; j <= 1; j++) {
            const newRow = row + i;
            const newCol = col + j;
            if (newRow >= 0 && newRow < GRID_SIZE && newCol >= 0 && newCol < GRID_SIZE) {
                const cellIndex = newRow * GRID_SIZE + newCol;
                const neighborCell = cells[cellIndex];
                if (!neighborCell.isRevealed && !neighborCell.isFlagged) {
                    revealCell({ target: neighborCell.element });
                }
            }
        }
    }
}

function flagCell(event) {
    event.preventDefault();
    if (gameOver) return;
    const cell = cells[getCellIndex(event.target)];
    if (cell.isRevealed) return;

    cell.isFlagged = !cell.isFlagged;
    cell.element.textContent = cell.isFlagged ? '🚩' : '';
    minesLeft += cell.isFlagged ? -1 : 1;
    mineCountDisplay.textContent = `Mines: ${minesLeft}`;

    checkWinCondition();
}

function revealAllMines() {
    cells.forEach(cell => {
        if (cell.isMine) {
            cell.element.classList.add('revealed', 'mine');
            cell.element.textContent = '💣';
        }
    });
}

function checkWinCondition() {
    const allNonMinesCellsRevealed = cells.every(cell => cell.isMine || cell.isRevealed);
    const allMinesFlagged = cells.filter(cell => cell.isMine).every(cell => cell.isFlagged);

    if (allNonMinesCellsRevealed && allMinesFlagged) {
        gameOver = true;
        alert('Congratulations! You won!');
    }
}

function getCellIndex(element) {
    const row = parseInt(element.dataset.row);
    const col = parseInt(element.dataset.col);
    return row * GRID_SIZE + col;
}

newGameBtn.addEventListener('click', createGrid);

createGrid();