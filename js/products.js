/* ============================================================
   Catalogue + shared helpers
   Products, prices, stock, images and contact details live in
   your Google Sheet. This file loads them through the Apps Script
   web app. Script order on every page: products.js → cart.js → page script.
   ============================================================ */

// Paste your Apps Script web app URL (it ends in /exec).
const API_URL = "https://script.google.com/macros/s/AKfycbxJmwBxYR6szyBDnDlFJ4FmU2pSa-zXZtTcr7Vr2Jb9sjY4V77qi9bgi22Z3I31y6mD/exec";

// Shown only if the Sheet can't be reached and nothing is cached yet.
const FALLBACK_PRODUCTS = [
  {"id": "ep-pen-001", "sku": "EP-PEN-001", "name": "Classic Ballpoint Pens (Box of 50)", "category": "Pens", "price": 145, "stock": 42, "image": "./assets/products/pen-ballpoint.jpg", "desc": "Smooth-writing blue ballpoint pens, 1.0mm tip. Box of 50.", "tags": ["bulk", "popular"]},
  {"id": "ep-pen-002", "sku": "EP-PEN-002", "name": "Gel Pens — Black (Pack of 12)", "category": "Pens", "price": 89, "stock": 30, "image": "./assets/products/pen-gel.jpg", "desc": "Quick-dry black gel ink, 0.7mm. Pack of 12.", "tags": ["popular"]},
  {"id": "ep-pen-003", "sku": "EP-PEN-003", "name": "Rollerball Pens — Blue (Pack of 6)", "category": "Pens", "price": 72, "stock": 18, "image": "./assets/products/pen-roller.jpg", "desc": "Premium rollerball with cap. Pack of 6.", "tags": []},
  {"id": "ep-pen-004", "sku": "EP-PEN-004", "name": "Fine-Liner Set (10 Colours)", "category": "Pens", "price": 110, "stock": 25, "image": "./assets/products/pen-fineliner.jpg", "desc": "0.4mm fine-liners in 10 assorted colours.", "tags": []},
  {"id": "ep-pcl-001", "sku": "EP-PCL-001", "name": "HB Pencils (Box of 24)", "category": "Pencils", "price": 55, "stock": 60, "image": "./assets/products/pencil-hb.jpg", "desc": "Standard HB graphite pencils, pre-sharpened.", "tags": []},
  {"id": "ep-pcl-002", "sku": "EP-PCL-002", "name": "Mechanical Pencil 0.5mm", "category": "Pencils", "price": 38, "stock": 22, "image": "./assets/products/pencil-mech.jpg", "desc": "Metal clip, cushioned grip, includes 2 refill leads.", "tags": []},
  {"id": "ep-pcl-003", "sku": "EP-PCL-003", "name": "Coloured Pencils (Set of 24)", "category": "Pencils", "price": 95, "stock": 15, "image": "./assets/products/pencil-colour.jpg", "desc": "Soft-core coloured pencils, pre-sharpened.", "tags": []},
  {"id": "ep-nbk-001", "sku": "EP-NBK-001", "name": "A5 Ruled Notebook (Pack of 5)", "category": "Notebooks", "price": 120, "stock": 35, "image": "./assets/products/notebook-a5.jpg", "desc": "80 pages, side-stapled, ruled. Pack of 5.", "tags": []},
  {"id": "ep-nbk-002", "sku": "EP-NBK-002", "name": "A4 Hardcover Journal", "category": "Notebooks", "price": 165, "stock": 20, "image": "./assets/products/notebook-hard.jpg", "desc": "192 pages, elastic closure, ribbon marker.", "tags": []},
  {"id": "ep-nbk-003", "sku": "EP-NBK-003", "name": "A4 Grid Pad (Pack of 3)", "category": "Notebooks", "price": 98, "stock": 28, "image": "./assets/products/notepad-grid.jpg", "desc": "5mm squared paper, 100 sheets per pad.", "tags": []},
  {"id": "ep-nbk-004", "sku": "EP-NBK-004", "name": "Exercise Books (Pack of 10)", "category": "Notebooks", "price": 88, "stock": 50, "image": "./assets/products/notebook-ex.jpg", "desc": "A4, 48 pages, ruled with margin. Pack of 10.", "tags": ["bulk", "school"]},
  {"id": "ep-ppr-001", "sku": "EP-PPR-001", "name": "A4 Copy Paper 80gsm (Ream)", "category": "Paper & Boards", "price": 78, "stock": 120, "image": "./assets/products/paper-a4.jpg", "desc": "500 sheets, bright white, 80gsm. Standard ream.", "tags": ["popular", "bulk"]},
  {"id": "ep-ppr-002", "sku": "EP-PPR-002", "name": "A3 Copy Paper 80gsm (Ream)", "category": "Paper & Boards", "price": 145, "stock": 45, "image": "./assets/products/paper-a3.jpg", "desc": "500 sheets, 80gsm, A3 size.", "tags": []},
  {"id": "ep-ppr-003", "sku": "EP-PPR-003", "name": "White Card Stock A4 (Pack of 50)", "category": "Paper & Boards", "price": 62, "stock": 60, "image": "./assets/products/card-a4.jpg", "desc": "220gsm white card, A4. Pack of 50.", "tags": []},
  {"id": "ep-ppr-004", "sku": "EP-PPR-004", "name": "Display Board A1 (Pack of 5)", "category": "Paper & Boards", "price": 210, "stock": 12, "image": "./assets/products/board-a1.jpg", "desc": "Rigid A1 display board, white. Pack of 5.", "tags": []},
  {"id": "ep-ink-001", "sku": "EP-INK-001", "name": "HP 305 Black Ink Cartridge", "category": "Ink & Toner", "price": 285, "stock": 14, "image": "./assets/products/ink-hp305.jpg", "desc": "Genuine HP 305 black ink cartridge.", "tags": []},
  {"id": "ep-ink-002", "sku": "EP-INK-002", "name": "Canon PG-245 Black Ink", "category": "Ink & Toner", "price": 260, "stock": 10, "image": "./assets/products/ink-canon.jpg", "desc": "Genuine Canon PG-245 black ink cartridge.", "tags": []},
  {"id": "ep-ink-003", "sku": "EP-INK-003", "name": "Brother TN-1050 Toner", "category": "Ink & Toner", "price": 620, "stock": 6, "image": "./assets/products/toner-brother.jpg", "desc": "Genuine Brother TN-1050 black toner.", "tags": []},
  {"id": "ep-fil-001", "sku": "EP-FIL-001", "name": "Lever Arch File A4 (Pack of 10)", "category": "Files & Folders", "price": 220, "stock": 25, "image": "./assets/products/file-lever.jpg", "desc": "A4 lever arch files, assorted colours. Pack of 10.", "tags": ["bulk"]},
  {"id": "ep-fil-002", "sku": "EP-FIL-002", "name": "Box File A4 (Pack of 5)", "category": "Files & Folders", "price": 165, "stock": 30, "image": "./assets/products/file-box.jpg", "desc": "A4 box files with finger hole and lid.", "tags": []},
  {"id": "ep-fil-003", "sku": "EP-FIL-003", "name": "Report Folder A4 (Pack of 25)", "category": "Files & Folders", "price": 140, "stock": 40, "image": "./assets/products/folder-report.jpg", "desc": "Clear-front A4 report folders with prongs.", "tags": []},
  {"id": "ep-bnd-001", "sku": "EP-BND-001", "name": "2-Ring Binder A4 (Pack of 10)", "category": "Binders", "price": 195, "stock": 20, "image": "./assets/products/binder-2ring.jpg", "desc": "A4 2-ring binders, 25mm capacity.", "tags": []},
  {"id": "ep-bnd-002", "sku": "EP-BND-002", "name": "Comb Binding Spines (Pack of 100)", "category": "Binders", "price": 88, "stock": 50, "image": "./assets/products/binder-comb.jpg", "desc": "12mm black plastic comb binding spines.", "tags": []},
  {"id": "ep-stp-001", "sku": "EP-STP-001", "name": "Full-Strip Stapler", "category": "Staplers & Punches", "price": 125, "stock": 18, "image": "./assets/products/stapler-full.jpg", "desc": "Metal full-strip stapler, 25-sheet capacity.", "tags": []},
  {"id": "ep-stp-002", "sku": "EP-STP-002", "name": "Staples 24/6 (Box of 5000)", "category": "Staplers & Punches", "price": 42, "stock": 80, "image": "./assets/products/staples.jpg", "desc": "Standard 24/6 staples. Box of 5000.", "tags": ["popular"]},
  {"id": "ep-stp-003", "sku": "EP-STP-003", "name": "2-Hole Punch (25 Sheets)", "category": "Staplers & Punches", "price": 155, "stock": 15, "image": "./assets/products/punch.jpg", "desc": "Heavy-duty 2-hole punch, adjustable guide.", "tags": []},
  {"id": "ep-sci-001", "sku": "EP-SCI-001", "name": "Office Scissors 21cm", "category": "Scissors & Cutters", "price": 68, "stock": 22, "image": "./assets/products/scissors.jpg", "desc": "Stainless steel office scissors, 21cm.", "tags": []},
  {"id": "ep-sci-002", "sku": "EP-SCI-002", "name": "A4 Paper Trimmer", "category": "Scissors & Cutters", "price": 340, "stock": 8, "image": "./assets/products/trimmer.jpg", "desc": "A4 guillotine-style paper trimmer with ruler.", "tags": []},
  {"id": "ep-sci-003", "sku": "EP-SCI-003", "name": "Snap-Off Utility Knife", "category": "Scissors & Cutters", "price": 45, "stock": 35, "image": "./assets/products/knife.jpg", "desc": "18mm snap-off blade utility knife.", "tags": []},
  {"id": "ep-adh-001", "sku": "EP-ADH-001", "name": "Glue Sticks 21g (Pack of 12)", "category": "Adhesives & Glues", "price": 95, "stock": 40, "image": "./assets/products/glue-stick.jpg", "desc": "Acid-free 21g glue sticks. Pack of 12.", "tags": ["popular"]},
  {"id": "ep-adh-002", "sku": "EP-ADH-002", "name": "Correction Tape (Pack of 5)", "category": "Adhesives & Glues", "price": 78, "stock": 32, "image": "./assets/products/correction.jpg", "desc": "5mm x 8m correction tape. Pack of 5.", "tags": []},
  {"id": "ep-adh-003", "sku": "EP-ADH-003", "name": "Liquid Glue 125ml", "category": "Adhesives & Glues", "price": 38, "stock": 45, "image": "./assets/products/glue-liquid.jpg", "desc": "All-purpose clear liquid glue, 125ml.", "tags": []},
  {"id": "ep-hlg-001", "sku": "EP-HLG-001", "name": "Highlighters (Pack of 6 Colours)", "category": "Highlighters & Markers", "price": 68, "stock": 50, "image": "./assets/products/highlighter.jpg", "desc": "Chisel-tip fluorescent highlighters, 6 colours.", "tags": ["popular"]},
  {"id": "ep-hlg-002", "sku": "EP-HLG-002", "name": "Whiteboard Markers (Pack of 4)", "category": "Highlighters & Markers", "price": 82, "stock": 28, "image": "./assets/products/marker-wb.jpg", "desc": "Low-odour whiteboard markers, 4 colours.", "tags": []},
  {"id": "ep-hlg-003", "sku": "EP-HLG-003", "name": "Permanent Markers (Pack of 12)", "category": "Highlighters & Markers", "price": 145, "stock": 20, "image": "./assets/products/marker-perm.jpg", "desc": "Black permanent markers. Pack of 12.", "tags": []},
  {"id": "ep-tap-001", "sku": "EP-TAP-001", "name": "Sellotape 18mm x 33m (Pack of 8)", "category": "Tapes & Dispensers", "price": 62, "stock": 60, "image": "./assets/products/tape-sello.jpg", "desc": "Clear sellotape. Pack of 8.", "tags": []},
  {"id": "ep-tap-002", "sku": "EP-TAP-002", "name": "Desk Tape Dispenser", "category": "Tapes & Dispensers", "price": 88, "stock": 15, "image": "./assets/products/tape-disp.jpg", "desc": "Weighted desktop tape dispenser, holds 25mm rolls.", "tags": []},
  {"id": "ep-tap-003", "sku": "EP-TAP-003", "name": "Packaging Tape 48mm (Pack of 6)", "category": "Tapes & Dispensers", "price": 125, "stock": 25, "image": "./assets/products/tape-pack.jpg", "desc": "Heavy-duty clear packaging tape.", "tags": []},
  {"id": "ep-cal-001", "sku": "EP-CAL-001", "name": "Desktop Calculator 12-Digit", "category": "Calculators", "price": 195, "stock": 12, "image": "./assets/products/calc-desk.jpg", "desc": "12-digit desktop calculator with large display.", "tags": []},
  {"id": "ep-cal-002", "sku": "EP-CAL-002", "name": "Scientific Calculator", "category": "Calculators", "price": 285, "stock": 10, "image": "./assets/products/calc-sci.jpg", "desc": "240-function scientific calculator.", "tags": []},
  {"id": "ep-cal-003", "sku": "EP-CAL-003", "name": "Pocket Calculator 8-Digit", "category": "Calculators", "price": 95, "stock": 20, "image": "./assets/products/calc-pocket.jpg", "desc": "Compact 8-digit pocket calculator.", "tags": []},
  {"id": "ep-acc-001", "sku": "EP-ACC-001", "name": "Desk Organiser Set", "category": "Office Accessories", "price": 220, "stock": 10, "image": "./assets/products/organiser.jpg", "desc": "Multi-compartment desk organiser, black mesh.", "tags": []},
  {"id": "ep-acc-002", "sku": "EP-ACC-002", "name": "Name Badges (Pack of 50)", "category": "Office Accessories", "price": 145, "stock": 20, "image": "./assets/products/badges.jpg", "desc": "Clip-on name badges with insert cards.", "tags": []},
  {"id": "ep-acc-003", "sku": "EP-ACC-003", "name": "A4 Laminating Pouches 80mic (Pack of 100)", "category": "Office Accessories", "price": 175, "stock": 22, "image": "./assets/products/laminating.jpg", "desc": "80-micron A4 laminating pouches.", "tags": []}
];

