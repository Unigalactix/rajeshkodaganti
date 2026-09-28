/* Shared by browsers and the build: published CSV is the only content source. */
(function (root) {
    'use strict';

    const collections = {
        SocialLinks: ['socialLinks', ['network', 'url']],
        WorkExperience: ['work', ['name', 'position']],
        Education: ['education', ['institution']],
        Skills: ['skills', ['name', 'keywords']],
        Projects: ['projects', ['name', 'description']],
        Certificates: ['certificates', ['name', 'issuer']],
        Books: ['books', ['title', 'status']],
        BookVersions: ['bookVersions', ['book_id', 'label', 'url']],
        Tools: ['tools', ['title', 'url']],
        IF_ELSE: ['stories', ['title', 'url']],
        Interests: ['interests', ['title', 'description']],
        Sections: ['sections', ['heading']],
        ResumeLinks: ['resumeLinks', ['label', 'url']]
    };
    const listFields = ['keywords', 'technologies', 'highlights', 'workflow', 'architecture', 'deliverables', 'tags'];
    const urlFields = ['url', 'github', 'image', 'cover_url', 'secondary_url'];

    function escapeHTML(value) {
        return String(value ?? '').replace(/[&<>"']/g, char => ({
            '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;'
        })[char]);
    }

    function safeURL(value, allowEmail = false) {
        if (!value || value === '#') return '';
        const url = new URL(value);
        if (!['https:', 'http:', ...(allowEmail ? ['mailto:'] : [])].includes(url.protocol)
            || url.username || url.password) {
            throw new Error(`Unsupported public URL: ${value}`);
        }
        return url.href;
    }

    function imageURL(value) {
        const safe = safeURL(value);
        if (!safe) return '';
        const url = new URL(safe);
        if (url.hostname !== 'drive.google.com') return safe;
        const fileMatch = url.pathname.match(/^\/file\/d\/([A-Za-z0-9_-]+)(?:\/|$)/);
        const id = fileMatch?.[1] || (['/open', '/uc', '/thumbnail'].includes(url.pathname) ? url.searchParams.get('id') : '');
        if (!id || !/^[A-Za-z0-9_-]+$/.test(id)) {
            throw new Error('Use a shared Google Drive image file link, not a folder link');
        }
        const image = new URL('https://drive.google.com/thumbnail');
        image.searchParams.set('id', id);
        image.searchParams.set('sz', 'w1600');
        const resourceKey = url.searchParams.get('resourcekey');
        if (resourceKey) image.searchParams.set('resourcekey', resourceKey);
        return image.href;
    }

    function publishedSheetIDs(html) {
        const sheets = Object.create(null);
        const pattern = /items\.push\(\{name:\s*("(?:\\.|[^"\\])*")[\s\S]*?\bgid:\s*"(\d+)"/g;
        for (const match of html.matchAll(pattern)) {
            const name = JSON.parse(match[1]);
            if (Object.hasOwn(sheets, name)) throw new Error(`Duplicate published tab name: ${name}`);
            sheets[name] = match[2];
        }
        if (!Object.keys(sheets).length) throw new Error('Cannot discover published tabs. Publish the entire document as a Web page.');
        return sheets;
    }

    function parseCSV(input) {
        const text = input.replace(/^\uFEFF/, '');
        const rows = [];
        let row = [], cell = '', quoted = false, closed = false;
        const pushCell = () => { row.push(cell); cell = ''; closed = false; };
        for (let i = 0; i < text.length; i++) {
            const char = text[i];
            if (quoted) {
                if (char === '"' && text[i + 1] === '"') { cell += '"'; i++; }
                else if (char === '"') { quoted = false; closed = true; }
                else cell += char;
            } else if (char === ',' || char === '\n' || char === '\r') {
                pushCell();
                if (char !== ',') {
                    rows.push(row); row = [];
                    if (char === '\r' && text[i + 1] === '\n') i++;
                }
            } else if (char === '"' && !cell && !closed) {
                quoted = true;
            } else {
                if (closed || char === '"') throw new Error('Malformed CSV quoting');
                cell += char;
            }
        }
        if (quoted) throw new Error('Unterminated CSV field');
        if (cell || closed || row.length) { pushCell(); rows.push(row); }
        return rows;
    }

    function readRows(name, csv, onIssue) {
        const [rawHeaders, ...values] = parseCSV(csv);
        if (!rawHeaders) throw new Error(`${name}: empty response (keep the header row)`);
        const headers = rawHeaders.map(header => header.trim());
        if (headers.some(header => !header || ['__proto__', 'constructor', 'prototype'].includes(header))
            || new Set(headers).size !== headers.length) throw new Error(`${name}: invalid or duplicate headers`);
        const required = name === 'Profile' ? ['field', 'value']
            : name === 'SiteContent' ? ['page', 'key', 'value']
                : ['id', 'enabled', 'sort_order', ...collections[name][1]];
        for (const key of required) {
            if (!headers.includes(key)) throw new Error(`${name}: missing column ${key}`);
        }
        const seen = new Set();
        const rows = [];
        for (const [index, valuesRow] of values.entries()) {
            if (valuesRow.every(value => !value.trim())) continue;
            try {
                if (valuesRow.length > headers.length) throw new Error(`${name} row ${index + 2}: too many cells`);
                const row = Object.fromEntries(headers.map((key, i) => [key, (valuesRow[i] || '').trim()]));
                const identity = name === 'Profile' ? row.field
                    : name === 'SiteContent' ? `${row.page}/${row.key}` : row.id;
                if (!identity || seen.has(identity)) throw new Error(`${name} row ${index + 2}: missing or duplicate key ${identity}`);
                seen.add(identity);
                if (name === 'Profile' || name === 'SiteContent') {
                    if (name === 'SiteContent' && (!row.page || !row.key)) throw new Error(`${name}: page and key are required`);
                    rows.push(row);
                    continue;
                }
                if (!/^(TRUE|FALSE)$/i.test(row.enabled)) throw new Error(`${name}/${identity}: enabled must be TRUE or FALSE`);
                if (row.enabled.toUpperCase() === 'FALSE') continue;
                if (!/^[1-9]\d*$/.test(row.sort_order) || !Number.isSafeInteger(Number(row.sort_order))) {
                    throw new Error(`${name}/${identity}: sort_order must be a positive whole number`);
                }
                for (const key of collections[name][1]) {
                    if (!row[key]) throw new Error(`${name}/${identity}: ${key} is required`);
                }
                row.sort_order = Number(row.sort_order);
                row.enabled = true;
                if (row.featured && !/^(TRUE|FALSE)$/i.test(row.featured)) throw new Error(`${name}/${identity}: invalid featured value`);
                row.featured = String(row.featured).toUpperCase() === 'TRUE';
                for (const key of listFields) row[key] = (row[key] || '').split(/\r?\n/).map(item => item.trim()).filter(Boolean);
                for (const key of urlFields) {
                    if (!row[key]) continue;
                    try {
                        row[key] = ['image', 'cover_url'].includes(key)
                            ? imageURL(row[key]) : safeURL(row[key], name === 'SocialLinks');
                    } catch (error) {
                        throw new Error(`${name}/${identity}: ${key}: ${error.message}`, { cause: error });
                    }
                }
                if (row.icon && !/^fa(?: fa-[a-z0-9-]+)+$/.test(row.icon)) throw new Error(`${name}/${identity}: invalid icon classes`);
                for (const key of ['startDate', 'endDate']) {
                    if (row[key] && !(key === 'endDate' && row[key] === 'Present')
                        && !/^\d{4}-(0[1-9]|1[0-2])$/.test(row[key])) throw new Error(`${name}/${identity}: invalid ${key}; use YYYY-MM or Present for endDate`);
                }
                if (name === 'Books') {
                    if (!['available', 'versions', 'coming_soon'].includes(row.status)) throw new Error(`Books/${identity}: invalid status`);
                    if (row.status === 'available' && !row.url) throw new Error(`Books/${identity}: available books require url`);
                }
                rows.push(row);
            } catch (error) {
                if (!onIssue || name === 'Profile' || name === 'SiteContent') throw error;
                onIssue(`${name} row ${index + 2}: ${error.message}. This row is not displayed until corrected.`);
            }
        }
        return rows.sort((a, b) => (a.sort_order || 0) - (b.sort_order || 0));
    }

    function toPortfolio(tabs, onIssue) {
        const profile = Object.fromEntries((tabs.Profile || []).map(row => [row.field, row.value]));
        if (tabs.Profile && !profile.name) throw new Error('Profile: name is required');
        for (const key of ['photo_url', 'website_url', 'contact_form_url']) {
            if (profile[key]) profile[key] = key === 'photo_url' ? imageURL(profile[key]) : safeURL(profile[key]);
        }
        const basics = { ...profile, location: {
            city: profile['location.city'] || '', region: profile['location.region'] || '',
            countryCode: profile['location.countryCode'] || ''
        }, profiles: tabs.SocialLinks || [] };
        const result = { basics, siteContent: tabs.SiteContent || [] };
        for (const [sheet, [key]] of Object.entries(collections)) result[key] = tabs[sheet] || [];
        if (tabs.Books && tabs.BookVersions) {
            const books = new Map(result.books.map(book => [book.id, book]));
            // A disabled parent intentionally hides its editions; a deleted parent is reported.
            for (const edition of result.bookVersions) {
                if (!books.has(edition.book_id)) console.warn(`BookVersions/${edition.id}: parent ${edition.book_id} is absent or disabled; edition is not displayed.`);
            }
            result.books = result.books.filter(book => {
                if (book.status === 'versions' && !result.bookVersions.some(row => row.book_id === book.id)) {
                    const message = `Books/${book.id}: versions book has no enabled BookVersions`;
                    if (!onIssue) throw new Error(message);
                    onIssue(`${message}. This book is not displayed until corrected.`);
                    return false;
                }
                return true;
            });
        }
        return result;
    }

    async function fetchPublishedText(url, fetchImpl) {
        for (let attempt = 0; attempt < 3; attempt++) {
            let retryable = false;
            try {
                const response = await fetchImpl(url, { cache: 'no-store', signal: AbortSignal.timeout(25000) });
                if (!response.ok) {
                    retryable = response.status === 429 || response.status >= 500;
                    throw new Error(`HTTP ${response.status}`);
                }
                return await response.text();
            } catch (error) {
                retryable ||= error instanceof TypeError || ['TimeoutError', 'AbortError'].includes(error.name);
                if (!retryable || attempt === 2) throw error;
                console.warn(`Published sheet request failed; retrying (${attempt + 1}/2): ${error.message}`);
                await new Promise(resolve => setTimeout(resolve, 500 * (attempt + 1)));
            }
        }
    }

    async function loadAll(config, fetchImpl = fetch, names = ['Profile', ...Object.keys(collections), 'SiteContent'], options = {}) {
        if (!/^https:\/\/docs\.google\.com\/spreadsheets\/d\/e\/[A-Za-z0-9_-]+\/pub(?:html)?$/.test(config.publicationUrl)) {
            throw new Error('Invalid Google Sheets publication URL');
        }
        const exportUrl = config.publicationUrl.replace(/\/pubhtml$/, '/pub');
        const sheetIDs = config.discoverSheets
            ? publishedSheetIDs(await fetchPublishedText(`${exportUrl}html`, fetchImpl))
            : config.sheets;
        const tabs = {};
        const issues = [];
        const onIssue = options.tolerateInvalidRows ? message => {
            issues.push(message);
            console.warn(message);
        } : undefined;
        // Limit simultaneous requests to avoid flooding the publication endpoint.
        let next = 0;
        async function worker() {
            while (next < names.length) {
                const name = names[next++];
                const gid = sheetIDs[name];
                if (!/^\d+$/.test(String(gid))) throw new Error(`Missing published tab ${name}. Keep its name unchanged and publish the entire document.`);
                const url = `${exportUrl}?output=csv&gid=${gid}`;
                try {
                    tabs[name] = readRows(name, await fetchPublishedText(url, fetchImpl), onIssue);
                } catch (error) {
                    throw new Error(`Cannot load ${name}: ${error.message}`, { cause: error });
                }
            }
        }
        await Promise.all(Array.from({ length: Math.min(4, names.length) }, worker));
        const data = toPortfolio(tabs, onIssue);
        data.contentIssues = issues;
        return data;
    }

    const api = { parseCSV, readRows, toPortfolio, loadAll, escapeHTML, safeURL, imageURL, publishedSheetIDs };
    if (typeof module !== 'undefined' && module.exports) module.exports = api;
    else root.SheetSource = api;
})(typeof window === 'undefined' ? globalThis : window);
