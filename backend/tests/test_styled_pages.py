"""Regression checks for styled page selection and original upload recovery."""
import base64
import json
import tempfile
import unittest
from pathlib import Path
import sys

sys.path.insert(0, str(Path(__file__).resolve().parents[1]))
from styled_pages import read_styled_page, read_styled_404, route_of
import styled_refresh
import ssr_render
from upload_recovery import recover_original


class StyledPagesTests(unittest.TestCase):
    def test_query_and_trailing_slash_use_same_page(self):
        with tempfile.TemporaryDirectory() as directory:
            build = Path(directory)
            page = build / "services" / "cybersecurity" / "index.html"
            page.parent.mkdir(parents=True)
            html = '<html data-prerendered="1"><main><h1>Security</h1></main></html>'
            page.write_text(html)
            self.assertEqual(read_styled_page(build, "/services/cybersecurity/?utm_source=test"), html)
            self.assertIsNone(read_styled_page(build, "/unknown"))

    def test_never_serve_plain_shell_or_traversal(self):
        with tempfile.TemporaryDirectory() as directory:
            build = Path(directory)
            (build / "index.html").write_text('<div id="root"></div>')
            self.assertIsNone(read_styled_page(build, "/"))
            self.assertIsNone(read_styled_page(build, "/%2e%2e/secret"))

    def test_original_upload_is_restored_with_correct_type(self):
        with tempfile.TemporaryDirectory() as directory:
            export = Path(directory) / "export.json"
            export.write_text(json.dumps({"signature":"intrinsic-site-export", "files":{
                "intrrinsic/uploads/original.png": {"data":base64.b64encode(b"original PNG").decode(), "content_type":"image/png"}
            }}))
            self.assertEqual(recover_original(export, "intrrinsic/uploads/original.png"), (b"original PNG", "image/png"))
            self.assertIsNone(recover_original(export, "intrrinsic/uploads/unknown.png"))

    def test_actual_footer_original_is_valid_png(self):
        export = Path(__file__).resolve().parents[1] / "seed_data" / "site_export.json"
        recovered = recover_original(export, "intrrinsic/uploads/a6cff3c6-84d6-437a-ae9c-f850d4c431ac.png")
        self.assertIsNotNone(recovered)
        data, content_type = recovered
        self.assertTrue(data.startswith(b"\x89PNG\r\n\x1a\n"))
        self.assertEqual(content_type, "image/png")

    def test_styled_404_requires_marker(self):
        with tempfile.TemporaryDirectory() as directory:
            build = Path(directory)
            self.assertIsNone(read_styled_404(build))
            (build / ".styled-404.html").write_text('<div id="root"></div>')
            self.assertIsNone(read_styled_404(build))
            (build / ".styled-404.html").write_text('<html data-prerendered="1"><main><h1>Not found</h1></main></html>')
            self.assertIn("Not found", read_styled_404(build))

    def test_route_normalisation(self):
        self.assertEqual(route_of("/services/cloud/?a=1"), "/services/cloud")
        self.assertEqual(route_of("/"), "/")
        self.assertEqual(route_of("/?utm=x"), "/")

    def test_publish_detection_only_for_admin_content_writes(self):
        self.assertTrue(styled_refresh.is_publish("PUT", "/api/live-edits"))
        self.assertTrue(styled_refresh.is_publish("POST", "/api/content/case-studies"))
        self.assertTrue(styled_refresh.is_publish("PUT", "/api/theme"))
        self.assertFalse(styled_refresh.is_publish("GET", "/api/live-edits"))
        self.assertFalse(styled_refresh.is_publish("POST", "/api/inquiries"))
        self.assertFalse(styled_refresh.is_publish("POST", "/api/custom-css/validate"))
        self.assertFalse(styled_refresh.is_publish("POST", "/api/analytics/pageview"))

    def test_plain_ssr_content_never_rendered_visibly(self):
        html = ssr_render._inject_body('<body><div id="root"></div></body>', "<main><h1>T</h1></main>")
        self.assertIn('<div id="root"></div><noscript id="ssr-fallback"><main><h1>T</h1></main></noscript>', html)

    def test_approved_logo_assets_exist_for_fallback(self):
        assets = Path(__file__).resolve().parents[2] / "frontend" / "src" / "assets"
        for name in ("logo-navy.png", "logo-white.png"):
            self.assertTrue((assets / name).read_bytes().startswith(b"\x89PNG"))


if __name__ == "__main__":
    unittest.main()
