import assert from 'node:assert/strict';
import React from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { Badge, Button, Card, KpiCard } from '../dist/index.js';
import { readFile } from 'node:fs/promises';

const markup = renderToStaticMarkup(
  React.createElement(
    Card,
    null,
    React.createElement(Button, { variant: 'primary' }, 'Save'),
    React.createElement(Badge, { status: 'success' }, 'Healthy'),
    React.createElement(KpiCard, { label: 'Revenue', value: '$100' })
  )
);

assert.match(markup, /Save/);
assert.match(markup, /bg-accent/);
assert.match(markup, /Healthy/);
assert.match(markup, /Revenue/);

const theme = await readFile(new URL('../src/theme.css', import.meta.url), 'utf8');
for (const token of [
  '--color-background', '--color-surface', '--color-primary', '--color-foreground',
  '--color-accent-foreground', '--color-inverse', '--color-status-success',
  '--color-chart-1', '--radius-lg', '--space-4', '--shadow-card', '--font-sans',
  '--font-headings', '--duration-normal', '--ease-standard'
]) {
  assert.match(theme, new RegExp(`${token}:`));
}
const darkTheme = theme.match(/:root\s*\{([\s\S]*?)\n\}/)?.[1] ?? '';
const lightTheme = theme.match(/\[data-theme='light'\]\s*\{([\s\S]*?)\n\}/)?.[1] ?? '';
assert.match(darkTheme, /color-scheme: dark/);
assert.match(lightTheme, /color-scheme: light/);
for (const token of [
  '--_ds-background', '--_ds-surface', '--_ds-border', '--_ds-foreground',
  '--_ds-accent', '--_ds-status-success', '--_ds-status-success-bg', '--_ds-chart-1'
]) {
  assert.match(darkTheme, new RegExp(`${token}:`));
  assert.match(lightTheme, new RegExp(`${token}:`));
}
assert.match(darkTheme, /--_ds-background: #010a26/);
assert.match(lightTheme, /--_ds-background: #fafafa/);
