/* Quote list stored in localStorage.
   Shape: [{ id, qty }]  →  resolved against PRODUCTS for price/name. */

const CART_KEY = 'ep_cart_v2';

const Cart = {
  read() {
    try { return JSON.parse(localStorage.getItem(CART_KEY)) || []; } catch { return []; }
  },

  write(items) {
    localStorage.setItem(CART_KEY, JSON.stringify(items));
    Cart.updateBadge();
    document.dispatchEvent(new CustomEvent('cart:updated', { detail: items }));
  },

  add(id, qty = 1) {
    const product = getProduct(id);
    if (!product || isOut(product)) return false;
    const items = Cart.read();
    const existing = items.find(i => i.id === id);
    const max = maxQty(product);
    if (existing) existing.qty = Math.min(existing.qty + qty, max);
    else items.push({ id, qty: Math.min(qty, max) });
    Cart.write(items);
    return true;
  },

  setQty(id, qty) {
    const items = Cart.read();
    const item = items.find(i => i.id === id);
    if (!item) return;
    const product = getProduct(id);
    const max = product ? maxQty(product) : 999;
    item.qty = Math.max(1, Math.min(qty, max));
    Cart.write(items);
  },

  remove(id) { Cart.write(Cart.read().filter(i => i.id !== id)); },
  clear() { Cart.write([]); },

  detailed() {
    return Cart.read().map(i => {
      const p = getProduct(i.id);
      return p ? { ...p, qty: i.qty, lineTotal: p.price * i.qty } : null;
    }).filter(Boolean);
  },

  subtotal() { return Cart.detailed().reduce((sum, i) => sum + i.lineTotal, 0); },
  count() { return Cart.read().reduce((sum, i) => sum + i.qty, 0); },

  /* On-screen estimate. The emailed quote is calculated again on the
     server from the Sheet, and that figure is the official one. */
  totals(fulfilment = 'Delivery') {
    const r2 = n => Math.round((n + Number.EPSILON) * 100) / 100;
    const subtotal = r2(Cart.subtotal());
    const free = Number(SITE.free_delivery_over) || 0;
    const delivery = (fulfilment === 'Collection' || subtotal === 0) ? 0
      : (free > 0 && subtotal >= free) ? 0 : r2(Number(SITE.delivery_fee) || 0);
    const rate = Number(SITE.vat_rate) || 0;
    let vat = 0, total;
    if (rate > 0 && SITE.prices_include_vat) {
      total = r2(subtotal + delivery); vat = r2(total * rate / (100 + rate));
    } else if (rate > 0) {
      vat = r2((subtotal + delivery) * rate / 100); total = r2(subtotal + delivery + vat);
    } else {
      total = r2(subtotal + delivery);
    }
    return { subtotal, delivery, vat, total, rate, includesVat: SITE.prices_include_vat };
  },

  updateBadge() {
    const n = Cart.count();
    document.querySelectorAll('[data-cart-count]').forEach(el => {
      el.textContent = n;
      el.style.display = n > 0 ? 'inline-flex' : 'none';
    });
  }
};

document.addEventListener('DOMContentLoaded', () => Cart.updateBadge());
