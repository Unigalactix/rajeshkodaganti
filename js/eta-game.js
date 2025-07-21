// ETA: Echoes of Rebirth - D&D-Style Tabletop RPG
// Based on "ETA(Original).pdf" and "ETA: The Lunar Chronicle of Rebirth"

class ETAGame {
    constructor(container = null) {
        this.gameContainer = container || document.getElementById('eta-game-container') || document.getElementById('eta-game');
        
        if (!this.gameContainer) {
            console.error('No game container found for ETA Game');
            return;
        }
        
        this.currentLife = 0;
        this.currentScene = 0;
        this.diceHistory = [];
        this.gameData = {
            lives: ['Samrat', 'Mantra', 'Fran', 'Hero'],
            currentHero: null,
            choices: [],
            inventory: [],
            fragmentedMemories: [],
            lunarEclipse: false,
            totalLunarEclipse: false
        };
        
        // D&D Style Character Classes
        this.characterClasses = {
            Samrat: {
                name: "Samrat - The Tribal King",
                class: "Barbarian/Fighter",
                background: "linear-gradient(135deg, #2d5a27 0%, #4a7c59 50%, #1e3f20 100%)",
                mapType: "Peacock Map",
                guardian: "Fiery Magical Lion",
                stats: {
                    strength: 18,
                    dexterity: 14,
                    constitution: 16,
                    intelligence: 10,
                    wisdom: 12,
                    charisma: 8
                },
                skills: ["Athletics", "Survival", "Intimidation", "Animal Handling"],
                traits: ["Aggressive", "Impulsive", "Arrogant", "Great Physical Strength"],
                weapon: "Spear",
                specialAbility: "Rage - Can enter berserker state for combat advantage"
            },
            Mantra: {
                name: "Mantra - The Mystical Shapeshifter",
                class: "Wizard/Sorcerer",
                background: "linear-gradient(135deg, #4a148c 0%, #7b1fa2 50%, #3f006c 100%)",
                mapType: "Dove Map",
                guardian: "Cannibalistic Tribal Spirits",
                stats: {
                    strength: 10,
                    dexterity: 14,
                    constitution: 12,
                    intelligence: 18,
                    wisdom: 16,
                    charisma: 16
                },
                skills: ["Arcana", "Persuasion", "Performance", "Medicine"],
                traits: ["Gender Transformation", "Tantric Arts", "Identity Crisis"],
                weapon: "Magical Staff",
                specialAbility: "Gender Shift - Daily ability to change gender for social advantages"
            },
            Fran: {
                name: "Fransis Ryder Jr. - The Archaeologist",
                class: "Rogue/Investigator",
                background: "linear-gradient(135deg, #37474f 0%, #546e7a 50%, #263238 100%)",
                mapType: "Owl Map",
                guardian: "Transformation Plague",
                stats: {
                    strength: 12,
                    dexterity: 18,
                    constitution: 14,
                    intelligence: 18,
                    wisdom: 14,
                    charisma: 10
                },
                skills: ["Investigation", "History", "Insight", "Survival", "Stealth"],
                traits: ["Archaeological Passion", "Few Regrets", "Analytical Mind"],
                weapon: "Archaeological Tools",
                specialAbility: "Decipher - Advantage on understanding ancient symbols and clues"
            },
            Hero: {
                name: "Hero - The Taxi Driver",
                class: "Expert/Artificer",
                background: "linear-gradient(135deg, #bf360c 0%, #ff5722 50%, #8d2717 100%)",
                mapType: "Eagle Map",
                guardian: "Multi-headed Serpent of Sorrows",
                stats: {
                    strength: 14,
                    dexterity: 16,
                    constitution: 18,
                    intelligence: 12,
                    wisdom: 18,
                    charisma: 12
                },
                skills: ["Vehicle Operation", "Athletics", "Medicine", "Timing"],
                traits: ["Perfect Punctuality", "Moral Compass", "Accumulated Wisdom"],
                weapon: "Hammer (Sutthi)",
                specialAbility: "Timing Mastery - Exceptional ability with timing-based challenges"
            }
        };
        
        // Adventure Modules: The Maps & Obstacles
        this.adventureModules = {
            Samrat: {
                name: "Path of the Peacock - The Magical Lion's Domain",
                environment: "Dense African Amazon Jungle",
                challenges: ["Environmental Navigation", "Stealth vs Lion", "Fire Resistance"],
                description: "Navigate treacherous dark jungle where a fiery magical lion stalks",
                difficulty: "High-stakes tactical combat",
                guardiansEncountered: ["Jungle Spirits", "Fire Elemental Beast"],
                terrainEffects: "Dense vegetation provides cover but limits visibility"
            },
            Mantra: {
                name: "Path of the Dove - The Tribal Territories", 
                environment: "Magical Cannibalistic Tribal Lands",
                challenges: ["Diplomacy with Cannibals", "Magical Protection", "Deity Transformation"],
                description: "Encounter cannibalistic tribal communities with magical protections",
                difficulty: "Complex social and magical encounters",
                guardiansEncountered: ["Tribal Shamans", "Corrupted Spirits"],
                terrainEffects: "Sacred grounds amplify magical abilities"
            },
            Fran: {
                name: "Path of the Owl - The Mountain Corruption",
                environment: "Treacherous Mountains with Transformation Plants",
                challenges: ["Environmental Hazards", "Plant Corruption", "Survival"],
                description: "Navigate mountains where plants transform humans into cannibals",
                difficulty: "Survival and stealth focused",
                guardiansEncountered: ["Transformed Cannibals", "Corrupted Flora"],
                terrainEffects: "Extreme heat, itchy plants, plastic-melting conditions"
            },
            Hero: {
                name: "Path of the Eagle - The Urban Serpent",
                environment: "Modern Urban Landscape to Ancient Treasure Site",
                challenges: ["Vehicle Combat", "Multi-headed Serpent", "Final Choice"],
                description: "Navigate urban terrain in truck to face the serpent of accumulated sorrows",
                difficulty: "Action-oriented with ultimate moral choice",
                guardiansEncountered: ["Traffic Hazards", "Giant Multi-headed Snake"],
                terrainEffects: "Modern conveniences but ultimate supernatural challenge"
            }
        };
        
        // Sorrowful Bond Manifestations (Vishadha Bandham)
        this.sorrowfulBonds = {
            Samrat: {
                name: "Kasi, Kopam, Vancha (Greed, Anger, Treachery)",
                manifestation: "Multiple duplicates of himself representing negative emotions",
                challenge: "Overwhelming combat against his own worst aspects",
                description: "Face multiple versions of yourself, each embodying greed, anger, and treachery",
                mechanicType: "Multi-target combat with self-reflection checks",
                weakness: "Self-awareness and admission of flaws"
            },
            Mantra: {
                name: "The Feminine Self",
                manifestation: "A female version of himself in graceful but fierce combat",
                challenge: "Identity acceptance through sword combat",
                description: "Confront your transformed feminine self in elegant yet deadly swordplay",
                mechanicType: "Dueling with identity acceptance checks",
                weakness: "Embracing both masculine and feminine aspects"
            },
            Fran: {
                name: "The Shark of Regret",
                manifestation: "A massive shark representing his 'few regrets'",
                challenge: "Environmental puzzle/evasion in water",
                description: "Face a giant shark in dark waters, representing your deepest regrets",
                mechanicType: "Environmental encounter with vulnerability exploitation",
                weakness: "Shark is vulnerable when out of water"
            },
            Hero: {
                name: "The Serpent of Five Lives",
                manifestation: "Multi-headed serpent with each head representing a past life's pain",
                challenge: "Internal combat within the serpent's body",
                description: "Battle the accumulated sorrows of all past lives from within",
                mechanicType: "Internal strategic combat with hammer strikes",
                weakness: "Understanding and acceptance of past pain"
            }
        };
        
        this.scenes = {
            intro: {
                title: "🎲 ETA: Echoes of Rebirth - D&D Campaign 🎲",
                background: "linear-gradient(135deg, #0c0c0c 0%, #1a1a2e 50%, #16213e 100%)",
                narrator: "Moon (Dungeon Master)",
                text: "Welcome, adventurers, to the Cosmic Campaign! I am Chandamama, your Dungeon Master for this epic multi-generational quest. You seek to break a powerful curse of reincarnation tied to a mystical treasure. Roll for initiative... the chronicle begins!",
                choices: [
                    { text: "🎯 Begin the Cosmic Campaign", action: "startCampaign" },
                    { text: "📚 Learn D&D Rules & Curse Lore", action: "showRulesAndLore" },
                    { text: "🎲 Roll Character Stats", action: "rollCharacterStats" }
                ]
            }
        };
    }
    
    // D&D Dice Rolling System
    rollDice(sides = 20, count = 1) {
        let results = [];
        let total = 0;
        
        for (let i = 0; i < count; i++) {
            const roll = Math.floor(Math.random() * sides) + 1;
            results.push(roll);
            total += roll;
        }
        
        this.diceHistory.push({
            roll: results,
            total: total,
            type: `${count}d${sides}`,
            timestamp: Date.now()
        });
        
        return { results, total };
    }
    
    // Ability Score Generation (4d6, drop lowest)
    rollAbilityScore() {
        const rolls = [];
        for (let i = 0; i < 4; i++) {
            rolls.push(this.rollDice(6, 1).total);
        }
        rolls.sort((a, b) => b - a);
        return rolls.slice(0, 3).reduce((sum, val) => sum + val, 0);
    }
    
    // Saving Throw System
    makeSavingThrow(heroName, abilityType, difficulty = 15) {
        const character = this.characterClasses[heroName];
        const abilityScore = character.stats[abilityType.toLowerCase()];
        const modifier = Math.floor((abilityScore - 10) / 2);
        
        const roll = this.rollDice(20, 1);
        const total = roll.total + modifier;
        
        return {
            success: total >= difficulty,
            roll: roll.total,
            modifier: modifier,
            total: total,
            needed: difficulty
        };
    }
    
    // Skill Check System
    makeSkillCheck(heroName, skill, difficulty = 15) {
        const character = this.characterClasses[heroName];
        let modifier = 0;
        
        // Determine base ability for skill
        const skillAbilities = {
            "Athletics": "strength",
            "Survival": "wisdom",
            "Intimidation": "charisma",
            "Animal Handling": "wisdom",
            "Arcana": "intelligence",
            "Persuasion": "charisma",
            "Performance": "charisma",
            "Medicine": "wisdom",
            "Investigation": "intelligence",
            "History": "intelligence",
            "Insight": "wisdom",
            "Stealth": "dexterity",
            "Vehicle Operation": "dexterity",
            "Timing": "wisdom"
        };
        
        const ability = skillAbilities[skill] || "intelligence";
        const abilityScore = character.stats[ability];
        modifier = Math.floor((abilityScore - 10) / 2);
        
        // Proficiency bonus if character has the skill
        if (character.skills.includes(skill)) {
            modifier += 3; // Proficiency bonus
        }
        
        const roll = this.rollDice(20, 1);
        const total = roll.total + modifier;
        
        return {
            success: total >= difficulty,
            roll: roll.total,
            modifier: modifier,
            total: total,
            needed: difficulty,
            skill: skill
        };
    }
    
