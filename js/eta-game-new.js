// ETA: Echoes of Rebirth - Diamond Rush Style Game Implementation
// Grid-based maze game with boulder physics and character movement

class ETAGame {
    constructor() {
        this.canvas = null;
        this.ctx = null;
        this.gameState = 'character-selection'; // character-selection, story-intro, gameplay, quiz, game-over
        this.selectedCharacter = null;
        this.currentLevel = 1;
        this.score = 0;
        this.lives = 3;
        this.diamondsCollected = 0;
        this.totalDiamonds = 0;
        this.quizQuestions = [];
        this.currentQuestionIndex = 0;
        
        // Grid-based game constants (Diamond Rush style)
        this.GRID_SIZE = 32;
        this.MAP_WIDTH = 25;
        this.MAP_HEIGHT = 18;
        this.MOVE_SPEED = 8; // Grid movement speed
        
        // Game timing
        this.lastMoveTime = 0;
        this.moveDelay = 200; // Milliseconds between moves
        this.animationFrame = 0;
        
        // Input handling
        this.keys = {};
        this.isMoving = false;
        
        // Game map (Diamond Rush style grid)
        // 'W' = Wall, 'D' = Diamond, 'B' = Boulder, 'E' = Enemy, ' ' = Empty, 'P' = Player, 'X' = Exit
        this.gameMap = [];
        this.player = { x: 1, y: 1, targetX: 1, targetY: 1, moving: false };
        this.boulders = [];
        this.enemies = [];
        this.gravity = true; // Boulders fall down
        
        // Character data based on the story
        this.characters = {
            hero: {
                name: "Hero (The Taxi Driver)",
                description: "A determined taxi driver saving for his sister's treatment. Strong and resilient.",
                color: "#3498db",
                abilities: { strength: 9, speed: 7, magic: 3, wisdom: 6 },
                story: "Once a taxi driver in Hyderabad, Hero's life was dedicated to saving his sister from cancer.",
                specialPower: "Double Jump - Can perform powerful double jumps to overcome obstacles"
            },
            fran: {
                name: "Fran (The Archaeologist)",
                description: "An English archaeologist fascinated by Indian history and ancient mysteries.",
                color: "#e67e22",
                abilities: { strength: 5, speed: 6, magic: 7, wisdom: 9 },
                story: "Francis Ryder Junior, an archaeologist from England, came to India seeking ancient artifacts.",
                specialPower: "Ancient Knowledge - Can reveal hidden paths and secrets"
            },
            samrat: {
                name: "Samrat (The Tribal King)",
                description: "A fierce tribal king from the African Amazon, known for his hunting prowess.",
                color: "#e74c3c",
                abilities: { strength: 10, speed: 8, magic: 4, wisdom: 4 },
                story: "A tribal king turned treasure hunter, Samrat's strength and combat skills made him legendary.",
                specialPower: "Warrior's Rage - Can destroy certain obstacles with brute force"
            },
            mantra: {
                name: "Mantra (The Magician)",
                description: "A gifted magician cursed to change gender, seeking to break the curse.",
                color: "#9b59b6",
                abilities: { strength: 6, speed: 5, magic: 10, wisdom: 8 },
                story: "Born with a unique curse that transforms them daily, Mantra became the world's greatest magician.",
                specialPower: "Shape Shift - Can transform to avoid certain obstacles"
            },
            chandu: {
                name: "Chandu (The Astronaut)",
                description: "The astronaut who heard the original story from the Moon itself.",
                color: "#1abc9c",
                abilities: { strength: 7, speed: 9, magic: 6, wisdom: 7 },
                story: "An astronaut from the Chandrayaan 32 mission who became trapped on the Moon.",
                specialPower: "Lunar Boost - Can float briefly like in low gravity"
            }
        };

        // Quiz questions based on the story
        this.storyQuestions = [
            {
                question: "What year did the Chandrayaan 32 mission take place?",
                options: ["2050", "2053", "2055", "2060"],
                correct: 1,
                explanation: "The Chandrayaan 32 mission was launched on June 2nd, 2053."
            },
            {
                question: "Who told the story to Chandu on the Moon?",
                options: ["A fellow astronaut", "Chandamama (The Moon)", "Mission Control", "An alien"],
                correct: 1,
                explanation: "Chandamama (the Moon personified) told Chandu the complete story."
            },
            {
                question: "What was Hero's profession before the treasure hunt?",
                options: ["Archaeologist", "Magician", "Taxi driver", "Tribal king"],
                correct: 2,
                explanation: "Hero was a taxi driver in Hyderabad, saving money for his sister's treatment."
            },
            {
                question: "What curse affected Mantra?",
                options: ["Invisibility", "Gender transformation", "Eternal hunger", "Memory loss"],
                correct: 1,
                explanation: "Mantra was cursed to change from female to male daily."
            },
            {
                question: "How many maps did the king create and distribute?",
                options: ["3", "4", "5", "6"],
                correct: 2,
                explanation: "The king created 5 maps total - 4 were given to birds and 1 he kept."
            }
        ];

        this.init();
    }

