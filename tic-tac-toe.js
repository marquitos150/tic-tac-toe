'use strict'

// IIFE (Immediately Invoked Function Expression)
// Module pattern wraps factory to create private scope
const GameBoard = (() => {
    const grid = [
        [' ', ' ', ' '],
        [' ', ' ', ' '],
        [' ', ' ', ' ']
    ];

    const getGrid = () => grid.map(row => [...row]);
    const setGrid = (symbol, row, col) => { 
        if (grid[row][col] === ' ') {
            grid[row][col] = symbol; 
        }
    };

    const resetGrid = () => {
        grid.forEach((row, rIndex) => {
            row.forEach((_, cIndex) => {
                grid[rIndex][cIndex] = ' ';
            });
        });
    };

    return { getGrid, setGrid, resetGrid };
})();

// Standard factory function (NOT AN IIFE)
// Multiple game controllers should exist for each game, each with private state 
function GameController(playerOName="Player O", playerXName="Player X") {
    // Reset board for new game
    GameBoard.resetGrid();
    
    const createPlayer = (name, symbol) => ({ name, symbol });

    const players = [
        createPlayer(playerOName, 'O'),
        createPlayer(playerXName, 'X')
    ];

    const chooseStartingPlayer = () => {
        // 0 for player O, 1 for player X
        const binaryNum = Math.floor(Math.random() * 2);
        return binaryNum === 0 ? players[0] : players[1];
    };

    let playerTurn = chooseStartingPlayer();
    const getPlayerTurn = () => playerTurn;
    const switchPlayerTurn = () => {
        playerTurn = playerTurn === players[0] ? players[1] : players[0];
    };

    let winner = null;
    let winningLineDirection = null;
    const getWinner = () => winner;
    const getWinningLineDirection = () => winningLineDirection;
    const findWinner = () => {
        const currGrid = GameBoard.getGrid();
        // check 3 in a row in each row
        if (currGrid[0].every(symbol => symbol === 'O') ||
            currGrid[1].every(symbol => symbol === 'O') ||
            currGrid[2].every(symbol => symbol === 'O')) {
            winningLineDirection = "horizontal";
            return players[0];
        } 
        if (currGrid[0].every(symbol => symbol === 'X') ||
            currGrid[1].every(symbol => symbol === 'X') ||
            currGrid[2].every(symbol => symbol === 'X')) {
            winningLineDirection = "horizontal";
            return players[1];
        }

        // check 3 in a row in each column
        const currGridReversed = currGrid[0].map((_, col) => currGrid.map(row => row[col]));
        if (currGridReversed[0].every(symbol => symbol === 'O') ||
            currGridReversed[1].every(symbol => symbol === 'O') ||
            currGridReversed[2].every(symbol => symbol === 'O')) {
            winningLineDirection = "vertical";
            return players[0];
        }
        if (currGridReversed[0].every(symbol => symbol === 'X') ||
            currGridReversed[1].every(symbol => symbol === 'X') ||
            currGridReversed[2].every(symbol => symbol === 'X')) {
            winningLineDirection = "vertical";
            return players[1];
        }

        // check 3 in a row for each diagonal
        const firstDiagonal = [currGrid[0][0], currGrid[1][1], currGrid[2][2]];
        const secondDiagonal = [currGrid[0][2], currGrid[1][1], currGrid[2][0]];
        if (firstDiagonal.every(symbol => symbol === 'O') ||
            secondDiagonal.every(symbol => symbol === 'O')) {
            winningLineDirection = "diagonal";
            return players[0];
        }
        if (firstDiagonal.every(symbol => symbol === 'X') ||
            secondDiagonal.every(symbol => symbol === 'X')) {
            winningLineDirection = "diagonal";
            return players[1];
        }

        return null;
    };

    const playRound = (row, col) => {
        GameBoard.setGrid(getPlayerTurn().symbol, row, col);
    };

    const isGameOver = () => {
        const currGrid = GameBoard.getGrid();
        winner = findWinner();
        if (winner || currGrid.every(r => r.every(cell => cell !== ' '))) {
            return true;
        }
        // if the game is not over, switch player's turn
        switchPlayerTurn();
        return false;
    };

    return { getPlayerTurn, getWinner, getWinningLineDirection, playRound, isGameOver };
};

