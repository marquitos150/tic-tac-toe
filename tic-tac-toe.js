const GameBoard = (function() {
    const grid = [
        ['', '', ''],
        ['', '', ''],
        ['', '', '']
    ];

    const getGrid = () => grid;
    const setGrid = (symbol, r, c) => { 
        if (grid[r][c] === '') grid[r][c] = symbol; 
    };

    return { getGrid, setGrid };
})();

