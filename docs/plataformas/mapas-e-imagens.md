# Mapas e imagens · Confirmar local e data

[← Guias por plataforma](README.md) · [GEOINT / IMINT](../geoint-imint.md) · [Lab 06](../../labs/06-validacao-visual/README.md)

**Revisado em:** 2026-11-23.

Uma imagem só sustenta uma afirmação quando local, data e contexto foram confirmados por pistas independentes. Este guia cobre as ferramentas abertas mais usadas para isso.

## Método comum

1. **Descreva antes de concluir.** Liste o que se vê: relevo, vegetação, placas, idioma, arquitetura, clima, sombras.
2. **Ache a origem.** Busca reversa para encontrar a versão mais antiga e o primeiro publicador.
3. **Proponha um local.** Use as pistas para chegar a uma região e depois a um ponto.
4. **Compare do alto e do chão.** Satélite para a disposição do terreno, imagens de rua para fachadas e ângulos.
5. **Confira a data.** Sombra, clima, obras e imagens históricas.
6. **Registre coordenadas e links** de cada vista usada na comparação.

## Busca reversa de imagens

| Ferramenta | Melhor para | Cuidado |
|---|---|---|
| Google Lens | Objetos, lugares, produtos | Recorte a área de interesse |
| Bing Visual Search | Segunda opinião, recortes | Resultados variam por país |
| Yandex Imagens | Lugares e paisagens | Não use para identificar pessoas |
| TinEye | Encontrar a cópia mais antiga (ordene por “oldest”) | Índice menor |

Repita em mais de uma ferramenta e procure a data mais antiga. Reconhecimento facial de pessoas privadas está fora do escopo deste guia: envolve dado biométrico, sensível pela LGPD.

## Metadados

- Fotos originais podem trazer data, aparelho e GPS (EXIF). Fotos reenviadas por redes e aplicativos de mensagem quase sempre perdem esses dados.
- Leitura local com ExifTool: `exiftool -a -G1 foto.jpg`.
- Metadado pode ser editado: use como pista, não como prova isolada.

## Google Maps e Google Earth

- **Serve para:** localizar estruturas, medir distâncias e comparar ângulos.
- **Recursos nativos:** Street View com data de captura; no Earth, **imagens históricas** (ícone do relógio) e visão 3D.
- **Registrar:** coordenadas em graus decimais e o link de cada vista.

## OpenStreetMap e Overpass Turbo

- **Serve para:** mapa colaborativo com detalhes que mapas comerciais nem sempre têm; o Overpass permite procurar combinações de elementos (por exemplo, igreja ao lado de um campo de futebol).
- **Cuidados:** dados colaborativos podem estar incompletos.

## Mapillary

- **Serve para:** imagens de rua enviadas pela comunidade, inclusive onde não há Street View.

## Satélite aberto

- **Copernicus Browser / Sentinel Hub:** imagens Sentinel recentes e gratuitas, boas para mudanças no terreno.
- **NASA Worldview:** visão diária do planeta, útil para fumaça, nuvens e queimadas.
- **Cuidados:** a resolução é limitada; confira a data de cada imagem.

## SunCalc

- **Serve para:** posição do sol e direção da sombra por local, data e hora; ajuda a estimar horário e a testar a data alegada.

## Como preservar

- Guarde a imagem original recebida, com hash, separada das versões de trabalho.
- Registre cada consulta de busca reversa (ferramenta, data, resultado mais antigo).
- Salve capturas das vistas de mapa usadas, com coordenadas.

## Limites

- Geolocalizar residências de pessoas privadas não é verificação de conteúdo: fica fora do escopo.
- Imagem de satélite e de rua tem data própria, que pode ser anterior ao fato.
- Concluir sem pista independente é palpite. Escreva “compatível com” quando faltar confirmação.

## Checklist

- [ ] Descrevi a imagem antes de buscar.
- [ ] Encontrei a versão mais antiga.
- [ ] Confirmei o local por duas vistas independentes.
- [ ] Testei a data (sombra, clima, histórico de imagens).
- [ ] Registrei coordenadas e links.
