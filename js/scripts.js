/*!
    Title: Dev Portfolio Template
    Version: 1.2.3
    Last Change: 07/20/2025
    Author: Rajesh Kodaganti
    Description: Portfolio scripts for Rajesh Kodaganti (Vanilla JS)
*/

document.addEventListener('DOMContentLoaded', function () {

    // 1. Load Profile Data from config.js
    if (window.PROFILE_DATA) {
        const data = window.PROFILE_DATA;

        // Social Links (using data-link attribute)
        const socialLinks = {
            'github': data.social.github,
            'linkedin': data.social.linkedin,
            'email': data.social.email
        };

        // Update all elements with data-link attribute
        for (const [key, url] of Object.entries(socialLinks)) {
            document.querySelectorAll(`[data-link="${key}"]`).forEach(el => {
                el.href = url;
            });
        }
    }

    // Remove no-js class
    document.documentElement.classList.remove('no-js');

    // Mobile Menu Logic
    const header = document.querySelector('header');
    const mobileMenuOpen = document.getElementById('mobile-menu-open');
    const mobileMenuClose = document.getElementById('mobile-menu-close');

    if (mobileMenuOpen) {
        mobileMenuOpen.addEventListener('click', () => {
            header.classList.add('active');
            document.body.classList.add('active');
        });
    }

    if (mobileMenuClose) {
        mobileMenuClose.addEventListener('click', () => {
            header.classList.remove('active');
            document.body.classList.remove('active');
        });
    }

    // Smooth Scrolling for Anchor Links
    document.querySelectorAll('header a').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            // Treat as normal link if no-scroll class
            if (this.classList.contains('no-scroll')) return;

            e.preventDefault();
            const targetId = this.getAttribute('href');
            const targetElement = document.querySelector(targetId);

            if (targetElement) {
                const scrollDistance = targetElement.offsetTop;

                window.scrollTo({
                    top: scrollDistance,
                    behavior: 'smooth'
                });

                // Hide the menu once clicked if mobile
                if (header.classList.contains('active')) {
                    header.classList.remove('active');
                    document.body.classList.remove('active');
                }
            }
        });
    });

    // Scroll to first element (down arrow)
    const leadDownBtn = document.querySelector('#lead-down span');
    const leadSection = document.getElementById('lead');

    if (leadDownBtn && leadSection) {
        leadDownBtn.addEventListener('click', function () {
            const nextSection = leadSection.nextElementSibling;
            if (nextSection) {
                window.scrollTo({
                    top: nextSection.offsetTop,
                    behavior: 'smooth'
                });
            }
        });
    }

    // Timeline Visualization
    const experienceTimeline = document.getElementById('experience-timeline');
    if (experienceTimeline) {
        const userContent = Array.from(experienceTimeline.children);

        userContent.forEach(content => {
            // Check if it's already processed to avoid duplication if run multiple times
            if (content.classList.contains('vtimeline-point')) return;

            // Create wrapper structure
            // Original: .wrap('<div class="vtimeline-point"><div class="vtimeline-block"></div></div>')

            const pointDiv = document.createElement('div');
            pointDiv.className = 'vtimeline-point';

            const blockDiv = document.createElement('div');
            blockDiv.className = 'vtimeline-block';

            // Move content into block
            content.classList.add('vtimeline-content');

            // Re-structure
            // We need to replace 'content' with 'pointDiv' in the DOM, and put 'content' inside 'blockDiv'
            content.parentNode.insertBefore(pointDiv, content);
            blockDiv.appendChild(content);
            pointDiv.appendChild(blockDiv);

            // Add Icon
            // Original: .prepend('<div class="vtimeline-icon"><i class="fa fa-map-marker"></i></div>')
            const iconDiv = document.createElement('div');
            iconDiv.className = 'vtimeline-icon';
            iconDiv.innerHTML = '<i class="fa fa-map-marker"></i>';
            pointDiv.insertBefore(iconDiv, blockDiv);

            // Add Date
            // Original: var date = $(this).data('date');
            const date = content.getAttribute('data-date');
            if (date) {
                const dateSpan = document.createElement('span');
                dateSpan.className = 'vtimeline-date';
                dateSpan.textContent = date;
                pointDiv.insertBefore(dateSpan, blockDiv); // Prepend to parent of block (pointDiv)
            }
        });
    }

    // Load More Projects
    const viewMoreBtn = document.getElementById('view-more-projects');
    const moreProjectsDiv = document.getElementById('more-projects');

    if (viewMoreBtn && moreProjectsDiv) {
        viewMoreBtn.addEventListener('click', function (e) {
            e.preventDefault();

            // Fade out button
            this.style.opacity = '0';
            this.style.transition = 'opacity 0.3s';
            setTimeout(() => {
                this.style.display = 'none';

                // Fade in projects
                moreProjectsDiv.style.opacity = '0';
                moreProjectsDiv.style.display = 'block'; // Assuming CSS is handling layout

                // Trigger reflow
                void moreProjectsDiv.offsetWidth;

                moreProjectsDiv.style.transition = 'opacity 0.3s';
                moreProjectsDiv.style.opacity = '1';
            }, 300);
        });
    }
});