    init() {
        console.log('ETAGame init() called');
        this.createGameContainer();
        this.setupEventListeners();
        this.loadAssets();
        this.gameLoop();
    }

    createGameContainer() {
        console.log('Creating game container');
        const container = document.getElementById('eta-game-container');
        if (!container) {
            console.error('eta-game-container not found!');
            return;
        }

        console.log('Container found, creating game UI');
        container.innerHTML = `
            <div id="eta-game-screen" style="
                width: 100%;
                height: 700px;
                background: linear-gradient(135deg, #0c0c0c 0%, #1a1a2e 50%, #16213e 100%);
                border-radius: 20px;
                overflow-y: auto;
                overflow-x: hidden;
                position: relative;
                border: 3px solid #ffd700;
            ">
                <!-- Character Selection Screen -->
                <div id="character-selection" class="eta-screen active" style="
                    height: 100%;
                    overflow-y: auto;
                    overflow-x: hidden;
                ">
                    <div style="text-align: center; padding: 40px 20px; color: white; min-height: 100%;">
                        <h2 style="color: #ffd700; margin-bottom: 30px; font-size: 2.5em;">
                            🌙 Choose Your Eternal Soul
                        </h2>
                        <p style="color: #ccc; margin-bottom: 40px; font-size: 1.2em;">
                            Select a character to begin your journey through the cycles of rebirth
                        </p>
                        <div id="character-grid" style="
                            display: grid;
                            grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
                            gap: 20px;
                            max-width: 1200px;
                            margin: 0 auto;
                            padding-bottom: 40px;
                        "></div>
                    </div>
                </div>

                <!-- Story Introduction Screen -->
                <div id="story-intro" class="eta-screen" style="
                    height: 100%;
                    overflow-y: auto;
                    overflow-x: hidden;
                ">
                    <div style="padding: 40px; color: white; text-align: center; min-height: 100%;">
                        <h2 style="color: #ffd700; margin-bottom: 20px;">Your Story Begins...</h2>
                        <div id="story-content" style="
                            background: rgba(0,0,0,0.5);
                            padding: 30px;
                            border-radius: 15px;
                            margin: 20px 0;
                            max-width: 600px;
                            margin-left: auto;
                            margin-right: auto;
                        ">
                            <div id="character-story" style="line-height: 1.6; font-size: 1.1em;"></div>
                        </div>
                        <button id="start-adventure" class="eta-btn" style="
                            background: linear-gradient(45deg, #ffd700, #ffed4e);
                            color: #000;
                            border: none;
                            padding: 15px 30px;
                            border-radius: 25px;
                            font-size: 1.2em;
                            font-weight: bold;
                            cursor: pointer;
                            margin-top: 20px;
                        ">Begin Your Journey 🎮</button>
                    </div>
                </div>

                <!-- Game Canvas Screen -->
                <div id="eta-canvas-screen" class="eta-screen" style="
                    height: 100%;
                    overflow: hidden;
                    position: relative;
                    display: flex;
                    flex-direction: column;
                ">
                    <!-- Game HUD -->
                    <div id="game-hud" style="
                        background: rgba(0,0,0,0.8);
                        padding: 10px 20px;
                        color: white;
                        display: flex;
                        justify-content: space-between;
                        align-items: center;
                        font-size: 14px;
                        border-bottom: 2px solid #ffd700;
                        flex-shrink: 0;
                    ">
                        <div style="display: flex; gap: 20px;">
                            <div>💎 Diamonds: <span id="diamond-count">0</span>/<span id="total-diamonds">0</span></div>
                            <div>❤️ Lives: <span id="lives-count">3</span></div>
                        </div>
                        <div style="display: flex; gap: 20px;">
                            <div>🏆 Score: <span id="score-display">0</span></div>
                            <div>🌙 Level: <span id="level-display">1</span></div>
                        </div>
                    </div>
                    
                    <!-- Game Canvas -->
                    <canvas id="eta-canvas" width="800" height="576" style="
                        width: 100%;
                        height: calc(100% - 60px);
                        background: #2c3e50;
                        display: block;
                        flex-grow: 1;
                        image-rendering: pixelated;
                    "></canvas>
                </div>

                <!-- Quiz Screen -->
                <div id="quiz-screen" class="eta-screen" style="
                    height: 100%;
                    overflow-y: auto;
                    overflow-x: hidden;
                ">
                    <div style="padding: 40px; color: white; text-align: center; min-height: 100%;">
                        <h2 style="color: #ffd700; margin-bottom: 20px;">Test Your Knowledge</h2>
                        <div id="quiz-content" style="
                            background: rgba(0,0,0,0.5);
                            padding: 30px;
                            border-radius: 15px;
                            margin: 20px auto;
                            max-width: 700px;
                        ">
                            <div id="question-progress" style="margin-bottom: 20px; color: #ccc;"></div>
                            <div id="question-text" style="font-size: 1.3em; margin-bottom: 30px;"></div>
                            <div id="quiz-options" style="display: grid; gap: 15px;"></div>
                            <div id="quiz-explanation" style="
                                margin-top: 20px;
                                padding: 15px;
                                background: rgba(255,215,0,0.1);
                                border-radius: 10px;
                                display: none;
                            "></div>
                            <button id="continue-game" class="eta-btn" style="
                                margin-top: 20px;
                                display: none;
                            ">Continue Adventure →</button>
                        </div>
                    </div>
                </div>

                <!-- Game Over Screen -->
                <div id="game-over-screen" class="eta-screen">
                    <div style="padding: 40px; color: white; text-align: center;">
                        <h2 style="color: #ffd700; margin-bottom: 20px;">The Cycle Continues...</h2>
                        <div id="final-stats" style="
                            background: rgba(0,0,0,0.5);
                            padding: 30px;
                            border-radius: 15px;
                            margin: 20px auto;
                            max-width: 500px;
                        ">
                            <div id="final-score"></div>
                        </div>
                        <div style="margin-top: 30px;">
                            <button id="restart-game" class="eta-btn">🔄 Try Another Life</button>
                            <button id="return-to-menu" class="eta-btn">🏠 Return to Games</button>
                        </div>
                    </div>
                </div>
            </div>
        `;

        this.canvas = document.getElementById('eta-canvas');
        this.ctx = this.canvas.getContext('2d');
        
        this.showCharacterSelection();
        
        // Setup event listeners for buttons
        document.getElementById('start-adventure').onclick = () => this.startGame();
        document.getElementById('restart-game').onclick = () => this.restart();
        document.getElementById('return-to-menu').onclick = () => this.returnToMenu();
        document.getElementById('continue-game').onclick = () => this.continueFromQuiz();
    }

