#!/usr/bin/env python3
"""Monta o site do GitHub Pages em _site/ (formato do hub: módulos, busca, Bíblia de fontes, mini guias).

Fontes:
  docs/, labs/, templates/, recursos/   guias do repositório (markdown → seções do hub)
  site/modulos/                          módulos próprios já em HTML (fundamentos, busca, atlas, Bazzell, Dark Web)
  site/assets/                           estilo e motor do hub
  recursos/fontes.json                   base de fontes (gerada por tools/build_fontes.py)

Uso:
  python3 tools/build_fontes.py && python3 tools/build_site.py          # duas passadas: a 2ª refaz o Atlas
Dependência só do build: beautifulsoup4 (pip install beautifulsoup4).
"""
from __future__ import annotations

import html
import json
import os
import re
import shutil
import subprocess
import sys
from pathlib import Path

from bs4 import BeautifulSoup

ROOT = Path(__file__).resolve().parents[1]
SITE = ROOT / 'site'
OUT = ROOT / '_site'
REPO = 'https://github.com/Ridd1kulusC0d3r/OSINT/blob/main/'
E = lambda s: html.escape(str(s), quote=True)

# ---------------------------------------------------------------- módulos markdown
MD_MODS = {
    'm12': dict(title='Método operacional', short='Método operacional',
                sub='Da pergunta à conclusão: método em seis etapas, avaliação VISTA, verificação, análise estruturada, proveniência e ética.',
                lead='O método do repositório, do pedido à entrega revisável: o que sabemos, como sabemos, o que não sabemos e o que mudaria a conclusão.',
                docs=[('docs/trilha-inicial.md', 'Começo'), ('docs/metodo.md', 'A · Método'), ('docs/avaliacao-de-fontes.md', 'A · Método'),
                      ('docs/verificacao.md', 'A · Método'), ('docs/analise-estruturada.md', 'B · Análise'), ('docs/dados-e-proveniencia.md', 'B · Análise'),
                      ('docs/qualidade-e-etica.md', 'C · Qualidade e ética'), ('docs/indice.md', 'D · Trilhas')]),
    'm13': dict(title='Guias por plataforma', short='Guias por plataforma',
                sub='Redes sociais, buscadores e arquivos, mapas e imagens e registros públicos do Brasil: o que é público, recursos nativos, preservação e limites.',
                lead='Cada plataforma é uma fonte com regras próprias. Um guia por grupo e uma seção por plataforma, sempre na mesma ordem: para que serve, o que é público, recursos nativos, como preservar e limites.',
                docs=[('docs/plataformas/README.md', 'Começo'), ('docs/plataformas/redes-sociais.md', 'A · Redes sociais', 'split'),
                      ('docs/plataformas/buscadores-e-arquivos.md', 'B · Buscadores e arquivos', 'split'),
                      ('docs/plataformas/mapas-e-imagens.md', 'C · Mapas e imagens', 'split'),
                      ('docs/plataformas/registros-publicos-br.md', 'D · Registros públicos BR', 'split')]),
    'm14': dict(title='Aplicações: CTI, GEOINT e casos de uso', short='CTI, GEOINT e casos',
                sub='OSINT para inteligência de ameaças e SOC, verificação visual GEOINT/IMINT e casos de uso.',
                lead='Onde o método encontra o trabalho: notas defensivas de CTI, validação de imagens, mapas e datas, e os usos mais comuns.',
                docs=[('docs/osint-cti.md', 'A · CTI'), ('docs/geoint-imint.md', 'B · GEOINT / IMINT'), ('docs/casos-de-uso.md', 'C · Casos de uso')]),
    'm15': dict(title='Laboratórios e modelos', short='Laboratórios e modelos',
                sub='Seis laboratórios com cenários sintéticos e resolução comentada, e os modelos de plano, evidências, hipóteses e relatório.',
                lead='Pratique com casos 100% fictícios e entregue no formato profissional. Cada laboratório tem missão, critérios e resolução comentada.',
                docs=[('labs/README.md', 'Começo'), ('labs/01-evidencias/README.md', 'A · Laboratórios'), ('labs/02-triangulacao/README.md', 'A · Laboratórios'),
                      ('labs/03-verificacao-temporal/README.md', 'A · Laboratórios'), ('labs/04-qualidade-de-fontes/README.md', 'A · Laboratórios'),
                      ('labs/05-osint-cti/README.md', 'A · Laboratórios'), ('labs/06-validacao-visual/README.md', 'A · Laboratórios'),
                      ('templates/README.md', 'B · Modelos'), ('templates/plano.md', 'B · Modelos'), ('templates/evidencias.md', 'B · Modelos'),
                      ('templates/matriz-de-hipoteses.md', 'B · Modelos'), ('templates/relatorio.md', 'B · Modelos')]),
    'm16': dict(title='Fontes e referências', short='Fontes e referências',
                sub='Catálogo editorial, fontes oficiais, ferramentas, leituras essenciais e a lista completa de fontes por categoria.',
                lead='O que o repositório recomenda, por que e com quais limites — e a lista completa, uma linha por fonte, para consulta.',
                docs=[('recursos/README.md', 'Começo'), ('recursos/fontes-e-referencias.md', 'A · Curadoria'), ('recursos/ferramentas.md', 'A · Curadoria'),
                      ('recursos/leituras-essenciais.md', 'A · Curadoria'), ('docs/acervo.md', 'B · Acervo')]),
}
HTML_MODS = {
    'm01': dict(title='Fundamentos, método e ambiente', short='Fundamentos', frag='m01.html', data='m01_data.js', extra=None,
                sub='Dado, informação e conhecimento, ciclo de inteligência, validade e cadeia de custódia, modelos de relatório e o ambiente seguro.'),
    'm02': dict(title='Busca e identidade de investigação', short='Busca e identidade', frag='m02.html', data='m02_data.js', extra='m02_extra.js',
                sub='Identidade de trabalho, limites legais e OPSEC do navegador; buscadores, operadores, dorks, alertas e checagem de fatos.'),
    'm09': dict(title='Atlas: OSINT Framework e mapas', short='Atlas e OSINT Framework', frag='m09.html', data='m09_data.js', extra='m09_extra.js',
                sub='Mapa de cada módulo, o OSINT Framework (MIT) filtrável e fluxos de verificação — checklist, exportação e editor.'),
    'm10': dict(title='Michael Bazzell e a IntelTechniques', short='Bazzell e IntelTechniques', frag='m10_main.html', data='m10_data.js', extra='m10_extra.js',
                sub='Ferramentas de busca, o livro OSINT Techniques mapeado, máquina virtual, guias de privacidade e treinamento.'),
    'm11': dict(title='Dark Web: mapa de estudos', short='Dark Web: mapa', frag='m11_main.html', data='m11_data.js', extra='m11_all.js',
                sub='Três zonas, quatro regras, oito trechos e dois ramais, com 196 leituras, ferramentas e datasets, e uma biblioteca filtrável.'),
}
ORDER = ['m01', 'm12', 'm02', 'm13', 'm14', 'm15', 'm16', 'm09', 'm10', 'm11']
VIEWS = ('inicio', 'biblia', 'livro', 'treinamento', 'central', 'roteiros', 'simulado', 'caderno')

