/**
 * Portfolio Visit Notification System
 * Sends email notifications when someone visits the portfolio
 */

class PortfolioNotifier {
    constructor() {
        this.apiUrl = 'http://localhost:3000/api'; // Change this to your deployed backend URL
        this.hasNotified = false;
        this.currentSection = 'home';
        this.visitStartTime = Date.now();
        this.init();
    }

    init() {
        // Send initial visit notification
        this.sendVisitNotification();
        
        // Track section changes
        this.trackSectionViews();
        
        // Track time spent on page
        this.trackTimeSpent();
        
        // Track page visibility changes
        this.trackPageVisibility();
    }

    async sendVisitNotification(section = 'home', page = 'portfolio') {
        // Prevent multiple notifications from the same session
        if (this.hasNotified && section === 'home') {
            return;
        }

        try {
            const response = await fetch(`${this.apiUrl}/notify-visit`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    page: page,
                    section: section,
                    timestamp: new Date().toISOString(),
                    userAgent: navigator.userAgent,
                    referrer: document.referrer || 'Direct',
                    screenResolution: `${screen.width}x${screen.height}`,
                    language: navigator.language,
                    timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone
                })
            });

            const result = await response.json();
            
            if (result.success && !result.rateLimited) {
                console.log('📧 Visit notification sent successfully');
                this.hasNotified = true;
            } else if (result.rateLimited) {
                console.log('⏱️ Notification rate limited');
            }
            
        } catch (error) {
            console.warn('Failed to send visit notification:', error);
            // Fail silently to not affect user experience
        }
    }

    trackSectionViews() {
        // Track navigation clicks
        const navLinks = document.querySelectorAll('header a[href^="#"]');
        navLinks.forEach(link => {
            link.addEventListener('click', (e) => {
                const section = link.getAttribute('href').substring(1);
                this.currentSection = section;
                console.log(`📍 Section viewed: ${section}`);
            });
        });

        // Track scroll-based section detection
        const sections = document.querySelectorAll('section, div[id]');
        if (sections.length > 0) {
            const observer = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting && entry.intersectionRatio > 0.5) {
                        const sectionName = entry.target.id || entry.target.className;
                        if (sectionName && sectionName !== this.currentSection) {
                            this.currentSection = sectionName;
                            console.log(`👁️ Section in view: ${sectionName}`);
                        }
                    }
                });
            }, {
                threshold: 0.5,
                rootMargin: '-10% 0px -10% 0px'
            });

            sections.forEach(section => {
                if (section.id) {
                    observer.observe(section);
                }
            });
        }
    }

    trackTimeSpent() {
        // Send additional notification for extended visits (5+ minutes)
        setTimeout(() => {
            const timeSpent = Math.round((Date.now() - this.visitStartTime) / 1000 / 60);
            if (timeSpent >= 5) {
                this.sendVisitNotification(`extended-visit-${timeSpent}min`, 'portfolio');
                console.log(`⏰ Extended visit tracked: ${timeSpent} minutes`);
            }
        }, 5 * 60 * 1000); // 5 minutes
    }

    trackPageVisibility() {
        let isVisible = true;
        let lastVisibilityChange = Date.now();

        document.addEventListener('visibilitychange', () => {
            const now = Date.now();
            
            if (document.hidden) {
                // Page became hidden
                isVisible = false;
                const timeVisible = Math.round((now - lastVisibilityChange) / 1000);
                console.log(`👁️ Page hidden after ${timeVisible}s visible`);
            } else {
                // Page became visible
                isVisible = true;
                const timeHidden = Math.round((now - lastVisibilityChange) / 1000);
                console.log(`👁️ Page visible after ${timeHidden}s hidden`);
            }
            
            lastVisibilityChange = now;
        });

        // Track when user leaves the page
        window.addEventListener('beforeunload', () => {
            const totalTime = Math.round((Date.now() - this.visitStartTime) / 1000 / 60);
            console.log(`👋 User leaving after ${totalTime} minutes`);
        });
    }

    // Method to manually send notification for specific events
    notifySpecialEvent(eventName, details = {}) {
        this.sendVisitNotification(`special-${eventName}`, 'portfolio');
        console.log(`🎯 Special event tracked: ${eventName}`, details);
    }
}

// Initialize the notification system when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    // Only initialize if not in development mode (to avoid spam during development)
    const isDevelopment = window.location.hostname === 'localhost' || 
                         window.location.hostname === '127.0.0.1' ||
                         window.location.hostname === '';
    
    if (!isDevelopment || window.location.search.includes('notify=true')) {
        window.portfolioNotifier = new PortfolioNotifier();
        console.log('📧 Portfolio notification system initialized');
    } else {
        console.log('🚧 Portfolio notification system disabled in development mode');
        console.log('💡 Add ?notify=true to URL to enable notifications in development');
    }
});

// Track specific portfolio interactions
document.addEventListener('DOMContentLoaded', function() {
    // Track resume views
    const resumeLinks = document.querySelectorAll('a[href*="resume"]');
    resumeLinks.forEach(link => {
        link.addEventListener('click', () => {
            if (window.portfolioNotifier) {
                window.portfolioNotifier.notifySpecialEvent('resume-viewed');
            }
        });
    });

    // Track contact form interactions
    const contactLinks = document.querySelectorAll('a[href*="#contact"], a[href*="mailto:"]');
    contactLinks.forEach(link => {
        link.addEventListener('click', () => {
            if (window.portfolioNotifier) {
                window.portfolioNotifier.notifySpecialEvent('contact-initiated');
            }
        });
    });

    // Track social media clicks
    const socialLinks = document.querySelectorAll('a[href*="linkedin"], a[href*="github"], a[href*="twitter"]');
    socialLinks.forEach(link => {
        link.addEventListener('click', () => {
            const platform = link.href.includes('linkedin') ? 'linkedin' : 
                            link.href.includes('github') ? 'github' : 'social';
            if (window.portfolioNotifier) {
                window.portfolioNotifier.notifySpecialEvent(`${platform}-clicked`);
            }
        });
    });

    // Track project interactions
    const projectLinks = document.querySelectorAll('.project a, [id*="project"] a');
    projectLinks.forEach(link => {
        link.addEventListener('click', () => {
            if (window.portfolioNotifier) {
                window.portfolioNotifier.notifySpecialEvent('project-viewed');
            }
        });
    });
});

// Export for manual usage
window.PortfolioNotifier = PortfolioNotifier;
