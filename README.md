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
texto usa `--color-text-primary`, e estados/gráficos são sensíveis ao tema.

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
