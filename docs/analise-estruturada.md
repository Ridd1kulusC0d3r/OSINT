# Análise estruturada para OSINT

[← Início](../README.md) · [Avaliação de fontes](avaliacao-de-fontes.md) · [Templates](../templates/README.md)

**Problema:** uma investigação pode ter muitos dados e uma conclusão fraca. Estruturar o raciocínio reduz a chance de confundir a primeira explicação plausível com a melhor explicação.

## 1. Perguntas e hipóteses

Uma pergunta operacional deve permitir uma resposta observável.

**Exemplo fictício:** “A alteração de horário registrada no comunicado de 15/05 substituiu o horário da agenda de 13/05?”

- **H1:** a atualização de 15/05 substituiu o horário anterior.
- **H2:** os horários se referem a atividades distintas.
- **H3:** os dados disponíveis não permitem decidir.

As hipóteses podem ser refinadas, desde que a mudança seja registrada e não esconda o resultado anterior.

## 2. Matriz de evidências discriminantes

| Evidência | H1 | H2 | H3 | Comentário |
|---|---|---|---|---|
| E01: comunicado diz “horário retificado” | Compatível | Contradiz parcialmente | Reduz incerteza | Verificar se cita o mesmo evento |
| E02: agenda antiga não foi editada | Compatível | Compatível | Compatível | Pouco discriminante |
| E03: ambos usam o mesmo identificador de evento | Fortalece | Enfraquece | Reduz incerteza | Confirmar origem do identificador |

**“Compatível” não significa “comprovado”.** Construa o quadro observando qual evidência realmente diferencia as explicações e qual seria esperada sob todas elas. Não some pontuações arbitrárias.

## 3. Teste a hipótese oposta

Antes de concluir, responda:

1. Qual evidência faria minha hipótese principal perder força?
2. O que observaríamos se a hipótese alternativa estivesse correta?
3. Que afirmação depende de uma única fonte?
4. Alguma fonte está apenas republicando a outra?
5. Quais dados não estão disponíveis e o que isso impede de afirmar?

## 4. Diário de decisões

| Campo | Exemplo |
|---|---|
| Data/hora | 2026-11-09T12:00:00-03:00 |
| Decisão analítica | Classificar horário definitivo como indeterminado |
| Base | E01, E02; E03 ainda não verificada |
| Alternativa | Registros podem se referir a sessões distintas |
| Próxima verificação | Documento oficial com identificador de evento |
| Revisão | Reavaliar após novo registro |

## 5. Padrão para difusão

Uma conclusão profissional apresenta: **resposta**, **evidências**, **incerteza**, **contraevidências**, **efeito na decisão** e **condição de revisão**. Não substitua esse conteúdo por uma nota numérica de confiança.

### Exemplo de síntese

> **Avaliação:** indeterminado. A agenda original e o comunicado descrevem horários diferentes (E01 e E02), mas ainda não há identificação suficiente para confirmar que representam o mesmo evento. A hipótese de atualização e a hipótese de sessões distintas permanecem plausíveis. É necessária uma referência oficial comum.

## Referências

- [ODNI — Objectivity e ICD 203](https://www.intel.gov/mission/our-values/objectivity): padrões de rigor analítico, tratamento de fontes e incertezas.
- [Berkeley Protocol — Human Rights Center/OHCHR](https://humanrights.berkeley.edu/publications/berkeley-protocol-on-digital-open-source-investigations/): organização de investigação, verificação e comunicação.

A matriz deste guia é **didática** e não se apresenta como método formal de ACH com calibração numérica.
