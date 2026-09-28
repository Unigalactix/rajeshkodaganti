/* Render public sheet values as text, never as executable HTML. */
const sheetPage = location.pathname.split('/').pop() || 'index.html';
const sharedSheets = ['Profile', 'SocialLinks', 'SiteContent', 'ResumeLinks'];
const pageSheets = {
    'index.html': ['WorkExperience', 'Education', 'Skills', 'Projects', 'Certificates', 'Interests', 'Sections'],
    'books.html': ['Books', 'BookVersions'],
    'tools.html': ['Tools'],
    'if-else.html': ['IF_ELSE']
};

function contentElement(tag, className = '', value = '') {
    const node = document.createElement(tag);
    node.className = className;
    node.textContent = value;
    return node;
}

function contentLink(url, label, className = 'btn-fun') {
    const link = contentElement('a', className, label);
    link.href = SheetSource.safeURL(url, true);
    link.target = '_blank';
    link.rel = 'noopener noreferrer';
    return link;
}

function contentIcon(className) {
    const icon = contentElement('i', className || 'fa fa-star-o');
    icon.setAttribute('aria-hidden', 'true');
    return icon;
}

function setContentImage(image, url, label, priority = false) {
    const warning = contentElement('span', 'media-warning');
    warning.hidden = true;
    image.after(warning);
    image.loading = priority ? 'eager' : 'lazy';
    image.fetchPriority = priority ? 'high' : 'auto';
    image.alt = label;
    image.addEventListener('load', () => { warning.hidden = true; });
    image.addEventListener('error', () => {
        console.error(`Image could not be loaded: ${label}`, url);
        warning.textContent = `${label}: image unavailable. Check the file link and public sharing permissions.`;
        warning.setAttribute('role', 'status');
        warning.hidden = false;
    });
    image.src = SheetSource.imageURL(url);
}

function showContentError(error) {
    console.error('Published portfolio content is unavailable:', error);
    const status = document.getElementById('content-status');
    if (status) {
        status.hidden = false;
        status.setAttribute('role', 'alert');
        status.replaceChildren(
            contentElement('strong', '', 'Website content could not be loaded. '),
            document.createTextNode('Check the published sheet, then retry. '),
            contentElement('p', 'content-error-detail', error.message)
        );
        const retry = contentElement('button', 'btn-fun btn-outline-fun', 'Retry');
        retry.type = 'button';
        retry.addEventListener('click', () => location.reload());
        status.append(retry);
    }
    document.querySelectorAll('[data-content-loading]').forEach(node => {
        node.textContent = 'Content unavailable. Use Retry above.';
    });
}

function showContentStatus(data) {
    const status = document.getElementById('content-status');
    if (!status) return;
    status.hidden = false;
    const issues = data.contentIssues || [];
    status.setAttribute('role', issues.length ? 'alert' : 'status');
    status.replaceChildren(contentElement('span', '', issues.length
        ? 'Content loaded with issues. Valid entries are shown; correct the rows below and refresh.'
        : 'Content loaded from Google Sheets.'));
    if (issues.length) {
        const list = contentElement('ul', 'content-issues');
        list.append(...issues.map(issue => contentElement('li', '', issue)));
        status.append(list);
    }
    const refresh = contentElement('button', 'btn-fun btn-outline-fun', 'Refresh content');
    refresh.type = 'button';
    refresh.addEventListener('click', () => location.reload());
    status.append(refresh);
}

