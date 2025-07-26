class SnakeGame {
    constructor() {
        this.canvas = document.getElementById('gameCanvas');
        this.ctx = this.canvas.getContext('2d');
        this.scoreElement = document.getElementById('score');
        this.highScoreElement = document.getElementById('highScore');
        this.touchArea = document.getElementById('touchArea');
        
        // Game settings
        this.gridSize = 20;
        this.tileCount = this.canvas.width / this.gridSize;
        
        // Game state
        this.snake = [{ x: 10, y: 10 }];
        this.food = { x: 15, y: 15 };
        this.dx = 0;
        this.dy = 0;
        this.score = 0;
        this.gameRunning = false;
        this.gamePaused = false;
        this.gameLoop = null;
        
        // Touch controls
        this.touchStartX = 0;
        this.touchStartY = 0;
        this.minSwipeDistance = 30;
        
        // Load high score
        this.highScore = localStorage.getItem('snakeHighScore') || 0;
        this.highScoreElement.textContent = this.highScore;
        
        this.init();
    }
    
    init() {
        this.setupEventListeners();
        this.generateFood();
        this.draw();
    }
    
    setupEventListeners() {
        // Button controls
        document.getElementById('startBtn').addEventListener('click', () => this.startGame());
        document.getElementById('pauseBtn').addEventListener('click', () => this.togglePause());
        document.getElementById('resetBtn').addEventListener('click', () => this.resetGame());
        
        // Keyboard controls (for desktop)
        document.addEventListener('keydown', (e) => this.handleKeyPress(e));
        
        // Touch controls for mobile
        this.touchArea.addEventListener('touchstart', (e) => this.handleTouchStart(e), { passive: false });
        this.touchArea.addEventListener('touchmove', (e) => this.handleTouchMove(e), { passive: false });
        this.touchArea.addEventListener('touchend', (e) => this.handleTouchEnd(e), { passive: false });
        
        // Prevent scrolling on touch
        this.touchArea.addEventListener('touchstart', (e) => e.preventDefault());
        this.touchArea.addEventListener('touchmove', (e) => e.preventDefault());
    }
    
    handleKeyPress(event) {
        if (!this.gameRunning || this.gamePaused) return;
        
        const { key } = event;
        
        if (key === 'ArrowUp' && this.dy !== 1) {
            this.dx = 0;
            this.dy = -1;
        } else if (key === 'ArrowDown' && this.dy !== -1) {
            this.dx = 0;
            this.dy = 1;
        } else if (key === 'ArrowLeft' && this.dx !== 1) {
            this.dx = -1;
            this.dy = 0;
        } else if (key === 'ArrowRight' && this.dx !== -1) {
            this.dx = 1;
            this.dy = 0;
        }
    }
    
    handleTouchStart(event) {
        event.preventDefault();
        const touch = event.touches[0];
        this.touchStartX = touch.clientX;
        this.touchStartY = touch.clientY;
    }
    
    handleTouchMove(event) {
        event.preventDefault();
    }
    
    handleTouchEnd(event) {
        event.preventDefault();
        
        if (!this.gameRunning || this.gamePaused) return;
        
        const touch = event.changedTouches[0];
        const touchEndX = touch.clientX;
        const touchEndY = touch.clientY;
        
        const deltaX = touchEndX - this.touchStartX;
        const deltaY = touchEndY - this.touchStartY;
        
        const absDeltaX = Math.abs(deltaX);
        const absDeltaY = Math.abs(deltaY);
        
        // Check if swipe distance is sufficient
        if (Math.max(absDeltaX, absDeltaY) < this.minSwipeDistance) {
            return;
        }
        
        // Determine swipe direction
        if (absDeltaX > absDeltaY) {
            // Horizontal swipe
            if (deltaX > 0 && this.dx !== -1) {
                // Swipe right
                this.dx = 1;
                this.dy = 0;
            } else if (deltaX < 0 && this.dx !== 1) {
                // Swipe left
                this.dx = -1;
                this.dy = 0;
            }
        } else {
            // Vertical swipe
            if (deltaY > 0 && this.dy !== -1) {
                // Swipe down
                this.dx = 0;
                this.dy = 1;
            } else if (deltaY < 0 && this.dy !== 1) {
                // Swipe up
                this.dx = 0;
                this.dy = -1;
            }
        }
    }
    
    startGame() {
        if (this.gameRunning) return;
        
        this.gameRunning = true;
        this.gamePaused = false;
        
        // Start moving right if snake is not moving
        if (this.dx === 0 && this.dy === 0) {
            this.dx = 1;
            this.dy = 0;
        }
        
        this.gameLoop = setInterval(() => {
            if (!this.gamePaused) {
                this.update();
                this.draw();
            }
        }, 150);
        
        document.getElementById('startBtn').textContent = 'Playing...';
        document.getElementById('startBtn').disabled = true;
    }
    
    togglePause() {
        if (!this.gameRunning) return;
        
        this.gamePaused = !this.gamePaused;
        document.getElementById('pauseBtn').textContent = this.gamePaused ? 'Resume' : 'Pause';
    }
    
    resetGame() {
        this.gameRunning = false;
        this.gamePaused = false;
        clearInterval(this.gameLoop);
        
        this.snake = [{ x: 10, y: 10 }];
        this.dx = 0;
        this.dy = 0;
        this.score = 0;
        this.scoreElement.textContent = this.score;
        
        this.generateFood();
        this.draw();
        
        document.getElementById('startBtn').textContent = 'Start Game';
        document.getElementById('startBtn').disabled = false;
        document.getElementById('pauseBtn').textContent = 'Pause';
        
        // Remove game over overlay if it exists
        const gameOverElement = document.querySelector('.game-over');
        if (gameOverElement) {
            gameOverElement.remove();
        }
    }
    
    update() {
        const head = { x: this.snake[0].x + this.dx, y: this.snake[0].y + this.dy };
        
        // Check wall collision
        if (head.x < 0 || head.x >= this.tileCount || head.y < 0 || head.y >= this.tileCount) {
            this.gameOver();
            return;
        }
        
        // Check self collision
        for (let segment of this.snake) {
            if (head.x === segment.x && head.y === segment.y) {
                this.gameOver();
                return;
            }
        }
        
        this.snake.unshift(head);
        
        // Check food collision
        if (head.x === this.food.x && head.y === this.food.y) {
            this.score += 10;
            this.scoreElement.textContent = this.score;
            
            // Update high score
            if (this.score > this.highScore) {
                this.highScore = this.score;
                this.highScoreElement.textContent = this.highScore;
                localStorage.setItem('snakeHighScore', this.highScore);
            }
            
            this.generateFood();
        } else {
            this.snake.pop();
        }
    }
    
    generateFood() {
        let foodPosition;
        do {
            foodPosition = {
                x: Math.floor(Math.random() * this.tileCount),
                y: Math.floor(Math.random() * this.tileCount)
            };
        } while (this.snake.some(segment => segment.x === foodPosition.x && segment.y === foodPosition.y));
        
        this.food = foodPosition;
    }
    
    draw() {
        // Clear canvas
        this.ctx.fillStyle = '#000';
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
        
        // Draw snake
        this.ctx.fillStyle = '#0f0';
        for (let i = 0; i < this.snake.length; i++) {
            const segment = this.snake[i];
            
            // Make head slightly different color
            if (i === 0) {
                this.ctx.fillStyle = '#4f4';
            } else {
                this.ctx.fillStyle = '#0f0';
            }
            
            this.ctx.fillRect(
                segment.x * this.gridSize + 1,
                segment.y * this.gridSize + 1,
                this.gridSize - 2,
                this.gridSize - 2
            );
        }
        
        // Draw food
        this.ctx.fillStyle = '#f00';
        this.ctx.fillRect(
            this.food.x * this.gridSize + 1,
            this.food.y * this.gridSize + 1,
            this.gridSize - 2,
            this.gridSize - 2
        );
        
        // Add some visual effects to food
        this.ctx.fillStyle = '#ff4444';
        this.ctx.fillRect(
            this.food.x * this.gridSize + 3,
            this.food.y * this.gridSize + 3,
            this.gridSize - 6,
            this.gridSize - 6
        );
    }
    
    gameOver() {
        this.gameRunning = false;
        this.gamePaused = false;
        clearInterval(this.gameLoop);
        
        document.getElementById('startBtn').textContent = 'Start Game';
        document.getElementById('startBtn').disabled = false;
        document.getElementById('pauseBtn').textContent = 'Pause';
        
        this.showGameOverScreen();
    }
    
    showGameOverScreen() {
        const gameOverHTML = `
            <div class="game-over" style="display: flex;">
                <div class="game-over-content">
                    <h2>Game Over!</h2>
                    <p>Final Score: ${this.score}</p>
                    <p>High Score: ${this.highScore}</p>
                    <button class="control-btn" onclick="game.resetGame(); this.parentElement.parentElement.remove();">
                        Play Again
                    </button>
                </div>
            </div>
        `;
        
        document.body.insertAdjacentHTML('beforeend', gameOverHTML);
    }
}

// Initialize the game when the page loads
let game;
document.addEventListener('DOMContentLoaded', () => {
    game = new SnakeGame();
});

// Handle canvas responsiveness
function resizeCanvas() {
    const canvas = document.getElementById('gameCanvas');
    const container = document.querySelector('.game-container');
    const maxWidth = Math.min(400, container.clientWidth - 40);
    
    canvas.style.width = maxWidth + 'px';
    canvas.style.height = maxWidth + 'px';
}

window.addEventListener('resize', resizeCanvas);
window.addEventListener('orientationchange', () => {
    setTimeout(resizeCanvas, 100);
});

// Prevent zoom on double tap
let lastTouchEnd = 0;
document.addEventListener('touchend', (event) => {
    const now = (new Date()).getTime();
    if (now - lastTouchEnd <= 300) {
        event.preventDefault();
    }
    lastTouchEnd = now;
}, false);