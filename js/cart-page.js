/* cart.html — review the quote list and request the quote by email, all on one page. */

document.addEventListener('DOMContentLoaded', () => {
  const container = document.getElementById('cart-container');
  if (!container) return;

  let built = false;
  let submitted = false;

  Catalogue.ready.then(() => {
    refresh();
    document.addEventListener('cart:updated', refresh);
    document.addEventListener('catalogue:updated', refresh);
  });

  function refresh() {
    if (submitted) return;
    const items = Cart.detailed();
    if (!items.length) { renderEmpty(); built = false; return; }
    if (!built) buildSkeleton();
    renderItems(items);
    renderTotals();
  }

  function renderEmpty() {
    container.innerHTML = `
      <div class="empty-cart">
        <h2>Your quote is empty</h2>
        <p>Pick the products you need and we'll email you an itemised quote.</p>
        <a href="products.html" class="btn btn-navy">Browse products</a>
      </div>`;
  }

  function buildSkeleton() {
    built = true;
    container.innerHTML = `
      <div class="cart-layout">
        <div>
          <div id="quote-items"></div>
          <div style="margin-top:20px;display:flex;gap:12px;flex-wrap:wrap;">
            <a href="products.html" class="btn btn-ghost">← Add more items</a>
            <button type="button" class="btn btn-ghost" id="clear-quote">Clear quote</button>
          </div>
        </div>

        <aside class="cart-side">
          <div class="cart-summary">
            <h3>Quote summary</h3>
            <div id="quote-totals"></div>
            <p class="summary-note">This is an estimate. Your emailed quote is the official figure, and we confirm stock before you pay.</p>
          </div>

          <form class="quote-card" id="quote-form">
            <h3>Where should we send it?</h3>

            <div class="field">
              <label for="qf-name">Full name</label>
              <input type="text" id="qf-name" name="name" autocomplete="name" required maxlength="80">
            </div>
            <div class="field">
              <label for="qf-email">Email address</label>
              <input type="email" id="qf-email" name="email" autocomplete="email" required maxlength="120">
            </div>
            <div class="field">
              <label for="qf-phone">Phone or WhatsApp number</label>
              <input type="tel" id="qf-phone" name="phone" autocomplete="tel" required maxlength="30">
            </div>

            <div class="field">
              <label>Delivery or collection</label>
              <div class="pill-group">
                <label class="pill"><input type="radio" name="fulfilment" value="Delivery" checked><span>Delivery</span></label>
                <label class="pill"><input type="radio" name="fulfilment" value="Collection"><span>Collection</span></label>
              </div>
            </div>
            <div class="field" id="area-field">
              <label for="qf-area">Delivery suburb or area (optional)</label>
              <input type="text" id="qf-area" name="area" maxlength="120" placeholder="e.g. Thokoza, Ekurhuleni">
            </div>
            <div class="field">
              <label for="qf-notes">Notes (optional)</label>
              <textarea id="qf-notes" name="notes" maxlength="1000" placeholder="Brand or colour preferences, date you need it by…"></textarea>
            </div>

            <div class="hp-field" aria-hidden="true">
              <label>Leave this empty<input type="text" name="website" tabindex="-1" autocomplete="off"></label>
            </div>

            <label class="consent">
              <input type="checkbox" id="qf-consent" required>
              <span>I agree to be contacted about this quote. Your details are only used to prepare and follow up on it.</span>
            </label>

            <div class="form-status" id="quote-status" role="alert"></div>
            <button type="submit" class="btn btn-gold btn-full" id="quote-btn">Email me my quote</button>
            <p class="quote-card__note">No payment is taken now. Your itemised quote arrives by email within a minute.</p>
          </form>
        </aside>
      </div>`;

    document.getElementById('clear-quote').addEventListener('click', () => {
      if (confirm('Remove all items from your quote?')) Cart.clear();
    });
    document.querySelectorAll('input[name="fulfilment"]').forEach(r =>
      r.addEventListener('change', () => {
        document.getElementById('area-field').style.display = fulfilment() === 'Delivery' ? '' : 'none';
        renderTotals();
      }));
    document.getElementById('quote-form').addEventListener('submit', onSubmit);
  }

  const fulfilment = () => (document.querySelector('input[name="fulfilment"]:checked') || {}).value || 'Delivery';

  function renderItems(items) {
    document.getElementById('quote-items').innerHTML = `
      <table class="cart-table">
        <thead><tr><th>Product</th><th>Price</th><th>Qty</th><th>Total</th><th></th></tr></thead>
        <tbody>
          ${items.map(i => `
            <tr>
              <td data-label="Product">
                <div class="cart-item-info">
                  <img src="${esc(i.image)}" alt="${esc(i.name)}" onerror="this.style.display='none'">
                  <div>
                    <span class="name">${esc(i.name)}</span>
                    <span class="cat">${esc(i.category)}</span>
                  </div>
                </div>
              </td>
              <td data-label="Price">${formatPrice(i.price)}</td>
              <td data-label="Qty">
                <div class="qty-control" style="width:fit-content">
                  <button type="button" onclick="changeQty('${esc(i.id)}',-1)" aria-label="Decrease quantity">−</button>
                  <input type="number" value="${i.qty}" min="1" max="${maxQty(i)}" aria-label="Quantity"
                         onchange="setQty('${esc(i.id)}', this.value)">
                  <button type="button" onclick="changeQty('${esc(i.id)}',1)" aria-label="Increase quantity">+</button>
                </div>
              </td>
              <td data-label="Total">${formatPrice(i.lineTotal)}</td>
              <td data-label="">
                <button type="button" class="cart-remove" onclick="removeItem('${esc(i.id)}')" aria-label="Remove ${esc(i.name)}">&times;</button>
              </td>
            </tr>`).join('')}
        </tbody>
      </table>`;
  }

  function renderTotals() {
    const t = Cart.totals(fulfilment());
    const free = Number(SITE.free_delivery_over) || 0;
    const delivery = fulfilment() === 'Collection' ? 'Free (collection)' : (t.delivery === 0 ? 'Free' : formatPrice(t.delivery));
    const hint = fulfilment() === 'Delivery' && t.delivery > 0 && free > 0
      ? `<p class="summary-note" style="margin-top:0">Add ${formatPrice(free - t.subtotal)} more for free delivery.</p>` : '';
    document.getElementById('quote-totals').innerHTML = `
      <div class="summary-row"><span>Subtotal</span><span>${formatPrice(t.subtotal)}</span></div>
      <div class="summary-row"><span>Delivery</span><span>${delivery}</span></div>
      ${t.rate > 0 ? `<div class="summary-row"><span>${t.includesVat ? 'Includes VAT' : 'VAT'} (${t.rate}%)</span><span>${formatPrice(t.vat)}</span></div>` : ''}
      <div class="summary-row total"><span>Estimated total</span><span>${formatPrice(t.total)}</span></div>
      ${hint}`;
  }

  window.changeQty = (id, delta) => {
    const item = Cart.read().find(i => i.id === id);
    if (item) Cart.setQty(id, item.qty + delta);
  };
  window.setQty = (id, val) => Cart.setQty(id, parseInt(val, 10) || 1);
  window.removeItem = id => Cart.remove(id);

  async function onSubmit(e) {
    e.preventDefault();
    const form = e.currentTarget;
    const status = document.getElementById('quote-status');
    const btn = document.getElementById('quote-btn');
    status.className = 'form-status';

    const fd = new FormData(form);
    if (!form.dataset.clientId) {
      form.dataset.clientId = (window.crypto && crypto.randomUUID) ? crypto.randomUUID()
        : Date.now().toString(36) + Math.random().toString(36).slice(2);
    }
    const payload = {
      action: 'quote',
      clientId: form.dataset.clientId,
      items: Cart.read().map(i => ({ id: i.id, qty: i.qty })),
      name: fd.get('name'), email: fd.get('email'), phone: fd.get('phone'),
      fulfilment: fulfilment(), area: fd.get('area') || '', notes: fd.get('notes') || '',
      consent: document.getElementById('qf-consent').checked,
      hp: fd.get('website') || ''
    };

    const showError = msg => {
      status.textContent = msg;
      status.classList.add('err', 'show');
      btn.disabled = false;
      btn.textContent = 'Email me my quote';
    };
    const contactHint = SITE.whatsapp ? ' You can also WhatsApp us on ' + SITE.whatsapp + '.' : '';

    btn.disabled = true;
    btn.textContent = 'Preparing your quote…';

    // Demo mode: no backend connected yet, so show the confirmation page without sending anything.
    if (API_URL.includes('PASTE_YOUR')) {
      console.log('Quote payload (not sent, API_URL not set):', payload);
      return finish({ ref: 'EP-DEMO', emailSent: true, total: formatPrice(Cart.totals(fulfilment()).total), validUntil: '' });
    }

    const ctrl = new AbortController();
    const timer = setTimeout(() => ctrl.abort(), 45000);
    try {
      const res = await fetch(API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'text/plain;charset=utf-8' }, // keeps it a simple request (no CORS preflight)
        body: JSON.stringify(payload),
        signal: ctrl.signal
      });
      const data = await res.json();
      if (!data.ok) return showError(data.error || 'We could not create your quote. Please try again.');
      finish(data);
    } catch (err) {
      if (err.name === 'AbortError') {
        showError('This is taking longer than usual. Check your inbox in a few minutes before trying again.' + contactHint);
      } else {
        showError('We could not reach our quote service. Check your connection and try again.' + contactHint);
      }
    } finally {
      clearTimeout(timer);
    }

    function finish(data) {
      submitted = true;
      sessionStorage.setItem('ep_last_quote', JSON.stringify({
        ref: data.ref, name: payload.name, email: payload.email,
        emailSent: data.emailSent !== false, total: data.total, validUntil: data.validUntil || ''
      }));
      Cart.clear();
      window.location.href = 'quote-sent.html';
    }
  }
});