const PRODUCTS = [];
const CATEGORIES = [];
const SITE = {
  business_name: "Elegant Promoter's Stationery Supply",
  phone: '0649870578', whatsapp: '0686893151', public_email: 'tpy.media0@gmail.com', address: '9297 Moepshe St', hours: '',
  vat_rate: 0, prices_include_vat: true,
  delivery_fee: 65, free_delivery_over: 500, quote_valid_days: 7
};

const Catalogue = (() => {
  const KEY = 'ep_catalogue_v2';
  let done = false;

  const toNum = (v, d) => (v === '' || v == null || isNaN(Number(v))) ? d : Number(v);

  function normalise(p) {
    const tags = Array.isArray(p.tags)
      ? p.tags
      : String(p.tags || '').split(',').map(s => s.trim().toLowerCase()).filter(Boolean);
    return {
      id: String(p.id || '').trim(),
      sku: String(p.sku || ''),
      name: String(p.name || ''),
      category: String(p.category || 'Other'),
      price: toNum(p.price, 0),
      stock: toNum(p.stock, null),        // blank = no stock limit, 0 = out of stock
      image: String(p.image || ''),
      desc: String(p.desc || ''),
      tags
    };
  }

  function apply(data, source) {
    PRODUCTS.length = 0;
    (data.products || []).forEach(p => {
      const n = normalise(p);
      if (n.id && n.name) PRODUCTS.push(n);
    });
    CATEGORIES.length = 0;
    PRODUCTS.forEach(p => { if (!CATEGORIES.includes(p.category)) CATEGORIES.push(p.category); });

    const s = data.settings || {};
    Object.keys(s).forEach(k => { if (s[k] !== '' && s[k] != null) SITE[k] = s[k]; });
    SITE.vat_rate = toNum(SITE.vat_rate, 0);
    SITE.delivery_fee = toNum(SITE.delivery_fee, 65);
    SITE.free_delivery_over = toNum(SITE.free_delivery_over, 500);
    SITE.quote_valid_days = toNum(SITE.quote_valid_days, 7);
    SITE.prices_include_vat = String(SITE.prices_include_vat).toLowerCase() !== 'false';

    done = true;
    document.dispatchEvent(new CustomEvent('catalogue:updated', { detail: { source } }));
  }

  function readCache() {
    try { return JSON.parse(localStorage.getItem(KEY))?.data || null; } catch { return null; }
  }
  function writeCache(data) {
    try { localStorage.setItem(KEY, JSON.stringify({ ts: Date.now(), data })); } catch {}
  }

  // Resolves as soon as there is something to show: cache first, then the live Sheet.
  const ready = new Promise(resolve => {
    const cached = readCache();
    if (cached) { apply(cached, 'cache'); resolve(); }

    if (API_URL.includes('PASTE_YOUR')) {
      if (!cached) { apply({ products: FALLBACK_PRODUCTS }, 'fallback'); resolve(); }
      return;
    }

    const timer = setTimeout(() => {
      if (!done) { apply({ products: FALLBACK_PRODUCTS }, 'fallback'); resolve(); }
    }, 7000);

    fetch(API_URL + '?action=catalogue', { cache: 'no-store' })
      .then(r => r.json())
      .then(data => {
        if (!data || !data.ok) throw new Error('Bad catalogue response');
        clearTimeout(timer);
        apply(data, 'network');
        writeCache(data);
        resolve();
      })
      .catch(err => {
        console.warn('Catalogue load failed:', err);
        clearTimeout(timer);
        if (!done) { apply({ products: FALLBACK_PRODUCTS }, 'fallback'); resolve(); }
      });
  });

  return { ready };
})();

