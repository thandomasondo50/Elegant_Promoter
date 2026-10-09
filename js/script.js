/* contact.html — free-text request form. Sends to the same Apps Script backend,
   which emails you and sends the customer an automatic confirmation. */

document.addEventListener('DOMContentLoaded', () => {
  const addBtn = document.getElementById('add-item-btn');
  const itemsWrap = document.getElementById('order-items');
  const form = document.getElementById('order-form');
  const submitBtn = document.getElementById('submit-btn');
  const statusBox = document.getElementById('form-status');
  if (!addBtn || !form) return;

  const rowHtml = placeholder => `
    <input type="text" placeholder="${placeholder}" class="item-name">
    <input type="number" placeholder="Qty" min="1" class="item-qty">
    <button type="button" class="remove-item-btn" onclick="removeItemRow(this)" aria-label="Remove item">&times;</button>`;

  addBtn.addEventListener('click', () => {
    const row = document.createElement('div');
    row.className = 'order-item-row';
    row.innerHTML = rowHtml('e.g. Blue ballpoint pens');
    itemsWrap.appendChild(row);
  });

  const say = (msg, ok) => {
    statusBox.className = 'form-status ' + (ok ? 'ok' : 'err') + ' show';
    statusBox.textContent = msg;
  };

  form.addEventListener('submit', async e => {
    e.preventDefault();
    statusBox.className = 'form-status';

    const items = [];
    itemsWrap.querySelectorAll('.order-item-row').forEach(row => {
      const name = row.querySelector('.item-name').value.trim();
      const qty = row.querySelector('.item-qty').value.trim();
      if (name) items.push(`${name} x${qty || 1}`);
    });

    const type = document.getElementById('request-type').value;
    const notes = document.getElementById('notes').value.trim();
    if (!items.length && !notes) return say('Tell us what you need: add at least one item or a note.', false);

    if (API_URL.includes('PASTE_YOUR')) {
      return say('The form is not connected to your Google Sheet yet. See the README for setup.', false);
    }

    submitBtn.disabled = true;
    submitBtn.textContent = 'Sending…';

    const payload = {
      action: 'contact',
      name: document.getElementById('name').value,
      phone: document.getElementById('phone').value,
      email: document.getElementById('email').value,
      requestType: type,
      fulfilment: document.getElementById('fulfilment').value,
      items: items.join('\n'),
      notes,
      hp: ''
    };

    const ctrl = new AbortController();
    const timer = setTimeout(() => ctrl.abort(), 45000);
    try {
      const res = await fetch(API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'text/plain;charset=utf-8' },
        body: JSON.stringify(payload),
        signal: ctrl.signal
      });
      const data = await res.json();
      if (!data.ok) return say(data.error || 'Something went wrong. Please try again.', false);
      say("Thanks, we've got your request and emailed you a confirmation. We'll reply within one working day.", true);
      form.reset();
      itemsWrap.innerHTML = `<div class="order-item-row">${rowHtml('e.g. A4 Copy Paper (Ream)')}</div>`;
    } catch (err) {
      say(err.name === 'AbortError'
        ? 'This is taking longer than usual. Check your inbox in a few minutes before sending again.'
        : 'We could not send your request. Check your connection and try again.', false);
    } finally {
      clearTimeout(timer);
      submitBtn.disabled = false;
      submitBtn.textContent = 'Send request';
    }
  });
});

function removeItemRow(btn) {
  const wrap = document.getElementById('order-items');
  if (wrap.querySelectorAll('.order-item-row').length > 1) {
    btn.closest('.order-item-row').remove();
  } else {
    const row = btn.closest('.order-item-row');
    row.querySelector('.item-name').value = '';
    row.querySelector('.item-qty').value = '';
  }
}
