---
type: user-story
slug: ds-canonical-parity-and-propagation
status: active
system: design-system
updated_at: 2026-10-10
---

# DS Canônico — Paridade de API e Propagação aos Consumidores

## 1. História

Como time de produto da Lobryx, quero que `@lobryx/design-system` seja a fonte
única dos primitivos de interface, para que `site`, `clari`, `edra`, `nivra` e
`orvia` parem de manter kits locais duplicados e divergentes.

**Escopo:** (a) elevar a lib à paridade de API com os primitivos que hoje vivem
nos kits locais dos consumidores; (b) propagar a lib e **deletar** os kits
locais nos cinco consumidores.

**Fora de escopo:** redesenho visual, novos eixos de layout, criação/alteração de
tokens em `theme.css`, novas features de produto.

**Motivação (evidência 2026-10-10):** todos os cinco consumidores já dependem da
lib e adotaram shell (`AppShell`), `PageHeader`, `Table`, estados e auth, porém
mantêm kits locais que reimplementam primitivos — `edra` (17 arquivos em
`frontend/src/components/ui/`), `site` (18 arquivos em
`frontend/src/components/ui/`), `orvia` (`components/atoms/`), `clari`
(`ui/StatCard`). Os primitivos locais são **mais ricos** que os da lib, o que
impede a migração direta.

## 2. Contrato canônico alvo (lib `v0.2.0`)

### 2.1 Componentes modificados

| Componente | API canônica alvo | Origem reconciliada |
|---|---|---|
| `Badge` | `variant?: 'neutral'\|'success'\|'warning'\|'error'\|'info'\|'outline'` (default `neutral`), `icon?` | hoje exige `status` (4 estados) — alinhar ao README, que já documenta `variant` |
| `Button` | `variant?: 'primary'\|'secondary'\|'outline'\|'ghost'\|'danger'`, `size?: 'sm'\|'md'\|'lg'`, `loading?`, `icon?`; mantém polimorfismo `href`→`<a>` e alvo mínimo de 44px | `site` (size/loading), `edra` (size/icon), `orvia` (loading/danger) |
| `TextField` | mantém `label`/`icon`/`error`; adiciona `hint?` | já cobre `Input` de site/edra/orvia |

### 2.2 Componentes novos

- `Select` — `label?`, `error?`, `options?`/`children`, `forwardRef`.
- `Checkbox` — `checked`, `onChange`, `label`, `description?`, `disabled?`.
- `Toggle` — variante switch acessível (`role="switch"`), mesmos props do `Checkbox`.
- `Modal` — `isOpen`, `title`, `subtitle?`, `icon?`, `onClose`, `children`; fecha com `Esc`,
  focus-trap e `aria-modal`.
- `Alert`/`StatusBanner` — banner de feedback semântico (`tone`), reaproveitável por `edra`.
- `StatCard` — cartão de métrica canônico; consolida `KpiCard` + `StatCard`/`MetricCard` locais.
  `KpiCard` permanece como **alias deprecado** de `StatCard` por um ciclo.

### 2.3 Composições permanecem locais

Composições app-específicas (`SectionCard`, `DataTableCard`, `PageActions`,
`MetricsGrid`) **não** sobem para a lib; devem ser reescritas **sobre**
primitivos canônicos (ex.: `Card`/`DashboardGrid`/`Button`) nos consumidores.

## 3. Critérios de aceite BDD

### Lib (design-system)

- **Dado** `Badge` sem `variant`, **quando** renderizado, **então** usa `neutral` e não quebra o teste existente que passava `status`.
- **Dado** `Button` com `size="lg"` e `loading`, **quando** renderizado, **então** aplica o espaçamento do token, expõe `disabled`/`aria-busy` e o alvo tem no mínimo 44px.
- **Dado** um `Button` com `href`, **quando** `disabled`, **então** não navega e mantém `tabindex="-1"` (comportamento atual preservado).
- **Dado** qualquer componente novo, **quando** renderizado, **então** é exportado pela API pública (`src/index.ts`) e tipado de forma estrita.
- **Dado** o contrato de tokens, **quando** qualquer novo componente é renderizado, **então** usa exclusivamente tokens do tema e funciona nos temas dark e light.

### Consumidores

- **Dado** um consumidor migrado, **quando** o build/testes rodam, **então** não há import de primitivo local — todos vêm de `@lobryx/design-system`.
- **Dado** um primitivo local deletado, **quando** a busca por seu símbolo é feita, **então** não há referência residual no código-fonte.
- **Dado** o `README.md` da lib, **quando** comparado à API real, **então** não há drift (ex.: `Badge status` vs `variant`).

## 4. Invariantes

- TypeScript estrito; toda mudança de API mantém compatibilidade ou é acompanhada do ajuste em todos os consumidores no mesmo PR atômico.
- Nenhuma cor, tamanho, espaçamento, raio ou breakpoint é hardcoded; somente tokens de `src/theme.css`.
- `theme.css` **não** é alterado nesta entrega (sem novos tokens).
- Acessibilidade preservada: foco visível, alvo ≥ 44px em controles, `aria-busy` em loading, `Esc`/focus-trap em modal, texto (não só cor) carrega o estado.
- `npm run build && npm test` da lib retornam exit code 0 (Proof of Run); QA adversarial valida bordas e faz Proof of Look.

## 5. Matriz de propagação

| Repo | Kit local | Ação |
|---|---|---|
| `edra` | `frontend/src/components/ui/` (17) | migrar primitivos; deletar kit; manter composições reescritas sobre a lib |
| `site` | `frontend/src/components/ui/` (18) | idem |
| `orvia` | `components/atoms/` (Button/Badge/EmptyState/fields) | idem |
| `clari` | `ui/StatCard.tsx` | substituir por `StatCard` canônico |
| `nivra` | — | verificação de não-regressão (já limpo) |

## 6. Decomposição (PRs atômicos)

1. **design-system**: v0.2.0 (paridade + `README` + testes) — *fundação*.
2. **site**: migrar para a lib e deletar `components/ui/`.
3. **edra**: migrar para a lib e deletar `components/ui/` (+ integrar o commit E2E pendente de `refactor/auth-ds`).
4. **orvia**: migrar; deletar `components/atoms/` redundantes.
5. **clari**: substituir `StatCard` local.
6. **nivra**: verificação de não-regressão.
7. **higiene (opcional)**: remover branches stale (todas contidas na `main`) em cada repo.

Cada consumidor é independente e só pode iniciar após o item 1 aprovado no
Quality Gate. A ordem 2–6 não é sequencial entre si.
