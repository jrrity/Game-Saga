const gameBoard = document.getElementById('game-board');
const scoreDisplay = document.getElementById('scoreValue');
const newGameBtn = document.getElementById('newGameBtn');

let board;
let score;

function initializeGame() {
    board = [
        [0, 0, 0, 0],
        [0, 0, 0, 0],
        [0, 0, 0, 0],
        [0, 0, 0, 0]
    ];
    score = 0;
    addNewTile();
    addNewTile();
    updateBoard();
}

function addNewTile() {
    let emptyTiles = [];
    for (let i = 0; i < 4; i++) {
        for (let j = 0; j < 4; j++) {
            if (board[i][j] === 0) {
                emptyTiles.push({row: i, col: j});
            }
        }
    }
    if (emptyTiles.length > 0) {
        let randomTile = emptyTiles[Math.floor(Math.random() * emptyTiles.length)];
        board[randomTile.row][randomTile.col] = Math.random() < 0.9 ? 2 : 4;
    }
}

function updateBoard() {
    gameBoard.innerHTML = '';
    for (let i = 0; i < 4; i++) {
        for (let j = 0; j < 4; j++) {
            const tile = document.createElement('div');
            tile.className = `tile ${board[i][j] !== 0 ? 'tile-' + board[i][j] : ''}`;
            tile.textContent = board[i][j] !== 0 ? board[i][j] : '';
            gameBoard.appendChild(tile);
        }
    }
    scoreDisplay.textContent = score;
}

function move(direction) {
    let moved = false;
    let newBoard = JSON.parse(JSON.stringify(board));

    if (direction === 'left' || direction === 'right') {
        for (let i = 0; i < 4; i++) {
            let row = newBoard[i];
            row = direction === 'left' ? slide(row) : slide(row.reverse()).reverse();
            newBoard[i] = row;
            if (!arraysEqual(newBoard[i], board[i])) moved = true;
        }
    } else {
        for (let j = 0; j < 4; j++) {
            let column = [newBoard[0][j], newBoard[1][j], newBoard[2][j], newBoard[3][j]];
            column = direction === 'up' ? slide(column) : slide(column.reverse()).reverse();
            for (let i = 0; i < 4; i++) {
                if (newBoard[i][j] !== column[i]) moved = true;
                newBoard[i][j] = column[i];
            }
        }
    }

    if (moved) {
        board = newBoard;
        addNewTile();
        updateBoard();
        if (isGameOver()) {
            alert('Game Over! Your score: ' + score);
        }
    }
}

function slide(row) {
    let newRow = row.filter(tile => tile !== 0);
    for (let i = 0; i < newRow.length - 1; i++) {
        if (newRow[i] === newRow[i + 1]) {
            newRow[i] *= 2;
            score += newRow[i];
            newRow.splice(i + 1, 1);
        }
    }
    while (newRow.length < 4) {
        newRow.push(0);
    }
    return newRow;
}

function arraysEqual(arr1, arr2) {
    return JSON.stringify(arr1) === JSON.stringify(arr2);
}

function isGameOver() {
    for (let i = 0; i < 4; i++) {
        for (let j = 0; j < 4; j++) {
            if (board[i][j] === 0) return false;
            if (i < 3 && board[i][j] === board[i + 1][j]) return false;
            if (j < 3 && board[i][j] === board[i][j + 1]) return false;
        }
    }
    return true;
}

document.addEventListener('keydown', (e) => {
    switch (e.key) {
        case 'ArrowLeft': move('left'); break;
        case 'ArrowRight': move('right'); break;
        case 'ArrowUp': move('up'); break;
        case 'ArrowDown': move('down'); break;
    }
});

newGameBtn.addEventListener('click', initializeGame);

initializeGame();