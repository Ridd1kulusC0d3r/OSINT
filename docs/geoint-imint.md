# GEOINT e IMINT · Verificação visual responsável

[← Início](../README.md) · [Verificação](verificacao.md) · [Catálogo](../recursos/README.md)

O objetivo aqui é **avaliar alegações sobre imagens, lugares e datas**, sem rastrear a localização de pessoas nem expor endereços privados.

## O que verificar

| Dimensão | Pergunta | Limitação frequente |
|---|---|---|
| Conteúdo | O que realmente é visível? | Legendas podem adicionar afirmações não demonstradas |
| Origem | Quem divulgou a primeira versão identificável? | Republicação pode apagar contexto |
| Local | A imagem mostra a região pública afirmada? | Semelhanças visuais podem gerar falso positivo |
| Tempo | A imagem foi capturada quando a legenda diz? | Timestamp de postagem ≠ momento da captura |
| Integridade | Há recortes ou alterações relevantes? | Ausência de metadados não prova edição |
| Contexto | O conteúdo foi apresentado com descrição fiel? | Imagem verdadeira pode ter legenda falsa |

## Abordagem de verificação

1. Redija a **alegação** em uma frase verificável.
2. Descreva características objetivas da cena em nível **não sensível**.
3. Procure a origem pública identificável e compare versões.
4. Verifique data de imagem, data de publicação e data do evento separadamente.
5. Compare com materiais institucionais públicos adequados ao nível de precisão exigido.
6. Anote explicações alternativas e quando não há confirmação suficiente.

### Exemplo didático

Uma fotografia promocional de um **parque público fictício** aparece com a legenda “reforma concluída em 2026”. O documento de planejamento cita 2026 como previsão. Mesmo que a imagem realmente seja do parque, ela não prova que a reforma terminou naquele ano. O próximo passo é verificar um comunicado de conclusão publicado pela instituição responsável.

### Metadados e automação

EXIF, geotags, classificadores de imagens e detectores de conteúdo gerado por IA podem produzir pistas, mas também apresentar lacunas e falsos positivos. **Não trate a pontuação de um detector como prova.**

## Referências

- [Berkeley HRC — Evaluating Digital Open Source Imagery (2024)](https://humanrights.berkeley.edu/publications/evaluating-digital-open-source-imagery-a-guide-for-judges-and-fact-finders/)
- [Bellingcat Online Investigation Toolkit](https://bellingcat.gitbook.io/toolkit)
- [IBGE Mapas](https://www.ibge.gov.br/mapas/)

## Prática sugerida

Use o [Lab 03](../labs/03-verificacao-temporal/README.md) para treinar distinção de datas e o [Lab 06](../labs/06-validacao-visual/README.md) para testar o limite entre uma imagem e a legenda que a acompanha.
