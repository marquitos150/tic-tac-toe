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

    // For debugging purposes on console; will be removed eventually
    const printGrid = () => {
        console.log(grid[0][0], "|", grid[0][1], "|", grid[0][2]);
        console.log("----------");
        console.log(grid[1][0], "|", grid[1][1], "|", grid[1][2]);
        console.log("----------");
        console.log(grid[2][0], "|", grid[2][1], "|", grid[2][2]);
    };

    return { getGrid, setGrid, resetGrid, printGrid };
})();

// Standard factory function (NOT AN IIFE)
// Multiple game controllers should exist for each game, each with private state 
function GameController(player1Name="Player O", player2Name="Player X") {
    const createPlayer = (name, symbol) => {
        let winCount = 0;

        const getWinCount = () => winCount;
        const incrementWinCount = () => { winCount++; };

        return { name, symbol, getWinCount, incrementWinCount };
    };

    const players = [
        createPlayer(player1Name, 'O'),
        createPlayer(player2Name, 'X')
    ];

    const chooseStartingPlayer = () => {
        // 0 for player1, 1 for player2
        const binaryNum = Math.floor(Math.random() * 2);
        return binaryNum === 0 ? players[0] : players[1];
    };

    let playerTurn = chooseStartingPlayer();
    let gameOver = false;

    const getPlayerTurn = () => playerTurn;
    const switchPlayerTurn = () => {
        playerTurn = playerTurn === players[0] ? players[1] : players[0];
    };

    const printNewRound = () => {
        GameBoard.printGrid();
        if (!gameOver) console.log("Your turn", getPlayerTurn().name);
    };

    const findWinner = () => {
        const currGrid = GameBoard.getGrid();
        // check 3 in a row in each row
        if (currGrid[0].every(symbol => symbol === 'O') ||
            currGrid[1].every(symbol => symbol === 'O') ||
            currGrid[2].every(symbol => symbol === 'O')) {
                return players[0];
        } 
        if (currGrid[0].every(symbol => symbol === 'X') ||
            currGrid[1].every(symbol => symbol === 'X') ||
            currGrid[2].every(symbol => symbol === 'X')) {
                return players[1];
        }

        // check 3 in a row in each column
        const currGridReversed = currGrid[0].map((_, col) => currGrid.map(row => row[col]));
        if (currGridReversed[0].every(symbol => symbol === 'O') ||
            currGridReversed[1].every(symbol => symbol === 'O') ||
            currGridReversed[2].every(symbol => symbol === 'O')) {
                return players[0];
        }
        if (currGridReversed[0].every(symbol => symbol === 'X') ||
            currGridReversed[1].every(symbol => symbol === 'X') ||
            currGridReversed[2].every(symbol => symbol === 'X')) {
                return players[1];
        }

        // check 3 in a row for each diagonal
        const firstDiagonal = [currGrid[0][0], currGrid[1][1], currGrid[2][2]];
        const secondDiagonal = [currGrid[0][2], currGrid[1][1], currGrid[2][0]];
        if (firstDiagonal.every(symbol => symbol === 'O') ||
            secondDiagonal.every(symbol => symbol === 'O')) {
            return players[0];
        }
        if (firstDiagonal.every(symbol => symbol === 'X') ||
            secondDiagonal.every(symbol => symbol === 'X')) {
            return players[1];
        }

        return null;
    };

    const playRound = () => {
        if (gameOver) return;

        while (true) {
            let chosenRow = Number(prompt("Choose row"));
            let chosenCol = Number(prompt("Choose col"));
            if (!Number.isInteger(chosenRow) || !Number.isInteger(chosenCol) ||
                chosenRow < 0 || chosenRow > 2 || chosenCol < 0 || chosenCol > 2) {
                    console.log("Please choose an integer for row and column (0 - 2 inclusive)");
            }
            else if (GameBoard.getGrid()[chosenRow][chosenCol] !== ' ') {
                console.log("Oops! Please choose another cell");
            }
            else {
                GameBoard.setGrid(getPlayerTurn().symbol, chosenRow, chosenCol);
                break;
            }
        }

        const winner = findWinner();
        if (winner) {
            GameBoard.printGrid();
            console.log("CONGRATS", winner.name, "YOU WON!");
            gameOver = true;
        } else if (GameBoard.getGrid().every(row => row.every(cell => cell !== ' '))) {
            GameBoard.printGrid();
            console.log("It's a tie. Good game!");
            gameOver = true;
        } else {
            switchPlayerTurn();
            printNewRound();
        }
    };

    // Reset board for new game
    GameBoard.resetGrid();
    printNewRound();

    return { getPlayerTurn, playRound };
};
// Another IIFE
/*
const DisplayController = (() => {
    
})();
*/