import assert from 'node:assert/strict';
import React from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { Alert, AppShell, AppSidebar, AppTopbar, AuthCard, AuthFooter, AuthHeader, AuthSubmitButton, Badge, Button, Card, Checkbox, Container, DashboardGrid, EmptyState, ErrorAlert, ErrorState, Grid, KpiCard, LoadingState, Modal, PageHeader, PasswordField, Select, Skeleton, Stack, StatCard, Table, TableBody, TableCaption, TableCell, TableHead, TableHeaderCell, TableRow, Text, Textarea, TextField, Toggle, Wordmark } from '../dist/index.js';
import { readFile } from 'node:fs/promises';

const markup = renderToStaticMarkup(
  React.createElement(
    Card,
    null,
    React.createElement(Button, { variant: 'danger', size: 'lg', loading: true }, 'Save'),
    React.createElement(Badge, { variant: 'neutral', icon: '•' }, 'Healthy'),
    React.createElement(KpiCard, { label: 'Revenue', value: '$100' }),
    React.createElement(Skeleton, { className: 'h-4 w-32' })
  )
);
const enabledLinkMarkup = renderToStaticMarkup(React.createElement(Button, { href: '/details' }, 'Details'));
const disabledLinkMarkup = renderToStaticMarkup(React.createElement(
  Button,
  { href: '/details', disabled: true, onClick: () => { throw new Error('disabled link clicked'); } },
  'Details'
));
const loadingLinkMarkup = renderToStaticMarkup(React.createElement(
  Button,
  { href: '/details', loading: true },
  'Details'
));
const loadingLinkElement = Button({ href: '/details', loading: true, children: 'Details' });
let loadingLinkPrevented = false;
loadingLinkElement.props.onClick({ preventDefault: () => { loadingLinkPrevented = true; } });
const modalMarkup = renderToStaticMarkup(React.createElement(
  React.Fragment,
  null,
  React.createElement(Modal, { isOpen: true, title: 'First', subtitle: 'First details', onClose: () => {} }, 'Content'),
  React.createElement(Modal, { isOpen: true, title: 'Second', onClose: () => {} }, 'Content')
));
const modalSizesMarkup = renderToStaticMarkup(React.createElement(
  React.Fragment,
  null,
  React.createElement(Modal, { isOpen: true, title: 'Small', size: 'sm', onClose: () => {} }, 'Content'),
  React.createElement(Modal, { isOpen: true, title: 'Medium', size: 'md', onClose: () => {} }, 'Content'),
  React.createElement(Modal, { isOpen: true, title: 'Large', size: 'lg', onClose: () => {} }, 'Content'),
  React.createElement(Modal, { isOpen: true, title: 'Extra large', size: 'xl', onClose: () => {} }, 'Content')
));
const textareaMarkup = renderToStaticMarkup(React.createElement(Textarea, {
  id: 'bio',
  name: 'bio',
  label: 'Biography',
  hint: 'Tell us about yourself',
  error: 'Biography is required'
}));
const fieldStatesMarkup = renderToStaticMarkup(React.createElement(
  React.Fragment,
  null,
  React.createElement(Checkbox, { checked: true, onChange: () => {}, label: 'Remember', description: 'Keep signed in' }),
  React.createElement(Toggle, { checked: false, onChange: () => {}, label: 'Alerts', description: 'Send notifications' }),
  React.createElement(Select, { label: 'Status', error: 'Status is required', options: [{ value: '', label: 'Choose' }] })
));
const explicitControlMarkup = renderToStaticMarkup(React.createElement(
  React.Fragment,
  null,
  React.createElement(Checkbox, { checked: true, onChange: () => {}, id: 'remember', name: 'remember', label: 'Remember', description: 'Keep signed in' }),
  React.createElement(Toggle, { checked: false, onChange: () => {}, id: 'alerts', name: 'alerts', label: 'Alerts', description: 'Send notifications' })
));