/* ---------- Helpers ---------- */

function esc(s) {
  return String(s == null ? '' : s).replace(/[&<>"']/g, c => (
    { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]
  ));
}

function formatPrice(amount) {
  const [i, d] = Number(amount).toFixed(2).split('.');
  return 'R ' + i.replace(/\B(?=(\d{3})+(?!\d))/g, ',') + '.' + d;
}

function getProduct(id) { return PRODUCTS.find(p => p.id === id); }
function isOut(p) { return p.stock === 0; }
function isLow(p) { return p.stock !== null && p.stock > 0 && p.stock <= 10; }
function maxQty(p) { return p.stock === null ? 999 : p.stock; }

function showToast(msg, href, linkText) {
  let t = document.querySelector('.toast');
  if (!t) { t = document.createElement('div'); t.className = 'toast'; document.body.appendChild(t); }
  t.textContent = msg;
  if (href) {
    const a = document.createElement('a');
    a.href = href; a.textContent = linkText || 'View';
    a.style.cssText = 'color:var(--gold);margin-left:12px;text-decoration:underline;';
    t.appendChild(a);
  }
  requestAnimationFrame(() => t.classList.add('show'));
  clearTimeout(t._timer);
  t._timer = setTimeout(() => t.classList.remove('show'), 3200);
}

