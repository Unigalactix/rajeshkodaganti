document.addEventListener('DOMContentLoaded', () => {
    fetch('js/data.json')
        .then(response => response.json())
        .then(data => {
            renderAbout(data.basics, data.skills);
            renderSkills(data.skills);
            renderProjects(data.projects);
            renderCertifications(data.certificates);
            renderBuildLogs(data.projects, data.work);
            renderActivityDashboard(data);
        })
        .catch(error => console.error('Error loading data:', error));

    // Experience Static Toggle Logic
    const expToggleBtn = document.getElementById('experience-toggle-btn');
    if (expToggleBtn) {
        let expExpanded = false;
        expToggleBtn.addEventListener('click', () => {
            expExpanded = !expExpanded;
            const items = document.querySelectorAll('.collapsible-experience');
            items.forEach(item => item.style.display = expExpanded ? '' : 'none');
            expToggleBtn.textContent = expExpanded ? 'Show Less' : 'Show More';
            expToggleBtn.style.background = expExpanded ? 'var(--accent-green)' : 'transparent';
            expToggleBtn.style.color = expExpanded ? 'var(--bg-charcoal)' : 'var(--accent-green)';
        });
    }
});

function renderAbout(basics, skills) {
    const summaryEl = document.getElementById('about-summary');
    const focusEl = document.getElementById('about-focus');
    if (!summaryEl || !focusEl) return;

    const label = basics && basics.label ? basics.label : 'Software Engineer';
    const baseSummary = basics && basics.summary
        ? basics.summary
        : 'Software Engineer focused on building practical and reliable intelligent systems.';

    const highlightedSkills = Array.isArray(skills)
        ? skills.slice(0, 2).flatMap(cat => cat.keywords || []).slice(0, 4)
        : [];

    summaryEl.innerHTML = `I believe technology should not just function, it should <strong>delight</strong>. I am <strong>${label}</strong>, currently focused on turning complex systems into useful products.`;

    if (highlightedSkills.length) {
        const tags = highlightedSkills
            .map(skill => `<span class="text-highlight">${skill}</span>`)
            .join(', ');
        focusEl.innerHTML = `${baseSummary} Current focus includes ${tags}.`;
    } else {
        focusEl.textContent = baseSummary;
    }
}

function renderSkills(skills) {
    const container = document.getElementById('skills-container');
    const toggleBtn = document.getElementById('skills-toggle-btn');
    if (!container) return;

    container.innerHTML = ''; // Clear loading text

    let isExpanded = false;

    skills.forEach((category, index) => {
        const categoryDiv = document.createElement('div');
        categoryDiv.className = 'skill-category';

        // Initially hide categories after the first one
        if (index > 0) {
            categoryDiv.style.display = 'none';
            categoryDiv.classList.add('collapsible-skill');
        }

        const title = document.createElement('h4');
        title.textContent = category.name;
        categoryDiv.appendChild(title);

        const chipsDiv = document.createElement('div');
        chipsDiv.className = 'skill-chips';

        category.keywords.forEach(keyword => {
            const chip = document.createElement('span');
            chip.className = 'skill-pill';
            chip.textContent = keyword;
            chipsDiv.appendChild(chip);
        });

        categoryDiv.appendChild(chipsDiv);
        container.appendChild(categoryDiv);
    });

    // Show toggle button if there are more than 1 category
    if (skills.length > 1 && toggleBtn) {
        toggleBtn.style.display = 'inline-block';

        toggleBtn.addEventListener('click', () => {
            isExpanded = !isExpanded;
            const collapsibleSkills = document.querySelectorAll('.collapsible-skill');

            collapsibleSkills.forEach(skill => {
                skill.style.display = isExpanded ? 'block' : 'none';
            });

            toggleBtn.textContent = isExpanded ? 'Show Less' : 'Show More';
            toggleBtn.style.background = isExpanded ? 'var(--accent-green)' : 'transparent';
            toggleBtn.style.color = isExpanded ? 'var(--bg-charcoal)' : 'var(--accent-green)';
        });
    }
}

