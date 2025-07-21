// Dino Game JavaScript with Firebase Integration
document.addEventListener('DOMContentLoaded', function() {
    // Modal functionality
    const gameModal = document.getElementById('gameModal');
    const openGameBtn = document.getElementById('gamesButton');
    const closeGameBtn = gameModal.querySelector('.game-close-btn');
    const gameMenu = document.getElementById('gameMenu');
    const startGameBtn = document.getElementById('startButton');
    const playerNameInput = document.getElementById('playerNameInput');
    const difficultySelect = document.getElementById('levelSelect');
    
    // Game elements
    const gameCanvas = document.getElementById('gameCanvas');
    const ctx = gameCanvas.getContext('2d');
    const scoreDisplay = document.getElementById('scoreDisplay');
    const gameOverMessage = document.getElementById('gameOverMessage');
    const restartButton = document.getElementById('restartButton');
    const leaderboardList = document.getElementById('leaderboardList');
    
    // Game state
    let isGameRunning = false;
    let gameInitialized = false;
    let playerName = '';
    let difficulty = 'medium';
    let animationId;
    
    // Game objects
    let dino = {
        x: 50,
        y: 200,
        width: 40,
        height: 40,
        color: '#2ecc71',
        velocityY: 0,
        isJumping: false,
        jumpPower: 12
    };
    
    let obstacles = [];
    let clouds = [];
    let score = 0;
    let gameSpeed = 2;
    let spawnRate = 0.005;
    
    // Difficulty settings
    const difficultySettings = {
        easy: { speed: 1.5, spawnRate: 0.003, jumpPower: 14 },
        medium: { speed: 2, spawnRate: 0.005, jumpPower: 12 },
        hard: { speed: 3, spawnRate: 0.008, jumpPower: 10 }
    };
    
    // Firebase configuration
    const firebaseConfig = {
        apiKey: "AIzaSyBNXGYcUKGm9Fy7XGJvJ5OZZ4Q8KZ_-OIs",
        authDomain: "dino-game-leaderboard.firebaseapp.com",
        databaseURL: "https://dino-game-leaderboard-default-rtdb.firebaseio.com",
        projectId: "dino-game-leaderboard",
        storageBucket: "dino-game-leaderboard.appspot.com",
        messagingSenderId: "123456789012",
        appId: "1:123456789012:web:abcdefghijklmnopqrstuvw"
    };
    
    // Initialize Firebase (mock implementation for demo)
    let database = null;
    
    function initFirebase() {
        try {
            if (typeof firebase !== 'undefined') {
                firebase.initializeApp(firebaseConfig);
                database = firebase.database();
                console.log('Firebase initialized successfully');
            } else {
                console.warn('Firebase SDK not loaded, using mock data');
                database = null;
            }
        } catch (error) {
            console.error('Firebase initialization failed:', error);
            database = null;
        }
    }
    
    // Modal event listeners
    openGameBtn.addEventListener('click', function() {
        gameModal.style.display = 'block';
        document.body.style.overflow = 'hidden';
        if (!gameInitialized) {
            initGame();
        }
    });
    
    closeGameBtn.addEventListener('click', closeModal);
    
    gameModal.addEventListener('click', function(e) {
        if (e.target === gameModal) {
            closeModal();
        }
    });
    
    function closeModal() {
        gameModal.style.display = 'none';
        document.body.style.overflow = 'auto';
        if (isGameRunning) {
            pauseGame();
        }
    }
    
    // Enable start button when name is entered
    playerNameInput.addEventListener('input', function() {
        if (playerNameInput.value.trim().length > 0) {
            startGameBtn.disabled = false;
        } else {
            startGameBtn.disabled = true;
        }
    });
    
    // Initialize game
    function initGame() {
        gameCanvas.width = gameCanvas.offsetWidth;
        gameCanvas.height = gameCanvas.offsetHeight;
        initFirebase();
        loadLeaderboard();
        gameInitialized = true;
    }
    
    // Start game
    startGameBtn.addEventListener('click', function() {
        playerName = playerNameInput.value.trim();
        if (!playerName) {
            alert('Please enter your name!');
            return;
        }
        
        difficulty = difficultySelect.value;
        const settings = difficultySettings[difficulty];
        gameSpeed = settings.speed;
        spawnRate = settings.spawnRate;
        dino.jumpPower = settings.jumpPower;
        
        gameMenu.style.display = 'none';
        startGame();
    });
    
    function startGame() {
        isGameRunning = true;
        score = 0;
        obstacles = [];
        clouds = [];
        
        // Reset dino position
        dino.x = 50;
        dino.y = gameCanvas.height - 100;
        dino.velocityY = 0;
        dino.isJumping = false;
        
        // Show game elements
        scoreDisplay.style.display = 'block';
        gameOverMessage.style.display = 'none';
        restartButton.style.display = 'none';
        
        // Start game loop
        gameLoop();
        
        // Add clouds for background
        for (let i = 0; i < 5; i++) {
            clouds.push({
                x: Math.random() * gameCanvas.width,
                y: Math.random() * (gameCanvas.height * 0.3),
                width: 30 + Math.random() * 20,
                height: 15 + Math.random() * 10,
                speed: 0.5 + Math.random() * 0.5
            });
        }
    }
    
    // Game loop
    function gameLoop() {
        if (!isGameRunning) return;
        
        update();
        draw();
        
        animationId = requestAnimationFrame(gameLoop);
    }
    
    function update() {
        // Update score
        score += 0.1;
        scoreDisplay.textContent = `Score: ${Math.floor(score)}`;
        
        // Update dino physics
        if (dino.isJumping) {
            dino.velocityY -= 0.8; // gravity
            dino.y -= dino.velocityY;
            
            // Check if landed
            if (dino.y >= gameCanvas.height - 100) {
                dino.y = gameCanvas.height - 100;
                dino.velocityY = 0;
                dino.isJumping = false;
            }
        }
        
        // Spawn obstacles
        if (Math.random() < spawnRate) {
            obstacles.push({
                x: gameCanvas.width,
                y: gameCanvas.height - 80,
                width: 20 + Math.random() * 20,
                height: 40 + Math.random() * 20,
                color: '#e74c3c'
            });
        }
        
        // Update obstacles
        for (let i = obstacles.length - 1; i >= 0; i--) {
            obstacles[i].x -= gameSpeed;
            
            // Remove off-screen obstacles
            if (obstacles[i].x + obstacles[i].width < 0) {
                obstacles.splice(i, 1);
            }
            // Check collision
            else if (checkCollision(dino, obstacles[i])) {
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
        
        // Increase difficulty over time
        if (Math.floor(score) % 100 === 0 && Math.floor(score) > 0) {
            gameSpeed += 0.1;
            spawnRate += 0.0005;
        }
    }
    
    function draw() {
        // Clear canvas
        ctx.fillStyle = '#87CEEB';
        ctx.fillRect(0, 0, gameCanvas.width, gameCanvas.height);
        
        // Draw ground
        ctx.fillStyle = '#90EE90';
        ctx.fillRect(0, gameCanvas.height - 60, gameCanvas.width, 60);
        
        // Draw clouds
        ctx.fillStyle = '#fff';
        clouds.forEach(cloud => {
            drawCloud(cloud.x, cloud.y, cloud.width, cloud.height);
        });
        
        // Draw dino
        ctx.fillStyle = dino.color;
        ctx.fillRect(dino.x, dino.y, dino.width, dino.height);
        
        // Draw dino eyes
        ctx.fillStyle = '#fff';
        ctx.fillRect(dino.x + 8, dino.y + 8, 8, 8);
        ctx.fillRect(dino.x + 20, dino.y + 8, 8, 8);
        ctx.fillStyle = '#000';
        ctx.fillRect(dino.x + 10, dino.y + 10, 4, 4);
        ctx.fillRect(dino.x + 22, dino.y + 10, 4, 4);
        
        // Draw obstacles
        obstacles.forEach(obstacle => {
            ctx.fillStyle = obstacle.color;
            ctx.fillRect(obstacle.x, obstacle.y, obstacle.width, obstacle.height);
        });
    }
    
    function drawCloud(x, y, width, height) {
        ctx.beginPath();
        ctx.arc(x, y, height/2, 0, Math.PI * 2);
        ctx.arc(x + width/3, y, height/2, 0, Math.PI * 2);
        ctx.arc(x + 2*width/3, y, height/2, 0, Math.PI * 2);
        ctx.arc(x + width, y, height/2, 0, Math.PI * 2);
        ctx.fill();
    }
    
    function checkCollision(rect1, rect2) {
        return rect1.x < rect2.x + rect2.width &&
               rect1.x + rect1.width > rect2.x &&
               rect1.y < rect2.y + rect2.height &&
               rect1.y + rect1.height > rect2.y;
    }
    
    function endGame() {
        isGameRunning = false;
        gameOverMessage.style.display = 'block';
        restartButton.style.display = 'block';
        
        // Save score to leaderboard
        saveScore(playerName, Math.floor(score), difficulty);
    }
    
    function pauseGame() {
        isGameRunning = false;
        if (animationId) {
            cancelAnimationFrame(animationId);
        }
    }
    
    // Controls
    document.addEventListener('keydown', function(e) {
        if (!isGameRunning) return;
        
        if (e.code === 'Space' || e.code === 'ArrowUp') {
            e.preventDefault();
            jump();
        }
    });
    
    gameCanvas.addEventListener('click', function() {
        if (isGameRunning) {
            jump();
        }
    });
    
    function jump() {
        if (!dino.isJumping) {
            dino.isJumping = true;
            dino.velocityY = dino.jumpPower;
        }
    }
    
    // Restart game
    restartButton.addEventListener('click', function() {
        gameMenu.style.display = 'flex';
        restartButton.style.display = 'none';
        gameOverMessage.style.display = 'none';
        scoreDisplay.style.display = 'none';
    });
    
    // Leaderboard functions
    function saveScore(name, score, difficulty) {
        const scoreData = {
            name: name,
            score: score,
            difficulty: difficulty,
            timestamp: Date.now()
        };
        
        if (database) {
            database.ref('leaderboard').push(scoreData)
                .then(() => {
                    console.log('Score saved successfully');
                    loadLeaderboard();
                })
                .catch(error => {
                    console.error('Error saving score:', error);
                    updateLeaderboardUI(getMockLeaderboard());
                });
        } else {
            // Mock save for demo
            const mockData = getMockLeaderboard();
            mockData.push(scoreData);
            mockData.sort((a, b) => b.score - a.score);
            updateLeaderboardUI(mockData.slice(0, 10));
        }
    }
    
    function loadLeaderboard() {
        if (database) {
            database.ref('leaderboard')
                .orderByChild('score')
                .limitToLast(10)
                .once('value')
                .then(snapshot => {
                    const scores = [];
                    snapshot.forEach(child => {
                        scores.push(child.val());
                    });
                    scores.reverse(); // Highest scores first
                    updateLeaderboardUI(scores);
                })
                .catch(error => {
                    console.error('Error loading leaderboard:', error);
                    updateLeaderboardUI(getMockLeaderboard());
                });
        } else {
            // Load mock data for demo
            updateLeaderboardUI(getMockLeaderboard());
        }
    }
    
    function getMockLeaderboard() {
        return [
            { name: 'CodeMaster', score: 850, difficulty: 'hard' },
            { name: 'DinoHunter', score: 720, difficulty: 'medium' },
            { name: 'JumpKing', score: 680, difficulty: 'hard' },
            { name: 'Player1', score: 450, difficulty: 'medium' },
            { name: 'Rookie', score: 320, difficulty: 'easy' }
        ];
    }
    
    function updateLeaderboardUI(scores) {
        leaderboardList.innerHTML = '';
        
        scores.forEach((score, index) => {
            const li = document.createElement('li');
            li.innerHTML = `
                <span>${index + 1}. ${score.name}</span>
                <span>${score.score}</span>
            `;
            
            // Highlight top 3
            if (index < 3) {
                const colors = ['#ffd700', '#c0c0c0', '#cd7f32'];
                li.style.backgroundColor = colors[index];
                li.style.color = '#000';
            }
            
            leaderboardList.appendChild(li);
        });
    }
    
    // Handle window resize
    window.addEventListener('resize', function() {
        if (gameInitialized) {
            gameCanvas.width = gameCanvas.offsetWidth;
            gameCanvas.height = gameCanvas.offsetHeight;
            
            // Reset dino position
            if (!isGameRunning) {
                dino.y = gameCanvas.height - 100;
            }
        }
    });
    
    // Prevent page scroll on spacebar
    window.addEventListener('keydown', function(e) {
        if (e.code === 'Space' && gameModal.style.display === 'block') {
            e.preventDefault();
        }
    });
});