    showCharacterSelection() {
        this.hideAllScreens();
        document.getElementById('character-selection').style.display = 'block';
        
        const grid = document.getElementById('character-grid');
        grid.innerHTML = '';
        
        Object.entries(this.characters).forEach(([key, character]) => {
            const card = document.createElement('div');
            card.className = 'character-card';
            card.style.cssText = `
                background: linear-gradient(135deg, ${character.color}33, ${character.color}11);
                border: 2px solid ${character.color};
                border-radius: 15px;
                padding: 20px;
                cursor: pointer;
                transition: all 0.3s ease;
                text-align: center;
                position: relative;
                overflow: hidden;
            `;
            
            card.innerHTML = `
                <div style="font-size: 1em; margin-bottom: 15px; height: 60px; display: flex; align-items: center; justify-content: center;">
                    <canvas width="50" height="50" id="char-preview-${key}" style="border: 2px solid ${character.color}; border-radius: 8px; background: #f0f0f0;"></canvas>
                </div>
                <h3 style="color: ${character.color}; margin-bottom: 10px; font-size: 1.1em;">${character.name}</h3>
                <p style="color: #ccc; font-size: 0.9em; margin-bottom: 15px;">${character.description}</p>
                <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 10px; font-size: 0.8em;">
                    <div>💪 ${character.abilities.strength}/10</div>
                    <div>⚡ ${character.abilities.speed}/10</div>
                    <div>🔮 ${character.abilities.magic}/10</div>
                    <div>🧠 ${character.abilities.wisdom}/10</div>
                </div>
                <div style="
                    margin-top: 15px;
                    padding: 10px;
                    background: rgba(0,0,0,0.3);
                    border-radius: 8px;
                    font-size: 0.8em;
                    color: #ffd700;
                ">${character.specialPower}</div>
            `;
            
            card.addEventListener('click', () => this.selectCharacter(key));
            card.addEventListener('mouseenter', () => {
                card.style.transform = 'translateY(-5px)';
                card.style.boxShadow = `0 10px 30px ${character.color}44`;
            });
            card.addEventListener('mouseleave', () => {
                card.style.transform = 'translateY(0)';
                card.style.boxShadow = 'none';
            });
            
            grid.appendChild(card);
            
            // Draw character preview
            setTimeout(() => {
                const previewCanvas = document.getElementById(`char-preview-${key}`);
                if (previewCanvas) {
                    const previewCtx = previewCanvas.getContext('2d');
                    this.drawCharacterSprite(previewCtx, 25, 35, character, 25);
                }
            }, 100);
        });
    }