    // Moon as Dungeon Master - Enhanced Narrative System
    initializeMoonDM() {
        this.moonDM = {
            voice: "deep, resonant, and ethereal",
            currentMood: "neutral", // neutral, concerned, encouraging, ominous
            narrativeStyle: "omniscient",
            
            // DM's knowledge about the curse and story
            loreDatabase: {
                curseOrigin: "A King's greed for eternal treasure created four enchanted maps",
                reincarnationCycle: "Each soul must live through four incarnations to break free",
                lunarEclipse: "Only during Sampoorna Chandra Grahanam can the curse be broken",
                sorrowfulBond: "Each hero faces their deepest regrets before the treasure",
                fragmentedMemories: "Echoes of past lives guide future incarnations"
            },
            
            // DM responses based on game state
            getContextualNarration: (situation, heroName) => {
                const character = this.characterClasses[heroName];
                const heroIndex = this.gameData.lives.indexOf(heroName);
                
                switch(situation) {
                    case 'character_introduction':
                        return this.moonDM.generateCharacterIntro(heroName, heroIndex);
                    case 'challenge_setup':
                        return this.moonDM.generateChallengeNarration(heroName);
                    case 'success_acknowledgment':
                        return this.moonDM.generateSuccessNarration(heroName);
                    case 'failure_guidance':
                        return this.moonDM.generateFailureGuidance(heroName);
                    case 'rebirth_transition':
                        return this.moonDM.generateRebirthNarration(heroName);
                    case 'final_choice':
                        return this.moonDM.generateFinalChoiceNarration();
                    default:
                        return "The Moon watches silently, its ethereal presence guiding your journey.";
                }
            },
            
            generateCharacterIntro: (heroName, lifeIndex) => {
                const intros = {
                    'Samrat': [
                        `"In the dense African Amazon, a soul awakens in the powerful form of Samrat. The Peacock Map burns bright in his consciousness, calling him toward his destiny with the Fiery Magical Lion."`,
                        `"Behold, as Samrat stirs to life - muscles rippling with 'kanda balam chala ekkuva' (great physical strength), yet burdened by the aggressive impulses that define his warrior nature."`
                    ],
                    'Mantra': [
                        `"The cycle continues as Mantra emerges, blessed and cursed with mystical powers. The Dove Map reveals itself, pointing toward cannibalistic tribes who hunger for more than flesh."`,
                        `"See how the soul transforms, carrying Samrat's courage but now wielding 'tantrica vidhyalu' (tantric arts), forever struggling with the duality of masculine and feminine within."`
                    ],
                    'Fran': [
                        `"Through death comes new life - Fransis Ryder Jr. awakens with an archaeologist's passion. The Owl Map whispers of mountain secrets where plants corrupt the very essence of humanity."`,
                        `"Wisdom accumulated from two lives now guides Fran's analytical mind, yet he remains haunted by 'few regrets' that will manifest as a deadly shark in darker waters."`
                    ],
                    'Hero': [
                        `"In the final incarnation, Hero awakens behind the wheel of his taxi, carrying the weight of all previous lives. The Eagle Map leads to urban landscapes where a multi-headed serpent awaits."`,
                        `"The culmination of four lives of pain - Hero bears the memories of Samrat's rage, Mantra's transformation, and Fran's discoveries. His 'sutthi' (hammer) shall be the key to liberation or eternal bondage."`
                    ]
                };
                
                return intros[heroName] ? intros[heroName][Math.min(lifeIndex, intros[heroName].length - 1)] : 
                       "The Moon's voice resonates through time and space, setting the stage for another chapter in this eternal tale.";
            },
            
            generateChallengeNarration: (heroName) => {
                const narrations = {
                    'Samrat': "The jungle pulses with primal energy as the Fiery Lion's 'errani velugu' (red glow) pierces through the darkness. Your warrior instincts scream danger.",
                    'Mantra': "Sacred grounds shimmer with ancient magic as cannibalistic tribes chant in otherworldly harmonies. Your mystical abilities resonate with the spiritual energy.",
                    'Fran': "The mountain air carries the scent of corrupted vegetation. Itchy plants writhe with malevolent life, their spores seeking to transform human flesh.",
                    'Hero': "Urban chaos gives way to supernatural dread as a multi-headed serpent of accumulated sorrows rises before you, each head whispering memories of past failures."
                };
                
                return `"${narrations[heroName] || 'The challenge before you tests not just skill, but the very essence of your soul.'}"`;
            }
        };
    }
    
    startGame() {
        this.initializeMoonDM(); // Initialize the Moon DM system
        this.initializeGameSystems(); // Initialize adventure system
        this.showScene('intro');
    }
    
    showScene(sceneKey) {
        const scene = this.scenes[sceneKey];
        if (!scene) {
            this.showCharacterSelection();
            return;
        }
        
        // Get contextual DM narration
        const dmNarration = this.moonDM ? 
            this.moonDM.getContextualNarration('scene_introduction', this.gameData.currentHero || 'intro') :
            scene.text;
        
        this.gameContainer.innerHTML = `
            <div class="eta-game-screen eta-dnd-interface" style="background: ${scene.background};">
                <div class="eta-dm-section">
                    <div class="dm-avatar">
                        <div class="moon-icon">🌙</div>
                        <span class="dm-label">DM: Chandamama</span>
                        <div class="dm-mood-indicator ${this.moonDM?.currentMood || 'neutral'}"></div>
                    </div>
                    <div class="dm-narration">
                        <h3>${scene.title}</h3>
                        <div class="dm-speech">
                            <p class="dm-voice">"${scene.text}"</p>
                            <div class="dm-additional-context">
                                <em>The Moon's ethereal voice resonates with ${this.moonDM?.voice || 'ancient wisdom'}...</em>
                            </div>
                        </div>
                    </div>
                </div>
                
                <div class="eta-player-section">
                    <div class="eta-dice-area">
                        <div class="dice-display">
                            <span class="dice-icon">🎲</span>
                            <button class="roll-dice-btn" onclick="etaGame.rollDice20()">Roll d20</button>
                            <div class="last-roll">${this.getLastRoll()}</div>
                        </div>
                        <div class="dice-history">
                            <h5>🎯 Recent Rolls:</h5>
                            <div class="recent-rolls">
                                ${this.diceHistory.slice(-3).map(roll => 
                                    `<span class="roll-result">${roll.type}: ${roll.total}</span>`
                                ).join('') || '<span class="no-rolls">No recent rolls</span>'}
                            </div>
                        </div>
                    </div>
                    
                    <div class="eta-choices">
                        ${scene.choices.map((choice, index) => `
                            <button class="eta-choice-btn dnd-action-btn" onclick="etaGame.handleChoice('${choice.action}', ${index})">
                                ${choice.text}
                            </button>
                        `).join('')}
                    </div>
                </div>
                
                <div class="eta-game-state">
                    <div class="eta-fragmented-memories">
                        <h4>🧠 Fragmented Memories (Echoes)</h4>
                        <div class="memories-list">
                            ${this.gameData.fragmentedMemories.map(memory => `
                                <div class="memory-echo">${memory}</div>
                            `).join('') || '<div class="no-memories">No memories carried forward yet...</div>'}
                        </div>
                    </div>
                    
                    <div class="eta-curse-status">
                        <h4>🌙 Curse Status</h4>
                        <div class="curse-info">
                            <div class="current-life">Current Life: ${this.gameData.currentHero || 'Beginning'}</div>
                            <div class="lives-remaining">Lives in Cycle: ${this.gameData.lives.length - this.currentLife}/4</div>
                            <div class="lunar-eclipse">Lunar Eclipse: ${this.gameData.totalLunarEclipse ? '🌕 Active' : '🌑 Not Active'}</div>
                        </div>
                    </div>
                </div>
            </div>
        `;
    }
    
    rollDice20() {
        const result = this.rollDice(20, 1);
        this.updateLastRoll(`d20: ${result.total}`);
        
        // Moon DM commentary on dice rolls
        if (this.moonDM) {
            this.provideDMCommentary(result.total);
        }
        
        return result;
    }
    
    // Enhanced dice rolling with advantage/disadvantage
    rollWithAdvantage() {
        const result = this.rollDice(20, 1, true, false);
        this.updateLastRoll(`d20 (Advantage): ${result.total}`);
        return result;
    }
    
    rollWithDisadvantage() {
        const result = this.rollDice(20, 1, false, true);
        this.updateLastRoll(`d20 (Disadvantage): ${result.total}`);
        return result;
    }
    
    provideDMCommentary(rollResult) {
        const commentary = {
            1: "The Moon dims as fortune abandons you - a critical failure echoes through the cosmic void.",
            2: "Chandamama sighs deeply - the dice show cruel fate has turned against you.",
            18: "The Moon brightens with approval - fortune smiles upon your endeavor!",
            19: "Chandamama's ethereal voice whispers encouragement - excellent fortune guides you.",
            20: "The Moon blazes with celestial joy - a critical success! The very cosmos celebrates your triumph!"
        };
        
        if (commentary[rollResult]) {
            this.showTemporaryDMComment(commentary[rollResult]);
        }
    }
    
    showTemporaryDMComment(comment) {
        const commentDiv = document.createElement('div');
        commentDiv.className = 'dm-commentary-popup';
        commentDiv.innerHTML = `
            <div class="moon-icon">🌙</div>
            <p class="dm-comment">"${comment}"</p>
        `;
        
        this.gameContainer.appendChild(commentDiv);
        
        setTimeout(() => {
            commentDiv.remove();
        }, 4000);
    }
    
    getLastRoll() {
        return this.diceHistory.length > 0 ? 
            `Last: ${this.diceHistory[this.diceHistory.length - 1].type} = ${this.diceHistory[this.diceHistory.length - 1].total}` : 
            "No rolls yet";
    }
    
    updateLastRoll(text) {
        const lastRollDisplay = document.querySelector('.last-roll');
        if (lastRollDisplay) {
            lastRollDisplay.textContent = text;
        }
    }
    
    handleChoice(action, choiceIndex) {
        this.gameData.choices.push({ action, choiceIndex, life: this.gameData.currentHero });
        
        // Update Moon DM mood based on choices
        if (this.moonDM) {
            this.updateDMMood(action);
        }
        
        switch(action) {
            case 'startCampaign':
                this.showCharacterSelection();
                break;
            case 'showRulesAndLore':
                this.showRulesAndLore();
                break;
            case 'rollCharacterStats':
                this.showCharacterRolling();
                break;
            case 'testDiceSystem':
                this.showDiceTestingInterface();
                break;
            case 'selectCharacter':
                this.selectCharacter(choiceIndex);
                break;
            case 'beginAdventure':
                this.beginAdventureModule();
                break;
            case 'skillCheck':
                this.initiateSkillCheck();
                break;
            case 'combatEncounter':
                this.initiateCombat();
                break;
            case 'proceedToSorrowfulBond':
                this.proceedToSorrowfulBond();
                break;
            case 'faceTreasure':
                this.faceTreasure();
                break;
            case 'destroyTreasure':
                this.destroyTreasure();
                break;
            case 'claimTreasure':
                this.claimTreasure();
                break;
            case 'triggerReincarnation':
                this.triggerReincarnation();
                break;
            case 'activateLunarEclipse':
                this.activateLunarEclipse();
                break;
            default:
                console.log('Unknown action:', action);
        }
    }
    
    updateDMMood(action) {
        const moodMap = {
            'destroyTreasure': 'encouraging',
            'claimTreasure': 'ominous',
            'beginAdventure': 'neutral',
            'skillCheck': 'concerned',
            'combatEncounter': 'concerned'
        };
        
        if (moodMap[action]) {
            this.moonDM.currentMood = moodMap[action];
        }
    }
    
    activateLunarEclipse() {
        this.gameData.totalLunarEclipse = true;
        
        this.gameContainer.innerHTML = `
            <div class="eta-game-screen eta-lunar-eclipse">
                <div class="eclipse-event">
                    <div class="moon-icon eclipse-moon">🌕➡️🌑➡️🌕</div>
                    <h2>🌙 Sampoorna Chandra Grahanam (Total Lunar Eclipse) 🌙</h2>
                    
                    <div class="dm-eclipse-narration">
                        <p class="dm-voice">"Behold! The cosmic alignment begins - the Earth's shadow engulfs my form, turning silver light to crimson. The barriers between lives grow thin, and the curse's power weakens."</p>
                        <p class="dm-voice">"This is the moment foretold - when the Moon turns red with the blood of ages, the cursed treasure can finally be broken. But only one pure of heart and wise of spirit may succeed."</p>
                    </div>
                    
                    <div class="eclipse-effects">
                        <h4>🔮 Mystical Effects Active:</h4>
                        <ul>
                            <li>✨ All saving throws gain +2 bonus</li>
                            <li>🧠 Fragmented memories become clearer</li>
                            <li>💎 Cursed treasure becomes vulnerable</li>
                            <li>🌟 Liberation becomes possible</li>
                        </ul>
                    </div>
                    
                    <button class="eta-choice-btn eclipse-btn" onclick="etaGame.showCharacterSelection()">
                        Continue with Eclipse Power
                    </button>
                </div>
            </div>
        `;
    }
    
