const { test } = require('node:test');
const assert = require('node:assert/strict');
const { parseCSV, readRows, toPortfolio, loadAll, escapeHTML, safeURL, imageURL, publishedSheetIDs } = require('../js/sheet-source.js');
const config = { ...require('../js/sheets-config.json'), discoverSheets: false };

test('CSV preserves BOM, Unicode, quoted commas/newlines, escaped quotes, and empty cells', () => {
    assert.deepEqual(parseCSV('\uFEFFid,text,last\r\none,"A, B\n""quoted"" \u03c3",\r\n'),
        [['id', 'text', 'last'], ['one', 'A, B\n"quoted" \u03c3', '']]);
});

test('CSV rejects malformed quotes and unclosed fields', () => {
    for (const csv of ['a,"unclosed', '"closed"x,a', 'a,b"c']) assert.throws(() => parseCSV(csv));
});

const toolHeaders = 'id,enabled,sort_order,title,url,description,tags\n';
test('add, update, hide, reorder, and delete rows without a content build', () => {
    let csv = toolHeaders + 'old,TRUE,2,Old,https://example.com,Before,"AI\nRAG"\n';
    csv += 'new,TRUE,1,New,https://example.org,Added,code\nhidden,FALSE,,Draft,,,\n';
    let rows = readRows('Tools', csv);
    assert.deepEqual(rows.map(row => row.id), ['new', 'old']);
    assert.deepEqual(rows[1].tags, ['AI', 'RAG']);
    csv = csv.replace('Before', 'After').replace('new,TRUE', 'new,FALSE');
    rows = readRows('Tools', csv);
    assert.equal(rows.length, 1);
    assert.equal(rows[0].description, 'After');
    assert.deepEqual(readRows('Tools', toolHeaders), []);
});

test('empty lines are ignored and missing optional values remain empty', () => {
    const rows = readRows('Tools', toolHeaders + '\n,,,,,,\na,TRUE,1,A,https://example.com\n');
    assert.equal(rows.length, 1);
    assert.equal(rows[0].description, '');
    assert.deepEqual(rows[0].tags, []);
});

test('invalid schema, duplicate IDs, bad flags, missing destinations fail clearly', () => {
    for (const csv of [
        'title\nHello',
        'id,id\na,a',
        toolHeaders + 'a,TRUE,1,A,https://example.com\na,TRUE,2,B,https://example.org',
        toolHeaders + 'a,yes,1,A,https://example.com',
        toolHeaders + 'a,TRUE,0,A,https://example.com',
        toolHeaders + 'a,TRUE,1,A,',
        toolHeaders + 'a,TRUE,1,A,https://example.com,,,,extra'
    ]) assert.throws(() => readRows('Tools', csv));
});

test('header-only optional collections are valid and all portfolio arrays exist', () => {
    const result = toPortfolio({ Profile: [{ field: 'name', value: 'Example' }] });
    assert.equal(result.basics.name, 'Example');
    for (const key of ['work', 'education', 'projects', 'certificates', 'books', 'bookVersions', 'tools', 'stories']) {
        assert.deepEqual(result[key], []);
    }
});

test('profile keys and page/key pairs must be unique', () => {
    assert.throws(() => readRows('Profile', 'field,value\nname,One\nname,Two'));
    assert.throws(() => readRows('SiteContent', 'page,key,value\nindex.html,title,A\nindex.html,title,B'));
    assert.throws(() => toPortfolio({ Profile: [] }), /name is required/);
});

test('URLs reject script/data protocols and credentials, retain public file and mail links', () => {
    for (const url of ['javascript:alert(1)', 'data:text/html,test', 'file:///tmp/test', 'https://user:pass@example.org/']) {
        assert.throws(() => safeURL(url));
    }
    assert.throws(() => safeURL('mailto:test@example.org'));
    assert.equal(safeURL('mailto:test@example.org', true), 'mailto:test@example.org');
    assert.equal(safeURL('#'), '');
    assert.equal(safeURL('https://example.org/a b.pdf'), 'https://example.org/a%20b.pdf');
    assert.throws(() => readRows('Tools', toolHeaders + 'a,TRUE,1,A,javascript:alert(1)'));
    assert.throws(() => toPortfolio({ Profile: [{ field: 'name', value: 'Example' }, { field: 'photo_url', value: 'javascript:alert(1)' }] }));
});

test('untrusted display text is escaped, not stripped or executed', () => {
    assert.equal(escapeHTML('<img onerror="x">&\''), '&lt;img onerror=&quot;x&quot;&gt;&amp;&#39;');
    assert.equal(escapeHTML(undefined), '');
});