    drawCharacterSprite(ctx, x, y, character, size) {
        const headSize = size * 0.6;
        const bodySize = size * 0.8;
        
        // Head
        ctx.fillStyle = '#FFDBAC';
        ctx.fillRect(x - headSize/2, y - size, headSize, headSize);
        
        // Hat/Helmet
        ctx.fillStyle = character.color;
        ctx.fillRect(x - headSize/2 - 2, y - size - 4, headSize + 4, headSize/2);
        
        // Body
        ctx.fillStyle = character.color;
        ctx.fillRect(x - bodySize/2, y - size + headSize, bodySize, bodySize);
        
        // Eyes
        ctx.fillStyle = '#000';
        ctx.fillRect(x - headSize/4, y - size + headSize/2 - 2, 2, 2);
        ctx.fillRect(x + headSize/4 - 2, y - size + headSize/2 - 2, 2, 2);
    }

    selectCharacter(characterKey) {
        this.selectedCharacter = this.characters[characterKey];
        this.showStoryIntro();
    }

    showStoryIntro() {
        this.hideAllScreens();
        document.getElementById('story-intro').style.display = 'block';
        
        const storyContent = document.getElementById('character-story');
        storyContent.innerHTML = `
            <div style="text-align: center; margin-bottom: 20px;">
                <div style="margin-bottom: 15px;">
                    <canvas width="80" height="80" id="story-char-preview" style="border: 3px solid ${this.selectedCharacter.color}; border-radius: 12px; background: #f0f0f0;"></canvas>
                </div>
                <h3 style="color: ${this.selectedCharacter.color}; margin-bottom: 15px;">${this.selectedCharacter.name}</h3>
            </div>
            <p style="line-height: 1.8; color: #ddd;">${this.selectedCharacter.story}</p>
            <div style="margin-top: 20px; padding: 15px; background: rgba(255,215,0,0.1); border-radius: 10px;">
                <strong style="color: #ffd700;">Special Ability:</strong><br>
                ${this.selectedCharacter.specialPower}
            </div>
        `;
        
        // Draw character in story preview
        setTimeout(() => {
            const storyCanvas = document.getElementById('story-char-preview');
            if (storyCanvas) {
                const storyCtx = storyCanvas.getContext('2d');
                this.drawCharacterSprite(storyCtx, 40, 60, this.selectedCharacter, 40);
            }
        }, 100);
    }

    startGame() {
        this.hideAllScreens();
        this.gameState = 'gameplay';
        document.getElementById('eta-canvas-screen').style.display = 'block';
        
        this.initializeLevel();
        this.updateHUD();
    }

    initializeLevel() {
        // Create Diamond Rush style level
        this.createLevel();
        this.player = { x: 1, y: 1, targetX: 1, targetY: 1, moving: false };
        this.boulders = [];
        this.enemies = [];
        this.diamondsCollected = 0;
        this.countTotalDiamonds();
    }

