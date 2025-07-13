// Global Variables
let currentInterface = 'main';
let currentGame = null;
let gameMode = 'single';

// Interface Management
function showInterface(interfaceId) {
    // Hide all interfaces
    document.querySelectorAll('.interface').forEach(interface => {
        interface.classList.remove('active');
    });
    
    // Show selected interface
    document.getElementById(interfaceId + (interfaceId === 'main' ? '-interface' : '')).classList.add('active');
    currentInterface = interfaceId;
    
    // Stop current game if switching away
    if (currentGame && interfaceId !== currentGame) {
        stopCurrentGame();
    }
}

function resetToDefault() {
    showInterface('main');
    stopCurrentGame();
}

function stopCurrentGame() {
    if (currentGame) {
        switch(currentGame) {
            case 'snake':
                if (snakeGame.gameLoop) clearInterval(snakeGame.gameLoop);
                break;
            case 'subway':
                if (subwayGame.gameLoop) clearInterval(subwayGame.gameLoop);
                break;
            case 'minecraft':
                minecraftGame.isRunning = false;
                break;
            case 'roblox':
                robloxGame.isRunning = false;
                break;
        }
    }
}

// Game Selection Logic
document.addEventListener('DOMContentLoaded', function() {
    // Game mode button handlers
    document.querySelectorAll('.mode-btn').forEach(btn => {
        btn.addEventListener('click', function(e) {
            e.stopPropagation();
            const game = this.closest('.game-card').dataset.game;
            const mode = this.dataset.mode;
            startGame(game, mode);
        });
    });
    
    // AI Chat functionality
    setupAIChat();
});

function startGame(game, mode) {
    gameMode = mode;
    currentGame = game;
    showInterface(game + '-game');
    
    // Initialize the specific game
    setTimeout(() => {
        switch(game) {
            case 'snake':
                initSnakeGame();
                break;
            case 'subway':
                initSubwayGame();
                break;
            case 'chess':
                initChessGame(mode);
                break;
            case 'ludo':
                initLudoGame(mode);
                break;
            case 'minecraft':
                initMinecraftGame(mode);
                break;
            case 'roblox':
                initRobloxGame(mode);
                break;
        }
    }, 100);
}

// Snake Game Implementation
const snakeGame = {
    canvas: null,
    ctx: null,
    snake: [{x: 10, y: 10}],
    food: {x: 5, y: 5},
    dx: 0,
    dy: 0,
    score: 0,
    gameLoop: null,
    gridSize: 20,
    tileCount: 20
};

function initSnakeGame() {
    snakeGame.canvas = document.getElementById('snake-canvas');
    snakeGame.ctx = snakeGame.canvas.getContext('2d');
    
    // Reset game state
    snakeGame.snake = [{x: 10, y: 10}];
    snakeGame.food = {x: 5, y: 5};
    snakeGame.dx = 0;
    snakeGame.dy = 0;
    snakeGame.score = 0;
    document.getElementById('snake-score').textContent = snakeGame.score;
    
    // Set up controls
    document.addEventListener('keydown', handleSnakeInput);
    
    // Start game loop
    snakeGame.gameLoop = setInterval(updateSnake, 200);
    drawSnake();
}

function handleSnakeInput(e) {
    if (currentGame !== 'snake') return;
    
    const key = e.key;
    if (key === 'ArrowUp' || key === 'w') {
        if (snakeGame.dy === 0) { snakeGame.dx = 0; snakeGame.dy = -1; }
    } else if (key === 'ArrowDown' || key === 's') {
        if (snakeGame.dy === 0) { snakeGame.dx = 0; snakeGame.dy = 1; }
    } else if (key === 'ArrowLeft' || key === 'a') {
        if (snakeGame.dx === 0) { snakeGame.dx = -1; snakeGame.dy = 0; }
    } else if (key === 'ArrowRight' || key === 'd') {
        if (snakeGame.dx === 0) { snakeGame.dx = 1; snakeGame.dy = 0; }
    }
}

function updateSnake() {
    const head = {x: snakeGame.snake[0].x + snakeGame.dx, y: snakeGame.snake[0].y + snakeGame.dy};
    
    // Check wall collision
    if (head.x < 0 || head.x >= snakeGame.tileCount || head.y < 0 || head.y >= snakeGame.tileCount) {
        resetSnakeGame();
        return;
    }
    
    // Check self collision
    if (snakeGame.snake.some(segment => segment.x === head.x && segment.y === head.y)) {
        resetSnakeGame();
        return;
    }
    
    snakeGame.snake.unshift(head);
    
    // Check food collision
    if (head.x === snakeGame.food.x && head.y === snakeGame.food.y) {
        snakeGame.score++;
        document.getElementById('snake-score').textContent = snakeGame.score;
        generateFood();
    } else {
        snakeGame.snake.pop();
    }
    
    drawSnake();
}

