# Dados, proveniência e reprodutibilidade

[← Início](../README.md) · [Templates](../templates/README.md)

Um relatório é auditável quando outro analista consegue reconstruir **quais dados sustentam cada conclusão**, sem depender da memória de quem investigou.

## Esquema mínimo de uma evidência

```json
{
  "id": "E001",
  "case_id": "LAB-SYNTH-01",
  "claim": "A agenda anuncia uma atividade para 18 de agosto.",
  "source": {
    "title": "Agenda fictícia do Projeto Aurora",
    "origin": "Instituição fictícia",
    "url": null,
    "source_type": "primary"
  },
  "published_at": "2026-08-01T14:00:00-03:00",
  "observed_at": "2026-08-02T10:20:00-03:00",
  "event_at": null,
  "observation": "A agenda utiliza a expressão 'previsto'.",
  "limitations": ["Não comprova realização da atividade."],
  "derived_from": [],
  "assessment": "indeterminada"
}
```

O registro de exemplo acima **não corresponde a fatos reais**. `published_at`, `observed_at` e `event_at` são campos conceitualmente distintos.

## Vocabulário de estados

| Estado | Interpretação |
|---|---|
| **Observado** | Material foi encontrado e registrado |
| **Sustentado** | Evidências suficientes suportam a alegação delimitada |
| **Parcial** | Há suporte para parte da alegação |
| **Não sustentado** | A evidência fornecida não suporta a alegação proposta |
| **Indeterminado** | Dados disponíveis não permitem julgamento conclusivo |

Uma alegação pode ser não sustentada sem ser falsa. Isso evita converter uma lacuna de investigação em acusação.

## Regras de manutenção

- IDs são estáveis; nunca recicle o identificador de uma evidência diferente.
- Transformações devem ser explícitas: deduplicação, normalização, tradução e filtragem.
- Mantenha a origem mesmo após agregar registros; cópias não são fontes independentes.
- Documente data e fuso de observações, e não converta horários silenciosamente.
- Documente acesso e restrições de publicação; publique só o necessário.
- Hash é útil para comparar integridade de bytes; não comprova origem, veracidade ou autoria.
- Atribuições automáticas precisam de revisão humana e contraevidências.

## Qualidade do catálogo

O arquivo [`recursos/catalogo.csv`](../recursos/catalogo.csv) é um pequeno índice legível por máquina das referências documentadas. `tools/check_docs.py` valida nomes, URL, duplicações, datas e campos básicos, **sem enviar qualquer conteúdo a provedores externos**.

## Pacote recomendado

Use [plano](../templates/plano.md), [evidências](../templates/evidencias.md), [hipóteses](../templates/matriz-de-hipoteses.md) e [relatório](../templates/relatorio.md). Para compartilhar análises públicas, remova dados pessoais, credenciais e detalhes não necessários à finalidade.
