"""Focused snapshot/resume checks; all scratch files stay inside the repository."""

import copy
import json
from pathlib import Path
import shutil
import unittest
from unittest.mock import patch
from uuid import uuid4

from pypdf import PdfReader

import build_resume
from scripts import validate_portfolio as validator
from scripts.sheet_snapshot import COLLECTIONS, load_snapshot


ROOT = Path(__file__).resolve().parents[1]


class SheetBuildTests(unittest.TestCase):
    def setUp(self):
        self.directory = ROOT / f".sheet-test-{uuid4().hex}"
        self.directory.mkdir()
        self.addCleanup(shutil.rmtree, self.directory)
        validator.errors.clear()
        validator.warnings.clear()
        validator.external_urls.clear()

    def snapshot(self, data):
        path = self.directory / "snapshot.json"
        path.write_text(json.dumps(data), encoding="utf-8")
        return path

    def test_empty_optional_collections_and_profile_fields(self):
        data = load_snapshot(self.snapshot({"basics": {"name": "Test Person"}}))
        self.assertTrue(all(data[key] == [] for key in COLLECTIONS))
        for cfg in build_resume.VARIANTS:
            build_resume.build(cfg, data, self.directory)
            pages = PdfReader(self.directory / cfg["out"]).pages
            self.assertEqual(len(pages), 1)
            self.assertIn("Test Person", pages[0].extract_text())
        shutil.copyfile(ROOT / "Resume - Rajesh Kodaganti (Master).pdf", self.directory / "resume.pdf")
        validator.validate_resumes(data, self.directory)
        self.assertEqual(validator.errors, [])

    def test_every_reportlab_field_is_literal_spreadsheet_text(self):
        literal = '<b>R&D "Research"</b>'
        data = {
            "basics": {"name": literal, "label": literal, "summary": literal,
                       "impact": literal, "email": 'a&b@example.com', "phone": literal,
                       "location": {"city": literal},
                       "profiles": [{"network": literal, "url": 'https://example.com/?q="&x=1'}]},
            "work": [{"name": literal, "position": literal, "location": literal,
                      "startDate": "2026", "endDate": "Present", "highlights": [literal]}],
            "education": [{"institution": literal, "area": literal, "studyType": literal, "score": literal}],
            "projects": [{"name": literal, "description": literal, "keywords": [literal],
                          "highlights": [literal], "url": 'https://example.com/?q="&x=1'}],
            "skills": [{"name": literal, "keywords": [literal]}],
            "certificates": [{"name": literal, "issuer": literal, "date": literal}],
        }
        data = load_snapshot(self.snapshot(data))
        for cfg in build_resume.VARIANTS:
            build_resume.build(cfg, data, self.directory)
            content = "\n".join(page.extract_text() for page in PdfReader(self.directory / cfg["out"]).pages)
            self.assertIn(literal, content)
        shutil.copyfile(ROOT / "Resume - Rajesh Kodaganti (Master).pdf", self.directory / "resume.pdf")
        validator.validate_resumes(data, self.directory)
        self.assertEqual(validator.errors, [])

    def test_invalid_or_duplicate_snapshot_content_fails(self):
        for data in ({}, {"basics": {"name": ""}},
                     {"basics": {"name": "X"}, "projects": None},
                     {"basics": {"name": "X"}, "projects": [{"keywords": "one|two"}]},
                     {"basics": {"name": "X"}, "work": [{"id": "x"}, {"id": "x"}]}):
            with self.subTest(data=data), self.assertRaises(ValueError):
                load_snapshot(self.snapshot(data))

    def test_same_site_assets_are_checked_locally(self):
        with patch.object(validator, "ROOT", self.directory):
            (self.directory / "image test.svg").write_text("<svg/>", encoding="utf-8")
            validator.validate_reference(self.directory / "snapshot.json",
                                         "https://rajeshkodaganti.com/image%20test.svg?v=1")
            self.assertEqual(validator.errors, [])
            validator.validate_reference(self.directory / "snapshot.json",
                                         "https://www.rajeshkodaganti.com/missing.svg")
            self.assertEqual(len(validator.errors), 1)

    def test_runtime_empty_templates_keep_structural_checks(self):
        page = self.directory / "index.html"
        page.write_text(
            '<link rel="canonical" href="">'
            '<main id="projects-grid"></main><img hidden alt="">'
            '<footer><p></p></footer>'
            '<script src="js/sheet-source.js"></script>'
            '<script src="js/site-content.js"></script>', encoding="utf-8")
        (self.directory / "js").mkdir()
        (self.directory / "js" / "sheet-source.js").write_text("", encoding="utf-8")
        (self.directory / "js" / "site-content.js").write_text("", encoding="utf-8")
        with patch.object(validator, "ROOT", self.directory), patch.object(validator, "HTML_FILES", [page]):
            validator.validate_html()
            self.assertEqual(validator.errors, [])
            page.write_text('<img hidden src="missing.png">', encoding="utf-8")
            validator.validate_html()
            self.assertTrue(any("alt text" in error for error in validator.errors))
            self.assertTrue(any("canonical" in error for error in validator.errors))
            self.assertTrue(any("missing local reference" in error for error in validator.errors))

    def test_dynamic_card_accessibility_and_assets(self):
        data = load_snapshot(self.snapshot({"basics": {"name": "X"},
                                            "projects": [{"id": "p", "image": "missing.png"}]}))
        validator.validate_data(data, self.directory / "snapshot.json")
        self.assertTrue(any("alternative text" in error for error in validator.errors))
        self.assertTrue(any("missing local reference" in error for error in validator.errors))

    def test_pdf_validation_detects_stale_content_and_master_changes(self):
        data = load_snapshot(self.snapshot({"basics": {"name": "Old Name"}}))
        for cfg in build_resume.VARIANTS:
            build_resume.build(cfg, data, self.directory)
        shutil.copyfile(self.directory / "resume-1page.pdf", self.directory / "resume.pdf")
        current = copy.deepcopy(data)
        current["basics"]["name"] = "New Name"
        validator.validate_resumes(current, self.directory)
        self.assertTrue(any("New Name" in error for error in validator.errors))
        self.assertTrue(any("exactly match" in error for error in validator.errors))

    def test_pdf_page_budget_is_still_enforced(self):
        data = load_snapshot(self.snapshot({"basics": {"name": "Test Person"}}))
        for cfg in build_resume.VARIANTS:
            build_resume.build(cfg, data, self.directory)
        from pypdf import PdfWriter
        path = self.directory / "resume-1page.pdf"
        page = PdfReader(path).pages[0]
        writer = PdfWriter()
        writer.add_page(page)
        writer.add_page(page)
        writer.write(path)
        shutil.copyfile(ROOT / "Resume - Rajesh Kodaganti (Master).pdf", self.directory / "resume.pdf")
        validator.validate_resumes(data, self.directory)
        self.assertTrue(any("1-page budget" in error for error in validator.errors))


if __name__ == "__main__":
    unittest.main()