function generateFood() {
    snakeGame.food.x = Math.floor(Math.random() * snakeGame.tileCount);
    snakeGame.food.y = Math.floor(Math.random() * snakeGame.tileCount);
}

function drawSnake() {
    snakeGame.ctx.fillStyle = '#000';
    snakeGame.ctx.fillRect(0, 0, snakeGame.canvas.width, snakeGame.canvas.height);
    
    // Draw snake
    snakeGame.ctx.fillStyle = '#4ecdc4';
    snakeGame.snake.forEach(segment => {
        snakeGame.ctx.fillRect(segment.x * snakeGame.gridSize, segment.y * snakeGame.gridSize, snakeGame.gridSize - 2, snakeGame.gridSize - 2);
    });
    
    // Draw food
    snakeGame.ctx.fillStyle = '#ff6b6b';
    snakeGame.ctx.fillRect(snakeGame.food.x * snakeGame.gridSize, snakeGame.food.y * snakeGame.gridSize, snakeGame.gridSize - 2, snakeGame.gridSize - 2);
}

function resetSnakeGame() {
    snakeGame.snake = [{x: 10, y: 10}];
    snakeGame.dx = 0;
    snakeGame.dy = 0;
    snakeGame.score = 0;
    document.getElementById('snake-score').textContent = snakeGame.score;
    generateFood();
}

// Subway Surfers Game Implementation
const subwayGame = {
    canvas: null,
    ctx: null,
    player: {x: 400, y: 500, width: 40, height: 60, lane: 1},
    obstacles: [],
    score: 0,
    speed: 2,
    gameLoop: null,
    keys: {}
};

function initSubwayGame() {
    subwayGame.canvas = document.getElementById('subway-canvas');
    subwayGame.ctx = subwayGame.canvas.getContext('2d');
    
    // Reset game state
    subwayGame.player = {x: 400, y: 500, width: 40, height: 60, lane: 1};
    subwayGame.obstacles = [];
    subwayGame.score = 0;
    subwayGame.speed = 2;
    document.getElementById('subway-score').textContent = subwayGame.score;
    
    // Set up controls
    document.addEventListener('keydown', handleSubwayInput);
    document.addEventListener('keyup', handleSubwayKeyUp);
    
    // Start game loop
    subwayGame.gameLoop = setInterval(updateSubway, 16);
}

function handleSubwayInput(e) {
    if (currentGame !== 'subway') return;
    subwayGame.keys[e.key] = true;
}

function handleSubwayKeyUp(e) {
    if (currentGame !== 'subway') return;
    subwayGame.keys[e.key] = false;
}

function updateSubway() {
    // Handle input
    if (subwayGame.keys['ArrowLeft'] && subwayGame.player.lane > 0) {
        subwayGame.player.lane--;
        subwayGame.player.x = 300 + subwayGame.player.lane * 100;
        subwayGame.keys['ArrowLeft'] = false;
    }
    if (subwayGame.keys['ArrowRight'] && subwayGame.player.lane < 2) {
        subwayGame.player.lane++;
        subwayGame.player.x = 300 + subwayGame.player.lane * 100;
        subwayGame.keys['ArrowRight'] = false;
    }
    if (subwayGame.keys[' '] && subwayGame.player.y === 500) {
        subwayGame.player.y = 400;
        setTimeout(() => { subwayGame.player.y = 500; }, 500);
    }
    
    // Generate obstacles
    if (Math.random() < 0.02) {
        subwayGame.obstacles.push({
            x: 300 + Math.floor(Math.random() * 3) * 100,
            y: -50,
            width: 80,
            height: 50
        });
    }
    
    // Update obstacles
    subwayGame.obstacles.forEach(obstacle => {
        obstacle.y += subwayGame.speed;
    });
    
    // Remove off-screen obstacles
    subwayGame.obstacles = subwayGame.obstacles.filter(obstacle => obstacle.y < 600);
    
    // Check collisions
    subwayGame.obstacles.forEach(obstacle => {
        if (subwayGame.player.x < obstacle.x + obstacle.width &&
            subwayGame.player.x + subwayGame.player.width > obstacle.x &&
            subwayGame.player.y < obstacle.y + obstacle.height &&
            subwayGame.player.y + subwayGame.player.height > obstacle.y) {
            resetSubwayGame();
        }
    });
    
    // Update score
    subwayGame.score++;
    document.getElementById('subway-score').textContent = Math.floor(subwayGame.score / 100);
    
    // Increase speed
    subwayGame.speed += 0.001;
    
    drawSubway();
}

