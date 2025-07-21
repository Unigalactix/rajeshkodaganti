// Multi-Game Center - Complete Game Collection
document.addEventListener('DOMContentLoaded', function() {
    // Modal and UI elements
    const gameModal = document.getElementById('gameModal');
    const openGameBtn = document.getElementById('gamesButton');
    const closeGameBtn = gameModal.querySelector('.game-close-btn');
    const fullscreenCloseBtn = document.getElementById('fullscreenCloseBtn');
    const gameSelection = document.getElementById('gameSelection');
    const gameInstructionsScreen = document.getElementById('gameInstructionsScreen');
    const gameContainer = document.getElementById('gameContainer');
    const backToMenu = document.getElementById('backToMenu');
    const currentGameTitle = document.getElementById('currentGameTitle');
    
    // Instruction screen elements
    const instructionGameTitle = document.getElementById('instructionGameTitle');
    const instructionGameIcon = document.getElementById('instructionGameIcon');
    const instructionText = document.getElementById('instructionText');
    const backToGamesBtn = document.getElementById('backToGamesBtn');
    const startGameBtn = document.getElementById('startGameBtn');
    const difficultyButtons = document.querySelectorAll('.difficulty-btn');
    
    // Game elements
    const gameCanvas = document.getElementById('gameCanvas');
    const ctx = gameCanvas.getContext('2d');
    const gameScore = document.getElementById('gameScore');
    const gameInstructions = document.getElementById('gameInstructions');
    const gameOverOverlay = document.getElementById('gameOverOverlay');
    const finalScore = document.getElementById('finalScore');
    const restartGameBtn = document.getElementById('restartGameBtn');
    
    // Game state
    let currentGame = null;
    let gameRunning = false;
    let selectedDifficulty = null;
    let gameDifficulty = null; // Store the difficulty used for the current game session
    let gameSpeeds = { slow: 0.5, normal: 1, fast: 1.5 };
    let animationId;
    let gameData = {};
    let playerScore = 0;
    
    // Game configurations
    const gameConfigs = {
        dino: {
            title: 'Dino Jump',
            icon: '🦕',
            instructions: 'Help the dinosaur survive by jumping over obstacles!',
            detailedInstructions: [
                '🎯 Objective: Jump over cacti and birds to survive as long as possible',
                '⌨️ Controls: Press SPACEBAR or CLICK to make the dino jump',
                '🏃 Speed: The game gets faster as you progress',
                '⭐ Scoring: Points increase the longer you survive'
            ],
            colors: { bg: '#87CEEB', ground: '#90EE90', player: '#2ecc71', obstacle: '#e74c3c' }
        },
        snake: {
            title: 'Snake',
            icon: '🐍',
            instructions: 'Control the snake to eat apples and grow longer!',
            detailedInstructions: [
                '🎯 Objective: Eat red apples to grow your snake and score points',
                '⌨️ Controls: Use ARROW KEYS (↑↓←→) to change direction',
                '🚫 Avoid: Don\'t hit walls or your own body',
                '⭐ Scoring: Each apple gives you points and makes you longer'
            ],
            colors: { bg: '#000', snake: '#0f0', food: '#f00', wall: '#fff' }
        },
        tetris: {
            title: 'Tetris',
            icon: '🧱',
            instructions: 'Stack falling blocks to complete horizontal lines!',
            detailedInstructions: [
                '🎯 Objective: Clear horizontal lines by filling them completely',
                '⌨️ Controls: ← → to move, ↑ to rotate, ↓ to drop faster',
                '🧩 Strategy: Plan ahead to avoid stacking too high',
                '⭐ Scoring: More points for clearing multiple lines at once'
            ],
            colors: { bg: '#000', blocks: ['#ff0', '#f0f', '#0ff', '#0f0', '#f80', '#00f', '#f00'] }
        },
        pong: {
            title: 'Pong',
            icon: '🏓',
            instructions: 'Classic paddle ball game - first to 10 points wins!',
            detailedInstructions: [
                '🎯 Objective: Hit the ball with your paddle to score against the computer',
                '⌨️ Controls: Use ↑ and ↓ arrow keys to move your paddle',
                '🏆 Win Condition: First player to reach 10 points wins',
                '⭐ Strategy: Try to hit the ball at different angles'
            ],
            colors: { bg: '#000', paddle: '#fff', ball: '#fff', text: '#fff' }
        },
        breakout: {
            title: 'Breakout',
            icon: '⚡',
            instructions: 'Use your paddle to break all the bricks!',
            detailedInstructions: [
                '🎯 Objective: Break all colored bricks by bouncing the ball',
                '⌨️ Controls: Use ← and → arrow keys to move your paddle',
                '🎱 Keep the ball in play by catching it with your paddle',
                '⭐ Scoring: Different colored bricks give different points'
            ],
            colors: { bg: '#000', paddle: '#fff', ball: '#fff', brick: '#f80' }
        },
        space: {
            title: 'Space Shooter',
            icon: '🚀',
            instructions: 'Pilot your spaceship and shoot down asteroids!',
            detailedInstructions: [
                '🎯 Objective: Destroy asteroids before they hit your spaceship',
                '⌨️ Controls: Arrow keys to move, SPACEBAR to shoot',
                '🛸 Avoid: Don\'t let asteroids crash into your ship',
                '⭐ Scoring: Larger asteroids give more points when destroyed'
            ],
            colors: { bg: '#000', player: '#0ff', bullet: '#ff0', enemy: '#f00' }
        },
        snakesladders: {
            title: 'Snakes & Ladders',
            icon: '🐍🪜',
            instructions: 'Race against the computer to reach square 100!',
            detailedInstructions: [
                '🎯 Objective: Be the first to reach square 100 on the board',
                '🎲 Gameplay: Click "Roll Dice" to move your piece',
                '🪜 Ladders: Climb up when you land on the bottom of a ladder',
                '🐍 Snakes: Slide down when you land on a snake\'s head',
                '🏆 Win Condition: First player to reach or pass square 100 wins!'
            ],
            colors: { bg: '#8B4513', board: '#F5E6D3', player1: '#FF6900', player2: '#2196F3', snake: '#e74c3c', ladder: '#8B4513' }
        },
        ludo: {
            title: 'Ludo',
            icon: '🎯',
            instructions: 'Move all your pieces home before the computer does!',
            detailedInstructions: [
                '🎯 Objective: Move all 4 of your pieces to the center home area',
                '🎲 Rules: Roll a 6 to start moving pieces from your base',
                '🏃 Movement: Move pieces clockwise around the board',
                '⚔️ Capture: Land on opponent pieces to send them back to base',
                '🏠 Safe Zones: Colored squares are safe from capture',
                '🏆 Win Condition: First to get all pieces home wins!'
            ],
            colors: { bg: '#2E7D32', board: '#FFF', player1: '#FF6900', player2: '#2196F3', safe: '#FFEB3B', home: '#4CAF50' }
        }
    };
    
    // Initialize modal
    console.log('Initializing game modal...');
    console.log('Game modal element:', gameModal);
    console.log('Open game button:', openGameBtn);
    console.log('Game selection element:', gameSelection);
    console.log('Game container element:', gameContainer);
    
    openGameBtn?.addEventListener('click', openGameModal);
    closeGameBtn?.addEventListener('click', closeGameModal);
    backToMenu?.addEventListener('click', showGameSelection);
    restartGameBtn?.addEventListener('click', restartCurrentGame);
    fullscreenCloseBtn?.addEventListener('click', showGameSelection);
    backToGamesBtn?.addEventListener('click', showGameSelection);
    startGameBtn?.addEventListener('click', startSelectedGame);
    
    // KRURA Games button handler
    const kruraGamesBtn = document.getElementById('kruraGamesButton');
    kruraGamesBtn?.addEventListener('click', () => {
        // Create and show coming soon modal
        showKruraGamesComingSoon();
    });
    
    // Game over overlay click to dismiss
    gameOverOverlay?.addEventListener('click', (e) => {
        if (e.target === gameOverOverlay) {
            gameOverOverlay.style.display = 'none';
        }
    });
    
    // Difficulty selection event listeners
    difficultyButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            // Remove selected class from all buttons
            difficultyButtons.forEach(b => b.classList.remove('selected'));
            // Add selected class to clicked button
            btn.classList.add('selected');
            selectedDifficulty = btn.dataset.speed;
            startGameBtn.disabled = false;
        });
    });
    
    // Handle ESC key for full-screen mode
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
            const modalBody = document.querySelector('.game-modal-body');
            if (modalBody && modalBody.classList.contains('game-active')) {
                showGameSelection();
            }
        }
    });
    
    // Game selection - Handle both card and button clicks
    document.querySelectorAll('.game-card').forEach(card => {
        card.addEventListener('click', (e) => {
            e.preventDefault();
            e.stopPropagation();
            const gameType = card.dataset.game;
            console.log('Showing instructions for game:', gameType);
            showGameInstructions(gameType);
        });
    });
    
    // Additional event listeners for the play buttons
    document.querySelectorAll('.select-game-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.preventDefault();
            e.stopPropagation();
            const gameCard = btn.closest('.game-card');
            const gameType = gameCard.dataset.game;
            console.log('Showing instructions for game via button:', gameType);
            showGameInstructions(gameType);
        });
    });
    
    function openGameModal() {
        console.log('Opening game modal...');
        if (gameModal) {
            gameModal.style.display = 'block';
            document.body.style.overflow = 'hidden';
            
            // Ensure game container is hidden initially
            if (gameContainer) {
                gameContainer.style.display = 'none';
                gameContainer.style.opacity = '0';
                gameContainer.style.pointerEvents = 'none';
            }
            
            // Force show game selection menu
            setTimeout(() => {
                showGameSelection();
            }, 100);
            
            console.log('Game modal opened successfully');
        } else {
            console.error('Game modal element not found!');
        }
    }
    
    function closeGameModal() {
        console.log('Closing game modal...');
        gameModal.style.display = 'none';
        document.body.style.overflow = 'auto';
        stopGame();
    }
    
    function showGameSelection() {
        console.log('Showing game selection menu...');
        
        // Remove game-active class from modal body
        const modalBody = document.querySelector('.game-modal-body');
        if (modalBody) {
            modalBody.classList.remove('game-active');
        }
        
        // Stop current game first
        stopGame();
        
        // Remove side-by-side layout class
        const layoutContainer = document.querySelector('.game-layout-container');
        if (layoutContainer) {
            layoutContainer.classList.remove('show-instructions');
            layoutContainer.style.display = 'flex'; // Show the layout container
        }
        
        // Hide all other screens immediately
        if (gameContainer) {
            gameContainer.style.display = 'none';
        }
        
        if (gameInstructionsScreen) {
            gameInstructionsScreen.style.display = 'none';
        }
        
        // Show game selection menu immediately
        if (gameSelection) {
            gameSelection.style.display = 'block';
            gameSelection.style.opacity = '1';
            gameSelection.style.pointerEvents = 'auto';
            console.log('Game selection display set to block');
        } else {
            console.error('Game selection element not found');
        }
        
        // Reset game state
        currentGame = null;
        selectedDifficulty = null;
        gameDifficulty = null; // Reset stored game difficulty
    }
    
    function showGameInstructions(gameType) {
        console.log('Showing instructions for game:', gameType);
        currentGame = gameType;
        const config = gameConfigs[gameType];
        
        // Reset difficulty selection
        selectedDifficulty = null;
        startGameBtn.disabled = true;
        difficultyButtons.forEach(btn => btn.classList.remove('selected'));
        
        // Update instruction screen content
        instructionGameTitle.textContent = config.title;
        instructionGameIcon.textContent = config.icon;
        instructionText.innerHTML = config.detailedInstructions.map(instruction => 
            `<div class="instruction-item">${instruction}</div>`
        ).join('');
        
        // Add the show-instructions class to enable side-by-side layout
        const layoutContainer = document.querySelector('.game-layout-container');
        if (layoutContainer) {
            layoutContainer.classList.add('show-instructions');
        }
        
        // Show instructions screen
        if (gameInstructionsScreen) {
            gameInstructionsScreen.style.display = 'block';
        }
    }
    
    function startSelectedGame() {
        console.log('Starting game with difficulty:', selectedDifficulty);
        
        // Store the difficulty for this game session
        if (selectedDifficulty) {
            gameDifficulty = selectedDifficulty;
        }
        
        // Immediate transition: hide instructions and start game
        if (gameInstructionsScreen) {
            gameInstructionsScreen.style.display = 'none';
        }
        
        // Start the actual game immediately
        startGame(currentGame);
    }
    
    function getDifficultyMultiplier() {
        // Use gameDifficulty if available (during restart), otherwise use selectedDifficulty
        const difficulty = gameDifficulty || selectedDifficulty || 'normal';
        const multiplier = gameSpeeds[difficulty] || 1;
        console.log(`Using difficulty: ${difficulty}, Speed multiplier: ${multiplier}`);
        return multiplier;
    }
    
    function startGame(gameType) {
        console.log('Starting game:', gameType);
        currentGame = gameType;
        const config = gameConfigs[gameType];
        
        // Add game-active class to modal body
        const modalBody = document.querySelector('.game-modal-body');
        if (modalBody) {
            modalBody.classList.add('game-active');
        }
        
        // Remove side-by-side layout class when starting game
        const layoutContainer = document.querySelector('.game-layout-container');
        if (layoutContainer) {
            layoutContainer.classList.remove('show-instructions');
            layoutContainer.style.display = 'none';
        }
        
        // Ensure all previous screens are hidden
        if (gameSelection) {
            gameSelection.style.display = 'none';
        }
        if (gameInstructionsScreen) {
            gameInstructionsScreen.style.display = 'none';
        }
        
        // Show game container immediately
        if (gameContainer) {
            gameContainer.style.display = 'flex';
            gameContainer.style.opacity = '1';
            gameContainer.style.pointerEvents = 'auto';
            console.log('Game container shown immediately');
        }
        
        // Update game UI
        if (currentGameTitle) {
            currentGameTitle.textContent = config.title;
        }
        if (gameInstructions) {
            gameInstructions.textContent = config.instructions;
        }
        
        // Reset game state
        playerScore = 0;
        updateScore();
        
        if (gameOverOverlay) {
            gameOverOverlay.style.display = 'none';
        }
        if (restartGameBtn) {
            restartGameBtn.style.display = 'none';
        }
        
        // Initialize specific game after transition
        setTimeout(() => {
            initializeGame(gameType);
        }, 100);
    }
    
    function initializeGame(gameType) {
        gameRunning = true;
        gameData = {};
        
        // Ensure proper canvas sizing after modal transition
        setTimeout(() => {
            if (gameCanvas) {
                // Force recalculate canvas dimensions
                const canvasContainer = gameCanvas.parentElement;
                const containerWidth = canvasContainer.offsetWidth - 10; // Account for margin
                const containerHeight = canvasContainer.offsetHeight - 130; // Account for header and controls
                
                gameCanvas.width = Math.max(containerWidth, 600);
                gameCanvas.height = Math.max(containerHeight, 400);
                
                console.log(`Canvas resized to: ${gameCanvas.width}x${gameCanvas.height}`);
            }
        }, 150);
        
        // Set initial canvas size
        if (gameCanvas) {
            gameCanvas.width = gameCanvas.offsetWidth || 600;
            gameCanvas.height = gameCanvas.offsetHeight || 400;
        }
        
        switch(gameType) {
            case 'dino':
                initDinoGame();
                break;
            case 'snake':
                initSnakeGame();
                break;
            case 'tetris':
                initTetrisGame();
                break;
            case 'pong':
                initPongGame();
                break;
            case 'breakout':
                initBreakoutGame();
                break;
            case 'space':
                initSpaceGame();
                break;
            case 'snakesladders':
                initSnakesLaddersGame();
                break;
            case 'ludo':
                initLudoGame();
                break;
        }
        
        gameLoop();
    }
    
    // DINO GAME
    function initDinoGame() {
        const speedMultiplier = getDifficultyMultiplier();
        gameData = {
            dino: { x: 50, y: gameCanvas.height - 100, width: 40, height: 40, velocityY: 0, jumping: false },
            obstacles: [],
            clouds: [],
            speed: 3 * speedMultiplier,
            spawnRate: 0.008 * (speedMultiplier > 1 ? speedMultiplier * 0.8 : speedMultiplier)
        };
        
        // Add clouds
        for (let i = 0; i < 5; i++) {
            gameData.clouds.push({
                x: Math.random() * gameCanvas.width,
                y: Math.random() * (gameCanvas.height * 0.3),
                width: 30 + Math.random() * 20,
                height: 15 + Math.random() * 10,
                speed: (0.5 + Math.random() * 0.5) * speedMultiplier
            });
        }
    }
    
    function updateDinoGame() {
        const { dino, obstacles, clouds, speed, spawnRate } = gameData;
        
        // Update dino physics
        if (dino.jumping) {
            dino.velocityY -= 0.8;
            dino.y -= dino.velocityY;
            
            if (dino.y >= gameCanvas.height - 100) {
                dino.y = gameCanvas.height - 100;
                dino.velocityY = 0;
                dino.jumping = false;
            }
        }
        
        // Spawn obstacles
        if (Math.random() < spawnRate) {
            obstacles.push({
                x: gameCanvas.width,
                y: gameCanvas.height - 80,
                width: 20 + Math.random() * 20,
                height: 40 + Math.random() * 20
            });
        }
        
        // Update obstacles and check collisions
        for (let i = obstacles.length - 1; i >= 0; i--) {
            obstacles[i].x -= speed;
            
            if (obstacles[i].x + obstacles[i].width < 0) {
                obstacles.splice(i, 1);
                playerScore += 10;
            } else if (checkCollision(dino, obstacles[i])) {
                endGame();
                return;
            }
        }
        
        // Update clouds
        clouds.forEach(cloud => {
            cloud.x -= cloud.speed;
            if (cloud.x + cloud.width < 0) {
                cloud.x = gameCanvas.width;
            }
        });
        
        playerScore += 0.1;
    }
    
    function drawDinoGame() {
        const config = gameConfigs.dino;
        const { dino, obstacles, clouds } = gameData;
        
        // Clear canvas
        ctx.fillStyle = config.colors.bg;
        ctx.fillRect(0, 0, gameCanvas.width, gameCanvas.height);
        
        // Draw ground
        ctx.fillStyle = config.colors.ground;
        ctx.fillRect(0, gameCanvas.height - 60, gameCanvas.width, 60);
        
        // Draw clouds
        ctx.fillStyle = '#fff';
        clouds.forEach(cloud => {
            drawCloud(cloud.x, cloud.y, cloud.width, cloud.height);
        });
        
        // Draw dino
        ctx.fillStyle = config.colors.player;
        ctx.fillRect(dino.x, dino.y, dino.width, dino.height);
        
        // Draw obstacles
        ctx.fillStyle = config.colors.obstacle;
        obstacles.forEach(obstacle => {
            ctx.fillRect(obstacle.x, obstacle.y, obstacle.width, obstacle.height);
        });
    }
    
    // SNAKE GAME
    function initSnakeGame() {
        const gridSize = 20;
        gameData = {
            snake: [{ x: 200, y: 200 }],
            direction: { x: gridSize, y: 0 },
            food: { x: 300, y: 300 },
            gridSize: gridSize
        };
        generateFood();
    }
    
    function updateSnakeGame() {
        const { snake, direction, food, gridSize } = gameData;
        const head = { x: snake[0].x + direction.x, y: snake[0].y + direction.y };
        
        // Check wall collision
        if (head.x < 0 || head.x >= gameCanvas.width || head.y < 0 || head.y >= gameCanvas.height) {
            endGame();
            return;
        }
        
        // Check self collision
        if (snake.some(segment => segment.x === head.x && segment.y === head.y)) {
            endGame();
            return;
        }
        
        snake.unshift(head);
        
        // Check food collision
        if (head.x === food.x && head.y === food.y) {
            playerScore += 100;
            generateFood();
        } else {
            snake.pop();
        }
    }
    
    function drawSnakeGame() {
        const config = gameConfigs.snake;
        const { snake, food } = gameData;
        
        // Clear canvas
        ctx.fillStyle = config.colors.bg;
        ctx.fillRect(0, 0, gameCanvas.width, gameCanvas.height);
        
        // Draw snake
        ctx.fillStyle = config.colors.snake;
        snake.forEach(segment => {
            ctx.fillRect(segment.x, segment.y, gameData.gridSize, gameData.gridSize);
        });
        
        // Draw food
        ctx.fillStyle = config.colors.food;
        ctx.fillRect(food.x, food.y, gameData.gridSize, gameData.gridSize);
    }
    
    function generateFood() {
        const gridSize = gameData.gridSize;
        gameData.food = {
            x: Math.floor(Math.random() * (gameCanvas.width / gridSize)) * gridSize,
            y: Math.floor(Math.random() * (gameCanvas.height / gridSize)) * gridSize
        };
    }
    
    // TETRIS GAME
    function initTetrisGame() {
        gameData = {
            board: Array(20).fill().map(() => Array(10).fill(0)),
            currentPiece: null,
            nextPiece: null,
            dropTime: 0,
            dropInterval: 1000
        };
        spawnPiece();
    }
    
    function updateTetrisGame() {
        gameData.dropTime += 16; // Assuming 60fps
        
        if (gameData.dropTime > gameData.dropInterval) {
            if (!movePiece(0, 1)) {
                placePiece();
                clearLines();
                spawnPiece();
                if (isGameOver()) {
                    endGame();
                    return;
                }
            }
            gameData.dropTime = 0;
        }
    }
    
    function drawTetrisGame() {
        const config = gameConfigs.tetris;
        const { board, currentPiece } = gameData;
        
        // Clear canvas
        ctx.fillStyle = config.colors.bg;
        ctx.fillRect(0, 0, gameCanvas.width, gameCanvas.height);
        
        // Draw board
        const blockSize = Math.min(gameCanvas.width / 10, gameCanvas.height / 20);
        
        for (let y = 0; y < board.length; y++) {
            for (let x = 0; x < board[y].length; x++) {
                if (board[y][x]) {
                    ctx.fillStyle = config.colors.blocks[board[y][x] - 1];
                    ctx.fillRect(x * blockSize, y * blockSize, blockSize, blockSize);
                }
            }
        }
        
        // Draw current piece
        if (currentPiece) {
            ctx.fillStyle = config.colors.blocks[currentPiece.color];
            currentPiece.shape.forEach((row, y) => {
                row.forEach((cell, x) => {
                    if (cell) {
                        ctx.fillRect((currentPiece.x + x) * blockSize, (currentPiece.y + y) * blockSize, blockSize, blockSize);
                    }
                });
            });
        }
    }
    
    // PONG GAME
    function initPongGame() {
        const speedMultiplier = getDifficultyMultiplier();
        gameData = {
            leftPaddle: { x: 20, y: gameCanvas.height / 2 - 50, width: 10, height: 100, speed: 5 * speedMultiplier },
            rightPaddle: { x: gameCanvas.width - 30, y: gameCanvas.height / 2 - 50, width: 10, height: 100, speed: 5 * speedMultiplier },
            ball: { x: gameCanvas.width / 2, y: gameCanvas.height / 2, dx: 5 * speedMultiplier, dy: 3 * speedMultiplier, radius: 8 },
            leftScore: 0,
            rightScore: 0
        };
    }
    
    function updatePongGame() {
        const { leftPaddle, rightPaddle, ball } = gameData;
        
        // Move ball
        ball.x += ball.dx;
        ball.y += ball.dy;
        
        // Ball collision with top/bottom
        if (ball.y <= ball.radius || ball.y >= gameCanvas.height - ball.radius) {
            ball.dy = -ball.dy;
        }
        
        // Paddle collisions
        if (ball.x <= leftPaddle.x + leftPaddle.width && 
            ball.y >= leftPaddle.y && ball.y <= leftPaddle.y + leftPaddle.height) {
            ball.dx = -ball.dx;
        }
        
        if (ball.x >= rightPaddle.x && 
            ball.y >= rightPaddle.y && ball.y <= rightPaddle.y + rightPaddle.height) {
            ball.dx = -ball.dx;
        }
        
        // Score
        if (ball.x < 0) {
            gameData.rightScore++;
            resetBall();
        } else if (ball.x > gameCanvas.width) {
            gameData.leftScore++;
            resetBall();
        }
        
        playerScore = gameData.leftScore * 100;
        
        // AI for right paddle
        const paddleCenter = rightPaddle.y + rightPaddle.height / 2;
        if (paddleCenter < ball.y - 35) {
            rightPaddle.y += rightPaddle.speed;
        } else if (paddleCenter > ball.y + 35) {
            rightPaddle.y -= rightPaddle.speed;
        }
        
        // Check win condition
        if (gameData.leftScore >= 10 || gameData.rightScore >= 10) {
            endGame();
        }
    }
    
    function drawPongGame() {
        const config = gameConfigs.pong;
        const { leftPaddle, rightPaddle, ball } = gameData;
        
        // Clear canvas
        ctx.fillStyle = config.colors.bg;
        ctx.fillRect(0, 0, gameCanvas.width, gameCanvas.height);
        
        // Draw paddles
        ctx.fillStyle = config.colors.paddle;
        ctx.fillRect(leftPaddle.x, leftPaddle.y, leftPaddle.width, leftPaddle.height);
        ctx.fillRect(rightPaddle.x, rightPaddle.y, rightPaddle.width, rightPaddle.height);
        
        // Draw ball
        ctx.fillStyle = config.colors.ball;
        ctx.beginPath();
        ctx.arc(ball.x, ball.y, ball.radius, 0, Math.PI * 2);
        ctx.fill();
        
        // Draw scores
        ctx.fillStyle = config.colors.text;
        ctx.font = '24px Arial';
        ctx.fillText(gameData.leftScore, gameCanvas.width / 4, 40);
        ctx.fillText(gameData.rightScore, 3 * gameCanvas.width / 4, 40);
        
        // Draw center line
        ctx.setLineDash([5, 5]);
        ctx.strokeStyle = config.colors.text;
        ctx.beginPath();
        ctx.moveTo(gameCanvas.width / 2, 0);
        ctx.lineTo(gameCanvas.width / 2, gameCanvas.height);
        ctx.stroke();
        ctx.setLineDash([]);
    }
    
    // BREAKOUT GAME
    function initBreakoutGame() {
        const speedMultiplier = getDifficultyMultiplier();
        const bricks = [];
        for (let row = 0; row < 5; row++) {
            for (let col = 0; col < 10; col++) {
                bricks.push({
                    x: col * 60 + 5,
                    y: row * 20 + 30,
                    width: 55,
                    height: 15,
                    active: true
                });
            }
        }
        
        gameData = {
            paddle: { x: gameCanvas.width / 2 - 50, y: gameCanvas.height - 30, width: 100, height: 10, speed: 8 * speedMultiplier },
            ball: { x: gameCanvas.width / 2, y: gameCanvas.height - 50, dx: 4 * speedMultiplier, dy: -4 * speedMultiplier, radius: 8 },
            bricks: bricks
        };
    }
    
    function updateBreakoutGame() {
        const { paddle, ball, bricks } = gameData;
        
        // Move ball
        ball.x += ball.dx;
        ball.y += ball.dy;
        
        // Ball collision with walls
        if (ball.x <= ball.radius || ball.x >= gameCanvas.width - ball.radius) {
            ball.dx = -ball.dx;
        }
        if (ball.y <= ball.radius) {
            ball.dy = -ball.dy;
        }
        
        // Ball collision with paddle
        if (ball.y + ball.radius >= paddle.y && 
            ball.x >= paddle.x && ball.x <= paddle.x + paddle.width) {
            ball.dy = -ball.dy;
        }
        
        // Ball collision with bricks
        bricks.forEach(brick => {
            if (brick.active && 
                ball.x >= brick.x && ball.x <= brick.x + brick.width &&
                ball.y >= brick.y && ball.y <= brick.y + brick.height) {
                ball.dy = -ball.dy;
                brick.active = false;
                playerScore += 50;
            }
        });
        
        // Check win condition
        if (bricks.every(brick => !brick.active)) {
            endGame();
        }
        
        // Check lose condition
        if (ball.y > gameCanvas.height) {
            endGame();
        }
    }
    
    function drawBreakoutGame() {
        const config = gameConfigs.breakout;
        const { paddle, ball, bricks } = gameData;
        
        // Clear canvas
        ctx.fillStyle = config.colors.bg;
        ctx.fillRect(0, 0, gameCanvas.width, gameCanvas.height);
        
        // Draw paddle
        ctx.fillStyle = config.colors.paddle;
        ctx.fillRect(paddle.x, paddle.y, paddle.width, paddle.height);
        
        // Draw ball
        ctx.fillStyle = config.colors.ball;
        ctx.beginPath();
        ctx.arc(ball.x, ball.y, ball.radius, 0, Math.PI * 2);
        ctx.fill();
        
        // Draw bricks
        ctx.fillStyle = config.colors.brick;
        bricks.forEach(brick => {
            if (brick.active) {
                ctx.fillRect(brick.x, brick.y, brick.width, brick.height);
            }
        });
    }
    
    // SPACE SHOOTER GAME
    function initSpaceGame() {
        const speedMultiplier = getDifficultyMultiplier();
        gameData = {
            player: { x: gameCanvas.width / 2 - 15, y: gameCanvas.height - 50, width: 30, height: 30, speed: 6 * speedMultiplier },
            bullets: [],
            enemies: [],
            stars: [],
            enemySpawnRate: 0.02 * (speedMultiplier > 1 ? speedMultiplier * 0.8 : speedMultiplier)
        };
        
        // Generate stars
        for (let i = 0; i < 50; i++) {
            gameData.stars.push({
                x: Math.random() * gameCanvas.width,
                y: Math.random() * gameCanvas.height,
                speed: (Math.random() * 2 + 1) * speedMultiplier
            });
        }
    }
    
    function updateSpaceGame() {
        const { player, bullets, enemies, stars, enemySpawnRate } = gameData;
        
        // Update bullets
        for (let i = bullets.length - 1; i >= 0; i--) {
            bullets[i].y -= 8;
            if (bullets[i].y < 0) {
                bullets.splice(i, 1);
            }
        }
        
        // Update enemies
        for (let i = enemies.length - 1; i >= 0; i--) {
            enemies[i].y += enemies[i].speed;
            if (enemies[i].y > gameCanvas.height) {
                enemies.splice(i, 1);
            }
        }
        
        // Spawn enemies
        if (Math.random() < enemySpawnRate) {
            enemies.push({
                x: Math.random() * (gameCanvas.width - 30),
                y: -30,
                width: 30,
                height: 30,
                speed: (Math.random() * 3 + 2) * getDifficultyMultiplier()
            });
        }
        
        // Check bullet-enemy collisions
        for (let i = bullets.length - 1; i >= 0; i--) {
            for (let j = enemies.length - 1; j >= 0; j--) {
                if (checkCollision(bullets[i], enemies[j])) {
                    bullets.splice(i, 1);
                    enemies.splice(j, 1);
                    playerScore += 100;
                    break;
                }
            }
        }
        
        // Check player-enemy collisions
        enemies.forEach(enemy => {
            if (checkCollision(player, enemy)) {
                endGame();
            }
        });
        
        // Update stars
        stars.forEach(star => {
            star.y += star.speed;
            if (star.y > gameCanvas.height) {
                star.y = 0;
                star.x = Math.random() * gameCanvas.width;
            }
        });
    }
    
    function drawSpaceGame() {
        const config = gameConfigs.space;
        const { player, bullets, enemies, stars } = gameData;
        
        // Clear canvas
        ctx.fillStyle = config.colors.bg;
        ctx.fillRect(0, 0, gameCanvas.width, gameCanvas.height);
        
        // Draw stars
        ctx.fillStyle = '#fff';
        stars.forEach(star => {
            ctx.fillRect(star.x, star.y, 2, 2);
        });
        
        // Draw player
        ctx.fillStyle = config.colors.player;
        ctx.fillRect(player.x, player.y, player.width, player.height);
        
        // Draw bullets
        ctx.fillStyle = config.colors.bullet;
        bullets.forEach(bullet => {
            ctx.fillRect(bullet.x, bullet.y, bullet.width, bullet.height);
        });
        
        // Draw enemies
        ctx.fillStyle = config.colors.enemy;
        enemies.forEach(enemy => {
            ctx.fillRect(enemy.x, enemy.y, enemy.width, enemy.height);
        });
    }

    // SNAKES & LADDERS GAME
    function initSnakesLaddersGame() {
        gameData = {
            board: createSnakesLaddersBoard(),
            players: [
                { position: 0, color: gameConfigs.snakesladders.colors.player1, name: 'You' },
                { position: 0, color: gameConfigs.snakesladders.colors.player2, name: 'Computer' }
            ],
            currentPlayer: 0,
            diceValue: 0,
            gameOver: false,
            winner: null,
            message: 'Your turn! Click "Roll Dice"',
            showDice: true
        };
        
        createSnakesLaddersUI();
        drawSnakesLaddersGame();
    }
    
    function createSnakesLaddersBoard() {
        const snakes = {
            16: 6, 47: 26, 49: 11, 56: 53, 62: 19, 64: 60, 87: 24, 93: 73, 95: 75, 98: 78
        };
        const ladders = {
            1: 38, 4: 14, 9: 21, 21: 42, 28: 84, 36: 44, 51: 67, 71: 91, 80: 100
        };
        return { snakes, ladders };
    }
    
    function createSnakesLaddersUI() {
        const gameArea = document.querySelector('.game-area');
        if (gameArea) {
            gameArea.innerHTML = `
                <div style="text-align: center; margin: 20px 0;">
                    <div id="snl-message" style="font-size: 18px; margin-bottom: 15px; color: #FF6900; font-weight: bold;">${gameData.message}</div>
                    <div style="display: flex; justify-content: center; align-items: center; gap: 20px; margin-bottom: 15px;">
                        <div style="background: linear-gradient(45deg, #FF6900, #ff8533); padding: 10px 15px; border-radius: 15px; color: white; font-weight: bold;">
                            You: Position ${gameData.players[0].position}
                        </div>
                        <div style="background: linear-gradient(45deg, #2196F3, #4FC3F7); padding: 10px 15px; border-radius: 15px; color: white; font-weight: bold;">
                            Computer: Position ${gameData.players[1].position}
                        </div>
                    </div>
                    <button id="snl-roll-dice" onclick="rollDiceSnakesLadders()" style="
                        background: linear-gradient(45deg, #FF6900, #ff8533);
                        color: white;
                        border: none;
                        padding: 15px 30px;
                        border-radius: 25px;
                        font-size: 18px;
                        font-weight: bold;
                        cursor: pointer;
                        box-shadow: 0 6px 20px rgba(255, 105, 0, 0.3);
                        margin-bottom: 15px;
                        transition: all 0.3s ease;
                        ${gameData.currentPlayer === 1 || gameData.gameOver ? 'opacity: 0.5; cursor: not-allowed;' : ''}
                    " ${gameData.currentPlayer === 1 || gameData.gameOver ? 'disabled' : ''}>
                        🎲 Roll Dice
                    </button>
                    <div id="snl-dice" style="font-size: 50px; margin: 15px 0; text-shadow: 2px 2px 4px rgba(0,0,0,0.3);">🎲</div>
                    <div id="game-tips" style="font-size: 12px; color: #666; margin-top: 10px;">
                        🐍 Red squares have snakes • 🪜 Green squares have ladders • 👑 Reach 100 to win!
                    </div>
                </div>
            `;
        }
    }
    
    function rollDiceSnakesLadders() {
        if (gameData.gameOver) return;
        
        gameData.diceValue = Math.floor(Math.random() * 6) + 1;
        document.getElementById('snl-dice').textContent = getDiceEmoji(gameData.diceValue);
        
        setTimeout(() => {
            movePlayerSnakesLadders(gameData.currentPlayer, gameData.diceValue);
        }, 1000);
    }
    
    function getDiceEmoji(value) {
        const diceEmojis = ['⚀', '⚁', '⚂', '⚃', '⚄', '⚅'];
        return diceEmojis[value - 1];
    }
    
    function movePlayerSnakesLadders(playerIndex, steps) {
        const player = gameData.players[playerIndex];
        const newPosition = Math.min(player.position + steps, 100);
        player.position = newPosition;
        
        // Check for snakes and ladders
        if (gameData.board.snakes[newPosition]) {
            setTimeout(() => {
                player.position = gameData.board.snakes[newPosition];
                gameData.message = `${player.name} hit a snake! Sliding down to ${player.position}`;
                updateSnakesLaddersUI();
                drawSnakesLaddersGame();
            }, 1000);
        } else if (gameData.board.ladders[newPosition]) {
            setTimeout(() => {
                player.position = gameData.board.ladders[newPosition];
                gameData.message = `${player.name} found a ladder! Climbing up to ${player.position}`;
                updateSnakesLaddersUI();
                drawSnakesLaddersGame();
            }, 1000);
        }
        
        // Check for win
        if (player.position >= 100) {
            gameData.gameOver = true;
            gameData.winner = playerIndex;
            gameData.message = `${player.name} wins! 🎉`;
            updateSnakesLaddersUI();
            setTimeout(() => endGame(), 2000);
            return;
        }
        
        // Switch players
        gameData.currentPlayer = (gameData.currentPlayer + 1) % 2;
        gameData.message = gameData.currentPlayer === 0 ? 'Your turn! Click "Roll Dice"' : 'Computer\'s turn...';
        updateSnakesLaddersUI();
        drawSnakesLaddersGame();
        
        // Computer turn
        if (gameData.currentPlayer === 1 && !gameData.gameOver) {
            setTimeout(() => {
                rollDiceSnakesLadders();
            }, 1500);
        }
    }
    
    function updateSnakesLaddersUI() {
        const messageEl = document.getElementById('snl-message');
        const rollBtn = document.getElementById('snl-roll-dice');
        
        if (messageEl) messageEl.textContent = gameData.message;
        if (rollBtn) {
            rollBtn.disabled = gameData.currentPlayer === 1 || gameData.gameOver;
            rollBtn.style.opacity = rollBtn.disabled ? '0.5' : '1';
            rollBtn.style.cursor = rollBtn.disabled ? 'not-allowed' : 'pointer';
        }
        
        // Update position displays
        const playerPositions = document.querySelectorAll('[style*="You: Position"], [style*="Computer: Position"]');
        playerPositions.forEach((el, index) => {
            const position = gameData.players[index].position;
            el.innerHTML = `${index === 0 ? 'You' : 'Computer'}: Position ${position}`;
        });
    }
    
    function drawSnakesLaddersGame() {
        const config = gameConfigs.snakesladders;
        
        // Enhanced background with gradient
        const gradient = ctx.createLinearGradient(0, 0, gameCanvas.width, gameCanvas.height);
        gradient.addColorStop(0, '#1a1a1a');
        gradient.addColorStop(1, '#2d2d2d');
        ctx.fillStyle = gradient;
        ctx.fillRect(0, 0, gameCanvas.width, gameCanvas.height);
        
        const boardSize = 10;
        const cellSize = Math.min(gameCanvas.width * 0.85, gameCanvas.height * 0.85) / boardSize;
        const startX = (gameCanvas.width - cellSize * boardSize) / 2;
        const startY = (gameCanvas.height - cellSize * boardSize) / 2;
        
        // Draw board with enhanced styling
        ctx.shadowColor = 'rgba(0, 0, 0, 0.3)';
        ctx.shadowBlur = 10;
        ctx.shadowOffsetX = 2;
        ctx.shadowOffsetY = 2;
        
        for (let row = 0; row < boardSize; row++) {
            for (let col = 0; col < boardSize; col++) {
                const x = startX + col * cellSize;
                const y = startY + (boardSize - 1 - row) * cellSize;
                
                // Enhanced checkerboard pattern with gradients
                const cellGradient = ctx.createRadialGradient(
                    x + cellSize/2, y + cellSize/2, 0,
                    x + cellSize/2, y + cellSize/2, cellSize/2
                );
                if ((row + col) % 2 === 0) {
                    cellGradient.addColorStop(0, '#FFE4B5');
                    cellGradient.addColorStop(1, '#DEB887');
                } else {
                    cellGradient.addColorStop(0, '#F0E68C');
                    cellGradient.addColorStop(1, '#DAA520');
                }
                ctx.fillStyle = cellGradient;
                ctx.fillRect(x, y, cellSize, cellSize);
                
                // Cell border
                ctx.strokeStyle = '#8B4513';
                ctx.lineWidth = 1;
                ctx.strokeRect(x, y, cellSize, cellSize);
                
                // Square number with enhanced styling
                const squareNum = row % 2 === 0 ? 
                    row * boardSize + col + 1 : 
                    row * boardSize + (boardSize - col);
                
                // Number background circle
                ctx.fillStyle = 'rgba(255, 255, 255, 0.8)';
                ctx.beginPath();
                ctx.arc(x + cellSize * 0.85, y + cellSize * 0.15, cellSize * 0.12, 0, 2 * Math.PI);
                ctx.fill();
                
                // Number text
                ctx.fillStyle = '#000';
                ctx.font = `bold ${cellSize * 0.12}px Arial`;
                ctx.textAlign = 'center';
                ctx.fillText(squareNum, x + cellSize * 0.85, y + cellSize * 0.19);
                
                // Special square highlights
                if (gameData.board.snakes[squareNum]) {
                    // Snake head square - red glow
                    ctx.fillStyle = 'rgba(231, 76, 60, 0.3)';
                    ctx.fillRect(x, y, cellSize, cellSize);
                }
                if (gameData.board.ladders[squareNum]) {
                    // Ladder start square - green glow
                    ctx.fillStyle = 'rgba(46, 204, 113, 0.3)';
                    ctx.fillRect(x, y, cellSize, cellSize);
                }
                if (squareNum === 100) {
                    // Victory square - gold glow
                    ctx.fillStyle = 'rgba(241, 196, 15, 0.4)';
                    ctx.fillRect(x, y, cellSize, cellSize);
                    // Crown emoji for finish
                    ctx.font = `${cellSize * 0.4}px Arial`;
                    ctx.fillText('👑', x + cellSize/2, y + cellSize/2);
                }
            }
        }
        
        // Reset shadow for snakes and ladders
        ctx.shadowColor = 'transparent';
        ctx.shadowBlur = 0;
        ctx.shadowOffsetX = 0;
        ctx.shadowOffsetY = 0;
        
        // Draw snakes and ladders with enhanced visuals
        Object.entries(gameData.board.snakes).forEach(([start, end]) => {
            drawEnhancedSnake(parseInt(start), parseInt(end), startX, startY, cellSize, boardSize);
        });
        
        Object.entries(gameData.board.ladders).forEach(([start, end]) => {
            drawEnhancedLadder(parseInt(start), parseInt(end), startX, startY, cellSize, boardSize);
        });
        
        // Draw players with enhanced pieces
        gameData.players.forEach((player, index) => {
            if (player.position > 0) {
                drawEnhancedPlayerPiece(player.position, player.color, startX, startY, cellSize, boardSize, index, player.name);
            }
        });
        
        // Draw board title
        ctx.fillStyle = '#FF6900';
        ctx.font = 'bold 24px Arial';
        ctx.textAlign = 'center';
        ctx.fillText('🐍🪜 SNAKES & LADDERS 🪜🐍', gameCanvas.width/2, 30);
    }
    
    function drawEnhancedSnake(start, end, startX, startY, cellSize, boardSize) {
        const startPos = getPositionCoords(start, startX, startY, cellSize, boardSize);
        const endPos = getPositionCoords(end, startX, startY, cellSize, boardSize);
        
        // Draw snake body with curves
        const controlX = (startPos.x + endPos.x) / 2 + (Math.random() - 0.5) * 50;
        const controlY = (startPos.y + endPos.y) / 2 + (Math.random() - 0.5) * 50;
        
        // Snake body gradient
        const gradient = ctx.createLinearGradient(startPos.x, startPos.y, endPos.x, endPos.y);
        gradient.addColorStop(0, '#e74c3c');
        gradient.addColorStop(0.5, '#c0392b');
        gradient.addColorStop(1, '#a93226');
        
        ctx.strokeStyle = gradient;
        ctx.lineWidth = 8;
        ctx.lineCap = 'round';
        ctx.beginPath();
        ctx.moveTo(startPos.x, startPos.y);
        ctx.quadraticCurveTo(controlX, controlY, endPos.x, endPos.y);
        ctx.stroke();
        
        // Snake pattern (scales)
        const segments = 6;
        for (let i = 0; i <= segments; i++) {
            const t = i / segments;
            const x = startPos.x * (1-t) * (1-t) + 2 * controlX * (1-t) * t + endPos.x * t * t;
            const y = startPos.y * (1-t) * (1-t) + 2 * controlY * (1-t) * t + endPos.y * t * t;
            
            ctx.fillStyle = i % 2 === 0 ? '#2c3e50' : '#34495e';
            ctx.beginPath();
            ctx.arc(x, y, 3, 0, 2 * Math.PI);
            ctx.fill();
        }
        
        // Enhanced snake head
        ctx.fillStyle = '#e74c3c';
        ctx.beginPath();
        ctx.arc(startPos.x, startPos.y, 12, 0, 2 * Math.PI);
        ctx.fill();
        
        // Snake eyes
        ctx.fillStyle = '#fff';
        ctx.beginPath();
        ctx.arc(startPos.x - 4, startPos.y - 4, 3, 0, 2 * Math.PI);
        ctx.arc(startPos.x + 4, startPos.y - 4, 3, 0, 2 * Math.PI);
        ctx.fill();
        
        ctx.fillStyle = '#000';
        ctx.beginPath();
        ctx.arc(startPos.x - 4, startPos.y - 4, 1.5, 0, 2 * Math.PI);
        ctx.arc(startPos.x + 4, startPos.y - 4, 1.5, 0, 2 * Math.PI);
        ctx.fill();
        
        // Snake tail
        ctx.fillStyle = '#a93226';
        ctx.beginPath();
        ctx.arc(endPos.x, endPos.y, 6, 0, 2 * Math.PI);
        ctx.fill();
        
        // Add snake emoji near head
        ctx.font = '16px Arial';
        ctx.fillText('🐍', startPos.x - 20, startPos.y - 20);
    }
    
    function drawEnhancedLadder(start, end, startX, startY, cellSize, boardSize) {
        const startPos = getPositionCoords(start, startX, startY, cellSize, boardSize);
        const endPos = getPositionCoords(end, startX, startY, cellSize, boardSize);
        
        // Ladder sides with 3D effect
        const sideGradient = ctx.createLinearGradient(startPos.x - 8, startPos.y, startPos.x + 8, startPos.y);
        sideGradient.addColorStop(0, '#8B4513');
        sideGradient.addColorStop(0.5, '#D2691E');
        sideGradient.addColorStop(1, '#A0522D');
        
        ctx.fillStyle = sideGradient;
        ctx.fillRect(startPos.x - 8, startPos.y, 6, endPos.y - startPos.y);
        ctx.fillRect(startPos.x + 8, startPos.y, 6, endPos.y - startPos.y);
        
        // Ladder rungs with enhanced 3D effect
        const rungGradient = ctx.createLinearGradient(startPos.x - 10, 0, startPos.x + 10, 0);
        rungGradient.addColorStop(0, '#CD853F');
        rungGradient.addColorStop(0.5, '#DEB887');
        rungGradient.addColorStop(1, '#D2B48C');
        
        const rungs = Math.ceil(Math.abs(endPos.y - startPos.y) / 25);
        for (let i = 0; i <= rungs; i++) {
            const progress = i / rungs;
            const y = startPos.y + (endPos.y - startPos.y) * progress;
            
            // Rung shadow
            ctx.fillStyle = 'rgba(0, 0, 0, 0.2)';
            ctx.fillRect(startPos.x - 10, y + 2, 20, 6);
            
            // Rung
            ctx.fillStyle = rungGradient;
            ctx.fillRect(startPos.x - 10, y, 20, 5);
            
            // Rung highlight
            ctx.fillStyle = '#F5DEB3';
            ctx.fillRect(startPos.x - 10, y, 20, 1);
        }
        
        // Ladder sides outline
        ctx.strokeStyle = '#654321';
        ctx.lineWidth = 1;
        ctx.strokeRect(startPos.x - 8, Math.min(startPos.y, endPos.y), 6, Math.abs(endPos.y - startPos.y));
        ctx.strokeRect(startPos.x + 8, Math.min(startPos.y, endPos.y), 6, Math.abs(endPos.y - startPos.y));
        
        // Add ladder emoji near bottom
        ctx.font = '16px Arial';
        ctx.fillText('🪜', startPos.x - 20, startPos.y + 20);
    }
    
    function drawEnhancedPlayerPiece(position, color, startX, startY, cellSize, boardSize, playerIndex, playerName) {
        const coords = getPositionCoords(position, startX, startY, cellSize, boardSize);
        const offset = playerIndex * 20 - 10;
        
        // Player piece shadow
        ctx.fillStyle = 'rgba(0, 0, 0, 0.3)';
        ctx.beginPath();
        ctx.arc(coords.x + offset + 2, coords.y + 2, 16, 0, 2 * Math.PI);
        ctx.fill();
        
        // Player piece gradient
        const pieceGradient = ctx.createRadialGradient(
            coords.x + offset - 3, coords.y - 3, 0,
            coords.x + offset, coords.y, 15
        );
        pieceGradient.addColorStop(0, color === '#FF6900' ? '#FFB366' : '#66B3FF');
        pieceGradient.addColorStop(1, color);
        
        ctx.fillStyle = pieceGradient;
        ctx.beginPath();
        ctx.arc(coords.x + offset, coords.y, 15, 0, 2 * Math.PI);
        ctx.fill();
        
        // Player piece border
        ctx.strokeStyle = '#000';
        ctx.lineWidth = 2;
        ctx.stroke();
        
        // Player piece highlight
        ctx.fillStyle = 'rgba(255, 255, 255, 0.4)';
        ctx.beginPath();
        ctx.arc(coords.x + offset - 4, coords.y - 4, 5, 0, 2 * Math.PI);
        ctx.fill();
        
        // Player initial in piece
        ctx.fillStyle = '#fff';
        ctx.font = 'bold 12px Arial';
        ctx.textAlign = 'center';
        ctx.fillText(playerName[0], coords.x + offset, coords.y + 4);
        
        // Player name label
        ctx.fillStyle = color;
        ctx.font = 'bold 10px Arial';
        ctx.fillText(playerName, coords.x + offset, coords.y + 30);
    }
    
    function getPositionCoords(position, startX, startY, cellSize, boardSize) {
        const row = Math.floor((position - 1) / boardSize);
        const col = (position - 1) % boardSize;
        
        const actualCol = row % 2 === 0 ? col : (boardSize - 1 - col);
        const actualRow = boardSize - 1 - row;
        
        return {
            x: startX + actualCol * cellSize + cellSize / 2,
            y: startY + actualRow * cellSize + cellSize / 2
        };
    }

    // LUDO GAME
    function initLudoGame() {
        gameData = {
            players: [
                { 
                    pieces: [{pos: -1}, {pos: -1}, {pos: -1}, {pos: -1}], 
                    color: gameConfigs.ludo.colors.player1, 
                    name: 'You',
                    home: 0
                },
                { 
                    pieces: [{pos: -1}, {pos: -1}, {pos: -1}, {pos: -1}], 
                    color: gameConfigs.ludo.colors.player2, 
                    name: 'Computer',
                    home: 0
                }
            ],
            currentPlayer: 0,
            diceValue: 0,
            gameOver: false,
            winner: null,
            message: 'Your turn! Roll the dice to start',
            selectedPiece: -1,
            canMove: false
        };
        
        createLudoUI();
        drawLudoGame();
    }
    
    function createLudoUI() {
        const gameArea = document.querySelector('.game-area');
        if (gameArea) {
            gameArea.innerHTML = `
                <div style="text-align: center; margin: 20px 0;">
                    <div id="ludo-message" style="font-size: 18px; margin-bottom: 15px; color: #FF6900; font-weight: bold;">${gameData.message}</div>
                    <div style="display: flex; justify-content: center; align-items: center; gap: 20px; margin-bottom: 15px;">
                        <div style="background: linear-gradient(45deg, #FF6900, #ff8533); padding: 10px 15px; border-radius: 15px; color: white; font-weight: bold;">
                            🎯 You: <span id="your-home">0</span>/4 home
                        </div>
                        <div style="background: linear-gradient(45deg, #2196F3, #4FC3F7); padding: 10px 15px; border-radius: 15px; color: white; font-weight: bold;">
                            🤖 Computer: <span id="comp-home">0</span>/4 home
                        </div>
                    </div>
                    <button id="ludo-roll-dice" onclick="rollDiceLudo()" style="
                        background: linear-gradient(45deg, #FF6900, #ff8533);
                        color: white;
                        border: none;
                        padding: 15px 30px;
                        border-radius: 25px;
                        font-size: 18px;
                        font-weight: bold;
                        cursor: pointer;
                        box-shadow: 0 6px 20px rgba(255, 105, 0, 0.3);
                        margin-bottom: 15px;
                        transition: all 0.3s ease;
                        ${gameData.currentPlayer === 1 || gameData.gameOver || gameData.canMove ? 'opacity: 0.5; cursor: not-allowed;' : ''}
                    " ${gameData.currentPlayer === 1 || gameData.gameOver || gameData.canMove ? 'disabled' : ''}>
                        🎲 Roll Dice
                    </button>
                    <div id="ludo-dice" style="font-size: 50px; margin: 15px 0; text-shadow: 2px 2px 4px rgba(0,0,0,0.3);">🎲</div>
                    <div id="game-tips" style="font-size: 12px; color: #666; margin-top: 10px;">
                        🎯 Click pieces to move them • 🎲 Roll 6 to start or get extra turn • ⭐ Get all pieces to center to win!
                    </div>
                </div>
            `;
        }
    }
    
    function rollDiceLudo() {
        if (gameData.gameOver || gameData.canMove) return;
        
        gameData.diceValue = Math.floor(Math.random() * 6) + 1;
        document.getElementById('ludo-dice').textContent = getDiceEmoji(gameData.diceValue);
        
        setTimeout(() => {
            processLudoTurn();
        }, 1000);
    }
    
    function processLudoTurn() {
        const player = gameData.players[gameData.currentPlayer];
        const movablePieces = getMovablePieces(gameData.currentPlayer);
        
        if (movablePieces.length === 0) {
            gameData.message = `${player.name} has no valid moves. Switching turns...`;
            updateLudoUI();
            setTimeout(() => switchPlayerLudo(), 1500);
            return;
        }
        
        if (gameData.currentPlayer === 0) {
            // Human player - allow piece selection
            gameData.canMove = true;
            gameData.message = 'Click on a piece to move it!';
            updateLudoUI();
            drawLudoGame();
        } else {
            // Computer player - auto move
            setTimeout(() => {
                const pieceIndex = movablePieces[Math.floor(Math.random() * movablePieces.length)];
                movePieceLudo(1, pieceIndex);
            }, 1000);
        }
    }
    
    function getMovablePieces(playerIndex) {
        const player = gameData.players[playerIndex];
        const movable = [];
        
        player.pieces.forEach((piece, index) => {
            if (piece.pos === -1 && gameData.diceValue === 6) {
                movable.push(index); // Can start
            } else if (piece.pos >= 0 && piece.pos < 56) {
                const newPos = piece.pos + gameData.diceValue;
                if (newPos <= 56) {
                    movable.push(index); // Can move
                }
            }
        });
        
        return movable;
    }
    
    function movePieceLudo(playerIndex, pieceIndex) {
        const player = gameData.players[playerIndex];
        const piece = player.pieces[pieceIndex];
        
        if (piece.pos === -1) {
            // Starting piece
            piece.pos = playerIndex * 14; // Each player starts at different positions
        } else {
            // Moving piece
            piece.pos = Math.min(piece.pos + gameData.diceValue, 56);
            
            // Check if reached home
            if (piece.pos === 56) {
                player.home++;
                piece.pos = 100; // Mark as home
                gameData.message = `${player.name} got a piece home! 🏠`;
            }
        }
        
        // Check for win
        if (player.home === 4) {
            gameData.gameOver = true;
            gameData.winner = playerIndex;
            gameData.message = `${player.name} wins! All pieces home! 🎉`;
            updateLudoUI();
            setTimeout(() => endGame(), 2000);
            return;
        }
        
        updateLudoUI();
        drawLudoGame();
        
        // Continue turn if rolled 6, otherwise switch
        if (gameData.diceValue === 6 && !gameData.gameOver) {
            gameData.message = `${player.name} rolled a 6! Roll again!`;
            gameData.canMove = false;
        } else {
            switchPlayerLudo();
        }
    }
    
    function switchPlayerLudo() {
        gameData.currentPlayer = (gameData.currentPlayer + 1) % 2;
        gameData.canMove = false;
        gameData.selectedPiece = -1;
        gameData.message = gameData.currentPlayer === 0 ? 'Your turn! Roll the dice' : 'Computer\'s turn...';
        updateLudoUI();
        
        if (gameData.currentPlayer === 1 && !gameData.gameOver) {
            setTimeout(() => {
                rollDiceLudo();
            }, 1500);
        }
    }
    
    function updateLudoUI() {
        const messageEl = document.getElementById('ludo-message');
        const rollBtn = document.getElementById('ludo-roll-dice');
        const yourHome = document.getElementById('your-home');
        const compHome = document.getElementById('comp-home');
        
        if (messageEl) messageEl.textContent = gameData.message;
        if (rollBtn) rollBtn.disabled = gameData.currentPlayer === 1 || gameData.gameOver || gameData.canMove;
        if (yourHome) yourHome.textContent = gameData.players[0].home;
        if (compHome) compHome.textContent = gameData.players[1].home;
    }
    
    function drawLudoGame() {
        const config = gameConfigs.ludo;
        
        // Enhanced background with gradient
        const gradient = ctx.createLinearGradient(0, 0, gameCanvas.width, gameCanvas.height);
        gradient.addColorStop(0, '#1a1a1a');
        gradient.addColorStop(1, '#2d2d2d');
        ctx.fillStyle = gradient;
        ctx.fillRect(0, 0, gameCanvas.width, gameCanvas.height);
        
        const boardSize = Math.min(gameCanvas.width, gameCanvas.height) * 0.9;
        const startX = (gameCanvas.width - boardSize) / 2;
        const startY = (gameCanvas.height - boardSize) / 2;
        
        // Draw board background with shadow
        ctx.shadowColor = 'rgba(0, 0, 0, 0.3)';
        ctx.shadowBlur = 15;
        ctx.shadowOffsetX = 5;
        ctx.shadowOffsetY = 5;
        
        // Main board background
        const boardGradient = ctx.createRadialGradient(
            startX + boardSize/2, startY + boardSize/2, 0,
            startX + boardSize/2, startY + boardSize/2, boardSize/2
        );
        boardGradient.addColorStop(0, '#F5F5DC');
        boardGradient.addColorStop(1, '#DDD8C7');
        ctx.fillStyle = boardGradient;
        ctx.fillRect(startX, startY, boardSize, boardSize);
        
        // Board border
        ctx.strokeStyle = '#8B4513';
        ctx.lineWidth = 4;
        ctx.strokeRect(startX, startY, boardSize, boardSize);
        
        // Reset shadow for internal elements
        ctx.shadowColor = 'transparent';
        ctx.shadowBlur = 0;
        ctx.shadowOffsetX = 0;
        ctx.shadowOffsetY = 0;
        
        // Draw the classic Ludo cross pattern
        const center = boardSize / 2;
        const armWidth = boardSize / 6;
        const pathWidth = armWidth / 3;
        
        // Draw colored home triangles in corners
        const homeSize = (boardSize - 2 * armWidth) / 2;
        
        // Player 1 home area (bottom-left) - Orange
        const p1Gradient = ctx.createRadialGradient(
            startX + homeSize/2, startY + boardSize - homeSize/2, 0,
            startX + homeSize/2, startY + boardSize - homeSize/2, homeSize/2
        );
        p1Gradient.addColorStop(0, '#FFB366');
        p1Gradient.addColorStop(1, config.colors.player1);
        ctx.fillStyle = p1Gradient;
        ctx.fillRect(startX, startY + armWidth + pathWidth, homeSize, homeSize);
        
        // Player 2 home area (top-right) - Blue  
        const p2Gradient = ctx.createRadialGradient(
            startX + boardSize - homeSize/2, startY + homeSize/2, 0,
            startX + boardSize - homeSize/2, startY + homeSize/2, homeSize/2
        );
        p2Gradient.addColorStop(0, '#66B3FF');
        p2Gradient.addColorStop(1, config.colors.player2);
        ctx.fillStyle = p2Gradient;
        ctx.fillRect(startX + armWidth + pathWidth, startY, homeSize, homeSize);
        
        // Player 3 home area (top-left) - Green (inactive)
        ctx.fillStyle = '#90EE90';
        ctx.fillRect(startX, startY, homeSize, homeSize);
        
        // Player 4 home area (bottom-right) - Red (inactive)
        ctx.fillStyle = '#FFB6C1';
        ctx.fillRect(startX + armWidth + pathWidth, startY + armWidth + pathWidth, homeSize, homeSize);
        
        // Draw paths (the cross arms)
        // Vertical path
        ctx.fillStyle = '#FFFACD';
        ctx.fillRect(startX + homeSize, startY, armWidth, boardSize);
        
        // Horizontal path  
        ctx.fillRect(startX, startY + homeSize, boardSize, armWidth);
        
        // Draw safe zones (colored paths leading to center)
        const safeZoneGradient1 = ctx.createLinearGradient(
            startX + homeSize, startY + homeSize,
            startX + homeSize + pathWidth, startY + homeSize + pathWidth
        );
        safeZoneGradient1.addColorStop(0, config.colors.player1);
        safeZoneGradient1.addColorStop(1, '#FFE4B5');
        ctx.fillStyle = safeZoneGradient1;
        ctx.fillRect(startX + homeSize, startY + homeSize + pathWidth, pathWidth, armWidth - pathWidth);
        
        const safeZoneGradient2 = ctx.createLinearGradient(
            startX + homeSize, startY + homeSize,
            startX + homeSize + pathWidth, startY + homeSize + pathWidth
        );
        safeZoneGradient2.addColorStop(0, config.colors.player2);
        safeZoneGradient2.addColorStop(1, '#E6F3FF');
        ctx.fillStyle = safeZoneGradient2;
        ctx.fillRect(startX + homeSize + pathWidth, startY + homeSize, armWidth - pathWidth, pathWidth);
        
        // Draw the center home area (victory zone)
        const centerSize = pathWidth * 1.5;
        const centerX = startX + center - centerSize/2;
        const centerY = startY + center - centerSize/2;
        
        const centerGradient = ctx.createRadialGradient(
            centerX + centerSize/2, centerY + centerSize/2, 0,
            centerX + centerSize/2, centerY + centerSize/2, centerSize/2
        );
        centerGradient.addColorStop(0, '#FFD700');
        centerGradient.addColorStop(1, '#FFA500');
        ctx.fillStyle = centerGradient;
        ctx.fillRect(centerX, centerY, centerSize, centerSize);
        
        // Center star
        ctx.fillStyle = '#FF6900';
        ctx.font = '24px Arial';
        ctx.textAlign = 'center';
        ctx.fillText('⭐', centerX + centerSize/2, centerY + centerSize/2 + 8);
        
        // Draw path squares/positions
        const squareSize = armWidth / 6;
        drawLudoPathSquares(startX, startY, boardSize, homeSize, armWidth, pathWidth, squareSize);
        
        // Draw starting positions
        drawLudoStartingPositions(startX, startY, homeSize, armWidth, pathWidth);
        
        // Draw home areas with pieces waiting
        drawLudoHomePieces(startX, startY, homeSize, armWidth, pathWidth);
        
        // Draw pieces on the board
        gameData.players.forEach((player, playerIndex) => {
            player.pieces.forEach((piece, pieceIndex) => {
                if (piece.pos >= 0 && piece.pos < 100) {
                    const coords = getEnhancedLudoPieceCoords(piece.pos, playerIndex, startX, startY, boardSize, homeSize, armWidth, pathWidth);
                    drawEnhancedLudoPiece(coords.x, coords.y, player.color, pieceIndex, player.name);
                }
            });
        });
        
        // Draw board title
        ctx.fillStyle = '#FF6900';
        ctx.font = 'bold 20px Arial';
        ctx.textAlign = 'center';
        ctx.fillText('🎯 LUDO CHAMPIONSHIP 🎯', gameCanvas.width/2, 25);
        
        // Draw player indicators
        ctx.font = 'bold 12px Arial';
        ctx.fillStyle = config.colors.player1;
        ctx.fillText('YOU', startX + homeSize/2, startY + boardSize + 15);
        
        ctx.fillStyle = config.colors.player2;
        ctx.fillText('COMPUTER', startX + boardSize - homeSize/2, startY - 5);
    }
    
    function drawLudoPathSquares(startX, startY, boardSize, homeSize, armWidth, pathWidth, squareSize) {
        const positions = [];
        const sqSize = squareSize * 0.8;
        
        // Create path positions around the board
        // Bottom horizontal path (left to right)
        for (let i = 0; i < 6; i++) {
            const x = startX + homeSize + (armWidth/6) * i;
            const y = startY + homeSize + armWidth - sqSize;
            drawPathSquare(x, y, sqSize, i === 0 ? '#90EE90' : '#FFFACD'); // First square is green (safe)
        }
        
        // Right vertical path (bottom to top)
        for (let i = 0; i < 6; i++) {
            const x = startX + homeSize + armWidth;
            const y = startY + homeSize + armWidth - (armWidth/6) * (i + 1);
            drawPathSquare(x, y, sqSize, i === 5 ? '#2196F3' : '#FFFACD'); // Last square is blue (safe)
        }
        
        // Top horizontal path (right to left)
        for (let i = 0; i < 6; i++) {
            const x = startX + homeSize + armWidth - (armWidth/6) * (i + 1);
            const y = startY + homeSize - sqSize;
            drawPathSquare(x, y, sqSize, '#FFFACD');
        }
        
        // Left vertical path (top to bottom)
        for (let i = 0; i < 6; i++) {
            const x = startX + homeSize - sqSize;
            const y = startY + homeSize + (armWidth/6) * i;
            drawPathSquare(x, y, sqSize, '#FFFACD');
        }
    }
    
    function drawPathSquare(x, y, size, color) {
        // Square background
        ctx.fillStyle = color;
        ctx.fillRect(x, y, size, size);
        
        // Square border
        ctx.strokeStyle = '#8B4513';
        ctx.lineWidth = 1;
        ctx.strokeRect(x, y, size, size);
    }
    
    function drawLudoStartingPositions(startX, startY, homeSize, armWidth, pathWidth) {
        // Player 1 starting position (orange arrow from bottom-left)
        ctx.fillStyle = '#FF6900';
        ctx.font = '16px Arial';
        ctx.textAlign = 'center';
        ctx.fillText('🏠', startX + homeSize + armWidth/12, startY + homeSize + armWidth - 10);
        
        // Player 2 starting position (blue arrow from top-right)  
        ctx.fillStyle = '#2196F3';
        ctx.fillText('🏠', startX + homeSize + armWidth - 10, startY + homeSize + armWidth/12);
    }
    
    function drawLudoHomePieces(startX, startY, homeSize, armWidth, pathWidth) {
        const pieceRadius = 8;
        const spacing = 25;
        
        // Player 1 waiting pieces (in home area)
        gameData.players[0].pieces.forEach((piece, index) => {
            if (piece.pos === -1) { // Piece is at home
                const x = startX + 20 + (index % 2) * spacing;
                const y = startY + homeSize + armWidth - 30 + Math.floor(index / 2) * spacing;
                drawEnhancedLudoPiece(x, y, gameData.players[0].color, index, 'Y');
            }
        });
        
        // Player 2 waiting pieces (in home area)
        gameData.players[1].pieces.forEach((piece, index) => {
            if (piece.pos === -1) { // Piece is at home
                const x = startX + homeSize + armWidth + 20 + (index % 2) * spacing;
                const y = startY + 20 + Math.floor(index / 2) * spacing;
                drawEnhancedLudoPiece(x, y, gameData.players[1].color, index, 'C');
            }
        });
    }
    
    function drawEnhancedLudoPiece(x, y, color, pieceIndex, initial) {
        const radius = 12;
        
        // Piece shadow
        ctx.fillStyle = 'rgba(0, 0, 0, 0.2)';
        ctx.beginPath();
        ctx.arc(x + 2, y + 2, radius, 0, 2 * Math.PI);
        ctx.fill();
        
        // Piece gradient
        const pieceGradient = ctx.createRadialGradient(x - 3, y - 3, 0, x, y, radius);
        pieceGradient.addColorStop(0, color === '#FF6900' ? '#FFB366' : '#66B3FF');
        pieceGradient.addColorStop(1, color);
        
        ctx.fillStyle = pieceGradient;
        ctx.beginPath();
        ctx.arc(x, y, radius, 0, 2 * Math.PI);
        ctx.fill();
        
        // Piece border
        ctx.strokeStyle = '#000';
        ctx.lineWidth = 2;
        ctx.stroke();
        
        // Piece highlight
        ctx.fillStyle = 'rgba(255, 255, 255, 0.3)';
        ctx.beginPath();
        ctx.arc(x - 3, y - 3, 4, 0, 2 * Math.PI);
        ctx.fill();
        
        // Piece number/initial
        ctx.fillStyle = '#fff';
        ctx.font = 'bold 10px Arial';
        ctx.textAlign = 'center';
        ctx.fillText(initial, x, y + 3);
    }
    
    function getEnhancedLudoPieceCoords(position, playerIndex, startX, startY, boardSize, homeSize, armWidth, pathWidth) {
        // Enhanced positioning system for Ludo pieces
        // This creates a proper path around the board
        
        const squareSize = armWidth / 6;
        const offset = squareSize / 2;
        
        // Define the path coordinates
        const pathCoords = [];
        
        // Bottom row (positions 0-5 for player 1, different for player 2)
        for (let i = 0; i < 6; i++) {
            pathCoords.push({
                x: startX + homeSize + offset + (squareSize * i),
                y: startX + homeSize + armWidth - offset
            });
        }
        
        // Right column (positions 6-11)
        for (let i = 0; i < 6; i++) {
            pathCoords.push({
                x: startX + homeSize + armWidth + offset,
                y: startY + homeSize + armWidth - offset - (squareSize * (i + 1))
            });
        }
        
        // Top row (positions 12-17)
        for (let i = 0; i < 6; i++) {
            pathCoords.push({
                x: startX + homeSize + armWidth + offset - (squareSize * (i + 1)),
                y: startY + homeSize - offset
            });
        }
        
        // Left column (positions 18-23)
        for (let i = 0; i < 6; i++) {
            pathCoords.push({
                x: startX + homeSize - offset,
                y: startY + homeSize - offset + (squareSize * i)
            });
        }
        
        // Cycle through positions
        const adjustedPos = position % 24;
        
        if (pathCoords[adjustedPos]) {
            return pathCoords[adjustedPos];
        }
        
        // Default fallback position
        return {
            x: startX + boardSize/2,
            y: startY + boardSize/2
        };
    }

    // UTILITY FUNCTIONS
    function gameLoop() {
        if (!gameRunning) return;
        
        // Update current game
        switch(currentGame) {
            case 'dino':
                updateDinoGame();
                drawDinoGame();
                break;
            case 'snake':
                updateSnakeGame();
                drawSnakeGame();
                break;
            case 'tetris':
                updateTetrisGame();
                drawTetrisGame();
                break;
            case 'pong':
                updatePongGame();
                drawPongGame();
                break;
            case 'breakout':
                updateBreakoutGame();
                drawBreakoutGame();
                break;
            case 'space':
                updateSpaceGame();
                drawSpaceGame();
                break;
            case 'snakesladders':
                // Turn-based game, no continuous updates needed
                break;
            case 'ludo':
                // Turn-based game, no continuous updates needed
                break;
        }
        
        updateScore();
        animationId = requestAnimationFrame(gameLoop);
    }
    
    function checkCollision(rect1, rect2) {
        return rect1.x < rect2.x + (rect2.width || rect2.radius * 2) &&
               rect1.x + (rect1.width || rect1.radius * 2) > rect2.x &&
               rect1.y < rect2.y + (rect2.height || rect2.radius * 2) &&
               rect1.y + (rect1.height || rect1.radius * 2) > rect2.y;
    }
    
    function drawCloud(x, y, width, height) {
        ctx.beginPath();
        ctx.arc(x, y, height/2, 0, Math.PI * 2);
        ctx.arc(x + width/3, y, height/2, 0, Math.PI * 2);
        ctx.arc(x + 2*width/3, y, height/2, 0, Math.PI * 2);
        ctx.arc(x + width, y, height/2, 0, Math.PI * 2);
        ctx.fill();
    }
    
    function updateScore() {
        if (gameScore) {
            gameScore.textContent = `Score: ${Math.floor(playerScore)}`;
        }
    }
    
    function endGame() {
        gameRunning = false;
        
        // Show game over overlay
        if (gameOverOverlay) {
            gameOverOverlay.style.display = 'flex';
        }
        
        // Update final score in the overlay
        if (finalScore) {
            finalScore.textContent = `Score: ${Math.floor(playerScore)}`;
        }
        
        // Show restart button in controls
        if (restartGameBtn) {
            restartGameBtn.style.display = 'block';
        }
        
        // Save score (simplified)
        console.log(`Game Over! Final Score: ${Math.floor(playerScore)} in ${currentGame}`);
    }
    
    function stopGame() {
        gameRunning = false;
        if (animationId) {
            cancelAnimationFrame(animationId);
        }
    }
    
    function restartCurrentGame() {
        if (currentGame) {
            startGame(currentGame);
        }
    }
    
    // KEYBOARD CONTROLS
    const keys = {};
    
    document.addEventListener('keydown', (e) => {
        keys[e.key] = true;
        
        if (!gameRunning) return;
        
        switch(currentGame) {
            case 'dino':
                if (e.key === ' ' || e.key === 'ArrowUp') {
                    e.preventDefault();
                    if (!gameData.dino.jumping) {
                        gameData.dino.jumping = true;
                        gameData.dino.velocityY = 15;
                    }
                }
                break;
                
            case 'snake':
                const gridSize = gameData.gridSize;
                switch(e.key) {
                    case 'ArrowUp': gameData.direction = {x: 0, y: -gridSize}; break;
                    case 'ArrowDown': gameData.direction = {x: 0, y: gridSize}; break;
                    case 'ArrowLeft': gameData.direction = {x: -gridSize, y: 0}; break;
                    case 'ArrowRight': gameData.direction = {x: gridSize, y: 0}; break;
                }
                break;
                
            case 'pong':
                // Left paddle controls
                if (e.key === 'ArrowUp') {
                    gameData.leftPaddle.y = Math.max(0, gameData.leftPaddle.y - 20);
                }
                if (e.key === 'ArrowDown') {
                    gameData.leftPaddle.y = Math.min(gameCanvas.height - gameData.leftPaddle.height, gameData.leftPaddle.y + 20);
                }
                break;
                
            case 'breakout':
                if (e.key === 'ArrowLeft') {
                    gameData.paddle.x = Math.max(0, gameData.paddle.x - gameData.paddle.speed);
                }
                if (e.key === 'ArrowRight') {
                    gameData.paddle.x = Math.min(gameCanvas.width - gameData.paddle.width, gameData.paddle.x + gameData.paddle.speed);
                }
                break;
                
            case 'space':
                if (e.key === 'ArrowLeft') {
                    gameData.player.x = Math.max(0, gameData.player.x - gameData.player.speed);
                }
                if (e.key === 'ArrowRight') {
                    gameData.player.x = Math.min(gameCanvas.width - gameData.player.width, gameData.player.x + gameData.player.speed);
                }
                if (e.key === 'ArrowUp') {
                    gameData.player.y = Math.max(0, gameData.player.y - gameData.player.speed);
                }
                if (e.key === 'ArrowDown') {
                    gameData.player.y = Math.min(gameCanvas.height - gameData.player.height, gameData.player.y + gameData.player.speed);
                }
                if (e.key === ' ') {
                    e.preventDefault();
                    gameData.bullets.push({
                        x: gameData.player.x + gameData.player.width / 2 - 2,
                        y: gameData.player.y,
                        width: 4,
                        height: 10
                    });
                }
                break;
        }
    });
    
    document.addEventListener('keyup', (e) => {
        keys[e.key] = false;
    });

    // CANVAS CLICK HANDLER (for Ludo piece selection)
    gameCanvas?.addEventListener('click', (e) => {
        if (currentGame === 'ludo' && gameData.canMove && gameData.currentPlayer === 0) {
            const rect = gameCanvas.getBoundingClientRect();
            const clickX = e.clientX - rect.left;
            const clickY = e.clientY - rect.top;
            
            // Check if clicked on a movable piece
            const player = gameData.players[0];
            const movablePieces = getMovablePieces(0);
            
            // Check pieces on the board
            for (let i = 0; i < player.pieces.length; i++) {
                if (movablePieces.includes(i) && player.pieces[i].pos >= 0 && player.pieces[i].pos < 100) {
                    const boardSize = Math.min(gameCanvas.width, gameCanvas.height) * 0.9;
                    const startX = (gameCanvas.width - boardSize) / 2;
                    const startY = (gameCanvas.height - boardSize) / 2;
                    const homeSize = (boardSize - 2 * (boardSize / 6)) / 2;
                    const armWidth = boardSize / 6;
                    const pathWidth = armWidth / 3;
                    
                    const coords = getEnhancedLudoPieceCoords(player.pieces[i].pos, 0, startX, startY, boardSize, homeSize, armWidth, pathWidth);
                    
                    const distance = Math.sqrt(Math.pow(clickX - coords.x, 2) + Math.pow(clickY - coords.y, 2));
                    if (distance <= 15) {
                        movePieceLudo(0, i);
                        return;
                    }
                }
            }
            
            // Check pieces in home area (waiting to start)
            for (let i = 0; i < player.pieces.length; i++) {
                if (movablePieces.includes(i) && player.pieces[i].pos === -1) {
                    const boardSize = Math.min(gameCanvas.width, gameCanvas.height) * 0.9;
                    const startX = (gameCanvas.width - boardSize) / 2;
                    const startY = (gameCanvas.height - boardSize) / 2;
                    const homeSize = (boardSize - 2 * (boardSize / 6)) / 2;
                    const armWidth = boardSize / 6;
                    const spacing = 25;
                    
                    const x = startX + 20 + (i % 2) * spacing;
                    const y = startY + homeSize + armWidth - 30 + Math.floor(i / 2) * spacing;
                    
                    const distance = Math.sqrt(Math.pow(clickX - x, 2) + Math.pow(clickY - y, 2));
                    if (distance <= 15) {
                        movePieceLudo(0, i);
                        return;
                    }
                }
            }
        }
    });
    
    // ADDITIONAL HELPER FUNCTIONS
    function resetBall() {
        if (gameData.ball) {
            gameData.ball.x = gameCanvas.width / 2;
            gameData.ball.y = gameCanvas.height / 2;
            gameData.ball.dx = gameData.ball.dx > 0 ? -5 : 5;
            gameData.ball.dy = Math.random() * 6 - 3;
        }
    }
    
    function spawnPiece() {
        // Simplified Tetris piece spawning
        const pieces = [
            [[1,1,1,1]], // I
            [[1,1],[1,1]], // O
            [[0,1,0],[1,1,1]], // T
            [[1,0,0],[1,1,1]], // L
            [[0,0,1],[1,1,1]], // J
            [[1,1,0],[0,1,1]], // S
            [[0,1,1],[1,1,0]]  // Z
        ];
        
        gameData.currentPiece = {
            shape: pieces[Math.floor(Math.random() * pieces.length)],
            x: Math.floor(10 / 2) - Math.floor(pieces[0][0].length / 2),
            y: 0,
            color: Math.floor(Math.random() * 7)
        };
    }
    
    function movePiece(dx, dy) {
        gameData.currentPiece.x += dx;
        gameData.currentPiece.y += dy;
        
        if (isValidMove()) {
            return true;
        } else {
            gameData.currentPiece.x -= dx;
            gameData.currentPiece.y -= dy;
            return false;
        }
    }
    
    function isValidMove() {
        const { currentPiece, board } = gameData;
        
        for (let y = 0; y < currentPiece.shape.length; y++) {
            for (let x = 0; x < currentPiece.shape[y].length; x++) {
                if (currentPiece.shape[y][x]) {
                    const newX = currentPiece.x + x;
                    const newY = currentPiece.y + y;
                    
                    if (newX < 0 || newX >= 10 || newY >= 20 || (newY >= 0 && board[newY][newX])) {
                        return false;
                    }
                }
            }
        }
        return true;
    }
    
    function placePiece() {
        const { currentPiece, board } = gameData;
        
        currentPiece.shape.forEach((row, y) => {
            row.forEach((cell, x) => {
                if (cell) {
                    if (currentPiece.y + y >= 0) {
                        board[currentPiece.y + y][currentPiece.x + x] = currentPiece.color + 1;
                    }
                }
            });
        });
    }
    
    function clearLines() {
        const { board } = gameData;
        
        for (let y = board.length - 1; y >= 0; y--) {
            if (board[y].every(cell => cell !== 0)) {
                board.splice(y, 1);
                board.unshift(Array(10).fill(0));
                playerScore += 1000;
                y++; // Check the same line again
            }
        }
    }
    
    function isGameOver() {
        return gameData.board[0].some(cell => cell !== 0);
    }
    
    // Global functions for board games (accessible from HTML)
    window.rollDiceSnakesLadders = function() {
        if (currentGame === 'snakesladders') {
            if (gameData.gameOver || gameData.currentPlayer !== 0) return;
            
            gameData.diceValue = Math.floor(Math.random() * 6) + 1;
            document.getElementById('snl-dice').textContent = getDiceEmoji(gameData.diceValue);
            
            setTimeout(() => {
                movePlayerSnakesLadders(gameData.currentPlayer, gameData.diceValue);
            }, 1000);
        }
    };
    
    window.rollDiceLudo = function() {
        if (currentGame === 'ludo') {
            if (gameData.gameOver || gameData.canMove || gameData.currentPlayer !== 0) return;
            
            gameData.diceValue = Math.floor(Math.random() * 6) + 1;
            document.getElementById('ludo-dice').textContent = getDiceEmoji(gameData.diceValue);
            
            setTimeout(() => {
                processLudoTurn();
            }, 1000);
        }
    };
    
    // KRURA Games Coming Soon Modal
    function showKruraGamesComingSoon() {
        // Create modal if it doesn't exist
        let kruraModal = document.getElementById('kruraGamesModal');
        if (!kruraModal) {
            kruraModal = document.createElement('div');
            kruraModal.id = 'kruraGamesModal';
            kruraModal.className = 'game-modal';
            kruraModal.style.display = 'none';
            kruraModal.innerHTML = `
                <div class="game-modal-content" style="max-width: 500px;">
                    <div class="game-modal-header" style="background: linear-gradient(45deg, #9b59b6, #8e44ad);">
                        <h2 style="color: white;">🧪 KRURA Games Lab</h2>
                        <span class="krura-close-btn" style="color: white; cursor: pointer; font-size: 24px;">&times;</span>
                    </div>
                    <div class="game-modal-body" style="text-align: center; padding: 40px 20px;">
                        <div style="font-size: 80px; margin-bottom: 20px;">🚀</div>
                        <h3 style="color: #9b59b6; margin-bottom: 15px;">Coming Soon!</h3>
                        <p style="color: #666; font-size: 16px; margin-bottom: 25px;">
                            KRURA Games are currently in development and testing phase.
                        </p>
                        <div style="background: linear-gradient(45deg, #f8f9fa, #e9ecef); padding: 20px; border-radius: 15px; margin-bottom: 25px;">
                            <h4 style="color: #9b59b6; margin-bottom: 15px;">🎮 What's Coming:</h4>
                            <ul style="text-align: left; color: #666; list-style: none; padding: 0;">
                                <li style="margin-bottom: 8px;">🎯 Advanced AI-powered games</li>
                                <li style="margin-bottom: 8px;">🌟 Multiplayer online challenges</li>
                                <li style="margin-bottom: 8px;">🏆 Progressive difficulty systems</li>
                                <li style="margin-bottom: 8px;">📊 Detailed analytics & scoring</li>
                                <li style="margin-bottom: 8px;">🎨 Immersive 3D experiences</li>
                            </ul>
                        </div>
                        <p style="color: #999; font-size: 14px; margin-bottom: 25px;">
                            Stay tuned for updates! In the meantime, enjoy our <strong>Tech Games</strong> and <strong>Play Games</strong> collections.
                        </p>
                        <button class="krura-close-btn" style="
                            background: linear-gradient(45deg, #9b59b6, #8e44ad);
                            color: white;
                            border: none;
                            padding: 12px 25px;
                            border-radius: 25px;
                            font-size: 16px;
                            font-weight: bold;
                            cursor: pointer;
                            box-shadow: 0 6px 20px rgba(155, 89, 182, 0.3);
                        ">Got It! 👍</button>
                    </div>
                </div>
            `;
            document.body.appendChild(kruraModal);
            
            // Add close event listeners
            const closeButtons = kruraModal.querySelectorAll('.krura-close-btn');
            closeButtons.forEach(btn => {
                btn.addEventListener('click', () => {
                    kruraModal.style.display = 'none';
                });
            });
            
            // Close on outside click
            kruraModal.addEventListener('click', (e) => {
                if (e.target === kruraModal) {
                    kruraModal.style.display = 'none';
                }
            });
        }
        
        // Show the modal
        kruraModal.style.display = 'flex';
    }
    
    // Initialize game modal on page load
    console.log('Multi-Game Center initialized successfully!');
    if (gameSelection) {
        gameSelection.style.display = 'block';
        console.log('Game selection menu is ready');
    }
    if (gameContainer) {
        gameContainer.style.display = 'none';
        console.log('Game container is hidden');
    }
});
