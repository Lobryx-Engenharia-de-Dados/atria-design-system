# SPEC — Eixos de Layout do Design System

## História e valor

Como consumidor do `@lobryx/design-system`, quero primitives consistentes para
tipografia, grids, estados e tabelas, para construir telas responsivas,
acessíveis e visualmente coerentes sem duplicar decisões de layout.

## Os quatro eixos

1. **Grids e containers por tipo de tela:** `Container`, `Grid`, `Stack` e
   `DashboardGrid` organizam conteúdo com colunas responsivas e espaçamento
   semântico.
2. **Tipografia de conteúdo:** `Text` fornece variantes semânticas de display,
   headings, corpo, label e caption, com tons de conteúdo.
3. **Estados de interface:** `EmptyState`, `ErrorState` e `LoadingState` tornam
   vazio, erro e carregamento explícitos e acionáveis.
4. **Tabelas:** o conjunto composável fornece tabela semântica, cabeçalho,
   células, caption e densidade confortável ou compacta.

## Contrato de tokens

Todo estilo novo usa exclusivamente tokens do `src/theme.css`. A escala
tipográfica `--text-*` define tamanho e line-height; fontes são `--font-headings`
para títulos e `--font-sans` para conteúdo. Espaçamentos, cores, bordas,
raios, sombras, duração e easing também são consumidos somente por utilities
geradas a partir do tema. O contrato deve funcionar nos temas padrão dark e
`[data-theme='light']`, sem criar um segundo tema.

### Contrato de espaçamento

`--spacing: 0.25rem` é a base oficial da escala de espaçamento do Tailwind v4;
utilities como `p-*`, `m-*`, `gap-*` e `space-*` devem derivar dela. Os tokens
legados e públicos `--space-1` a `--space-8` permanecem disponíveis, com a
relação invariável `--space-N == N × --spacing` (por exemplo, `--space-8 == 2rem`).
Assim, a lib é a fonte única da escala sem alterar os valores visuais atuais.

## Critérios de aceite BDD

### Eixo 1 — Grids e containers

- **Dado** um `Grid` com colunas e breakpoints, **quando** renderizado,
  **então** ele produz um CSS grid responsivo usando classes derivadas dos
  tokens e sem valores arbitrários.
- **Dado** um `Stack`, **quando** recebe um gap válido, **então** seus filhos
  são empilhados com espaçamento do tema.
- **Dado** um dashboard, **quando** uso `DashboardGrid`, **então** ele oferece
  a composição responsiva padronizada para cards.

### Eixo 2 — Tipografia

- **Dado** um `Text` com `variant="h2"`, **quando** renderizado, **então** o
  elemento padrão é `h2` e usa a escala tipográfica canônica.
- **Dado** qualquer variante e `tone`, **quando** renderizado, **então** fonte,
  tamanho, line-height e cor são tokens do DS.

### Eixo 3 — Estados

- **Dado** um estado vazio, **quando** há ação configurada como `StateAction`,
  **então** título, descrição e um controle focável (`Button`, ou link quando
  `href` é informado) são apresentados de forma acionável.
- **Dado** um erro, **quando** há retry configurado como `StateAction`, **então**
  o estado tem alerta claro e um controle focável de nova tentativa.
- **Dado** um carregamento, **quando** renderizado, **então** a região possui
  `aria-busy="true"`, mensagem acessível e skeleton decorativo.

### Eixo 4 — Tabelas

- **Dado** uma `Table`, **quando** renderizada, **então** existe `<table>` com
  cabeçalho e células semânticos dentro de wrapper com overflow horizontal.
- **Dado** um `TableHeaderCell`, **quando** renderizado, **então** possui
  `scope="col"` por padrão.
- **Dado** uma densidade, **quando** aplicada no pai, **então** cabeçalho e
  células recebem o espaçamento correspondente sem alterar a semântica.

## Invariantes

- TypeScript permanece estrito e todos os componentes são exportados pela API
  pública do pacote.
- Nenhuma cor, tamanho, espaçamento ou breakpoint arbitrário é introduzido;
  somente tokens do DS são permitidos.
- O markup mantém semântica HTML e foco visível/acessível quando houver ação.
- `EmptyState.action` e `ErrorState.retry` não aceitam nós livres: seus
  `StateAction` sempre são renderizados pelo `Button` como `<button>` ou `<a>`.
- Os temas dark e light continuam suportados sem seletores ou temas paralelos.
- Loading é anunciado sem duplicar o conteúdo decorativo do `Skeleton`.

## Backlog e fora de escopo

A **propagação aos cinco consumidores** (site, clari, edra, nivra e orvia) era a
entrega seguinte e está explicitamente fora do escopo original deste documento,
que cobria somente a biblioteca canônica e seus testes de renderização.

Essa propagação, porém, exige elevar a lib à **paridade de API** com os
primitivos que hoje vivem nos kits locais dos consumidores. A entrega está
especificada em
[DS Canônico — Paridade de API e Propagação aos Consumidores](ds-canonical-parity-and-propagation.md).
