'use strict'

const gameBoard = (function() {
    const grid = [
        ['', '', ''],
        ['', '', ''],
        ['', '', '']
    ];

    const getGrid = () => grid.map(row => [...row]);
    const setGrid = (symbol, row, col) => { 
        if (grid[row][col] === '') grid[row][col] = symbol; 
    };
    const resetGrid = () => {
        grid.forEach((row, rIndex) => {
            row.forEach((_, cIndex) => {
                grid[rIndex][cIndex] = '';
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

    function playRound() {

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
        do {
            playRound();
            winningPlayer = findWinner(player1, player2);
        } while (!winningPlayer)
    }

    const player1 = createPlayer(player1Name, 'O');
    const player2 = createPlayer(player2Name, 'X');
    let playerTurn = chooseStartingPlayer() === 0 ? player1 : player2;

    playGame(player1, player2, playerTurn);
}


