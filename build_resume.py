"""Generate 1-, 2-, and 3-page resume PDFs for Rajesh Kodaganti from portfolio data."""
import json
import os
import shutil

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

with open(os.path.join(ROOT, "js", "data.json"), "r", encoding="utf-8") as f:
    data = json.load(f)

basics = data["basics"]

SUMMARY_FULL = (
    "AI Software Engineer specializing in applied AI, data engineering, and cloud-native "
    "solutions on Microsoft Azure. Experienced in building LLM-powered automation, document "
    "intelligence pipelines, and secure DevOps workflows. Microsoft-certified across Azure AI, "
    "Data, and DevOps, with a track record of turning complex systems into reliable, "
    "production-ready products."
)
SUMMARY_SHORT = (
    "AI Software Engineer specializing in applied AI, data engineering, and cloud-native "
    "Azure solutions. Microsoft-certified across Azure AI, Data, and DevOps, with a focus on "
    "LLM-powered automation and document intelligence."
)

EXPERIENCE = [
    {
        "company": "Microsoft",
        "role": "AI Software Engineer (Contract)",
        "loc": "Redmond, WA",
        "dates": "Mar 2026 – Present",
        "points": [
            "Architecting and developing AI software solutions across Microsoft engineering workflows.",
            "Building and integrating LLM-powered features and automation into production systems.",
        ],
    },
    {
        "company": "Quadrant Technologies",
        "role": "AI Software Engineer (Full-time)",
        "loc": "Redmond, WA",
        "dates": "Aug 2025 – Present",
        "points": [
            "Designed and implemented ETL processes for security logs and vulnerability reports.",
            "Leveraged machine learning to analyze threat intelligence data and inform mitigation strategies.",
            "Developed data ingestion systems for endpoint and network security telemetry.",
            "Created monitoring dashboards for cloud security and compliance posture.",
            "Promoted from Software Intern (Jul 2025 – Aug 2025) after a successful internship.",
        ],
    },
    {
        "company": "QikCell by tickioT",
        "role": "Solutions Engineer Intern",
        "loc": "Los Angeles, CA",
        "dates": "Jan 2025 – May 2025",
        "points": [
            "Collaborated with sales and technical teams to align customer needs with product capabilities.",
            "Developed and customized technical demonstrations to showcase product features.",
            "Assisted in troubleshooting and documenting solutions, reducing response times by 20%.",
        ],
    },
    {
        "company": "ColorOS (OPPO)",
        "role": "User Test Specialist (Freelance)",
        "loc": "Remote",
        "dates": "Jun 2018 – Jul 2022",
        "points": [
            "Conducted user testing for ColorOS Beta and Alpha versions (5.0 to 12.1).",
            "Identified bugs and suggested new features based on user feedback.",
            "Collaborated with cross-functional teams to improve software performance.",
        ],
    },
    {
        "company": "Pantech ProEd Pvt Ltd",
        "role": "Student Intern",
        "loc": "Hyderabad, India",
        "dates": "Jun 2020 – Jul 2020",
        "points": [
            "Contributed to the development of a high-speed 64-bit binary comparator.",
            "Optimized design parameters in collaboration with the engineering team.",
        ],
    },
    {
        "company": "PeopleLink Unified Communications",
        "role": "Product Tester, R&D",
        "loc": "Hyderabad, India",
        "dates": "Jun 2018 – May 2019",
        "points": [
            "Evaluated prototypes to ensure functionality and quality before release.",
            "Contributed to the market release of products, reducing post-launch defects by 20%.",
        ],
    },
]


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
    bullet_lead = {"tight": 11.0, "normal": 11.8, "loose": 12.8}[density]
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