    showCharacterSelection() {
        const availableCharacters = this.gameData.lives.slice(this.currentLife);
        const currentChar = availableCharacters[0];
        
        if (!currentChar) {
            this.showEternalCurse();
            return;
        }
        
        const character = this.characterClasses[currentChar];
        const heroIndex = this.gameData.lives.indexOf(currentChar);
        
        // Get DM's character introduction
        const dmIntro = this.moonDM ? 
            this.moonDM.generateCharacterIntro(currentChar, heroIndex) :
            `Behold, ${character.name} awakens to continue the eternal quest.`;
        
        this.gameContainer.innerHTML = `
            <div class="eta-game-screen eta-character-select" style="background: ${character.background};">
                <div class="character-sheet">
                    <div class="dm-character-intro">
                        <div class="moon-icon">🌙</div>
                        <div class="dm-intro-text">
                            <p class="dm-voice">${dmIntro}</p>
                        </div>
                    </div>
                    
                    <h2>📋 Character Sheet: ${character.name}</h2>
                    
                    <div class="character-details">
                        <div class="character-stats">
                            <h3>📊 D&D Stats</h3>
                            <div class="stat-block">
                                <div class="stat">STR: ${character.stats.strength} (${this.getModifier(character.stats.strength)})</div>
                                <div class="stat">DEX: ${character.stats.dexterity} (${this.getModifier(character.stats.dexterity)})</div>
                                <div class="stat">CON: ${character.stats.constitution} (${this.getModifier(character.stats.constitution)})</div>
                                <div class="stat">INT: ${character.stats.intelligence} (${this.getModifier(character.stats.intelligence)})</div>
                                <div class="stat">WIS: ${character.stats.wisdom} (${this.getModifier(character.stats.wisdom)})</div>
                                <div class="stat">CHA: ${character.stats.charisma} (${this.getModifier(character.stats.charisma)})</div>
                            </div>
                        </div>
                        
                        <div class="character-info">
                            <div class="info-section">
                                <h4>🏷️ Class:</h4>
                                <p>${character.class}</p>
                            </div>
                            
                            <div class="info-section">
                                <h4>🗺️ Enchanted Map:</h4>
                                <p>${character.mapType}</p>
                            </div>
                            
                            <div class="info-section">
                                <h4>🛡️ Proficient Skills:</h4>
                                <div class="skills-list">
                                    ${character.skills.map(skill => `<span class="skill-tag">${skill}</span>`).join('')}
                                </div>
                            </div>
                            
                            <div class="info-section">
                                <h4>⚔️ Signature Weapon:</h4>
                                <p>${character.weapon}</p>
                            </div>
                            
                            <div class="info-section">
                                <h4>✨ Special Ability:</h4>
                                <p>${character.specialAbility}</p>
                            </div>
                            
                            <div class="info-section">
                                <h4>🎭 Character Traits:</h4>
                                <div class="traits-list">
                                    ${character.traits.map(trait => `<span class="trait-tag">${trait}</span>`).join('')}
                                </div>
                            </div>
                        </div>
                    </div>
                    
                    <div class="adventure-module-preview">
                        <h3>📖 Adventure Module: ${this.adventureModules[currentChar].name}</h3>
                        <p class="module-description">${this.adventureModules[currentChar].description}</p>
                        <div class="module-details">
                            <p><strong>🌍 Environment:</strong> ${this.adventureModules[currentChar].environment}</p>
                            <p><strong>⚔️ Difficulty:</strong> ${this.adventureModules[currentChar].difficulty}</p>
                            <p><strong>👹 Guardian:</strong> ${character.guardian}</p>
                        </div>
                    </div>
                    
                    ${this.gameData.totalLunarEclipse ? `
                        <div class="eclipse-bonus">
                            <h4>🌙 Eclipse Blessing Active</h4>
                            <p>The total lunar eclipse grants you enhanced abilities and wisdom!</p>
                        </div>
                    ` : ''}
                    
                    <div class="character-actions">
                        <button class="eta-choice-btn dnd-ready-btn" onclick="etaGame.handleChoice('beginAdventure', 0)">
                            🎲 Begin Adventure as ${currentChar}
                        </button>
                        <button class="eta-choice-btn dnd-info-btn" onclick="etaGame.handleChoice('showRulesAndLore', 0)">
                            📚 Review D&D Rules & Lore
                        </button>
                        <button class="eta-choice-btn eclipse-trigger-btn" onclick="etaGame.handleChoice('activateLunarEclipse', 0)">
                            🌙 Trigger Lunar Eclipse
                        </button>
                        <button class="eta-choice-btn dice-test-btn" onclick="etaGame.handleChoice('testDiceSystem', 0)">
                            🎲 Test Dice & Skills
                        </button>
                    </div>
                </div>
            </div>
        `;
        
        this.gameData.currentHero = currentChar;
    }
    
    showDiceTestingInterface() {
        this.gameContainer.innerHTML = `
            <div class="eta-game-screen eta-dice-testing">
                <div class="dice-testing-interface">
                    <h2>🎲 D&D Dice Testing Interface</h2>
                    
                    <div class="dm-guidance">
                        <div class="moon-icon">🌙</div>
                        <p class="dm-voice">"Test your fortune with the cosmic dice, adventurer. Understanding the mechanics of chance will serve you well in the trials ahead."</p>
                    </div>
                    
                    <div class="dice-testing-options">
                        <div class="basic-dice">
                            <h3>Basic Dice Rolls</h3>
                            <div class="dice-buttons">
                                <button class="dice-btn" onclick="etaGame.testDiceRoll(4)">🎲 d4</button>
                                <button class="dice-btn" onclick="etaGame.testDiceRoll(6)">🎲 d6</button>
                                <button class="dice-btn" onclick="etaGame.testDiceRoll(8)">🎲 d8</button>
                                <button class="dice-btn" onclick="etaGame.testDiceRoll(10)">🎲 d10</button>
                                <button class="dice-btn" onclick="etaGame.testDiceRoll(12)">🎲 d12</button>
                                <button class="dice-btn" onclick="etaGame.testDiceRoll(20)">🎲 d20</button>
                                <button class="dice-btn" onclick="etaGame.testDiceRoll(100)">🎲 d100</button>
                            </div>
                        </div>
                        
                        <div class="advantage-dice">
                            <h3>Advantage/Disadvantage</h3>
                            <div class="adv-buttons">
                                <button class="advantage-btn" onclick="etaGame.rollWithAdvantage()">🎯 Roll with Advantage</button>
                                <button class="disadvantage-btn" onclick="etaGame.rollWithDisadvantage()">😰 Roll with Disadvantage</button>
                            </div>
                        </div>
                        
                        <div class="skill-tests">
                            <h3>Skill Check Examples</h3>
                            <div class="skill-test-buttons">
                                <button class="skill-btn" onclick="etaGame.testSkillCheck('Athletics', 15)">💪 Athletics (DC 15)</button>
                                <button class="skill-btn" onclick="etaGame.testSkillCheck('Stealth', 18)">👤 Stealth (DC 18)</button>
                                <button class="skill-btn" onclick="etaGame.testSkillCheck('Persuasion', 12)">💬 Persuasion (DC 12)</button>
                                <button class="skill-btn" onclick="etaGame.testSkillCheck('Survival', 20)">🌿 Survival (DC 20)</button>
                            </div>
                        </div>
                    </div>
                    
                    <div class="dice-results-display">
                        <h4>🎯 Roll Results:</h4>
                        <div id="diceTestResults" class="test-results">
                            <em>Roll dice above to see results...</em>
                        </div>
                    </div>
                    
                    <div class="dice-history-display">
                        <h4>📊 Roll History:</h4>
                        <div class="history-list">
                            ${this.diceHistory.slice(-5).map(roll => `
                                <div class="history-item">
                                    ${roll.type}: <strong>${roll.total}</strong>
                                    <span class="roll-details">[${roll.roll.join(', ')}]</span>
                                </div>
                            `).join('') || '<div class="no-history">No rolls yet</div>'}
                        </div>
                    </div>
                    
                    <div class="testing-actions">
                        <button class="eta-choice-btn" onclick="etaGame.showCharacterSelection()">
                            ← Return to Character Selection
                        </button>
                        <button class="eta-choice-btn clear-btn" onclick="etaGame.clearDiceHistory()">
                            🗑️ Clear History
                        </button>
                    </div>
                </div>
            </div>
        `;
    }
    
    testDiceRoll(sides) {
        const result = this.rollDice(sides, 1);
        const resultsDiv = document.getElementById('diceTestResults');
        
        if (resultsDiv) {
            resultsDiv.innerHTML = `
                <div class="test-result">
                    <strong>d${sides} Roll:</strong> ${result.total}
                    ${result.total === sides ? ' 🎉 Maximum!' : ''}
                    ${result.total === 1 ? ' 💀 Minimum!' : ''}
                </div>
            `;
        }
        
        // Refresh the history display
        setTimeout(() => this.showDiceTestingInterface(), 500);
    }
    
    testSkillCheck(skill, dc) {
        const heroName = this.gameData.currentHero || 'Samrat';
        const result = this.makeSkillCheck(heroName, skill, dc);
        const resultsDiv = document.getElementById('diceTestResults');
        
        if (resultsDiv) {
            resultsDiv.innerHTML = `
                <div class="skill-test-result ${result.success ? 'success' : 'failure'}">
                    <h4>${skill} Check (DC ${dc})</h4>
                    <p><strong>Roll:</strong> ${result.roll} + ${result.modifier} = ${result.total}</p>
                    <p><strong>Result:</strong> ${result.success ? '✅ SUCCESS!' : '❌ FAILURE!'}</p>
                </div>
            `;
        }
        
        setTimeout(() => this.showDiceTestingInterface(), 1000);
    }
    
    clearDiceHistory() {
        this.diceHistory = [];
        this.showDiceTestingInterface();
    }
    
    initializeCharacterAdventures() {
        this.adventures = {
            samrat: {
                title: "The Barbarian's Rage",
                modules: [
                    {
                        id: 'samrat_awakening',
                        title: 'Memory of Steel',
                        description: 'You awaken in ancient ruins, war-torn memories flooding back. The Moon watches as your rage begins to surface.',
                        encounters: [
                            {
                                type: 'combat',
                                enemy: 'Shadow Warriors',
                                difficulty: 15,
                                description: 'Spectral warriors emerge from the moonlit stones, testing your battle prowess.',
                                rewards: { xp: 300, item: 'Bloodied Axe Fragment' }
                            },
                            {
                                type: 'skill_challenge',
                                skill: 'Constitution',
                                dc: 14,
                                description: 'Ancient magic tests your endurance. Can you withstand the lunar curse?',
                                rewards: { xp: 200, trait: 'Lunar Resilience' }
                            }
                        ]
                    },
                    {
                        id: 'samrat_trials',
                        title: 'Path of Vengeance',
                        description: 'The sorrowful bond manifests as phantom enemies. Face your past failures.',
                        encounters: [
                            {
                                type: 'psychological',
                                challenge: 'Face fallen comrades',
                                wisdom_dc: 16,
                                description: 'Ghostly allies you failed to save appear. Will you be consumed by guilt?',
                                success_effect: 'Gain Protective Fury ability',
                                failure_effect: 'Suffer Haunted condition (-2 to saves)'
                            }
                        ]
                    }
                ]
            },
            mantra: {
                title: "The Mage's Mysteries",
                modules: [
                    {
                        id: 'mantra_awakening',
                        title: 'Arcane Remembrance',
                        description: 'Magical energies swirl around you as lost spells return to memory.',
                        encounters: [
                            {
                                type: 'magical_puzzle',
                                intelligence_dc: 17,
                                description: 'Ancient runes must be deciphered to unlock your magical potential.',
                                rewards: { xp: 350, spell: 'Lunar Bolt', mana: 2 }
                            },
                            {
                                type: 'combat',
                                enemy: 'Arcane Wraiths',
                                difficulty: 16,
                                description: 'Corrupted magical entities challenge your restored powers.',
                                rewards: { xp: 280, item: 'Spell Focus Crystal' }
                            }
                        ]
                    }
                ]
            },
            fran: {
                title: "The Scholar's Secrets",
                modules: [
                    {
                        id: 'fran_awakening',
                        title: 'Hidden Knowledge',
                        description: 'Your investigative instincts awaken as mysteries demand solving.',
                        encounters: [
                            {
                                type: 'investigation',
                                investigation_dc: 15,
                                description: 'Ancient texts hold clues to your past life and the lunar curse.',
                                rewards: { xp: 250, knowledge: 'Lunar Cycle Secrets' }
                            },
                            {
                                type: 'stealth_mission',
                                stealth_dc: 16,
                                description: 'Navigate shadow-filled corridors to reach forbidden archives.',
                                rewards: { xp: 300, item: 'Shadow Cloak' }
                            }
                        ]
                    }
                ]
            },
            hero: {
                title: "The Artificer's Innovation",
                modules: [
                    {
                        id: 'hero_awakening',
                        title: 'Mechanical Memories',
                        description: 'Your inventive spirit rekindles as ancient devices respond to your touch.',
                        encounters: [
                            {
                                type: 'crafting_challenge',
                                tinker_dc: 15,
                                description: 'Repair an ancient lunar device to unlock your potential.',
                                rewards: { xp: 280, device: 'Lunar Compass', tools: 'Enhanced Kit' }
                            }
                        ]
                    }
                ]
            }
        };
    }

    startAdventure(characterKey) {
        const character = this.characters[characterKey];
        const adventure = this.adventures[characterKey];
        
        this.moonDM.moodState = 'guiding';
        this.moonDM.context = `adventure_start_${characterKey}`;
        
        this.currentAdventure = {
            character: characterKey,
            moduleIndex: 0,
            encounterIndex: 0,
            progress: {}
        };
        
        this.showAdventureInterface(adventure.modules[0]);
    }

    showAdventureInterface(module) {
        const container = document.getElementById('eta-content');
        const dmCommentary = this.getDMAdventureCommentary(module);
        
        container.innerHTML = `
            <div class="adventure-interface">
                <div class="dm-panel">
                    <h3>🌙 The Moon Speaks</h3>
                    <div class="dm-commentary">${dmCommentary}</div>
                    <div class="lunar-phase">Current Phase: ${this.getLunarPhase()}</div>
                </div>
                
                <div class="module-panel">
                    <h2>${module.title}</h2>
                    <p class="module-description">${module.description}</p>
                    
                    <div class="encounters-list">
                        ${module.encounters.map((encounter, index) => `
                            <div class="encounter-card ${this.isEncounterCompleted(encounter) ? 'completed' : 'available'}">
                                <h4>${encounter.type.replace('_', ' ').toUpperCase()}</h4>
                                <p>${encounter.description}</p>
                                ${this.getEncounterActions(encounter, index)}
                            </div>
                        `).join('')}
                    </div>
                </div>
                
                <div class="character-status">
                    <h3>Character Status</h3>
                    ${this.getCharacterStatusDisplay()}
                </div>
            </div>
        `;
    }

