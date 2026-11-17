import base64, re, io
from PIL import Image
t = open('template.html').read()
SVG = {
 'heart': '<svg viewBox="0 0 24 24" aria-hidden="true"><path fill="#b9466a" d="M12 21s-7.5-4.6-9.6-9.3C.9 8.2 3.2 4.5 6.8 4.5c2.1 0 3.5 1.1 4.2 2.3.7-1.2 2.1-2.3 4.2-2.3 3.6 0 5.9 3.7 4.4 7.2C19.5 16.4 12 21 12 21z"/><path fill="none" stroke="#fff" stroke-width="1.6" stroke-linejoin="round" d="M5 12h3l1.5-3 2.5 6 1.8-3H19"/></svg>',
 'star': '<svg viewBox="0 0 24 24" aria-hidden="true"><path fill="#ffc83d" stroke="#4c8a2b" stroke-width="1.4" d="M12 2l2.9 6.6 7.1.6-5.4 4.7 1.6 7-6.2-3.7-6.2 3.7 1.6-7L2 9.2l7.1-.6z"/></svg>',
 'gear': '<svg viewBox="0 0 24 24" aria-hidden="true"><path fill="#a87b0f" d="M10.3 2h3.4l.5 2.6 1.9.8 2.2-1.5 2.4 2.4-1.5 2.2.8 1.9 2.6.5v3.4l-2.6.5-.8 1.9 1.5 2.2-2.4 2.4-2.2-1.5-1.9.8-.5 2.6h-3.4l-.5-2.6-1.9-.8-2.2 1.5-2.4-2.4 1.5-2.2-.8-1.9L2 13.7v-3.4l2.6-.5.8-1.9-1.5-2.2 2.4-2.4 2.2 1.5 1.9-.8z"/><circle cx="12" cy="12" r="3.6" fill="#fff"/></svg>',
 'bulb': '<svg viewBox="0 0 24 24" aria-hidden="true"><path fill="#ffc83d" stroke="#6b4fb3" stroke-width="1.4" d="M12 2.5a6.5 6.5 0 0 0-3.8 11.8c.8.6 1.3 1.5 1.3 2.4V18h5v-1.3c0-.9.5-1.8 1.3-2.4A6.5 6.5 0 0 0 12 2.5z"/><path fill="#6b4fb3" d="M9.5 19.5h5V21a1.5 1.5 0 0 1-1.5 1.5h-2A1.5 1.5 0 0 1 9.5 21z"/></svg>',
 'moon': '<svg viewBox="0 0 120 110" width="100%" height="100%" aria-hidden="true"><rect x="22" y="18" width="76" height="52" rx="6" fill="#4a5a85" stroke="#9aa5c4" stroke-width="3"/><path d="M68 34a16 16 0 1 0 8 26 13 13 0 1 1-8-26z" fill="#ffe08a"/><rect x="52" y="72" width="16" height="10" fill="#9aa5c4"/></svg>'}
def uri(fn):
    if fn.endswith('.png'):
        b = io.BytesIO(); Image.open(fn).save(b, 'WEBP', quality=80)
        return 'data:image/webp;base64,' + base64.b64encode(b.getvalue()).decode()
    return 'data:image/jpeg;base64,' + base64.b64encode(open(fn, 'rb').read()).decode()
cache = {}
def sub(m):
    k = m.group(1)
    if k.startswith('svg:'): return SVG[k[4:]]
    if k not in cache: cache[k] = uri(k)
    return cache[k]
out = re.sub(r'\{\{([^}]+)\}\}', sub, t)
assert '{{' not in out
open('/home/user/Scienceshamah/integrated-lessons/health-care/health_groups.html', 'w').write(out)
print(len(out) // 1024, 'KB')