# âncoras de módulos que não estão nesta edição → equivalentes publicados
REMAP = {
    'm01-livro': 'm16-leituras-essenciais', 'm01-livro-links': 'm16-leituras-essenciais',
    'm02-avi-telefone': 'm02-avi-limites', 'm02-avi-perfil': 'm02-avi-limites', 'm02-avi-rosto': 'm02-avi-limites', 'm02-lab-avi': 'm02-avi-limites',
    'm02-b-pessoas': 'm13-registros-publicos-br',
    'm03-a-whois': 'm13-registros-publicos-br-dominios-br', 'm03-a-geo': 'm16-ferramentas', 'm03-a-cache': 'm13-buscadores-e-arquivos-wayback-machine-internet-archive',
    'm03-b-mapa': 'm13-visao', 'm03-b-vaz': 'm12-qualidade-e-etica', 'm03-a-url': 'm02-b-operadores', 'm03-lab-url': 'm02-b-operadores',
    'm04-a-username': 'm13-redes-sociais', 'm04-a-id': 'm13-redes-sociais', 'm04-a-idplat': 'm13-redes-sociais', 'm04-a-api': 'm13-redes-sociais',
    'm04-b-facebook': 'm13-redes-sociais-facebook', 'm04-b-twitter': 'm13-redes-sociais-x-twitter', 'm04-lab-x': 'm13-redes-sociais-x-twitter',
    'm04-b-instagram': 'm13-redes-sociais-instagram', 'm04-b-linkedin': 'm13-redes-sociais-linkedin', 'm04-b-tiktok': 'm13-redes-sociais-tiktok',
    'm04-b-comunidades': 'm13-redes-sociais-reddit', 'm04-c-preserv': 'm01-preservacao', 'm04-c-records': 'm13-redes-sociais',
    'm05-a-reversa': 'm13-mapas-e-imagens-busca-reversa-de-imagens', 'm05-lab-reversa': 'm13-mapas-e-imagens-busca-reversa-de-imagens',
    'm05-a-exif': 'm13-mapas-e-imagens-metadados', 'm05-lab-exif': 'm13-mapas-e-imagens-metadados', 'm05-a-deepfake': 'm14-geoint-imint',
    'm05-b-youtube': 'm13-redes-sociais-youtube', 'm05-lab-video': 'm13-redes-sociais-youtube', 'm05-d-mapas': 'm13-mapas-e-imagens-google-maps-e-google-earth',
    'm05-lab-coord': 'm13-mapas-e-imagens-google-maps-e-google-earth', 'm05-d-cameras': 'm13-mapas-e-imagens', 'm05-d-enderecos': 'm13-mapas-e-imagens',
    'm05-c-numero': 'm12-qualidade-e-etica', 'm05-a-ferramentas': 'm13-mapas-e-imagens',
    'm06-b-pessoas': 'm13-registros-publicos-br', 'm06-c-cnpj': 'm13-registros-publicos-br-empresas', 'm06-e-portal': 'm13-registros-publicos-br-governo-contratos-e-gastos',
    'm06-e-lai': 'm13-registros-publicos-br-lei-de-acesso-a-informacao', 'm06-b-candidato': 'm13-registros-publicos-br-eleicoes',
    'm06-d-veiculos': 'm12-qualidade-e-etica', 'm06-lab-placa': 'm12-qualidade-e-etica', 'm06-a-databrokers': 'm13-registros-publicos-br',
    'm06-b-cpf': 'm12-qualidade-e-etica', 'm06-lab-vinculos': 'm12-analise-estruturada',
    'm07-a-rastreamento': 'm11-b-t6', 'm07-lab-endereco': 'm11-b-t6', 'm07-lab-kit': 'm11-b-t1', 'm07-b-camadas': 'm11-a-zonas', 'm07-b-ambiente': 'm11-a-zonas',
    'm07-b-tor': 'm11-b-t1', 'm07-b-crime': 'm11-b-t4', 'm07-lab-dominio': 'm02-b-operadores',
    'm08-a-indexadoras': 'm16-ferramentas', 'm08-lab-mapa': 'm09-visao', 'm08-a-checagem': 'm16-ferramentas',
    'm09-c-email': 'm09-c-fluxos', 'm09-c-username': 'm09-c-fluxos', 'm09-c-nome': 'm09-c-fluxos', 'm09-c-telefone': 'm09-c-fluxos',
    'm09-c-dominio': 'm09-c-fluxos', 'm09-c-local': 'm09-c-fluxos', 'm10-c-adaptar': 'm10-c-adaptar',
}


