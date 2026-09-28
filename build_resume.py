"""Generate resume variants from portfolio data and publish the supplied master PDF."""
import argparse
import os
import shutil
from datetime import datetime
from urllib.parse import urlparse
from xml.sax.saxutils import escape, quoteattr

from scripts.sheet_snapshot import load_snapshot

from reportlab.lib.pagesizes import letter
from reportlab.lib.units import inch
from reportlab.lib.colors import HexColor
from reportlab.lib.enums import TA_RIGHT, TA_JUSTIFY
from reportlab.lib.styles import ParagraphStyle
from reportlab.platypus import (
    SimpleDocTemplate, Paragraph, Spacer, Table, TableStyle, HRFlowable,
)

ROOT = os.path.dirname(os.path.abspath(__file__))

ACCENT = HexColor("#0F6E4F")     # deep brand green (print friendly)
DARK = HexColor("#1d2530")       # near-black slate
MUTE = HexColor("#55606e")       # muted gray

def format_date(value):
    if not value or value.lower() == "present":
        return value or ""
    for pattern in ("%Y-%m", "%Y-%m-%d"):
        try:
            return datetime.strptime(value, pattern).strftime("%b %Y")
        except ValueError:
            pass
    return value


def text(value):
    return escape(str(value or ""))


def link_markup(label, url):
    if urlparse(url).scheme.lower() not in ("https", "http", "mailto", "tel"):
        return text(label)
    return f'<a href={quoteattr(url)} color="#0F6E4F">{text(label)}</a>'


def clean(name):
    out = "".join(ch for ch in name if ord(ch) < 0x2190).strip()
    return out.replace("[WIP]", "").strip()


def short_cert(name):
    name = name.replace(" by Microsoft and LinkedIn", "")
    name = name.replace("Microsoft Certified: ", "")
    return name.strip()


def make_styles(density):
    # density: "tight" (1pg), "normal" (2pg), "loose" (3pg)
    f = {"tight": -0.6, "normal": 0.0, "loose": 0.4}[density]
    section_before = {"tight": 4, "normal": 6, "loose": 9}[density]
    bullet_lead = {"tight": 11.0, "normal": 11.8, "loose": 12.0}[density]
    s = {}
    s["name"] = ParagraphStyle("name", fontName="Helvetica-Bold", fontSize=22 + f,
                               leading=25 + f, textColor=ACCENT, spaceAfter=2)
    s["subtitle"] = ParagraphStyle("subtitle", fontName="Helvetica", fontSize=11.5,
                                   leading=14, textColor=DARK, spaceAfter=4)
    s["contact"] = ParagraphStyle("contact", fontName="Helvetica", fontSize=8.8,
                                  leading=12, textColor=MUTE)
    s["section"] = ParagraphStyle("section", fontName="Helvetica-Bold", fontSize=11,
                                  leading=13, textColor=ACCENT, spaceBefore=section_before,
                                  spaceAfter=2)
    s["summary"] = ParagraphStyle("summary", fontName="Helvetica", fontSize=9.4 + f * 0.4,
                                  leading=13 + f * 0.4, textColor=DARK, alignment=TA_JUSTIFY)
    s["role"] = ParagraphStyle("role", fontName="Helvetica-Bold", fontSize=10,
                               leading=12.5, textColor=DARK)
    s["roleRight"] = ParagraphStyle("roleRight", fontName="Helvetica", fontSize=9,
                                    leading=12.5, textColor=MUTE, alignment=TA_RIGHT)
    s["sub"] = ParagraphStyle("sub", fontName="Helvetica-Oblique", fontSize=9,
                              leading=12, textColor=ACCENT, spaceAfter=1)
    s["bullet"] = ParagraphStyle("bullet", fontName="Helvetica", fontSize=9,
                                 leading=bullet_lead, textColor=DARK, leftIndent=12,
                                 bulletIndent=2, spaceAfter=0.5)
    s["proj"] = ParagraphStyle("proj", fontName="Helvetica-Bold", fontSize=9.8,
                               leading=12.5, textColor=DARK)
    s["projMeta"] = ParagraphStyle("projMeta", fontName="Helvetica-Oblique", fontSize=8.4,
                                   leading=11, textColor=MUTE, spaceAfter=1)
    s["skill"] = ParagraphStyle("skill", fontName="Helvetica", fontSize=9.3,
                                leading=13, textColor=DARK, spaceAfter=1)
    s["cert"] = ParagraphStyle("cert", fontName="Helvetica", fontSize=8.2,
                               leading=10.4, textColor=DARK)
    s["certInline"] = ParagraphStyle("certInline", fontName="Helvetica", fontSize=9,
                                      leading=13, textColor=DARK)
    return s


