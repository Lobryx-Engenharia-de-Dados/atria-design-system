import assert from 'node:assert/strict';
import React from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { Badge, Button, Card, KpiCard } from '../dist/index.js';

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
