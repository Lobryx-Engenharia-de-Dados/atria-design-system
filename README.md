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

## Paleta & Tokens
- **Base / Primary:** Navy Dark `#010a26`
- **Acento / Accent:** `#ff8700`
- **Tipografia:** Headings `Poppins`, UI/Body `Inter`
- **Foco:** `2px solid #ff8700`
- **Acessibilidade:** WCAG 2.1 AA/AAA
