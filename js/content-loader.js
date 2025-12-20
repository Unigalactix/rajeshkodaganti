document.addEventListener('DOMContentLoaded', () => {
    fetch('js/data.json')
        .then(response => response.json())
        .then(data => {
            renderSkills(data.skills);
            renderProjects(data.projects);
            renderCertifications(data.certificates);
        })
        .catch(error => console.error('Error loading data:', error));
});

function renderSkills(skills) {
    const container = document.getElementById('skills-container');
    if (!container) return;

    container.innerHTML = ''; // Clear loading text

    skills.forEach(category => {
        const categoryDiv = document.createElement('div');
        categoryDiv.className = 'skill-category';

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
}

function renderProjects(projects) {
    const container = document.getElementById('projects-grid');
    if (!container) return;

    projects.forEach(project => {
        // Create card structure
        const card = document.createElement('div');
        card.className = 'browser-card project-card';

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

        // Append everything
        content.appendChild(title);
        content.appendChild(description);
        content.appendChild(keywordsDiv);
        content.appendChild(linksDiv);

        card.appendChild(header);
        card.appendChild(content);

        container.appendChild(card);
    });
}

function renderCertifications(certs) {
    const container = document.getElementById('certifications-grid');
    if (!container) return;

    certs.forEach(cert => {
        const card = document.createElement('div');
        card.className = 'cert-card';

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
}
