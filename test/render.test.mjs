import assert from 'node:assert/strict';
import React from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { AppShell, AppSidebar, AppTopbar, AuthCard, AuthFooter, AuthHeader, AuthSubmitButton, Badge, Button, Card, Container, ErrorAlert, KpiCard, PageHeader, PasswordField, Skeleton, TextField, Wordmark } from '../dist/index.js';
import { readFile } from 'node:fs/promises';

const markup = renderToStaticMarkup(
  React.createElement(
    Card,
    null,
    React.createElement(Button, { variant: 'primary' }, 'Save'),
    React.createElement(Badge, { status: 'success' }, 'Healthy'),
    React.createElement(KpiCard, { label: 'Revenue', value: '$100' }),
    React.createElement(Skeleton, { className: 'h-4 w-32' })
  )
);

const authMarkup = renderToStaticMarkup(React.createElement(
  AuthCard,
  { header: 'Header', footer: 'Footer' },
  React.createElement(TextField, { id: 'email', label: 'Email', error: 'Required' }),
  React.createElement(PasswordField, { id: 'password', label: 'Password', showLabel: 'Show password', hideLabel: 'Hide password' }),
  React.createElement(ErrorAlert, null, 'Unable to sign in'),
  React.createElement(AuthSubmitButton, { loading: true, loadingText: 'Signing in' }, 'Sign in')
));

const authHeaderMarkup = renderToStaticMarkup(React.createElement(
  AuthHeader,
  { name: 'Brand', platformName: 'Platform' }
));
const wordmarkMarkup = renderToStaticMarkup(React.createElement(Wordmark, { name: 'Nivra' }));
const authFooterMarkup = renderToStaticMarkup(React.createElement(
  AuthFooter,
  {
    links: [
      { label: 'Privacy', href: '/privacy' },
      { label: 'Terms', href: '/terms' }
    ]
  },
  React.createElement('button', { type: 'button' }, 'Setup')
));
const renderShell = (matchMediaMatches, sidebarOpen) => {
  globalThis.window = {
    matchMedia: () => ({ matches: matchMediaMatches })
  };
  return renderToStaticMarkup(React.createElement(
  AppShell,
  { sidebarOpen, sidebar: React.createElement(AppSidebar, { brand: React.createElement(Wordmark, { name: 'Lobryx' }), items: [{ label: 'Home', href: '/', active: true }] }), topbar: React.createElement(AppTopbar, { title: 'Overview' }) },
  React.createElement(Container, { size: 'lg' }, React.createElement(PageHeader, { eyebrow: 'Workspace', title: 'Overview', subtitle: 'Your activity' }))
  ));
};
const desktopShellMarkup = renderShell(true, false);
const mobileClosedShellMarkup = renderShell(false, false);

assert.match(markup, /Save/);
assert.match(markup, /bg-accent/);
assert.match(markup, /Healthy/);
assert.match(markup, /Revenue/);
assert.match(markup, /aria-hidden="true"/);
assert.match(markup, /animate-pulse/);
assert.match(markup, /bg-\[var\(--color-skeleton\)\]/);
assert.match(authMarkup, /Header/);
assert.match(authMarkup, /aria-invalid="true"/);
assert.match(authMarkup, /aria-describedby="email-error"/);
assert.match(authMarkup, /role="alert"/);
assert.match(authMarkup, /type="password"/);
assert.match(authMarkup, /aria-label="Show password"/);
assert.match(authMarkup, /<button type="button"[^>]*aria-label="Show password"/);
assert.match(authMarkup, /<svg aria-hidden="true"/);
assert.match(authMarkup, /bg-primary/);
assert.match(authMarkup, /Signing in/);
assert.match(authHeaderMarkup, /flex flex-col items-center text-center space-y-4/);
assert.match(authHeaderMarkup, /text-foreground-on-dark-muted/);
assert.match(authHeaderMarkup, /Brand/);
assert.match(authHeaderMarkup, /text-3xl/);
assert.match(authHeaderMarkup, /text-accent/);
assert.match(authHeaderMarkup, /aria-hidden="true"/);
assert.match(authHeaderMarkup, /Platform/);
assert.match(wordmarkMarkup, /Nivra/);
assert.match(wordmarkMarkup, /text-accent/);
assert.match(wordmarkMarkup, /aria-hidden="true"/);
assert.match(authFooterMarkup, /pt-8 border-t border-border\/50 flex flex-col items-center gap-6/);
assert.match(authFooterMarkup, /href="\/privacy"/);
assert.match(authFooterMarkup, /href="\/terms"/);
assert.match(authFooterMarkup, /bg-border rounded-full/);
assert.match(authFooterMarkup, /Setup/);
assert.match(desktopShellMarkup, /flex h-screen overflow-hidden bg-background text-foreground/);
assert.match(desktopShellMarkup, /aria-current="page"/);
assert.match(desktopShellMarkup, /Open navigation/);
assert.doesNotMatch(desktopShellMarkup, /<aside[^>]*(?:aria-hidden|\binert\b)/);
assert.match(mobileClosedShellMarkup, /<aside[^>]*aria-hidden="true"/);
assert.match(mobileClosedShellMarkup, /<aside[^>]*\binert\b/);

const theme = await readFile(new URL('../src/theme.css', import.meta.url), 'utf8');
for (const token of [
  '--color-background', '--color-surface', '--color-skeleton', '--color-primary', '--color-foreground',
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
assert.match(darkTheme, /--_ds-skeleton: #4b61ad/);
assert.match(lightTheme, /--_ds-skeleton: #8292a9/);
assert.match(darkTheme, /color-scheme: dark/);
assert.match(lightTheme, /color-scheme: light/);
for (const token of [
  '--_ds-background', '--_ds-surface', '--_ds-skeleton', '--_ds-border', '--_ds-foreground',
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

for (const [name, themeBlock] of [['dark', darkTheme], ['light', lightTheme]]) {
  const skeleton = parseHex(themeBlock, '--_ds-skeleton');
  const surface = parseHex(themeBlock, '--_ds-surface');
  const background = parseHex(themeBlock, '--_ds-background');
  assert.ok(skeleton && surface && background);
  assert.ok(contrast(skeleton, surface) >= 3,
    `${name} skeleton contrast against surface must meet 3:1`);
  assert.ok(contrast(skeleton, background) >= 3,
    `${name} skeleton contrast against background must meet 3:1`);
}
