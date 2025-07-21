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
        
        function switchNames() {
            if (isEnglishActive) {
                // Switch to Telugu
                englishName.classList.remove('active');
                teluguName.classList.add('active');
                isEnglishActive = false;
            } else {
                // Switch to English
                teluguName.classList.remove('active');
                englishName.classList.add('active');
                isEnglishActive = true;
            }
        }
        
        // Start the transition cycle
        const transitionInterval = setInterval(switchNames, 10000); // 10 seconds
        
        // Optional: Pause transitions when user hovers over the name
        let isPaused = false;
        let pausedInterval;
        
        nameContainer.addEventListener('mouseenter', () => {
            if (!isPaused) {
                clearInterval(transitionInterval);
                isPaused = true;
            }
        });
        
        nameContainer.addEventListener('mouseleave', () => {
            if (isPaused) {
                pausedInterval = setInterval(switchNames, 10000);
                isPaused = false;
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