def build(cfg, data, output_dir=ROOT):
    out = os.path.join(output_dir, cfg["out"])
    basics = data["basics"]
    s = make_styles(cfg["density"])
    story = []

    def section(title):
        story.append(Paragraph(title.upper(), s["section"]))
        story.append(HRFlowable(width="100%", thickness=0.9, color=ACCENT,
                                spaceBefore=1, spaceAfter=4))

    def bullets(items, limit=None):
        items = items[:limit] if limit else items
        for it in items:
            story.append(Paragraph(escape(it), s["bullet"], bulletText="\u2022"))

    def two_col_header(left_html, right_html):
        t = Table([[Paragraph(text(left_html), s["role"]),
                    Paragraph(text(right_html), s["roleRight"])]],
                  colWidths=[4.55 * inch, 2.65 * inch])
        t.setStyle(TableStyle([
            ("LEFTPADDING", (0, 0), (-1, -1), 0),
            ("RIGHTPADDING", (0, 0), (-1, -1), 0),
            ("TOPPADDING", (0, 0), (-1, -1), 0),
            ("BOTTOMPADDING", (0, 0), (-1, -1), 0),
            ("VALIGN", (0, 0), (-1, -1), "BOTTOM"),
        ]))
        story.append(t)

    # header
    story.append(Paragraph(text(basics["name"]), s["name"]))
    if basics.get("label"):
        story.append(Paragraph(text(basics["label"]), s["subtitle"]))
    loc = basics.get("location", {})
    loc_str = ", ".join(x for x in [loc.get("city"), loc.get("region")] if x)
    contact = [text(value) for value in (loc_str, basics.get("phone")) if value]
    if basics.get("email"):
        contact.append(link_markup(basics["email"], f'mailto:{basics["email"]}'))
    for profile in basics.get("profiles", []):
        if profile.get("url"):
            contact.append(link_markup(profile.get("network") or profile.get("username") or "Profile", profile["url"]))
    if basics.get("website_url"):
        contact.append(link_markup("Website", basics["website_url"]))
    if contact:
        story.append(Paragraph(" &nbsp;&bull;&nbsp; ".join(contact), s["contact"]))
    story.append(Spacer(1, 4))
    story.append(HRFlowable(width="100%", thickness=1.4, color=ACCENT, spaceAfter=2))

    # summary
    summary = basics.get("summary", "")
    if cfg["summary"] != "short":
        summary = " ".join(value for value in (summary, basics.get("impact", "")) if value)
    if summary:
        section("Summary")
        story.append(Paragraph(text(summary), s["summary"]))

    # skills
    if data["skills"]:
        section("Technical Skills")
    for cat in data["skills"]:
        story.append(Paragraph(f'<b>{text(cat.get("name"))}:</b> {text(", ".join(cat.get("keywords", [])))}', s["skill"]))

    # experience
    if data["work"]:
        section("Experience")
    exp = data["work"][:cfg["exp"]]
    gap = {"tight": 2, "normal": 3, "loose": 5}[cfg["density"]]
    for i, e in enumerate(exp):
        dates = " – ".join(format_date(e.get(key, "")) for key in ("startDate", "endDate") if e.get(key))
        two_col_header(e.get("name", ""), dates)
        story.append(Paragraph(" &nbsp;|&nbsp; ".join(text(e[key]) for key in ("position", "location") if e.get(key)), s["sub"]))
        bullets(e.get("highlights", []), limit=cfg["exp_bullets"])
        if i != len(exp) - 1:
            story.append(Spacer(1, gap))

    # education
    if data["education"]:
        section("Education")
    for ed in data["education"]:
        sy = format_date(ed.get("startDate", ""))
        ey = format_date(ed.get("endDate", ""))
        two_col_header(ed.get("institution", ""), " – ".join(value for value in (sy, ey) if value))
        deg = ", ".join(text(ed[key]) for key in ("studyType", "area") if ed.get(key))
        if ed.get("score"):
            deg += f' &nbsp;|&nbsp; Score: {text(ed["score"])}'
        story.append(Paragraph(deg, s["sub"]))
        story.append(Spacer(1, 3))

    # projects
    if data["projects"]:
        section("Projects" if cfg["proj"] is None else "Selected Projects")
    projects = data["projects"][:cfg["proj"]] if cfg["proj"] else data["projects"]
    pgap = {"tight": 2, "normal": 2.5, "loose": 4}[cfg["density"]]
    for p in projects:
        name = text(clean(p.get("name", "")))
        tech = text(", ".join(p.get("keywords", []) or p.get("technologies", [])))
        link = p.get("url") or p.get("github") or ""
        link_html = f' &nbsp;|&nbsp; {link_markup("link", link)}' if link and link != "#" else ""
        story.append(Paragraph(f'{name}{link_html}', s["proj"]))
        if tech:
            story.append(Paragraph(tech, s["projMeta"]))
        if cfg["proj_desc"]:
            story.append(Paragraph(text(p.get("description")), s["bullet"]))
        if cfg["proj_bullets"]:
            bullets(p.get("highlights", []), limit=cfg["proj_bullets"])
        story.append(Spacer(1, pgap))

    # certifications
    certs = data["certificates"]
    if certs and cfg["certs"] == "select":
        section("Selected Certifications")
        picked = [c for c in certs if c.get("featured")] or certs
        names = [text(short_cert(c.get("name", ""))) for c in picked[:8]]
        story.append(Paragraph(" &nbsp;&bull;&nbsp; ".join(names), s["certInline"]))
    elif certs:
        section("Certifications")
        cells = [Paragraph(
            f'\u2022 {text(short_cert(c.get("name", "")))} <font color="#55606e">— {text(c.get("issuer"))}, {text(c.get("date"))}</font>',
            s["cert"]) for c in certs]
        half = (len(cells) + 1) // 2
        left, right = cells[:half], cells[half:]
        while len(right) < len(left):
            right.append(Paragraph("", s["cert"]))
        rows = [[l, r] for l, r in zip(left, right)]
        pad = {"normal": 0.6, "loose": 1.6}[cfg["density"]]
        ct = Table(rows, colWidths=[3.55 * inch, 3.55 * inch])
        ct.setStyle(TableStyle([
            ("LEFTPADDING", (0, 0), (-1, -1), 0),
            ("RIGHTPADDING", (0, 0), (-1, -1), 6),
            ("TOPPADDING", (0, 0), (-1, -1), pad),
            ("BOTTOMPADDING", (0, 0), (-1, -1), pad),
            ("VALIGN", (0, 0), (-1, -1), "TOP"),
        ]))
        story.append(ct)

    doc = SimpleDocTemplate(
        out, pagesize=letter,
        leftMargin=0.6 * inch, rightMargin=0.6 * inch,
        topMargin=0.5 * inch, bottomMargin=0.5 * inch,
        title=f'{basics["name"]} — Resume', author=basics["name"],
    )
    doc.build(story)
    print("Wrote", cfg["out"])


