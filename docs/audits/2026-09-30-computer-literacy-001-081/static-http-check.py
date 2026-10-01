"""Read-only HTTP, navigation and asset checks. This is NOT browser/mobile QA."""
from concurrent.futures import ThreadPoolExecutor
from html.parser import HTMLParser
from pathlib import Path
from urllib.parse import urljoin, urlsplit, unquote
from urllib.request import urlopen
from collections import Counter
from PIL import Image
import hashlib
import json
import os

ROOT = Path(__file__).resolve().parents[3]
AUDIT = Path(__file__).resolve().parent
BASE = os.environ.get('QA_BASE_URL', 'http://127.0.0.1:4325')
SCOPE = '/computer-literacy/written/computer-basics/'
evidence = json.loads((AUDIT / 'source-verification.json').read_text())


class Document(HTMLParser):
    def __init__(self, text):
        super().__init__(convert_charrefs=True)
        self.nodes = []
        self.feed(text)
        self.ids = [a['id'] for _, a in self.nodes if a.get('id')]

    def handle_starttag(self, tag, attrs):
        self.nodes.append((tag, dict(attrs)))


errors = []
pages = []
requests = set()
fragments = []
documents = {}


def require(condition, message):
    if not condition:
        errors.append(message)


def local_file(url):
    pathname = unquote(urlsplit(url).path)
    target = ROOT / 'dist' / pathname.lstrip('/')
    return target / 'index.html' if target.is_dir() else target


for index, chapter in enumerate(evidence['chapters']):
    file = ROOT / chapter['path']
    require(hashlib.sha256(file.read_bytes()).hexdigest() == chapter['sha256'], f'{chapter["order"]}: reviewed source hash')
    path = SCOPE + chapter['slug'] + '/'
    requests.add(path)
    doc = Document(local_file(path).read_text())
    documents[path] = doc
    require(len(doc.ids) == len(set(doc.ids)), f'{path}: duplicate HTML ids')
    nav = {}
    image_records = []
    local_links = 0
    popups = []
    for tag, attr in doc.nodes:
        classes = (attr.get('class') or '').split()
        if 'chapter-mobile-link' in classes and attr.get('href'):
            for direction in ['previous', 'next']:
                if direction in classes:
                    nav[direction] = attr['href']
        if tag == 'button' and attr.get('data-open'):
            question = attr['data-open']
            require('q-' + question in doc.ids, f'{path}: missing dialog {question}')
            require(any(t == 'button' and a.get('data-close') == question for t, a in doc.nodes), f'{path}: missing close {question}')
            require(any(t == 'button' and a.get('data-reveal') == question for t, a in doc.nodes), f'{path}: missing reveal {question}')
            popups.append(question)
        for key in ['aria-controls', 'aria-labelledby', 'aria-describedby']:
            for target in (attr.get(key) or '').split():
                require(target in doc.ids, f'{path}: broken {key} {target}')
        if tag == 'meta' and attr.get('name') == 'viewport':
            require('width=device-width' in attr.get('content', ''), f'{path}: viewport missing device-width')
        field = 'href' if tag in ['a', 'link'] else 'src' if tag in ['img', 'script', 'source'] else None
        raw = attr.get(field) if field else None
        if raw:
            url = urlsplit(urljoin(BASE + path, raw))
            if url.netloc == urlsplit(BASE).netloc:
                requests.add(url.path)
                require(local_file(url.path).is_file(), f'{path}: missing local target {url.path}')
                if tag == 'a':
                    local_links += 1
                    if url.fragment:
                        fragments.append((path, url.path, unquote(url.fragment)))
        if tag == 'img' and 'q-image' in classes:
            with Image.open(local_file(attr['src'])) as image:
                width, height = image.size
            declared_w, declared_h = int(attr['width']), int(attr['height'])
            require(abs(width / height - declared_w / declared_h) < 0.002, f'{path}: image aspect ratio metadata {attr["src"]}')
            require(bool(attr.get('alt', '').strip()), f'{path}: empty question image alt')
            image_records.append({'src': attr['src'], 'alt': attr['alt'], 'actualSize': [width, height], 'declaredSize': [declared_w, declared_h]})
    if index:
        require(nav.get('previous') == SCOPE + evidence['chapters'][index - 1]['slug'] + '/', f'{path}: previous sequence')
    else:
        require('previous' not in nav, f'{path}: first chapter previous')
    if index < 80:
        require(nav.get('next') == SCOPE + evidence['chapters'][index + 1]['slug'] + '/', f'{path}: next sequence')
    else:
        require('next' not in nav, f'{path}: last public chapter next')
    require(set(popups) == set(chapter['primary'] + chapter['support']), f'{path}: popup set mismatch')
    require(any(t == 'meta' and a.get('name') == 'viewport' for t, a in doc.nodes), f'{path}: no viewport meta')
    pages.append({'order': chapter['order'], 'path': path, 'navigation': nav, 'internalLinkOccurrences': local_links, 'dialogWiringCount': len(popups), 'images': image_records, 'tableCount': sum(t == 'table' for t, _ in doc.nodes)})

for source, target, fragment in fragments:
    if target not in documents and local_file(target).is_file():
        documents[target] = Document(local_file(target).read_text())
    require(target in documents and fragment in documents[target].ids, f'{source}: missing fragment {target}#{fragment}')


def request(path):
    try:
        with urlopen(BASE + path, timeout=10) as response:
            body = response.read()
            return {'path': path, 'status': response.status, 'bytes': len(body), 'contentType': response.headers.get('Content-Type')}
    except Exception as error:
        return {'path': path, 'error': str(error)}


with ThreadPoolExecutor(max_workers=6) as pool:
    responses = list(pool.map(request, sorted(requests)))
for response in responses:
    require(response.get('status') == 200 and response.get('bytes', 0) > 0, f'HTTP: {response}')
result = {
    'date': '2026-10-01',
    'type': 'static HTML and local HTTP checks; no browser execution',
    'baseUrl': BASE,
    'passed': not errors,
    'summary': {'chapters': len(pages), 'previousNextLinks': sum(len(p['navigation']) for p in pages), 'internalLinkOccurrences': sum(p['internalLinkOccurrences'] for p in pages), 'uniqueHttpTargets': len(responses), 'dialogWiringCount': sum(p['dialogWiringCount'] for p in pages), 'questionImageOccurrences': sum(len(p['images']) for p in pages), 'tablesInventoriedNotVisuallyTested': sum(p['tableCount'] for p in pages)},
    'pages': pages,
    'http': responses,
    'errors': errors,
    'notVerified': ['390px actual layout', 'table overflow/clipping', 'rendered line wrapping', 'image readability/displayed size', 'popup JavaScript interaction', 'actual click navigation', 'overlap'],
}
(AUDIT / 'static-http-results.json').write_text(json.dumps(result, ensure_ascii=False, indent=2) + '\n')
print(json.dumps({'passed': result['passed'], **result['summary'], 'errors': errors}, ensure_ascii=False, indent=2))
raise SystemExit(0 if not errors else 1)