function renderSiteCopy(data) {
    const copy = new Map(data.siteContent.filter(row => row.page === sheetPage).map(row => [row.key, row.value]));
    const selectors = [
        '.page-head .hero-tag', '.page-title', '.page-intro', '.subpage-breadcrumb',
        'footer .footer-signoff', 'footer .container > p:last-child', '.hero-tag', '#lead h1',
        '.hero-role', '.lead-content > p:not([class])', '.hero-impact', '.scene-coordinate',
        '.scene-caption', '.explorer-card .section-eyebrow', '.explorer-card strong',
        '.explorer-card div > span:last-child', '.hero-scroll',
        '.skills-card .browser-header span', '.skills-card h3'
    ];
    for (const selector of selectors) {
        if (!copy.has(selector)) continue;
        const node = document.querySelector(selector);
        if (!node) continue;
        let value = copy.get(selector);
        if (selector === 'footer .container > p:last-child') {
            value = value.replace(/^\u00a9 \d{4}/, `\u00a9 ${new Date().getFullYear()}`);
        }
        if (selector === '#lead h1') {
            const split = value.indexOf('. ');
            node.replaceChildren(document.createTextNode(split < 0 ? '' : value.slice(0, split + 1)),
                document.createElement('br'),
                contentElement('span', 'celestial-heading', split < 0 ? value : value.slice(split + 2)));
        } else if (selector === '.page-title') {
            const words = value.split(/\s+/);
            node.replaceChildren(document.createTextNode(words.slice(0, -2).join(' ') + (words.length > 2 ? ' ' : '')),
                contentElement('span', 'grad-text', words.slice(-2).join(' ')));
        } else {
            const ornament = node.querySelector('i, .runtime-dot')?.cloneNode(true);
            node.textContent = value;
            if (ornament) node.prepend(ornament, document.createTextNode(' '));
        }
    }
    if (copy.has('page_title')) document.title = copy.get('page_title');
    const metaNames = ['description', 'keywords', 'author', 'og:type', 'og:title', 'og:description',
        'og:url', 'og:image', 'og:image:alt', 'twitter:card', 'twitter:title', 'twitter:description', 'twitter:image'];
    for (const name of metaNames) {
        if (!copy.has(`meta.${name}`)) continue;
        const attribute = name.startsWith('og:') ? 'property' : 'name';
        let node = document.head.querySelector(`meta[${attribute}="${name}"]`);
        if (!node) {
            node = document.createElement('meta');
            node.setAttribute(attribute, name);
            document.head.append(node);
        }
        node.content = copy.get(`meta.${name}`);
    }
    if (copy.get('canonical_url')) document.querySelector('link[rel="canonical"]').href = SheetSource.safeURL(copy.get('canonical_url'));
    document.querySelectorAll('.map-node-group').forEach((group, index) => {
        group.querySelector('.map-label').textContent = copy.get(`system_map.${index + 1}.label`) || '';
        group.querySelector('.map-sub').textContent = copy.get(`system_map.${index + 1}.subtitle`) || '';
    });
    document.querySelectorAll('.realm-card').forEach((realm, index) => {
        for (const selector of ['.section-eyebrow', 'h3', 'p', '.realm-link']) {
            realm.querySelector(selector).textContent = copy.get(`realm.${index + 1}.${selector}`) || '';
        }
        const url = copy.get(`realm.${index + 1}.url`);
        if (url) realm.href = SheetSource.safeURL(url);
        else realm.hidden = true;
    });
    document.querySelectorAll('[data-site-copy]').forEach(node => {
        node.textContent = copy.get(node.dataset.siteCopy) || '';
    });
    const about = copy.get('about_intro_template');
    if (about !== undefined) {
        const node = document.getElementById('about-summary');
        if (node) node.textContent = about.replaceAll('{label}', data.basics.label || '');
    }
    if (sheetPage === 'index.html') {
        const profile = data.basics;
        const structured = {
            '@context': 'https://schema.org', '@type': 'Person', name: profile.name,
            url: profile.website_url || '', image: profile.photo_url || '',
            jobTitle: (profile.label || '').replace(/^a /, ''), email: profile.email || '',
            sameAs: data.socialLinks.map(row => row.url).filter(url => url.startsWith('https://')),
            address: { '@type': 'PostalAddress', addressLocality: profile.location.city,
                addressRegion: profile.location.region, addressCountry: profile.location.countryCode }
        };
        const node = document.querySelector('script[type="application/ld+json"]');
        node.textContent = JSON.stringify(structured).replaceAll('<', '\\u003c');
    }
}

function renderSharedContent(data) {
    const profile = data.basics;
    document.querySelectorAll('.logo a').forEach(node => { node.textContent = profile.name; });
    document.querySelectorAll('[data-profile]').forEach(node => { node.textContent = profile[node.dataset.profile] || ''; });
    const photo = document.querySelector('.celestial-portrait');
    if (photo) {
        photo.hidden = !profile.photo_url;
        if (profile.photo_url) setContentImage(photo, profile.photo_url, profile.photo_alt || profile.name, true);
    }
    const social = new Map(data.socialLinks.map(row => [row.id, row]));
    document.querySelectorAll('[data-link]').forEach(node => {
        const item = social.get(node.dataset.link);
        node.hidden = !item?.url;
        if (item?.url) node.href = item.url;
    });
    document.querySelectorAll('.social-icons').forEach(container => {
        container.replaceChildren(...data.socialLinks.filter(row => row.url).map(row => {
            const link = contentLink(row.url, '', '');
            link.setAttribute('aria-label', row.network);
            link.append(contentIcon(row.icon));
            return link;
        }));
    });
    const form = document.querySelector('.contact-form');
    if (form) {
        form.hidden = !profile.contact_form_url;
        if (profile.contact_form_url) form.action = profile.contact_form_url;
    }
    const resumeMenu = document.querySelector('.resume-pop-card');
    if (resumeMenu) {
        resumeMenu.replaceChildren(...data.resumeLinks.map(row => {
            const link = contentLink(row.url, '', '');
            link.setAttribute('role', 'menuitem');
            const label = contentElement('span', 'resume-opt', row.label);
            label.append(contentElement('small', '', row.description || ''));
            link.append(contentIcon('fa fa-file-pdf-o'), label);
            return link;
        }));
        resumeMenu.closest('details').hidden = data.resumeLinks.length === 0;
    }
}