    getDMAdventureCommentary(module) {
        const commentaries = {
            adventure_guidance: [
                "The lunar energies guide your path through these trials, child of rebirth.",
                "I sense the weight of past lives upon your shoulders. Each challenge brings clarity.",
                "The sorrowful bonds that bind you will be tested here. Stay strong.",
                "Ancient magic stirs as you approach these encounters. Be prepared."
            ],
            combat_preparation: [
                "Steel yourself for battle. The enemies here are echoes of your past failures.",
                "Your weapons may rust, but your resolve must remain sharp as moonlight.",
                "Remember: every strike teaches you about who you once were."
            ]
        };
        
        const category = this.moonDM.context.includes('combat') ? 'combat_preparation' : 'adventure_guidance';
        return this.getRandomElement(commentaries[category]);
    }

    getEncounterActions(encounter, index) {
        if (encounter.type === 'combat') {
            return `
                <div class="encounter-actions">
                    <button onclick="etaGame.startCombat('${encounter.enemy}', ${encounter.difficulty})" 
                            class="btn-primary">⚔️ Engage in Combat</button>
                    <div class="encounter-info">DC: ${encounter.difficulty} | Rewards: ${encounter.rewards.xp} XP</div>
                </div>
            `;
        } else if (encounter.type === 'skill_challenge') {
            return `
                <div class="encounter-actions">
                    <button onclick="etaGame.attemptSkillCheck('${encounter.skill}', ${encounter.dc})" 
                            class="btn-primary">🎲 Attempt ${encounter.skill} Check</button>
                    <div class="encounter-info">DC: ${encounter.dc} | Skill: ${encounter.skill}</div>
                </div>
            `;
        } else if (encounter.type === 'psychological') {
            return `
                <div class="encounter-actions">
                    <button onclick="etaGame.facePsychologicalChallenge('${index}')" 
                            class="btn-primary">🧠 Face the Truth</button>
                    <div class="encounter-info">Wisdom Save DC: ${encounter.wisdom_dc}</div>
                </div>
            `;
        } else {
            return `
                <div class="encounter-actions">
                    <button onclick="etaGame.attemptSpecialEncounter('${index}')" 
                            class="btn-primary">🔍 Investigate</button>
                    <div class="encounter-info">Special Challenge</div>
                </div>
            `;
        }
    }

    startCombat(enemyName, difficulty) {
        this.moonDM.moodState = 'tense';
        const character = this.characters[this.currentCharacter];
        
        // Initialize combat state
        this.combatState = {
            enemy: enemyName,
            enemyHP: difficulty * 3,
            enemyMaxHP: difficulty * 3,
            playerHP: character.hp,
            playerMaxHP: character.hp,
            round: 1,
            initiative: null
        };
        
        // Roll initiative
        const initiativeRoll = this.rollDice20();
        const initiativeModifier = Math.floor((character.dexterity - 10) / 2);
        const totalInitiative = initiativeRoll + initiativeModifier;
        
        this.combatState.initiative = totalInitiative;
        
        this.showCombatInterface();
    }

    showCombatInterface() {
        const container = document.getElementById('eta-content');
        const dmCombatCommentary = this.getDMCombatCommentary();
        
        container.innerHTML = `
            <div class="combat-interface">
                <div class="dm-combat-panel">
                    <h3>🌙 Battle Commentary</h3>
                    <div class="dm-commentary">${dmCombatCommentary}</div>
                </div>
                
                <div class="combat-status">
                    <div class="combatant player">
                        <h3>You (${this.characters[this.currentCharacter].name})</h3>
                        <div class="health-bar">
                            <div class="health-fill" style="width: ${(this.combatState.playerHP / this.combatState.playerMaxHP) * 100}%"></div>
                            <span>${this.combatState.playerHP}/${this.combatState.playerMaxHP} HP</span>
                        </div>
                    </div>
                    
                    <div class="vs-indicator">⚔️ Round ${this.combatState.round} ⚔️</div>
                    
                    <div class="combatant enemy">
                        <h3>${this.combatState.enemy}</h3>
                        <div class="health-bar enemy">
                            <div class="health-fill" style="width: ${(this.combatState.enemyHP / this.combatState.enemyMaxHP) * 100}%"></div>
                            <span>${this.combatState.enemyHP}/${this.combatState.enemyMaxHP} HP</span>
                        </div>
                    </div>
                </div>
                
                <div class="combat-actions">
                    <h3>Choose Your Action:</h3>
                    <div class="action-buttons">
                        <button onclick="etaGame.combatAction('attack')" class="btn-combat attack">⚔️ Attack</button>
                        <button onclick="etaGame.combatAction('defend')" class="btn-combat defend">🛡️ Defend</button>
                        <button onclick="etaGame.combatAction('special')" class="btn-combat special">✨ Special Ability</button>
                        ${this.characters[this.currentCharacter].canCast ? 
                            '<button onclick="etaGame.combatAction(\'spell\')" class="btn-combat spell">🔮 Cast Spell</button>' : ''}
                    </div>
                </div>
                
                <div class="combat-log">
                    <h4>Battle Log:</h4>
                    <div id="combat-log-content">Initiative: You rolled ${this.combatState.initiative}</div>
                </div>
            </div>
        `;
    }

    combatAction(actionType) {
        const character = this.characters[this.currentCharacter];
        const logElement = document.getElementById('combat-log-content');
        let damage = 0;
        let outcome = '';
        
        switch(actionType) {
            case 'attack':
                const attackRoll = this.rollDice20();
                const attackModifier = this.getStatModifier(character.strength);
                const totalAttack = attackRoll + attackModifier + character.proficiency;
                
                // Enemy AC is typically 12 + difficulty modifier
                const enemyAC = 12 + Math.floor(this.combatState.enemyMaxHP / 15);
                
                if (totalAttack >= enemyAC) {
                    damage = this.rollDice(character.weaponDamage) + attackModifier;
                    this.combatState.enemyHP -= damage;
                    outcome = `🎯 Hit! You deal ${damage} damage. (Rolled ${attackRoll} + ${attackModifier + character.proficiency})`;
                } else {
                    outcome = `❌ Miss! Your attack fails to connect. (Rolled ${attackRoll} + ${attackModifier + character.proficiency} vs AC ${enemyAC})`;
                }
                break;
                
            case 'defend':
                this.combatState.defending = true;
                outcome = `🛡️ You take a defensive stance, gaining +2 AC until your next turn.`;
                break;
                
            case 'special':
                damage = this.useSpecialAbility(character);
                outcome = damage > 0 ? 
                    `✨ Special ability deals ${damage} damage!` : 
                    `✨ You use your special ability for tactical advantage!`;
                break;
                
            case 'spell':
                if (character.spellSlots > 0) {
                    damage = this.rollDice('1d8') + this.getStatModifier(character.intelligence || character.wisdom);
                    character.spellSlots--;
                    this.combatState.enemyHP -= damage;
                    outcome = `🔮 Spell hits for ${damage} magical damage! (${character.spellSlots} slots remaining)`;
                } else {
                    outcome = `🔮 No spell slots remaining!`;
                }
                break;
        }
        
        logElement.innerHTML += `<br>Your Turn: ${outcome}`;
        
        // Check if enemy is defeated
        if (this.combatState.enemyHP <= 0) {
            this.endCombat(true);
            return;
        }
        
        // Enemy turn
        setTimeout(() => this.enemyTurn(), 1500);
    }

    enemyTurn() {
        const character = this.characters[this.currentCharacter];
        const logElement = document.getElementById('combat-log-content');
        
        const enemyAttack = this.rollDice20() + 5; // Base enemy attack bonus
        let playerAC = 10 + this.getStatModifier(character.dexterity) + (character.armorClass || 0);
        
        if (this.combatState.defending) {
            playerAC += 2;
            this.combatState.defending = false;
        }
        
        if (enemyAttack >= playerAC) {
            const damage = this.rollDice('1d6') + 3;
            this.combatState.playerHP -= damage;
            logElement.innerHTML += `<br>Enemy Turn: 💀 ${this.combatState.enemy} hits you for ${damage} damage!`;
            
            // Update health display
            character.hp = this.combatState.playerHP;
        } else {
            logElement.innerHTML += `<br>Enemy Turn: 🛡️ ${this.combatState.enemy}'s attack misses!`;
        }
        
        // Check if player is defeated
        if (this.combatState.playerHP <= 0) {
            this.endCombat(false);
            return;
        }
        
        this.combatState.round++;
        this.updateCombatDisplay();
    }

    updateCombatDisplay() {
        // Update health bars
        const playerHealthBar = document.querySelector('.combatant.player .health-fill');
        const enemyHealthBar = document.querySelector('.combatant.enemy .health-fill');
        const roundIndicator = document.querySelector('.vs-indicator');
        
        if (playerHealthBar) {
            const playerPercent = (this.combatState.playerHP / this.combatState.playerMaxHP) * 100;
            playerHealthBar.style.width = `${playerPercent}%`;
            playerHealthBar.parentElement.querySelector('span').textContent = 
                `${this.combatState.playerHP}/${this.combatState.playerMaxHP} HP`;
        }
        
        if (enemyHealthBar) {
            const enemyPercent = (this.combatState.enemyHP / this.combatState.enemyMaxHP) * 100;
            enemyHealthBar.style.width = `${enemyPercent}%`;
            enemyHealthBar.parentElement.querySelector('span').textContent = 
                `${this.combatState.enemyHP}/${this.combatState.enemyMaxHP} HP`;
        }
        
        if (roundIndicator) {
            roundIndicator.textContent = `⚔️ Round ${this.combatState.round} ⚔️`;
        }
    }

    endCombat(victory) {
        const container = document.getElementById('eta-content');
        const dmCommentary = victory ? this.getDMVictoryCommentary() : this.getDMDefeatCommentary();
        
        if (victory) {
            // Award experience and loot
            const baseXP = this.combatState.enemyMaxHP * 10;
            this.awardExperience(baseXP);
            
            container.innerHTML = `
                <div class="combat-result victory">
                    <h2>🏆 Victory!</h2>
                    <div class="dm-commentary">
                        <h3>🌙 The Moon's Approval</h3>
                        <p>${dmCommentary}</p>
                    </div>
                    <div class="rewards">
                        <h3>Rewards Earned:</h3>
                        <p>🌟 ${baseXP} Experience Points</p>
                        <p>💰 Combat prowess increased</p>
                        <p>🎭 The sorrowful bond weakens slightly</p>
                    </div>
                    <button onclick="etaGame.returnToAdventure()" class="btn-primary">Continue Adventure</button>
                </div>
            `;
        } else {
            container.innerHTML = `
                <div class="combat-result defeat">
                    <h2>💀 Defeat...</h2>
                    <div class="dm-commentary">
                        <h3>🌙 The Moon's Guidance</h3>
                        <p>${dmCommentary}</p>
                    </div>
                    <div class="resurrection">
                        <p>But death is not the end for one bound by lunar magic...</p>
                        <button onclick="etaGame.resurrect()" class="btn-secondary">🌙 Embrace Rebirth</button>
                    </div>
                </div>
            `;
        }
    }

    attemptSkillCheck(skillName, dc) {
        const character = this.characters[this.currentCharacter];
        const roll = this.rollDice20();
        
        // Get appropriate ability modifier
        let modifier = 0;
        let abilityUsed = '';
        
        switch(skillName.toLowerCase()) {
            case 'strength':
                modifier = this.getStatModifier(character.strength);
                abilityUsed = 'Strength';
                break;
            case 'dexterity':
                modifier = this.getStatModifier(character.dexterity);
                abilityUsed = 'Dexterity';
                break;
            case 'constitution':
                modifier = this.getStatModifier(character.constitution);
                abilityUsed = 'Constitution';
                break;
            case 'intelligence':
                modifier = this.getStatModifier(character.intelligence);
                abilityUsed = 'Intelligence';
                break;
            case 'wisdom':
                modifier = this.getStatModifier(character.wisdom);
                abilityUsed = 'Wisdom';
                break;
            case 'charisma':
                modifier = this.getStatModifier(character.charisma);
                abilityUsed = 'Charisma';
                break;
        }
        
        // Add proficiency if character has skill proficiency
        if (character.skills && character.skills.includes(skillName.toLowerCase())) {
            modifier += character.proficiency;
        }
        
        const total = roll + modifier;
        const success = total >= dc;
        
        this.showSkillCheckResult(skillName, roll, modifier, total, dc, success, abilityUsed);
        
        return success;
    }