VARIANTS = [
    dict(out="resume-1page.pdf", density="tight", summary="short",
        exp=3, exp_bullets=1, proj=2, proj_desc=False, proj_bullets=0, certs="select"),
    dict(out="resume-2page.pdf", density="normal", summary="full",
        exp=None, exp_bullets=2, proj=5, proj_desc=True, proj_bullets=0, certs="select"),
    dict(out="resume-3page.pdf", density="loose", summary="full",
         exp=None, exp_bullets=None, proj=None, proj_desc=True, proj_bullets=3, certs="all"),
]

def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--data", required=True, help="Explicit Google Sheets JSON snapshot")
    parser.add_argument("--output-dir", default=ROOT, help="Directory for generated PDFs")
    args = parser.parse_args()
    data = load_snapshot(args.data)
    os.makedirs(args.output_dir, exist_ok=True)
    for cfg in VARIANTS:
        build(cfg, data, args.output_dir)
    # Preserve the supplied master, including its original formatting, as the default.
    shutil.copyfile(os.path.join(ROOT, "Resume - Rajesh Kodaganti (Master).pdf"),
                    os.path.join(args.output_dir, "resume.pdf"))
    print("Copied Resume - Rajesh Kodaganti (Master).pdf -> resume.pdf")


if __name__ == "__main__":
    main()