function renderSheetSections(data) {
    if (sheetPage !== 'index.html') return;
    const sections = new Map(data.sections.map(row => [row.id, row]));
    document.querySelectorAll('main > section:not(#lead):not(#build-logs)').forEach(node => {
        node.hidden = !sections.has(node.id);
    });
    let previous = document.getElementById('build-logs');
    for (const row of data.sections) {
        const section = document.getElementById(row.id);
        if (!section?.matches('main > section')) throw new Error(`Sections: unknown section ${row.id}`);
        section.querySelector('.section-eyebrow').textContent = row.eyebrow || '';
        section.querySelector('h2').textContent = row.heading;
        const intro = section.querySelector(':scope > .container > .section-intro, :scope > .container > .interest-intro');
        if (intro) intro.textContent = row.intro || '';
        if (previous.nextElementSibling !== section) previous.after(section);
        previous = section;
    }
    document.querySelectorAll('a[href^="#"]').forEach(link => {
        const id = link.getAttribute('href').slice(1);
        if (id && document.getElementById(id)?.hidden) link.hidden = true;
    });
}

function browserCard(label) {
    const card = contentElement('article', 'browser-card');
    const header = contentElement('div', 'browser-header');
    header.append(contentElement('span', 'card-label', label));
    const body = contentElement('div', 'browser-content');
    card.append(header, body);
    return { card, body };
}

function renderEducationAndInterests(data) {
    const education = document.querySelector('.education-grid');
    if (education) {
        education.replaceChildren(...data.education.map((row, index) => {
            const { card, body } = browserCard(`EDUCATION / ${String(index + 1).padStart(2, '0')}`);
            card.classList.add('accessible-card');
            card.tabIndex = 0;
            card.setAttribute('role', 'button');
            card.setAttribute('aria-label', `View ${row.institution} education details`);
            card.dataset.educationId = row.id;
            body.append(contentElement('h3', '', row.card_title || row.institution),
                contentElement('span', 'card-role', row.card_degree || [row.studyType, row.area].filter(Boolean).join(' - ')),
                contentElement('span', 'card-date', row.card_dates || `${row.startDate || ''} - ${row.endDate || ''}`),
                contentElement('p', '', row.card_summary || ''),
                contentElement('span', 'card-open', 'Explore education \u2197'));
            card.addEventListener('click', () => openEducationModal(row.id));
            card.addEventListener('keydown', event => {
                if (event.key === 'Enter' || event.key === ' ') { event.preventDefault(); openEducationModal(row.id); }
            });
            return card;
        }));
    }
    const interests = document.querySelector('.interests-grid');
    if (interests) {
        interests.replaceChildren(...data.interests.map(row => {
            const card = contentElement('article', 'interest-card');
            const icon = contentElement('div', 'interest-icon');
            icon.append(contentIcon(row.icon));
            const tags = contentElement('div', 'interest-tags');
            tags.append(...row.tags.map(tag => contentElement('span', '', tag)));
            card.append(icon, contentElement('h3', '', row.title), contentElement('p', '', row.description), tags);
            return card;
        }));
    }
}

