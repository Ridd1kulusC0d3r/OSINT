#!/usr/bin/env python3
"""Monta a base única de fontes do repositório (só biblioteca padrão).

Entradas:
  recursos/externos/osint-framework/arf.json   OSINT Framework (MIT, Justin Nordine)
  recursos/catalogo.csv                         catálogo editorial do repositório
  site/dados/profundezas.json                   leituras do mapa de estudos da Dark Web
  FONTES_GUIAS (abaixo)                         fontes oficiais dos guias por plataforma
  IT (abaixo)                                   ferramentas de busca da IntelTechniques

Saídas:
  recursos/fontes.json          todas as fontes, com categoria, metadados e a marca `publico`
  recursos/lista-completa.md    uma linha por fonte pública, agrupada por categoria

Uso: python3 tools/build_fontes.py
"""
from __future__ import annotations

import csv
import json
import re
from collections import OrderedDict
from datetime import date
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
HOJE = date.today().isoformat()

PT = {
    'Username': 'Nome de usuário', 'Email Address': 'E-mail', 'Domain Name': 'Domínios',
    'Cloud Infrastructure': 'Infraestrutura em nuvem', 'IP & MAC Address': 'IP e endereço MAC',
    'Images / Videos / Docs': 'Imagens, vídeos e documentos', 'Social Networks': 'Redes sociais',
    'Instant Messaging': 'Mensageria', 'People Search Engines': 'Buscadores de pessoas', 'Dating': 'Relacionamento',
    'Telephone Numbers': 'Telefones', 'Public Records': 'Registros públicos', 'Compliance & Risk Intelligence': 'Compliance e risco',
    'Business Records': 'Registros empresariais', 'Transportation': 'Transportes', 'Geolocation Tools / Maps': 'Geolocalização e mapas',
    'Search Engines': 'Buscadores', 'Online Communities': 'Comunidades on-line', 'Archives': 'Arquivos da web',
    'Language Translation': 'Tradução', 'Mobile OSINT': 'OSINT em dispositivos móveis', 'Dark Web': 'Dark Web',
    'Disinformation & Media Verification': 'Desinformação e verificação de mídia', 'Blockchain & Cryptocurrency': 'Blockchain e criptoativos',
    'Classifieds': 'Classificados', 'Encoding / Decoding': 'Codificação e decodificação', 'Tools': 'Ferramentas gerais',
    'AI Tools': 'Ferramentas de IA', 'Malicious File Analysis': 'Análise de arquivos maliciosos', 'Cyber Threat Intelligence': 'Inteligência de ameaças (CTI)',
    'OpSec': 'OPSEC', 'Documentation / Evidence Capture': 'Documentação e captura de evidências', 'Training': 'Treinamento',
}
# Categorias centradas em localizar ou identificar pessoas: ficam fora da lista pública (política editorial),
# mas permanecem na base completa com publico=false.
PRIVADAS = {'Username', 'Email Address', 'People Search Engines', 'Dating', 'Telephone Numbers', 'Instant Messaging'}

