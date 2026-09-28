"""Validate portfolio content, assets, scripts, metadata, and generated resumes."""

import argparse
import os
import subprocess
import sys
from concurrent.futures import ThreadPoolExecutor, as_completed
from html.parser import HTMLParser
from pathlib import Path
from urllib.error import HTTPError, URLError
from urllib.parse import unquote, urlparse
from urllib.request import Request, urlopen

from pypdf import PdfReader


ROOT = Path(__file__).resolve().parents[1]
sys.path.insert(0, str(ROOT))
from scripts.sheet_snapshot import load_snapshot
from build_resume import VARIANTS, clean, format_date

HTML_FILES = sorted(ROOT.glob("*.html"))
errors = []
warnings = []
external_urls = set()


class PortfolioHTMLParser(HTMLParser):
    def __init__(self, path):
        super().__init__()
        self.path = path
        self.references = []
        self.canonical_count = 0
        self.has_footer = False

    def handle_starttag(self, tag, attrs):
        values = dict(attrs)
        unloaded_image = "hidden" in values and not values.get("src") and not values.get("srcset")
        if tag == "img" and not unloaded_image and not values.get("alt"):
            errors.append(f"{self.path.name}: image missing alt text: {values.get('src', '')}")
        if tag == "footer":
            self.has_footer = True
        if tag == "link" and values.get("rel") == "canonical":
            self.canonical_count += 1
        for attribute in ("href", "src"):
            value = values.get(attribute)
            is_preconnect = tag == "link" and values.get("rel") == "preconnect"
            if value and not is_preconnect:
                self.references.append(value)


def validate_reference(source, reference):
    if reference.startswith(("#", "mailto:", "tel:", "data:", "javascript:")):
        return
    if reference.startswith(("http://", "https://")):
        parsed = urlparse(reference)
        if parsed.hostname in ("rajeshkodaganti.com", "www.rajeshkodaganti.com"):
            clean = unquote(parsed.path).lstrip("/")
            target = ROOT / clean
            if target.is_dir():
                target = target / "index.html"
            if not target.is_file():
                errors.append(f"{source.name}: missing same-site reference: {reference}")
            return
        external_urls.add(reference)
        return

    clean = unquote(reference.split("?", 1)[0].split("#", 1)[0])
    if not clean:
        return
    target = ROOT / clean.lstrip("/") if clean.startswith("/") else source.parent / clean
    if not target.exists():
        errors.append(f"{source.name}: missing local reference: {reference}")


def validate_html():
    for path in HTML_FILES:
        text = path.read_text(encoding="utf-8")
        parser = PortfolioHTMLParser(path)
        parser.feed(text)
        for reference in parser.references:
            validate_reference(path, reference)

        if path.name != "404.html" and parser.canonical_count != 1:
            errors.append(f"{path.name}: expected exactly one canonical link")
        sources = [reference.split("?", 1)[0] for reference in parser.references]
        dynamic_footer = parser.has_footer and "js/site-content.js" in sources
        if path.name != "404.html" and "data-current-year" not in text and not dynamic_footer:
            errors.append(f"{path.name}: missing dynamic copyright year")
        if path.name != "404.html":
            if "js/sheet-source.js" not in sources:
                errors.append(f"{path.name}: missing Google Sheets runtime loader")


def validate_data(data, snapshot):
    basics = data["basics"]
    if basics.get("photo_url") and not basics.get("photo_alt"):
        errors.append("Profile photo is missing photo_alt")
    for collection in ("projects", "books", "bookVersions", "tools", "stories"):
        for item in data[collection]:
            if item.get("image") and not (item.get("imageAlt") or item.get("image_alt")):
                errors.append(f"{collection}: image missing alternative text: {item.get('id')}")
            for image_key, alt_key in (("cover_url", "cover_alt"), ("image_url", "image_alt")):
                if item.get(image_key) and not item.get(alt_key):
                    errors.append(f"{collection}: {image_key} missing {alt_key}: {item.get('id')}")

    def collect_urls(value, key=""):
        if isinstance(value, dict):
            for child_key, child in value.items():
                collect_urls(child, child_key)
        elif isinstance(value, list):
            for child in value:
                collect_urls(child, key)
        elif isinstance(value, str) and value:
            if value.startswith(("http://", "https://")):
                validate_reference(snapshot, value)
            elif key in ("image", "cover", "photo_url", "image_url", "cover_url"):
                validate_reference(ROOT / "index.html", value)

    collect_urls(data)