    showSkillCheckResult(skillName, roll, modifier, total, dc, success, abilityUsed) {
        const container = document.getElementById('eta-content');
        const dmCommentary = this.getDMSkillCommentary(success, skillName);
        
        container.innerHTML = `
            <div class="skill-check-result">
                <div class="dm-commentary">
                    <h3>🌙 The Moon Observes</h3>
                    <p>${dmCommentary}</p>
                </div>
                
                <div class="skill-roll-display">
                    <h2>${skillName.charAt(0).toUpperCase() + skillName.slice(1)} Check</h2>
                    <div class="dice-result">
                        <span class="dice-roll">🎲 ${roll}</span>
                        <span class="modifier">+ ${modifier}</span>
                        <span class="equals">=</span>
                        <span class="total ${success ? 'success' : 'failure'}">${total}</span>
                    </div>
                    <div class="dc-info">vs DC ${dc}</div>
                    <div class="result-status ${success ? 'success' : 'failure'}">
                        ${success ? '✅ SUCCESS!' : '❌ FAILURE!'}
                    </div>
                </div>
                
                <div class="check-details">
                    <p><strong>Ability Used:</strong> ${abilityUsed}</p>
                    <p><strong>Modifier:</strong> ${modifier >= 0 ? '+' + modifier : modifier}</p>
                    ${this.characters[this.currentCharacter].skills?.includes(skillName.toLowerCase()) ? 
                        '<p><strong>Proficient:</strong> Yes (+' + this.characters[this.currentCharacter].proficiency + ')</p>' : ''}
                </div>
                
                <button onclick="etaGame.processSkillCheckOutcome(${success})" class="btn-primary">
                    ${success ? 'Claim Success' : 'Face Consequences'}
                </button>
            </div>
        `;
    }

    processSkillCheckOutcome(success) {
        if (success) {
            this.awardExperience(150);
            this.showTemporaryMessage("🌟 Your success strengthens your resolve and weakens the sorrowful bonds!", 3000);
        } else {
            this.showTemporaryMessage("💔 The failure weighs heavily, but the Moon's guidance remains.", 3000);
        }
        
        setTimeout(() => this.returnToAdventure(), 3000);
    }
    
    // Utility methods for game mechanics
    getStatModifier(statValue) {
        return Math.floor((statValue - 10) / 2);
    }
    
    rollDice(diceString) {
        // Parse dice notation like "1d6", "2d8+3", etc.
        if (typeof diceString === 'string') {
            const match = diceString.match(/(\d+)d(\d+)(?:\+(\d+))?/);
            if (match) {
                const numDice = parseInt(match[1]);
                const dieSize = parseInt(match[2]);
                const bonus = parseInt(match[3] || 0);
                
                let total = bonus;
                for (let i = 0; i < numDice; i++) {
                    total += Math.floor(Math.random() * dieSize) + 1;
                }
                return total;
            }
        }
        
        // Fallback for simple numbers
        return Math.floor(Math.random() * 6) + 1;
    }

    useSpecialAbility(character) {
        let damage = 0;
        
        switch(character.class) {
            case 'Barbarian/Fighter':
                // Rage damage bonus
                damage = this.rollDice('1d12') + this.getStatModifier(character.strength) + 3;
                break;
            case 'Wizard/Sorcerer':
                // Magical burst
                damage = this.rollDice('2d6') + this.getStatModifier(character.intelligence);
                break;
            case 'Rogue/Investigator':
                // Sneak attack
                damage = this.rollDice('1d6') + this.rollDice('2d6'); // Base + sneak attack
                break;
            case 'Expert/Artificer':
                // Invention damage
                damage = this.rollDice('1d8') + this.getStatModifier(character.intelligence);
                break;
        }
        
        this.combatState.enemyHP -= damage;
        return damage;
    }

    awardExperience(xp) {
        if (!this.gameState.experience) this.gameState.experience = 0;
        this.gameState.experience += xp;
        
        // Check for level up
        const currentLevel = Math.floor(this.gameState.experience / 1000) + 1;
        if (currentLevel > this.gameState.level) {
            this.levelUp(currentLevel);
        }
    }

    levelUp(newLevel) {
        this.gameState.level = newLevel;
        this.showTemporaryMessage(`🌟 LEVEL UP! You are now level ${newLevel}!`, 4000);
        
        // Increase character stats
        const character = this.characters[this.currentCharacter];
        character.hp += 5;
        character.maxHp += 5;
        if (newLevel % 4 === 0) {
            // Ability score improvement every 4 levels
            this.showAbilityScoreImprovement();
        }
    }

    getDMCombatCommentary() {
        const commentaries = [
            "Steel rings against steel as the echoes of past battles guide your hand.",
            "The sorrowful bonds whisper of previous defeats - will you overcome them?",
            "I have witnessed this dance of death countless times. Show me something new.",
            "Your enemy mirrors the failures that led to your cursed existence.",
            "Fight not just with blade, but with the wisdom of your fragmented memories."
        ];
        
        return this.getRandomElement(commentaries);
    }

    getDMVictoryCommentary() {
        const commentaries = [
            "Well fought, child of rebirth. Each victory loosens the chains that bind you.",
            "The lunar light grows stronger around you. Your past selves would be proud.",
            "Another step toward redemption. But the path ahead remains treacherous.",
            "Your blade remembers its true purpose. The sorrowful bonds weaken.",
            "Victory tastes sweeter when earned through struggle. Remember this moment."
        ];
        
        return this.getRandomElement(commentaries);
    }

    getDMDefeatCommentary() {
        const commentaries = [
            "Death is but another teacher. What lesson will you learn from this failure?",
            "The lunar curse ensures you cannot truly die, but the pain remains real.",
            "Each defeat adds weight to the sorrowful bonds. Rise again, and be wiser.",
            "Your past selves cry out in disappointment, but hope endures.",
            "The moon's light dims, but it never truly disappears. Return stronger."
        ];
        
        return this.getRandomElement(commentaries);
    }

    getDMSkillCommentary(success, skillName) {
        if (success) {
            return `Your ${skillName} serves you well. The skills of past lives flow through you like moonlight through crystal.`;
        } else {
            return `The ${skillName} check fails, but failure teaches what success cannot. The moon illuminates all paths, even those that lead to shadow.`;
        }
    }

    getLunarPhase() {
        const phases = ['New Moon', 'Waxing Crescent', 'First Quarter', 'Waxing Gibbous', 'Full Moon', 'Waning Gibbous', 'Third Quarter', 'Waning Crescent'];
        if (!this.gameState.lunarPhase) {
            this.gameState.lunarPhase = Math.floor(Math.random() * phases.length);
        }
        return phases[this.gameState.lunarPhase];
    }

    isEncounterCompleted(encounter) {
        // Check if encounter has been completed
        return this.gameState.completedEncounters && this.gameState.completedEncounters.includes(encounter.type + '_' + encounter.description.substring(0, 10));
    }

    getCharacterStatusDisplay() {
        const character = this.characters[this.currentCharacter];
        return `
            <div class="character-stats">
                <h4>${character.name} (Level ${this.gameState.level || 1})</h4>
                <p><strong>HP:</strong> ${character.hp}/${character.maxHp || character.hp}</p>
                <p><strong>XP:</strong> ${this.gameState.experience || 0}/1000</p>
                <p><strong>Class:</strong> ${character.class}</p>
                <div class="ability-scores">
                    <div class="ability">STR ${character.strength} (${this.getModifier(character.strength)})</div>
                    <div class="ability">DEX ${character.dexterity} (${this.getModifier(character.dexterity)})</div>
                    <div class="ability">CON ${character.constitution} (${this.getModifier(character.constitution)})</div>
                    <div class="ability">INT ${character.intelligence} (${this.getModifier(character.intelligence)})</div>
                    <div class="ability">WIS ${character.wisdom} (${this.getModifier(character.wisdom)})</div>
                    <div class="ability">CHA ${character.charisma} (${this.getModifier(character.charisma)})</div>
                </div>
                ${character.spellSlots ? `<p><strong>Spell Slots:</strong> ${character.spellSlots}/3</p>` : ''}
                <p><strong>Curse Status:</strong> ${this.gameState.curseLevel || 'Moderate'}</p>
            </div>
        `;
    }

    returnToAdventure() {
        if (this.currentAdventure) {
            const adventure = this.adventures[this.currentAdventure.character];
            const currentModule = adventure.modules[this.currentAdventure.moduleIndex];
            this.showAdventureInterface(currentModule);
        } else {
            this.showCharacterSelection();
        }
    }

    resurrect() {
        // Reset character HP and continue
        const character = this.characters[this.currentCharacter];
        character.hp = Math.floor(character.maxHp || character.hp * 0.5);
        
        this.showTemporaryMessage("🌙 The lunar magic restores your essence, but at a cost...", 3000);
        
        // Increase curse level
        if (!this.gameState.curseLevel) this.gameState.curseLevel = 1;
        else this.gameState.curseLevel++;
        
        setTimeout(() => this.returnToAdventure(), 3000);
    }

    facePsychologicalChallenge(encounterIndex) {
        // Handle psychological encounters with wisdom saves
        const adventure = this.adventures[this.currentAdventure.character];
        const encounter = adventure.modules[this.currentAdventure.moduleIndex].encounters[encounterIndex];
        
        this.attemptSkillCheck('wisdom', encounter.wisdom_dc);
    }

    attemptSpecialEncounter(encounterIndex) {
        // Handle special encounters like investigations, crafting, etc.
        const adventure = this.adventures[this.currentAdventure.character];
        const encounter = adventure.modules[this.currentAdventure.moduleIndex].encounters[encounterIndex];
        
        // Determine appropriate skill based on encounter type
        let skill = 'intelligence';
        if (encounter.type === 'investigation') skill = 'investigation';
        if (encounter.type === 'stealth_mission') skill = 'dexterity';
        if (encounter.type === 'crafting_challenge') skill = 'intelligence';
        if (encounter.type === 'magical_puzzle') skill = 'intelligence';
        
        const dc = encounter.intelligence_dc || encounter.investigation_dc || encounter.stealth_dc || encounter.tinker_dc || 15;
        
        this.attemptSkillCheck(skill, dc);
    }

    showTemporaryMessage(message, duration = 3000) {
        const messageDiv = document.createElement('div');
        messageDiv.className = 'temporary-message';
        messageDiv.innerHTML = message;
        messageDiv.style.cssText = `
            position: fixed;
            top: 20px;
            left: 50%;
            transform: translateX(-50%);
            background: rgba(0, 0, 0, 0.9);
            color: #ffd700;
            padding: 15px 25px;
            border-radius: 10px;
            border: 2px solid #ffd700;
            z-index: 1000;
            font-size: 16px;
            text-align: center;
            box-shadow: 0 0 20px rgba(255, 215, 0, 0.3);
        `;
        
        document.body.appendChild(messageDiv);
        
        setTimeout(() => {
            if (messageDiv.parentNode) {
                messageDiv.parentNode.removeChild(messageDiv);
            }
        }, duration);
    }

    // Initialize adventures when game starts
    initializeGameSystems() {
        this.initializeCharacterAdventures();
        this.gameState = {
            level: 1,
            experience: 0,
            curseLevel: 1,
            completedEncounters: [],
            lunarPhase: Math.floor(Math.random() * 8)
        };
    }
    
    showRulesAndLore() {
        this.gameContainer.innerHTML = `
            <div class="eta-game-screen eta-rules-lore">
                <div class="rules-lore-content">
                    <h2>📚 D&D Rules & Curse Lore</h2>
                    
                    <div class="lore-section">
                        <h3>🎲 D&D Mechanics</h3>
                        <ul>
                            <li><strong>Dice Rolls:</strong> Most actions use d20 + ability modifier + proficiency bonus</li>
                            <li><strong>Saving Throws:</strong> Roll to resist effects (Death, Magic, etc.)</li>
                            <li><strong>Skill Checks:</strong> Roll for specific abilities like Stealth, Persuasion</li>
                            <li><strong>Combat:</strong> Roll for attack, damage, and tactical decisions</li>
                            <li><strong>Advantage/Disadvantage:</strong> Roll twice, take higher/lower</li>
                        </ul>
                    </div>
                    
                    <div class="lore-section">
                        <h3>🌙 The Curse of Eternal Treasure</h3>
                        <ul>
                            <li><strong>The Original Sin:</strong> A King's greed created four enchanted maps</li>
                            <li><strong>The Reincarnation Cycle:</strong> Touch treasure wrong time = rebirth</li>
                            <li><strong>Fragmented Memories:</strong> Each life gains echoes from previous incarnations</li>
                            <li><strong>The Sorrowful Bond (Vishadha Bandham):</strong> Psychological encounters at treasure</li>
                            <li><strong>Liberation Condition:</strong> Destroy treasure during "Sampoorna Chandra Grahanam" (Total Lunar Eclipse)</li>
                        </ul>
                    </div>
                    
                    <div class="lore-section">
                        <h3>👥 The Four Heroes</h3>
                        <ul>
                            <li><strong>Samrat:</strong> Barbarian/Fighter - Aggressive warrior with great strength</li>
                            <li><strong>Mantra:</strong> Wizard/Sorcerer - Mystical shapeshifter with gender transformation</li>
                            <li><strong>Fran:</strong> Rogue/Investigator - Archaeological expert with analytical mind</li>
                            <li><strong>Hero:</strong> Expert/Artificer - Taxi driver with perfect timing and moral compass</li>
                        </ul>
                    </div>
                    
                    <div class="lore-section">
                        <h3>🗺️ Adventure Modules</h3>
                        <ul>
                            <li><strong>Peacock Map (Samrat):</strong> Face the Fiery Magical Lion in dense jungle</li>
                            <li><strong>Dove Map (Mantra):</strong> Navigate cannibalistic tribal territories</li>
                            <li><strong>Owl Map (Fran):</strong> Survive mountain corruption and transformation plants</li>
                            <li><strong>Eagle Map (Hero):</strong> Urban journey to face multi-headed serpent</li>
                        </ul>
                    </div>
                    
                    <button class="eta-choice-btn" onclick="etaGame.showScene('intro')">
                        ← Return to Campaign Start
                    </button>
                </div>
            </div>
        `;
    }
    
