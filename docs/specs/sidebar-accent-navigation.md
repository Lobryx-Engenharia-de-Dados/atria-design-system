---
type: user-story
slug: sidebar-accent-navigation
status: active
system: design-system
updated_at: 2026-10-31
---

# Padrão visual da navegação lateral

## 1. História

Como pessoa usuária dos produtos Lobryx, quero que hover e seleção da navegação
lateral compartilhem a mesma linguagem visual, para reconhecer rapidamente a
interação atual independentemente do produto.

## 2. Critérios de aceite (BDD)

- **Dado** um item inativo, **quando** recebe hover, **então** sua superfície
  realça de forma discreta e o ícone assume o acento do tema, sem alterar a cor
  neutra do texto.
- **Dado** o item da rota atual, **quando** renderizado, **então** apresenta
  fundo de acento discreto, ícone laranja, texto de foreground do tema,
  indicador lateral e `aria-current="page"`.
- **Dado** tema dark ou light, **quando** os itens aparecem, **então** usam tokens
  do Design System, foco visível e cores de acento legíveis no tema.
- **Dado** produtos consumidores distintos, **quando** compõem a barra lateral,
  **então** continuam responsáveis por rótulos, ícones, destinos e autorização,
  mas compartilham os estados visuais canônicos.

## 3. Invariantes & restrições

- Rotas, navegação SPA, isolamento de tenant e controles de autorização não são
  alterados pelo componente visual.
- Não introduzir cores ou estilos de estado duplicados nos consumidores.
- Texto e navegação permanecem semânticos e acessíveis por teclado.
