"""Compare displayed breadcrumb labels/links with JSON-LD and check destination pages.
Run after a clean production build: python3 tests/breadcrumb-output.py . ../FariasDemolition
Redirect stubs/Partytown helpers are excluded; only full schema-bearing pages count.
"""
from pathlib import Path
from html.parser import HTMLParser
from urllib.parse import urljoin,urlparse,unquote
import json,sys
class Parser(HTMLParser):
 def __init__(self):
  super().__init__(convert_charrefs=True);self.schema=[];self.inld=False;self.ld='';self.nav=None;self.trails=[];self.crumb=None;self.hidden=0;self.canonical=None
 def handle_starttag(self,tag,attrs):
  a=dict(attrs)
  if tag=='link' and a.get('rel')=='canonical':self.canonical=a.get('href')
  if tag=='script' and a.get('type')=='application/ld+json':self.inld=True;self.ld=''
  if tag=='nav' and 'breadcrumb' in a.get('aria-label','').lower():self.nav=[]
  if self.nav is not None:
   if self.hidden or a.get('aria-hidden')=='true':self.hidden+=1
   if tag=='li': self.crumb={'text':[],'url':None}
   if self.crumb is not None and not self.hidden:
    if tag=='a':self.crumb['url']=a.get('href')
    if a.get('aria-label'):self.crumb['text'].append(a['aria-label'])
 def handle_data(self,text):
  if self.inld:self.ld+=text
  if self.crumb is not None and not self.hidden:self.crumb['text'].append(text)
 def handle_endtag(self,tag):
  if self.inld and tag=='script':
   self.inld=False;n=json.loads(self.ld);self.schema.extend(n.get('@graph',[n]) if isinstance(n,dict) else n)
  if self.nav is not None:
   if self.hidden:self.hidden-=1
   if tag=='li' and self.crumb is not None:
    self.nav.append((' '.join(' '.join(self.crumb['text']).split()),self.crumb['url']));self.crumb=None
   if tag=='nav':self.trails.append(self.nav);self.nav=None
results={}
for repo in sys.argv[1:]:
 p=Path(repo);out=p/'dist/client' if (p/'dist/client').exists() else p/'dist'
 pages={}
 for f in out.rglob('*.html'):
  if '~partytown' in str(f):continue
  h=Parser();h.feed(f.read_text())
  if h.canonical and h.schema:pages['/'+str(f.relative_to(out)).removesuffix('index.html').removesuffix('.html').strip('/')]=h
 errors=[];trail_count=0;ui_count=0;sample={}
 for path,h in pages.items():
  trails=[n['itemListElement'] for n in h.schema if n.get('@type')=='BreadcrumbList'];trail_count+=len(trails)
  for trail in trails:
   for i,c in enumerate(trail):
    if c['position']!=i+1:errors.append(f'{path}: position')
    u=c.get('item')
    if not u:errors.append(f'{path}: missing destination');continue
    if urlparse(u).netloc==urlparse(h.canonical or '').netloc:
     dest=unquote(urlparse(u).path).rstrip('/') or '/'
     if dest not in pages:errors.append(f'{path}: unavailable destination {u}')
   if trail[-1].get('item')!=h.canonical:errors.append(f'{path}: current canonical mismatch')
  for ui in h.trails:
   ui_count+=1
   if len(ui)<2:continue
   matches=[t for t in trails if [c['name'] for c in t]==[c[0] for c in ui]]
   if not matches:errors.append(f'{path}: UI names mismatch {ui} vs {[[c["name"] for c in t] for t in trails]}');continue
   for (label,href),c in zip(ui[:-1],matches[0][:-1]):
    u=urljoin(h.canonical,href);dest=urlparse(u).path.rstrip('/') or '/';canonical=pages[dest].canonical if dest in pages else u
    if canonical!=c.get('item'):errors.append(f'{path}: UI link mismatch {label}')
  if path in ['/demolitions','/projects/kitchen','/service-areas/freehold','/service-areas/monmouth-county'] or h.trails:sample[path]={'ui':h.trails,'schema':[[c['name'] for c in t] for t in trails]}
 results[p.name]={'pages':len(pages),'breadcrumbSchemas':trail_count,'visibleBreadcrumbs':ui_count,'errors':errors,'samples':sample}
print(json.dumps(results,indent=2))
if any(r['errors'] for r in results.values()):sys.exit(1)
