# @lobryx/design-system

Design System Canônico do ecossistema **Lobryx**.

Contém o SSOT de tokens Tailwind v4 (`theme.css`) e os átomos de interface em React + TypeScript.

## Uso

### 1. Importar tokens no CSS do App (Tailwind v4)

No seu arquivo `src/index.css` ou `src/styles.css`:

```css
@import "tailwindcss";
@import "@lobryx/design-system/theme.css";
```

### 2. Consumir Componentes Atômicos

```tsx
import { Button, Badge, Card, KpiCard } from "@lobryx/design-system";

export function Dashboard() {
  return (
    <Card>
      <KpiCard label="Receita" value="R$ 15.000" change="+12%" changeType="positive" />
      <Badge variant="success">Online</Badge>
      <Button variant="primary">Acessar</Button>
    </Card>
  );
}
```

## Contrato canônico

O pacote publica somente tokens semânticos `--color-*` na camada `@theme`; os valores
primitivos são internos (`--_ds-*`). O tema dark é o padrão em `:root` e o light é
ativado no elemento raiz com `data-theme="light"`:

```html
<html data-theme="light">
```

Além das cores, o contrato inclui `--radius-*`, `--space-*`, `--shadow-*`, `--font-*`,
`--duration-*` e `--ease-*`. A marca é `--color-primary`/`--color-brand-navy`;
texto usa `--color-foreground` (com variantes `--color-foreground-secondary`,
`--color-foreground-muted`, `--color-accent-foreground` e `--color-inverse`), e
estados/gráficos são sensíveis ao tema.

### Tokens adicionados na Fase 1.6

| Token | Dark (`:root`) | Light (`[data-theme="light"]`) |
| --- | --- | --- |
| `--color-primary-light` | `#0f1d3d` | `#f1f5f9` |
| `--color-foreground-on-dark` | `#ffffff` | `#ffffff` (invariante) |
| `--color-foreground-on-dark-muted` | `rgba(255, 255, 255, 0.7)` | `rgba(255, 255, 255, 0.7)` (invariante) |

### Token adicionado na Fase 1.8

| Token | Dark (`:root`) | Light (`[data-theme="light"]`) |
| --- | --- | --- |
| `--color-accent-text` | `#ff8700` | `#c2410c` |

Use `--color-accent-text` para texto de acento. O token mantém o laranja de marca
no tema dark e usa um laranja mais escuro no tema light para atender WCAG AA sobre
`--color-background` e `--color-surface`.

### Tokens adicionados na Fase 1.9

Os tokens `--color-status-*-foreground` são foregrounds para fundos sólidos de
status (botões e chips preenchidos). São sensíveis ao tema: usam `#010a26` no
dark, sobre os status claros, e `#ffffff` no light, sobre os status escuros,
mantendo contraste WCAG AA (mínimo de 4,5:1).

| Token | Dark (`:root`) | Light (`[data-theme="light"]`) |
| --- | --- | --- |
| `--color-status-success-foreground` | `#010a26` | `#ffffff` |
| `--color-status-warning-foreground` | `#010a26` | `#ffffff` |
| `--color-status-error-foreground` | `#010a26` | `#ffffff` |
| `--color-status-info-foreground` | `#010a26` | `#ffffff` |

## Consumo

Instale ou vincule o pacote localmente com `link:../../design-system` e importe os
tokens no CSS da aplicação:

```css
@import "tailwindcss";
@import "@lobryx/design-system/theme.css";
```

Componentes são importados do entrypoint:

```tsx
import { Button, Badge, Card, KpiCard } from "@lobryx/design-system";
```
