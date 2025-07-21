// Tech Games - Educational Games for Learning Programming Concepts
class TechGamesManager {
    constructor() {
        this.currentGame = null;
        this.score = 0;
        this.currentLevel = 1;
        this.questions = {
            c_language: [
                {
                    question: "What is the correct syntax to print 'Hello World' in C?",
                    options: ["print('Hello World')", "printf('Hello World');", "cout << 'Hello World';", "echo 'Hello World';"],
                    correct: 1,
                    explanation: "printf() is the standard function in C to print formatted output to the screen."
                },
                {
                    question: "Which header file is needed for printf() function?",
                    options: ["<iostream>", "<string.h>", "<stdio.h>", "<stdlib.h>"],
                    correct: 2,
                    explanation: "stdio.h stands for 'standard input output header' and contains printf() function."
                },
                {
                    question: "What is the correct way to declare an integer variable in C?",
                    options: ["int x;", "integer x;", "var x;", "number x;"],
                    correct: 0,
                    explanation: "In C, 'int' is the keyword used to declare integer variables."
                },
                {
                    question: "Which symbol is used to end a statement in C?",
                    options: [":", ".", ";", ","],
                    correct: 2,
                    explanation: "Semicolon (;) is used to terminate statements in C programming."
                },
                {
                    question: "What does '&' operator do in scanf()?",
                    options: ["Logical AND", "Address of variable", "Bitwise AND", "String concatenation"],
                    correct: 1,
                    explanation: "The '&' operator gets the memory address of a variable for scanf() to store input."
                },
                {
                    question: "Which loop executes at least once?",
                    options: ["for loop", "while loop", "do-while loop", "nested loop"],
                    correct: 2,
                    explanation: "do-while loop checks condition after execution, so it runs at least once."
                },
                {
                    question: "What is the size of 'int' data type in most systems?",
                    options: ["1 byte", "2 bytes", "4 bytes", "8 bytes"],
                    correct: 2,
                    explanation: "On most modern systems, 'int' is typically 4 bytes (32 bits)."
                },
                {
                    question: "Which function is used to find string length in C?",
                    options: ["length()", "strlen()", "size()", "count()"],
                    correct: 1,
                    explanation: "strlen() function from string.h header returns the length of a string."
                }
            ],
            python: [
                {
                    question: "How do you print 'Hello World' in Python?",
                    options: ["printf('Hello World')", "print('Hello World')", "echo 'Hello World'", "console.log('Hello World')"],
                    correct: 1,
                    explanation: "print() is the built-in function in Python to display output."
                },
                {
                    question: "Which symbol is used for comments in Python?",
                    options: ["//", "/*", "#", "<!--"],
                    correct: 2,
                    explanation: "Hash symbol (#) is used for single-line comments in Python."
                },
                {
                    question: "What is the correct way to create a list in Python?",
                    options: ["list = {1, 2, 3}", "list = (1, 2, 3)", "list = [1, 2, 3]", "list = <1, 2, 3>"],
                    correct: 2,
                    explanation: "Square brackets [] are used to create lists in Python."
                },
                {
                    question: "Which keyword is used to define a function in Python?",
                    options: ["function", "def", "func", "define"],
                    correct: 1,
                    explanation: "'def' keyword is used to define functions in Python."
                },
                {
                    question: "How do you get user input in Python?",
                    options: ["scanf()", "input()", "read()", "get()"],
                    correct: 1,
                    explanation: "input() function is used to get user input in Python."
                },
                {
                    question: "What does 'len()' function do?",
                    options: ["Length of string/list", "Last element", "First element", "Sort elements"],
                    correct: 0,
                    explanation: "len() returns the number of items in an object like string, list, etc."
                },
                {
                    question: "Which method adds an element to the end of a list?",
                    options: ["add()", "append()", "insert()", "push()"],
                    correct: 1,
                    explanation: "append() method adds a single element to the end of a list."
                },
                {
                    question: "What is the correct syntax for an if statement?",
                    options: ["if x = 5:", "if (x == 5):", "if x == 5:", "if x equals 5:"],
                    correct: 2,
                    explanation: "Python uses 'if condition:' syntax with a colon at the end."
                }
            ],
            github: [
                {
                    question: "Which command initializes a new Git repository?",
                    options: ["git start", "git init", "git create", "git new"],
                    correct: 1,
                    explanation: "'git init' creates a new Git repository in the current directory."
                },
                {
                    question: "How do you add all files to staging area?",
                    options: ["git add *", "git add all", "git add .", "git stage all"],
                    correct: 2,
                    explanation: "'git add .' adds all modified files in the current directory to staging."
                },
                {
                    question: "Which command commits changes with a message?",
                    options: ["git commit 'message'", "git commit -m 'message'", "git save -m 'message'", "git push 'message'"],
                    correct: 1,
                    explanation: "'git commit -m' commits staged changes with a commit message."
                },
                {
                    question: "How do you check the status of your repository?",
                    options: ["git check", "git status", "git info", "git state"],
                    correct: 1,
                    explanation: "'git status' shows the status of files in your working directory."
                },
                {
                    question: "Which command uploads changes to GitHub?",
                    options: ["git upload", "git send", "git push", "git sync"],
                    correct: 2,
                    explanation: "'git push' uploads your committed changes to the remote repository."
                },
                {
                    question: "How do you create a new branch?",
                    options: ["git branch new-branch", "git create new-branch", "git checkout new-branch", "git new new-branch"],
                    correct: 0,
                    explanation: "'git branch branch-name' creates a new branch with the specified name."
                },
                {
                    question: "Which command downloads changes from GitHub?",
                    options: ["git download", "git pull", "git fetch", "git get"],
                    correct: 1,
                    explanation: "'git pull' downloads and merges changes from the remote repository."
                },
                {
                    question: "How do you switch to a different branch?",
                    options: ["git switch branch-name", "git change branch-name", "git checkout branch-name", "git goto branch-name"],
                    correct: 2,
                    explanation: "'git checkout branch-name' switches to the specified branch."
                }
            ],
            html: [
                {
                    question: "What does HTML stand for?",
                    options: ["Hyper Text Markup Language", "High Tech Modern Language", "Home Tool Markup Language", "Hyperlink and Text Markup Language"],
                    correct: 0,
                    explanation: "HTML stands for Hypertext Markup Language, used to create web pages."
                },
                {
                    question: "Which tag is used to create a hyperlink?",
                    options: ["<link>", "<a>", "<href>", "<url>"],
                    correct: 1,
                    explanation: "The <a> tag (anchor tag) is used to create hyperlinks in HTML."
                },
                {
                    question: "What is the correct way to create a heading in HTML?",
                    options: ["<heading>", "<h1>", "<head>", "<title>"],
                    correct: 1,
                    explanation: "HTML headings are created using <h1> to <h6> tags, with <h1> being the largest."
                },
                {
                    question: "Which tag is used to display images?",
                    options: ["<image>", "<img>", "<pic>", "<photo>"],
                    correct: 1,
                    explanation: "The <img> tag is used to embed images in HTML documents."
                },
                {
                    question: "What is the correct HTML for creating a line break?",
                    options: ["<break>", "<lb>", "<br>", "<newline>"],
                    correct: 2,
                    explanation: "The <br> tag creates a line break in HTML."
                },
                {
                    question: "Which attribute specifies the URL of a link?",
                    options: ["src", "href", "url", "link"],
                    correct: 1,
                    explanation: "The 'href' attribute in the <a> tag specifies the URL of the link."
                },
                {
                    question: "What tag is used to create an unordered list?",
                    options: ["<ol>", "<ul>", "<list>", "<li>"],
                    correct: 1,
                    explanation: "The <ul> tag creates an unordered (bulleted) list in HTML."
                },
                {
                    question: "Which tag defines the document type in HTML5?",
                    options: ["<doctype>", "<!DOCTYPE html>", "<html5>", "<!DOCTYPE HTML>"],
                    correct: 1,
                    explanation: "<!DOCTYPE html> declares the document as HTML5."
                }
            ],
            java: [
                {
                    question: "Which method is the entry point of a Java program?",
                    options: ["start()", "main()", "run()", "begin()"],
                    correct: 1,
                    explanation: "The main() method is the entry point where Java program execution begins."
                },
                {
                    question: "How do you print text to the console in Java?",
                    options: ["print('text')", "System.out.println('text')", "console.log('text')", "printf('text')"],
                    correct: 1,
                    explanation: "System.out.println() is used to print text to the console in Java."
                },
                {
                    question: "Which keyword is used to create a class in Java?",
                    options: ["class", "Class", "create", "new"],
                    correct: 0,
                    explanation: "The 'class' keyword is used to define a class in Java."
                },
                {
                    question: "What is the correct way to declare an integer variable?",
                    options: ["int x;", "integer x;", "Integer x;", "var x;"],
                    correct: 0,
                    explanation: "'int' is the primitive data type for integers in Java."
                },
                {
                    question: "Which operator is used for string concatenation in Java?",
                    options: ["&", ".", "+", "concat"],
                    correct: 2,
                    explanation: "The '+' operator is used to concatenate strings in Java."
                },
                {
                    question: "What keyword is used to create an object?",
                    options: ["create", "new", "object", "instance"],
                    correct: 1,
                    explanation: "The 'new' keyword is used to create objects in Java."
                },
                {
                    question: "Which access modifier makes a member accessible everywhere?",
                    options: ["private", "protected", "public", "default"],
                    correct: 2,
                    explanation: "'public' access modifier makes class members accessible from anywhere."
                },
                {
                    question: "What is the extension of Java source files?",
                    options: [".java", ".class", ".jar", ".jvm"],
                    correct: 0,
                    explanation: "Java source files have the .java extension."
                }
            ],
            verilog: [
                {
                    question: "What keyword is used to define a module in Verilog?",
                    options: ["module", "entity", "component", "block"],
                    correct: 0,
                    explanation: "The 'module' keyword is used to define a design unit in Verilog."
                },
                {
                    question: "Which data type represents a single bit in Verilog?",
                    options: ["bit", "wire", "reg", "logic"],
                    correct: 1,
                    explanation: "'wire' is used to represent connections and single bits in Verilog."
                },
                {
                    question: "What operator is used for bitwise AND in Verilog?",
                    options: ["&&", "&", "AND", "and"],
                    correct: 1,
                    explanation: "The '&' operator performs bitwise AND operation in Verilog."
                },
                {
                    question: "Which keyword ends a module definition?",
                    options: ["end", "endmodule", "finish", "stop"],
                    correct: 1,
                    explanation: "'endmodule' keyword marks the end of a module definition."
                },
                {
                    question: "What is used to model sequential logic?",
                    options: ["assign", "always", "wire", "initial"],
                    correct: 1,
                    explanation: "'always' blocks are used to model sequential and combinational logic."
                },
                {
                    question: "Which event triggers on positive clock edge?",
                    options: ["posedge", "negedge", "edge", "clock"],
                    correct: 0,
                    explanation: "'posedge' keyword detects the positive (rising) edge of a signal."
                },
                {
                    question: "What data type can store values in Verilog?",
                    options: ["wire", "reg", "net", "signal"],
                    correct: 1,
                    explanation: "'reg' data type can hold values and is used in procedural blocks."
                },
                {
                    question: "Which statement is used for continuous assignment?",
                    options: ["always", "assign", "initial", "task"],
                    correct: 1,
                    explanation: "'assign' statement is used for continuous assignments in Verilog."
                }
            ]
        };
        this.init();
    }