test('project dates and featured flags are validated', () => {
    const headers = 'id,enabled,sort_order,name,description,startDate,endDate,featured\n';
    assert.equal(readRows('Projects', headers + 'a,TRUE,1,A,D,2026-01,Present,TRUE')[0].featured, true);
    assert.throws(() => readRows('Projects', headers + 'a,TRUE,1,A,D,2026-13,Present,TRUE'), /startDate/);
    assert.throws(() => readRows('Projects', headers + 'a,TRUE,1,A,D,2026-01,Present,yes'), /featured/);
});

test('books preserve coming-soon, direct destinations, and linked editions', () => {
    const books = readRows('Books', 'id,enabled,sort_order,title,status,url\neta,TRUE,1,ETA,versions,\nlater,TRUE,2,Later,coming_soon,');
    const editions = readRows('BookVersions', 'id,enabled,sort_order,book_id,label,url\neng,TRUE,1,eta,English,https://example.com/english.pdf');
    const result = toPortfolio({ Books: books, BookVersions: editions });
    assert.equal(result.bookVersions[0].book_id, result.books[0].id);
    assert.throws(() => toPortfolio({ Books: books, BookVersions: [] }), /no enabled BookVersions/);
    assert.throws(() => readRows('Books', 'id,enabled,sort_order,title,status,url\na,TRUE,1,A,available,'), /require url/);
});

test('loader uses the configured public tab endpoint and no browser cache', async () => {
    const requests = [];
    const result = await loadAll(config, async (url, options) => {
        requests.push({ url, options });
        return { ok: true, text: async () => 'field,value\nname,Published Name' };
    }, ['Profile']);
    assert.equal(result.basics.name, 'Published Name');
    assert.equal(requests[0].url, `${config.publicationUrl.replace(/\/pubhtml$/, '/pub')}?output=csv&gid=${config.sheets.Profile}`);
    assert.equal(requests[0].options.cache, 'no-store');
    assert.ok(requests[0].options.signal);
});

test('published page and export URLs both load CSV; unrelated URLs are rejected', async () => {
    const base = config.publicationUrl.replace(/\/pubhtml$/, '/pub');
    for (const publicationUrl of [base, `${base}html`]) {
        const result = await loadAll({ ...config, publicationUrl }, async url => {
            assert.equal(url, `${base}?output=csv&gid=${config.sheets.Profile}`);
            return { ok: true, text: async () => 'field,value\nname,Published Name' };
        }, ['Profile']);
        assert.equal(result.basics.name, 'Published Name');
    }
    for (const publicationUrl of ['https://example.org/pubhtml', `${base}html/extra`]) {
        await assert.rejects(loadAll({ ...config, publicationUrl }, async () => {
            assert.fail('Invalid publication must not be fetched');
        }, ['Profile']), /Invalid Google Sheets publication URL/);
    }
});

test('HTTP errors, login HTML, and request failures never become empty success', async () => {
    await assert.rejects(loadAll(config, async () => ({ ok: false, status: 403 }), ['Profile']), /Profile.*403/);
    await assert.rejects(loadAll(config, async () => ({ ok: true, text: async () => '<html>Sign in</html>' }), ['Profile']), /Profile.*column/);
    await assert.rejects(loadAll(config, async () => { throw new Error('Network blocked'); }, ['Profile']), /Profile.*Network blocked/);
    await assert.rejects(loadAll({ ...config, sheets: {} }, async () => {}, ['Profile']), /Missing published tab/);
});

test('new education rows load while optional degree and card details are still blank', () => {
    const rows = readRows('Education', 'id,enabled,sort_order,institution,studyType,area\nGIOE,TRUE,3,Govt Institute of Electronics,,');
    assert.equal(rows.length, 1);
    assert.equal(rows[0].studyType, '');
    assert.equal(rows[0].institution, 'Govt Institute of Electronics');
});

test('browser mode reports incomplete and unsafe rows without hiding valid records', async () => {
    const csv = toolHeaders + 'valid,TRUE,1,Visible,https://example.org,OK,code\n'
        + 'draft,TRUE,2,Draft,,,code\nunsafe,TRUE,3,Unsafe,javascript:alert(1),,code\n';
    const fetchImpl = async () => ({ ok: true, text: async () => csv });
    const data = await loadAll(config, fetchImpl, ['Tools'], { tolerateInvalidRows: true });
    assert.deepEqual(data.tools.map(row => row.id), ['valid']);
    assert.equal(data.contentIssues.length, 2);
    assert.match(data.contentIssues[0], /Tools row 3.*draft.*url is required/);
    assert.match(data.contentIssues[1], /Tools row 4.*unsafe.*Unsupported public URL/);
    await assert.rejects(loadAll(config, fetchImpl, ['Tools']), /url is required/);
});

test('browser mode still rejects broken headers and profile identity', async () => {
    await assert.rejects(loadAll(config, async () => ({ ok: true, text: async () => 'title\nBad header' }),
        ['Tools'], { tolerateInvalidRows: true }), /missing column/);
    await assert.rejects(loadAll(config, async () => ({ ok: true, text: async () => 'field,value\nname,' }),
        ['Profile'], { tolerateInvalidRows: true }), /name is required/);
});

