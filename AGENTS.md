# Repository Guidelines

## Architecture

- This is a static portfolio built with HTML, CSS, and vanilla JavaScript. There is no Node package build step.
- See [README.md](README.md) for local development, content workflows, and the main file map.
- The entry point is [index.html](index.html); secondary pages live in [pages/](pages/).
- Shared styling lives in [css/styles.css](css/styles.css) and [css/celestial.css](css/celestial.css). Preserve their load order and reuse the existing Celestial Material components.

## Content and UI Conventions

- Treat [js/data.json](js/data.json) as the source of truth for professional content and generated resume variants. Follow the README's education and resume synchronization rules when editing it.
- Tool listings are static cards in [pages/tools.html](pages/tools.html). Match existing card markup, responsive grid classes, status badges, and tag styles. Link to the exact requested destination and describe only verified capabilities.
- External links opening a new tab must use `rel="noopener noreferrer"`. Keep decorative icons hidden from assistive technology.
- Preserve keyboard navigation, skip links, reduced-motion behavior, canonical URLs, relative asset paths, and dynamic copyright years.
- Prefer existing JavaScript helpers and CSS classes over new dependencies or duplicate implementations.

## Validation

- Serve the repository root with `python -m http.server 8000` and open `http://127.0.0.1:8000`. Check changed pages at desktop and mobile widths.
- Run `python scripts/validate_portfolio.py` for HTML references, metadata, content consistency, JavaScript syntax, and existing resume PDFs. Python dependencies are listed in [requirements.txt](requirements.txt); Node.js is required for JavaScript syntax checks.
- After professional-content or resume-generation changes, run `python build_resume.py` before validation. Do not regenerate PDFs for unrelated UI-only changes.
- Set `CHECK_EXTERNAL_LINKS=1` in the environment to include external-link checks.
- The [deployment workflow](.github/workflows/deploy.yml) generates resumes, validates with external-link checks, and deploys GitHub Pages on pushes to `main`.

## Change Scope

- Keep changes focused and preserve unrelated worktree changes.
- Do not add credentials, private application-tracking data, or other sensitive information to this public site.
- Commit and push only when requested. A push to `main` triggers production deployment.