FONTES_GUIAS = {
    'Guia · Redes sociais': [
        ('Instagram', 'https://www.instagram.com/', 'Fotos e vídeos de contas públicas; “Sobre esta conta” mostra histórico básico.'),
        ('X — busca avançada', 'https://x.com/search-advanced', 'Operadores from:, since:, until: e filtros de mídia e idioma.'),
        ('Biblioteca de Anúncios da Meta', 'https://www.facebook.com/ads/library/', 'Anúncios ativos e, em temas sociais e políticos, histórico e investimento.'),
        ('TikTok', 'https://www.tiktok.com/', 'Vídeos públicos; a página do som ajuda a achar a versão mais antiga.'),
        ('LinkedIn', 'https://www.linkedin.com/', 'Vínculo profissional público e páginas de empresas.'),
        ('YouTube', 'https://www.youtube.com/', 'Data exata de publicação, transcrição e capítulos.'),
        ('Reddit', 'https://www.reddit.com/', 'Discussões públicas por comunidade.'),
        ('Telegram — canais públicos', 'https://t.me/', 'Canais públicos legíveis no navegador em t.me/s/nome.'),
        ('Discord', 'https://discord.com/', 'Comunidades públicas com busca por mensagem e data.'),
        ('Kwai', 'https://www.kwai.com/', 'Vídeos curtos com grande alcance no Brasil.'),
    ],
    'Guia · Buscadores e arquivos': [
        ('Google', 'https://www.google.com/', 'Cobertura ampla; filtro de período em Ferramentas.'),
        ('Bing', 'https://www.bing.com/', 'Segundo índice; inbody:, contains:, busca visual.'),
        ('DuckDuckGo', 'https://duckduckgo.com/', 'Resultados sem personalização.'),
        ('Yandex', 'https://yandex.com/', 'Idiomas do Leste Europeu e imagens de lugares.'),
        ('Brave Search', 'https://search.brave.com/', 'Índice próprio.'),
        ('Mojeek', 'https://www.mojeek.com/', 'Índice próprio e independente.'),
        ('Wayback Machine', 'https://web.archive.org/', 'Versões anteriores e Save Page Now.'),
        ('archive.today', 'https://archive.ph/', 'Preserva página com captura de tela e texto.'),
        ('Memento Time Travel', 'https://timetravel.mementoweb.org/', 'Vários arquivos da web de uma vez.'),
        ('Google Fact Check Explorer', 'https://toolbox.google.com/factcheck/explorer', 'Checagens de agências de vários países.'),
        ('Agência Lupa', 'https://lupa.uol.com.br/', 'Agência brasileira de checagem.'),
        ('Aos Fatos', 'https://www.aosfatos.org/', 'Agência brasileira de checagem.'),
        ('Projeto Comprova', 'https://projetocomprova.com.br/', 'Coalizão de veículos para verificação.'),
    ],
    'Guia · Mapas e imagens': [
        ('Google Lens', 'https://lens.google/', 'Busca reversa de objetos e lugares.'),
        ('Bing Visual Search', 'https://www.bing.com/visualsearch', 'Busca reversa, segunda opinião.'),
        ('Yandex Imagens', 'https://yandex.com/images/', 'Paisagens e lugares.'),
        ('TinEye', 'https://tineye.com/', 'Cópia mais antiga de uma imagem.'),
        ('ExifTool', 'https://exiftool.org/', 'Leitura local de metadados.'),
        ('Google Maps', 'https://www.google.com/maps', 'Street View com data de captura.'),
        ('Google Earth', 'https://earth.google.com/', 'Imagens históricas e 3D.'),
        ('OpenStreetMap', 'https://www.openstreetmap.org/', 'Mapa colaborativo.'),
        ('Overpass Turbo', 'https://overpass-turbo.eu/', 'Consulta por combinação de elementos do mapa.'),
        ('Mapillary', 'https://www.mapillary.com/', 'Imagens de rua da comunidade.'),
        ('Copernicus Browser', 'https://browser.dataspace.copernicus.eu/', 'Imagens Sentinel gratuitas.'),
        ('NASA Worldview', 'https://worldview.earthdata.nasa.gov/', 'Visão diária do planeta.'),
        ('SunCalc', 'https://www.suncalc.org/', 'Posição do sol e sombra por hora e local.'),
    ],
    'Guia · Registros públicos BR': [
        ('Receita Federal — situação cadastral do CNPJ', 'https://solucoes.receita.fazenda.gov.br/Servicos/cnpjreva/Cnpjreva_Solicitacao.asp', 'Comprovante oficial de inscrição e situação.'),
        ('Dados abertos do CNPJ', 'https://dados.gov.br/dados/conjuntos-dados/cadastro-nacional-da-pessoa-juridica---cnpj', 'Base completa de empresas e sócios.'),
        ('CVM', 'https://www.gov.br/cvm/pt-br', 'Companhias abertas e fatos relevantes.'),
        ('INPI — busca de marcas e patentes', 'https://busca.inpi.gov.br/pePI/', 'Titular e situação de marcas.'),
        ('Portal da Transparência (CGU)', 'https://portaldatransparencia.gov.br/', 'Despesas, contratos, sanções.'),
        ('PNCP', 'https://pncp.gov.br/', 'Editais e contratos de todos os entes.'),
        ('Diário Oficial da União', 'https://www.in.gov.br/', 'Atos do governo federal.'),
        ('Querido Diário', 'https://queridodiario.ok.org.br/', 'Diários oficiais municipais.'),
        ('dados.gov.br', 'https://dados.gov.br/', 'Portal federal de dados abertos.'),
        ('DivulgaCandContas (TSE)', 'https://divulgacandcontas.tse.jus.br/', 'Candidaturas, bens e contas de campanha.'),
        ('Dados abertos do TSE', 'https://dadosabertos.tse.jus.br/', 'Resultados e prestações de contas.'),
        ('Jurisprudência do STF', 'https://portal.stf.jus.br/', 'Decisões do Supremo.'),
        ('Jurisprudência do STJ', 'https://scon.stj.jus.br/', 'Decisões do STJ.'),
        ('Registro.br', 'https://registro.br/', 'Titular e datas de domínios .br.'),
        ('ICANN Lookup', 'https://lookup.icann.org/', 'RDAP de domínios genéricos.'),
        ('Fala.BR', 'https://falabr.cgu.gov.br/', 'Pedidos pela Lei de Acesso à Informação.'),
    ],
}
IT = ['Search', 'Facebook', 'Twitter', 'Instagram', 'Linkedin', 'Communities', 'Email', 'Username', 'Name', 'Address',
      'Telephone', 'Location', 'Documents', 'Pastes', 'Images', 'Videos', 'Domain', 'IP', 'Business', 'Vehicle',
      'Currencies', 'Breaches', 'Radio', 'Video', 'API']
