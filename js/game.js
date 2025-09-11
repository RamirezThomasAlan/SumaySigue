document.addEventListener('DOMContentLoaded', () => {
    // Elementos del DOM
    const startButton = document.getElementById('start-button');
    const gameContainer = document.querySelector('.game-container');
    const gridElement = document.getElementById('grid');
    const scoreElement = document.getElementById('score');
    const restartButton = document.getElementById('restart-button');
    const gameMessage = document.getElementById('game-message');
    const messageText = document.getElementById('message-text');
    const retryButton = document.getElementById('retry-button');
    
    // Variables del juego
    let grid = [];
    let score = 0;
    let gameStarted = false;
    let gameOver = false;
    
    // Variables para el control táctil/ratón
    let touchStartX, touchStartY;
    let touchEndX, touchEndY;
    let isDragging = false;
    
    // Inicializar el juego
    function initGame() {
        grid = Array(4).fill().map(() => Array(4).fill(0));
        score = 0;
        gameOver = false;
        scoreElement.textContent = '0';
        gameMessage.style.display = 'none';
        
        // Crear celdas de la cuadrícula
        gridElement.innerHTML = '';
        for (let i = 0; i < 4; i++) {
            for (let j = 0; j < 4; j++) {
                const cell = document.createElement('div');
                cell.className = 'grid-cell';
                gridElement.appendChild(cell);
            }
        }
        
        // Añadir dos fichas iniciales
        addRandomTile();
        addRandomTile();
        
        updateGrid();
    }
    
    // Añadir una ficha aleatoria
    function addRandomTile() {
        const emptyCells = [];
        
        for (let i = 0; i < 4; i++) {
            for (let j = 0; j < 4; j++) {
                if (grid[i][j] === 0) {
                    emptyCells.push({i, j});
                }
            }
        }
        
        if (emptyCells.length > 0) {
            const randomCell = emptyCells[Math.floor(Math.random() * emptyCells.length)];
            grid[randomCell.i][randomCell.j] = Math.random() < 0.9 ? 2 : 4;
        }
    }
    
    // Actualizar la visualización de la cuadrícula
    function updateGrid() {
        const cells = document.querySelectorAll('.grid-cell');
        
        for (let i = 0; i < 4; i++) {
            for (let j = 0; j < 4; j++) {
                const index = i * 4 + j;
                const cell = cells[index];
                
                // Limpiar la celda
                cell.innerHTML = '';
                
                const value = grid[i][j];
                if (value !== 0) {
                    const tile = document.createElement('div');
                    tile.className = `tile tile-${value}`;
                    tile.textContent = value;
                    cell.appendChild(tile);
                }
            }
        }
    }
    
    // Mover las fichas
    function move(direction) {
        if (gameOver) return false;
        
        let moved = false;
        const oldGrid = JSON.parse(JSON.stringify(grid));
        
        // Procesar movimiento según la dirección
        switch(direction) {
            case 'up':
                for (let j = 0; j < 4; j++) {
                    for (let i = 1; i < 4; i++) {
                        if (grid[i][j] !== 0) {
                            let row = i;
                            while (row > 0 && grid[row-1][j] === 0) {
                                grid[row-1][j] = grid[row][j];
                                grid[row][j] = 0;
                                row--;
                                moved = true;
                            }
                            if (row > 0 && grid[row-1][j] === grid[row][j]) {
                                grid[row-1][j] *= 2;
                                score += grid[row-1][j];
                                grid[row][j] = 0;
                                moved = true;
                            }
                        }
                    }
                }
                break;
                
            case 'down':
                for (let j = 0; j < 4; j++) {
                    for (let i = 2; i >= 0; i--) {
                        if (grid[i][j] !== 0) {
                            let row = i;
                            while (row < 3 && grid[row+1][j] === 0) {
                                grid[row+1][j] = grid[row][j];
                                grid[row][j] = 0;
                                row++;
                                moved = true;
                            }
                            if (row < 3 && grid[row+1][j] === grid[row][j]) {
                                grid[row+1][j] *= 2;
                                score += grid[row+1][j];
                                grid[row][j] = 0;
                                moved = true;
                            }
                        }
                    }
                }
                break;
                
            case 'left':
                for (let i = 0; i < 4; i++) {
                    for (let j = 1; j < 4; j++) {
                        if (grid[i][j] !== 0) {
                            let col = j;
                            while (col > 0 && grid[i][col-1] === 0) {
                                grid[i][col-1] = grid[i][col];
                                grid[i][col] = 0;
                                col--;
                                moved = true;
                            }
                            if (col > 0 && grid[i][col-1] === grid[i][col]) {
                                grid[i][col-1] *= 2;
                                score += grid[i][col-1];
                                grid[i][col] = 0;
                                moved = true;
                            }
                        }
                    }
                }
                break;
                
            case 'right':
                for (let i = 0; i < 4; i++) {
                    for (let j = 2; j >= 0; j--) {
                        if (grid[i][j] !== 0) {
                            let col = j;
                            while (col < 3 && grid[i][col+1] === 0) {
                                grid[i][col+1] = grid[i][col];
                                grid[i][col] = 0;
                                col++;
                                moved = true;
                            }
                            if (col < 3 && grid[i][col+1] === grid[i][col]) {
                                grid[i][col+1] *= 2;
                                score += grid[i][col+1];
                                grid[i][col] = 0;
                                moved = true;
                            }
                        }
                    }
                }
                break;
        }
        
        if (moved) {
            scoreElement.textContent = score;
            addRandomTile();
            updateGrid();
            checkGameStatus();
        }
        
        return moved;
    }
});