    init() {
        // Add event listener for Tech Games button
        const techGamesBtn = document.getElementById('techGamesButton');
        if (techGamesBtn) {
            techGamesBtn.addEventListener('click', () => this.showTechGamesModal());
        }
    }

    showTechGamesModal() {
        // Create or show tech games modal
        let modal = document.getElementById('techGamesModal');
        if (!modal) {
            modal = this.createTechGamesModal();
            document.body.appendChild(modal);
        }
        modal.style.display = 'flex';
        this.showGameSelection();
    }

    createTechGamesModal() {
        const modal = document.createElement('div');
        modal.id = 'techGamesModal';
        modal.className = 'tech-games-modal';
        modal.innerHTML = `
            <div class="tech-games-modal-content">
                <div class="tech-games-modal-header">
                    <h2>🎯 Tech Learning Games</h2>
                    <span class="tech-games-close-btn">&times;</span>
                </div>
                <div class="tech-games-modal-body">
                    <div id="techGameSelection" class="tech-game-selection">
                        <h3>Choose Your Learning Adventure</h3>
                        <div class="tech-games-grid">
                            <div class="tech-game-card" data-game="c_language">
                                <div class="tech-game-icon">⚙️</div>
                                <h4>C Language Quiz</h4>
                                <p>Master the fundamentals of C programming</p>
                                <div class="difficulty-badge">Beginner</div>
                                <button class="start-tech-game-btn">Start Learning</button>
                            </div>
                            <div class="tech-game-card" data-game="python">
                                <div class="tech-game-icon">🐍</div>
                                <h4>Python Quiz</h4>
                                <p>Learn Python syntax and concepts</p>
                                <div class="difficulty-badge">Beginner</div>
                                <button class="start-tech-game-btn">Start Learning</button>
                            </div>
                            <div class="tech-game-card" data-game="github">
                                <div class="tech-game-icon">📚</div>
                                <h4>GitHub Commands</h4>
                                <p>Master Git version control commands</p>
                                <div class="difficulty-badge">Beginner</div>
                                <button class="start-tech-game-btn">Start Learning</button>
                            </div>
                            <div class="tech-game-card" data-game="html">
                                <div class="tech-game-icon">🌐</div>
                                <h4>HTML Quiz</h4>
                                <p>Learn HTML markup and web structure</p>
                                <div class="difficulty-badge">Beginner</div>
                                <button class="start-tech-game-btn">Start Learning</button>
                            </div>
                            <div class="tech-game-card" data-game="java">
                                <div class="tech-game-icon">☕</div>
                                <h4>Java Quiz</h4>
                                <p>Master Java programming fundamentals</p>
                                <div class="difficulty-badge">Beginner</div>
                                <button class="start-tech-game-btn">Start Learning</button>
                            </div>
                            <div class="tech-game-card" data-game="verilog">
                                <div class="tech-game-icon">⚡</div>
                                <h4>Verilog Quiz</h4>
                                <p>Learn hardware description language basics</p>
                                <div class="difficulty-badge">Beginner</div>
                                <button class="start-tech-game-btn">Start Learning</button>
                            </div>
                        </div>
                    </div>
                    <div id="techGamePlay" class="tech-game-play" style="display: none;">
                        <div class="game-header">
                            <div class="game-info">
                                <h3 id="currentGameTitle">Game Title</h3>
                                <div class="game-stats">
                                    <span class="score">Score: <span id="gameScore">0</span></span>
                                    <span class="level">Level: <span id="gameLevel">1</span></span>
                                    <span class="progress">Question: <span id="questionNumber">1</span> / <span id="totalQuestions">8</span></span>
                                </div>
                            </div>
                            <button id="backToSelection" class="back-btn">← Back to Games</button>
                        </div>
                        <div class="question-container">
                            <div class="question-card">
                                <h4 id="questionText">Question will appear here</h4>
                                <div class="options-container" id="optionsContainer">
                                    <!-- Options will be dynamically added -->
                                </div>
                                <div class="question-feedback" id="questionFeedback" style="display: none;">
                                    <div class="feedback-content">
                                        <div class="feedback-icon"></div>
                                        <div class="feedback-text">
                                            <h5 class="feedback-title"></h5>
                                            <p class="feedback-explanation"></p>
                                        </div>
                                    </div>
                                    <button id="nextQuestion" class="next-btn">Next Question →</button>
                                </div>
                            </div>
                        </div>
                        <div class="progress-bar">
                            <div class="progress-fill" id="progressFill"></div>
                        </div>
                    </div>
                    <div id="techGameResults" class="tech-game-results" style="display: none;">
                        <div class="results-container">
                            <div class="results-icon" id="resultsIcon">🎉</div>
                            <h3 id="resultsTitle">Congratulations!</h3>
                            <div class="results-stats">
                                <div class="stat">
                                    <span class="stat-value" id="finalScore">0</span>
                                    <span class="stat-label">Final Score</span>
                                </div>
                                <div class="stat">
                                    <span class="stat-value" id="correctAnswers">0</span>
                                    <span class="stat-label">Correct Answers</span>
                                </div>
                                <div class="stat">
                                    <span class="stat-value" id="accuracy">0%</span>
                                    <span class="stat-label">Accuracy</span>
                                </div>
                            </div>
                            <div class="results-message" id="resultsMessage"></div>
                            <div class="results-actions">
                                <button id="playAgain" class="play-again-btn">Play Again</button>
                                <button id="backToGames" class="back-to-games-btn">Choose Another Game</button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        `;

        // Add event listeners
        modal.querySelector('.tech-games-close-btn').addEventListener('click', () => {
            modal.style.display = 'none';
        });

        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                modal.style.display = 'none';
            }
        });

        // Add game selection event listeners
        modal.querySelectorAll('.start-tech-game-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const gameType = e.target.closest('.tech-game-card').dataset.game;
                this.startTechGame(gameType);
            });
        });

        return modal;
    }

    showGameSelection() {
        document.getElementById('techGameSelection').style.display = 'block';
        document.getElementById('techGamePlay').style.display = 'none';
        document.getElementById('techGameResults').style.display = 'none';
    }

    startTechGame(gameType) {
        this.currentGame = gameType;
        this.score = 0;
        this.currentLevel = 1;
        this.currentQuestionIndex = 0;
        this.correctAnswers = 0;

        // Show game play area
        document.getElementById('techGameSelection').style.display = 'none';
        document.getElementById('techGamePlay').style.display = 'block';
        document.getElementById('techGameResults').style.display = 'none';

        // Set game title
        const titles = {
            c_language: 'C Language Quiz',
            python: 'Python Quiz',
            github: 'GitHub Commands Quiz',
            html: 'HTML Quiz',
            java: 'Java Quiz',
            verilog: 'Verilog Quiz'
        };
        document.getElementById('currentGameTitle').textContent = titles[gameType];

        // Add event listeners
        document.getElementById('backToSelection').addEventListener('click', () => {
            this.showGameSelection();
        });

        document.getElementById('nextQuestion').addEventListener('click', () => {
            this.nextQuestion();
        });

        document.getElementById('playAgain').addEventListener('click', () => {
            this.startTechGame(this.currentGame);
        });

        document.getElementById('backToGames').addEventListener('click', () => {
            this.showGameSelection();
        });

        // Start first question
        this.loadQuestion();
    }

    loadQuestion() {
        const questions = this.questions[this.currentGame];
        const question = questions[this.currentQuestionIndex];

        // Update UI
        document.getElementById('gameScore').textContent = this.score;
        document.getElementById('gameLevel').textContent = this.currentLevel;
        document.getElementById('questionNumber').textContent = this.currentQuestionIndex + 1;
        document.getElementById('totalQuestions').textContent = questions.length;

        // Update progress bar
        const progress = ((this.currentQuestionIndex) / questions.length) * 100;
        document.getElementById('progressFill').style.width = progress + '%';

        // Load question
        document.getElementById('questionText').textContent = question.question;

        // Clear and load options
        const optionsContainer = document.getElementById('optionsContainer');
        optionsContainer.innerHTML = '';

        question.options.forEach((option, index) => {
            const optionBtn = document.createElement('button');
            optionBtn.className = 'option-btn';
            optionBtn.textContent = option;
            optionBtn.addEventListener('click', () => this.selectAnswer(index));
            optionsContainer.appendChild(optionBtn);
        });

        // Hide feedback
        document.getElementById('questionFeedback').style.display = 'none';
    }

    selectAnswer(selectedIndex) {
        const question = this.questions[this.currentGame][this.currentQuestionIndex];
        const optionBtns = document.querySelectorAll('.option-btn');
        const feedback = document.getElementById('questionFeedback');

        // Disable all buttons
        optionBtns.forEach(btn => btn.disabled = true);

        // Show correct and incorrect answers
        optionBtns.forEach((btn, index) => {
            if (index === question.correct) {
                btn.classList.add('correct');
            } else if (index === selectedIndex && selectedIndex !== question.correct) {
                btn.classList.add('incorrect');
            }
        });

        // Update score and stats
        const isCorrect = selectedIndex === question.correct;
        if (isCorrect) {
            this.score += 10;
            this.correctAnswers++;
        }

        // Show feedback
        const feedbackIcon = feedback.querySelector('.feedback-icon');
        const feedbackTitle = feedback.querySelector('.feedback-title');
        const feedbackExplanation = feedback.querySelector('.feedback-explanation');

        if (isCorrect) {
            feedbackIcon.textContent = '✅';
            feedbackTitle.textContent = 'Correct!';
            feedbackTitle.className = 'feedback-title correct';
        } else {
            feedbackIcon.textContent = '❌';
            feedbackTitle.textContent = 'Incorrect';
            feedbackTitle.className = 'feedback-title incorrect';
        }

        feedbackExplanation.textContent = question.explanation;
        feedback.style.display = 'block';
    }

    nextQuestion() {
        this.currentQuestionIndex++;

        if (this.currentQuestionIndex >= this.questions[this.currentGame].length) {
            this.showResults();
        } else {
            // Level up every 3 questions
            if (this.currentQuestionIndex % 3 === 0) {
                this.currentLevel++;
            }
            this.loadQuestion();
        }
    }

    showResults() {
        document.getElementById('techGamePlay').style.display = 'none';
        document.getElementById('techGameResults').style.display = 'block';

        const totalQuestions = this.questions[this.currentGame].length;
        const accuracy = Math.round((this.correctAnswers / totalQuestions) * 100);

        // Update results
        document.getElementById('finalScore').textContent = this.score;
        document.getElementById('correctAnswers').textContent = `${this.correctAnswers}/${totalQuestions}`;
        document.getElementById('accuracy').textContent = accuracy + '%';

        // Set results message and icon based on performance
        const resultsIcon = document.getElementById('resultsIcon');
        const resultsTitle = document.getElementById('resultsTitle');
        const resultsMessage = document.getElementById('resultsMessage');

        if (accuracy >= 80) {
            resultsIcon.textContent = '🏆';
            resultsTitle.textContent = 'Excellent!';
            resultsMessage.textContent = 'You have mastered the basics! Keep up the great work!';
        } else if (accuracy >= 60) {
            resultsIcon.textContent = '👍';
            resultsTitle.textContent = 'Good Job!';
            resultsMessage.textContent = 'You\'re on the right track! Practice a bit more to improve.';
        } else {
            resultsIcon.textContent = '📚';
            resultsTitle.textContent = 'Keep Learning!';
            resultsMessage.textContent = 'Don\'t worry, everyone starts somewhere. Try again and learn from the explanations!';
        }
    }
}

// Initialize Tech Games when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new TechGamesManager();
});
