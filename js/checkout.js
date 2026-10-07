/* Checkout — collects details, builds order payload, POSTs to Apps Script. */

const SCRIPT_URL = "PASTE_YOUR_GOOGLE_APPS_SCRIPT_WEB_APP_URL_HERE";

document.addEventListener('DOMContentLoaded', () => {
  const container = document.getElementById('checkout-container');
  if (!container) return;

  const items = Cart.detailed();
  if (!items.length) {
    container.innerHTML = `
      <div class="empty-cart">
        <h2>Your cart is empty</h2>
        <p>Add items before checking out.</p>
        <a href="products.html" class="btn btn-navy">Shop Products</a>
      </div>`;
    return;
  }

  const subtotal = Cart.subtotal();
  const delivery = subtotal >= 500 ? 0 : 65;
  const total = subtotal + delivery;

  container.innerHTML = `
    <div class="checkout-layout">
      <form id="checkout-form">
        <div class="checkout-section">
          <h3>Contact Details</h3>
          <div class="form-row">
            <div class="field">
              <label for="co-name">Full name *</label>
              <input type="text" id="co-name" name="name" required>
            </div>
            <div class="field">
              <label for="co-phone">Phone number *</label>
              <input type="tel" id="co-phone" name="phone" required>
            </div>
          </div>
          <div class="field" style="margin-top:18px">
            <label for="co-email">Email address *</label>
            <input type="email" id="co-email" name="email" required>
          </div>
        </div>

        <div class="checkout-section">
          <h3>Delivery or Collection</h3>
          <div class="delivery-options">
            <label class="delivery-option">
              <input type="radio" name="fulfilment" value="Delivery" checked>
              <span>
                <span class="opt-title">Delivery</span>
                <span class="opt-desc">${delivery === 0 ? 'Free — order over R500' : 'R65 — delivered to your door'}</span>
              </span>
            </label>
            <label class="delivery-option">
              <input type="radio" name="fulfilment" value="Collection">
              <span>
                <span class="opt-title">Collection</span>
                <span class="opt-desc">Free — collect once we confirm your order</span>
              </span>
            </label>
          </div>
        </div>

        <div class="checkout-section" id="address-section">
          <h3>Delivery Address</h3>
          <div class="field">
            <label for="co-address">Street address *</label>
            <input type="text" id="co-address" name="address" required>
          </div>
          <div class="form-row" style="margin-top:18px">
            <div class="field">
              <label for="co-suburb">Suburb / City *</label>
              <input type="text" id="co-suburb" name="suburb" required>
            </div>
            <div class="field">
              <label for="co-postal">Postal code *</label>
              <input type="text" id="co-postal" name="postal" required>
            </div>
          </div>
        </div>

        <div class="checkout-section">
          <h3>Order Notes</h3>
          <div class="field">
            <label for="co-notes">Anything we should know? (optional)</label>
            <textarea id="co-notes" name="notes" placeholder="Preferred delivery time, brand preferences, special instructions…"></textarea>
          </div>
        </div>

        <div class="form-status" id="checkout-status"></div>

        <button type="submit" class="btn btn-navy btn-full" id="place-order-btn" style="margin-top:22px">
          Place Order — ${formatPrice(total)}
        </button>
        <p style="font-size:0.78rem;color:var(--ink-soft);text-align:center;margin-top:14px;">
          By placing your order you agree to be contacted to confirm pricing and availability.
          No payment is taken now.
        </p>
      </form>

      <aside class="cart-summary">
        <h3>Your Order</h3>
        <div style="max-height:320px;overflow-y:auto;margin-bottom:20px;padding-right:6px;">
          ${items.map(i => `
            <div style="display:flex;gap:12px;padding:10px 0;border-bottom:1px solid rgba(198,161,91,0.12);">
              <div style="flex:1">
                <div style="font-size:0.88rem;color:var(--cream);">${i.name}</div>
                <div style="font-size:0.75rem;color:var(--gold-light);opacity:0.7;">Qty ${i.qty} × ${formatPrice(i.price)}</div>
              </div>
              <div style="font-size:0.88rem;color:var(--gold-light);">${formatPrice(i.lineTotal)}</div>
            </div>
          `).join('')}
        </div>
        <div class="summary-row"><span>Subtotal</span><span>${formatPrice(subtotal)}</span></div>
        <div class="summary-row" id="co-delivery-row"><span>Delivery</span><span>${delivery === 0 ? 'Free' : formatPrice(delivery)}</span></div>
        <div class="summary-row total"><span>Total</span><span id="co-total">${formatPrice(total)}</span></div>
      </aside>
    </div>
  `;

  // Toggle address section based on fulfilment
  const addressSection = document.getElementById('address-section');
  const addressInputs = addressSection.querySelectorAll('input');
  document.querySelectorAll('input[name="fulfilment"]').forEach(radio => {
    radio.addEventListener('change', () => {
      const isDelivery = radio.value === 'Delivery' && radio.checked;
      if (document.querySelector('input[name="fulfilment"]:checked').value === 'Delivery') {
        addressSection.style.display = '';
        addressInputs.forEach(i => i.required = true);
        document.getElementById('co-delivery-row').innerHTML = `<span>Delivery</span><span>${delivery === 0 ? 'Free' : formatPrice(delivery)}</span>`;
        document.getElementById('co-total').textContent = formatPrice(total);
      } else {
        addressSection.style.display = 'none';
        addressInputs.forEach(i => i.required = false);
        document.getElementById('co-delivery-row').innerHTML = `<span>Delivery</span><span>Free (collection)</span>`;
        document.getElementById('co-total').textContent = formatPrice(subtotal);
      }
    });
  });

  // Submit
  const form = document.getElementById('checkout-form');
  const statusBox = document.getElementById('checkout-status');
  const submitBtn = document.getElementById('place-order-btn');

  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    statusBox.className = 'form-status';

    const fd = new FormData(form);
    const fulfilment = fd.get('fulfilment');

    // Build items summary line
    const itemsSummary = items.map(i => `${i.name} x${i.qty}`).join('; ');
    const orderTotal = fulfilment === 'Delivery' ? total : subtotal;
    const ref = 'EP-' + Date.now().toString().slice(-8);

    fd.append('items', itemsSummary);
    fd.append('orderTotal', formatPrice(orderTotal));
    fd.append('orderRef', ref);
    fd.append('submittedAt', new Date().toISOString());

    if (SCRIPT_URL.includes('PASTE_YOUR')) {
      // Demo mode — simulate success
      console.log('Order payload (not sent — SCRIPT_URL not set):', Object.fromEntries(fd.entries()));
      Cart.clear();
      sessionStorage.setItem('ep_last_order', JSON.stringify({
        ref,
        name: fd.get('name'),
        email: fd.get('email'),
        total: formatPrice(orderTotal),
        items: itemsSummary
      }));
      window.location.href = 'order-confirmation.html';
      return;
    }

    submitBtn.disabled = true;
    submitBtn.textContent = 'Placing order…';

    try {
      await fetch(SCRIPT_URL, { method: 'POST', mode: 'no-cors', body: fd });
      Cart.clear();
      sessionStorage.setItem('ep_last_order', JSON.stringify({
        ref,
        name: fd.get('name'),
        email: fd.get('email'),
        total: formatPrice(orderTotal),
        items: itemsSummary
      }));
      window.location.href = 'order-confirmation.html';
    } catch (err) {
      statusBox.textContent = 'Something went wrong. Please try again or contact us directly.';
      statusBox.classList.add('err', 'show');
      submitBtn.disabled = false;
      submitBtn.textContent = `Place Order — ${formatPrice(orderTotal)}`;
    }
  });
});