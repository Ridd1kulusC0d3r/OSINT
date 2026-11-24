#!/usr/bin/env python3
"""Gera site/modulos/m09.html (Atlas): mapa de cada módulo do site, OSINT Framework filtrável e fluxos de verificação.

Lê _site/index.html (primeira passada do build) para montar os mapas por módulo.
Chamado por tools/build_site.py; pode rodar sozinho depois de um build.
"""
from __future__ import annotations

import html
import json
import re
import subprocess
import sys
import unicodedata
from pathlib import Path

from bs4 import BeautifulSoup

ROOT = Path(__file__).resolve().parents[1]
sys.path.insert(0, str(ROOT / 'site/assets'))
from mmlib import render_map, render_tree, bar  # noqa: E402

E = lambda s: html.escape(str(s), quote=True)
OSF = ROOT / 'recursos/externos/osint-framework/arf.json'
PRIVADAS = {'Username', 'Email Address', 'People Search Engines', 'Dating', 'Telephone Numbers', 'Instant Messaging'}


def slug(s):
    s = unicodedata.normalize('NFKD', s).encode('ascii', 'ignore').decode().lower()
    return re.sub(r'[^a-z0-9]+', '-', s).strip('-')


# ---------- A · mapas por módulo ----------
page = (ROOT / '_site/index.html').read_text(encoding='utf-8') if (ROOT / '_site/index.html').exists() else ''
mods = re.findall(r'window\.MODS\.push\(\{id:"(m\d\d)",n:"(\d\d)",title:("[^"]*")', page)
soup = BeautifulSoup(page, 'html.parser') if page else None
SKIP = {'missoes', 'quiz', 'flash', 'lacunas'}
mod_sections, k = [], 0
for mid, n, title in mods:
    if mid == 'm09':
        continue
    title = json.loads(title)
    k += 1
    root = dict(t=f'MÓDULO {n} — {title}', kids=[])
    groups = {}
    for sec in soup.select(f'section.sec[id^="{mid}-"]'):
        sid = sec['id'][len(mid) + 1:]
        if sid in SKIP:
            continue
        g = sec.get('data-group', 'Outros')
        if g not in groups:
            groups[g] = dict(t=g, kids=[])
            root['kids'].append(groups[g])
        h2 = sec.find('h2')
        if not h2:
            continue
        num = h2.find(class_='num')
        numt = num.get_text(strip=True) if num else ''
        if num:
            num.extract()
        node = dict(t=(numt + ' · ' if numt else '') + h2.get_text(' ', strip=True), a=sec['id'], kids=[])
        tools = [a for a in sec.select('.tool a.t') if a.get('href', '').startswith('http')]
        if len(tools) > 30:
            node['kids'].append(dict(t=f'{len(tools)} ferramentas — abrir a seção', a=sec['id'], kids=[]))
        else:
            seen = set()
            for a in tools:
                if a['href'] not in seen:
                    seen.add(a['href'])
                    node['kids'].append(dict(t=a.get_text(' ', strip=True)[:90], u=a['href'], kids=[]))
        groups[g]['kids'].append(node)
    n_sec = sum(len(g['kids']) for g in root['kids'])
    mod_sections.append(
        f'<section class="sec" id="a-{mid}" data-group="A · Mapas por módulo">'
        f'<h2><span class="num">A{k}</span> Mapa do Módulo {n} — {E(title)}</h2>'
        f'<p class="lead">{n_sec} seções. Abra o módulo: <a href="#{mid}">Módulo {n}</a>.</p>'
        f'{bar(editor=False)}{render_tree("mod-" + mid, root)}</section>')

# ---------- C · fluxos de verificação (próprios) ----------
FLOWS = [
    ('c-fluxo-publicacao', 'C3', 'Fluxo: publicação viral', """
PUBLICAÇÃO VIRAL
  1 · Preservar antes de tudo :: a=m01-preservacao :: n=Captura com URL e relógio, arquivo público, hash.
  2 · Achar a versão original :: a=m13-redes-sociais
    Busca pelo texto entre aspas :: q=https://www.google.com/search?q=%22{x}%22
    Busca no X por período :: a=m13-redes-sociais-x-twitter
    Busca reversa da imagem :: a=m13-mapas-e-imagens-busca-reversa-de-imagens
  3 · Confirmar a conta :: a=m13-redes-sociais :: n=Vínculo a partir do site oficial da instituição.
  4 · Procurar checagens :: q=https://toolbox.google.com/factcheck/explorer/search/{x}
  5 · Separar reprodução de confirmação :: a=m15-lab-02
  6 · Graduar e relatar :: a=m01-validade
"""),
    ('c-fluxo-site', 'C4', 'Fluxo: site ou domínio suspeito', """
SITE OU DOMÍNIO
  1 · Ler a URL :: a=m02-b-operadores :: n=Domínio registrado, subdomínio, caminho, encurtador.
  2 · Consultar o registro
    Registro.br (.br) :: u=https://registro.br/
    ICANN Lookup (demais) :: q=https://lookup.icann.org/en/lookup?name={x}
  3 · Ver o passado :: a=m13-buscadores-e-arquivos-wayback-machine-internet-archive
    Wayback — capturas :: q=https://web.archive.org/web/*/{x}
  4 · Reputação :: q=https://www.virustotal.com/gui/domain/{x}
  5 · Central de pivôs :: a=central
  6 · Registrar e relatar :: a=m01-modelos
"""),
    ('c-fluxo-imagem', 'C5', 'Fluxo: imagem → local e data', """
IMAGEM
  1 · Preservar o original :: a=m01-preservacao
  2 · Descrever o que se vê :: a=m13-mapas-e-imagens
  3 · Busca reversa :: a=m13-mapas-e-imagens-busca-reversa-de-imagens
    Google Lens :: u=https://lens.google/
    TinEye (mais antiga) :: u=https://tineye.com/
  4 · Metadados (se for o original) :: a=m13-mapas-e-imagens-metadados
  5 · Propor e confirmar o local :: a=m13-mapas-e-imagens-google-maps-e-google-earth
    OpenStreetMap :: u=https://www.openstreetmap.org/
    Mapillary :: u=https://www.mapillary.com/
  6 · Testar a data :: a=m13-mapas-e-imagens-suncalc
  7 · Praticar :: a=m15-lab-06
"""),
    ('c-fluxo-empresa', 'C6', 'Fluxo: empresa em registros públicos', """
EMPRESA
  1 · Situação cadastral :: a=m13-registros-publicos-br-empresas
  2 · Sanções e contratos :: a=m13-registros-publicos-br-governo-contratos-e-gastos
    Portal da Transparência :: u=https://portaldatransparencia.gov.br/
    PNCP :: u=https://pncp.gov.br/
  3 · Diários oficiais :: q=https://queridodiario.ok.org.br/pesquisa?termo={x}
  4 · Processos públicos :: a=m13-registros-publicos-br-justica
  5 · Hipóteses e lacunas :: a=m15-tpl-matriz-de-hipoteses
"""),
]
flows_html = []
for sid, num, title, src in FLOWS:
    flows_html.append(f'<section class="sec" id="{sid}" data-group="C · Fluxos de verificação"><h2><span class="num">{num}</span> {E(title)}</h2>'
                      f'<p class="lead">Marque cada passo; o campo abaixo monta as consultas com o seu dado.</p>{bar(placeholder="cole o dado", editor=False)}{render_map(sid, src)}</section>')

