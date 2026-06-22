"""Generate resume.pdf for Rajesh Kodaganti from portfolio data."""
import json
import os

from reportlab.lib.pagesizes import letter
from reportlab.lib.units import inch
from reportlab.lib.colors import HexColor
from reportlab.lib.enums import TA_LEFT, TA_RIGHT, TA_JUSTIFY
from reportlab.lib.styles import ParagraphStyle
from reportlab.platypus import (
    SimpleDocTemplate, Paragraph, Spacer, Table, TableStyle, HRFlowable, KeepTogether,
)

ROOT = os.path.dirname(os.path.abspath(__file__))
OUT = os.path.join(ROOT, "resume.pdf")

ACCENT = HexColor("#0F6E4F")     # deep brand green (print friendly)
DARK = HexColor("#1d2530")       # near-black slate
MUTE = HexColor("#55606e")       # muted gray
RULE = HexColor("#c9d2dc")       # light rule

with open(os.path.join(ROOT, "js", "data.json"), "r", encoding="utf-8") as f:
    data = json.load(f)

# ---------- styles ----------
styles = {}
styles["name"] = ParagraphStyle("name", fontName="Helvetica-Bold", fontSize=23,
                                 leading=26, textColor=ACCENT, spaceAfter=2)
styles["subtitle"] = ParagraphStyle("subtitle", fontName="Helvetica", fontSize=11.5,
                                     leading=14, textColor=DARK, spaceAfter=4)
styles["contact"] = ParagraphStyle("contact", fontName="Helvetica", fontSize=8.8,
                                    leading=12, textColor=MUTE)
styles["section"] = ParagraphStyle("section", fontName="Helvetica-Bold", fontSize=11,
                                    leading=13, textColor=ACCENT, spaceBefore=6,
                                    spaceAfter=2, tracking=0.5)
styles["summary"] = ParagraphStyle("summary", fontName="Helvetica", fontSize=9.4,
                                    leading=13, textColor=DARK, alignment=TA_JUSTIFY)
styles["role"] = ParagraphStyle("role", fontName="Helvetica-Bold", fontSize=10,
                                 leading=12.5, textColor=DARK)
styles["roleRight"] = ParagraphStyle("roleRight", fontName="Helvetica", fontSize=9,
                                      leading=12.5, textColor=MUTE, alignment=TA_RIGHT)
styles["sub"] = ParagraphStyle("sub", fontName="Helvetica-Oblique", fontSize=9,
                               leading=12, textColor=ACCENT, spaceAfter=1)
styles["bullet"] = ParagraphStyle("bullet", fontName="Helvetica", fontSize=9,
                                   leading=11.8, textColor=DARK, leftIndent=12,
                                   bulletIndent=2, spaceAfter=0.5)
styles["proj"] = ParagraphStyle("proj", fontName="Helvetica-Bold", fontSize=9.8,
                                 leading=12.5, textColor=DARK)
styles["projMeta"] = ParagraphStyle("projMeta", fontName="Helvetica-Oblique", fontSize=8.4,
                                     leading=11, textColor=MUTE, spaceAfter=1)
styles["skill"] = ParagraphStyle("skill", fontName="Helvetica", fontSize=9.3,
                                  leading=13, textColor=DARK, spaceAfter=1)
styles["cert"] = ParagraphStyle("cert", fontName="Helvetica", fontSize=8.2,
                                 leading=10.4, textColor=DARK)

story = []


def section(title):
    story.append(Paragraph(title.upper(), styles["section"]))
    story.append(HRFlowable(width="100%", thickness=0.9, color=ACCENT,
                            spaceBefore=1, spaceAfter=4))


def bullets(items, limit=None):
    items = items[:limit] if limit else items
    for it in items:
        story.append(Paragraph(it, styles["bullet"], bulletText="\u2022"))


def two_col_header(left_html, right_html):
    t = Table([[Paragraph(left_html, styles["role"]),
                Paragraph(right_html, styles["roleRight"])]],
              colWidths=[4.55 * inch, 2.65 * inch])
    t.setStyle(TableStyle([
        ("LEFTPADDING", (0, 0), (-1, -1), 0),
        ("RIGHTPADDING", (0, 0), (-1, -1), 0),
        ("TOPPADDING", (0, 0), (-1, -1), 0),
        ("BOTTOMPADDING", (0, 0), (-1, -1), 0),
        ("VALIGN", (0, 0), (-1, -1), "BOTTOM"),
    ]))
    story.append(t)


