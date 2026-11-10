# Lab 05 · Boletim não é atribuição

[← Índice](../../README.md) · [Trilha OSINT para CTI](../../docs/osint-cti.md) · **35 min** · Sem instalação

**Objetivo:** separar observações de um boletim de segurança das hipóteses de atribuição e das decisões operacionais.

## Cenário totalmente fictício

Uma organização chamada **Empresa Aurora** recebeu três notícias públicas sobre o programa fictício **Sistema Atlas**. Não há URLs, indicadores reais ou infraestrutura que possa ser pesquisada.

| ID | Informação simulada | Qual é o limite? |
|---|---|---|
| E501 | O fornecedor publica boletim dizendo que uma versão antiga do Atlas tem uma falha de validação. | Relato do fornecedor; não comprova uso local |
| E502 | Uma postagem replica o boletim e atribui uma campanha ao grupo fictício “Neblina”. | Atribuição sem metodologia apresentada |
| E503 | Outro portal repete o nome “Neblina” e cita somente E502. | Não é corroboração independente |
| E504 | Inventário sintético da Empresa Aurora informa uso de uma versão posterior, sem especificar configurações. | Um inventário incompleto não exclui todas as exposições |
| E505 | Nenhuma telemetria interna foi disponibilizada para o exercício. | Não permite afirmar ocorrência nem ausência de incidente |

## Sua missão

1. Classifique cada registro: **boletim**, **republicação**, **inventário**, **lacuna**.
2. Diferencie alegação de vulnerabilidade, exposição no ambiente e atribuição de autoria.
3. Identifique dependência E503 → E502.
4. Diga o que pode ser recomendado **defensivamente** sem acesso a logs.
5. Crie uma nota de inteligência que responda: **“Há evidência suficiente para afirmar que a Empresa Aurora sofreu um incidente atribuído a Neblina?”**

## Rubrica de avaliação (10 pontos)

| Critério | Pontos |
|---|---:|
| Reconhece o limite do boletim E501 | 2 |
| Não aceita atribuição derivada como prova | 2 |
| Lê o inventário E504 com cautela | 2 |
| Não transforma E505 em evidência negativa | 2 |
| Propõe recomendações defensivas proporcionais | 2 |

<details>
<summary>Gabarito comentado</summary>

**Resposta:** não. Os registros não sustentam incidente local nem atribuição a “Neblina”. E501 descreve uma falha relatada pelo fornecedor. E502 publica uma afirmação sem método, e E503 a repete. E504 sugere uma versão posterior, mas o escopo de inventário é limitado; E505 não informa o estado real de logs.

**Recomendações proporcionais:** validar inventário e configuração em ambiente próprio, revisar orientações oficiais do fornecedor, conferir cobertura de monitoramento sob autorização e registrar o resultado. Não é possível concluir ocorrência ou ausência de comprometimento.

</details>

**Referenciais de contexto:** [NIST SP 800-61 Rev. 3](https://csrc.nist.gov/pubs/sp/800/61/r3/final) e [MITRE ATT&CK](https://attack.mitre.org/). O cenário e os nomes são inventados.