    createLevel() {
        // Diamond Rush style level layout
        const levels = [
            [
                "WWWWWWWWWWWWWWWWWWWWWWWWW",
                "WP                      W",
                "W  WWWWWWWWWW  WWWWWWW  W",
                "W  D      B      D    W W",
                "W  WWWWWWWWWWWWWWWWW  W W",
                "W                     W W",
                "W  WWWWWWWWWW  WWWWWWWW W",
                "W  D    E      D        W",
                "W  WWWWWWWWWWWWWWWWWWWWWW",
                "W                       W",
                "W  WWWWW   WWWWW   WWWW W",
                "W  B   D   B   D   B  D W",
                "W  WWWWWWWWWWWWWWWWWWWWWW",
                "W                       W",
                "W  WWWWWWWWWWWWWWWWWWWW W",
                "W  D                 D  W",
                "W                     XW",
                "WWWWWWWWWWWWWWWWWWWWWWWWW"
            ],
            [
                "WWWWWWWWWWWWWWWWWWWWWWWWW",
                "WP  D   B   D   B   D   W",
                "W  WWWWWWWWWWWWWWWWWWWW W",
                "W                       W",
                "W  WWWW  WWWW  WWWW  WW W",
                "W   D  E  D  E  D      W",
                "WWWWWWWWWWWWWWWWWWWWWWWWW",
                "W                       W",
                "W  WWWWWWWWWWWWWWWWWWWW W",
                "W  B   D   B   D   B    W",
                "W  WWWWWWWWWWWWWWWWWWWWWW",
                "W                       W",
                "W  WWWWW   WWWWW   WWWW W",
                "W   D  E    D  E    D   W",
                "W  WWWWWWWWWWWWWWWWWWWWWW",
                "W                       W",
                "W                     XW",
                "WWWWWWWWWWWWWWWWWWWWWWWWW"
            ]
        ];

        const levelIndex = Math.min(this.currentLevel - 1, levels.length - 1);
        this.gameMap = levels[levelIndex].map(row => row.split(''));
        
        // Find player starting position
        for (let y = 0; y < this.gameMap.length; y++) {
            for (let x = 0; x < this.gameMap[y].length; x++) {
                if (this.gameMap[y][x] === 'P') {
                    this.player.x = x;
                    this.player.y = y;
                    this.player.targetX = x;
                    this.player.targetY = y;
                    this.gameMap[y][x] = ' '; // Clear player position
                    break;
                }
            }
        }
    }

    countTotalDiamonds() {
        this.totalDiamonds = 0;
        for (let y = 0; y < this.gameMap.length; y++) {
            for (let x = 0; x < this.gameMap[y].length; x++) {
                if (this.gameMap[y][x] === 'D') {
                    this.totalDiamonds++;
                }
            }
        }
    }

    gameLoop() {
        if (this.gameState === 'gameplay') {
            this.update();
            this.render();
        }
        requestAnimationFrame(() => this.gameLoop());
    }

    update() {
        this.animationFrame++;
        
        // Handle movement input
        if (!this.player.moving && Date.now() - this.lastMoveTime > this.moveDelay) {
            this.handleMovement();
        }
        
        // Apply boulder physics
        this.updateBoulders();
        
        // Update enemies
        this.updateEnemies();
        
        // Check collisions
        this.checkCollisions();
        
        // Check level completion
        this.checkLevelComplete();
    }

    handleMovement() {
        let newX = this.player.x;
        let newY = this.player.y;
        
        if (this.keys['ArrowLeft'] || this.keys['KeyA']) {
            newX = Math.max(0, this.player.x - 1);
        } else if (this.keys['ArrowRight'] || this.keys['KeyD']) {
            newX = Math.min(this.gameMap[0].length - 1, this.player.x + 1);
        } else if (this.keys['ArrowUp'] || this.keys['KeyW']) {
            newY = Math.max(0, this.player.y - 1);
        } else if (this.keys['ArrowDown'] || this.keys['KeyS']) {
            newY = Math.min(this.gameMap.length - 1, this.player.y + 1);
        }
        
        // Check if movement is valid
        if (newX !== this.player.x || newY !== this.player.y) {
            if (this.canMoveTo(newX, newY)) {
                this.player.x = newX;
                this.player.y = newY;
                this.lastMoveTime = Date.now();
                
                // Collect diamond
                if (this.gameMap[newY][newX] === 'D') {
                    this.gameMap[newY][newX] = ' ';
                    this.diamondsCollected++;
                    this.score += 100;
                    this.updateHUD();
                }
            }
        }
    }

