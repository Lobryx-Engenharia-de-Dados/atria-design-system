---
type: user-story
slug: chart-series-palette
status: active
system: design-system
updated_at: 2026-10-31
---

# Paleta canônica de séries para gráficos

## 1. História

Como consumidor do Design System, quero cores de séries consistentes e
contrastantes nos temas dark e light, para que gráficos permaneçam legíveis sem
usar azul-marinho em superfícies escuras ou claras.

## 2. Critérios de aceite (BDD)

- **Dado** um gráfico com uma ou duas séries, **quando** usa `chart-1` e `chart-2`,
  **então** recebe laranja e azul semântico, respectivamente, nos temas dark e
  light.
- **Dado** um dos dois temas, **quando** as séries são exibidas sobre fundo ou
  cartão, **então** ambas mantêm contraste mínimo de 3:1 e `chart-2` não é azul
  marinho.

## 3. Invariantes & restrições

- A API pública continua sendo `--color-chart-1` e `--color-chart-2`; apenas seus
  valores sensíveis ao tema são atualizados.
- Consumidores continuam responsáveis pela semântica dos dados e usam os tokens
  sem adicionar cores próprias ou alterar cálculos de métricas.
