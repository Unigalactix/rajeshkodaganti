document.addEventListener('DOMContentLoaded', () => {
    fetch('js/data.json')
        .then(response => response.json())
        .then(data => {
            renderSkills(data.skills);
            renderProjects(data.projects);
            renderCertifications(data.certificates);
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

    projects.forEach((project, index) => {
        // Create card structure
        const card = document.createElement('div');
        card.className = 'browser-card project-card';

        if (index >= 3) {
            card.style.display = 'none';
            card.classList.add('collapsible-project');
        }

        // Header
        const header = document.createElement('div');
        header.className = 'browser-header';
        header.innerHTML = `
            <div class="dot red"></div>
            <div class="dot yellow"></div>
            <div class="dot green"></div>
            <div class="browser-address-bar" style="opacity:0.5; font-size: 10px; line-height: 10px; padding-left: 5px; color: #aaa;">${project.startDate} - ${project.endDate}</div>
        `;

        // Content
        const content = document.createElement('div');
        content.className = 'browser-content';

        // Title & Description
        const title = document.createElement('h3');
        title.textContent = project.name;

        const description = document.createElement('p');
        description.textContent = project.description;
        description.style.marginBottom = '1rem';

        // Tech Stack
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

        // Links
        const linksDiv = document.createElement('div');
        linksDiv.style.marginTop = 'auto';
        linksDiv.style.textAlign = 'right';

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
            demoLink.style.marginLeft = '10px';
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

        // Append everything
        content.appendChild(title);
        content.appendChild(description);
        content.appendChild(keywordsDiv);
        content.appendChild(linksDiv);

        card.appendChild(header);
        card.appendChild(content);

        container.appendChild(card);
    });

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