def slug(s: str) -> str:
    import unicodedata
    s = unicodedata.normalize('NFKD', s).encode('ascii', 'ignore').decode().lower()
    return re.sub(r'[^a-z0-9]+', '-', s).strip('-')


def doc_id(path: str) -> str:
    p = Path(path)
    if p.name == 'README.md':
        parent = p.parent.name
        if parent.startswith('0') and '-' in parent:
            return 'lab-' + parent.split('-')[0]
        return {'labs': 'labs-visao', 'templates': 'tpl-visao', 'plataformas': 'visao', 'recursos': 'visao'}.get(parent, slug(parent))
    if p.parent.name == 'templates':
        return 'tpl-' + p.stem
    return p.stem


DOCMAP: dict[str, str] = {}
for mid, M in MD_MODS.items():
    for d in M['docs']:
        DOCMAP[str((ROOT / d[0]).resolve())] = f'{mid}-{doc_id(d[0])}'
DOCMAP[str((ROOT / 'recursos/lista-completa.md').resolve())] = 'm16-lista-completa'
DOCMAP[str((ROOT / 'README.md').resolve())] = 'inicio'


# ---------------------------------------------------------------- markdown → html
def inline(t: str, base: Path) -> str:
    codes = []
    t = re.sub(r'`([^`]+)`', lambda m: codes.append(m.group(1)) or f'\x00{len(codes) - 1}\x00', t)
    raw = re.findall(r'<[^>]+>', t)
    t = re.sub(r'<[^>]+>', '\x01', t)
    t = E(t).replace('&quot;', '"')
    for r in raw:
        t = t.replace('\x01', r, 1)

    def link(m):
        img, txt, url = m.group(1), m.group(2), m.group(3).strip()
        href = resolve(url, base)
        if img:
            src = url if url.startswith('http') else 'assets/' + Path(url).name
            return f'<img src="{E(src)}" alt="{txt}">'
        return f'<a href="{E(href)}">{txt}</a>'
    t = re.sub(r'(!?)\[([^\]]*)\]\(([^)]+)\)', link, t)
    t = re.sub(r'\*\*(.+?)\*\*', r'<b>\1</b>', t)
    t = re.sub(r'(?<![\w*])\*(?!\s)(.+?)(?<!\s)\*(?![\w*])', r'<i>\1</i>', t)
    t = re.sub(r'(?<![\w])_(?!\s)([^_]+?)(?<!\s)_(?![\w])', r'<i>\1</i>', t)
    t = re.sub(r'\x00(\d+)\x00', lambda m: '<code>' + E(codes[int(m.group(1))]) + '</code>', t)
    return t


