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
  '--color-primary-light', '--color-foreground-on-dark', '--color-foreground-on-dark-muted',
  '--color-accent-foreground', '--color-accent-text', '--color-inverse', '--color-status-success',
  '--color-status-success-foreground', '--color-status-warning-foreground',
  '--color-status-error-foreground', '--color-status-info-foreground',
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
  '--_ds-accent', '--_ds-accent-text', '--_ds-status-success', '--_ds-status-success-foreground',
  '--_ds-status-warning-foreground', '--_ds-status-error-foreground', '--_ds-status-info-foreground',
  '--_ds-status-success-bg', '--_ds-chart-1'
]) {
  assert.match(darkTheme, new RegExp(`${token}:`));
  assert.match(lightTheme, new RegExp(`${token}:`));
}
assert.match(darkTheme, /--_ds-background: #010a26/);
assert.match(lightTheme, /--_ds-background: #fafafa/);
assert.match(darkTheme, /--_ds-primary-light: #0f1d3d/);
assert.match(lightTheme, /--_ds-primary-light: #f1f5f9/);
assert.match(darkTheme, /--_ds-foreground-on-dark: #ffffff/);
assert.match(darkTheme, /--_ds-foreground-on-dark-muted: rgba\(255, 255, 255, 0\.7\)/);
assert.match(darkTheme, /--_ds-accent-text: #ff8700/);
assert.match(lightTheme, /--_ds-accent-text: #c2410c/);

const statusColors = ['success', 'warning', 'error', 'info'];
const parseHex = (block, token) => block.match(new RegExp(`${token}:\\s*(#[0-9a-f]+)`))?.[1];
const luminance = (hex) => {
  const channels = [0, 2, 4].map((offset) => parseInt(hex.slice(offset + 1, offset + 3), 16) / 255);
  const linear = channels.map((channel) => channel <= 0.03928
    ? channel / 12.92
    : ((channel + 0.055) / 1.055) ** 2.4);
  return 0.2126 * linear[0] + 0.7152 * linear[1] + 0.0722 * linear[2];
};
const contrast = (foreground, background) => {
  const foregroundLuminance = luminance(foreground);
  const backgroundLuminance = luminance(background);
  return (Math.max(foregroundLuminance, backgroundLuminance) + 0.05)
    / (Math.min(foregroundLuminance, backgroundLuminance) + 0.05);
};
for (const themeBlock of [darkTheme, lightTheme]) {
  for (const status of statusColors) {
    const foreground = parseHex(themeBlock, `--_ds-status-${status}-foreground`);
    const background = parseHex(themeBlock, `--_ds-status-${status}`);
    assert.ok(foreground && background);
    assert.ok(contrast(foreground, background) >= 4.5,
      `${status} status foreground contrast must meet AA`);
  }
}