function renderProjects(projects) {
    const container = document.getElementById('projects-grid');
    if (!container) return;

    container.innerHTML = '';

    projects.forEach((project, index) => {
        const caseStudy = getCaseStudyCopy(project);

        const card = document.createElement('div');
        card.className = 'browser-card project-card reveal';
        card.setAttribute('data-reveal', 'up');

        if (index >= 3) {
            card.style.display = 'none';
            card.classList.add('collapsible-project');
        }

        // Header
        const header = document.createElement('div');
        header.className = 'browser-header';
        const isRunning = String(project.endDate || '').toLowerCase() === 'present' || /\[wip\]/i.test(project.name || '');
        const statusClass = isRunning ? 'running' : (project.github ? 'stable' : 'experimental');
        const statusLabel = isRunning ? 'Running' : (project.github ? 'Stable' : 'Experimental');
        const fileLabel = (project.name || 'project').toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '').slice(0, 24) || 'module';
        header.innerHTML = `
            <div class="dot red"></div>
            <div class="dot yellow"></div>
            <div class="dot green"></div>
            <div class="browser-address-bar">${fileLabel}.ts</div>
            <span class="status-chip ${statusClass}">${statusLabel}</span>
        `;

        // Content
        const content = document.createElement('div');
        content.className = 'browser-content';

        const kicker = document.createElement('span');
        kicker.className = 'case-kicker';
        kicker.textContent = 'Case Study';

        const title = document.createElement('h3');
        title.textContent = project.name;

        const problem = document.createElement('div');
        problem.className = 'case-row';
        problem.innerHTML = `<strong>Problem</strong><p>${caseStudy.problem}</p>`;

        const approach = document.createElement('div');
        approach.className = 'case-row';
        approach.innerHTML = `<strong>Approach</strong><p>${caseStudy.approach}</p>`;

        const impact = document.createElement('div');
        impact.className = 'case-row';
        impact.innerHTML = `<strong>Impact</strong><p>${caseStudy.impact}</p>`;

        const keywordsDiv = document.createElement('div');
        keywordsDiv.style.marginBottom = '1rem';
        if (project.keywords) {
            project.keywords.forEach(tech => {
                const badge = document.createElement('span');
                badge.className = 'tech-badge'; // We will define this class
                badge.textContent = tech;
                keywordsDiv.appendChild(badge);
            });
        }

        const linksDiv = document.createElement('div');
        linksDiv.className = 'project-links';

        if (project.github) {
            const githubLink = document.createElement('a');
            githubLink.href = project.github;
            githubLink.target = '_blank';
            githubLink.className = 'btn-text';
            githubLink.innerHTML = '<i class="fa fa-github"></i> Code';
            linksDiv.appendChild(githubLink);
        }

        if (project.url) {
            const demoLink = document.createElement('a');
            demoLink.href = project.url;
            demoLink.target = '_blank';
            demoLink.className = 'btn-text';
            demoLink.innerHTML = '<i class="fa fa-external-link"></i> Live';
            linksDiv.appendChild(demoLink);
        }

        if (project.id) {
            const detailsDiv = document.createElement('div');
            detailsDiv.style.marginTop = '1rem';
            detailsDiv.style.textAlign = 'right';
            detailsDiv.style.color = 'var(--accent-green)';
            detailsDiv.textContent = 'Open details() ->';
            linksDiv.appendChild(detailsDiv);

            card.style.cursor = 'pointer';
            card.onclick = () => openProjectModal(project.id);

            // Prevent link clicks from triggering modal
            const anchors = linksDiv.querySelectorAll('a');
            anchors.forEach(a => {
                a.onclick = (e) => e.stopPropagation();
            });
        }

        content.appendChild(kicker);
        content.appendChild(title);
        content.appendChild(problem);
        content.appendChild(approach);
        content.appendChild(impact);
        content.appendChild(keywordsDiv);
        content.appendChild(linksDiv);

        card.appendChild(header);
        card.appendChild(content);

        container.appendChild(card);
    });

    if (typeof initRevealOnScroll === 'function') {
        const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
        initRevealOnScroll(reduced);
    }

    if (typeof initPointerReactiveGlow === 'function') {
        initPointerReactiveGlow();
    }

    const projToggleBtn = document.getElementById('projects-toggle-btn');
    if (projects.length > 3 && projToggleBtn) {
        projToggleBtn.style.display = 'inline-block';
        let projExpanded = false;
        projToggleBtn.addEventListener('click', () => {
            projExpanded = !projExpanded;
            const items = document.querySelectorAll('.collapsible-project');
            items.forEach(item => item.style.display = projExpanded ? '' : 'none');
            projToggleBtn.textContent = projExpanded ? 'Show Less' : 'Show More';
            projToggleBtn.style.background = projExpanded ? 'var(--accent-green)' : 'transparent';
            projToggleBtn.style.color = projExpanded ? 'var(--bg-charcoal)' : 'var(--accent-green)';
        });
    }
}

function getCaseStudyCopy(project) {
    const highlights = Array.isArray(project.highlights) ? project.highlights : [];
    const first = highlights[0] || project.description;
    const second = highlights[1] || project.description;
    const third = highlights[2] || highlights[1] || 'Delivered a reliable and maintainable implementation.';

    return {
        problem: project.description || 'Solved a production-facing engineering challenge.',
        approach: second,
        impact: third || first
    };
}