// Another IIFE that will immediately run once defined
// This controller handles the display/DOM logic
const DisplayController = (() => {
    // Game Content Elements
    const gameBoard = document.querySelector('.game-board');
    const gameConsole = document.querySelector('.game-console');
    const form = document.querySelector('form');

    // Scores
    const scoreO = document.querySelector('#left-score');
    const scoreX = document.querySelector('#right-score');
    const tiesScore = document.querySelector('#ties-score');

    let currGame = null; // current game that grid and turn messages will display for it

    const enableCell = (cell) => {
        cell.classList.add("available");
    };
    const disableCell = (cell) => {
        cell.classList.remove("available");
    };

    const enableAllCells = () => {
        const children = [...gameBoard.children];
        children.forEach((child) => {
            if (child.classList.contains("cell")) {
                child.replaceChildren(); // remove symbol
                enableCell(child);
            }
        });
    };
    const disableAllCells = () => {
        const children = [...gameBoard.children];
        children.forEach((child) => {
            if (child.classList.contains("available")) {
                disableCell(child);
            }
        });
    };

    const enableForm = () => {
        form.classList.remove("disabled");
    };
    const disableForm = () => {
        form.classList.add("disabled");
    };

    const createCircle = (cx, cy, r) => {
        const circle = document.createElementNS("http://www.w3.org/2000/svg", "circle");
        circle.setAttribute("cx", cx);
        circle.setAttribute("cy", cy);
        circle.setAttribute("r", r);
        return circle;
    };
    const createLine = (x1, y1, x2, y2) => {
        const line = document.createElementNS("http://www.w3.org/2000/svg", "line");
        line.setAttribute("x1", x1);
        line.setAttribute("y1", y1);
        line.setAttribute("x2", x2);
        line.setAttribute("y2", y2);
        return line;
    };
    
    const displayO = () => {
        const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
        svg.classList.add("neon-O");
        svg.setAttribute("viewBox", "0 0 100 100");

        // draw O
        const circle = createCircle(50, 50, 25);
        svg.appendChild(circle);
        return svg;
    };
    const displayX = () => {
        const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
        svg.classList.add("neon-X");
        svg.setAttribute("viewBox", "0 0 100 100");

        // draw X
        const line1 = createLine(25, 25, 75, 75);
        const line2 = createLine(75, 25, 25, 75);
        svg.appendChild(line1);
        svg.appendChild(line2);
        return svg;
    };

    const displayPlayerTurnMessage = (playerTurn) => {
        gameConsole.textContent = `${playerTurn.name}'s turn...`;
    };

    const displayFinalOutcome = (winner) => {
        if (winner) {
            gameConsole.textContent = `The winner is ${winner.name}!`;
        } else {
            gameConsole.textContent = "It's a tie. Good game!";
        }
    };

    const displayWinningLine = () => {
        const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
        svg.classList.add("winning-line");
        svg.setAttribute("viewBox", "0 0 340 340");
        
        const currGrid = GameBoard.getGrid();
        const direction = currGame.getWinningLineDirection();
        let winningLine = null;
        
        if (direction === "horizontal") {
            if (currGrid[0].every(symbol => symbol === 'O') ||
                currGrid[0].every(symbol => symbol === 'X')) {
                winningLine = createLine(20, 50, 320, 50);
            } else if (currGrid[1].every(symbol => symbol === "O") ||
                currGrid[1].every(symbol => symbol === 'X')) {
                winningLine = createLine(20, 170, 320, 170);
            } else {
                winningLine = createLine(20, 290, 320, 290);
            }
        } else if (direction === "vertical") {
            const currGridReversed = currGrid[0].map((_, col) => currGrid.map(row => row[col]));
            if (currGridReversed[0].every(symbol => symbol === 'O') ||
                currGridReversed[0].every(symbol => symbol === 'X')) {
                winningLine = createLine(50, 20, 50, 320);
            } else if (currGridReversed[1].every(symbol => symbol === 'O') ||
                currGridReversed[1].every(symbol => symbol === 'X')) {
                winningLine = createLine(170, 20, 170, 320);
            } else {
                winningLine = createLine(290, 20, 290, 320);
            }
        } else { // diagonal winning line
            const diagonal = [currGrid[0][0], currGrid[1][1], currGrid[2][2]];
            if (diagonal.every(symbol => symbol === 'O') ||
                diagonal.every(symbol => symbol === 'X')) {
                winningLine = createLine(20, 20, 320, 320);
            } else {
                winningLine = createLine(320, 20, 20, 320);
            }
        }

        svg.appendChild(winningLine);
        return svg;
    };

    const removeWinningLine = () => {
        const lastChild = gameBoard.lastElementChild;
        if (lastChild.classList.contains("winning-line")) {
            gameBoard.removeChild(lastChild);
        }
    };

    const incrementScore = (winner) => {
        if (winner && winner.symbol === 'O') {
            scoreO.textContent = Number(scoreO.textContent) + 1;
        } else if (winner && winner.symbol === 'X') {
            scoreX.textContent = Number(scoreX.textContent) + 1;
        } else {
            tiesScore.textContent = Number(tiesScore.textContent) + 1;
        }
    };

    const gameStartHandler = (e) => {
        e.preventDefault();
        if (currGame) return;

        const playerOName = document.querySelector('#player-O-name').value || undefined;
        const playerXName = document.querySelector('#player-X-name').value || undefined;

        // Invoke Game Controller Factory Function to start new game
        currGame = GameController(playerOName, playerXName);
        
        // Reset the game board for new game
        enableAllCells();
        removeWinningLine();

        // Log in game console who will go first
        displayPlayerTurnMessage(currGame.getPlayerTurn());

        // Disable form so users cannot edit inputs or press play again until the game is over
        disableForm();
    };

    const gridClickHandler = (e) => {
        if (!currGame) return;

        let cell = e.target;
        cell.blur();

        if (!cell.classList.contains('cell')) return;

        const row = Number(cell.dataset.row);
        const col = Number(cell.dataset.col);

        if (GameBoard.getGrid()[row][col] !== ' ') return;

        currGame.playRound(row, col);
        
        // Display symbol and disable cell
        if (GameBoard.getGrid()[row][col] === 'O') {
            cell.appendChild(displayO());
        } else {
            cell.appendChild(displayX());
        }
        disableCell(cell);

        if (currGame.isGameOver()) {
            disableAllCells();

            const currWinner = currGame.getWinner();
            if (currWinner) gameBoard.append(displayWinningLine());
            displayFinalOutcome(currWinner);
            incrementScore(currWinner);
            currGame = null; // current game is finished, reset to null

            // enable the form so user can press play again or possibly change names
            enableForm();
        } else {
            displayPlayerTurnMessage(currGame.getPlayerTurn());
        }
    };

    form.addEventListener('submit', gameStartHandler);
    gameBoard.addEventListener('click', gridClickHandler);
})();