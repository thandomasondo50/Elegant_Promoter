/* products.html — filterable product grid, driven by the Google Sheet catalogue */

document.addEventListener('DOMContentLoaded', () => {
  const grid = document.getElementById('product-grid');
  if (!grid) return;

  const searchInput = document.getElementById('filter-search');
  const catWrap = document.getElementById('filter-cats');
  const priceMin = document.getElementById('price-min');
  const priceMax = document.getElementById('price-max');
  const sortSelect = document.getElementById('sort-select');
  const resultsCount = document.getElementById('results-count');
  const clearBtn = document.getElementById('filter-clear');

  const state = { search: '', cats: new Set(), min: null, max: null, sort: 'featured' };

  function buildCats() {
    const counts = {};
    PRODUCTS.forEach(p => { counts[p.category] = (counts[p.category] || 0) + 1; });
    catWrap.innerHTML = CATEGORIES.map(c => `
      <label>
        <input type="checkbox" value="${esc(c)}" ${state.cats.has(c) ? 'checked' : ''}>
        <span>${esc(c)}</span>
        <span class="count">${counts[c] || 0}</span>
      </label>`).join('');
    catWrap.querySelectorAll('input').forEach(cb => {
      cb.addEventListener('change', () => {
        cb.checked ? state.cats.add(cb.value) : state.cats.delete(cb.value);
        render();
      });
    });
  }

  function applyFilters() {
    let list = PRODUCTS.slice();
    if (state.search) {
      const q = state.search.toLowerCase();
      list = list.filter(p =>
        p.name.toLowerCase().includes(q) || p.desc.toLowerCase().includes(q) ||
        p.sku.toLowerCase().includes(q) || p.category.toLowerCase().includes(q));
    }
    if (state.cats.size) list = list.filter(p => state.cats.has(p.category));
    if (state.min != null) list = list.filter(p => p.price >= state.min);
    if (state.max != null) list = list.filter(p => p.price <= state.max);

    switch (state.sort) {
      case 'price-asc':  list.sort((a, b) => a.price - b.price); break;
      case 'price-desc': list.sort((a, b) => b.price - a.price); break;
      case 'name-asc':   list.sort((a, b) => a.name.localeCompare(b.name)); break;
      case 'name-desc':  list.sort((a, b) => b.name.localeCompare(a.name)); break;
      default:
        list.sort((a, b) => (b.tags.includes('popular') ? 1 : 0) - (a.tags.includes('popular') ? 1 : 0));
    }
    return list;
  }

  function productCard(p) {
    const out = isOut(p);
    const badge = out ? '<span class="product-card__badge out">Out of stock</span>'
      : isLow(p) ? '<span class="product-card__badge low">Low stock</span>'
      : p.tags.includes('popular') ? '<span class="product-card__badge">Popular</span>' : '';
    return `
      <article class="product-card">
        <a href="product.html?id=${encodeURIComponent(p.id)}" class="product-card__media">
          ${badge}
          <img src="${esc(p.image)}" alt="${esc(p.name)}" loading="lazy"
               onerror="this.style.display='none';this.parentNode.insertAdjacentHTML('beforeend','<span style=&quot;font-family:Playfair Display,serif;font-size:2rem;color:var(--gold);opacity:0.4&quot;>EP</span>')">
        </a>
        <div class="product-card__body">
          <span class="product-card__cat">${esc(p.category)}</span>
          <h3 class="product-card__name"><a href="product.html?id=${encodeURIComponent(p.id)}">${esc(p.name)}</a></h3>
          <div class="product-card__price">${formatPrice(p.price)}</div>
          <div class="product-card__actions">
            <button type="button" class="btn btn-navy" ${out ? 'disabled' : ''} data-add="${esc(p.id)}">
              ${out ? 'Unavailable' : 'Add to quote'}
            </button>
            <a href="product.html?id=${encodeURIComponent(p.id)}" class="btn btn-ghost">View</a>
          </div>
        </div>
      </article>`;
  }

  function render() {
    const list = applyFilters();
    resultsCount.textContent = `${list.length} product${list.length !== 1 ? 's' : ''}`;
    grid.innerHTML = list.length
      ? list.map(productCard).join('')
      : '<div class="no-results" style="grid-column:1/-1"><h3>No products match your filters</h3><p>Try clearing a filter or searching for something else.</p></div>';
  }

  grid.addEventListener('click', e => {
    const btn = e.target.closest('[data-add]');
    if (!btn) return;
    if (!Cart.add(btn.dataset.add, 1)) return;
    const original = btn.textContent.trim();
    btn.textContent = 'Added ✓';
    btn.disabled = true;
    setTimeout(() => { btn.textContent = original; btn.disabled = false; }, 1200);
    showToast('Added to your quote', 'cart.html', 'View quote');
  });

  searchInput?.addEventListener('input', e => { state.search = e.target.value.trim(); render(); });
  priceMin?.addEventListener('input', e => { state.min = e.target.value ? parseFloat(e.target.value) : null; render(); });
  priceMax?.addEventListener('input', e => { state.max = e.target.value ? parseFloat(e.target.value) : null; render(); });
  sortSelect?.addEventListener('change', e => { state.sort = e.target.value; render(); });
  clearBtn?.addEventListener('click', () => {
    state.search = ''; state.cats.clear(); state.min = null; state.max = null; state.sort = 'featured';
    searchInput.value = ''; priceMin.value = ''; priceMax.value = ''; sortSelect.value = 'featured';
    buildCats(); render();
  });

  Catalogue.ready.then(() => {
    buildCats();
    render();
    document.addEventListener('catalogue:updated', () => { buildCats(); render(); });
  });
});
