# Rajesh Kodaganti - Portfolio

Live Portfolio: [https://rajeshkodaganti.com/](https://rajeshkodaganti.com/)

This repository contains Rajesh Kodaganti's Software Development Engineer portfolio, with production-focused case studies, accessible interactions, and data-driven content rendering.

## Highlights

- Celestial Material theme: midnight blue, lavender light, warm metallic accents, and layered material cards.
- Full-size profile picture framed by CSS orbital rings and a lightweight constellation canvas, without external artwork or WebGL.
- Sticky observatory navigation with active section tracking and keyboard-accessible mobile navigation.
- Command Palette (Cmd/Ctrl + K) for quick navigation.
- Profile, page copy, About, Skills, Experience, Education, Projects, Certifications,
  Books, Tools, IF-ELSE, modals, and assistant content sourced from published Google Sheets.
- Mission-style project cards and chronological experience chapters with status chips.
- Animated architecture/system-map section and verified project milestone timeline.
- Engineering-highlight strip generated from published project/work data.
- Interactive detail modals for Experience, Education, and Projects.
- Professional portfolio assistant and an on-demand Creative Lab.
- Responsive layout with mobile-first polish and reduced-motion support.

## Core UI Features

### 1. Celestial Observatory
- Non-blocking hero shell with a visible loading/error status while Sheets supplies
  its text and 400px desktop profile picture (320px tablet and 250px mobile).
- Books, Tools, IF-ELSE, and the 404 page share the same theme.
- Dedicated creative-realm navigation and an optional ship's console in the playground.

### 2. Celestial Material Visual System
- Semantic tokens for surfaces, text, accents, borders, and statuses.
- Soft material surfaces, rounded controls, diffuse shadows, and metallic rims.
- Cinzel display typography paired with Inter and Space Grotesk for readable content.
- Subtle starfield, constellation details, and reduced-motion support.

### 3. Command Palette
- Shortcut: Cmd/Ctrl + K.
- Search commands.
- Keyboard navigation (Arrow Up/Down + Enter).
- Quick actions to jump to sections and open the resume, Books, Tools, or IF-ELSE.
- An Explore button provides a visible alternative to the keyboard shortcut.

### 4. Data-Driven Rendering
- About section auto-generates summary/focus from profile + skills data.
- Content renders from the published spreadsheet's CSV tabs.
- Engineering highlights and activity widgets derive values from the same data source.

## Sections

1. Celestial Hero + Explorer Card
2. Engineering Highlights
3. About
4. Coding Interests
5. System Map
6. Experience
7. Education
8. Selected Engineering Case Studies
9. Certifications
10. Creative Realms (Books / Tools / IF-ELSE)
11. Playground + Optional Ship's Console
12. Verified Project Activity
13. Contact
14. Footer + Socials

## Tech Stack

- HTML5
- CSS3 (custom design system + responsive layers)
- JavaScript (Vanilla JS)
- Bootstrap grid
- Font Awesome
- Canvas API
- Intersection Observer API
- Formspree (contact form)

## Local Development

1. Clone repository.
2. Start local server:

```bash
python3 -m http.server 8000
```

3. Open:

- `http://127.0.0.1:8000`

### Content and resume workflow

The [published Google Sheet](https://docs.google.com/spreadsheets/d/e/2PACX-1vQ8EoTVMcbyzM4DtYcdgSZNU1pxetnPc8RelCyHuVLPRdxo49P6F4_Hr4LQcmk2QjsuUn1eb35lYkyM/pubhtml)
is the source of truth. The old local content JSON and profile configuration have been
removed. Only the public publication URL and tab-discovery configuration live in
[`js/sheets-config.json`](js/sheets-config.json); these are public identifiers, not credentials.
The configured `/pubhtml` link is the published browser page; the shared loader derives
its `/pub?output=csv&gid=...` endpoints to read each tab in both the website and build.
With `discoverSheets=true`, current tab IDs are resolved from the public page by name
on every load. The configured ID map is used only when discovery is explicitly disabled;
discovery failures do not silently fall back to potentially stale tab IDs.

[`Resume - Rajesh Kodaganti (Master).pdf`](<Resume - Rajesh Kodaganti (Master).pdf>) is the supplied two-page master resume. The build copies it unchanged to `resume.pdf`, used by the recommended download, command palette, and portfolio assistant. Keep this source PDF in the repository so deployment does not replace the master with a generated variant. The one-, two-, and three-page generated alternatives remain available separately.

Ordinary sheet edits do **not** need a site rebuild. Refresh the website after Google
republishes the changes. To regenerate PDF resume alternatives and validate a deployment,
use Node.js 22+ and Python with the existing requirements:

```bash
python -m pip install -r requirements.txt
node scripts/export-sheet-data.js --output .sheet-build/data.json
python build_resume.py --data .sheet-build/data.json
python scripts/validate_portfolio.py --data .sheet-build/data.json
node --test scripts/sheet-source.test.js
```

The snapshot file must not already exist: use a fresh path for a subsequent export.
Remove the temporary `.sheet-build` directory before publishing the site. GitHub Actions
fetches one snapshot for resume generation and validation, runs tests, and removes it
before uploading the deployment. It does not ship a stale content fallback.

Set `CHECK_EXTERNAL_LINKS=1` to include concurrent external-link checks.

### Editing the Google Sheet

The uploaded workbook is now connected. Edit the converted Google Sheets document in
your account, not the original Excel file. Its 15 data tabs are:

| Tab | Website content |
| --- | --- |
| Profile | Identity, biography, email/phone, contact form destination, photo URL |
| SocialLinks | Social icons and profile links |
| WorkExperience | Work cards and their detail dialogs |
| Education | Education cards and detail dialogs |
| Skills | Skill categories and chips |
| Projects | Project cards, full case studies, metrics, milestones, assistant |
| Certificates | Credentials and verification links |
| Books | Books, collections, covers, availability |
| BookVersions | Edition links keyed by `book_id` |
| Tools | Tool cards, descriptions, tags, links, status |
| IF_ELSE | Story/epic/concept cards |
| Interests | Engineering-interest cards |
| Sections | Existing home-page section headings, order, and visibility |
| SiteContent | Hero/subpage text, SEO metadata, footer, architecture labels |
| ResumeLinks | Download menu, command palette, and assistant resume links |

`StartHere` and `FieldGuide` are editing references, not website data. Their original
"integration pending" wording describes the initial export and is superseded by this
documentation; the website integration is now implemented in this repository.

- **Add:** add a row with a unique `id`, `enabled=TRUE`, a positive `sort_order`, and
  the relevant name/title and other required fields from `FieldGuide`.
- **Update:** edit cells; keep existing IDs, headers, tab names, and page/content keys.
- **Delete:** delete the row, or set `enabled=FALSE`. Keep the header row even when
  deleting every record. Remove a deleted book's related `BookVersions` rows too.
- **Order:** lower `sort_order` appears first. The first 3 projects/work roles and
  first 8 certificates show before expansion. This replaces the previous hardcoded
  certificate ranking so sheet ordering is authoritative.
- **Lists:** one item per line inside `keywords`, `technologies`, `tags`, `highlights`,
  `workflow`, `architecture`, or `deliverables`; no JSON required.
- **Dates:** use plain-text `YYYY-MM`; `endDate` may be `Present`. Certificate dates
  retain their plain-text month/year format.
- **Editions:** use `Books.status=versions` and matching `BookVersions.book_id`;
  at least one enabled edition is required. Use `coming_soon` for unreleased books.
- **Empty tabs:** optional collections may contain only headers. A missing tab, invalid
  header, or broken Profile/SiteContent key produces a visible loading error with its
  exact cause. An incomplete or invalid collection row (including an unsafe URL) is
  excluded with a visible tab/row warning; other valid records still load. Build
  exports remain strict and require those rows to be corrected or disabled.
- **Education:** `institution` is required; degree type, subject, dates, and short card
  text are optional. New education entries can appear before every detail is filled in.

Keep **File > Share > Publish to web > Entire document** published with automatic
republication enabled. Google may take several minutes to refresh published exports.
The browser reads only the tabs needed for its page, without a persistent content cache.
Use **Refresh content** to reload an already-open page after editing. The status area
shows row issues directly, so you do not need the developer console to find a typo.
Temporary network/timeout, HTTP 429, and server failures are retried up to twice before
showing the error and a Retry control. Refresh cannot bypass Google's publication delay.
Replacing tabs within the same published document is supported by automatic tab-name
discovery. Keep names unchanged and publish the entire document. A different document
or publication link requires updating the configured publication URL.

The website reads images, covers, and PDFs through public file URLs, not workbook attachments.
Current local asset links have been expanded to `https://rajeshkodaganti.com/...`.
Keep those assets hosted until replacements are available. Direct image URLs and
standard shared **Google Drive file links** are supported for photos, covers, and
project images. Drive links are converted to Google's thumbnail endpoint (including
resource keys when supplied); the file must be shared as **Anyone with the link / Viewer**.
Folder links are not image links. File access policies and Google quotas still apply.
The profile photo and first three covers load eagerly; image failures show an explicit
sharing/link warning rather than silently using an old image. Sheet changes alone
do not regenerate PDF resumes or add new page layouts/games. The original Excel export
has been moved out of the repository; it is no longer a second deployed content copy.

### Importing the media-friendly workbook

The new `Portfolio_Content_Media.xlsx` is an import artifact, not a website data source.
It preserves the latest downloaded sheet data and adds nine embedded **preview images**
to `Profile`, `Books`, and `Projects`, plus a `MediaGuide` tab. Preview columns are ignored
by the website. Floating Excel previews may move or be omitted during Google import;
they do not automatically update when URL cells change.

Back up the current Google Sheet, then use **File > Import > Upload > Replace spreadsheet**
in that same document. Replacement overwrites tabs, including any edits made since
the workbook was generated. Preserve the data tab names and headers, and confirm
**Publish to web > Entire document** and automatic republication afterward. Automatic
tab discovery handles new tab IDs once this version of the site is deployed. If the
published document link changes, update the website configuration with the new link.

For new media, upload the actual image or PDF to Google Drive, set **Anyone with the
link / Viewer**, and paste the ordinary Share link as plain text in the appropriate
URL cell. PDF links are kept as Drive viewer links, not converted to image thumbnails.
`Profile.photo_url`, `Books.cover_url`, and `Projects.image` accept shared image file links.
`Books.url`, `BookVersions.url`, and `ResumeLinks.url` accept shared PDF file links.

**Pasted cell pictures, file chips, and embedded Excel PDFs cannot replace URL cells.**
Published CSV contains text only. The workbook's pictures are previews, not upload
controls. A genuinely link-free file-upload workflow requires a separate authenticated
uploader/storage integration; this workbook does not provide that feature.

**Privacy:** everything published is public, including disabled records. Never put
secrets or private notes in any published tab. The site treats text as text and rejects
unsafe URL protocols; it does not execute sheet HTML or formulas.

**SEO:** titles, descriptions, social metadata and structured profile data are populated
client-side. Crawlers/link-preview bots that do not run JavaScript see the generic
HTML shell rather than current sheet metadata. JavaScript and Google's publication
service are required for content display; there is deliberately no hardcoded fallback.

## Main Files

- `index.html`: Page structure and global UI shell.
- `css/styles.css`: Full visual system, responsive styling, states, motion.
- `css/celestial.css`: Shared Celestial Material visual layer and responsive layouts. Loaded after the base and game styles.
- `js/scripts.js`: Navigation telemetry, command palette, splash logic, interactive effects.
- `js/sheets-config.json`: Public Google Sheets publication URL, automatic tab discovery, and optional fixed tab IDs.
- `js/sheet-source.js`: Shared CSV parsing, validation, normalization, and fetch logic.
- `js/site-content.js`: Shared profile, copy, education, bookshelf, tool and story rendering.
- `js/content-loader.js`: Home-page professional section rendering.
- `scripts/export-sheet-data.js`: Exports a fresh published snapshot for the build.
- `build_resume.py`: Generates the one-, two-, and three-page PDF resumes from the explicit sheet snapshot and copies the supplied master to `resume.pdf`.
- `scripts/validate_portfolio.py`: Validates content consistency, assets, metadata, JavaScript, accessibility basics, links, and generated PDFs.

## Accessibility and Performance Notes

- Honors `prefers-reduced-motion`.
- Coarse pointer and small-screen interaction optimizations.
- Deferred non-critical desktop effects.
- No blocking splash screen; games load on demand, and the starfield pauses when inactive.

### Testing the theme branch

The redesign is isolated on `theme/celestial-material`; it is not merged into `main`. Check out that branch and start the local server above to review all five pages. Automatic production deployment is triggered only by pushes to `main`; pushing the theme branch does not deploy the redesign.

Check desktop and mobile navigation, resume downloads, expandable content, detail dialogs, command-palette keyboard controls, the optional console, and the on-demand games. Reduced-motion mode preserves the static portrait and orbital illustration while disabling animated effects.

## Contact

- Email: rajeshkodaganti.work@gmail.com
- LinkedIn: [rajesh-kodaganti-323118215](https://www.linkedin.com/in/rajesh-kodaganti-323118215)

## License

Based on Dev Portfolio Template. Use according to the original template license terms.