def resolve(url: str, base: Path) -> str:
    if re.match(r'^(https?:|mailto:)', url):
        return url
    path, _, frag = url.partition('#')
    if not path:
        return '#' + (CUR_DOC + ('-' + frag if CUR_SPLIT and frag in CUR_SPLIT else '') if CUR_DOC else frag)
    target = (base / path).resolve()
    if str(target) in DOCMAP:
        return '#' + DOCMAP[str(target)]
    rel = os.path.relpath(target, ROOT).replace(os.sep, '/')
    return REPO + rel.replace(' ', '%20') + (('#' + frag) if frag else '')


CUR_DOC = ''
CUR_SPLIT: set[str] = set()


def md_blocks(lines: list[str], base: Path, code_prefix: str) -> str:
    out, i, para, ncode = [], 0, [], 0

    def flush():
        nonlocal para
        if para:
            out.append('<p>' + inline(' '.join(para), base) + '</p>')
            para = []

    while i < len(lines):
        ln = lines[i]
        s = ln.strip()
        if s.startswith('```'):
            flush()
            lang = s[3:].strip()
            body = []
            i += 1
            while i < len(lines) and not lines[i].strip().startswith('```'):
                body.append(lines[i])
                i += 1
            i += 1
            txt = '\n'.join(body)
            if lang == 'mermaid':
                out.append(f'<pre class="mermaid">{E(txt)}</pre>')
            else:
                ncode += 1
                cid = f'{code_prefix}-c{ncode}'
                out.append(f'<pre id="{cid}"><button class="btn copy" data-copy="{cid}">Copiar</button>{E(txt)}</pre>')
            continue
        if not s:
            flush(); i += 1; continue
        m = re.match(r'^(#{2,5})\s+(.*)', s)
        if m:
            flush()
            lvl = min(len(m.group(1)) + 1, 6)
            out.append(f'<h{lvl}>{inline(m.group(2), base)}</h{lvl}>')
            i += 1; continue
        if s.startswith('|'):
            flush()
            rows = []
            while i < len(lines) and lines[i].strip().startswith('|'):
                rows.append([c.strip() for c in lines[i].strip().strip('|').split('|')])
                i += 1
            head, body = rows[0], [r for r in rows[1:] if not all(re.match(r'^:?-+:?$', c) for c in r)]
            out.append('<table><tr>' + ''.join(f'<th>{inline(c, base)}</th>' for c in head) + '</tr>' +
                       ''.join('<tr>' + ''.join(f'<td>{inline(c, base)}</td>' for c in r) + '</tr>' for r in body) + '</table>')
            continue
        if s.startswith('>'):
            flush()
            q = []
            while i < len(lines) and lines[i].strip().startswith('>'):
                q.append(lines[i].strip()[1:].strip())
                i += 1
            out.append('<div class="call note">' + inline(' '.join(q), base) + '</div>')
            continue
        if re.match(r'^\s*([-*]|\d+\.)\s+', ln):
            flush()
            items = []
            while i < len(lines) and (re.match(r'^\s*([-*]|\d+\.)\s+', lines[i]) or (lines[i].startswith('  ') and lines[i].strip() and items)):
                mm = re.match(r'^(\s*)([-*]|\d+\.)\s+(.*)', lines[i])
                if mm:
                    items.append([len(mm.group(1)), mm.group(2)[0].isdigit(), mm.group(3)])
                else:
                    items[-1][2] += ' ' + lines[i].strip()
                i += 1
            out.append(render_list(items, base))
            continue
        if s.startswith('<'):
            flush()
            out.append(s if not s.startswith('<p align') else re.sub(r'<p align="[^"]*">', '<p>', s))
            i += 1; continue
        para.append(s)
        i += 1
    flush()
    return '\n'.join(out)