function drawSubway() {
    // Clear canvas
    subwayGame.ctx.fillStyle = '#333';
    subwayGame.ctx.fillRect(0, 0, subwayGame.canvas.width, subwayGame.canvas.height);
    
    // Draw lanes
    subwayGame.ctx.strokeStyle = '#555';
    subwayGame.ctx.lineWidth = 2;
    for (let i = 1; i < 3; i++) {
        subwayGame.ctx.beginPath();
        subwayGame.ctx.moveTo(300 + i * 100, 0);
        subwayGame.ctx.lineTo(300 + i * 100, 600);
        subwayGame.ctx.stroke();
    }
    
    // Draw player
    subwayGame.ctx.fillStyle = '#4ecdc4';
    subwayGame.ctx.fillRect(subwayGame.player.x, subwayGame.player.y, subwayGame.player.width, subwayGame.player.height);
    
    // Draw obstacles
    subwayGame.ctx.fillStyle = '#ff6b6b';
    subwayGame.obstacles.forEach(obstacle => {
        subwayGame.ctx.fillRect(obstacle.x, obstacle.y, obstacle.width, obstacle.height);
    });
}

function resetSubwayGame() {
    subwayGame.player = {x: 400, y: 500, width: 40, height: 60, lane: 1};
    subwayGame.obstacles = [];
    subwayGame.score = 0;
    subwayGame.speed = 2;
    document.getElementById('subway-score').textContent = subwayGame.score;
}

// Chess Game Implementation
const chessGame = {
    board: null,
    selectedSquare: null,
    currentPlayer: 'white',
    gameMode: 'single',
    initialBoard: [
        ['♜','♞','♝','♛','♚','♝','♞','♜'],
        ['♟','♟','♟','♟','♟','♟','♟','♟'],
        [null,null,null,null,null,null,null,null],
        [null,null,null,null,null,null,null,null],
        [null,null,null,null,null,null,null,null],
        [null,null,null,null,null,null,null,null],
        ['♙','♙','♙','♙','♙','♙','♙','♙'],
        ['♖','♘','♗','♕','♔','♗','♘','♖']
    ]
};

function initChessGame(mode) {
    chessGame.gameMode = mode;
    chessGame.currentPlayer = 'white';
    chessGame.selectedSquare = null;
    document.getElementById('chess-mode').textContent = mode === 'single' ? 'Single Player' : '2 Players';
    document.getElementById('current-turn').textContent = 'White';
    
    // Initialize board
    chessGame.board = chessGame.initialBoard.map(row => [...row]);
    
    drawChessBoard();
}

function drawChessBoard() {
    const boardElement = document.getElementById('chess-board');
    boardElement.innerHTML = '';
    
    for (let row = 0; row < 8; row++) {
        for (let col = 0; col < 8; col++) {
            const square = document.createElement('div');
            square.className = `chess-square ${(row + col) % 2 === 0 ? 'light' : 'dark'}`;
            square.dataset.row = row;
            square.dataset.col = col;
            square.textContent = chessGame.board[row][col] || '';
            square.addEventListener('click', handleChessClick);
            boardElement.appendChild(square);
        }
    }
}

function handleChessClick(e) {
    const row = parseInt(e.target.dataset.row);
    const col = parseInt(e.target.dataset.col);
    
    if (chessGame.selectedSquare) {
        // Try to move piece
        const fromRow = chessGame.selectedSquare.row;
        const fromCol = chessGame.selectedSquare.col;
        
        if (isValidMove(fromRow, fromCol, row, col)) {
            chessGame.board[row][col] = chessGame.board[fromRow][fromCol];
            chessGame.board[fromRow][fromCol] = null;
            chessGame.currentPlayer = chessGame.currentPlayer === 'white' ? 'black' : 'white';
            document.getElementById('current-turn').textContent = chessGame.currentPlayer === 'white' ? 'White' : 'Black';
        }
        
        chessGame.selectedSquare = null;
        drawChessBoard();
    } else {
        // Select piece
        if (chessGame.board[row][col]) {
            chessGame.selectedSquare = {row, col};
            e.target.classList.add('selected');
        }
    }
}