    canMoveTo(x, y) {
        if (x < 0 || x >= this.gameMap[0].length || y < 0 || y >= this.gameMap.length) {
            return false;
        }
        
        const cell = this.gameMap[y][x];
        return cell !== 'W' && cell !== 'B'; // Can't move into walls or boulders
    }

    updateBoulders() {
        // Simple boulder gravity - boulders fall down if there's space
        for (let y = this.gameMap.length - 2; y >= 0; y--) {
            for (let x = 0; x < this.gameMap[y].length; x++) {
                if (this.gameMap[y][x] === 'B') {
                    // Check if boulder can fall
                    if (y + 1 < this.gameMap.length && this.gameMap[y + 1][x] === ' ') {
                        // Move boulder down
                        this.gameMap[y][x] = ' ';
                        this.gameMap[y + 1][x] = 'B';
                        
                        // Check if boulder crushes player
                        if (this.player.x === x && this.player.y === y + 1) {
                            this.loseLife();
                        }
                    }
                }
            }
        }
    }

    updateEnemies() {
        // Simple enemy AI - enemies move randomly
        if (this.animationFrame % 60 === 0) { // Move every 60 frames
            for (let y = 0; y < this.gameMap.length; y++) {
                for (let x = 0; x < this.gameMap[y].length; x++) {
                    if (this.gameMap[y][x] === 'E') {
                        const directions = [
                            { x: 0, y: -1 }, // Up
                            { x: 0, y: 1 },  // Down
                            { x: -1, y: 0 }, // Left
                            { x: 1, y: 0 }   // Right
                        ];
                        
                        const dir = directions[Math.floor(Math.random() * directions.length)];
                        const newX = x + dir.x;
                        const newY = y + dir.y;
                        
                        if (this.canMoveTo(newX, newY) && this.gameMap[newY][newX] !== 'E') {
                            this.gameMap[y][x] = ' ';
                            this.gameMap[newY][newX] = 'E';
                        }
                    }
                }
            }
        }
    }

    checkCollisions() {
        // Check enemy collision
        if (this.gameMap[this.player.y][this.player.x] === 'E') {
            this.loseLife();
        }
    }

    checkLevelComplete() {
        // Check if player reached exit and collected all diamonds
        if (this.gameMap[this.player.y][this.player.x] === 'X' && this.diamondsCollected >= this.totalDiamonds) {
            this.nextLevel();
        }
    }

    nextLevel() {
        this.currentLevel++;
        this.score += 1000;
        
        // Show quiz every 2 levels
        if (this.currentLevel % 2 === 0) {
            this.showQuiz();
        } else {
            this.initializeLevel();
            this.updateHUD();
        }
    }

    showQuiz() {
        this.hideAllScreens();
        this.gameState = 'quiz';
        document.getElementById('quiz-screen').style.display = 'block';
        this.displayQuestion();
    }

    displayQuestion() {
        const question = this.storyQuestions[this.currentQuestionIndex % this.storyQuestions.length];
        
        document.getElementById('question-progress').textContent = 
            `Question ${this.currentQuestionIndex + 1} of ${this.storyQuestions.length}`;
        document.getElementById('question-text').textContent = question.question;
        
        const optionsContainer = document.getElementById('quiz-options');
        optionsContainer.innerHTML = '';
        
        question.options.forEach((option, index) => {
            const button = document.createElement('button');
            button.textContent = option;
            button.className = 'quiz-option';
            button.style.cssText = `
                background: rgba(255,255,255,0.1);
                color: white;
                border: 2px solid #ffd700;
                padding: 15px;
                border-radius: 10px;
                cursor: pointer;
                transition: all 0.3s ease;
                font-size: 1.1em;
            `;
            
            button.addEventListener('click', () => this.answerQuestion(index, question));
            optionsContainer.appendChild(button);
        });
    }

