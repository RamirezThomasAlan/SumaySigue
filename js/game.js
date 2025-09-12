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
    
    // Comprobar estado del juego
    function checkGameStatus() {
        // Comprobar si hay 2048
        for (let i = 0; i < 4; i++) {
            for (let j = 0; j < 4; j++) {
                if (grid[i][j] === 2048) {
                    gameWon();
                    return;
                }
            }
        }
        
        // Comprobar si hay movimientos posibles
        for (let i = 0; i < 4; i++) {
            for (let j = 0; j < 4; j++) {
                if (grid[i][j] === 0) {
                    return; // Hay al menos un espacio vacío
                }
                
                if (j < 3 && grid[i][j] === grid[i][j + 1]) {
                    return; // Hay fusión horizontal posible
                }
                
                if (i < 3 && grid[i][j] === grid[i + 1][j]) {
                    return; // Hay fusión vertical posible
                }
            }
        }
        
        // Si no hay movimientos posibles
        gameOver = true;
        gameMessage.style.display = 'flex';
        messageText.textContent = '¡Juego Terminado!';
    }
    
    // Ganar el juego
    function gameWon() {
        gameOver = true;
        gameMessage.style.display = 'flex';
        messageText.textContent = '¡Ganaste!';
    }
    
    // Detectar dirección del deslizamiento
    function detectSwipeDirection() {
        const diffX = touchEndX - touchStartX;
        const diffY = touchEndY - touchStartY;
        
        // Umbral mínimo de desplazamiento
        if (Math.abs(diffX) < 30 && Math.abs(diffY) < 30) {
            return null;
        }
        
        if (Math.abs(diffX) > Math.abs(diffY)) {
            // Deslizamiento horizontal
            return diffX > 0 ? 'right' : 'left';
        } else {
            // Deslizamiento vertical
            return diffY > 0 ? 'down' : 'up';
        }
    }
    
    // Event listeners para ratón
    gridElement.addEventListener('mousedown', (event) => {
        if (!gameStarted || gameOver) return;
        
        touchStartX = event.clientX;
        touchStartY = event.clientY;
        isDragging = true;
    });
    
    document.addEventListener('mousemove', (event) => {
        if (!isDragging) return;
        
        touchEndX = event.clientX;
        touchEndY = event.clientY;
    });
    
    document.addEventListener('mouseup', () => {
        if (!isDragging) return;
        
        isDragging = false;
        const direction = detectSwipeDirection();
        if (direction) {
            move(direction);
        }
    });
    
    // Event listeners para touch (móviles)
    gridElement.addEventListener('touchstart', (event) => {
        if (!gameStarted || gameOver) return;
        
        touchStartX = event.touches[0].clientX;
        touchStartY = event.touches[0].clientY;
    }, { passive: true });
    
    gridElement.addEventListener('touchmove', (event) => {
        if (!gameStarted || gameOver) return;
        
        touchEndX = event.touches[0].clientX;
        touchEndY = event.touches[0].clientY;
    }, { passive: true });
    
    gridElement.addEventListener('touchend', (event) => {
        if (!gameStarted || gameOver) return;
        
        const direction = detectSwipeDirection();
        if (direction) {
            move(direction);
        }
    }, { passive: true });
    
    // Event listeners para teclado
    document.addEventListener('keydown', (event) => {
        if (!gameStarted || gameOver) return;
        
        let moved = false;
        
        switch(event.key) {
            case 'ArrowUp':
                moved = move('up');
                break;
            case 'ArrowDown':
                moved = move('down');
                break;
            case 'ArrowLeft':
                moved = move('left');
                break;
            case 'ArrowRight':
                moved = move('right');
                break;
            default:
                return; // Salir si no es una tecla de flecha
        }
        
        if (moved) {
            event.preventDefault();
        }
    });
    
    // Botón de inicio
    startButton.addEventListener('click', () => {
        gameContainer.style.display = 'block';
        startButton.style.display = 'none';
        gameStarted = true;
        initGame();
    });
    
    // Botón de reinicio
    restartButton.addEventListener('click', initGame);
    retryButton.addEventListener('click', initGame);
});