function isValidMove(fromRow, fromCol, toRow, toCol) {
    // Basic validation (simplified)
    return fromRow !== toRow || fromCol !== toCol;
}

// Ludo Game Implementation
const ludoGame = {
    canvas: null,
    ctx: null,
    currentPlayer: 1,
    gameMode: 'single',
    diceValue: 0,
    players: [
        {color: '#ff6b6b', pieces: [{x: 50, y: 50}, {x: 100, y: 50}, {x: 50, y: 100}, {x: 100, y: 100}]},
        {color: '#4ecdc4', pieces: [{x: 450, y: 50}, {x: 500, y: 50}, {x: 450, y: 100}, {x: 500, y: 100}]},
        {color: '#ffd700', pieces: [{x: 450, y: 450}, {x: 500, y: 450}, {x: 450, y: 500}, {x: 500, y: 500}]},
        {color: '#8360c3', pieces: [{x: 50, y: 450}, {x: 100, y: 450}, {x: 50, y: 500}, {x: 100, y: 500}]}
    ]
};

function initLudoGame(mode) {
    ludoGame.canvas = document.getElementById('ludo-canvas');
    ludoGame.ctx = ludoGame.canvas.getContext('2d');
    ludoGame.gameMode = mode;
    ludoGame.currentPlayer = 1;
    ludoGame.diceValue = 0;
    
    document.getElementById('ludo-turn').textContent = ludoGame.currentPlayer;
    document.getElementById('dice-value').textContent = '-';
    
    // Set up dice roll
    document.getElementById('roll-dice').addEventListener('click', rollDice);
    
    drawLudoBoard();
}

function rollDice() {
    ludoGame.diceValue = Math.floor(Math.random() * 6) + 1;
    document.getElementById('dice-value').textContent = ludoGame.diceValue;
    
    // Switch player (simplified)
    setTimeout(() => {
        ludoGame.currentPlayer = ludoGame.currentPlayer === 1 ? 2 : 1;
        document.getElementById('ludo-turn').textContent = ludoGame.currentPlayer;
    }, 1000);
}

function drawLudoBoard() {
    // Clear canvas
    ludoGame.ctx.fillStyle = '#fff';
    ludoGame.ctx.fillRect(0, 0, ludoGame.canvas.width, ludoGame.canvas.height);
    
    // Draw board outline
    ludoGame.ctx.strokeStyle = '#333';
    ludoGame.ctx.lineWidth = 2;
    ludoGame.ctx.strokeRect(0, 0, 600, 600);
    
    // Draw player areas
    ludoGame.players.forEach((player, index) => {
        ludoGame.ctx.fillStyle = player.color;
        const x = index % 2 === 0 ? 25 : 425;
        const y = index < 2 ? 25 : 425;
        ludoGame.ctx.fillRect(x, y, 150, 150);
        
        // Draw pieces
        player.pieces.forEach(piece => {
            ludoGame.ctx.fillStyle = '#333';
            ludoGame.ctx.beginPath();
            ludoGame.ctx.arc(piece.x, piece.y, 15, 0, 2 * Math.PI);
            ludoGame.ctx.fill();
        });
    });
    
    // Draw center cross
    ludoGame.ctx.fillStyle = '#333';
    ludoGame.ctx.fillRect(200, 0, 200, 600);
    ludoGame.ctx.fillRect(0, 200, 600, 200);
}

// Minecraft Game Implementation
const minecraftGame = {
    canvas: null,
    ctx: null,
    world: [],
    selectedBlock: 'grass',
    blockSize: 32,
    worldWidth: 25,
    worldHeight: 19,
    isRunning: false
};

function initMinecraftGame(mode) {
    minecraftGame.canvas = document.getElementById('minecraft-canvas');
    minecraftGame.ctx = minecraftGame.canvas.getContext('2d');
    minecraftGame.isRunning = true;
    
    // Initialize world
    minecraftGame.world = [];
    for (let y = 0; y < minecraftGame.worldHeight; y++) {
        minecraftGame.world[y] = [];
        for (let x = 0; x < minecraftGame.worldWidth; x++) {
            minecraftGame.world[y][x] = y > 15 ? 'grass' : null;
        }
    }
    
    // Set up controls
    minecraftGame.canvas.addEventListener('click', handleMinecraftClick);
    minecraftGame.canvas.addEventListener('contextmenu', handleMinecraftRightClick);
    
    // Set up inventory
    document.querySelectorAll('.inventory-item').forEach(item => {
        item.addEventListener('click', function() {
            document.querySelectorAll('.inventory-item').forEach(i => i.classList.remove('active'));
            this.classList.add('active');
            minecraftGame.selectedBlock = this.dataset.block;
        });
    });
    
    drawMinecraftWorld();
}

