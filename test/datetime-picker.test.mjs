import assert from 'node:assert/strict';
import { JSDOM } from 'jsdom';
const dom = new JSDOM('<!doctype html><html><body></body></html>', { url: 'http://localhost' });
Object.assign(globalThis, { window: dom.window, document: dom.window.document, HTMLElement: dom.window.HTMLElement, Node: dom.window.Node, PointerEvent: dom.window.MouseEvent, innerWidth: 1024, innerHeight: 768 });
const React = await import('react');
const { render, fireEvent, cleanup, act, within } = await import('@testing-library/react');
const { DateTimePicker, getMonthGrid, positionDateTimePopover } = await import('../dist/index.js');
const labels = { placeholder: 'Choose date', today: 'Today', clear: 'Clear', previousMonth: 'Previous month', nextMonth: 'Next month', previousYear: 'Previous year', nextYear: 'Next year', month: 'Month', year: 'Year', hour: 'Hour', minute: 'Minute' };
const test = async (name, callback) => { await callback(); console.log(`✓ ${name}`); cleanup(); };
await test('open and close popover', async () => {
  const view = render(React.createElement(DateTimePicker, { value: '', onChange: () => {}, labels }));
  fireEvent.click(view.getByRole('button', { name: 'Choose date' }));
  assert.ok(view.getByRole('dialog'));
  fireEvent.click(view.getByRole('button', { name: 'Choose date' }));
  assert.equal(view.queryByRole('dialog'), null);
});
await test('selecting a day emits exact local string, independent of timezone', async () => {
  let emitted;
  const view = render(React.createElement(DateTimePicker, { value: '2024-02-01T09:07', onChange: (value) => { emitted = value; }, labels }));
  fireEvent.click(view.getByRole('button', { name: '01/02/2024, 09:07' }));
  fireEvent.click(within(view.getByRole('dialog')).getByRole('gridcell', { name: '29' }));
  assert.equal(emitted, '2024-02-29T09:07');
  console.log(`VALUE=${emitted}`);
});
await test('Escape closes and restores focus to trigger', async () => {
  const view = render(React.createElement(DateTimePicker, { value: '', onChange: () => {}, labels }));
  const trigger = view.getByRole('button', { name: 'Choose date' });
  fireEvent.click(trigger);
  fireEvent.keyDown(document, { key: 'Escape' });
  assert.equal(view.queryByRole('dialog'), null);
  assert.equal(document.activeElement, trigger);
});
await test('outside click closes popover', async () => {
  const view = render(React.createElement('div', null, React.createElement(DateTimePicker, { value: '', onChange: () => {}, labels }), React.createElement('button', null, 'Outside')));
  fireEvent.click(view.getByRole('button', { name: 'Choose date' }));
  fireEvent.pointerDown(view.getByRole('button', { name: 'Outside' }));
  assert.equal(view.queryByRole('dialog'), null);
});
await test('keyboard arrows, Home, End, PageUp and PageDown navigate grid', async () => {
  const view = render(React.createElement(DateTimePicker, { value: '2024-02-15T09:07', onChange: () => {}, labels }));
  fireEvent.click(view.getByRole('button', { name: '15/02/2024, 09:07' }));
  const day = view.getByRole('gridcell', { name: '15' });
  for (const key of ['ArrowRight', 'ArrowLeft', 'ArrowDown', 'ArrowUp', 'Home', 'End']) fireEvent.keyDown(day, { key });
  fireEvent.keyDown(day, { key: 'PageDown' });
  assert.equal(view.getByRole('grid').getAttribute('aria-label'), 'março de 2024');
  fireEvent.keyDown(view.getByRole('gridcell', { name: '15' }), { key: 'PageUp' });
  assert.equal(view.getByRole('grid').getAttribute('aria-label'), 'fevereiro de 2024');
});
await test('popover clamps at right edge and flips above when below space is insufficient', async () => {
  const rect = positionDateTimePopover({ left: 980, right: 1000, top: 30, bottom: 50, width: 20 }, { width: 220, height: 180 }, { width: 1024, height: 768 });
  assert.ok(rect.left + rect.width <= 1024 - 8);
  const flipped = positionDateTimePopover({ left: 20, right: 40, top: 250, bottom: 270, width: 20 }, { width: 200, height: 180 }, { width: 300, height: 300 });
  assert.ok(flipped.top < 250);
});
await test('month grid handles Sunday first and Sunday last', async () => {
  const startsSunday = getMonthGrid(2023, 9); // October 2023
  const endsSunday = getMonthGrid(2023, 11); // December 2023
  assert.equal(startsSunday.find((date) => date !== null)?.getDate(), 1);
  assert.equal(startsSunday.find((date) => date !== null)?.getDay(), 0);
  assert.equal(endsSunday.at(-1)?.getDate(), 31);
  assert.equal(endsSunday.at(-1)?.getDay(), 0);
  assert.equal(endsSunday.length % 7, 0);
});
await test('open moves focus into named grid; Tab and Shift+Tab stay in popover', async () => {
  const view = render(React.createElement(DateTimePicker, { value: '2024-02-15T09:07', onChange: () => {}, labels }));
  const trigger = view.getByRole('button', { name: '15/02/2024, 09:07' });
  fireEvent.click(trigger);
  const grid = view.getByRole('grid', { name: 'fevereiro de 2024' });
  assert.equal(document.activeElement, view.getByRole('gridcell', { name: '15' }));
  assert.ok(grid.querySelector('[role="row"]'));
  const firstControl = view.getByRole('button', { name: 'Previous year' });
  firstControl.focus();
  fireEvent.keyDown(firstControl, { key: 'Tab', shiftKey: true });
  assert.equal(document.activeElement.textContent, 'Clear');
  fireEvent.keyDown(document.activeElement, { key: 'Tab' });
  assert.equal(document.activeElement, firstControl);
});
await test('scroll and resize reposition the open popover', async () => {
  const view = render(React.createElement(DateTimePicker, { value: '', onChange: () => {}, labels }));
  const trigger = view.getByRole('button', { name: 'Choose date' });
  trigger.getBoundingClientRect = () => ({ left: 200, right: 240, top: 100, bottom: 120, width: 40, height: 20 });
  fireEvent.click(trigger);
  const dialog = view.getByRole('dialog');
  dialog.getBoundingClientRect = () => ({ left: 0, right: 150, top: 0, bottom: 200, width: 150, height: 200 });
  await act(async () => { window.dispatchEvent(new dom.window.Event('scroll')); });
  assert.equal(dialog.style.left, '200px');
  trigger.getBoundingClientRect = () => ({ left: 100, right: 140, top: 120, bottom: 140, width: 40, height: 20 });
  await act(async () => { window.dispatchEvent(new dom.window.Event('resize')); });
  assert.equal(dialog.style.left, '100px');
});
await test('adversarial time values clamp and malformed values emit valid local format', async () => {
  let emitted;
  const view = render(React.createElement(DateTimePicker, { value: '2024-02-01T00:00', onChange: (value) => { emitted = value; }, labels }));
  fireEvent.click(view.getByRole('button', { name: '01/02/2024, 00:00' }));
  fireEvent.change(view.getByRole('spinbutton', { name: 'Hour' }), { target: { value: '99' } });
  assert.equal(emitted, '2024-02-01T23:00');
  view.rerender(React.createElement(DateTimePicker, { value: '2024-02-01T12:00', onChange: (value) => { emitted = value; }, labels }));
  fireEvent.change(view.getByRole('spinbutton', { name: 'Minute' }), { target: { value: '-5' } });
  assert.equal(emitted, '2024-02-01T12:00');
  view.rerender(React.createElement(DateTimePicker, { value: 'bad-value', onChange: (value) => { emitted = value; }, labels }));
  fireEvent.change(view.getByRole('spinbutton', { name: 'Hour' }), { target: { value: '4' } });
  assert.equal(emitted, '2024-02-01T04:00');
  assert.match(emitted, /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}$/);
});
await test('viewport 320x667 clamps trigger at lower right corner', async () => {
  const position = positionDateTimePopover({ left: 300, right: 320, top: 640, bottom: 660, width: 20 }, { width: 220, height: 180 }, { width: 320, height: 667 });
  assert.ok(position.left + position.width <= 312);
  assert.ok(position.top < 640);
  assert.ok(position.top >= 8);
});
await test('20 open-close cycles remove document listeners without accumulation', async () => {
  const originalAdd = document.addEventListener.bind(document);
  const originalRemove = document.removeEventListener.bind(document);
  const added = new Map(); const removed = new Map();
  document.addEventListener = (type, listener, options) => { added.set(type, (added.get(type) ?? 0) + 1); return originalAdd(type, listener, options); };
  document.removeEventListener = (type, listener, options) => { removed.set(type, (removed.get(type) ?? 0) + 1); return originalRemove(type, listener, options); };
  try {
    const view = render(React.createElement(DateTimePicker, { value: '', onChange: () => {}, labels }));
    const trigger = view.getByRole('button', { name: 'Choose date' });
    for (let cycle = 0; cycle < 20; cycle++) {
      fireEvent.click(trigger);
      fireEvent.keyDown(document, { key: 'Escape' });
    }
    assert.equal(added.get('pointerdown'), 20);
    assert.equal(removed.get('pointerdown'), 20);
    assert.equal(added.get('keydown'), 20);
    assert.equal(removed.get('keydown'), 20);
  } finally {
    document.addEventListener = originalAdd;
    document.removeEventListener = originalRemove;
  }
});
await test('trigger formats the local date and time in pt-BR', async () => {
  const view = render(React.createElement(DateTimePicker, { value: '2024-02-29T09:07', onChange: () => {}, labels }));
  assert.ok(view.getByRole('button', { name: '29/02/2024, 09:07' }));
});
await test('month and year selects navigate calendar using localized names', async () => {
  const view = render(React.createElement(DateTimePicker, { value: '2024-02-15T09:07', onChange: () => {}, labels }));
  fireEvent.click(view.getByRole('button', { name: '15/02/2024, 09:07' }));
  fireEvent.change(view.getByRole('combobox', { name: 'Month' }), { target: { value: '5' } });
  assert.equal(view.getByRole('grid').getAttribute('aria-label'), 'junho de 2024');
  fireEvent.change(view.getByRole('combobox', { name: 'Year' }), { target: { value: '2025' } });
  assert.equal(view.getByRole('grid').getAttribute('aria-label'), 'junho de 2025');
});
await test('year arrows jump a year and month arrows still navigate months', async () => {
  const view = render(React.createElement(DateTimePicker, { value: '2024-02-15T09:07', onChange: () => {}, labels }));
  fireEvent.click(view.getByRole('button', { name: '15/02/2024, 09:07' }));
  fireEvent.click(view.getByRole('button', { name: 'Previous year' }));
  assert.equal(view.getByRole('grid').getAttribute('aria-label'), 'fevereiro de 2023');
  fireEvent.click(view.getByRole('button', { name: 'Next year' }));
  assert.equal(view.getByRole('grid').getAttribute('aria-label'), 'fevereiro de 2024');
  fireEvent.click(view.getByRole('button', { name: 'Next month' }));
  assert.equal(view.getByRole('grid').getAttribute('aria-label'), 'março de 2024');
  fireEvent.click(view.getByRole('button', { name: 'Previous month' }));
  assert.equal(view.getByRole('grid').getAttribute('aria-label'), 'fevereiro de 2024');
});