# ---------- OSINT Framework (sem as categorias voltadas a pessoas) ----------
D = json.loads(OSF.read_text(encoding='utf-8'))
ST = {'live': '', 'degraded': '<span class="tag">instável</span>', 'down': '<span class="tag off">fora do ar segundo o OSINT Framework</span>',
      'defunct': '<span class="tag off">fora do ar segundo o OSINT Framework</span>', 'deprecated': '<span class="tag off">fora do ar segundo o OSINT Framework</span>'}
PR = {'paid': '<span class="tag pago">pago</span>', 'freemium': '<span class="tag">freemium</span>', 'free': ''}
n_tools = n_fold = 0


def tool_card(t):
    global n_tools
    n_tools += 1
    st = t.get('status') or ''
    if t.get('deprecated'):
        st = st if st in ('down', 'defunct') else 'down'
    tags = [ST.get(st, ''), PR.get(t.get('pricing') or '', '')]
    if (t.get('opsec') or '') == 'active':
        tags.append('<span class="tag" title="Faz requisições aos serviços pesquisados">toca o alvo</span>')
    io = f'<div class="bcm">Entrada: {E(t.get("input") or "—")} → Saída: {E(t.get("output") or "—")}</div>' if (t.get('input') or t.get('output')) else ''
    note = f'<div class="bcx">OPSEC: {E(t["opsecNote"])}</div>' if t.get('opsecNote') else ''
    attrs = (f'data-live="{1 if st in ("live", "") else 0}" data-free="{1 if (t.get("pricing") or "free") == "free" else 0}" '
             f'data-pass="{0 if (t.get("opsec") or "") == "active" else 1}" data-noreg="{0 if t.get("registration") or "(R)" in t["name"] else 1}" '
             f'data-web="{0 if t.get("localInstall") or "(T)" in t["name"] else 1}"')
    return (f'<div class="tool bc osf" {attrs}><a class="t" href="{E(t["url"])}">{E(t["name"])}</a> {"".join(x for x in tags if x)}'
            f'<p>{E(t.get("description") or "—")}</p>{io}{note}</div>')


def folder_html(f, path):
    global n_fold
    n_fold += 1
    urls = [c for c in f.get('children', []) if c.get('type') == 'url']
    subs = [c for c in f.get('children', []) if c.get('type') != 'url']
    out = f'<h4 class="osfh">{E(" › ".join(path))}</h4><div class="bcgrid">' + ''.join(tool_card(t) for t in urls) + '</div>' if urls else ''
    for s in subs:
        out += folder_html(s, path + [s['name']])
    return out


cats, osf_html = [], []
for i, c in enumerate(D['children']):
    if c['name'] in PRIVADAS:
        continue
    before = n_tools
    body = folder_html(c, [c['name']])
    cats.append((i, c['name'], n_tools - before))
    osf_html.append(f'<details class="bccat osfcat" id="osf-{slug(c["name"])}" data-cat="{i}"><summary>{E(c["name"])} <span class="tag">{n_tools - before}</span></summary><div class="body">{body}</div></details>')

tpl = (ROOT / 'site/modulos/m09_text.html').read_text(encoding='utf-8')
out = (tpl.replace('{{MODMAPS}}', '\n'.join(mod_sections)).replace('{{FLOWS}}', '\n'.join(flows_html)).replace('{{OSF}}', ''.join(osf_html))
       .replace('{{OSFCATS}}', ''.join(f'<option value="{i}">{E(n)} ({k})</option>' for i, n, k in cats))
       .replace('{{NOSF}}', str(n_tools)).replace('{{NOSFF}}', str(n_fold)).replace('{{NCATS}}', str(len(cats))).replace('{{NMAPS}}', str(len(mod_sections))))
assert '{{' not in out, re.findall(r'\{\{\w+\}\}', out)
(ROOT / 'site/modulos/m09.html').write_text(out, encoding='utf-8')
print(f'atlas: {len(mod_sections)} mapas de módulo · {n_tools} ferramentas do OSINT Framework em {len(cats)} categorias · {len(FLOWS)} fluxos')
