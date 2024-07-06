const board = document.getElementById('game');
const scoreDisplay = document.getElementById('score');
const bestScoreDisplay = document.getElementById('best-score');
const newGameButton = document.getElementById('new-game');

let board_array = [];
let score = 0;
let bestScore = localStorage.getItem('bestScore') || 0;
let countgoal = 0;
let nomoves = 0;

function updateScoreDisplay() {
    scoreDisplay.textContent = `Score: ${score}`;
    bestScoreDisplay.textContent = `Best Score: ${bestScore}`;
}

function getTileColor(value) {
    const colors = {
        2: '#F87F97',
        4: '#F87793',
        8: '#F76F8E',
        16: '#F7668A',
        32: '#F75E85',
        64: '#F75681',
        128: '#F74E7C',
        256: '#F74678',
        512: '#F73E73',
        1024: '#F7366F',
        2048: '#F72E6A'
    };
    return colors[value] || '#FBADAF';
}

function addTile(value, xpos, ypos) {
    const existingTile = board.querySelector(`.grid-cell[data-x="${xpos}"][data-y="${ypos}"]`);
    existingTile.innerHTML = value > 0 ? `<p>${value}</p>` : '';
    existingTile.style.backgroundColor = getTileColor(value);
    board_array[xpos][ypos] = value;
}

function initializeBoard() {
    board.innerHTML = '';

    for (let i = 0; i < 4; i++) {
        board_array[i] = [];
        for (let j = 0; j < 4; j++) {
            const cell = document.createElement('div');
            cell.classList.add('grid-cell');
            cell.setAttribute('data-x', i);
            cell.setAttribute('data-y', j);
            board.appendChild(cell);
            board_array[i][j] = 0;
        }
    }

    let tile1 = Math.floor(Math.random() * 16);
    let tile2;
    do {
        tile2 = Math.floor(Math.random() * 16);
    } while (tile1 === tile2);

    addTile(2, Math.floor(tile1 / 4), tile1 % 4);
    addTile(2, Math.floor(tile2 / 4), tile2 % 4);
}

let a = b = c = d = 0;

function moving() {
    if (a == 0 && b == 0 && c == 0 && d == 0) {
        return;
    }
    let count = 0;
    if (a != 0) count++;
    if (b != 0) count++;
    if (c != 0) count++;
    if (d != 0) count++;

    if (count == 1) {
        if (b != 0) { a = b; b = 0; }
        else if (c != 0) { a = c; c = 0; }
        else if (d != 0) { a = d; d = 0; }
    } else if (count == 2) {
        if (a != 0 && b != 0) {
            if (a == b) { a += b; b = 0; score += a;}
        } else if (a != 0 && c != 0) {
            if (a == c) { a += c; c = 0; score += a;}
            else { b = c; c = 0; }
        } else if (a != 0 && d != 0) {
            if (a == d) { a += d; d = 0; score += a;}
            else { b = d; d = 0; }
        } else if (b != 0 && c != 0) {
            if (b == c) { a = b + c; b = c = 0; score += a;}
            else { a = b; b = c; c = 0; }
        } else if (b != 0 && d != 0) {
            if (b == d) { a = b + d; b = d = 0; score += a;}
            else { a = b; b = d; d = 0; }
        } else if (c != 0 && d != 0) {
            if (c == d) { a = c + d; c = d = 0; score += a;}
            else { a = c; b = d; c = d = 0; }
        }
    } else if (count == 3) {
        if (a != 0 && b != 0 && c != 0) {
            if (a == b) { a += b; b = c; c = 0; score += a;}
            else if (b == c) { b += c; c = 0; score += b;}
        } else if (a != 0 && b != 0 && d != 0) {
            if (a == b) { a += b; b = d; d = 0; score += a;}
            else if (b == d) { b += d; d = 0; score += b;}
            else { c = d; d = 0; }
        } else if (a != 0 && c != 0 && d != 0) {
            if (a == c) { a += c; b = d; c = d = 0; score += a;}
            else if (c == d) { b = c + d; c = d = 0; score += b;}
            else { b = c; c = d; d = 0; }
        } else if (b != 0 && c != 0 && d != 0) {
            if (b == c) { a = b + c; b = d; c = d = 0; score += a;}
            else if (c == d) { a = b; b = c + d; c = d = 0; score += b;}
            else { a = b; b = c; c = d; d = 0; }
        }
    } else if (count == 4) {
        if (a == b && c == d) {
            a += b; b = c + d; c = d = 0;
            score += (a + b);
        } else if (a == b && c != d) {
            a += b; b = c; c = d; d = 0;
            score += a;
        } else if (b == c) {
            b += c; c = d; d = 0;
            score += b;
        } else if (a != b && c == d) {
            c += d; d = 0;
            score += c;
        }
        else {
            nomoves++;
        }
    }
}

function moveleft(index) {
    a = board_array[index][0];
    b = board_array[index][1];
    c = board_array[index][2];
    d = board_array[index][3];
    moving();
    board_array[index][0] = a;
    board_array[index][1] = b;
    board_array[index][2] = c;
    board_array[index][3] = d;
    a = b = c = d = 0;
}