def render_list(items, base):
    html_, stack = '', []
    for ind, ordered, txt in items:
        lvl = ind // 2
        while len(stack) > lvl + 1:
            html_ += '</li></' + stack.pop() + '>'
        if len(stack) < lvl + 1:
            tag = 'ol' if ordered else 'ul'
            stack.append(tag)
            html_ += f'<{tag}>'
        else:
            html_ += '</li>'
        cb = re.match(r'^\[( |x)\]\s+(.*)', txt)
        if cb:
            txt = ('☑ ' if cb.group(1) == 'x' else '☐ ') + cb.group(2)
        html_ += '<li>' + inline(txt, base)
    while stack:
        html_ += '</li></' + stack.pop() + '>'
    return html_


def md_sections(path: str, group: str, split: bool, num: str) -> list[str]:
    global CUR_DOC, CUR_SPLIT
    fp = ROOT / path
    lines = fp.read_text(encoding='utf-8').splitlines()
    did = doc_id(path)
    title = ''
    body = []
    for ln in lines:
        if not title and ln.startswith('# '):
            title = ln[2:].strip()
            continue
        if re.match(r'^\[←', ln.strip()) or re.match(r'^\[[^\]]+\]\([^)]+\)\s*·', ln.strip()):
            continue
        body.append(ln)
    CUR_DOC = did
    parts = [('', title, [])]
    if split:
        for ln in body:
            m = re.match(r'^##\s+(.*)', ln)
            if m and not m.group(1).lower().startswith(('método comum', 'operadores', 'regras comuns', 'estrutura')):
                parts.append((slug(m.group(1)), m.group(1).strip(), []))
                continue
            parts[-1][2].append(ln)
        CUR_SPLIT = {p[0] for p in parts if p[0]}
    else:
        parts[0][2].extend(body)
        CUR_SPLIT = set()
    secs = []
    for k, (sub, t, ls) in enumerate(parts):
        sid = did + ('-' + sub if sub else '')
        h = t if not sub else t
        n = num if not sub else f'{num}.{k}'
        secs.append(f'<section class="sec" id="{sid}" data-group="{E(group)}"><h2><span class="num">{n}</span> {inline(h, fp.parent)}</h2>\n'
                    f'{md_blocks(ls, fp.parent, sid)}\n'
                    f'<p class="progtxt">Fonte no repositório: <a href="{REPO}{path.replace(" ", "%20")}">{E(path)}</a></p></section>')
    return secs


def md_module(mid: str, M: dict) -> str:
    secs = []
    for k, d in enumerate(M['docs']):
        secs += md_sections(d[0], d[1], len(d) > 2 and d[2] == 'split', f'{k:02d}')
    if mid == 'm16':
        secs.append('<section class="sec" id="lista-completa" data-group="C · Lista completa"><h2><span class="num">LC</span> Lista completa de fontes</h2>'
                    '<p class="lead">Todas as fontes públicas da base, uma linha por fonte e separadas por categoria, estão na <a href="#biblia">Bíblia de fontes</a> '
                    '(com filtro, status e o botão “Como usar”) e no arquivo '
                    f'<a href="{REPO}recursos/lista-completa.md">recursos/lista-completa.md</a>. A base inteira em JSON: '
                    f'<a href="{REPO}recursos/fontes.json">recursos/fontes.json</a>.</p>'
                    '<div class="call note"><b>OSINT Framework</b>Base sob licença MIT, Copyright (c) 2017 Justin Nordine. '
                    'Categorias voltadas a localizar ou identificar pessoas ficam fora da lista pública.</div></section>')
    hero = (f'<header class="hero" id="topo"><div class="pill" style="display:inline-block;margin-bottom:10px">OSINT · da fonte à evidência</div>'
            f'<h1>{E(M["title"])}</h1><p>{E(M["lead"])}</p></header>')
    return hero + '\n'.join(secs)


