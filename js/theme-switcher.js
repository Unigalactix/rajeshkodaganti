// Theme Switcher & Easter Eggs
document.addEventListener('DOMContentLoaded', () => {
    const themeBtn = document.getElementById('themeToggleBtn');
    const body = document.body;
    const STORAGE_KEY = 'rajesh_portfolio_theme';

    // 1. Load saved theme
    const savedTheme = localStorage.getItem(STORAGE_KEY);
    if (savedTheme === 'office') {
        enableOfficeTheme();
    }

    // 2. Toggle Button Listener
    if (themeBtn) {
        themeBtn.addEventListener('click', () => {
            if (body.classList.contains('office-theme')) {
                disableOfficeTheme();
            } else {
                enableOfficeTheme();
            }
        });
    }

    // 3. Functions
    function enableOfficeTheme() {
        body.classList.add('office-theme');
        localStorage.setItem(STORAGE_KEY, 'office');
        if (themeBtn) themeBtn.innerHTML = '🏢'; // Office Building
        triggerDwightFact("Theme activated: Dunder Mifflin mode.");
    }

    function disableOfficeTheme() {
        body.classList.remove('office-theme');
        localStorage.setItem(STORAGE_KEY, 'default');
        if (themeBtn) themeBtn.innerHTML = '🌙'; // Default Icon (assuming dark mode default or similar)
    }

    // 4. Konami Code (Easter Egg)
    const konamiCode = [
        'ArrowUp', 'ArrowUp',
        'ArrowDown', 'ArrowDown',
        'ArrowLeft', 'ArrowRight',
        'ArrowLeft', 'ArrowRight',
        'b', 'a'
    ];
    let konamiIndex = 0;

    document.addEventListener('keydown', (e) => {
        if (e.key === konamiCode[konamiIndex]) {
            konamiIndex++;
            if (konamiIndex === konamiCode.length) {
                activateEasterEgg();
                konamiIndex = 0;
            }
        } else {
            konamiIndex = 0;
        }
    });

    function activateEasterEgg() {
        alert("CHEAT CODE ACTIVATED! WELCOME TO SCRANTON!");
        enableOfficeTheme();
        // Play sound or other effect could go here
    }

    // 5. Dwight Facts (Random Popups)
    const dwightFacts = [
        "Fact: Bears eat beets.",
        "Fact: Nothing stresses me out. Except having to seek the approval of my inferiors.",
        "Fact: Whenever I'm about to do something, I think, 'Would an idiot do that?' And if they would, I do not do that thing.",
        "Fact: I am fast. To give you a reference point I am somewhere between a snake and a mongoose... And a panther.",
        "Fact: Identity theft is not a joke, Jim! Millions of families suffer every year!",
        "Fact: Through concentration, I can raise and lower my cholesterol at will."
    ];

    function triggerDwightFact(customMessage = null) {
        // Only show if in office theme
        if (!body.classList.contains('office-theme') && !customMessage) return;

        const fact = customMessage || dwightFacts[Math.floor(Math.random() * dwightFacts.length)];

        const popup = document.createElement('div');
        popup.className = 'dwight-fact-popup';
        popup.innerHTML = `<h4>FROM THE DESK OF DWIGHT K. SCHRUTE</h4><p>${fact}</p>`;

        document.body.appendChild(popup);

        // Animate in
        setTimeout(() => popup.classList.add('show'), 100);

        // Remove after 5 seconds
        setTimeout(() => {
            popup.classList.remove('show');
            setTimeout(() => popup.remove(), 500);
        }, 5000);
    }

    // Randomly trigger Dwight fact every 60-120 seconds if in office mode
    setInterval(() => {
        if (Math.random() > 0.7) { // 30% chance every check
            triggerDwightFact();
        }
    }, 60000);

    // Export for Chatbot use
    window.isOfficeTheme = () => body.classList.contains('office-theme');
});
