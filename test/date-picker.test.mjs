import assert from 'node:assert/strict';
import { JSDOM } from 'jsdom';
const dom = new JSDOM('<!doctype html><html><body></body></html>', { url: 'http://localhost' });
Object.assign(globalThis, { window: dom.window, document: dom.window.document, HTMLElement: dom.window.HTMLElement, Node: dom.window.Node, PointerEvent: dom.window.MouseEvent, innerWidth: 1024, innerHeight: 768 });
const React = await import('react');
const { render, fireEvent, cleanup, within } = await import('@testing-library/react');
const { DatePicker } = await import('../dist/index.js');
const labels = { placeholder: 'Choose date', today: 'Today', clear: 'Clear', previousMonth: 'Previous month', nextMonth: 'Next month', previousYear: 'Previous year', nextYear: 'Next year', month: 'Month', year: 'Year' };
const test = async (name, callback) => { await callback(); console.log(`✓ ${name}`); cleanup(); };
await test('emits exact clicked local date and closes', async () => {
  let emitted; const view = render(React.createElement(DatePicker, { value: '2024-02-01', onChange: value => { emitted = value; }, labels }));
  fireEvent.click(view.getByRole('button', { name: '01/02/2024' }));
  fireEvent.click(within(view.getByRole('dialog')).getByRole('gridcell', { name: '29' }));
  assert.match(emitted, /^\d{4}-\d{2}-\d{2}$/); assert.equal(emitted, '2024-02-29'); assert.equal(view.queryByRole('dialog'), null);
});
await test('empty value opens current month and focuses grid', async () => {
  const view = render(React.createElement(DatePicker, { value: '', onChange: () => {}, labels }));
  fireEvent.click(view.getByRole('button', { name: 'Choose date' }));
  assert.equal(view.getByRole('grid').getAttribute('aria-label'), new Intl.DateTimeFormat('pt-BR', { month: 'long', year: 'numeric' }).format(new Date(new Date().getFullYear(), new Date().getMonth(), 1)));
  assert.equal(document.activeElement.getAttribute('role'), 'gridcell'); assert.ok(view.getAllByRole('row')[0].getAttribute('aria-label'));
});
await test('Escape restores trigger focus and outside pointer closes', async () => {
  const view = render(React.createElement('div', null, React.createElement(DatePicker, { value: '', onChange: () => {}, labels }), React.createElement('button', null, 'Outside')));
  const trigger = view.getByRole('button', { name: 'Choose date' }); fireEvent.click(trigger); fireEvent.keyDown(document, { key: 'Escape' });
  assert.equal(view.queryByRole('dialog'), null); assert.equal(document.activeElement, trigger);
  fireEvent.click(trigger); fireEvent.pointerDown(view.getByRole('button', { name: 'Outside' })); assert.equal(view.queryByRole('dialog'), null);
});
await test('keyboard navigation selects date and shared position helper clamps and flips', async () => {
  let emitted; const view = render(React.createElement(DatePicker, { value: '2024-02-15', onChange: value => { emitted = value; }, labels }));
  fireEvent.click(view.getByRole('button', { name: '15/02/2024' })); const day = view.getByRole('gridcell', { name: '15' });
  fireEvent.keyDown(day, { key: 'ArrowRight' }); fireEvent.keyDown(day, { key: 'PageDown' });
  assert.equal(view.getByRole('grid').getAttribute('aria-label'), 'março de 2024');
  fireEvent.click(view.getByRole('gridcell', { name: '15' })); assert.equal(emitted, '2024-03-15');
  const rect = (await import('../dist/index.js')).positionDateTimePopover({ left: 980, right: 1000, top: 335, bottom: 355, width: 20 }, { width: 320, height: 404 }, { width: 1024, height: 560 });
  assert.ok(rect.left + rect.width <= 1016); assert.ok(rect.maxHeight <= 544); assert.ok(rect.top < 335);
});