IT_PUBLICO = {'Search', 'Communities', 'Location', 'Documents', 'Images', 'Videos', 'Domain', 'IP', 'Business', 'Currencies', 'Radio', 'Video', 'API'}
TIPOS_DW = {'P': 'Paper', 'L': 'Livro', 'R': 'Relatório', 'S': 'Survey', 'B': 'Benchmark', 'D': 'Dataset', 'T': 'Ferramenta',
            'F': 'Fonte brasileira', 'C': 'Caso', 'K': 'Framework', 'V': 'Vídeo', 'J': 'Norma'}


def slug(s: str) -> str:
    s = re.sub(r'[^\w]+', '-', s.lower(), flags=re.UNICODE).strip('-')
    return s[:60]


def osf_rows():
    data = json.loads((ROOT / 'recursos/externos/osint-framework/arf.json').read_text(encoding='utf-8'))
    for cat in data['children']:
        def walk(node, path):
            for c in node.get('children', []):
                if c.get('type') == 'url':
                    st = c.get('status') or 'live'
                    if c.get('deprecated') and st not in ('down', 'defunct'):
                        st = 'down'
                    yield dict(nome=c['name'], url=c['url'], categoria=PT.get(cat['name'], cat['name']),
                               subcategoria=' › '.join(path[1:]), origem='OSINT Framework (MIT)',
                               descricao=c.get('description') or '', status=st, custo=c.get('pricing') or 'free',
                               cadastro='sim' if (c.get('registration') or '(R)' in c['name']) else 'não',
                               instalacao='sim' if (c.get('localInstall') or '(T)' in c['name']) else 'não',
                               opsec='toca o alvo' if c.get('opsec') == 'active' else 'passiva',
                               entrada=c.get('input') or '', saida=c.get('output') or '',
                               publico=cat['name'] not in PRIVADAS)
                else:
                    yield from walk(c, path + [c['name']])
        yield from walk(cat, [cat['name']])


def guia_rows():
    for cat, itens in FONTES_GUIAS.items():
        for nome, url, desc in itens:
            yield dict(nome=nome, url=url, categoria=cat, subcategoria='', origem='Guias por plataforma (DEIVOSINT)',
                       descricao=desc, status='live', custo='free', cadastro='', instalacao='', opsec='passiva',
                       entrada='', saida='', publico=True)


def catalogo_rows():
    with (ROOT / 'recursos/catalogo.csv').open(encoding='utf-8') as f:
        for r in csv.DictReader(f):
            yield dict(nome=r['nome'], url=r['url'], categoria='Referências do repositório', subcategoria=r['categoria'],
                       origem=r['origem'], descricao=r['valor'] + (f' Limitação: {r["limitacao"]}' if r['limitacao'] else ''),
                       status='live', custo='free', cadastro='', instalacao='', opsec='passiva', entrada='', saida='', publico=True)


def it_rows():
    for p in IT:
        yield dict(nome=f'IntelTechniques — {p}', url=f'https://inteltechniques.com/tools/{p}.html', categoria='IntelTechniques',
                   subcategoria='', origem='IntelTechniques (Michael Bazzell)', descricao='Página de buscas que monta as consultas no navegador.',
                   status='live', custo='free', cadastro='não', instalacao='não', opsec='passiva', entrada='', saida='', publico=p in IT_PUBLICO)