test('edition drafts are reported in browser mode and rejected by strict builds', () => {
    const tabs = {
        Books: [{ id: 'draft', status: 'versions' }, { id: 'ready', status: 'available' }],
        BookVersions: []
    };
    const issues = [];
    const result = toPortfolio(tabs, issue => issues.push(issue));
    assert.deepEqual(result.books.map(book => book.id), ['ready']);
    assert.match(issues[0], /Books\/draft/);
    assert.throws(() => toPortfolio(tabs), /no enabled BookVersions/);
});

test('transient publication failures retry and return the latest response', async () => {
    let attempts = 0;
    const result = await loadAll(config, async () => {
        attempts++;
        if (attempts === 1) return { ok: false, status: 503 };
        if (attempts === 2) throw new TypeError('Failed to fetch');
        return { ok: true, text: async () => 'field,value\nname,Updated Name' };
    }, ['Profile']);
    assert.equal(attempts, 3);
    assert.equal(result.basics.name, 'Updated Name');
});

test('persistent network errors stop after three attempts; invalid data is not retried', async () => {
    let attempts = 0;
    await assert.rejects(loadAll(config, async () => {
        attempts++;
        return { ok: false, status: 429 };
    }, ['Profile']), /Profile.*429/);
    assert.equal(attempts, 3);
    attempts = 0;
    await assert.rejects(loadAll(config, async () => {
        attempts++;
        return { ok: true, text: async () => '<html>not CSV</html>' };
    }, ['Profile']), /missing column/);
    assert.equal(attempts, 1);
});

test('Drive image previews become image requests, including resource keys', () => {
    const expected = 'https://drive.google.com/thumbnail?id=example_ID-1&sz=w1600';
    for (const url of ['https://drive.google.com/file/d/example_ID-1/view?usp=sharing',
        'https://drive.google.com/open?id=example_ID-1', 'https://drive.google.com/uc?export=view&id=example_ID-1',
        'https://drive.google.com/thumbnail?id=example_ID-1&sz=w200']) {
        assert.equal(imageURL(url), expected);
    }
    assert.equal(imageURL('https://drive.google.com/file/d/example_ID-1/view?resourcekey=key_1'), `${expected}&resourcekey=key_1`);
    assert.equal(imageURL('https://example.com/photo.jpg'), 'https://example.com/photo.jpg');
    assert.equal(imageURL(''), '');
    assert.throws(() => imageURL('https://drive.google.com/drive/folders/folder'), /not a folder/);
    assert.throws(() => imageURL('javascript:alert(1)'), /Unsupported/);
    assert.equal(imageURL('https://drive.google.com.evil.example/file/d/id/view'), 'https://drive.google.com.evil.example/file/d/id/view');
});

test('normalization covers profile, book covers, and project images but leaves PDF view links intact', () => {
    const drive = 'https://drive.google.com/file/d/photo_id/view';
    const photo = toPortfolio({ Profile: [{ field: 'name', value: 'Name' }, { field: 'photo_url', value: drive }] });
    assert.equal(photo.basics.photo_url, imageURL(drive));
    const project = readRows('Projects', `id,enabled,sort_order,name,description,image\np,TRUE,1,P,D,${drive}`)[0];
    assert.equal(project.image, imageURL(drive));
    const book = readRows('Books', `id,enabled,sort_order,title,status,url,cover_url\nb,TRUE,1,B,available,https://drive.google.com/file/d/pdf_id/view,${drive}`)[0];
    assert.equal(book.cover_url, imageURL(drive));
    assert.equal(book.url, 'https://drive.google.com/file/d/pdf_id/view');
});

test('published tab discovery resolves changed IDs after workbook replacement', async () => {
    const html = '<script>items.push({name: "Profile", pageUrl: "https://example.com/?gid=22", gid: "22",initialSheet: false});'
        + 'items.push({name: "BookVersions", pageUrl: "", gid: "33"});</script>';
    assert.equal(publishedSheetIDs(html).BookVersions, '33');
    const requests = [];
    const result = await loadAll({ ...config, discoverSheets: true }, async url => {
        requests.push(url);
        return { ok: true, text: async () => url.endsWith('/pubhtml') ? html : 'field,value\nname,Latest import' };
    }, ['Profile']);
    assert.equal(result.basics.name, 'Latest import');
    assert.ok(requests[1].endsWith('output=csv&gid=22'));
    assert.throws(() => publishedSheetIDs('<html>Sign in</html>'), /Cannot discover/);
    assert.throws(() => publishedSheetIDs(html + html), /Duplicate published tab/);
    await assert.rejects(loadAll({ ...config, discoverSheets: true }, async () => ({
        ok: true, text: async () => html
    }), ['Education']), /Missing published tab Education/);
});
