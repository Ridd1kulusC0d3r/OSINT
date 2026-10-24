# Ferramentas OSINT · Escolha pelo problema

[← Catálogo](README.md) · [Fontes e bibliografia](fontes-e-referencias.md)

A pergunta decide o instrumento. **Ferramenta não é fonte independente de verdade.** Uma interface pode agregar, interpretar ou republicar dados de terceiros.

| Categoria | Referência | Uso legítimo típico | Atenção |
|---|---|---|---|
| Catálogo | [Bellingcat Toolkit](https://bellingcat.gitbook.io/toolkit) | Explorar opções por necessidade | Exige avaliação individual das ferramentas |
| Catálogo | [OSINT Framework](https://osintframework.com/) | Descobrir tipos de recursos | Muitos serviços são externos e podem mudar |
| Arquivos web | [Wayback Machine](https://web.archive.org/) | Comparar versões públicas | Lacunas de captura não provam ausência histórica |
| Mapas abertos | [OpenStreetMap](https://www.openstreetmap.org/) | Contexto cartográfico público | Qualidade e atualidade variam por área |
| Imagens de satélite | [Google Earth](https://earth.google.com/web/) | Contextualização geográfica ampla | Verifique a data da imagem e a fonte da camada |
| Dados brasileiros | [IBGE](https://www.ibge.gov.br/) | Analisar indicadores agregados | Confira metodologia e recorte |
| Condições ambientais | [INMET](https://portal.inmet.gov.br/dadoshistoricos/) | Checar informações meteorológicas históricas | Há diferenças entre estações e lacunas temporais |
| Pesquisa defensiva | [VirusTotal](https://www.virustotal.com/) | Contextualizar sinais e reputação | Não envie segredos nem dados pessoais |
| Pesquisa defensiva | [URLScan](https://urlscan.io/) | Contextualizar páginas e domínios públicos | Submissões podem ter visibilidade externa |
| Automação | [SpiderFoot](https://github.com/smicallef/spiderfoot) | Estudar correlação automática em ativos autorizados | Respeitar escopo, regras de serviço e falsos positivos |

## Escolha consciente

Antes de adotar uma ferramenta, responda:

- De quem são os dados e qual é a origem primária?
- Ela coleta, transforma, infere ou só apresenta informações?
- A consulta pode expor dados que não deveriam ser compartilhados?
- É preciso cadastro, chave de API, licença ou pagamento? **Confirme no site oficial.**
- Como detectar erro, viés e falso positivo?
- Como registrar a versão do software e a data da pesquisa?

**Estado:** links e finalidades editoriais referenciados em 24/10/2026; não houve teste funcional completo, auditoria de código ou verificação dos preços de cada serviço.

O [acervo anterior](../docs/acervo.md) continua acessível para estudo histórico, mas não deve ser tomado como recomendação atual.