# ---------------------------------------------------------------- helpers do hub
def prefix(frag: str, P: str) -> str:
    frag = re.sub(r'\bid="([^"]+)"', lambda m: f'id="{P}{m.group(1)}"', frag)

    def href(m):
        t = m.group(1)
        if re.match(r'^m\d\d($|-)', t) or t in VIEWS:
            return m.group(0)
        return f'href="#{P}{t}"'
    frag = re.sub(r'href="#([^"]*)"', href, frag)
    for a in ('data-copy', 'data-clear', 'data-copy-form'):
        frag = re.sub(r'\b' + a + r'="([^"]+)"', lambda m, a=a: f'{a}="{P}{m.group(1)}"', frag)
    return frag


def bible(frag: str, n: str) -> list[dict]:
    soup = BeautifulSoup(frag, 'html.parser')
    out = []
    for sec in soup.select('section.sec'):
        h2 = sec.find('h2')
        stitle = re.sub(r'^\s*\S+\s+', '', h2.get_text(' ', strip=True)) if h2 else ''
        for a in sec.find_all('a', href=True):
            u = a['href']
            if not u.startswith('http') or u.startswith(REPO):
                continue
            t = a.get_text(' ', strip=True) or u
            tool = a.find_parent(class_='tool')
            d, g = '', ''
            if tool and a.get('class') == ['t']:
                p = tool.find('p')
                d = p.get_text(' ', strip=True)[:220] if p else ''
                tg = tool.find(class_=['lin', 'off', 'pago']) or tool.find(class_='tag')
                g = tg.get_text(' ', strip=True) if tg else ''
            e = dict(m=n, u=u, t=t, d=d, s=stitle, a=sec.get('id'), g=g)
            hh = a.find_previous(['h3', 'h4'])
            ctx = hh.get_text(' ', strip=True) if hh and hh.find_parent('section') is sec else ''
            if ctx and ctx != stitle:
                e['p'] = ctx[:90]
            if tool and tool.get('data-gk'):
                e['k'] = tool['data-gk']
            out.append(e)
    return out


def remap(frag: str) -> str:
    def one(m):
        old, txt = m.group(1), m.group(2)
        if old in REMAP and REMAP[old] != old:
            return f'<a href="#{REMAP[old]}" data-rt="1">{txt}</a>'
        return m.group(0)
    return re.sub(r'<a href="#(m\d\d-[a-z0-9-]+)">(.*?)</a>', one, frag)


def retitle(mods: list) -> None:
    titles = {}
    for M in mods:
        for sid, h in re.findall(r'<section class="sec" id="([^"]+)"[^>]*>\s*<h2><span class="num">[^<]*</span>\s*(.*?)</h2>', M['html'], re.S):
            titles[sid] = re.sub(r'<[^>]+>', '', h).strip()
    for M in mods:
        M['html'] = re.sub(r'<a href="#([^"]+)" data-rt="1">(.*?)</a>',
                           lambda m: f'<a href="#{m.group(1)}">{E(titles.get(m.group(1), re.sub("<[^>]+>", "", m.group(2))))}</a>', M['html'])


NAV_FIX = [("['roteiros','Roteiros de investigação']", "['roteiros','Roteiros de verificação']"), ("['biblia','Bíblias']", "['biblia','Bíblia de fontes']"),
           (",['livro','Livro (esqueleto)']", ''), ("['treinamento','Treinamento (esqueleto)']", "['treinamento','Trilha de estudo']"),
           ("const modOf=id=>{const m=String(id).match(/^m(\\d\\d)/);return m?'M'+m[1]:''};",
            "const modOf=id=>{const m=String(id).match(/^(m\\d\\d)/);const M=m&&window.MODS.find(x=>x.id===m[1]);return M?'M'+M.n:''};")]


def nav_fix(js: str) -> str:
    for a, b in NAV_FIX:
        js = js.replace(a, b)
    return js


def remap_js(js: str) -> str:
    return re.sub(r"'(m\d\d-[a-z0-9-]+)'", lambda m: "'" + REMAP.get(m.group(1), m.group(1)) + "'", js)


