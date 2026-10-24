# Lab 03 · O horário que não fecha

[← Início](../../README.md) · [Verificação](../../docs/verificacao.md) · Duração sugerida: 25 min · Sem instalação

## Objetivo

Diferenciar o **momento do evento**, o **momento da publicação** e o **momento da captura**, reconhecendo fusos e margens de incerteza.

## Cenário sintético

Um evento de lançamento do fictício "Projeto Horizonte" aparece em três registros:

| ID | Registro | Observação |
|---|---|---|
| E201 | Agenda: "Reunião em 09/07/2026 às 22:10, UTC−03:00". | Hora **prevista**, não necessariamente a execução |
| E202 | Notícia: "Publicado em 2026-07-10T01:30:00Z". | Timestamp em UTC da publicação |
| E203 | Captura: "Página arquivada em 10/07/2026 às 03:00 UTC". | Hora da captura, não hora do evento |
| E204 | Nota editorial: "O texto da notícia foi corrigido após publicação; sem horário registrado". | Há atualização, mas momento indeterminado |

## Missão

1. Converta E201 para UTC e E202 para UTC−03:00. Mostre os cálculos.
2. Ordene os eventos **registrados**, sem confundir previsão com ocorrência.
3. Avalie se E202 confirma que a reunião **aconteceu** às 22:10.
4. Registre o efeito de E204 na confiança sobre o texto da notícia.
5. Redija uma conclusão com as limitações.

## Critérios de avaliação

- Os horários são comparados no mesmo fuso.
- E201 é classificado como **agendamento**, E202 como **publicação** e E203 como **captura**.
- A edição sem timestamp de E204 é tratada como lacuna.
- Nenhuma inferência afirma que a reunião ocorreu só porque foi agendada.

<details>
<summary>Resolução comentada · abrir depois da tentativa</summary>

E201 equivale a **10/07/2026 01:10 UTC**. E202 corresponde a **09/07/2026 22:30 UTC−03:00**. E203 é 10/07/2026 03:00 UTC.

A ordem dos instantes registrados é: agendamento E201 (01:10 UTC), publicação E202 (01:30 UTC) e captura E203 (03:00 UTC). A nota E204 não informa quando ocorreu a correção.

**Conclusão possível:** os registros demonstram uma sequência de agendamento, publicação e arquivamento, mas não comprovam o horário real do evento. Além disso, E204 impede assumir que o conteúdo atual da notícia seja idêntico ao publicado em E202.

</details>

Avance para o [template de relatório](../../templates/relatorio.md) e transforme o resultado em uma nota analítica.