# ---------- header ----------
basics = data["basics"]
story.append(Paragraph(basics["name"], styles["name"]))
story.append(Paragraph("AI Software Engineer", styles["subtitle"]))

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
story.append(Paragraph(contact, styles["contact"]))
story.append(Spacer(1, 4))
story.append(HRFlowable(width="100%", thickness=1.4, color=ACCENT, spaceAfter=2))

# ---------- summary ----------
section("Summary")
summary = (
    "AI Software Engineer specializing in applied AI, data engineering, and cloud-native "
    "solutions on Microsoft Azure. Experienced in building LLM-powered automation, document "
    "intelligence pipelines, and secure DevOps workflows. Microsoft-certified across Azure AI, "
    "Data, and DevOps, with a track record of turning complex systems into reliable, "
    "production-ready products."
)
story.append(Paragraph(summary, styles["summary"]))

# ---------- skills ----------
section("Technical Skills")
for cat in data["skills"]:
    story.append(Paragraph(
        f'<b>{cat["name"]}:</b> {", ".join(cat["keywords"])}', styles["skill"]))

# ---------- experience ----------
section("Experience")

experience = [
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

for i, e in enumerate(experience):
    block = []
    two_col_header(e["company"], e["dates"])
    story.append(Paragraph(f'{e["role"]} &nbsp;|&nbsp; {e["loc"]}', styles["sub"]))
    bullets(e["points"])
    if i != len(experience) - 1:
        story.append(Spacer(1, 3))

# ---------- education ----------
section("Education")
for ed in data["education"]:
    sy = ed.get("startDate", "").replace("-", "/")
    ey = ed.get("endDate", "").replace("-", "/")
    two_col_header(ed["institution"], f'{sy} – {ey}')
    deg = f'{ed.get("studyType", "")}, {ed.get("area", "")}'
    if ed.get("score"):
        deg += f' &nbsp;|&nbsp; GPA: {ed["score"]}'
    story.append(Paragraph(deg, styles["sub"]))
    story.append(Spacer(1, 3))

# ---------- projects ----------
section("Projects")


def clean(name):
    # strip emoji / [WIP] decorations
    out = "".join(ch for ch in name if ord(ch) < 0x2190).strip()
    return out.replace("[WIP]", "").strip()


for p in data["projects"]:
    name = clean(p["name"])
    tech = ", ".join(p.get("keywords", []))
    link = p.get("url") or p.get("github") or ""
    link_html = f' &nbsp;|&nbsp; <a href="{link}" color="#0F6E4F">link</a>' if link and link != "#" else ""
    story.append(Paragraph(f'{name}{link_html}', styles["proj"]))
    if tech:
        story.append(Paragraph(tech, styles["projMeta"]))
    story.append(Paragraph(p["description"], styles["bullet"]))
    bullets(p.get("highlights", []), limit=1)
    story.append(Spacer(1, 2.5))

# ---------- certifications ----------
section("Certifications")
certs = data["certificates"]


def short_cert(name):
    name = name.replace(" by Microsoft and LinkedIn", "")
    name = name.replace("Microsoft Certified: ", "")
    return name.strip()


cert_cells = [Paragraph(f'\u2022 {short_cert(c["name"])} <font color="#55606e">— {c["issuer"]}, {c["date"]}</font>',
                        styles["cert"]) for c in certs]
# arrange into two columns
rows = []
half = (len(cert_cells) + 1) // 2
left = cert_cells[:half]
right = cert_cells[half:]
while len(right) < len(left):
    right.append(Paragraph("", styles["cert"]))
for l, r in zip(left, right):
    rows.append([l, r])
ct = Table(rows, colWidths=[3.55 * inch, 3.55 * inch])
ct.setStyle(TableStyle([
    ("LEFTPADDING", (0, 0), (-1, -1), 0),
    ("RIGHTPADDING", (0, 0), (-1, -1), 6),
    ("TOPPADDING", (0, 0), (-1, -1), 0.6),
    ("BOTTOMPADDING", (0, 0), (-1, -1), 0.6),
    ("VALIGN", (0, 0), (-1, -1), "TOP"),
]))
story.append(ct)

# ---------- build ----------
doc = SimpleDocTemplate(
    OUT, pagesize=letter,
    leftMargin=0.6 * inch, rightMargin=0.6 * inch,
    topMargin=0.5 * inch, bottomMargin=0.5 * inch,
    title="Rajesh Kodaganti — Resume", author="Rajesh Kodaganti",
)
doc.build(story)
print("Wrote", OUT)