def patch_plus(js: str) -> str:
    """Central de pivôs da edição pública: sem pivôs a partir de dados de pessoas."""
    block = ("const BLOCKT={cpf:1,phone:1,email:1,user:1,placa:1,imei:1,numid:1};"
             "function groupsFor(o){if(BLOCKT[o.type])return[{t:'Fora do escopo desta edição pública',"
             "note:'Este site não monta consultas a partir de dados de pessoas (CPF, telefone, e-mail, username, placa, IMEI ou IDs de conta). "
             "Para verificar publicações, use os guias por plataforma; para empresas e órgãos, o guia de registros públicos.',"
             "learn:['m13-redes-sociais','m13-registros-publicos-br','m12-qualidade-e-etica'],items:[]}];")
    js = js.replace('function groupsFor(o){', block, 1)
    js = js.replace('const it=ITF[o.type];', 'const it=BLOCKT[o.type]?null:ITF[o.type];')
    js = js.replace('concat(MAPOF[o.type]?', 'concat(false?')
    js = re.sub(r"\n \{t:'Redes e documentos',learn:\['m02-b-pessoas','m04-b-linkedin'\],items:\[.*?\]\},", '', js)
    js = js.replace("if(soc){const un=soc[2](p)||'';out.push({t:'Perfil de '+soc[1],learn:['m04-a-idplat','m04-lab-idsrc','m04-c-preserv'],next:un?[['Username: '+un,'@'+un]]:[],note:'Ache o ID no código-fonte e preserve antes de analisar.',",
                    "if(soc){out.push({t:'Publicação ou perfil em '+soc[1],learn:['m13-redes-sociais','m01-preservacao'],next:[],note:'Preserve antes de analisar e confirme a conta por uma fonte externa à rede.',")
    js = re.sub(r'<a href="#" data-pvx="contato@exemplo\.com\.br">contato@exemplo\.com\.br</a> · ', '', js)
    js = re.sub(r'<a href="#" data-pvx="@nasa">@nasa</a> · ', '', js)
    js = re.sub(r'<a href="#" data-pvx="\(61\) 3411-1111">\(61\) 3411-1111</a> · ', '', js)
    js = js.replace('SHA-256 é o padrão de custódia do curso.', 'SHA-256 é o padrão de custódia deste método.')
    js = js.replace("{t:'Procedimento: mapa mental do curso'", "{t:'Procedimento'")
    return js


FIX_ANCHORS = r"""
(function(){const V=new Set(%s);const ok=h=>!h||V.has(h)||/^m\d\d$/.test(h)||document.getElementById(h);
function fix(root){(root||document).querySelectorAll('a[href^="#"]').forEach(a=>{const h=a.getAttribute('href').slice(1);if(ok(h))return;const s=document.createElement('span');s.textContent=a.textContent;a.replaceWith(s)})}
const mo=new MutationObserver(ms=>ms.forEach(m=>m.addedNodes.forEach(n=>{if(n.nodeType===1)fix(n)})));
document.addEventListener('DOMContentLoaded',()=>{fix();mo.observe(document.body,{childList:true,subtree:true})});if(document.readyState!=='loading'){fix();mo.observe(document.body,{childList:true,subtree:true})}
if(window.mermaid===undefined&&document.querySelector('pre.mermaid')){const s=document.createElement('script');s.type='module';s.textContent="import m from 'https://cdn.jsdelivr.net/npm/mermaid@11/dist/mermaid.esm.min.mjs';m.initialize({startOnLoad:false,theme:document.documentElement.classList.contains('light')?'default':'dark'});const run=()=>m.run({querySelector:'.view.on pre.mermaid:not([data-processed])'});run();addEventListener('hashchange',()=>setTimeout(run,50));";document.head.appendChild(s)}
})();
""" % json.dumps(list(VIEWS))


