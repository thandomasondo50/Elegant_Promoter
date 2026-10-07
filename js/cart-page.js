document.addEventListener('DOMContentLoaded', () => {
  const container = document.getElementById('cart-container');
  if (!container) return;

  function render() {
    const items = Cart.detailed();
    if (!items.length) {
      container.innerHTML = `
        <div class="empty-cart">
          <h2>Your cart is empty</h2>
          <p>Browse the catalogue and add items to get started.</p>
          <a href="products.html" class="btn btn-navy">Shop Products</a>
        </div>`;
      return;
    }

    const subtotal = Cart.subtotal();
    const delivery = subtotal >= 500 ? 0 : 65;
    const total = subtotal + delivery;

    container.innerHTML = `
      <div class="cart-layout">
        <div>
          <table class="cart-table">
            <thead>
              <tr>
                <th>Product</th>
                <th>Price</th>
                <th>Qty</th>
                <th>Total</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              ${items.map(i => `
                <tr>
                  <td data-label="Product">
                    <div class="cart-item-info">
                      <img src="${i.image}" alt="${i.name}" onerror="this.style.display='none'">
                      <div>
                        <span class="name">${i.name}</span>
                        <span class="cat">${i.category}</span>
                      </div>
                    </div>
                  </td>
                  <td data-label="Price">${formatPrice(i.price)}</td>
                  <td data-label="Qty">
                    <div class="qty-control" style="width:fit-content">
                      <button type="button" onclick="changeQty('${i.id}',-1)">−</button>
                      <input type="number" value="${i.qty}" min="1" max="${i.stock}"
                             onchange="setQty('${i.id}', this.value)">
                      <button type="button" onclick="changeQty('${i.id}',1)">+</button>
                    </div>
                  </td>
                  <td data-label="Total">${formatPrice(i.lineTotal)}</td>
                  <td data-label="">
                    <button class="cart-remove" onclick="removeItem('${i.id}')" aria-label="Remove">&times;</button>
                  </td>
                </tr>
              `).join('')}
            </tbody>
          </table>
          <div style="margin-top:20px;display:flex;gap:12px;flex-wrap:wrap;">
            <a href="products.html" class="btn btn-ghost">← Continue Shopping</a>
            <button class="btn btn-ghost" onclick="clearCart()">Clear Cart</button>
          </div>
        </div>

        <aside class="cart-summary">
          <h3>Order Summary</h3>
          <div class="summary-row"><span>Subtotal</span><span>${formatPrice(subtotal)}</span></div>
          <div class="summary-row"><span>Delivery</span><span>${delivery === 0 ? 'Free' : formatPrice(delivery)}</span></div>
          <div class="summary-row total"><span>Total</span><span>${formatPrice(total)}</span></div>
          <p class="summary-note">${delivery === 0 ? 'You qualify for free delivery.' : `Add ${formatPrice(500 - subtotal)} more for free delivery.`}</p>
          <a href="checkout.html" class="btn btn-gold btn-full">Proceed to Checkout</a>
        </aside>
      </div>
    `;
  }

  window.changeQty = (id, delta) => {
    const item = Cart.read().find(i => i.id === id);
    if (item) Cart.setQty(id, item.qty + delta);
    render();
  };
  window.setQty = (id, val) => { Cart.setQty(id, parseInt(val) || 1); render(); };
  window.removeItem = (id) => { Cart.remove(id); render(); };
  window.clearCart = () => { if (confirm('Clear all items from your cart?')) { Cart.clear(); render(); } };

  render();
  document.addEventListener('cart:updated', render);
});