    answerQuestion(selectedIndex, question) {
        const correct = selectedIndex === question.correct;
        
        if (correct) {
            this.score += 500;
        } else {
            this.score = Math.max(0, this.score - 200);
        }
        
        // Show explanation
        const explanation = document.getElementById('quiz-explanation');
        explanation.style.display = 'block';
        explanation.innerHTML = `
            <div style="color: ${correct ? '#2ecc71' : '#e74c3c'}; font-weight: bold; margin-bottom: 10px;">
                ${correct ? '✓ Correct!' : '✗ Incorrect'}
            </div>
            <div>${question.explanation}</div>
        `;
        
        // Show continue button
        document.getElementById('continue-game').style.display = 'block';
        
        // Disable option buttons
        const buttons = document.querySelectorAll('.quiz-option');
        buttons.forEach((btn, index) => {
            btn.disabled = true;
            if (index === question.correct) {
                btn.style.background = 'rgba(46, 204, 113, 0.3)';
            } else if (index === selectedIndex && !correct) {
                btn.style.background = 'rgba(231, 76, 60, 0.3)';
            }
        });
        
        this.currentQuestionIndex++;
    }

    continueFromQuiz() {
        this.gameState = 'gameplay';
        this.hideAllScreens();
        document.getElementById('eta-canvas-screen').style.display = 'block';
        
        this.initializeLevel();
        this.updateHUD();
    }

    loseLife() {
        this.lives--;
        this.updateHUD();
        
        if (this.lives <= 0) {
            this.gameOver();
        } else {
            // Reset player position
            this.initializeLevel();
        }
    }

    gameOver() {
        this.hideAllScreens();
        this.gameState = 'game-over';
        document.getElementById('game-over-screen').style.display = 'block';
        
        document.getElementById('final-score').innerHTML = `
            <h3 style="color: #ffd700; margin-bottom: 15px;">Final Statistics</h3>
            <div style="text-align: left; line-height: 2;">
                <div>🏆 Final Score: ${this.score}</div>
                <div>🌙 Levels Completed: ${this.currentLevel - 1}</div>
                <div>💎 Diamonds Collected: ${this.diamondsCollected}</div>
                <div>🧠 Questions Answered: ${this.currentQuestionIndex}</div>
            </div>
        `;
    }

    render() {
        if (!this.ctx) return;
        
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        
        // Calculate camera offset to center on player
        const offsetX = this.canvas.width / 2 - (this.player.x * this.GRID_SIZE + this.GRID_SIZE / 2);
        const offsetY = this.canvas.height / 2 - (this.player.y * this.GRID_SIZE + this.GRID_SIZE / 2);
        
        // Draw game map
        for (let y = 0; y < this.gameMap.length; y++) {
            for (let x = 0; x < this.gameMap[y].length; x++) {
                const screenX = x * this.GRID_SIZE + offsetX;
                const screenY = y * this.GRID_SIZE + offsetY;
                
                // Skip if off screen
                if (screenX < -this.GRID_SIZE || screenX > this.canvas.width || 
                    screenY < -this.GRID_SIZE || screenY > this.canvas.height) {
                    continue;
                }
                
                const cell = this.gameMap[y][x];
                
                switch (cell) {
                    case 'W': // Wall
                        this.ctx.fillStyle = '#34495e';
                        this.ctx.fillRect(screenX, screenY, this.GRID_SIZE, this.GRID_SIZE);
                        this.ctx.strokeStyle = '#2c3e50';
                        this.ctx.strokeRect(screenX, screenY, this.GRID_SIZE, this.GRID_SIZE);
                        break;
                        
                    case 'D': // Diamond
                        this.ctx.fillStyle = '#3498db';
                        this.ctx.fillRect(screenX + 8, screenY + 8, this.GRID_SIZE - 16, this.GRID_SIZE - 16);
                        this.ctx.fillStyle = '#ffffff';
                        this.ctx.fillRect(screenX + 12, screenY + 12, 8, 8);
                        break;
                        
                    case 'B': // Boulder
                        this.ctx.fillStyle = '#7f8c8d';
                        this.ctx.fillRect(screenX + 2, screenY + 2, this.GRID_SIZE - 4, this.GRID_SIZE - 4);
                        this.ctx.fillStyle = '#95a5a6';
                        this.ctx.fillRect(screenX + 4, screenY + 4, this.GRID_SIZE - 8, this.GRID_SIZE - 8);
                        break;
                        
                    case 'E': // Enemy
                        this.ctx.fillStyle = '#e74c3c';
                        this.ctx.fillRect(screenX + 4, screenY + 4, this.GRID_SIZE - 8, this.GRID_SIZE - 8);
                        // Eyes
                        this.ctx.fillStyle = '#ffffff';
                        this.ctx.fillRect(screenX + 8, screenY + 10, 4, 4);
                        this.ctx.fillRect(screenX + 20, screenY + 10, 4, 4);
                        break;
                        
                    case 'X': // Exit
                        this.ctx.fillStyle = '#f1c40f';
                        this.ctx.fillRect(screenX, screenY, this.GRID_SIZE, this.GRID_SIZE);
                        this.ctx.fillStyle = '#f39c12';
                        this.ctx.fillRect(screenX + 8, screenY + 8, this.GRID_SIZE - 16, this.GRID_SIZE - 16);
                        break;
                }
            }
        }
        
        // Draw player
        const playerScreenX = this.player.x * this.GRID_SIZE + offsetX;
        const playerScreenY = this.player.y * this.GRID_SIZE + offsetY;
        
        this.ctx.fillStyle = this.selectedCharacter.color;
        this.ctx.fillRect(playerScreenX + 2, playerScreenY + 2, this.GRID_SIZE - 4, this.GRID_SIZE - 4);
        
        // Player details
        this.ctx.fillStyle = '#FFDBAC'; // Skin color
        this.ctx.fillRect(playerScreenX + 8, playerScreenY + 4, 16, 12); // Head
        
        this.ctx.fillStyle = '#000'; // Eyes
        this.ctx.fillRect(playerScreenX + 10, playerScreenY + 8, 2, 2);
        this.ctx.fillRect(playerScreenX + 20, playerScreenY + 8, 2, 2);
    }

