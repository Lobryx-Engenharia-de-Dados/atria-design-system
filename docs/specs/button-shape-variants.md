---
type: user-story
slug: button-shape-variants
status: active
system: design-system
---

# Variantes de formato do Button

## História

Como consumidor do Design System Lobryx, quero selecionar formatos canônicos de botão, para manter CTAs consistentes sem estilos de raio específicos em cada aplicação.

## Critérios BDD

- **Dado** um `Button` sem formato informado, **quando** renderizado, **então** preserva o formato `default` arredondado-md para compatibilidade.
- **Dado** um `Button` com `shape="pill"`, **quando** renderizado como botão ou link, **então** aplica a utility `rounded-pill` derivada do token público `--radius-pill`.
- **Dado** um `Button` de qualquer `variant` ou `size`, **quando** seu `shape` muda, **então** cor, tamanho, semântica, foco visível, estado disabled/loading e alvo mínimo de 44 px permanecem inalterados.
- **Dado** um `shape` não suportado, **quando** o componente é verificado por TypeScript, **então** a API rejeita o valor.

## Invariantes

- O padrão `default` mantém a renderização existente; `pill` é aditivo e opt-in.
- Raio e classe de formato são centralizados no Design System; consumidores não precisam sobrescrever `className` para obter o formato canônico.
- O token `--radius-pill` é público e funciona nos temas dark e light sem alterar suas cores.
