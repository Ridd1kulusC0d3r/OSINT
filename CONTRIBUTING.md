# Contribua com OSINT: qualidade antes de quantidade

[← Início](README.md) · [Ética](docs/qualidade-e-etica.md) · [Laboratórios](labs/README.md)

A biblioteca aceita documentação, correções de fontes, modelos e laboratórios sintéticos. Não envie dados pessoais, credenciais, dumps nem pesquisas invasivas sobre terceiros.

## Uma contribuição precisa responder

1. Qual pergunta o material ajuda a responder?
2. Qual é a **origem primária** da informação?
3. O que está **verificado**, apenas **referenciado** ou ainda **planejado**?
4. Qual erro ou falso positivo pode ocorrer?
5. Como outro analista reproduz o resultado?
6. Há risco de privacidade, atribuição incorreta ou reutilização sem permissão?

## Padrão de laboratório

Obrigatório: contexto fictício, IDs de evidência, objetivo, missão, rubrica de avaliação e gabarito recolhido em `<details>`. Não use como alvo pessoas, empresas ou ativos reais sem autorização apropriada.

## Padrão de recurso

O arquivo [catálogo CSV](recursos/catalogo.csv) fornece um subconjunto estruturado de referências. Verifique `id`, `url`, `origem`, `valor`, `limitacao` e `revisado_em`. O status `referencia_documental` **não** implica testes operacionais.

## Qualidade automatizada

Execute na raiz do clone:

```bash
python3 -m unittest discover -s tools/tests -v
python3 tools/check_docs.py
```

Os testes verificam links locais, fragmentos de Markdown e integridade do catálogo. Não fazem chamadas a serviços externos.

## Checklist do Pull Request

- [ ] Arquivos com ligações relativas corretas.
- [ ] Fonte original e limitações documentadas.
- [ ] Exemplos sintéticos/legítimos.
- [ ] Nenhum segredo ou dado pessoal desnecessário.
- [ ] Nenhuma promessa de certeza sem evidência.
- [ ] Testes locais passaram, ou a limitação foi explicada.

O mantenedor deve decidir a licença do projeto antes de declarar permissões gerais de redistribuição.
