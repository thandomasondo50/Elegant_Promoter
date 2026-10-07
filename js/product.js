document.addEventListener('DOMContentLoaded', () => {
  const wrap = document.getElementById('product-detail');
  if (!wrap) return;

  const params = new URLSearchParams(location.search);
  const id = params.get('id');
  const p = getProduct(id);

  if (!p) {
    wrap.innerHTML = '<div style="grid-column:1/-1;text-align:center;padding:80px 0"><h2>Product not found</h2><p style="color:var(--ink-soft);margin:14px 0 26px">The item you\'re looking for doesn\'t exist or has been removed.</p><a href="products.html" class="btn btn-navy">Back to shop</a></div>';
    return;
  }

  document.title = p.name + ' — Elegant Promoter\'s Stationary Supply';
  document.getElementById('bc-name').textContent = p.name;

  const out = p.stock <= 0;
  const low = !out && p.stock <= 10;
  const stockClass = out ? 'out' : low ? 'low' : '';
  const stockText = out ? 'Out of stock' : low ? `Only ${p.stock} left in stock` : 'In stock';

  wrap.innerHTML = `
    <div class="product-detail__media">
      <img src="${p.image}" alt="${p.name}"
           onerror="this.style.display='none';this.parentNode.innerHTML='<span style=&quot;font-family:Playfair Display,serif;font-size:4rem;color:var(--gold);opacity:0.3&quot;>EP</span>'">
    </div>
    <div>
      <span class="product-detail__cat">${p.category}</span>
      <h1>${p.name}</h1>
      <div class="product-detail__sku">SKU: ${p.sku}</div>
      <div class="product-detail__price">${formatPrice(p.price)}</div>
      <p class="product-detail__desc">${p.desc}</p>
      <div class="product-detail__stock ${stockClass}">${stockText}</div>

      <div class="qty-row">
        <label for="qty">Quantity</label>
        <div class="qty-control">
          <button type="button" onclick="stepQty(-1)">−</button>
          <input type="number" id="qty" value="1" min="1" max="${p.stock || 1}">
          <button type="button" onclick="stepQty(1)">+</button>
        </div>
      </div>

      <div class="product-detail__actions">
        <button class="btn btn-navy" ${out?'disabled':''} onclick="addDetailToCart('${p.id}')">
          ${out ? 'Out of stock' : 'Add to Cart'}
        </button>
        <a href="products.html" class="btn btn-ghost">Continue Shopping</a>
      </div>

      <div class="product-detail__meta">
        <div><strong>Category:</strong> ${p.category}</div>
        <div><strong>Availability:</strong> ${out ? 'Unavailable' : p.stock + ' units'}</div>
        <div><strong>Bulk orders:</strong> Need 50+? <a href="contact.html" style="color:var(--gold)">Request a quote</a></div>
      </div>
    </div>
  `;
});

function stepQty(delta) {
  const input = document.getElementById('qty');
  const max = parseInt(input.max) || 999;
  let v = (parseInt(input.value) || 1) + delta;
  input.value = Math.max(1, Math.min(v, max));
}

function addDetailToCart(id) {
  const qty = parseInt(document.getElementById('qty').value) || 1;
  Cart.add(id, qty);
  showToast(`Added ${qty} to cart`);
}