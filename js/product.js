/* product.html — single product page */

document.addEventListener('DOMContentLoaded', () => {
  const wrap = document.getElementById('product-detail');
  if (!wrap) return;

  const id = new URLSearchParams(location.search).get('id');

  function render() {
    const p = getProduct(id);
    if (!p) {
      wrap.innerHTML = '<div style="grid-column:1/-1;text-align:center;padding:80px 0"><h2>Product not found</h2><p style="color:var(--ink-soft);margin:14px 0 26px">That item isn\'t in our catalogue any more.</p><a href="products.html" class="btn btn-navy">Back to shop</a></div>';
      return;
    }
    document.title = p.name + " — Elegant Promoter's Stationery Supply";
    document.getElementById('bc-name').textContent = p.name;

    const out = isOut(p), low = isLow(p);
    const stockClass = out ? 'out' : low ? 'low' : '';
    const stockText = out ? 'Out of stock' : low ? `Only ${p.stock} left in stock` : 'Available';

    wrap.innerHTML = `
      <div class="product-detail__media">
        <img src="${esc(p.image)}" alt="${esc(p.name)}"
             onerror="this.style.display='none';this.parentNode.innerHTML='<span style=&quot;font-family:Playfair Display,serif;font-size:4rem;color:var(--gold);opacity:0.3&quot;>EP</span>'">
      </div>
      <div>
        <span class="product-detail__cat">${esc(p.category)}</span>
        <h1>${esc(p.name)}</h1>
        <div class="product-detail__sku">SKU: ${esc(p.sku)}</div>
        <div class="product-detail__price">${formatPrice(p.price)}</div>
        <p class="product-detail__desc">${esc(p.desc)}</p>
        <div class="product-detail__stock ${stockClass}">${stockText}</div>

        <div class="qty-row">
          <label for="qty">Quantity</label>
          <div class="qty-control">
            <button type="button" onclick="stepQty(-1)" aria-label="Decrease quantity">−</button>
            <input type="number" id="qty" value="1" min="1" max="${maxQty(p)}">
            <button type="button" onclick="stepQty(1)" aria-label="Increase quantity">+</button>
          </div>
        </div>

        <div class="product-detail__actions">
          <button type="button" class="btn btn-navy" ${out ? 'disabled' : ''} onclick="addDetailToCart('${esc(p.id)}')">
            ${out ? 'Out of stock' : 'Add to quote'}
          </button>
          <a href="cart.html" class="btn btn-ghost">View quote</a>
        </div>

        <div class="product-detail__meta">
          <div><strong>Category:</strong> ${esc(p.category)}</div>
          <div><strong>Bulk orders:</strong> Need 50 or more? Add the quantity you need and we'll confirm bulk pricing.</div>
        </div>
      </div>`;
  }

  Catalogue.ready.then(() => {
    render();
    document.addEventListener('catalogue:updated', render);
  });
});

function stepQty(delta) {
  const input = document.getElementById('qty');
  const max = parseInt(input.max, 10) || 999;
  input.value = Math.max(1, Math.min((parseInt(input.value, 10) || 1) + delta, max));
}

function addDetailToCart(id) {
  const qty = parseInt(document.getElementById('qty').value, 10) || 1;
  if (Cart.add(id, qty)) showToast(`Added ${qty} to your quote`, 'cart.html', 'View quote');
}