    beginAdventureModule() {
        const heroName = this.gameData.currentHero;
        const adventure = this.adventureModules[heroName];
        const character = this.characterClasses[heroName];
        
        this.gameContainer.innerHTML = `
            <div class="eta-game-screen eta-adventure-module" style="background: ${character.background};">
                <div class="adventure-header">
                    <h2>🗺️ ${adventure.name}</h2>
                    <div class="dm-narration">
                        <div class="moon-icon">🌙</div>
                        <p class="dm-voice">"You find yourself in ${adventure.environment}. ${adventure.description}"</p>
                    </div>
                </div>
                
                <div class="challenges-section">
                    <h3>⚔️ Encounter Challenges</h3>
                    <div class="challenges-grid">
                        ${adventure.challenges.map((challenge, index) => `
                            <div class="challenge-card">
                                <h4>${challenge}</h4>
                                <button class="eta-choice-btn challenge-btn" onclick="etaGame.initiateChallenge('${challenge}', ${index})">
                                    🎲 Attempt ${challenge}
                                </button>
                            </div>
                        `).join('')}
                    </div>
                </div>
                
                <div class="terrain-effects">
                    <h4>🌍 Terrain Effects:</h4>
                    <p>${adventure.terrainEffects}</p>
                </div>
                
                <div class="adventure-progress">
                    <button class="eta-choice-btn guardian-btn" onclick="etaGame.handleChoice('combatEncounter', 0)">
                        ⚔️ Face the Guardian: ${character.guardian}
                    </button>
                </div>
            </div>
        `;
    }
    
    initiateChallenge(challengeType, index) {
        const heroName = this.gameData.currentHero;
        const skillMap = {
            'Environmental Navigation': 'Survival',
            'Stealth vs Lion': 'Stealth', 
            'Fire Resistance': 'Constitution',
            'Diplomacy with Cannibals': 'Persuasion',
            'Magical Protection': 'Arcana',
            'Deity Transformation': 'Performance',
            'Environmental Hazards': 'Survival',
            'Plant Corruption': 'Medicine',
            'Survival': 'Survival',
            'Vehicle Combat': 'Vehicle Operation',
            'Multi-headed Serpent': 'Athletics',
            'Final Choice': 'Wisdom'
        };
        
        const skill = skillMap[challengeType];
        const difficulty = 15 + (Math.floor(Math.random() * 6)); // DC 15-20
        
        if (skill === 'Constitution') {
            this.makeSavingThrowChallenge(heroName, 'constitution', difficulty, challengeType);
        } else if (skill === 'Wisdom') {
            this.makeSavingThrowChallenge(heroName, 'wisdom', difficulty, challengeType);
        } else {
            this.makeSkillCheckChallenge(heroName, skill, difficulty, challengeType);
        }
    }
    
    makeSkillCheckChallenge(heroName, skill, difficulty, challengeType) {
        const result = this.makeSkillCheck(heroName, skill, difficulty);
        
        this.gameContainer.innerHTML = `
            <div class="eta-game-screen eta-skill-check">
                <div class="dice-result">
                    <h3>🎲 ${skill} Check: ${challengeType}</h3>
                    <div class="roll-breakdown">
                        <p><strong>Dice Roll:</strong> ${result.roll}</p>
                        <p><strong>Modifier:</strong> ${result.modifier >= 0 ? '+' : ''}${result.modifier}</p>
                        <p><strong>Total:</strong> ${result.total}</p>
                        <p><strong>DC Needed:</strong> ${result.needed}</p>
                    </div>
                    
                    <div class="result-outcome ${result.success ? 'success' : 'failure'}">
                        <h4>${result.success ? '✅ SUCCESS!' : '❌ FAILURE!'}</h4>
                        <p>${this.getSkillCheckOutcome(challengeType, result.success)}</p>
                        ${result.success ? this.generateSuccessBonus(heroName) : this.generateFailureConsequence(heroName)}
                    </div>
                    
                    <button class="eta-choice-btn" onclick="etaGame.beginAdventureModule()">
                        Continue Adventure
                    </button>
                </div>
            </div>
        `;
    }
    
    makeSavingThrowChallenge(heroName, abilityType, difficulty, challengeType) {
        const result = this.makeSavingThrow(heroName, abilityType, difficulty);
        
        this.gameContainer.innerHTML = `
            <div class="eta-game-screen eta-saving-throw">
                <div class="dice-result">
                    <h3>🎲 ${abilityType.toUpperCase()} Save: ${challengeType}</h3>
                    <div class="roll-breakdown">
                        <p><strong>Dice Roll:</strong> ${result.roll}</p>
                        <p><strong>Modifier:</strong> ${result.modifier >= 0 ? '+' : ''}${result.modifier}</p>
                        <p><strong>Total:</strong> ${result.total}</p>
                        <p><strong>DC Needed:</strong> ${result.needed}</p>
                    </div>
                    
                    <div class="result-outcome ${result.success ? 'success' : 'failure'}">
                        <h4>${result.success ? '✅ SAVED!' : '❌ FAILED SAVE!'}</h4>
                        <p>${this.getSavingThrowOutcome(challengeType, result.success)}</p>
                    </div>
                    
                    <button class="eta-choice-btn" onclick="etaGame.beginAdventureModule()">
                        Continue Adventure
                    </button>
                </div>
            </div>
        `;
    }
    
    getSkillCheckOutcome(challengeType, success) {
        const outcomes = {
            'Environmental Navigation': {
                success: "You navigate the treacherous terrain with expert skill, finding the safest path forward.",
                failure: "You become lost and must backtrack, wasting precious time and energy."
            },
            'Stealth vs Lion': {
                success: "You move silently through the shadows, avoiding the lion's keen senses.",
                failure: "Your movement alerts the lion to your presence - it roars and begins stalking you!"
            },
            'Diplomacy with Cannibals': {
                success: "Your words reach their humanity, and they agree to abandon their cannibalistic ways.",
                failure: "Your diplomacy fails, and they see you as just another meal to be consumed."
            },
            'Magical Protection': {
                success: "Your magical wards hold strong against the corrupting influences.",
                failure: "The dark magic seeps through your defenses, weakening your resolve."
            },
            'Environmental Hazards': {
                success: "You deftly avoid the hazardous plants and extreme conditions.",
                failure: "The itchy plants and melting heat take their toll on your equipment and health."
            },
            'Vehicle Combat': {
                success: "You expertly maneuver your truck through the urban obstacles.",
                failure: "Your vehicle takes damage and your progress is significantly slowed."
            }
        };
        
        return outcomes[challengeType] ? 
            outcomes[challengeType][success ? 'success' : 'failure'] : 
            `Challenge ${success ? 'completed successfully' : 'failed'}!`;
    }
    
    getSavingThrowOutcome(challengeType, success) {
        const outcomes = {
            'Fire Resistance': {
                success: "Your constitution protects you from the lion's flames!",
                failure: "The magical fire sears your flesh, causing ongoing damage."
            },
            'Final Choice': {
                success: "Your wisdom guides you toward the correct path.",
                failure: "Doubt clouds your judgment at this crucial moment."
            }
        };
        
        return outcomes[challengeType] ? 
            outcomes[challengeType][success ? 'success' : 'failure'] : 
            `Save ${success ? 'successful' : 'failed'}!`;
    }
    
    generateSuccessBonus(heroName) {
        const bonus = `<div class="success-bonus">+1 Fragmented Memory gained!</div>`;
        this.gameData.fragmentedMemories.push(`${heroName}: Overcame challenge through skill`);
        return bonus;
    }
    
    generateFailureConsequence(heroName) {
        return `<div class="failure-consequence">You must overcome this setback to proceed.</div>`;
    }
    
    initiateCombat() {
        const heroName = this.gameData.currentHero;
        const character = this.characterClasses[heroName];
        const sorrowBond = this.sorrowfulBonds[heroName];
        
        this.gameContainer.innerHTML = `
            <div class="eta-game-screen eta-combat-encounter" style="background: ${character.background};">
                <div class="combat-header">
                    <h2>⚔️ Guardian Combat: ${character.guardian}</h2>
                    <div class="dm-narration">
                        <div class="moon-icon">🌙</div>
                        <p class="dm-voice">"The ${character.guardian} emerges from the shadows, its power radiating through the air. Roll for initiative!"</p>
                    </div>
                </div>
                
                <div class="combat-interface">
                    <div class="character-stats">
                        <h3>${character.name}</h3>
                        <div class="combat-stats">
                            <div>HP: Full</div>
                            <div>AC: ${10 + this.getModifier(character.stats.dexterity) + 2}</div>
                            <div>Initiative: <button onclick="etaGame.rollInitiative()">🎲 Roll</button></div>
                        </div>
                    </div>
                    
                    <div class="combat-actions">
                        <h4>Choose Your Action:</h4>
                        <button class="eta-choice-btn combat-action" onclick="etaGame.attackGuardian()">
                            ⚔️ Attack with ${character.weapon}
                        </button>
                        <button class="eta-choice-btn combat-action" onclick="etaGame.useSpecialAbility()">
                            ✨ Use Special Ability: ${character.specialAbility.split(':')[0]}
                        </button>
                        <button class="eta-choice-btn combat-action" onclick="etaGame.defendAction()">
                            🛡️ Defend / Dodge
                        </button>
                        <button class="eta-choice-btn combat-action" onclick="etaGame.castSpell()">
                            🔮 Cast Spell (if available)
                        </button>
                    </div>
                </div>
            </div>
        `;
    }
    
    rollInitiative() {
        const heroName = this.gameData.currentHero;
        const character = this.characterClasses[heroName];
        const dexMod = Math.floor((character.stats.dexterity - 10) / 2);
        const roll = this.rollDice(20, 1);
        const initiative = roll.total + dexMod;
        
        const enemyRoll = this.rollDice(20, 1).total + 2; // Enemy gets +2 init
        
        this.updateLastRoll(`Initiative: ${initiative} vs Enemy: ${enemyRoll}`);
        
        if (initiative >= enemyRoll) {
            this.playerTurn();
        } else {
            this.enemyTurn();
        }
    }
    
    attackGuardian() {
        const heroName = this.gameData.currentHero;
        const character = this.characterClasses[heroName];
        const attackRoll = this.rollDice(20, 1);
        const strMod = Math.floor((character.stats.strength - 10) / 2);
        const totalAttack = attackRoll.total + strMod + 3; // +3 proficiency
        
        const enemyAC = 16; // Guardian AC
        const hit = totalAttack >= enemyAC;
        
        if (hit) {
            const damage = this.rollDice(8, 1).total + strMod; // d8 + STR
            this.showCombatResult('attack', true, damage);
        } else {
            this.showCombatResult('attack', false, 0);
        }
    }
    
    showCombatResult(action, success, damage = 0) {
        const resultText = success ? 
            `Your attack hits for ${damage} damage!` :
            'Your attack misses!';
            
        this.gameContainer.innerHTML = `
            <div class="eta-game-screen eta-combat-result">
                <div class="combat-outcome">
                    <h3>Combat Result</h3>
                    <p>${resultText}</p>
                    
                    ${success && damage > 0 ? `
                        <div class="damage-dealt">
                            <p>The guardian staggers from your blow. Your determination grows stronger!</p>
                            <button class="eta-choice-btn" onclick="etaGame.proceedToSorrowfulBond()">
                                🌟 Guardian Defeated - Face the Sorrowful Bond
                            </button>
                        </div>
                    ` : `
                        <div class="combat-continue">
                            <p>The battle continues...</p>
                            <button class="eta-choice-btn" onclick="etaGame.initiateCombat()">
                                🔄 Continue Combat
                            </button>
                        </div>
                    `}
                </div>
            </div>
        `;
    }
    
    proceedToSorrowfulBond(heroName) {
        const sorrowManifestations = {
            samrat: "Multiple shadowy duplicates of yourself, each representing a negative emotion",
            mantra: "A feminine version of yourself, embodying your internal identity conflict", 
            fran: "A massive shark circling in dark waters, born from your few but deep regrets",
            hero: "The accumulated sorrows of all past lives, manifesting as inner voices"
        };
        
        const gameContainer = this.gameContainer;
        gameContainer.innerHTML = `
            <div class="eta-game-screen eta-sorrow-screen">
                <div class="sorrowful-bond">
                    <h3>The Vishadha Bandham (Sorrowful Bond)</h3>
                    <p>As you approach the treasure, your deepest sorrows manifest:</p>
                    <div class="sorrow-manifestation">
                        <p><em>${sorrowManifestations[heroName]}</em></p>
                    </div>
                    
                    <div class="sorrow-choices">
                        <button class="eta-choice-btn" onclick="etaGame.confrontSorrow('fight')">
                            ⚔️ Fight the Manifestation
                        </button>
                        <button class="eta-choice-btn" onclick="etaGame.confrontSorrow('accept')">
                            🤝 Accept and Integrate
                        </button>
                        <button class="eta-choice-btn" onclick="etaGame.confrontSorrow('transcend')">
                            ✨ Transcend Through Understanding
                        </button>
                    </div>
                </div>
            </div>
        `;
    }
    