def build():
    A = SITE / 'assets'
    mods = []
    for mid in ORDER:
        if mid in MD_MODS:
            M = MD_MODS[mid]
            frag = md_module(mid, M)
            data = f"window.D={{key:'os{mid}:',skip:[],doneMsg:'{M['short']} concluído',ebookNames:{{}},missions:[],Q:[],G:[]}};"
            mods.append(dict(id=mid, title=M['title'], short=M['short'], sub=M['sub'], frag=frag, data=data, extra=''))
        else:
            M = HTML_MODS[mid]
            fp = SITE / 'modulos' / M['frag']
            if not fp.exists():
                print('aviso: falta', fp, '— módulo pulado nesta passada')
                continue
            frag = fp.read_text(encoding='utf-8')
            mods.append(dict(id=mid, title=M['title'], short=M['short'], sub=M['sub'], frag=frag,
                             data=(SITE / 'modulos' / M['data']).read_text(encoding='utf-8'),
                             extra=(SITE / 'modulos' / M['extra']).read_text(encoding='utf-8') if M['extra'] else ''))
    BIB, seen = [], set()
    for k, M in enumerate(mods, 1):
        M['n'] = f'{k:02d}'
        M['html'] = remap(prefix(M['frag'], M['id'] + '-'))
        for e in bible(M['html'], M['n']):
            key = (e['m'], re.sub(r'^https?://(www\.)?', '', e['u']).rstrip('/').lower())
            if key not in seen:
                seen.add(key); BIB.append(e)
    retitle(mods)
    fontes = json.loads((ROOT / 'recursos/fontes.json').read_text(encoding='utf-8'))
    stx = {'down': 'fora do ar segundo o OSINT Framework', 'defunct': 'fora do ar segundo o OSINT Framework', 'degraded': 'instável', 'live': ''}
    ja = {re.sub(r'^https?://(www\.)?', '', e['u']).rstrip('/').lower() for e in BIB}
    for f in fontes:
        if not f['publico'] or re.sub(r'^https?://(www\.)?', '', f['url']).rstrip('/').lower() in ja:
            continue
        e = dict(m='Fontes', u=f['url'], t=f['nome'], d=(f['descricao'] or '')[:220], s=f['categoria'], a='m16-lista-completa',
                 g=stx.get(f['status'], '') or ('pago' if f['custo'] == 'paid' else ''))
        if f['subcategoria']:
            e['p'] = f['subcategoria'][:90]
        BIB.append(e)

    css = (A / 'hub.css').read_text() + (A / 'hub_plus.css').read_text() + (A / 'guia.css').read_text() + (A / 'site.css').read_text()
    tpl = (A / 'shell.html').read_text(encoding='utf-8')
    mods_html = ''.join(f'<div class="view mod" id="view-{M["id"]}" data-mod="{M["id"]}">\n{M["html"]}\n</div>\n' for M in mods)
    js = 'window.MODS=[];\n'
    for M in mods:
        d = M['data'].strip().replace('window.D=', 'var __D=', 1)
        js += ('(function(){' + d + '\n__D.ebook={};\nwindow.MODS.push({id:"' + M['id'] + '",n:"' + M['n'] + '",title:' + json.dumps(M['title'], ensure_ascii=False) +
               ',short:' + json.dumps(M['short'], ensure_ascii=False) + ',sub:' + json.dumps(M['sub'], ensure_ascii=False) + ',D:__D});})();\n')
    js += (A / 'site_data.js').read_text(encoding='utf-8') + '\n'
    js += 'window.BIB=' + json.dumps(BIB, ensure_ascii=False) + ';\n'
    js += 'window.FAQALL=(window.FAQ_EXTRA||[]).map(f=>({q:f[0],a:f[1],m:f[2],l:f[3]}));\n'
    extras = ''.join(M['extra'] + '\n' for M in mods if M['extra'])
    engine = nav_fix((A / 'hub_engine.js').read_text(encoding='utf-8')).replace(
        'paint();route();', "document.getElementById('bookSub').textContent=window.BOOK.sub;document.getElementById('trainSub').textContent=window.TRAIN.sub;paint();route();")
    plus = nav_fix(remap_js(patch_plus((A / 'hub_plus.js').read_text(encoding='utf-8'))))
    page = (tpl.replace('/*CSS*/', css).replace('<!--MODS-->', mods_html)
            .replace('/*JS*/', js + extras).replace('/*ENGINE*/', engine)
            .replace('/*PLUS*/', (A / 'site_roteiros.js').read_text(encoding='utf-8') + '\n' + plus + '\n' + remap_js((A / 'guia.js').read_text(encoding='utf-8')) + '\n' + FIX_ANCHORS))
    OUT.mkdir(exist_ok=True)
    (OUT / 'index.html').write_text(page, encoding='utf-8')
    (OUT / 'assets').mkdir(exist_ok=True)
    shutil.copy(ROOT / 'assets/hero-osint.svg', OUT / 'assets/hero-osint.svg')
    (OUT / '.nojekyll').write_text('')
    print(f'_site/index.html · {len(page) // 1024} KB · {len(mods)} módulos · {len(BIB)} links na Bíblia')
    return mods


if __name__ == '__main__':
    build()
    if '--sem-atlas' not in sys.argv:
        r = subprocess.run([sys.executable, str(ROOT / 'tools/gen_atlas.py')], capture_output=True, text=True)
        print(r.stdout.strip() or r.stderr.strip())
        build()