function moveright(index) {
    a = board_array[index][3];
    b = board_array[index][2];
    c = board_array[index][1];
    d = board_array[index][0];
    moving();
    board_array[index][3] = a;
    board_array[index][2] = b;
    board_array[index][1] = c;
    board_array[index][0] = d;
    a = b = c = d = 0;
}

function moveup(index) {
    a = board_array[0][index];
    b = board_array[1][index];
    c = board_array[2][index];
    d = board_array[3][index];
    moving();
    board_array[0][index] = a;
    board_array[1][index] = b;
    board_array[2][index] = c;
    board_array[3][index] = d;
    a = b = c = d = 0;
}

function movedown(index) {
    a = board_array[3][index];
    b = board_array[2][index];
    c = board_array[1][index];
    d = board_array[0][index];
    moving();
    board_array[3][index] = a;
    board_array[2][index] = b;
    board_array[1][index] = c;
    board_array[0][index] = d;
    a = b = c = d = 0;
}

function insertrandom() {
    let emptyTiles = [];
    for (let i = 0; i < 4; i++) {
        for (let j = 0; j < 4; j++) {
            if (board_array[i][j] == 0) {
                emptyTiles.push([i, j]);
            }
        }
    }
    if (emptyTiles.length > 0) {
        let [i, j] = emptyTiles[Math.floor(Math.random() * emptyTiles.length)];
        board_array[i][j] = Math.random() < 0.9 ? 2 : 4;
        addTile(2, i, j);
    }
}

function move(action) {
    nomoves = 0;
    switch (action) {
        case 'up':
            for (let i = 0; i < 4; i++) moveup(i); 
            break;
        case 'down':
            for (let i = 0; i < 4; i++) movedown(i);
            break;
        case 'left':
            for (let i = 0; i < 4; i++) moveleft(i);
            break;
        case 'right':
            for (let i = 0; i < 4; i++) moveright(i);
            break;
    }
    if (score > bestScore) { 
        bestScore = score;
        localStorage.setItem('bestScore', bestScore);
    }
    insertrandom();
    updateBoard();
    updateScoreDisplay();
    if (countgoal == 0) checkWinCondition();
    if (checkLoseCondition()) {
        showLosePopup();
    }
}

function updateBoard() {
    for (let i = 0; i < 4; i++) {
        for (let j = 0; j < 4; j++) {
            addTile(board_array[i][j], i, j);
        }
    }
}

document.addEventListener('keydown', (event) => {
    if (event.key === 'ArrowUp') {
        move('up');
    } else if (event.key === 'ArrowDown') {
        move('down');
    } else if (event.key === 'ArrowLeft') {
        move('left');
    } else if (event.key === 'ArrowRight') {
        move('right');
    }
});

newGameButton.addEventListener('click', () => {
    initializeBoard();
    score = 0;
    countgoal = 0;
    updateScoreDisplay();
});

initializeBoard();
updateScoreDisplay();

function handleTouchStart(evt) {
    startX = evt.touches[0].clientX;
    startY = evt.touches[0].clientY;
    evt.preventDefault();
}

function handleTouchMove(evt) {
    if (!startX || !startY) {
        return;
    }

    var endX = evt.touches[0].clientX;
    var endY = evt.touches[0].clientY;

    var deltaX = endX - startX;
    var deltaY = endY - startY;

    if (Math.abs(deltaX) > Math.abs(deltaY)) {
        if (deltaX > 0) {
            move('right');
        } else {
            move('left');
        }
    } else {
        if (deltaY > 0) {
            move('down');
        } else {
            move('up');
        }
    }

    startX = startY = null;
    evt.preventDefault();
}

// Add touch event listeners
document.addEventListener('touchstart', handleTouchStart, false);
document.addEventListener('touchmove', handleTouchMove, false);

let winPopup = document.getElementById('popup');
let losePopup = document.getElementById('popup1');
let newGameLoseBtn = document.getElementById('new-game-popup-lose');
let continueBtn = document.getElementById('continue-game');
let newGameBtn = document.getElementById('new-game-popup');

function checkWinCondition() {
    for (let i = 0; i < 4; i++) {
        for (let j = 0; j < 4; j++) {
            if (board_array[i][j] === 2048) {
                showWinPopup();
                countgoal++;
                return;
            }
        }
    }
}

function showWinPopup() {
    winPopup.classList.add('active');
}

function hideWinPopup() {
    winPopup.classList.remove('active');
}

continueBtn.addEventListener('click', () => {
    hideWinPopup();
});

newGameBtn.addEventListener('click', () => {
    hideWinPopup();
    initializeBoard();
    countgoal = 0;
});

function checkLoseCondition() {
    for (let i = 0; i < 4; i++) {
        for (let j = 0; j < 4; j++) {
            if (board_array[i][j] === 0) return false;
            if (i > 0 && board_array[i][j] === board_array[i-1][j]) return false;
            if (i < 3 && board_array[i][j] === board_array[i+1][j]) return false;
            if (j > 0 && board_array[i][j] === board_array[i][j-1]) return false;
            if (j < 3 && board_array[i][j] === board_array[i][j+1]) return false;
        }
    }
    return true;
}

function showLosePopup() {
    losePopup.classList.add('active');
}

function hideLosePopup() {
    losePopup.classList.remove('active');
}

newGameLoseBtn.addEventListener('click', () => {
    hideLosePopup();
    initializeBoard(); // Reset the game
});