function handleMinecraftClick(e) {
    const rect = minecraftGame.canvas.getBoundingClientRect();
    const x = Math.floor((e.clientX - rect.left) / minecraftGame.blockSize);
    const y = Math.floor((e.clientY - rect.top) / minecraftGame.blockSize);
    
    if (x >= 0 && x < minecraftGame.worldWidth && y >= 0 && y < minecraftGame.worldHeight) {
        minecraftGame.world[y][x] = minecraftGame.selectedBlock;
        drawMinecraftWorld();
    }
}

function handleMinecraftRightClick(e) {
    e.preventDefault();
    const rect = minecraftGame.canvas.getBoundingClientRect();
    const x = Math.floor((e.clientX - rect.left) / minecraftGame.blockSize);
    const y = Math.floor((e.clientY - rect.top) / minecraftGame.blockSize);
    
    if (x >= 0 && x < minecraftGame.worldWidth && y >= 0 && y < minecraftGame.worldHeight) {
        minecraftGame.world[y][x] = null;
        drawMinecraftWorld();
    }
}

function drawMinecraftWorld() {
    // Clear canvas
    minecraftGame.ctx.fillStyle = '#87CEEB';
    minecraftGame.ctx.fillRect(0, 0, minecraftGame.canvas.width, minecraftGame.canvas.height);
    
    // Draw blocks
    for (let y = 0; y < minecraftGame.worldHeight; y++) {
        for (let x = 0; x < minecraftGame.worldWidth; x++) {
            const block = minecraftGame.world[y][x];
            if (block) {
                switch(block) {
                    case 'grass':
                        minecraftGame.ctx.fillStyle = '#90EE90';
                        break;
                    case 'stone':
                        minecraftGame.ctx.fillStyle = '#808080';
                        break;
                    case 'wood':
                        minecraftGame.ctx.fillStyle = '#8B4513';
                        break;
                    case 'water':
                        minecraftGame.ctx.fillStyle = '#4169E1';
                        break;
                }
                minecraftGame.ctx.fillRect(x * minecraftGame.blockSize, y * minecraftGame.blockSize, minecraftGame.blockSize, minecraftGame.blockSize);
                
                // Draw block outline
                minecraftGame.ctx.strokeStyle = '#000';
                minecraftGame.ctx.lineWidth = 1;
                minecraftGame.ctx.strokeRect(x * minecraftGame.blockSize, y * minecraftGame.blockSize, minecraftGame.blockSize, minecraftGame.blockSize);
            }
        }
    }
}

// Roblox Game Implementation
const robloxGame = {
    canvas: null,
    ctx: null,
    player: {x: 400, y: 300, width: 40, height: 60, vx: 0, vy: 0},
    blocks: [],
    isRunning: false,
    keys: {}
};

function initRobloxGame(mode) {
    robloxGame.canvas = document.getElementById('roblox-canvas');
    robloxGame.ctx = robloxGame.canvas.getContext('2d');
    robloxGame.isRunning = true;
    
    // Initialize player
    robloxGame.player = {x: 400, y: 300, width: 40, height: 60, vx: 0, vy: 0};
    
    // Generate some blocks
    robloxGame.blocks = [];
    for (let i = 0; i < 20; i++) {
        robloxGame.blocks.push({
            x: Math.random() * 700,
            y: Math.random() * 500 + 100,
            width: 60,
            height: 60,
            color: `hsl(${Math.random() * 360}, 70%, 50%)`
        });
    }
    
    // Set up controls
    document.addEventListener('keydown', handleRobloxInput);
    document.addEventListener('keyup', handleRobloxKeyUp);
    
    // Start game loop
    robloxGame.gameLoop = setInterval(updateRoblox, 16);
    
    drawRobloxWorld();
}

function handleRobloxInput(e) {
    if (currentGame !== 'roblox') return;
    robloxGame.keys[e.key] = true;
}

function handleRobloxKeyUp(e) {
    if (currentGame !== 'roblox') return;
    robloxGame.keys[e.key] = false;
}