/* Fills contact details from the Settings tab: <span data-site="phone"></span>.
   Rows with no value are hidden instead of showing a placeholder. */
function hydrateSite() {
  document.querySelectorAll('[data-site]').forEach(el => {
    const key = el.dataset.site;
    const v = String(SITE[key] == null ? '' : SITE[key]).trim();
    const holder = el.closest('.info-row, p, li');
    if (!v) { if (holder) holder.style.display = 'none'; return; }
    if (holder) holder.style.display = '';
    const digits = v.replace(/\D/g, '');
    if (el.tagName === 'A') {
      if (key === 'phone') el.href = 'tel:' + v.replace(/[^\d+]/g, '');
      else if (key === 'public_email') el.href = 'mailto:' + v;
      else if (key === 'whatsapp') { el.href = 'https://wa.me/' + waNumber(v); el.target = '_blank'; el.rel = 'noopener'; }
    }
    el.textContent = key === 'whatsapp' ? 'WhatsApp ' + v : v;
  });
}

// "071 234 5678" → "27712345678"
function waNumber(v) {
  let d = String(v).replace(/\D/g, '');
  if (d.startsWith('00')) d = d.slice(2);
  if (d.startsWith('0')) d = '27' + d.slice(1);
  return d;
}

document.addEventListener('DOMContentLoaded', hydrateSite);
document.addEventListener('catalogue:updated', hydrateSite);