const authMarkup = renderToStaticMarkup(React.createElement(
  AuthCard,
  { header: 'Header', footer: 'Footer' },
  React.createElement(TextField, { id: 'email', label: 'Email', hint: 'Use your work email', error: 'Required' }),
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
const layoutMarkup = renderToStaticMarkup(React.createElement(
  Stack,
  { gap: 2 },
  React.createElement(Text, { variant: 'h2', tone: 'accent' }, 'Section'),
  React.createElement(Grid, { columns: 1, mdColumns: 2 }, React.createElement('span', null, 'Grid item')),
  React.createElement(DashboardGrid, null, React.createElement('span', null, 'Dashboard item')),
  React.createElement(EmptyState, { title: 'Nothing here', description: 'Try another filter', action: { label: 'Create' } }),
  React.createElement(ErrorState, { title: 'Failed', description: 'Try again', retry: { label: 'Retry', href: '/retry' } }),
  React.createElement(LoadingState, { message: 'Loading data' }),
  React.createElement(Select, { label: 'Status', options: [{ value: 'open', label: 'Open' }] }),
  React.createElement(Checkbox, { checked: true, onChange: () => {}, label: 'Remember me', description: 'Keep this device signed in' }),
  React.createElement(Toggle, { checked: false, onChange: () => {}, label: 'Notifications' }),
  React.createElement(Modal, { isOpen: true, title: 'Confirm', onClose: () => {} }, 'Modal content'),
  React.createElement(Alert, { tone: 'success' }, 'Saved'),
  React.createElement(StatCard, { title: 'Users', value: '42', secondaryValue: 'This month' }),
  React.createElement(Table, { density: 'compact' },
    React.createElement(TableCaption, null, 'Data caption'),
    React.createElement(TableHead, null, React.createElement(TableRow, null, React.createElement(TableHeaderCell, null, 'Name'))),
    React.createElement(TableBody, null, React.createElement(TableRow, null, React.createElement(TableCell, null, 'Ada')))
  )
));

assert.match(markup, /Save/);
assert.match(markup, /bg-status-error/);
assert.match(markup, /aria-busy="true"/);
assert.match(markup, /min-h-11/);
assert.match(markup, /Healthy/);
assert.match(markup, /Revenue/);
assert.match(markup, /aria-hidden="true"/);
assert.match(markup, /animate-pulse/);
assert.match(markup, /bg-\[var\(--color-skeleton\)\]/);
assert.match(enabledLinkMarkup, /<a[^>]*href="\/details"[^>]*>Details<\/a>/);
assert.match(disabledLinkMarkup, /<a[^>]*aria-disabled="true"[^>]*tabindex="-1"[^>]*>Details<\/a>/);
assert.doesNotMatch(disabledLinkMarkup, /href="\/details"/);
assert.match(loadingLinkMarkup, /<a[^>]*aria-busy="true"[^>]*>/);
assert.match(loadingLinkMarkup, /<a[^>]*aria-disabled="true"[^>]*>/);
assert.match(loadingLinkMarkup, /<a[^>]*tabindex="-1"[^>]*>.*Details<\/a>/);
assert.doesNotMatch(loadingLinkMarkup, /href="\/details"/);
assert.doesNotMatch(loadingLinkMarkup, /Loading/);
assert.equal(loadingLinkPrevented, true);
assert.match(authMarkup, /Header/);
assert.match(authMarkup, /aria-invalid="true"/);
assert.match(authMarkup, /aria-describedby="email-hint email-error"/);
assert.match(authMarkup, /email-hint/);
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
assert.match(authFooterMarkup, /text-foreground-secondary hover:text-accent-text/);
assert.match(authFooterMarkup, /bg-border rounded-full/);
assert.match(authFooterMarkup, /Setup/);
assert.match(desktopShellMarkup, /flex h-screen overflow-hidden bg-background text-foreground/);
assert.match(desktopShellMarkup, /aria-current="page"/);
assert.match(desktopShellMarkup, /Open navigation/);
assert.doesNotMatch(desktopShellMarkup, /<aside[^>]*(?:aria-hidden|\binert\b)/);
assert.match(mobileClosedShellMarkup, /<aside[^>]*aria-hidden="true"/);
assert.match(mobileClosedShellMarkup, /<aside[^>]*\binert\b/);
assert.match(layoutMarkup, /<h2[^>]*text-h2[^>]*>Section<\/h2>/);
assert.match(layoutMarkup, /<h2[^>]*normal-case[^>]*tracking-normal[^>]*>Nothing here<\/h2>/);
assert.match(layoutMarkup, /<h2[^>]*normal-case[^>]*tracking-normal[^>]*>Failed<\/h2>/);
assert.match(layoutMarkup, /grid grid-cols-1[^>]*md:grid-cols-2/);
assert.match(layoutMarkup, /<section[^>]*>.*Nothing here/);
assert.match(layoutMarkup, /<button[^>]*>Create<\/button>/);
assert.match(layoutMarkup, /<a[^>]*href="\/retry"[^>]*>Retry<\/a>/);
assert.match(layoutMarkup, /role="alert"/);
assert.match(layoutMarkup, /aria-busy="true"/);
assert.match(layoutMarkup, /Loading data/);
assert.match(layoutMarkup, /<select/);
assert.match(layoutMarkup, /role="switch"/);
assert.match(layoutMarkup, /aria-modal="true"/);
assert.match(modalMarkup, /<div[^>]*role="dialog"[^>]*aria-modal="true"[^>]*aria-labelledby="([^"]+)"[^>]*aria-describedby="([^"]+)"/);
const modalTitleIds = [...modalMarkup.matchAll(/<h2 id="([^"]+)"/g)].map((match) => match[1]);
assert.equal(new Set(modalTitleIds).size, 2);
assert.match(modalMarkup, /aria-labelledby="[^"]+"/);
assert.match(modalMarkup, /aria-describedby="[^"]+"/);
assert.match(modalSizesMarkup, /w-full max-w-md/);
assert.match(modalSizesMarkup, /w-full max-w-lg/);
assert.match(modalSizesMarkup, /w-full max-w-2xl/);
assert.match(modalSizesMarkup, /w-full max-w-3xl/);
assert.match(textareaMarkup, /<label[^>]*for="bio"[^>]*>Biography<\/label>/);
assert.match(textareaMarkup, /<textarea[^>]*name="bio"[^>]*id="bio"[^>]*aria-invalid="true"[^>]*aria-describedby="bio-hint bio-error"/);
assert.match(textareaMarkup, /<p id="bio-hint"[^>]*>Tell us about yourself<\/p>/);
assert.match(textareaMarkup, /<p id="bio-error"[^>]*role="alert"[^>]*>Biography is required<\/p>/);
assert.match(explicitControlMarkup, /<label[^>]*for="remember"[^>]*>.*<input id="remember"[^>]*name="remember"/);
assert.match(explicitControlMarkup, /aria-describedby="remember-description"/);
assert.match(explicitControlMarkup, /<label[^>]*for="alerts"[^>]*>.*<input id="alerts"[^>]*name="alerts"/);
assert.match(explicitControlMarkup, /aria-describedby="alerts-description"/);
assert.match(fieldStatesMarkup, /<label[^>]*for="checkbox-[^"]+"/);
assert.match(fieldStatesMarkup, /<input[^>]*type="checkbox"[^>]*aria-describedby="checkbox-[^"]+-description"[^>]*checked=""/);
assert.match(fieldStatesMarkup, /<label[^>]*for="toggle-[^"]+"/);
assert.match(fieldStatesMarkup, /<input[^>]*role="switch"[^>]*aria-checked="false"[^>]*aria-describedby="toggle-[^"]+-description"/);
assert.match(fieldStatesMarkup, /<select[^>]*aria-invalid="true"[^>]*aria-describedby="select-[^"]+-error"/);
assert.match(fieldStatesMarkup, /<p id="select-[^"]+-error" role="alert"[^>]*>Status is required<\/p>/);
assert.match(layoutMarkup, /Saved/);
assert.match(layoutMarkup, /Users/);
assert.match(layoutMarkup, /<table[^>]*>/);
assert.match(layoutMarkup, /<th scope="col"/);
assert.match(layoutMarkup, /Data caption/);

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
assert.match(lightTheme, /--_ds-accent-text: #9a3412/);

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

assert.match(desktopShellMarkup, /aria-current="page"[^>]*class="[^"]*text-accent-text/,
  'active sidebar item must use the AA-safe accent text token');

for (const [name, themeBlock] of [['dark', darkTheme], ['light', lightTheme]]) {
  const accentText = parseHex(themeBlock, '--_ds-accent-text');
  const surface = parseHex(themeBlock, '--_ds-surface');
  const background = parseHex(themeBlock, '--_ds-background');
  const secondary = parseHex(themeBlock, '--_ds-foreground-secondary');
  assert.ok(accentText && surface && background && secondary);
  assert.ok(contrast(accentText, surface) >= 4.5,
    `${name} accent text contrast against surface must meet AA`);
  assert.ok(contrast(accentText, background) >= 4.5,
    `${name} accent text contrast against background must meet AA`);
  assert.ok(contrast(secondary, surface) >= 4.5,
    `${name} AuthFooter link contrast against surface must meet AA`);
}