function renderBooks(data) {
    const grid = document.querySelector('.book-grid');
    if (!grid) return;
    grid.replaceChildren(...data.books.map((row, index) => {
        const column = contentElement('div', 'col-md-4');
        const { card, body } = browserCard(row.label || 'BOOK');
        card.classList.add('book-card');
        if (row.cover_url) {
            const image = contentElement('img', 'book-cover');
            body.append(image);
            setContentImage(image, row.cover_url, row.cover_alt || row.title, index < 3);
        }
        const meta = contentElement('div', 'book-meta');
        meta.append(contentElement('h3', '', row.title), contentElement('p', '', row.action_text || ''));
        body.append(meta);
        if (row.status === 'available') {
            const link = contentLink(row.url, '', 'book-destination');
            link.append(card);
            column.append(link);
        } else {
            column.append(card);
            if (row.status === 'versions') {
                card.classList.add('is-clickable');
                card.setAttribute('role', 'button');
                card.setAttribute('aria-haspopup', 'dialog');
                card.tabIndex = 0;
                const open = () => {
                    const dialog = document.getElementById('book-editions');
                    const title = data.siteContent.find(item => item.page === 'books.html' && item.key === 'edition_dialog_title')?.value;
                    dialog.querySelector('h3').textContent = row.id === 'eta' && title ? title : `Choose an edition of ${row.title}`;
                    dialog.querySelector('.edition-links').replaceChildren(...data.bookVersions
                        .filter(item => item.book_id === row.id)
                        .map(item => contentLink(item.url, item.label)));
                    dialog.showModal();
                    document.body.style.overflow = 'hidden';
                };
                card.addEventListener('click', open);
                card.addEventListener('keydown', event => {
                    if (event.key === 'Enter' || event.key === ' ') { event.preventDefault(); open(); }
                });
            } else {
                card.classList.add('is-soon');
                body.prepend(contentElement('span', 'book-badge', row.action_text || 'Coming soon'));
            }
        }
        return column;
    }));
    const dialog = document.getElementById('book-editions');
    dialog.querySelector('button').addEventListener('click', () => dialog.close());
    dialog.addEventListener('click', event => { if (event.target === dialog) dialog.close(); });
    dialog.addEventListener('keydown', event => {
        if (event.key === 'Escape') { event.preventDefault(); dialog.close(); }
    });
    dialog.addEventListener('close', () => { document.body.style.overflow = ''; });
    if (!data.books.length) grid.append(contentElement('p', 'empty-content', 'No books published yet.'));
}

function renderTools(data) {
    const grid = document.querySelector('.tool-grid');
    if (!grid) return;
    const rows = sheetPage === 'tools.html' ? data.tools : data.stories;
    grid.replaceChildren(...rows.map(row => {
        const column = contentElement('div', 'col-md-4 col-sm-6');
        const { card, body } = browserCard(row.label || 'TOOL');
        card.classList.add('tool-card');
        const top = contentElement('div', 'tool-topline');
        const badge = contentElement('span', 'tool-badge');
        badge.append(contentIcon(row.icon));
        top.append(badge);
        if (row.status) {
            const status = contentElement('span', `tool-status ${row.status === 'live' ? 'status-live' : 'status-sleep'}`, row.status);
            status.prepend(contentElement('span', 'status-dot'));
            top.append(status);
        }
        const tags = contentElement('div', 'tool-meta');
        const tagStyles = { automation: 'automation', extraction: 'extraction', code: 'code',
            markdown: 'markdown', typography: 'code', resume: 'resume', security: 'security',
            'ai agent': 'ai', 'ai learning': 'ai', 'job search': 'code', rag: 'code',
            story: 'story', epic: 'epic', concept: 'concept' };
        tags.append(...row.tags.map(tag => contentElement('span', `tool-tag${tagStyles[tag] ? ` tag-${tagStyles[tag]}` : ''}`, tag)));
        const actions = contentElement('div', 'tool-actions');
        actions.append(contentLink(row.url, row.action_text || 'Open'));
        if (row.secondary_url) actions.append(contentLink(row.secondary_url, row.secondary_action_text || 'More', 'btn-fun btn-outline-fun'));
        const title = contentElement('h3', 'tool-title', row.title);
        const copy = contentElement('div');
        copy.append(title, contentElement('p', 'tool-description', row.description || ''));
        if (sheetPage === 'if-else.html') {
            title.prepend(contentIcon(row.icon), document.createTextNode(' '));
            body.append(tags, copy, actions);
        } else body.append(top, copy, tags, actions);
        column.append(card);
        return column;
    }));
    if (!rows.length) grid.append(contentElement('p', 'empty-content', 'No entries published yet.'));
}

window.portfolioReady = new Promise((resolve, reject) => {
    document.addEventListener('DOMContentLoaded', async () => {
        try {
            const response = await fetch('js/sheets-config.json', { cache: 'no-store', signal: AbortSignal.timeout(10000) });
            if (!response.ok) throw new Error(`Sheet configuration: HTTP ${response.status}`);
            const data = await SheetSource.loadAll(await response.json(), fetch,
                [...sharedSheets, ...(pageSheets[sheetPage] || [])], { tolerateInvalidRows: true });
            renderSharedContent(data);
            renderSiteCopy(data);
            renderSheetSections(data);
            renderEducationAndInterests(data);
            renderBooks(data);
            renderTools(data);
            window.PORTFOLIO_DATA = data;
            showContentStatus(data);
            document.dispatchEvent(new CustomEvent('portfolio:ready', { detail: data }));
            resolve(data);
        } catch (error) {
            reject(error);
        }
    }, { once: true });
});
window.portfolioReady.catch(showContentError);