def validate_javascript():
    for path in sorted([*(ROOT / "js").glob("*.js"), *(ROOT / "scripts").glob("*.js")]):
        result = subprocess.run(
            ["node", "--check", str(path)], capture_output=True, text=True, timeout=60, check=False
        )
        if result.returncode:
            errors.append(f"{path.relative_to(ROOT)}: {result.stderr.strip()}")


def validate_resumes(data, resume_dir):
    master = ROOT / "Resume - Rajesh Kodaganti (Master).pdf"
    paths = {cfg["out"]: resume_dir / cfg["out"] for cfg in VARIANTS}
    paths.update({"resume.pdf": resume_dir / "resume.pdf", master.name: master})
    extracted = {}
    page_limits = {"resume-1page.pdf": 1, "resume-2page.pdf": 2, "resume-3page.pdf": 3}
    for name, path in paths.items():
        if not path.exists() or path.stat().st_size == 0:
            errors.append(f"{name}: missing or empty")
            continue
        try:
            reader = PdfReader(path)
            pages = [page.extract_text() or "" for page in reader.pages]
            if not pages or any(not page.strip() for page in pages):
                errors.append(f"{name}: contains no pages or an empty page")
            if name in page_limits and len(pages) > page_limits[name]:
                errors.append(f"{name}: exceeds its {page_limits[name]}-page budget ({len(pages)} pages)")
            extracted[name] = " ".join(" ".join(pages).split())
        except Exception as error:
            errors.append(f"{name}: unreadable PDF: {error}")

    for cfg in VARIANTS:
        name = cfg["out"]
        required = [data["basics"]["name"], data["basics"].get("label", "")]
        for job in data["work"][:cfg["exp"]]:
            required.extend(job.get(key, "") for key in ("name", "position"))
            required.extend(format_date(job.get(key, "")) for key in ("startDate", "endDate"))
        for project in data["projects"][:cfg["proj"]]:
            required.append(clean(project.get("name", "")))
        for value in required:
            if value and " ".join(value.split()) not in extracted.get(name, ""):
                errors.append(f"{name}: missing snapshot text: {value}")
    default_path = resume_dir / "resume.pdf"
    if master.exists() and default_path.exists() and default_path.read_bytes() != master.read_bytes():
        errors.append("resume.pdf: must exactly match the supplied master resume")


def check_external_url(url):
    request = Request(url, method="HEAD", headers={"User-Agent": "portfolio-validator/1.0"})
    try:
        with urlopen(request, timeout=8) as response:
            return url, response.status, None
    except HTTPError as error:
        if error.code in (400, 404, 405):
            try:
                fallback = Request(url, headers={"User-Agent": "portfolio-validator/1.0"})
                with urlopen(fallback, timeout=8) as response:
                    return url, response.status, None
            except HTTPError as fallback_error:
                return url, fallback_error.code, None
            except URLError as fallback_error:
                return url, None, str(fallback_error.reason)
        return url, error.code, None
    except URLError as error:
        return url, None, str(error.reason)


def validate_external_links():
    if os.getenv("CHECK_EXTERNAL_LINKS") != "1":
        return
    with ThreadPoolExecutor(max_workers=8) as executor:
        futures = [executor.submit(check_external_url, url) for url in sorted(external_urls)]
        for future in as_completed(futures):
            url, status, problem = future.result()
            if status in (404, 410):
                errors.append(f"External link returned {status}: {url}")
            elif problem:
                warnings.append(f"External link could not be reached: {url} ({problem})")


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--data", required=True, type=Path, help="Explicit Google Sheets JSON snapshot")
    parser.add_argument("--resume-dir", type=Path, default=ROOT, help="Directory containing generated PDFs")
    args = parser.parse_args()
    try:
        data = load_snapshot(args.data)
    except (OSError, ValueError) as error:
        parser.error(str(error))
    validate_html()
    validate_data(data, args.data)
    validate_javascript()
    validate_resumes(data, args.resume_dir)
    validate_external_links()

    for warning in warnings:
        print(f"WARNING: {warning}")
    if errors:
        for error in errors:
            print(f"ERROR: {error}", file=sys.stderr)
        raise SystemExit(1)
    print(f"Portfolio validation passed ({len(HTML_FILES)} HTML files, {len(external_urls)} external URLs).")


if __name__ == "__main__":
    main()