    updateHUD() {
        document.getElementById('diamond-count').textContent = this.diamondsCollected;
        document.getElementById('total-diamonds').textContent = this.totalDiamonds;
        document.getElementById('lives-count').textContent = this.lives;
        document.getElementById('score-display').textContent = this.score;
        document.getElementById('level-display').textContent = this.currentLevel;
    }

    hideAllScreens() {
        const screens = ['character-selection', 'story-intro', 'eta-canvas-screen', 'quiz-screen', 'game-over-screen'];
        screens.forEach(screen => {
            const element = document.getElementById(screen);
            if (element) element.style.display = 'none';
        });
    }

    setupEventListeners() {
        // Keyboard events
        document.addEventListener('keydown', (e) => {
            this.keys[e.code] = true;
            e.preventDefault();
        });

        document.addEventListener('keyup', (e) => {
            this.keys[e.code] = false;
        });
    }

    restart() {
        this.currentLevel = 1;
        this.score = 0;
        this.lives = 3;
        this.diamondsCollected = 0;
        this.currentQuestionIndex = 0;
        this.startGame();
    }

    returnToMenu() {
        if (window.returnToKruraSelection) {
            window.returnToKruraSelection();
        }
    }

    loadAssets() {
        console.log('ETA Game assets loaded');
    }
}

// Global functions for integration
window.ETAGame = ETAGame;

// Initialize game when page loads
document.addEventListener('DOMContentLoaded', function() {
    // Add CSS styles
    const style = document.createElement('style');
    style.textContent = `
        .eta-screen {
            display: none;
            width: 100%;
            height: 100%;
            position: absolute;
            top: 0;
            left: 0;
            z-index: 100;
            overflow-y: auto;
            overflow-x: hidden;
        }
        
        .eta-screen.active {
            display: block;
        }
        
        .eta-btn {
            background: linear-gradient(45deg, #9b59b6, #8e44ad);
            color: white;
            border: none;
            padding: 12px 25px;
            border-radius: 20px;
            font-size: 1em;
            font-weight: bold;
            cursor: pointer;
            transition: all 0.3s ease;
            margin: 5px;
        }
        
        .eta-btn:hover {
            transform: translateY(-2px);
            box-shadow: 0 6px 20px rgba(155, 89, 182, 0.4);
        }
        
        .character-card:hover {
            transform: translateY(-5px) !important;
        }
        
        .quiz-option:hover {
            background: rgba(255,215,0,0.2) !important;
            transform: translateY(-2px);
        }
        
        @keyframes spin {
            from { transform: rotate(0deg); }
            to { transform: rotate(360deg); }
        }
        
        .eta-loading .eta-spinner {
            animation: spin 1s linear infinite;
        }
    `;
    document.head.appendChild(style);
});
