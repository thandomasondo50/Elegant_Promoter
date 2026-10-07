/* Cart state stored in localStorage.
   Cart shape: [{ id, qty }]  →  resolved against PRODUCTS for price/name. */

const CART_KEY = 'ep_cart_v1';

const Cart = {
  read() {
    try {
      return JSON.parse(localStorage.getItem(CART_KEY)) || [];
    } catch { return []; }
  },

  write(items) {
    localStorage.setItem(CART_KEY, JSON.stringify(items));
    Cart.updateBadge();
    document.dispatchEvent(new CustomEvent('cart:updated', { detail: items }));
  },

  add(id, qty = 1) {
    const items = Cart.read();
    const existing = items.find(i => i.id === id);
    const product = getProduct(id);
    if (!product) return;
    const max = product.stock || 999;
    if (existing) {
      existing.qty = Math.min(existing.qty + qty, max);
    } else {
      items.push({ id, qty: Math.min(qty, max) });
    }
    Cart.write(items);
  },

  setQty(id, qty) {
    const items = Cart.read();
    const item = items.find(i => i.id === id);
    if (!item) return;
    const product = getProduct(id);
    const max = product ? (product.stock || 999) : 999;
    item.qty = Math.max(1, Math.min(qty, max));
    Cart.write(items);
  },

  remove(id) {
    Cart.write(Cart.read().filter(i => i.id !== id));
  },

  clear() {
    Cart.write([]);
  },

  detailed() {
    return Cart.read().map(i => {
      const p = getProduct(i.id);
      return p ? { ...p, qty: i.qty, lineTotal: p.price * i.qty } : null;
    }).filter(Boolean);
  },

  subtotal() {
    return Cart.detailed().reduce((sum, i) => sum + i.lineTotal, 0);
  },

  count() {
    return Cart.read().reduce((sum, i) => sum + i.qty, 0);
  },

  updateBadge() {
    document.querySelectorAll('[data-cart-count]').forEach(el => {
      const n = Cart.count();
      el.textContent = n;
      el.style.display = n > 0 ? 'inline-flex' : 'none';
    });
  }
};

document.addEventListener('DOMContentLoaded', () => Cart.updateBadge());