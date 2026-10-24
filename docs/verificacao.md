# Guia prático de verificação OSINT

[← Início](../README.md) · [Método](metodo.md) · [Lab temporal](../labs/03-verificacao-temporal/README.md)

O objetivo não é encontrar uma segunda página dizendo a mesma coisa. É testar a **origem, independência, autenticidade, localização, temporalidade e contexto** de uma alegação.

## Checklist de verificação

| Dimensão | Procedimento analítico | Armadilha frequente |
|---|---|---|
| Fonte | Identificar publicador e documento primário | Confundir agregador com fonte originária |
| Conteúdo | Comparar texto completo com recortes | Tratar legenda como prova do que a imagem mostra |
| Independência | Reconstruir cadeia de republicações | Contar cópias como corroboração independente |
| Tempo | Diferenciar evento, publicação, edição e captura; registrar fuso | Confundir "atualizado em" com "aconteceu em" |
| Local | Testar pistas visuais/descrições com referências confiáveis | Interpretar uma etiqueta geográfica como confirmação |
| Integridade | Documentar versões e eventuais hashes | Imaginar que hash demonstra autenticidade |
| Incerteza | Procurar explicações alternativas e material contrário | Selecionar apenas resultados favoráveis |

## Validação de imagens e vídeos

1. Comece por uma **alegação explícita**: "Esta imagem documenta o local L na data D".
2. Descreva somente o que é **visível** e registre como a imagem chegou até você.
3. Compare com a origem publicada, versões anteriores e fontes independentes quando legitimamente acessíveis.
4. Trate EXIF e outros metadados como sinais que podem estar ausentes, alterados ou herdados de um processo de edição.
5. Para alegações de local e tempo, compare referências públicas adequadas, sem expor pessoas ou endereços privados.
6. Se a verificação não for conclusiva, marque **indeterminado** e explique qual observação falta.

### Conteúdo gerado por IA

Aparência realista não confirma autenticidade e artefatos visuais isolados não provam manipulação. Resultados de detectores automatizados são sinais auxiliares, não vereditos. Priorize cadeia de origem, contexto de publicação e corroboração externa.

## Matriz simples para usar em qualquer caso

| Alegação | Origem primária | Evidência independente | Contraevidência | Avaliação |
|---|---|---|---|---|
| Data de lançamento do Projeto Aurora é 12/05 | Comunicado A (E001) | Ainda não encontrada | Documento B aponta 13/05 (E002) | Indeterminado |

Considere publicar somente a conclusão e as referências necessárias. Para exercícios, use [evidências](../templates/evidencias.md) e [matriz de hipóteses](../templates/matriz-de-hipoteses.md).

**Aprofundamento:** [Bellingcat Toolkit](https://bellingcat.gitbook.io/toolkit) e [Evaluating Digital Open Source Imagery (Berkeley HRC, 2024)](https://humanrights.berkeley.edu/publications/evaluating-digital-open-source-imagery-a-guide-for-judges-and-fact-finders/).
