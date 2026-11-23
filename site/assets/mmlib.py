"""Mapas mentais: DSL de texto com recuo -> HTML estático (ul.mm), usado pelos módulos 09 e 10.
Sintaxe por linha: Rótulo :: u=link :: a=âncora1,âncora2 :: n=nota :: c=instrução :: k=ordem :: z=itens recolhidos :: q=busca com {x}
"""
import html, urllib.parse

E = lambda s: html.escape(str(s), quote=True)


def parse(src):
    root = None
    stack = []
    for line in src.strip('\n').split('\n'):
        if not line.strip():
            continue
        ind = (len(line) - len(line.lstrip(' '))) // 2
        parts = [p.strip() for p in line.strip().split(' :: ')]
        node = dict(t=parts[0], kids=[])
        for p in parts[1:]:
            k, v = p.split('=', 1)
            node[k] = v
        if ind == 0:
            root = node
            stack = [node]
            continue
        stack = stack[:ind]
        stack[-1]['kids'].append(node)
        stack.append(node)
    return root


def _anchor_label(a):
    p = a.split('-', 1)[0]
    return p.upper() if p.startswith('m') and p[1:].isdigit() else 'aqui'


def render_node(n, path):
    pid = '.'.join(map(str, path))
    lab = E(n['t'])
    bits = []
    if n.get('k'):
        bits.append(f'<span class="mmk">{E(n["k"])}</span>')
    if n.get('u'):
        bits.append(f'<a class="mmt" href="{E(n["u"])}">{lab}</a>')
    elif n.get('q'):
        q = n['q']
        bits.append(f'<a class="mmt mmq" data-q="{E(q)}" href="https://www.google.com/search?q={urllib.parse.quote(q.replace("{x}", "<termo>"))}">{lab}</a> <code class="mmqc">{E(q.replace("{x}", "<termo>"))}</code>')
    else:
        bits.append(f'<span class="mmt">{lab}</span>')
    if n.get('c'):
        bits.append(f'<span class="mmc">{E(n["c"])}</span>')
    if n.get('z'):
        bits.append(f'<span class="mmz">recolhido no PDF · {E(n["z"])} itens</span>')
    if n.get('a'):
        bits.append('<span class="mma">' + ' '.join(f'<a href="#{E(a.strip())}">→ {E(_anchor_label(a.strip()))}</a>' for a in n['a'].split(',') if a.strip()) + '</span>')
    note = f'<div class="mmn-note">{E(n["n"])}</div>' if n.get('n') else ''
    kids = ''
    if n['kids']:
        kids = '<ul>' + ''.join(render_node(c, path + [i]) for i, c in enumerate(n['kids'])) + '</ul>'
    cls = 'mmi' + (' has' if n['kids'] else '')
    return f'<li class="{cls}" data-p="{pid}"><div class="mmrow"><input type="checkbox" class="mmck" aria-label="feito">{"".join(bits)}</div>{note}{kids}</li>'


def render_tree(key, root):
    body = ''.join(render_node(c, [i]) for i, c in enumerate(root['kids']))
    return f'<div class="mm" data-map="{E(key)}" data-root="{E(root["t"])}"><div class="mmroot">{E(root["t"])}</div><ul>{body}</ul></div>'


def render_map(key, src):
    return render_tree(key, parse(src))


def bar(placeholder=None, pivot=False, editor=True):
    x = f'<input class="mmx" placeholder="{E(placeholder)}">' if placeholder else ''
    pv = '<button class="btn pri mmpv">→ Central de pivôs</button>' if pivot else ''
    ed = '<button class="btn mmedit">Abrir no editor</button>' if editor else ''
    return (f'<div class="mmbar form">{x}<button class="btn mmall">Expandir tudo</button><button class="btn mmnone">Recolher</button>'
            f'<button class="btn mmexp">Exportar…</button>{ed}<button class="btn mmzero">Desmarcar</button>{pv}<span class="progtxt mmprog"></span></div>')
