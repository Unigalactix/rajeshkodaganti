# Rajesh Kodaganti - Portfolio

Live Portfolio: [https://rajeshkodaganti.com/](https://rajeshkodaganti.com/)

This repository contains Rajesh Kodaganti's Software Development Engineer portfolio, with production-focused case studies, accessible interactions, and data-driven content rendering.

## Highlights

- Celestial Material theme: midnight blue, lavender light, warm metallic accents, and layered material cards.
- Full-size profile picture framed by CSS orbital rings and a lightweight constellation canvas, without external artwork or WebGL.
- Sticky observatory navigation with active section tracking and keyboard-accessible mobile navigation.
- Command Palette (Cmd/Ctrl + K) for quick navigation.
- Dynamic About, Skills, Experience, Projects, Certifications, modals, and resume content sourced from `js/data.json`.
- Mission-style project cards and chronological experience chapters with status chips.
- Animated architecture/system-map section and verified project milestone timeline.
- Static engineering-highlight strip generated from live project/work data.
- Interactive detail modals for Experience, Education, and Projects.
- Professional portfolio assistant and an on-demand Creative Lab.
- Responsive layout with mobile-first polish and reduced-motion support.

## Core UI Features

### 1. Celestial Observatory
- Immediate, non-blocking hero with a prominent 400px desktop profile picture, orbital rings, and explorer card (320px tablet and 250px mobile).
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
- Projects and certifications render from JSON.
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

`js/data.json` is the source of truth for the site's profile, experience, education, skills, projects, certifications, and generated resume variants. Professional content was reconciled with the supplied master resume and LinkedIn experience on September 28, 2026.

The education section lists four institutions, with the two most recent visible initially and the remaining two available through Show More. Keep its cards in `index.html` aligned with the education records in `js/data.json`; cards and detail dialogs omit grades and education-specific skills. Keep education records newest first: generated resumes include only the first two to preserve their page limits.

[`resumes/Resume - Rajesh Kodaganti (Master).pdf`](<resumes/Resume - Rajesh Kodaganti (Master).pdf>) is the supplied two-page master resume. The build copies it unchanged to `resumes/resume.pdf`, used by the recommended download, command palette, and portfolio assistant. Keep this source PDF in the repository so deployment does not replace the master with a generated variant. The one-, two-, and three-page generated alternatives remain available separately.

After changing professional content, regenerate and validate the site:

```bash
python -m pip install -r requirements.txt
python build_resume.py
python scripts/validate_portfolio.py
```

Set `CHECK_EXTERNAL_LINKS=1` to include concurrent external-link checks. GitHub Actions runs the full workflow before deployment.

## Main Files

- `index.html`: Page structure and global UI shell.
- `pages/`: Secondary HTML pages for books, tools, and IF-ELSE.
- `resumes/`: Source, default, and generated resume PDFs.
- `css/styles.css`: Full visual system, responsive styling, states, motion.
- `css/celestial.css`: Shared Celestial Material visual layer and responsive layouts. Loaded after the base and game styles.
- `js/scripts.js`: Navigation telemetry, command palette, splash logic, interactive effects.
- `js/content-loader.js`: Data-driven section rendering.
- `js/data.json`: Content source for profile, projects, and certifications.
- `build_resume.py`: Generates the one-, two-, and three-page PDF resumes from `js/data.json` and copies the supplied master to `resumes/resume.pdf`.
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
