"""Audit the actual roofing/paving pages, related FAQs and displayed review excerpts."""
from pathlib import Path
from html.parser import HTMLParser
import json
import re

PROJECT = Path(__file__).resolve().parents[1]
ROOT = PROJECT / 'dist'

class Page(HTMLParser):
    def __init__(self, path):
        super().__init__()
        self.nodes, self.block, self.active = [], '', False
        self.html = path.read_text()
        self.feed(self.html)
    def handle_starttag(self, tag, attrs):
        if tag == 'script' and dict(attrs).get('type') == 'application/ld+json':
            self.active, self.block = True, ''
    def handle_data(self, value):
        if self.active: self.block += value
    def handle_endtag(self, tag):
        if tag == 'script' and self.active:
            self.active = False
            node = json.loads(self.block)
            self.nodes.extend(node.get('@graph', [node]))
    def one(self, kind):
        nodes = [n for n in self.nodes if n.get('@type') == kind]
        assert len(nodes) == 1, (kind, len(nodes))
        return nodes[0]

origin = 'https://johnsproroofing.com'
states = [{'@type': 'State', 'name': name} for name in ['New Jersey', 'New York', 'Pennsylvania']]
services = sorted(p.stem for p in (PROJECT / 'src/content/services').glob('*.mdx') if p.stem != '_meta')
assert len(services) == 8
expected_faqs = {}
for path in (PROJECT / 'src/content/faq').glob('*.mdx'):
    if path.stem == '_meta': continue
    frontmatter = path.read_text().split('---', 2)[1]
    title = re.search(r'^title: "(.*)"$', frontmatter, re.M).group(1)
    ref = re.search(r'^service: "(.*)"$', frontmatter, re.M)
    expected_faqs.setdefault(ref.group(1) if ref else 'general', set()).add(title)

for slug in services:
    page = Page(ROOT / 'services' / slug / 'index.html')
    node, faq = page.one('Service'), page.one('FAQPage')
    url = f'{origin}/services/{slug}'
    assert node['@id'] == url + '#service' and node['url'] == url
    assert node['provider'] == {'@id': origin + '/#business'}
    assert node['areaServed'] == states
    # "Free estimates available" is not a free roofing/paving service.
    assert 'offers' not in node and 'aggregateRating' not in node
    assert {q['name'] for q in faq['mainEntity']} == expected_faqs[slug]
    trail = page.one('BreadcrumbList')['itemListElement']
    assert [c['item'] for c in trail] == [origin + '/', origin + '/services', url]

home = Page(ROOT / 'index.html')
business = next(n for n in home.nodes if n.get('@type') == 'RoofingContractor' and 'review' not in n)
founder = home.one('Person')
assert founder['name'] == 'Charlie John'
assert business['founder'] == [{'@id': founder['@id']}]
assert business['telephone'] == '+1-732-351-3518' and business['areaServed'] == states
assert business['address'] == {'@type': 'PostalAddress', 'streetAddress': '20 Emerald Place',
    'addressLocality': 'Somerset', 'addressRegion': 'NJ', 'postalCode': '08873', 'addressCountry': 'US'}
assert 'openingHoursSpecification' not in business
for route in ['index.html', 'services/index.html', 'testimonials/index.html']:
    page = Page(ROOT / route)
    reviewed = [n for n in page.nodes if n.get('review')]
    assert len(reviewed) == 1 and reviewed[0]['@id'] == origin + '/#business'
    reviews = reviewed[0]['review']
    assert len(reviews) == 16  # Marquee duplicates the cards, not their schema.
    assert len({r['author']['name'] for r in reviews}) == 16
    assert all('reviewRating' not in r and 0 < len(r['reviewBody']) <= 281 for r in reviews)
    assert 'aggregateRating' not in reviewed[0]

faq = Page(ROOT / 'faq/index.html').one('FAQPage')['mainEntity']
assert {q['name'] for q in faq} == expected_faqs['general'] and len(faq) == 22
pages = [Page(p) for p in ROOT.rglob('*.html')]
assert sum(bool(p.nodes) for p in pages) == 20
for page in pages:
    assert 'TODO:' not in page.html and 'Jane Doe' not in page.html
    assert 'backed by .' not in page.html
    assert not any('aggregateRating' in n for n in page.nodes)
for name in ['authors', 'authors/charlie-john', 'blog', 'certifications', 'certifications/todo-cert-1']:
    assert not (ROOT / name / 'index.html').exists(), name
for name in ['llms.txt', 'llms-full.txt']:
    text = (ROOT / name).read_text()
    assert '/services/asphalt-paving' in text and '/services/flat-roofing' in text
    assert 'TODO:' not in text and 'todo-cert-1' not in text
    assert 'businessData' not in text and 'Work is backed by' not in text
    assert 'We are {businessData.insurance}' not in text

# Preserve the site's restrictive policy while permitting its already-used font CSS.
headers = json.loads((PROJECT / 'vercel.json').read_text())['headers']
policy = next(h['value'] for row in headers if row['source'] == '/(.*)' for h in row['headers'] if h['key'] == 'Content-Security-Policy')
assert "default-src 'none'" in policy
style = next(d for d in policy.split(';') if d.strip().startswith('style-src'))
assert 'fonts.googleapis.com' in style
assert "form-action 'self' https://formspree.io" in policy
print('Johns: eight services, related FAQs, founder/address, deduplicated excerpts, breadcrumb URLs, AEO and CSP checks passed.')