    confrontSorrow(approach) {
        const heroName = this.gameData.currentHero;
        let outcome = this.resolveSorrowChallenge(approach);
        
        if (outcome === 'success') {
            this.reachTreasure();
        } else if (outcome === 'growth') {
            // Gain wisdom but still fail this life
            this.gameData.stats.wisdom += 2;
            this.triggerRebirth(heroName);
        } else {
            this.triggerRebirth(heroName);
        }
    }
    
    resolveSorrowChallenge(approach) {
        const { wisdom, compassion } = this.gameData.stats;
        
        if (approach === 'transcend' && wisdom >= 6) return 'success';
        if (approach === 'accept' && compassion >= 4) return 'growth';
        if (approach === 'fight') return 'failure'; // Fighting sorrow typically fails
        
        // Random factor with stat influence
        const roll = Math.random();
        if (roll < 0.3 + (wisdom + compassion) * 0.05) return 'success';
        if (roll < 0.6) return 'growth';
        return 'failure';
    }
    
    reachTreasure() {
        const heroName = this.gameData.currentHero;
        const isHero = heroName === 'hero';
        const hasEclipse = this.gameData.lunarEclipse;
        
        const gameContainer = this.gameContainer;
        
        if (isHero && hasEclipse && this.gameData.stats.wisdom >= 8) {
            // Perfect ending - break the cycle
            gameContainer.innerHTML = `
                <div class="eta-game-screen eta-victory-screen">
                    <div class="treasure-chamber">
                        <h3>🏆 The Treasure Chamber 🏆</h3>
                        <p>The cursed treasure gleams before you, but the lunar eclipse bathes everything in ethereal light. You feel the weight of all past lives - Samrat's courage, Mantra's magic, Fran's wisdom.</p>
                        
                        <div class="final-choice">
                            <h4>The Final Choice</h4>
                            <button class="eta-choice-btn eta-destroy-btn" onclick="etaGame.destroyTreasure()">
                                💥 Destroy the Treasure - Break the Cycle
                            </button>
                            <button class="eta-choice-btn eta-claim-btn" onclick="etaGame.claimTreasure()">
                                💎 Claim the Treasure - Continue the Curse
                            </button>
                        </div>
                    </div>
                </div>
            `;
        } else {
            // Touch treasure, get reborn
            gameContainer.innerHTML = `
                <div class="eta-game-screen">
                    <div class="treasure-chamber">
                        <h3>💎 The Cursed Treasure 💎</h3>
                        <p>You reach for the treasure, but without the lunar eclipse's power, the curse activates...</p>
                        <button class="eta-choice-btn" onclick="etaGame.triggerRebirth('${heroName}')">
                            Accept the Inevitable Rebirth
                        </button>
                    </div>
                </div>
            `;
        }
    }
    
    destroyTreasure() {
        const gameContainer = this.gameContainer;
        gameContainer.innerHTML = `
            <div class="eta-game-screen eta-liberation-screen">
                <div class="liberation">
                    <div class="moon-icon">🌕</div>
                    <h3>🎆 LIBERATION ACHIEVED 🎆</h3>
                    
                    <div class="moon-final-speech">
                        <p><strong>Chandamama speaks:</strong></p>
                        <p>"Behold, Chandhu! Hero has chosen wisdom over greed, liberation over possession. The treasure crumbles to dust, and with it, the curse that bound four souls across lifetimes."</p>
                        <p>"The King, Samrat, Mantra, Fran, and Hero - all are now free. Their spirits ascend, having learned that true treasure lies not in what we take, but in what we choose to release."</p>
                        <p>"This is the Echoes of Rebirth - not a punishment, but a path to enlightenment. And you, dear astronaut, carry this wisdom back to Earth."</p>
                    </div>
                    
                    <div class="final-stats">
                        <h4>Journey Complete</h4>
                        <p>Lives Lived: ${this.gameData.lives.indexOf(this.gameData.currentHero) + 1}</p>
                        <p>Wisdom Gained: ${this.gameData.stats.wisdom}</p>
                        <p>Courage Shown: ${this.gameData.stats.courage}</p>
                        <p>Compassion Learned: ${this.gameData.stats.compassion}</p>
                    </div>
                    
                    <button class="eta-choice-btn" onclick="etaGame.restartGame()">
                        🌟 Begin New Chronicle
                    </button>
                    <button class="eta-choice-btn" onclick="window.parent.closeKruraGames()">
                        🚀 Return to Earth
                    </button>
                </div>
            </div>
        `;
    }
    
    claimTreasure() {
        const gameContainer = this.gameContainer;
        gameContainer.innerHTML = `
            <div class="eta-game-screen eta-curse-continues">
                <div class="curse-continuation">
                    <div class="moon-icon">🌑</div>
                    <h3>💀 The Curse Continues 💀</h3>
                    <p>Even as Hero, with all the accumulated wisdom, you chose greed over liberation. The curse strengthens, and the cycle begins anew...</p>
                    <p>Chandamama weeps: "So close to freedom, yet bound by the very desire that created this prison."</p>
                    
                    <button class="eta-choice-btn" onclick="etaGame.triggerRebirth('hero')">
                        Accept Eternal Bondage
                    </button>
                </div>
            </div>
        `;
    }
    
    // ENHANCED REINCARNATION MECHANICS - COMPLETED 2ND POINT
    triggerRebirth(fromHero) {
        const nextLifeIndex = this.gameData.lives.indexOf(fromHero) + 1;
        
        // Store fragmented memories from current life
        const currentCharacter = this.characterClasses[fromHero];
        const lifeExperiences = this.generateLifeExperiences(fromHero);
        
        // Add fragmented memories with specific bonuses
        this.addFragmentedMemories(fromHero, lifeExperiences);
        
        if (nextLifeIndex < this.gameData.lives.length) {
            const nextHero = this.gameData.lives[nextLifeIndex];
            
            // Generate reincarnation bonuses based on previous life
            const reincarnationBonuses = this.calculateReincarnationBonuses(fromHero, nextHero);
            
            const gameContainer = this.gameContainer;
            gameContainer.innerHTML = `
                <div class="eta-game-screen eta-rebirth-screen">
                    <div class="rebirth-transition">
                        <div class="moon-icon">🌙</div>
                        <h3>🔄 The Cycle Turns 🔄</h3>
                        <p><strong>Chandamama narrates the reincarnation:</strong></p>
                        <p>"${fromHero}'s spirit dissolves into cosmic dust, but the soul's essence carries forward echoes of experience. In ${this.getReincarnationLocation(nextHero)}, ${nextHero} awakens with mysterious dreams and inexplicable instincts..."</p>
                        
                        <div class="reincarnation-mechanics">
                            <h4>🧠 Fragmented Memories Gained</h4>
                            <div class="memory-echoes">
                                ${lifeExperiences.map(exp => `
                                    <div class="memory-fragment">
                                        <strong>"${exp.memory}"</strong> - ${exp.mechanicalBonus}
                                    </div>
                                `).join('')}
                            </div>
                            
                            <h4>⚡ Reincarnation Bonuses for ${nextHero}</h4>
                            <div class="reincarnation-bonuses">
                                ${reincarnationBonuses.map(bonus => `
                                    <div class="reincarnation-bonus">
                                        <span class="bonus-type">${bonus.type}:</span> ${bonus.description}
                                        <span class="mechanical-effect">${bonus.mechanicalEffect}</span>
                                    </div>
                                `).join('')}
                            </div>
                            
                            <div class="soul-progression">
                                <h4>🌟 Soul Progression Across Lives</h4>
                                <div class="life-progression">
                                    <div class="lives-lived">Lives Completed: ${nextLifeIndex}/4</div>
                                    <div class="accumulated-wisdom">Total Wisdom Echoes: ${this.gameData.fragmentedMemories.length}</div>
                                    <div class="curse-strength">Curse Binding Strength: ${this.calculateCurseStrength()}%</div>
                                </div>
                            </div>
                        </div>
                        
                        <div class="character-sheet-generation">
                            <h4>🎲 Generating New Character Sheet</h4>
                            <button class="eta-choice-btn generate-stats-btn" onclick="etaGame.rollNewLifeStats('${nextHero}')">
                                🎲 Roll Stats for ${nextHero} (4d6 drop lowest)
                            </button>
                            <button class="eta-choice-btn use-preset-btn" onclick="etaGame.usePresetStats('${nextHero}')">
                                📋 Use Preset Character Sheet
                            </button>
                        </div>
                        
                        <button class="eta-choice-btn disabled" id="beginNextLifeBtn" onclick="etaGame.startLife('${nextHero}')" disabled>
                            Begin Life as ${nextHero} (Generate stats first)
                        </button>
                    </div>
                </div>
            `;
        } else {
            // All lives exhausted without breaking curse
            this.showEternalCurse();
        }
    }
    
    // Generate specific life experiences that become fragmented memories
    generateLifeExperiences(heroName) {
        const experiences = {
            'Samrat': [
                {
                    memory: "The fury of battle courses through warrior's blood",
                    mechanicalBonus: "+1 to Strength-based checks for next life"
                },
                {
                    memory: "Leadership through fear and respect",
                    mechanicalBonus: "+1 to Intimidation checks for next life"
                },
                {
                    memory: "The weight of spear in calloused hands",
                    mechanicalBonus: "Weapon proficiency echoes (advantage on first weapon attack)"
                }
            ],
            'Mantra': [
                {
                    memory: "The flow of mystical energy through transformed flesh",
                    mechanicalBonus: "+1 to Intelligence-based spellcasting checks"
                },
                {
                    memory: "Understanding both masculine and feminine perspectives",
                    mechanicalBonus: "+2 to Persuasion with any gender"
                },
                {
                    memory: "The delicate balance of tantric arts",
                    mechanicalBonus: "Advantage on first magical ritual or spell"
                }
            ],
            'Fran': [
                {
                    memory: "Archaeological passion reveals hidden truths",
                    mechanicalBonus: "+2 to Investigation and History checks"
                },
                {
                    memory: "Methodical analysis overcomes chaos",
                    mechanicalBonus: "Advantage on puzzle-solving and pattern recognition"
                },
                {
                    memory: "Few regrets, but they cut deep",
                    mechanicalBonus: "+1 to Wisdom saves against psychological effects"
                }
            ],
            'Hero': [
                {
                    memory: "Perfect timing saves lives and moments",
                    mechanicalBonus: "+3 to initiative rolls and timing-based challenges"
                },
                {
                    memory: "The weight of hammer, the weight of choice",
                    mechanicalBonus: "Critical hits on 19-20 with improvised weapons"
                },
                {
                    memory: "Accumulated wisdom of four lifetimes",
                    mechanicalBonus: "+2 to all Wisdom-based checks and saves"
                }
            ]
        };
        
        return experiences[heroName] || [];
    }
    
    // Add memories to persistent game state
    addFragmentedMemories(heroName, experiences) {
        experiences.forEach(exp => {
            this.gameData.fragmentedMemories.push({
                sourceLife: heroName,
                memory: exp.memory,
                mechanicalBonus: exp.mechanicalBonus,
                unlocked: true
            });
        });
    }
    
    // Calculate bonuses the next character receives
    calculateReincarnationBonuses(fromHero, toHero) {
        const bonusMap = {
            'Samrat->Mantra': [
                {
                    type: "Warrior's Resolve",
                    description: "Samrat's courage bolsters Mantra's magical confidence",
                    mechanicalEffect: "+1 to Concentration saves while spellcasting"
                },
                {
                    type: "Combat Experience",
                    description: "Echoes of physical prowess aid magical combat",
                    mechanicalEffect: "Advantage on first combat encounter"
                }
            ],
            'Mantra->Fran': [
                {
                    type: "Mystical Insight",
                    description: "Magical knowledge aids archaeological understanding",
                    mechanicalEffect: "+2 to checks involving ancient symbols and runes"
                },
                {
                    type: "Dual Perspective",
                    description: "Gender transformation experience broadens understanding",
                    mechanicalEffect: "+1 to Insight checks when reading people"
                }
            ],
            'Fran->Hero': [
                {
                    type: "Accumulated Knowledge",
                    description: "Three lifetimes of learning guide practical wisdom",
                    mechanicalEffect: "+2 to Intelligence and Wisdom checks"
                },
                {
                    type: "Pattern Recognition",
                    description: "Archaeological training reveals life's patterns",
                    mechanicalEffect: "Advantage on recognizing traps and understanding the curse"
                }
            ]
        };
        
        const key = `${fromHero}->${toHero}`;
        return bonusMap[key] || [
            {
                type: "Soul Memory",
                description: "Vague echoes of past experience",
                mechanicalEffect: "+1 to one random ability check per session"
            }
        ];
    }
    
    // Get where each character is reborn
    getReincarnationLocation(heroName) {
        const locations = {
            'Samrat': 'the dense African Amazon',
            'Mantra': 'the mystical lands where magic flows freely', 
            'Fran': 'the academic halls of archaeological discovery',
            'Hero': 'the bustling streets where every moment counts'
        };
        
        return locations[heroName] || 'a distant land';
    }
    
