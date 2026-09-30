"""Audit generated HTML, not source assumptions. Run after a production build.

Usage: python3 tests/schema-output.py [project-root ...]
Uses only the Python standard library; supports dist and adapter dist/client.
External vocabulary validation and visual checks remain separate gates.
"""
import json
import re
import sys
from html.parser import HTMLParser
from pathlib import Path


class Page(HTMLParser):
    def __init__(self, markup):
        super().__init__(convert_charrefs=True)
        self.text = []
        self.graphs = []
        self.carousel_quotes = set()
        self.canonical = None
        self.skip = None
        self.schema = None
        self.feed(markup)

    def handle_starttag(self, tag, attrs):
        attrs = dict(attrs)
        if tag == "link" and attrs.get("rel") == "canonical":
            self.canonical = attrs.get("href")
        # These carousels server-render their first slide; later slides mount
        # on interaction. Record the exact serialized quotes separately from
        # HTML matches: they still require a browser interaction check.
        if tag == "astro-island" and "/TestimonialCarousel." in attrs.get("component-url", ""):
            for value in nodes(json.loads(attrs.get("props", "{}"))):
                quote = value.get("quote")
                if isinstance(quote, list) and len(quote) == 2 and quote[0] == 0 and isinstance(quote[1], str):
                    self.carousel_quotes.add(text(quote[1]))
        if tag in ("script", "style"):
            self.skip = tag
            if tag == "script" and attrs.get("type") == "application/ld+json":
                self.schema = []
        elif not self.skip:
            self.text.append(" ")

    def handle_endtag(self, tag):
        if tag == self.skip:
            if self.schema is not None:
                self.graphs.append(json.loads("".join(self.schema)))
            self.schema = None
            self.skip = None
        elif not self.skip:
            self.text.append(" ")

    def handle_data(self, text):
        if self.schema is not None:
            self.schema.append(text)
        elif not self.skip:
            self.text.append(text)


def text(markup):
    return " ".join("".join(Page(markup).text).split())


def nodes(value):
    if isinstance(value, dict):
        yield value
        for child in value.values():
            yield from nodes(child)
    elif isinstance(value, list):
        for child in value:
            yield from nodes(child)


def audit(project):
    dist = project / "dist" / "client"
    if not dist.is_dir():
        dist = project / "dist"
    pages = sorted(dist.rglob("*.html"))
    assert pages, f"{project}: build HTML is missing"
    counts = {"pages": len(pages), "jsonld_blocks": 0, "faq_pages": 0, "questions": 0, "reviews": 0, "reviews_requiring_browser_check": 0}
    errors = []
    for path in pages:
        try:
            page = Page(path.read_text())
            visible = " ".join("".join(page.text).split())
            graph = list(nodes(page.graphs))
            counts["jsonld_blocks"] += len(page.graphs)
            faqs = [node for node in graph if node.get("@type") == "FAQPage"]
            assert len(faqs) <= 1, "duplicate FAQPage blocks"
            counts["faq_pages"] += bool(faqs)
            for faq in faqs:
                if page.canonical:
                    assert faq.get("@id") == f"{page.canonical}#faq", "FAQ identity differs from page canonical"
                seen = set()
                for question in faq.get("mainEntity", []):
                    title = text(question["name"])
                    answer = question["acceptedAnswer"]["text"]
                    assert title and title not in seen, f"empty/duplicate FAQ question: {title}"
                    seen.add(title)
                    assert title in visible, f"FAQ question absent from HTML: {title}"
                    assert text(answer) and text(answer) in visible, f"FAQ answer absent from HTML: {title}"
                    assert not re.search(r"<script|astro-island|\bimport .+ from ", answer), f"raw MDX/hydration in FAQ: {title}"
                    counts["questions"] += 1
            item_identities = {}
            for node in graph:
                if node.get("@type") in ("Service", "Course", "Product") and node.get("@id") and node.get("name"):
                    identity = node["@id"]
                    facts = (node["@type"], node["name"], node.get("url"))
                    previous = item_identities.get(identity)
                    assert previous is None or previous == facts, f"conflicting item identity: {identity}"
                    item_identities[identity] = facts
                if node.get("@type") == "Review":
                    body = text(node.get("reviewBody", ""))
                    assert body and (body in visible or body in page.carousel_quotes), "review text absent from HTML and carousel props"
                    if body not in visible:
                        counts["reviews_requiring_browser_check"] += 1
                    counts["reviews"] += 1
                if node.get("@type") == "Rating":
                    assert 1 <= float(node["ratingValue"]) <= 5, "invalid rating"
                if node.get("@type") == "Offer" and "price" in node:
                    assert re.fullmatch(r"\d+(?:\.\d+)?", str(node["price"])), "non-numeric offer price"
                    assert node.get("priceCurrency"), "priced offer missing currency"
                for founder in node.get("founder", []):
                    identifier = founder.get("@id")
                    assert any(person.get("@id") == identifier and person.get("name") for person in graph), "founder reference without identity"
        except (AssertionError, KeyError, TypeError, ValueError) as error:
            errors.append(f"{path.relative_to(project)}: {error}")
    assert counts["jsonld_blocks"], f"{project}: no JSON-LD emitted"
    for name in ("llms.txt", "llms-full.txt", "robots.txt"):
        assert (dist / name).is_file() and (dist / name).stat().st_size, f"{project}: missing generated {name}"
    print(json.dumps({"project": project.name, **counts, "errors": errors}))
    return len(errors)


if __name__ == "__main__":
    projects = [Path(arg).resolve() for arg in sys.argv[1:]] or [Path(__file__).resolve().parents[1]]
    sys.exit(bool(sum(audit(project) for project in projects)))