function updateRoblox() {
    if (!robloxGame.isRunning) return;
    
    // Handle input
    if (robloxGame.keys['w'] || robloxGame.keys['ArrowUp']) {
        robloxGame.player.vy = -2;
    } else if (robloxGame.keys['s'] || robloxGame.keys['ArrowDown']) {
        robloxGame.player.vy = 2;
    } else {
        robloxGame.player.vy = 0;
    }
    
    if (robloxGame.keys['a'] || robloxGame.keys['ArrowLeft']) {
        robloxGame.player.vx = -2;
    } else if (robloxGame.keys['d'] || robloxGame.keys['ArrowRight']) {
        robloxGame.player.vx = 2;
    } else {
        robloxGame.player.vx = 0;
    }
    
    // Update player position
    robloxGame.player.x += robloxGame.player.vx;
    robloxGame.player.y += robloxGame.player.vy;
    
    // Keep player in bounds
    robloxGame.player.x = Math.max(0, Math.min(robloxGame.canvas.width - robloxGame.player.width, robloxGame.player.x));
    robloxGame.player.y = Math.max(0, Math.min(robloxGame.canvas.height - robloxGame.player.height, robloxGame.player.y));
    
    drawRobloxWorld();
}

function drawRobloxWorld() {
    // Clear canvas
    robloxGame.ctx.fillStyle = '#87CEEB';
    robloxGame.ctx.fillRect(0, 0, robloxGame.canvas.width, robloxGame.canvas.height);
    
    // Draw blocks
    robloxGame.blocks.forEach(block => {
        robloxGame.ctx.fillStyle = block.color;
        robloxGame.ctx.fillRect(block.x, block.y, block.width, block.height);
        
        // Draw block outline
        robloxGame.ctx.strokeStyle = '#000';
        robloxGame.ctx.lineWidth = 2;
        robloxGame.ctx.strokeRect(block.x, block.y, block.width, block.height);
    });
    
    // Draw player
    robloxGame.ctx.fillStyle = '#ff6b6b';
    robloxGame.ctx.fillRect(robloxGame.player.x, robloxGame.player.y, robloxGame.player.width, robloxGame.player.height);
    
    // Draw player outline
    robloxGame.ctx.strokeStyle = '#000';
    robloxGame.ctx.lineWidth = 2;
    robloxGame.ctx.strokeRect(robloxGame.player.x, robloxGame.player.y, robloxGame.player.width, robloxGame.player.height);
}

// AI Chat Implementation
function setupAIChat() {
    const chatInput = document.getElementById('chat-input');
    const sendBtn = document.getElementById('send-btn');
    const chatMessages = document.getElementById('chat-messages');
    
    function sendMessage() {
        const message = chatInput.value.trim();
        if (message) {
            // Add user message
            const userMessage = document.createElement('div');
            userMessage.className = 'user-message';
            userMessage.innerHTML = `<strong>You:</strong> ${message}`;
            chatMessages.appendChild(userMessage);
            
            // Clear input
            chatInput.value = '';
            
            // Simulate AI response
            setTimeout(() => {
                const aiMessage = document.createElement('div');
                aiMessage.className = 'ai-message';
                aiMessage.innerHTML = `<strong>Simantas AI:</strong> ${generateAIResponse(message)}`;
                chatMessages.appendChild(aiMessage);
                
                // Scroll to bottom
                chatMessages.scrollTop = chatMessages.scrollHeight;
            }, 1000);
            
            // Scroll to bottom
            chatMessages.scrollTop = chatMessages.scrollHeight;
        }
    }
    
    sendBtn.addEventListener('click', sendMessage);
    chatInput.addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
            sendMessage();
        }
    });
}

function generateAIResponse(message) {
    const responses = [
        "That's interesting! I'm here to help with any game-related questions.",
        "Great question! Each game in the collection has unique features and controls.",
        "I can help you with strategies for any of the games. Which one are you playing?",
        "The Snake game is a classic! Try to plan your moves ahead to avoid getting trapped.",
        "For Chess, remember that controlling the center is usually a good strategy.",
        "Subway Surfers requires quick reflexes. Practice makes perfect!",
        "In Minecraft mode, you can build amazing structures with different blocks.",
        "Ludo is all about strategy and luck. Make sure to protect your pieces!",
        "The Roblox-style game lets you explore and move around freely.",
        "Would you like tips for any specific game? I'm here to help!"
    ];
    
    return responses[Math.floor(Math.random() * responses.length)];
}

// Initialize the application
document.addEventListener('DOMContentLoaded', function() {
    showInterface('main');
});