    // Calculate how strong the curse is based on failures
    calculateCurseStrength() {
        const baseStrength = 100;
        const reductionPerMemory = 5;
        const strength = Math.max(25, baseStrength - (this.gameData.fragmentedMemories.length * reductionPerMemory));
        return strength;
    }
    
    // Roll new stats using D&D 4d6 drop lowest method
    rollNewLifeStats(heroName) {
        const newStats = {};
        const statNames = ['strength', 'dexterity', 'constitution', 'intelligence', 'wisdom', 'charisma'];
        
        statNames.forEach(stat => {
            const rolls = [];
            for (let i = 0; i < 4; i++) {
                rolls.push(this.rollDice(6, 1).total);
            }
            rolls.sort((a, b) => b - a);
            newStats[stat] = rolls.slice(0, 3).reduce((sum, val) => sum + val, 0);
        });
        
        // Apply reincarnation bonuses
        const bonuses = this.getStatBonusesFromMemories(heroName);
        bonuses.forEach(bonus => {
            if (newStats[bonus.stat]) {
                newStats[bonus.stat] += bonus.value;
            }
        });
        
        // Update character with new stats
        this.characterClasses[heroName].stats = newStats;
        this.characterClasses[heroName].reincarnated = true;
        
        this.displayGeneratedStats(heroName, newStats, bonuses);
    }
    
    // Use preset stats with minor variations
    usePresetStats(heroName) {
        const baseStats = this.characterClasses[heroName].stats;
        const newStats = { ...baseStats };
        
        // Add small random variations (-1 to +1 to each stat)
        Object.keys(newStats).forEach(stat => {
            const variation = Math.floor(Math.random() * 3) - 1; // -1, 0, or +1
            newStats[stat] = Math.max(8, Math.min(20, newStats[stat] + variation));
        });
        
        // Apply reincarnation bonuses
        const bonuses = this.getStatBonusesFromMemories(heroName);
        bonuses.forEach(bonus => {
            if (newStats[bonus.stat]) {
                newStats[bonus.stat] += bonus.value;
            }
        });
        
        this.characterClasses[heroName].stats = newStats;
        this.characterClasses[heroName].reincarnated = true;
        
        this.displayGeneratedStats(heroName, newStats, bonuses);
    }
    
    // Get stat bonuses from fragmented memories
    getStatBonusesFromMemories(heroName) {
        const bonuses = [];
        
        // Previous life memories grant specific bonuses
        this.gameData.fragmentedMemories.forEach(memory => {
            if (memory.sourceLife === 'Samrat' && heroName === 'Mantra') {
                bonuses.push({ stat: 'constitution', value: 1 });
            } else if (memory.sourceLife === 'Mantra' && heroName === 'Fran') {
                bonuses.push({ stat: 'intelligence', value: 1 });
            } else if (memory.sourceLife === 'Fran' && heroName === 'Hero') {
                bonuses.push({ stat: 'wisdom', value: 2 });
            }
        });
        
        return bonuses;
    }
    
    // Display the generated stats
    displayGeneratedStats(heroName, newStats, bonuses) {
        const statsDisplay = document.createElement('div');
        statsDisplay.className = 'generated-stats-display';
        statsDisplay.innerHTML = `
            <div class="new-character-sheet">
                <h4>📋 ${heroName}'s Reincarnated Character Sheet</h4>
                <div class="stat-block">
                    ${Object.entries(newStats).map(([stat, value]) => `
                        <div class="stat-line">
                            <span class="stat-name">${stat.charAt(0).toUpperCase() + stat.slice(1)}:</span>
                            <span class="stat-value">${value}</span>
                            <span class="stat-modifier">(${Math.floor((value - 10) / 2) >= 0 ? '+' : ''}${Math.floor((value - 10) / 2)})</span>
                        </div>
                    `).join('')}
                </div>
                
                ${bonuses.length > 0 ? `
                    <div class="memory-bonuses">
                        <h5>🧠 Memory Bonuses Applied:</h5>
                        ${bonuses.map(bonus => `
                            <div class="bonus-applied">+${bonus.value} to ${bonus.stat}</div>
                        `).join('')}
                    </div>
                ` : ''}
            </div>
        `;
        
        // Find and replace the character sheet generation section
        const charGenSection = document.querySelector('.character-sheet-generation');
        if (charGenSection) {
            charGenSection.replaceWith(statsDisplay);
        }
        
        // Enable the begin next life button
        const beginBtn = document.getElementById('beginNextLifeBtn');
        if (beginBtn) {
            beginBtn.disabled = false;
            beginBtn.classList.remove('disabled');
            beginBtn.textContent = `✨ Begin Life as ${heroName} (Stats Generated!)`;
        }
    }
    
    // Start a new life with enhanced character sheet
    startLife(heroName) {
        this.gameData.currentHero = heroName;
        this.currentLife = this.gameData.lives.indexOf(heroName);
        
        // Show enhanced character selection with reincarnation bonuses
        this.showEnhancedCharacterSelection(heroName);
    }
    
    // Enhanced character selection showing reincarnation progression
    showEnhancedCharacterSelection(heroName) {
        const character = this.characterClasses[heroName];
        const isReincarnated = character.reincarnated || false;
        const pastLives = this.gameData.lives.slice(0, this.gameData.lives.indexOf(heroName));
        
        this.gameContainer.innerHTML = `
            <div class="eta-game-screen eta-enhanced-character-selection" style="background: ${character.background};">
                <div class="reincarnation-header">
                    <div class="moon-icon">🌙</div>
                    <h2>📜 Character Reincarnation: ${character.name}</h2>
                    <div class="life-counter">Life ${this.gameData.lives.indexOf(heroName) + 1} of 4</div>
                </div>
                
                <div class="character-sheet-display">
                    <div class="character-portrait">
                        <div class="character-class-badge">${character.class}</div>
                        <div class="map-indicator">Map: ${character.mapType}</div>
                        <div class="guardian-preview">Guardian: ${character.guardian}</div>
                    </div>
                    
                    <div class="character-stats-reborn">
                        <h3>📊 Character Statistics</h3>
                        <div class="stats-grid">
                            ${Object.entries(character.stats).map(([stat, value]) => `
                                <div class="stat-display">
                                    <span class="stat-name">${stat.charAt(0).toUpperCase() + stat.slice(1)}</span>
                                    <span class="stat-value">${value}</span>
                                    <span class="stat-modifier">(${Math.floor((value - 10) / 2) >= 0 ? '+' : ''}${Math.floor((value - 10) / 2)})</span>
                                    ${isReincarnated ? '<span class="reborn-indicator">⭐</span>' : ''}
                                </div>
                            `).join('')}
                        </div>
                    </div>
                    
                    <div class="reincarnation-progression">
                        <h3>🔄 Soul Progression</h3>
                        <div class="past-lives-display">
                            ${pastLives.length > 0 ? `
                                <h4>👻 Past Lives:</h4>
                                <div class="past-lives-list">
                                    ${pastLives.map((pastLife, index) => `
                                        <div class="past-life-echo">
                                            <span class="life-number">${index + 1}.</span>
                                            <span class="life-name">${pastLife}</span>
                                            <span class="life-lesson">${this.getLifeLesson(pastLife)}</span>
                                        </div>
                                    `).join('')}
                                </div>
                            ` : '<p class="first-life">🌟 First incarnation - no past memories yet</p>'}
                        </div>
                        
                        <div class="active-memories">
                            <h4>🧠 Active Fragmented Memories:</h4>
                            <div class="memory-bonuses-display">
                                ${this.gameData.fragmentedMemories.length > 0 ? 
                                    this.gameData.fragmentedMemories.map(memory => `
                                        <div class="active-memory">
                                            <div class="memory-source">From ${memory.sourceLife}:</div>
                                            <div class="memory-text">"${memory.memory}"</div>
                                            <div class="memory-bonus">${memory.mechanicalBonus}</div>
                                        </div>
                                    `).join('') : 
                                    '<div class="no-memories">No fragmented memories yet</div>'
                                }
                            </div>
                        </div>
                    </div>
                    
                    <div class="character-abilities-enhanced">
                        <h3>⚡ Enhanced Abilities & Traits</h3>
                        <div class="abilities-display">
                            <div class="skills-section">
                                <h4>🎯 Skills:</h4>
                                <div class="skills-list">
                                    ${character.skills.map(skill => `
                                        <span class="skill-tag">${skill}</span>
                                    `).join('')}
                                </div>
                            </div>
                            
                            <div class="traits-section">
                                <h4>🏷️ Character Traits:</h4>
                                <div class="traits-list">
                                    ${character.traits.map(trait => `
                                        <span class="trait-tag">${trait}</span>
                                    `).join('')}
                                </div>
                            </div>
                            
                            <div class="special-ability-section">
                                <h4>✨ Special Ability:</h4>
                                <div class="special-ability-display">
                                    <strong>${character.specialAbility.split(':')[0]}:</strong>
                                    <span>${character.specialAbility.split(':')[1] || character.specialAbility}</span>
                                </div>
                            </div>
                        </div>
                    </div>
                    
                    <div class="adventure-module-preview-enhanced">
                        <h3>📖 Awaiting Adventure: ${this.adventureModules[heroName].name}</h3>
                        <p class="module-description">${this.adventureModules[heroName].description}</p>
                        <div class="module-details">
                            <p><strong>🌍 Environment:</strong> ${this.adventureModules[heroName].environment}</p>
                            <p><strong>⚔️ Difficulty:</strong> ${this.adventureModules[heroName].difficulty}</p>
                            <p><strong>👹 Guardian Challenge:</strong> ${character.guardian}</p>
                            <p><strong>🗡️ Primary Weapon:</strong> ${character.weapon}</p>
                        </div>
                    </div>
                    
                    ${this.gameData.totalLunarEclipse ? `
                        <div class="eclipse-blessing">
                            <h4>🌙 Eclipse Blessing Active</h4>
                            <p>The total lunar eclipse grants enhanced abilities and curse-breaking potential!</p>
                        </div>
                    ` : ''}
                    
                    <div class="character-actions-enhanced">
                        <button class="eta-choice-btn dnd-ready-btn" onclick="etaGame.handleChoice('beginAdventure', 0)">
                            🎲 Begin ${heroName}'s Adventure (Life ${this.gameData.lives.indexOf(heroName) + 1})
                        </button>
                        <button class="eta-choice-btn dnd-info-btn" onclick="etaGame.handleChoice('showRulesAndLore', 0)">
                            📚 Review Character Progression & D&D Rules
                        </button>
                        <button class="eta-choice-btn eclipse-trigger-btn" onclick="etaGame.handleChoice('activateLunarEclipse', 0)">
                            🌙 Trigger Lunar Eclipse (Final Life Only)
                        </button>
                        <button class="eta-choice-btn dice-test-btn" onclick="etaGame.handleChoice('testDiceSystem', 0)">
                            🎲 Test Enhanced Stats & Skills
                        </button>
                    </div>
                </div>
            </div>
        `;
    }
    
    // Get the lesson learned from each past life
    getLifeLesson(heroName) {
        const lessons = {
            'Samrat': 'Learned: Strength without wisdom leads to destruction',
            'Mantra': 'Learned: Identity is fluid, power must be balanced',
            'Fran': 'Learned: Knowledge seeks truth, but few regrets remain',
            'Hero': 'Learned: All lives converge in the final choice'
        };
        
        return lessons[heroName] || 'Learned: Every experience teaches wisdom';
    }
    
    showEternalCurse() {
        const gameContainer = this.gameContainer;
        gameContainer.innerHTML = `
            <div class="eta-game-screen eta-eternal-curse">
                <div class="eternal-bondage">
                    <div class="moon-icon">🌑</div>
                    <h3>♾️ Eternal Bondage ♾️</h3>
                    <p><strong>Chandamama's lament:</strong></p>
                    <p>"Four lives have come and gone, each failing to break the cycle. The curse deepens, and the souls are condemned to wander in eternal seeking, never finding peace."</p>
                    <p>"Perhaps in another telling, another timeline, wisdom will prevail over desire..."</p>
                    
                    <button class="eta-choice-btn" onclick="etaGame.restartGame()">
                        🔄 Try Again - New Timeline
                    </button>
                    <button class="eta-choice-btn" onclick="window.parent.closeKruraGames()">
                        💫 Accept the Mystery
                    </button>
                </div>
            </div>
        `;
    }
    
    restartGame() {
        this.gameData = {
            lives: ['Samrat', 'Mantra', 'Fran', 'Hero'],
            currentHero: null,
            choices: [],
            inventory: [],
            stats: { wisdom: 0, courage: 0, compassion: 0 },
            lunarEclipse: false
        };
        this.startGame();
    }
}

// Initialize game when loaded
let etaGame;

function initETAGame() {
    const container = document.getElementById('eta-game-container') || document.getElementById('eta-game');
    if (!container) {
        console.error('ETA Game container not found');
        return;
    }
    
    etaGame = new ETAGame();
    etaGame.startGame();
}

// Make function available globally for modal integration
window.initETAGame = initETAGame;
