# Registros públicos no Brasil · Dados oficiais como fonte primária

[← Guias por plataforma](README.md) · [Avaliação de fontes](../avaliacao-de-fontes.md) · [Qualidade e ética](../qualidade-e-etica.md)

**Revisado em:** 2026-11-23.

Registros oficiais são as fontes mais fortes de uma verificação: identificam o órgão emissor, a data e, em geral, um número de documento. Este guia cobre consultas abertas de empresas, órgãos públicos, contratos, processos e domínios.

## Método comum

1. Identifique o órgão responsável pelo dado.
2. Use a consulta oficial; agregadores privados copiam com atraso e erros.
3. Baixe o documento (PDF, certidão, JSON) em vez de só capturar a tela.
4. Registre órgão, número do documento, data de emissão e data da consulta.
5. Quando o dado não estiver aberto, avalie um pedido pela Lei de Acesso à Informação.

## Empresas

| Fonte | O que mostra | Como usar |
|---|---|---|
| Receita Federal — Comprovante de Inscrição e de Situação Cadastral | Situação, endereço, atividade (CNAE), data de abertura | Consulta pelo CNPJ, com captcha |
| Dados abertos do CNPJ (Receita) | Base completa de empresas e quadro societário | Download periódico em `dados.gov.br`; útil para análise em volume |
| Juntas Comerciais estaduais | Atos constitutivos, alterações, atas | Consulta por estado; alguns documentos são pagos |
| CVM | Companhias abertas, fatos relevantes, demonstrações | Sistema de consultas da CVM |
| INPI | Marcas e patentes, titular e situação | Busca de marcas por nome ou número |

## Governo, contratos e gastos

| Fonte | O que mostra |
|---|---|
| Portal da Transparência (CGU) | Despesas, contratos, convênios, servidores, sanções (CEIS, CNEP) |
| Portal Nacional de Contratações Públicas (PNCP) | Editais, atas e contratos de todos os entes |
| Diário Oficial da União (Imprensa Nacional) | Atos do governo federal, busca por termo e data |
| Querido Diário | Busca em diários oficiais de municípios |
| Portais de dados abertos (`dados.gov.br` e estaduais) | Bases oficiais em formato aberto |

## Eleições

| Fonte | O que mostra |
|---|---|
| DivulgaCandContas (TSE) | Candidaturas, bens declarados, receitas e despesas de campanha |
| Portal de Dados Abertos do TSE | Resultados e prestações de contas em volume |

## Justiça

| Fonte | O que mostra | Cuidados |
|---|---|---|
| Consulta processual dos tribunais (PJe e sistemas próprios) | Andamento, partes e decisões de processos públicos | Processos em segredo de justiça não aparecem e não devem ser buscados por outras vias |
| Diários da Justiça | Intimações e publicações | Homônimos são comuns: confirme por outro dado |
| Jurisprudência dos tribunais (STF, STJ e tribunais estaduais) | Decisões e entendimentos | Cite número do processo e data |

## Domínios .br

- **Registro.br:** consulta do titular, documento (quando pessoa jurídica), datas de criação e expiração e servidores DNS de domínios `.br`.
- Para domínios genéricos (`.com`, `.org`), use o **ICANN Lookup** (RDAP).

## Lei de Acesso à Informação

- Pedidos ao governo federal pela plataforma **Fala.BR**; estados e municípios têm canais próprios.
- Prazo de resposta de 20 dias, prorrogável por mais 10 (Lei 12.527/2011).
- Escreva o pedido com objeto, período e formato desejado; registre o protocolo.

## Como preservar

- Prefira o documento oficial baixado (PDF, certidão) ao print.
- Calcule o hash do arquivo e registre a URL de origem e a data.
- Para bases abertas, guarde a versão (data de publicação) usada na análise.

## Limites

- Dado público não perde a proteção da LGPD: use apenas o necessário para a pergunta, com base legal e finalidade registradas.
- Agregadores que vendem dados pessoais (“consulta CPF”, “consulta por telefone”) têm origem muitas vezes ilegal e ficam fora deste guia.
- Situação cadastral muda: cite sempre a data da consulta.

## Checklist

- [ ] Usei a fonte oficial do órgão responsável.
- [ ] Baixei o documento e registrei número, data e hash.
- [ ] Confirmei homônimos por um segundo dado.
- [ ] Usei só os dados pessoais necessários.
- [ ] Registrei pedidos de acesso à informação e protocolos.