def dw_rows():
    d = json.loads((ROOT / 'site/dados/profundezas.json').read_text(encoding='utf-8'))
    legs = {L['n']: L['titulo'] for L in d['LEGS']}
    for r in d['RAW']:
        iid, t, a, y, v, k, leg = r[:7]
        if k in 'PSLRB':
            url = 'https://scholar.google.com/scholar?q=' + re.sub(r'\s+', '+', t)
        elif re.match(r'^[a-z0-9.-]+\.[a-z]{2,}(/\S*)?$', v.split(',')[0].strip()):
            url = 'https://' + v.split(',')[0].strip()
        else:
            continue
        yield dict(nome=t, url=url, categoria='Dark Web · leituras e ferramentas', subcategoria=legs.get(leg, ''),
                   origem='Mapa das Profundezas (DEIVOSINT)', descricao=' · '.join(x for x in (TIPOS_DW.get(k, k), a, str(y or ''), v) if x),
                   status='live', custo='free', cadastro='', instalacao='', opsec='passiva', entrada='', saida='', publico=True)


def main():
    todas, vistos = [], set()
    for fonte in (guia_rows(), catalogo_rows(), it_rows(), dw_rows(), osf_rows()):
        for r in fonte:
            chave = (r['url'].rstrip('/').lower(), r['categoria'])
            if chave in vistos:
                continue
            vistos.add(chave)
            r['id'] = slug(r['categoria'] + '-' + r['nome'])
            r['revisado_em'] = HOJE
            todas.append(r)
    (ROOT / 'recursos/fontes.json').write_text(json.dumps(todas, ensure_ascii=False, indent=0), encoding='utf-8')

    grupos: OrderedDict[str, list] = OrderedDict()
    for r in todas:
        if r['publico']:
            grupos.setdefault(r['categoria'], []).append(r)
    st = {'live': '', 'degraded': ' · instável', 'down': ' · fora do ar', 'defunct': ' · fora do ar'}
    linhas = ['# Lista completa de fontes · Uma linha por fonte', '',
              '[← Início](../README.md) · [Catálogo editorial](README.md) · [Guias por plataforma](../docs/plataformas/README.md)', '',
              f'Gerada por `tools/build_fontes.py` em {HOJE}. **{sum(len(v) for v in grupos.values())} fontes** em **{len(grupos)} categorias**. '
              'Estar na lista não é recomendação: avalie cada fonte com o [método VISTA](../docs/avaliacao-de-fontes.md) e a '
              '[política de qualidade e ética](../docs/qualidade-e-etica.md).', '',
              'Categorias voltadas a localizar ou identificar pessoas (buscadores de pessoas, telefones, e-mail, nome de usuário, '
              'mensageria e relacionamento) ficam fora desta lista pública.', '',
              '> Base do OSINT Framework: licença MIT, Copyright (c) 2017 Justin Nordine. '
              'Cópia em [recursos/externos/osint-framework](externos/osint-framework/LICENSE).', '', '## Categorias', '']
    linhas += [f'- [{c}](#{slug(c)}) · {len(v)}' for c, v in grupos.items()]
    for c, v in grupos.items():
        linhas += ['', f'<a id="{slug(c)}"></a>', '', f'## {c}', '']
        for r in sorted(v, key=lambda r: (r['subcategoria'], r['nome'].lower())):
            sub = f' _{r["subcategoria"]}_ ·' if r['subcategoria'] else ''
            desc = (r['descricao'] or '').replace('|', '/').replace('\n', ' ').strip()
            extra = st.get(r['status'], '') + (' · pago' if r['custo'] == 'paid' else ' · freemium' if r['custo'] == 'freemium' else '')
            linhas.append(f'- **[{r["nome"].replace("[", "(").replace("]", ")")}]({r["url"]})**{sub} {desc[:160]}{extra}')
    (ROOT / 'recursos/lista-completa.md').write_text('\n'.join(linhas) + '\n', encoding='utf-8')
    print(f'{len(todas)} fontes na base · {sum(len(v) for v in grupos.values())} na lista pública · {len(grupos)} categorias públicas')


if __name__ == '__main__':
    main()
