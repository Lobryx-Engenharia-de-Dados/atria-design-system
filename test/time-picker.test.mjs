import assert from 'node:assert/strict';
import { JSDOM } from 'jsdom';
const dom = new JSDOM('<!doctype html><html><body></body></html>', { url: 'http://localhost' });
Object.assign(globalThis, { window: dom.window, document: dom.window.document, HTMLElement: dom.window.HTMLElement, Node: dom.window.Node, PointerEvent: dom.window.MouseEvent, innerWidth: 1024, innerHeight: 768 });
const React = await import('react');
const { render, fireEvent, cleanup } = await import('@testing-library/react');
const { TimePicker, positionDateTimePopover } = await import('../dist/index.js');
const labels = { placeholder: 'Choose time', hour: 'Hour', minute: 'Minute', clear: 'Clear' };
const test = async (name, callback) => { await callback(); console.log(`✓ ${name}`); cleanup(); };
await test('emits valid HH:mm format and clamps hour 99 to 23', async () => {
  let emitted; const view = render(React.createElement(TimePicker, { value: '00:00', onChange: value => { emitted = value; }, labels }));
  fireEvent.click(view.getByRole('button', { name: '00:00' })); fireEvent.change(view.getByRole('spinbutton', { name: 'Hour' }), { target: { value: '99' } });
  assert.match(emitted, /^\d{2}:\d{2}$/); assert.equal(emitted, '23:00');
});
await test('clamps minute -5 to 00', async () => {
  let emitted; const view = render(React.createElement(TimePicker, { value: '12:30', onChange: value => { emitted = value; }, labels }));
  fireEvent.click(view.getByRole('button', { name: '12:30' })); fireEvent.change(view.getByRole('spinbutton', { name: 'Minute' }), { target: { value: '-5' } }); assert.equal(emitted, '12:00');
});
await test('clear emits empty value and trigger uses placeholder', async () => {
  let emitted; const view = render(React.createElement(TimePicker, { value: '', onChange: value => { emitted = value; }, labels }));
  fireEvent.click(view.getByRole('button', { name: 'Choose time' })); fireEvent.click(view.getByRole('button', { name: 'Clear' })); assert.equal(emitted, '');
});
await test('Escape closes and restores trigger focus', async () => {
  const view = render(React.createElement(TimePicker, { value: '', onChange: () => {}, labels })); const trigger = view.getByRole('button', { name: 'Choose time' });
  fireEvent.click(trigger); fireEvent.keyDown(document, { key: 'Escape' }); assert.equal(view.queryByRole('dialog'), null); assert.equal(document.activeElement, trigger);
});
await test('outside click closes popover', async () => {
  const view = render(React.createElement('div', null, React.createElement(TimePicker, { value: '', onChange: () => {}, labels }), React.createElement('button', null, 'Outside')));
  fireEvent.click(view.getByRole('button', { name: 'Choose time' })); fireEvent.pointerDown(view.getByRole('button', { name: 'Outside' })); assert.equal(view.queryByRole('dialog'), null);
});
await test('opening focuses hour field and has no calendar grid', async () => {
  const view = render(React.createElement(TimePicker, { value: '09:07', onChange: () => {}, labels })); fireEvent.click(view.getByRole('button', { name: '09:07' }));
  assert.equal(document.activeElement, view.getByRole('spinbutton', { name: 'Hour' })); assert.equal(view.queryByRole('grid'), null);
});
await test('reuses shared popover clamping and flipping geometry', async () => {
  const rect = positionDateTimePopover({ left: 980, right: 1000, top: 250, bottom: 270, width: 20 }, { width: 320, height: 400 }, { width: 1024, height: 300 });
  assert.ok(rect.left + rect.width <= 1016); assert.ok(rect.top >= 8); assert.ok(rect.maxHeight <= 284); assert.ok(rect.top + rect.height <= 242);
});
await test('external label composition preserves trigger id, class and described-by ids', async () => {
  const view = render(React.createElement(TimePicker, { id: 'external-time', value: '', onChange: () => {}, labels, triggerClassName: 'local-trigger', 'aria-describedby': 'external-help', hint: 'Hint', error: 'Error' }));
  const trigger = view.getByRole('button');
  assert.equal(trigger.id, 'external-time'); assert.ok(trigger.classList.contains('local-trigger'));
  assert.equal(trigger.getAttribute('aria-describedby'), 'external-help external-time-hint external-time-error');
  assert.equal(view.container.querySelector('label[for="external-time"]'), null);
});