def build(cfg):
    out = os.path.join(ROOT, cfg["out"])
    s = make_styles(cfg["density"])
    story = []

    def section(title):
        story.append(Paragraph(title.upper(), s["section"]))
        story.append(HRFlowable(width="100%", thickness=0.9, color=ACCENT,
                                spaceBefore=1, spaceAfter=4))

    def bullets(items, limit=None):
        items = items[:limit] if limit else items
        for it in items:
            story.append(Paragraph(it, s["bullet"], bulletText="\u2022"))

    def two_col_header(left_html, right_html):
        t = Table([[Paragraph(left_html, s["role"]),
                    Paragraph(right_html, s["roleRight"])]],
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
    story.append(Paragraph(basics["name"], s["name"]))
    story.append(Paragraph("AI Software Engineer", s["subtitle"]))
    loc = basics.get("location", {})
    loc_str = ", ".join(x for x in [loc.get("city"), loc.get("region")] if x)
    email = basics["email"]
    contact = (
        f'{loc_str} &nbsp;&bull;&nbsp; '
        f'<a href="mailto:{email}" color="#0F6E4F">{email}</a> &nbsp;&bull;&nbsp; '
        f'<a href="https://www.linkedin.com/in/rajesh-kodaganti-323118215/" color="#0F6E4F">LinkedIn</a> &nbsp;&bull;&nbsp; '
        f'<a href="https://github.com/Unigalactix" color="#0F6E4F">GitHub</a> &nbsp;&bull;&nbsp; '
        f'<a href="https://learn.microsoft.com/en-us/users/rajeshkodaganti/" color="#0F6E4F">Microsoft Learn</a>'
    )
    story.append(Paragraph(contact, s["contact"]))
    story.append(Spacer(1, 4))
    story.append(HRFlowable(width="100%", thickness=1.4, color=ACCENT, spaceAfter=2))

    # summary
    section("Summary")
    story.append(Paragraph(SUMMARY_SHORT if cfg["summary"] == "short" else SUMMARY_FULL, s["summary"]))

    # skills
    section("Technical Skills")
    for cat in data["skills"]:
        story.append(Paragraph(f'<b>{cat["name"]}:</b> {", ".join(cat["keywords"])}', s["skill"]))

    # experience
    section("Experience")
    exp = EXPERIENCE[:cfg["exp"]] if cfg["exp"] else EXPERIENCE
    gap = {"tight": 2, "normal": 3, "loose": 5}[cfg["density"]]
    for i, e in enumerate(exp):
        two_col_header(e["company"], e["dates"])
        story.append(Paragraph(f'{e["role"]} &nbsp;|&nbsp; {e["loc"]}', s["sub"]))
        bullets(e["points"], limit=cfg["exp_bullets"])
        if i != len(exp) - 1:
            story.append(Spacer(1, gap))

    # education
    section("Education")
    for ed in data["education"]:
        sy = ed.get("startDate", "").replace("-", "/")
        ey = ed.get("endDate", "").replace("-", "/")
        two_col_header(ed["institution"], f'{sy} – {ey}')
        deg = f'{ed.get("studyType", "")}, {ed.get("area", "")}'
        if ed.get("score"):
            deg += f' &nbsp;|&nbsp; GPA: {ed["score"]}'
        story.append(Paragraph(deg, s["sub"]))
        story.append(Spacer(1, 3))

    # projects
    section("Projects" if cfg["proj"] is None else "Selected Projects")
    projects = data["projects"][:cfg["proj"]] if cfg["proj"] else data["projects"]
    pgap = {"tight": 2, "normal": 2.5, "loose": 4}[cfg["density"]]
    for p in projects:
        name = clean(p["name"])
        tech = ", ".join(p.get("keywords", []))
        link = p.get("url") or p.get("github") or ""
        link_html = f' &nbsp;|&nbsp; <a href="{link}" color="#0F6E4F">link</a>' if link and link != "#" else ""
        story.append(Paragraph(f'{name}{link_html}', s["proj"]))
        if tech:
            story.append(Paragraph(tech, s["projMeta"]))
        if cfg["proj_desc"]:
            story.append(Paragraph(p["description"], s["bullet"]))
        if cfg["proj_bullets"]:
            bullets(p.get("highlights", []), limit=cfg["proj_bullets"])
        story.append(Spacer(1, pgap))

    # certifications
    certs = data["certificates"]
    if cfg["certs"] == "select":
        section("Selected Certifications")
        picked = [c for c in certs if "Microsoft Certified:" in c["name"]]
        extra_names = ["Career Essentials in GitHub Copilot", "Docker Foundations",
                       "Azure AI Essentials", "Fabric Data Engineer"]
        for c in certs:
            if any(x in c["name"] for x in extra_names) and c not in picked:
                picked.append(c)
        names = [short_cert(c["name"]) for c in picked]
        story.append(Paragraph(" &nbsp;&bull;&nbsp; ".join(names), s["certInline"]))
    else:
        section("Certifications")
        cells = [Paragraph(
            f'\u2022 {short_cert(c["name"])} <font color="#55606e">— {c["issuer"]}, {c["date"]}</font>',
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
        title="Rajesh Kodaganti — Resume", author="Rajesh Kodaganti",
    )
    doc.build(story)
    print("Wrote", cfg["out"])


VARIANTS = [
    dict(out="resume-1page.pdf", density="tight", summary="short",
         exp=3, exp_bullets=2, proj=4, proj_desc=True, proj_bullets=0, certs="select"),
    dict(out="resume-2page.pdf", density="normal", summary="full",
         exp=None, exp_bullets=None, proj=None, proj_desc=True, proj_bullets=1, certs="all"),
    dict(out="resume-3page.pdf", density="loose", summary="full",
         exp=None, exp_bullets=None, proj=None, proj_desc=True, proj_bullets=3, certs="all"),
]

for cfg in VARIANTS:
    build(cfg)

# keep resume.pdf as the default (2-page) for backward compatibility
shutil.copyfile(os.path.join(ROOT, "resume-2page.pdf"), os.path.join(ROOT, "resume.pdf"))
print("Copied resume-2page.pdf -> resume.pdf")