function renderBuildLogs(projects, work) {
    const marquee = document.getElementById('log-marquee');
    if (!marquee) return;

    const projectLogs = (projects || [])
        .flatMap(project => (project.highlights || []).slice(0, 1).map(item => `BUILD LOG: ${item}`))
        .slice(0, 5);

    const workLogs = (work || [])
        .flatMap(role => (role.highlights || []).slice(0, 1).map(item => `RUNTIME NOTE: ${item}`))
        .slice(0, 3);

    const logs = [...projectLogs, ...workLogs];
    if (!logs.length) return;

    marquee.innerHTML = '';
    const full = logs.concat(logs);
    full.forEach(log => {
        const span = document.createElement('span');
        span.textContent = log;
        marquee.appendChild(span);
    });
}

function renderActivityDashboard(data) {
    const projectCount = document.getElementById('metric-projects');
    const domainCount = document.getElementById('metric-domains');
    const certCount = document.getElementById('metric-certs');
    const heatmap = document.getElementById('commit-heatmap');
    const recentList = document.getElementById('recent-focus-list');

    if (!projectCount || !domainCount || !certCount || !heatmap || !recentList) return;

    const projects = Array.isArray(data.projects) ? data.projects : [];
    const certs = Array.isArray(data.certificates) ? data.certificates : [];
    const domains = new Set();

    projects.forEach(project => {
        (project.keywords || []).forEach(keyword => {
            const root = keyword.toLowerCase().split(' ')[0];
            domains.add(root);
        });
    });

    animateMetric(projectCount, projects.length);
    animateMetric(domainCount, domains.size || 0);
    animateMetric(certCount, certs.length);

    renderHeatmap(heatmap);
    renderRecentFocus(recentList, projects);
}

function animateMetric(element, target) {
    const duration = 900;
    const start = performance.now();

    const tick = (now) => {
        const progress = Math.min((now - start) / duration, 1);
        element.textContent = Math.round(target * progress);
        if (progress < 1) requestAnimationFrame(tick);
    };

    requestAnimationFrame(tick);
}

function renderHeatmap(container) {
    container.innerHTML = '';
    const cells = 147;
    for (let i = 0; i < cells; i += 1) {
        const cell = document.createElement('div');
        const value = Math.floor(Math.random() * 5);
        cell.className = value === 0 ? 'commit-cell' : `commit-cell lv${value}`;
        container.appendChild(cell);
    }
}

function renderRecentFocus(list, projects) {
    list.innerHTML = '';
    projects.slice(0, 5).forEach(project => {
        const li = document.createElement('li');
        const focus = (project.keywords && project.keywords[0]) ? project.keywords[0] : 'Software Engineering';
        li.textContent = `${project.name.replace(/[🛡️🤖📊🔧📹🚀⚡]/g, '').trim()} - Focus: ${focus}`;
        list.appendChild(li);
    });
}

function renderCertifications(certs) {
    const container = document.getElementById('certifications-grid');
    if (!container) return;

    certs.forEach((cert, index) => {
        const card = document.createElement('div');
        card.className = 'cert-card';

        if (index >= 6) {
            card.style.display = 'none';
            card.classList.add('collapsible-cert');
        }

        const icon = document.createElement('div');
        icon.className = 'cert-icon';
        icon.innerHTML = '<i class="fa fa-certificate"></i>'; // Generic icon

        const content = document.createElement('div');
        content.className = 'cert-content';

        const title = document.createElement('h4');
        title.textContent = cert.name;

        const issuer = document.createElement('p');
        issuer.className = 'cert-issuer';
        issuer.textContent = `${cert.issuer} • ${cert.date}`;

        content.appendChild(title);
        content.appendChild(issuer);

        if (cert.url) {
            const link = document.createElement('a');
            link.href = cert.url;
            link.target = '_blank';
            link.className = 'cert-link';
            link.innerHTML = '<i class="fa fa-external-link"></i> Verify';
            content.appendChild(link);
        }

        card.appendChild(icon);
        card.appendChild(content);
        container.appendChild(card);
    });

    const certToggleBtn = document.getElementById('certs-toggle-btn');
    if (certs.length > 6 && certToggleBtn) {
        certToggleBtn.style.display = 'inline-block';
        let certExpanded = false;
        certToggleBtn.addEventListener('click', () => {
            certExpanded = !certExpanded;
            const items = document.querySelectorAll('.collapsible-cert');
            items.forEach(item => item.style.display = certExpanded ? '' : 'none');
            certToggleBtn.textContent = certExpanded ? 'Show Less' : 'Show More';
            certToggleBtn.style.background = certExpanded ? 'var(--accent-green)' : 'transparent';
            certToggleBtn.style.color = certExpanded ? 'var(--bg-charcoal)' : 'var(--accent-green)';
        });
    }
}
