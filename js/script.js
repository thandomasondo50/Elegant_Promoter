/* ============================================================
   Elegant Promoter's Stationary Supply — Order Form
   ------------------------------------------------------------
   1. Deploy the Google Apps Script (see apps-script.gs + README).
   2. Paste the deployed Web App URL below.
   ============================================================ */

const SCRIPT_URL = "PASTE_YOUR_GOOGLE_APPS_SCRIPT_WEB_APP_URL_HERE";

document.addEventListener('DOMContentLoaded', () => {
  const addBtn = document.getElementById('add-item-btn');
  const itemsWrap = document.getElementById('order-items');
  const form = document.getElementById('order-form');
  const submitBtn = document.getElementById('submit-btn');
  const statusBox = document.getElementById('form-status');

  if (!addBtn || !form) return;

  addBtn.addEventListener('click', () => {
    const row = document.createElement('div');
    row.className = 'order-item-row';
    row.innerHTML = `
      <input type="text" placeholder="e.g. Blue Ballpoint Pens" class="item-name">
      <input type="number" placeholder="Qty" min="1" class="item-qty">
      <button type="button" class="remove-item-btn" onclick="removeItemRow(this)" aria-label="Remove item">&times;</button>
    `;
    itemsWrap.appendChild(row);
  });

  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    statusBox.className = 'form-status';
    statusBox.textContent = '';

    // Build a readable items summary from the dynamic rows
    const rows = itemsWrap.querySelectorAll('.order-item-row');
    const items = [];
    rows.forEach(row => {
      const name = row.querySelector('.item-name').value.trim();
      const qty = row.querySelector('.item-qty').value.trim();
      if (name) items.push(`${name} x${qty || 1}`);
    });

    if (items.length === 0) {
      statusBox.textContent = 'Add at least one item before submitting.';
      statusBox.classList.add('err', 'show');
      return;
    }

    document.getElementById('items-summary').value = items.join('; ');

    if (SCRIPT_URL.includes('PASTE_YOUR')) {
      statusBox.textContent = 'Form is not connected to Google Sheets yet — see the README for setup steps.';
      statusBox.classList.add('err', 'show');
      return;
    }

    submitBtn.disabled = true;
    submitBtn.textContent = 'Submitting...';

    const formData = new FormData(form);

    try {
      // Apps Script web apps don't return readable CORS headers to fetch,
      // so we submit with no-cors and treat a resolved promise as success.
      await fetch(SCRIPT_URL, {
        method: 'POST',
        mode: 'no-cors',
        body: formData
      });

      statusBox.textContent = "Order sent — we'll be in touch shortly to confirm.";
      statusBox.classList.add('ok', 'show');
      form.reset();
      itemsWrap.innerHTML = `
        <div class="order-item-row">
          <input type="text" placeholder="e.g. A4 Copy Paper (Ream)" class="item-name">
          <input type="number" placeholder="Qty" min="1" class="item-qty">
          <button type="button" class="remove-item-btn" onclick="removeItemRow(this)" aria-label="Remove item">&times;</button>
        </div>
      `;
    } catch (err) {
      statusBox.textContent = "Something went wrong sending your order. Please try again or contact us directly.";
      statusBox.classList.add('err', 'show');
    } finally {
      submitBtn.disabled = false;
      submitBtn.textContent = 'Submit Order';
    }
  });
});

function removeItemRow(btn) {
  const wrap = document.getElementById('order-items');
  if (wrap.querySelectorAll('.order-item-row').length > 1) {
    btn.closest('.order-item-row').remove();
  } else {
    // Keep at least one row — just clear it
    const row = btn.closest('.order-item-row');
    row.querySelector('.item-name').value = '';
    row.querySelector('.item-qty').value = '';
  }
}
