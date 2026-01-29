'use strict'

const gameBoard = (function() {
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

function createPlayer(name, symbol) {
    let winCount = 0;

    const getWinCount = () => winCount;
    const incrementWinCount = () => { winCount++; };

    return { name, symbol, getWinCount, incrementWinCount };
}

function createGame(player1Name, player2Name) {
    function chooseStartingPlayer() {
        // 0 for player1, 1 for player2
        return Math.floor(Math.random() * 2);
    }

    // print the grid for debugging purposes
    function printGrid(currGrid) {
        console.log(currGrid[0][0], "|", currGrid[0][1], "|", currGrid[0][2]);
        console.log("----------");
        console.log(currGrid[1][0], "|", currGrid[1][1], "|", currGrid[1][2]);
        console.log("----------");
        console.log(currGrid[2][0], "|", currGrid[2][1], "|", currGrid[2][2]);
    }

    function playRound(player) {
        printGrid(gameBoard.getGrid());
        console.log("Your turn", player.name);
        while (true) {
            let chosenRow = Number(prompt("Choose row"));
            let chosenCol = Number(prompt("Choose col"));
            if (!Number.isInteger(chosenRow) || !Number.isInteger(chosenCol) ||
                chosenRow < 0 || chosenRow > 2 || chosenCol < 0 || chosenCol > 2) {
                    console.log("Please choose an integer for row and column (0 - 2 inclusive)");
            }
            else {
                if (gameBoard.getGrid()[chosenRow][chosenCol] === ' ') {
                    gameBoard.setGrid(player.symbol, chosenRow, chosenCol);
                    break;
                }
                console.log("Oops! Please choose another cell");
            }
        }
    }

    function findWinner(player1, player2) {
        const currGrid = gameBoard.getGrid();
        // check 3 in a row in each row
        if (currGrid[0].every(symbol => symbol === 'O') ||
            currGrid[1].every(symbol => symbol === 'O') ||
            currGrid[2].every(symbol => symbol === 'O')) {
                return player1;
        } 
        if (currGrid[0].every(symbol => symbol === 'X') ||
            currGrid[1].every(symbol => symbol === 'X') ||
            currGrid[2].every(symbol => symbol === 'X')) {
                return player2;
        }

        // check 3 in a row in each column
        const currGridReversed = currGrid[0].map((_, col) => currGrid.map(row => row[col]));
        if (currGridReversed[0].every(symbol => symbol === 'O') ||
            currGridReversed[1].every(symbol => symbol === 'O') ||
            currGridReversed[2].every(symbol => symbol === 'O')) {
                return player1;
        }
        if (currGridReversed[0].every(symbol => symbol === 'X') ||
            currGridReversed[1].every(symbol => symbol === 'X') ||
            currGridReversed[2].every(symbol => symbol === 'X')) {
                return player2;
        }

        // check 3 in a row for each diagonal
        const firstDiagonal = [currGrid[0][0], currGrid[1][1], currGrid[2][2]];
        const secondDiagonal = [currGrid[0][2], currGrid[1][1], currGrid[2][0]];
        if (firstDiagonal.every(symbol => symbol === 'O') ||
            secondDiagonal.every(symbol => symbol === 'O')) {
            return player1;
        }
        if (firstDiagonal.every(symbol => symbol === 'X') ||
            secondDiagonal.every(symbol => symbol === 'X')) {
            return player2;
        }

        return null;
    }

    function playGame(player1, player2, playerTurn) {
        let winningPlayer = null;
        console.log("Welcome to TIC TAC TOE let's play!");
        do {
            playRound(playerTurn);
            playerTurn = (playerTurn === player1 ? player2 : player1);
            winningPlayer = findWinner(player1, player2);
        } while (!winningPlayer && gameBoard.getGrid().findIndex(row => row.includes(' ')) !== -1)
        printGrid(gameBoard.getGrid());

        if (winningPlayer === player1)
            console.log("CONGRATS", player1.name, "YOU WON!");
        else if (winningPlayer === player2)
            console.log("CONGRATS", player2.name, "YOU WON!");
        else 
            console.log("It's a tie. Good game :)");
    }

    const player1 = createPlayer(player1Name, 'O');
    const player2 = createPlayer(player2Name, 'X');
    let playerTurn = (chooseStartingPlayer() === 0 ? player1 : player2);

    playGame(player1, player2, playerTurn);
}

//createGame("Jerry", "Stewart");
