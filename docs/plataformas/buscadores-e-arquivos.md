# Buscadores e arquivos da web · Encontrar a origem e as versões

[← Guias por plataforma](README.md) · [Método](../metodo.md) · [Verificação](../verificacao.md)

**Revisado em:** 2026-11-23.

Buscadores mostram o que está indexado hoje. Arquivos da web mostram o que existiu. Juntos, respondem duas perguntas centrais da verificação: **quem publicou primeiro** e **o que mudou**.

## Método comum

1. Escreva a pergunta e as palavras exatas que procura.
2. Rode a mesma consulta em pelo menos dois buscadores.
3. Ordene ou filtre por data para chegar à publicação mais antiga.
4. Consulte o arquivo da web para ver versões anteriores da página.
5. Registre a consulta final, os resultados usados e a data da busca.

## Operadores que funcionam na maioria dos buscadores

| Operador | Efeito | Exemplo |
|---|---|---|
| `"..."` | Frase exata | `"nota oficial" "Projeto Aurora"` |
| `-` | Exclui termo | `aurora -boreal` |
| `OR` | Alternativas | `edital OR licitação` |
| `site:` | Só um domínio ou extensão | `site:gov.br "Projeto Aurora"` |
| `filetype:` | Tipo de arquivo | `site:gov.br filetype:pdf relatório anual` |
| `intitle:` | Palavra no título | `intitle:"nota técnica"` |
| `before:` / `after:` | Período (Google) | `after:2026-01-01 before:2026-03-31` |

Comece amplo e vá restringindo. Anote o que cada operador removeu: o ruído também é informação.

## Google

- **Serve para:** cobertura ampla e documentos públicos de órgãos e empresas.
- **Recursos nativos:** Ferramentas → período personalizado e resultados exatos; aba Notícias com filtro de data; Google Lens para imagens.
- **Cuidados:** resultados mudam com login, país e idioma. Busque deslogado, no navegador de trabalho.

## Bing

- **Serve para:** segunda opinião de índice; bom para documentos.
- **Recursos nativos:** `site:`, `filetype:`, `inbody:`, `contains:` (páginas que apontam para um tipo de arquivo); busca visual.

## DuckDuckGo

- **Serve para:** resultados sem personalização.
- **Recursos nativos:** filtro de região e data; atalhos `!` para outros buscadores.

## Yandex

- **Serve para:** conteúdo em idiomas do Leste Europeu e busca por imagem de lugares e objetos.
- **Cuidados:** não use para reconhecimento facial de pessoas privadas.

## Buscadores independentes

- **Brave Search** e **Mojeek** têm índice próprio e às vezes trazem páginas que os grandes não mostram.

## Wayback Machine (Internet Archive)

- **Serve para:** ver como uma página estava em datas anteriores e preservar uma página agora.
- **Recursos nativos:** calendário de capturas por URL; “Save Page Now” para arquivar; listagem de URLs capturadas de um domínio (`web.archive.org/web/*/dominio.gov.br*`).
- **Preservar:** guarde o link da captura (ele contém a data no próprio endereço).
- **Cuidados:** a cobertura tem lacunas; ausência de captura não prova que a página não existia.

## archive.today

- **Serve para:** preservar uma página com captura de tela e texto, inclusive algumas que o Wayback não salva bem.
- **Preservar:** guarde o link curto gerado e a data.

## Memento (Time Travel)

- **Serve para:** consultar vários arquivos da web de uma vez para uma URL e data.

## Buscadores de checagem

- **Google Fact Check Explorer** reúne checagens de agências de vários países.
- Agências brasileiras como Lupa, Aos Fatos, Comprova e Estadão Verifica publicam verificações pesquisáveis.

## Limites

- Encontrar um documento por busca não autoriza acessar áreas restritas de um sistema.
- Páginas em cache ou arquivadas podem conter dados pessoais que foram retirados de propósito: trate com o mesmo cuidado do original.
- Registre o caminho: consulta, buscador, data e resultado. Sem isso, a busca não é reproduzível.

## Checklist

- [ ] Rodei a consulta em dois buscadores.
- [ ] Cheguei à publicação mais antiga e registrei a data.
- [ ] Conferi versões anteriores no arquivo da web.
- [ ] Preservei a página usada.
- [ ] Anotei a consulta final.

Pratique com o [Lab 03 · Verificação temporal](../../labs/03-verificacao-temporal/README.md).
