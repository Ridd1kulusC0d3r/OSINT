# Lab 02 · Três fontes, uma origem

[← Início](../../README.md) · [Verificação](../../docs/verificacao.md) · Duração sugerida: 25 min · Sem instalação

## Objetivo

Avaliar **independência de fontes**. A repetição de uma notícia em vários lugares não significa que ocorreram várias confirmações.

## Cenário 100% sintético

O "Observatório Vale" é uma organização fictícia. Todas as informações são inventadas e não devem ser usadas como eventos reais.

| ID | Registro | Proveniência conhecida |
|---|---|---|
| E101 | Site A: "O Observatório Vale inaugurará um laboratório em 18 de agosto". | Comunicado assinado pelo próprio Observatório |
| E102 | Blog B publica a mesma frase e credita "Fonte: Site A". | Reprodução expressa de E101 |
| E103 | Boletim C publica texto quase idêntico, com link para o Blog B. | Reprodução derivada de E102 |
| E104 | Agenda D: "Atividades previstas para 19 de agosto; confirmar com organização". | Agenda independente, ainda provisória |
| E105 | Aviso do Observatório em canal oficial: "A data do evento está em revisão". | Atualização institucional sem nova data |

## Missão

1. Preencha o [registro de evidências](../../templates/evidencias.md).
2. Desenhe a cadeia de dependência E101 → E102 → E103.
3. Identifique o que E104 demonstra e o que **não** demonstra.
4. Responda: há três confirmações independentes do evento em 18 de agosto?
5. Produza uma conclusão de até 120 palavras com IDs de evidência e uma hipótese alternativa.

## Critérios de avaliação

- E102 e E103 não contam como novas fontes independentes para a data de E101.
- E104 é um indício de possível divergência, mas traz o aviso "previstas".
- E105 reduz a segurança de uma afirmação categórica sobre a data.
- A conclusão não inventa a data definitiva.

<details>
<summary>Resolução comentada · abrir depois da tentativa</summary>

**Não** há três confirmações independentes. E102 reproduz E101 e E103 é derivada de E102. E104 oferece uma agenda independente, mas provisória; por isso não confirma a data alternativa. E105 informa que a data estava em revisão.

**Conclusão possível:** Os registros não permitem determinar a data definitiva. A referência original à data de 18 de agosto está em E101, com republicações em E102 e E103. Há divergência provisória em E104, e E105 indica revisão. Uma confirmação oficial posterior, datada, seria necessária.

**Hipótese alternativa:** pode ter ocorrido adiamento do evento ou divergência entre a agenda e o comunicado inicial. As evidências não permitem escolher entre elas.

</details>

Próximo exercício: [Lab 03 · O horário que não fecha](../03-verificacao-temporal/README.md).
