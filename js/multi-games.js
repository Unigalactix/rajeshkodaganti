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
        const speedMultiplier = getDifficultyMultiplier();
        const gridSize = 20;
        gameData = {
            snake: [{ x: 200, y: 200 }],
            direction: { x: gridSize, y: 0 },
            food: { x: 300, y: 300 },
            gridSize: gridSize,
            moveTime: 0,
            moveInterval: Math.max(80, 200 / speedMultiplier) // Faster for higher difficulty
        };
        generateFood();
    }
    
    function updateSnakeGame() {
        const { snake, direction, food, gridSize } = gameData;
        
        // Update movement timer
        gameData.moveTime += 16; // Assuming 60fps
        
        // Only move when interval is reached
        if (gameData.moveTime < gameData.moveInterval) {
            return;
        }
        
        gameData.moveTime = 0;
        
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
        
        // Draw snake body
        ctx.fillStyle = config.colors.snake;
        snake.forEach((segment, index) => {
            if (index === 0) {
                // Draw head with different color
                ctx.fillStyle = '#0a0'; // Brighter green for head
                ctx.fillRect(segment.x, segment.y, gameData.gridSize, gameData.gridSize);
                // Add eyes to the head
                ctx.fillStyle = '#000';
                ctx.fillRect(segment.x + 4, segment.y + 4, 3, 3);
                ctx.fillRect(segment.x + 13, segment.y + 4, 3, 3);
            } else {
                // Draw body
                ctx.fillStyle = config.colors.snake;
                ctx.fillRect(segment.x, segment.y, gameData.gridSize, gameData.gridSize);
                // Add border to body segments
                ctx.strokeStyle = '#080';
                ctx.lineWidth = 1;
                ctx.strokeRect(segment.x, segment.y, gameData.gridSize, gameData.gridSize);
            }
        });
        
        // Draw food with pulsing effect
        const pulseSize = Math.sin(Date.now() * 0.01) * 2 + gameData.gridSize;
        const offset = (gameData.gridSize - pulseSize) / 2;
        ctx.fillStyle = config.colors.food;
        ctx.fillRect(food.x + offset, food.y + offset, pulseSize, pulseSize);
    }
    
    function generateFood() {
        const gridSize = gameData.gridSize;
        let newFood;
        let attempts = 0;
        
        do {
            newFood = {
                x: Math.floor(Math.random() * (gameCanvas.width / gridSize)) * gridSize,
                y: Math.floor(Math.random() * (gameCanvas.height / gridSize)) * gridSize
            };
            attempts++;
        } while (
            attempts < 100 && 
            gameData.snake && 
            gameData.snake.some(segment => segment.x === newFood.x && segment.y === newFood.y)
        );
        
        gameData.food = newFood;
    }
    
    // TETRIS GAME
    function initTetrisGame() {
        const speedMultiplier = getDifficultyMultiplier();
        gameData = {
            board: Array(20).fill().map(() => Array(10).fill(0)),
            currentPiece: null,
            nextPiece: null,
            dropTime: 0,
            dropInterval: Math.max(200, 1000 / speedMultiplier) // Faster drop for higher difficulty
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
        
        // Helper function to draw a block with border
        function drawBlock(x, y, color, alpha = 1) {
            ctx.globalAlpha = alpha;
            ctx.fillStyle = color;
            ctx.fillRect(x * blockSize, y * blockSize, blockSize, blockSize);
            ctx.strokeStyle = '#333';
            ctx.lineWidth = 1;
            ctx.strokeRect(x * blockSize, y * blockSize, blockSize, blockSize);
            ctx.globalAlpha = 1;
        }
        
        // Draw placed blocks
        for (let y = 0; y < board.length; y++) {
            for (let x = 0; x < board[y].length; x++) {
                if (board[y][x]) {
                    drawBlock(x, y, config.colors.blocks[board[y][x] - 1]);
                }
            }
        }
        
        // Draw current piece with slight transparency for better visibility
        if (currentPiece) {
            currentPiece.shape.forEach((row, y) => {
                row.forEach((cell, x) => {
                    if (cell) {
                        drawBlock(currentPiece.x + x, currentPiece.y + y, config.colors.blocks[currentPiece.color], 0.9);
                    }
                });
            });
        }
        
        // Draw game area border
        ctx.strokeStyle = '#666';
        ctx.lineWidth = 2;
        ctx.strokeRect(0, 0, blockSize * 10, blockSize * 20);
    }
    
    // PONG GAME
    function initPongGame() {
        const speedMultiplier = getDifficultyMultiplier();
        gameData = {
            leftPaddle: { x: 20, y: gameCanvas.height / 2 - 50, width: 10, height: 100, speed: 5 * speedMultiplier },
            rightPaddle: { x: gameCanvas.width - 30, y: gameCanvas.height / 2 - 50, width: 10, height: 100, speed: 5 * speedMultiplier },
            ball: { x: gameCanvas.width / 2, y: gameCanvas.height / 2, dx: 5 * speedMultiplier, dy: 3 * speedMultiplier, radius: 8 },
            leftScore: 0,
            rightScore: 0,
            aiDifficulty: speedMultiplier // Store AI difficulty
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
        
        // AI for right paddle with difficulty-based behavior
        const paddleCenter = rightPaddle.y + rightPaddle.height / 2;
        const aiReactionZone = 35 / gameData.aiDifficulty; // Smaller zone = harder AI
        const aiSpeed = rightPaddle.speed * (0.7 + (gameData.aiDifficulty * 0.2)); // Faster on higher difficulty
        
        if (paddleCenter < ball.y - aiReactionZone) {
            rightPaddle.y = Math.min(gameCanvas.height - rightPaddle.height, rightPaddle.y + aiSpeed);
        } else if (paddleCenter > ball.y + aiReactionZone) {
            rightPaddle.y = Math.max(0, rightPaddle.y - aiSpeed);
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

    // UTILITY FUNCTIONS
    function gameLoop() {
        if (!gameRunning) return;
        
        // Handle continuous input for smooth movement
        handleContinuousInput();
        
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
                const currentDirection = gameData.direction;
                let newDirection = null;
                
                switch(e.key) {
                    case 'ArrowUp': 
                        // Prevent reversing into self
                        if (currentDirection.y === 0) {
                            newDirection = {x: 0, y: -gridSize};
                        }
                        break;
                    case 'ArrowDown': 
                        if (currentDirection.y === 0) {
                            newDirection = {x: 0, y: gridSize};
                        }
                        break;
                    case 'ArrowLeft': 
                        if (currentDirection.x === 0) {
                            newDirection = {x: -gridSize, y: 0};
                        }
                        break;
                    case 'ArrowRight': 
                        if (currentDirection.x === 0) {
                            newDirection = {x: gridSize, y: 0};
                        }
                        break;
                }
                
                if (newDirection) {
                    gameData.direction = newDirection;
                }
                break;
                
            case 'tetris':
                switch(e.key) {
                    case 'ArrowLeft':
                        e.preventDefault();
                        movePiece(-1, 0);
                        break;
                    case 'ArrowRight':
                        e.preventDefault();
                        movePiece(1, 0);
                        break;
                    case 'ArrowDown':
                        e.preventDefault();
                        movePiece(0, 1);
                        break;
                    case 'ArrowUp':
                        e.preventDefault();
                        rotatePiece();
                        break;
                }
                break;
                
            case 'pong':
                // Continuous movement is now handled in handleContinuousInput()
                break;
                
            case 'breakout':
                // Continuous movement is now handled in handleContinuousInput()
                break;
                
            case 'space':
                // Movement is now handled in handleContinuousInput()
                // Only handle shooting here
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
    
    // MOUSE/CLICK CONTROLS
    gameCanvas?.addEventListener('click', (e) => {
        if (!gameRunning) return;
        
        switch(currentGame) {
            case 'dino':
                // Click to jump
                if (!gameData.dino.jumping) {
                    gameData.dino.jumping = true;
                    gameData.dino.velocityY = 15;
                }
                break;
                
            case 'space':
                // Click to shoot
                gameData.bullets.push({
                    x: gameData.player.x + gameData.player.width / 2 - 2,
                    y: gameData.player.y,
                    width: 4,
                    height: 10
                });
                break;
        }
    });
    
    // CONTINUOUS KEY HANDLING for smooth movement
    function handleContinuousInput() {
        if (!gameRunning) return;
        
        switch(currentGame) {
            case 'breakout':
                if (keys['ArrowLeft']) {
                    gameData.paddle.x = Math.max(0, gameData.paddle.x - gameData.paddle.speed);
                }
                if (keys['ArrowRight']) {
                    gameData.paddle.x = Math.min(gameCanvas.width - gameData.paddle.width, gameData.paddle.x + gameData.paddle.speed);
                }
                break;
                
            case 'space':
                if (keys['ArrowLeft']) {
                    gameData.player.x = Math.max(0, gameData.player.x - gameData.player.speed);
                }
                if (keys['ArrowRight']) {
                    gameData.player.x = Math.min(gameCanvas.width - gameData.player.width, gameData.player.x + gameData.player.speed);
                }
                if (keys['ArrowUp']) {
                    gameData.player.y = Math.max(0, gameData.player.y - gameData.player.speed);
                }
                if (keys['ArrowDown']) {
                    gameData.player.y = Math.min(gameCanvas.height - gameData.player.height, gameData.player.y + gameData.player.speed);
                }
                break;
                
            case 'pong':
                if (keys['ArrowUp']) {
                    gameData.leftPaddle.y = Math.max(0, gameData.leftPaddle.y - gameData.leftPaddle.speed);
                }
                if (keys['ArrowDown']) {
                    gameData.leftPaddle.y = Math.min(gameCanvas.height - gameData.leftPaddle.height, gameData.leftPaddle.y + gameData.leftPaddle.speed);
                }
                break;
        }
    }
    
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
    
    function rotatePiece() {
        const { currentPiece } = gameData;
        const originalShape = currentPiece.shape;
        
        // Rotate the piece 90 degrees clockwise
        const rotated = [];
        for (let i = 0; i < originalShape[0].length; i++) {
            rotated[i] = [];
            for (let j = originalShape.length - 1; j >= 0; j--) {
                rotated[i][originalShape.length - 1 - j] = originalShape[j][i];
            }
        }
        
        // Test if rotation is valid
        currentPiece.shape = rotated;
        if (isValidMove()) {
            return true;
        } else {
            // Revert to original shape if rotation is invalid
            currentPiece.shape = originalShape;
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
                <div class="game-modal-content" style="max-width: 900px;">
                    <div class="game-modal-header" style="background: linear-gradient(45deg, #9b59b6, #8e44ad);">
                        <h2 style="color: white;">🧪 KRURA Games Lab</h2>
                        <span class="krura-close-btn" style="color: white; cursor: pointer; font-size: 24px;">&times;</span>
                    </div>
                    <div class="game-modal-body" style="text-align: center; padding: 20px;">
                        
                        <!-- Game Selection Screen -->
                        <div id="krura-game-selection" class="krura-selection">
                            <div style="font-size: 60px; margin-bottom: 20px;">🚀</div>
                            <h3 style="color: #9b59b6; margin-bottom: 15px;">Experimental Games Laboratory</h3>
                            <p style="color: #666; font-size: 16px; margin-bottom: 30px;">
                                Welcome to KRURA Games - where cutting-edge narratives meet interactive experiences
                            </p>
                            
                            <!-- Featured Game -->
                            <div class="featured-game-card" style="
                                background: linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #0f0f23 100%);
                                border-radius: 15px;
                                padding: 30px;
                                margin: 20px 0;
                                color: white;
                                border: 2px solid #9b59b6;
                                position: relative;
                                overflow: hidden;
                            ">
                                <div style="position: absolute; top: 10px; right: 10px; background: #e74c3c; color: white; padding: 5px 10px; border-radius: 15px; font-size: 12px; font-weight: bold;">
                                    ✨ NEW
                                </div>
                                
                                <div class="game-icon" style="font-size: 48px; margin-bottom: 15px;">🌙</div>
                                <h3 style="color: #ffd700; margin-bottom: 10px;">ETA: Echoes of Rebirth</h3>
                                <p style="color: #ccc; font-size: 14px; margin-bottom: 15px; font-style: italic;">
                                    A narrative-driven adventure through cycles of reincarnation
                                </p>
                                <p style="color: #aaa; font-size: 13px; margin-bottom: 20px; line-height: 1.4;">
                                    🎭 Experience four interconnected lives<br/>
                                    🌙 Guided by the Moon as narrator<br/>
                                    ⚔️ Face guardians and inner demons<br/>
                                    🔄 Break the curse of eternal rebirth
                                </p>
                                
                                <div style="margin-bottom: 20px;">
                                    <span style="color: #9b59b6; font-size: 12px; font-weight: bold;">
                                        🎮 Genre: Narrative RPG | ⏱️ Duration: 20-45 mins | 🎯 Difficulty: Medium
                                    </span>
                                </div>
                                
                                <button class="play-eta-btn" onclick="startETAGame()" style="
                                    background: linear-gradient(45deg, #9b59b6, #8e44ad);
                                    color: white;
                                    border: none;
                                    padding: 18px 35px;
                                    border-radius: 30px;
                                    font-size: 18px;
                                    font-weight: bold;
                                    cursor: pointer;
                                    box-shadow: 0 8px 25px rgba(155, 89, 182, 0.4);
                                    transition: all 0.3s ease;
                                    border: 2px solid transparent;
                                    position: relative;
                                    overflow: hidden;
                                " 
                                onmouseover="this.style.background='linear-gradient(45deg, #a569bd, #9b59b6)'; this.style.transform='translateY(-3px)'; this.style.boxShadow='0 12px 30px rgba(155, 89, 182, 0.6)'; this.style.borderColor='rgba(255, 255, 255, 0.4)';"
                                onmouseout="this.style.background='linear-gradient(45deg, #9b59b6, #8e44ad)'; this.style.transform='translateY(0)'; this.style.boxShadow='0 8px 25px rgba(155, 89, 182, 0.4)'; this.style.borderColor='transparent';">
                                    🌙 Enter the World of ETA
                                </button>
                                
                                <!-- Quick Start Guide -->
                                <div style="background: rgba(155, 89, 182, 0.1); border: 1px solid rgba(155, 89, 182, 0.3); border-radius: 15px; padding: 15px; margin-top: 20px;">
                                    <h5 style="color: #9b59b6; margin-bottom: 10px; font-size: 14px;">🎯 Quick Start Guide:</h5>
                                    <div style="font-size: 12px; color: #666; line-height: 1.4;">
                                        • <strong>Character Creation:</strong> Roll 4d6 drop lowest for stats<br>
                                        • <strong>Reincarnation:</strong> Keep memories across lives<br>
                                        • <strong>D&D Mechanics:</strong> Full skill checks & combat system<br>
                                        • <strong>Lunar Eclipse:</strong> Trigger to break the curse
                                    </div>
                                </div>
                            </div>
                            
                            <!-- Coming Soon Section -->
                            <div style="background: linear-gradient(45deg, #f8f9fa, #e9ecef); padding: 20px; border-radius: 15px; margin: 20px 0;">
                                <h4 style="color: #9b59b6; margin-bottom: 15px;">🚧 More Games in Development</h4>
                                <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 15px; margin-top: 15px;">
                                    <div style="background: white; padding: 15px; border-radius: 10px; border: 1px solid #ddd;">
                                        <div style="font-size: 24px; margin-bottom: 5px;">🎯</div>
                                        <h5 style="margin: 0; color: #666;">Quantum Chess</h5>
                                        <p style="font-size: 12px; color: #999; margin: 5px 0;">AI-powered strategic gameplay</p>
                                    </div>
                                    <div style="background: white; padding: 15px; border-radius: 10px; border: 1px solid #ddd;">
                                        <div style="font-size: 24px; margin-bottom: 5px;">🌟</div>
                                        <h5 style="margin: 0; color: #666;">Neural Networks</h5>
                                        <p style="font-size: 12px; color: #999; margin: 5px 0;">Train your own AI models</p>
                                    </div>
                                    <div style="background: white; padding: 15px; border-radius: 10px; border: 1px solid #ddd;">
                                        <div style="font-size: 24px; margin-bottom: 5px;">🏆</div>
                                        <h5 style="margin: 0; color: #666;">Code Battles</h5>
                                        <p style="font-size: 12px; color: #999; margin: 5px 0;">Multiplayer programming duels</p>
                                    </div>
                                </div>
                            </div>
                            
                            <p style="color: #999; font-size: 14px; margin-top: 20px;">
                                🔬 KRURA Games pushes the boundaries of interactive entertainment
                            </p>
                        </div>
                        
                        <!-- ETA Game Container -->
                        <div id="eta-game-container" class="eta-game-container" style="display: none;">
                            <!-- Game will be loaded here -->
                        </div>
                        
                        <!-- Back Button for ETA Game -->
                        <div id="eta-back-controls" style="display: none; margin-top: 20px; text-align: center;">
                            <button class="eta-choice-btn" onclick="returnToKruraSelection()" style="
                                background: linear-gradient(45deg, #2c3e50, #34495e);
                                color: white;
                                border: none;
                                padding: 15px 25px;
                                border-radius: 25px;
                                font-size: 16px;
                                font-weight: bold;
                                cursor: pointer;
                                box-shadow: 0 6px 20px rgba(52, 73, 94, 0.3);
                                transition: all 0.3s ease;
                                border: 2px solid transparent;
                            " 
                            onmouseover="this.style.background='linear-gradient(45deg, #34495e, #2c3e50)'; this.style.transform='translateY(-2px)'; this.style.boxShadow='0 8px 25px rgba(52, 73, 94, 0.5)'; this.style.borderColor='rgba(255, 255, 255, 0.3)';"
                            onmouseout="this.style.background='linear-gradient(45deg, #2c3e50, #34495e)'; this.style.transform='translateY(0)'; this.style.boxShadow='0 6px 20px rgba(52, 73, 94, 0.3)'; this.style.borderColor='transparent';">
                                🎮 ← Back to KRURA Games
                            </button>
                            
                            <div style="margin-top: 15px; padding: 12px; background: rgba(0, 0, 0, 0.3); border-radius: 12px; font-size: 12px; color: #bbb; max-width: 400px; margin-left: auto; margin-right: auto;">
                                💡 <strong>Tip:</strong> Your game progress is automatically saved. You can return anytime to continue your eternal journey.
                            </div>
                        </div>
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
        
        // Reset to selection screen
        document.getElementById('krura-game-selection').style.display = 'block';
        document.getElementById('eta-game-container').style.display = 'none';
        document.getElementById('eta-back-controls').style.display = 'none';
    }
    
    // Global functions for ETA game integration
    window.startETAGame = function() {
        // Hide the selection screen and show ETA game container
        document.getElementById('krura-game-selection').style.display = 'none';
        document.getElementById('eta-game-container').style.display = 'block';
        document.getElementById('eta-back-controls').style.display = 'block';
        
        // Show loading indicator
        const etaContainer = document.getElementById('eta-game-container');
        etaContainer.innerHTML = `
            <div class="eta-loading" style="
                display: flex;
                flex-direction: column;
                justify-content: center;
                align-items: center;
                height: 400px;
                color: #ffd700;
            ">
                <div class="eta-spinner" style="
                    width: 50px;
                    height: 50px;
                    border: 4px solid rgba(255, 215, 0, 0.3);
                    border-top: 4px solid #ffd700;
                    border-radius: 50%;
                    animation: spin 1s linear infinite;
                    margin-bottom: 20px;
                "></div>
                <h3>🌙 Loading ETA: Echoes of Rebirth</h3>
                <p style="margin-top: 10px; opacity: 0.8;">Preparing the mystical realm...</p>
            </div>
        `;
        
        // Load ETA game script dynamically
        if (!window.ETAGame) {
            const script = document.createElement('script');
            script.src = 'js/eta-game.js';
            script.onload = function() {
                setTimeout(() => {
                    initializeETAGame();
                }, 1000);
            };
            script.onerror = function() {
                showETAGameError();
            };
            document.head.appendChild(script);
        } else {
            setTimeout(() => {
                initializeETAGame();
            }, 1000);
        }
    };
    
    function initializeETAGame() {
        try {
            // Reset the ETA game container
            const etaContainer = document.getElementById('eta-game-container');
            etaContainer.innerHTML = ''; // Clear loading content
            
            if (window.ETAGame) {
                const etaGame = new window.ETAGame();
                console.log('ETA Game initialized successfully');
            } else {
                console.error('ETAGame class not found');
                showETAGameError();
            }
        } catch (error) {
            console.error('Error initializing ETA game:', error);
            showETAGameError();
        }
    }
    
    function showETAGameError() {
        const etaContainer = document.getElementById('eta-game-container');
        etaContainer.innerHTML = `
            <div style="text-align: center; color: #ffd700; padding: 40px;">
                <div style="font-size: 48px; margin-bottom: 20px;">⚠️</div>
                <h3>ETA: Echoes of Rebirth</h3>
                <p style="color: #ccc; margin: 15px 0;">Unable to load the game at this time.</p>
                <p style="color: #999; font-size: 14px;">Please check your connection and try again.</p>
                <button onclick="returnToKruraSelection()" style="
                    background: #9b59b6;
                    color: white;
                    border: none;
                    padding: 12px 20px;
                    border-radius: 20px;
                    cursor: pointer;
                    margin-top: 15px;
                ">← Back to Games</button>
            </div>
        `;
    }
    

    
    window.returnToKruraSelection = function() {
        // Smooth transition back to selection
        const etaContainer = document.getElementById('eta-game-container');
        etaContainer.style.transition = 'opacity 0.3s ease';
        etaContainer.style.opacity = '0';
        
        setTimeout(() => {
            document.getElementById('krura-game-selection').style.display = 'block';
            etaContainer.style.display = 'none';
            document.getElementById('eta-back-controls').style.display = 'none';
            etaContainer.style.opacity = '1';
            etaContainer.style.transition = '';
        }, 300);
    };
    
    window.closeKruraGames = function() {
        const kruraModal = document.getElementById('kruraGamesModal');
        if (kruraModal) {
            kruraModal.style.display = 'none';
        }
    };
    
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
