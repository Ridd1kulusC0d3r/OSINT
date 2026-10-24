# Casos de uso · OSINT aplicado a decisões

[← Início](../README.md) · [Método](metodo.md) · [Fontes](../recursos/fontes-e-referencias.md)

Os cenários desta página descrevem **pesquisa defensiva e pública**, não técnicas para invadir sistemas ou perfis. Todos os exemplos são genéricos e devem usar dados sintéticos ou legitimamente autorizados em exercícios.

## Caso A · CTI: verificar uma alegação sobre campanha

**Pergunta:** dois boletins públicos descrevem o mesmo comportamento de ameaça ou reutilizam uma notícia?

**Evidências apropriadas:** boletins primários datados, comunicados de fornecedores e referências explícitas a relatórios originais.

**Método:** identificar a origem de cada afirmação, separar indicadores observáveis de atribuição e marcar quando diferentes páginas derivam da mesma publicação.

**Saída:** tabela com alegações, evidências, origem, data, hipótese alternativa e grau qualitativo de sustentação.

**Armadilha:** tratar a repetição de um nome de grupo ou de um IOC como prova independente da mesma campanha.

## Caso B · Pesquisa empresarial: validar informação institucional

**Pergunta:** duas páginas oficiais da mesma organização descrevem o mesmo serviço e período de vigência?

**Evidências apropriadas:** publicações oficiais, páginas institucionais e versões públicas arquivadas.

**Método:** comparar o texto, o período indicado e o contexto de atualização; evitar inferir vínculos entre pessoas com base em nomes semelhantes.

**Saída:** quadro de divergências, fontes originárias e ressalvas sobre temporalidade.

**Armadilha:** misturar cadastro de empresa, filial, marca e pessoa física como se fossem entidades idênticas.

## Caso C · GEOINT: validar uma descrição territorial

**Pergunta:** um relatório público aponta corretamente a localização aproximada de uma obra ou área ambiental?

**Evidências apropriadas:** mapas públicos institucionais, documentos oficiais e dados cartográficos não sensíveis.

**Método:** identificar sistema de referência, escala, data da camada e eventuais limites de precisão.

**Saída:** nota metodológica explicando a localização em nível agregado e as incertezas.

**Armadilha:** comparar bases de anos diferentes sem registrar a defasagem.

## Caso D · Arquivo web: verificar a evolução de uma afirmação

**Pergunta:** a descrição de um serviço institucional mudou entre duas versões públicas de um site?

**Evidências apropriadas:** cópias arquivadas públicas, comunicados institucionais e páginas atualmente disponíveis.

**Método:** guardar a URL e as datas da captura, comparar conteúdo e distinguir ausência de captura de ausência histórica da página.

**Saída:** timeline com evidências e hipóteses sobre o que mudou.

**Armadilha:** atribuir intenção a uma alteração de texto sem evidência.

## Padrão de entrega

Para qualquer caso, utilize [plano de pesquisa](../templates/plano.md), [registro de evidências](../templates/evidencias.md), [matriz de hipóteses](../templates/matriz-de-hipoteses.md) e [relatório](../templates/relatorio.md). Uma análise útil responde à pergunta inicial e explicita suas limitações.
