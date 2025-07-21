// Multi-Game Center - Complete Game Collection
document.addEventListener('DOMContentLoaded', function() {
    // Modal and UI elements
    const gameModal = document.getElementById('gameModal');
    const openGameBtn = document.getElementById('gamesButton');
    const closeGameBtn = gameModal.querySelector('.game-close-btn');
    const gameSelection = document.getElementById('gameSelection');
    const gameContainer = document.getElementById('gameContainer');
    const backToMenu = document.getElementById('backToMenu');
    const currentGameTitle = document.getElementById('currentGameTitle');
    
    // Game elements
    const gameCanvas = document.getElementById('gameCanvas');
    const ctx = gameCanvas.getContext('2d');
    const gameScore = document.getElementById('gameScore');
    const gameInstructions = document.getElementById('gameInstructions');
    const gameOverMessage = document.getElementById('gameOverMessage');
    const restartGameBtn = document.getElementById('restartGameBtn');
    
    // Game state
    let currentGame = null;
    let gameRunning = false;
    let animationId;
    let gameData = {};
    let playerScore = 0;
    
    // Game configurations
    const gameConfigs = {
        dino: {
            title: 'Dino Jump',
            instructions: 'Press SPACE or click to jump over obstacles',
            colors: { bg: '#87CEEB', ground: '#90EE90', player: '#2ecc71', obstacle: '#e74c3c' }
        },
        snake: {
            title: 'Snake',
            instructions: 'Use ARROW KEYS to move and eat red apples',
            colors: { bg: '#000', snake: '#0f0', food: '#f00', wall: '#fff' }
        },
        tetris: {
            title: 'Tetris',
            instructions: 'Arrow keys to move, UP to rotate, DOWN to drop faster',
            colors: { bg: '#000', blocks: ['#ff0', '#f0f', '#0ff', '#0f0', '#f80', '#00f', '#f00'] }
        },
        pong: {
            title: 'Pong',
            instructions: 'UP/DOWN arrow keys to move paddle, first to 10 points wins',
            colors: { bg: '#000', paddle: '#fff', ball: '#fff', text: '#fff' }
        },
        breakout: {
            title: 'Breakout',
            instructions: 'LEFT/RIGHT arrow keys to move paddle and break all bricks',
            colors: { bg: '#000', paddle: '#fff', ball: '#fff', brick: '#f80' }
        },
        space: {
            title: 'Space Shooter',
            instructions: 'Arrow keys to move, SPACE to shoot asteroids',
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
    
    // Game selection - Handle both card and button clicks
    document.querySelectorAll('.game-card').forEach(card => {
        card.addEventListener('click', (e) => {
            e.preventDefault();
            e.stopPropagation();
            const gameType = card.dataset.game;
            console.log('Starting game:', gameType);
            startGame(gameType);
        });
    });
    
    // Additional event listeners for the play buttons
    document.querySelectorAll('.select-game-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.preventDefault();
            e.stopPropagation();
            const gameCard = btn.closest('.game-card');
            const gameType = gameCard.dataset.game;
            console.log('Starting game via button:', gameType);
            startGame(gameType);
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
        
        // Stop current game first
        stopGame();
        
        // Hide game container with animation
        if (gameContainer) {
            gameContainer.style.opacity = '0';
            gameContainer.style.pointerEvents = 'none';
            setTimeout(() => {
                gameContainer.style.display = 'none';
            }, 300);
            console.log('Game container hidden');
        }
        
        // Show game selection menu with animation
        if (gameSelection) {
            gameSelection.style.display = 'block';
            setTimeout(() => {
                gameSelection.style.opacity = '1';
                gameSelection.style.pointerEvents = 'auto';
            }, 50);
            console.log('Game selection display set to block');
        } else {
            console.error('Game selection element not found');
        }
    }
    
    function startGame(gameType) {
        console.log('Starting game:', gameType);
        currentGame = gameType;
        const config = gameConfigs[gameType];
        
        // Hide game selection menu with animation
        if (gameSelection) {
            gameSelection.style.opacity = '0';
            gameSelection.style.pointerEvents = 'none';
            setTimeout(() => {
                gameSelection.style.display = 'none';
            }, 300);
            console.log('Game selection menu hidden');
        }
        
        // Show game container with animation
        if (gameContainer) {
            gameContainer.style.display = 'flex';
            setTimeout(() => {
                gameContainer.style.opacity = '1';
                gameContainer.style.pointerEvents = 'auto';
            }, 50);
            console.log('Game container shown');
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
        
        if (gameOverMessage) {
            gameOverMessage.style.display = 'none';
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
        
        // Set canvas size
        gameCanvas.width = gameCanvas.offsetWidth;
        gameCanvas.height = gameCanvas.offsetHeight;
        
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
        gameData = {
            dino: { x: 50, y: gameCanvas.height - 100, width: 40, height: 40, velocityY: 0, jumping: false },
            obstacles: [],
            clouds: [],
            speed: 3,
            spawnRate: 0.008
        };
        
        // Add clouds
        for (let i = 0; i < 5; i++) {
            gameData.clouds.push({
                x: Math.random() * gameCanvas.width,
                y: Math.random() * (gameCanvas.height * 0.3),
                width: 30 + Math.random() * 20,
                height: 15 + Math.random() * 10,
                speed: 0.5 + Math.random() * 0.5
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
        gameData = {
            leftPaddle: { x: 20, y: gameCanvas.height / 2 - 50, width: 10, height: 100, speed: 5 },
            rightPaddle: { x: gameCanvas.width - 30, y: gameCanvas.height / 2 - 50, width: 10, height: 100, speed: 5 },
            ball: { x: gameCanvas.width / 2, y: gameCanvas.height / 2, dx: 5, dy: 3, radius: 8 },
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
            paddle: { x: gameCanvas.width / 2 - 50, y: gameCanvas.height - 30, width: 100, height: 10, speed: 8 },
            ball: { x: gameCanvas.width / 2, y: gameCanvas.height - 50, dx: 4, dy: -4, radius: 8 },
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
        gameData = {
            player: { x: gameCanvas.width / 2 - 15, y: gameCanvas.height - 50, width: 30, height: 30, speed: 6 },
            bullets: [],
            enemies: [],
            stars: [],
            enemySpawnRate: 0.02
        };
        
        // Generate stars
        for (let i = 0; i < 50; i++) {
            gameData.stars.push({
                x: Math.random() * gameCanvas.width,
                y: Math.random() * gameCanvas.height,
                speed: Math.random() * 2 + 1
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
                speed: Math.random() * 3 + 2
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
        gameOverMessage.style.display = 'block';
        restartGameBtn.style.display = 'block';
        
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
