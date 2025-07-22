/*!
    Name Transition Animation
    Author: Rajesh Kodaganti
    Description: Smooth transition between English and Telugu names every 10 seconds
*/

(function() {
    'use strict';
    
    // Name transition functionality
    function initNameTransition() {
        const nameContainer = document.getElementById('nameTransition');
        const englishName = nameContainer?.querySelector('.name-english');
        const teluguName = nameContainer?.querySelector('.name-telugu');
        
        if (!nameContainer || !englishName || !teluguName) {
            console.warn('Name transition elements not found');
            return;
        }
        
        let isEnglishActive = true;
        let transitionInterval;
        
        // Ensure initial state is correct
        englishName.classList.add('active');
        teluguName.classList.remove('active');
        
        function switchNames() {
            if (isEnglishActive) {
                // Switch to Telugu
                englishName.classList.remove('active');
                teluguName.classList.add('active');
                isEnglishActive = false;
                console.log('Switched to Telugu');
            } else {
                // Switch to English
                teluguName.classList.remove('active');
                englishName.classList.add('active');
                isEnglishActive = true;
                console.log('Switched to English');
            }
        }
        
        // Start the transition cycle
        transitionInterval = setInterval(switchNames, 10000); // 10 seconds
        
        // Optional: Pause transitions when user hovers over the name
        let isPaused = false;
        let pausedInterval;
        
        nameContainer.addEventListener('mouseenter', () => {
            if (!isPaused) {
                clearInterval(transitionInterval);
                isPaused = true;
                console.log('Transition paused');
            }
        });
        
        nameContainer.addEventListener('mouseleave', () => {
            if (isPaused) {
                transitionInterval = setInterval(switchNames, 10000);
                isPaused = false;
                console.log('Transition resumed');
            }
        });
        
        // Clean up on page unload
        window.addEventListener('beforeunload', () => {
            clearInterval(transitionInterval);
            if (pausedInterval) {
                clearInterval(pausedInterval);
            }
        });
        
        // Add accessibility support
        nameContainer.setAttribute('aria-live', 'polite');
        nameContainer.setAttribute('aria-label', 'Name display switching between English and Telugu');
        
        console.log('Name transition initialized successfully');
    }
    
    // Initialize when DOM is ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initNameTransition);
    } else {
        initNameTransition();
    }
    
    // Also initialize when window loads (backup)
    window.addEventListener('load', initNameTransition);
})();
