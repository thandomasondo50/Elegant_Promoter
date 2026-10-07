/* Product catalogue — edit prices/stock here.
   In a real deployment you'd fetch this from a backend or Google Sheet. */

const PRODUCTS = [
  // PENS
  { id: 'pen-001', sku: 'EP-PEN-001', name: 'Classic Ballpoint Pens (Box of 50)', category: 'Pens', price: 145.00, stock: 42, image: './assets/products/pen-ballpoint.jpg', desc: 'Smooth-writing blue ballpoint pens, 1.0mm tip. Box of 50.', tags: ['bulk', 'popular'] },
  { id: 'pen-002', sku: 'EP-PEN-002', name: 'Gel Pens — Black (Pack of 12)', category: 'Pens', price: 89.00, stock: 30, image: './assets/products/pen-gel.jpg', desc: 'Quick-dry black gel ink, 0.7mm. Pack of 12.', tags: ['popular'] },
  { id: 'pen-003', sku: 'EP-PEN-003', name: 'Rollerball Pens — Blue (Pack of 6)', category: 'Pens', price: 72.00, stock: 18, image: './assets/products/pen-roller.jpg', desc: 'Premium rollerball with cap. Pack of 6.' },
  { id: 'pen-004', sku: 'EP-PEN-004', name: 'Fine-Liner Set (10 Colours)', category: 'Pens', price: 110.00, stock: 25, image: './assets/products/pen-fineliner.jpg', desc: '0.4mm fine-liners in 10 assorted colours.' },

  // PENCILS
  { id: 'pcl-001', sku: 'EP-PCL-001', name: 'HB Pencils (Box of 24)', category: 'Pencils', price: 55.00, stock: 60, image: './assets/products/pencil-hb.jpg', desc: 'Standard HB graphite pencils, pre-sharpened.' },
  { id: 'pcl-002', sku: 'EP-PCL-002', name: 'Mechanical Pencil 0.5mm', category: 'Pencils', price: 38.00, stock: 22, image: './assets/products/pencil-mech.jpg', desc: 'Metal clip, cushioned grip, includes 2 refill leads.' },
  { id: 'pcl-003', sku: 'EP-PCL-003', name: 'Coloured Pencils (Set of 24)', category: 'Pencils', price: 95.00, stock: 15, image: './assets/products/pencil-colour.jpg', desc: 'Soft-core coloured pencils, pre-sharpened.' },

  // NOTEBOOKS
  { id: 'nbk-001', sku: 'EP-NBK-001', name: 'A5 Ruled Notebook (Pack of 5)', category: 'Notebooks', price: 120.00, stock: 35, image: './assets/products/notebook-a5.jpg', desc: '80 pages, side-stapled, ruled. Pack of 5.' },
  { id: 'nbk-002', sku: 'EP-NBK-002', name: 'A4 Hardcover Journal', category: 'Notebooks', price: 165.00, stock: 20, image: './assets/products/notebook-hard.jpg', desc: '192 pages, elastic closure, ribbon marker.' },
  { id: 'nbk-003', sku: 'EP-NBK-003', name: 'A4 Grid Pad (Pack of 3)', category: 'Notebooks', price: 98.00, stock: 28, image: './assets/products/notepad-grid.jpg', desc: '5mm squared paper, 100 sheets per pad.' },
  { id: 'nbk-004', sku: 'EP-NBK-004', name: 'Exercise Books (Pack of 10)', category: 'Notebooks', price: 88.00, stock: 50, image: './assets/products/notebook-ex.jpg', desc: 'A4, 48 pages, ruled with margin. Pack of 10.', tags: ['bulk', 'school'] },

  // PAPER & BOARDS
  { id: 'ppr-001', sku: 'EP-PPR-001', name: 'A4 Copy Paper 80gsm (Ream)', category: 'Paper & Boards', price: 78.00, stock: 120, image: './assets/products/paper-a4.jpg', desc: '500 sheets, bright white, 80gsm. Standard ream.', tags: ['popular', 'bulk'] },
  { id: 'ppr-002', sku: 'EP-PPR-002', name: 'A3 Copy Paper 80gsm (Ream)', category: 'Paper & Boards', price: 145.00, stock: 45, image: './assets/products/paper-a3.jpg', desc: '500 sheets, 80gsm, A3 size.' },
  { id: 'ppr-003', sku: 'EP-PPR-003', name: 'White Card Stock A4 (Pack of 50)', category: 'Paper & Boards', price: 62.00, stock: 60, image: './assets/products/card-a4.jpg', desc: '220gsm white card, A4. Pack of 50.' },
  { id: 'ppr-004', sku: 'EP-PPR-004', name: 'Display Board A1 (Pack of 5)', category: 'Paper & Boards', price: 210.00, stock: 12, image: './assets/products/board-a1.jpg', desc: 'Rigid A1 display board, white. Pack of 5.' },

  // INK & TONER
  { id: 'ink-001', sku: 'EP-INK-001', name: 'HP 305 Black Ink Cartridge', category: 'Ink & Toner', price: 285.00, stock: 14, image: './assets/products/ink-hp305.jpg', desc: 'Genuine HP 305 black ink cartridge.' },
  { id: 'ink-002', sku: 'EP-INK-002', name: 'Canon PG-245 Black Ink', category: 'Ink & Toner', price: 260.00, stock: 10, image: './assets/products/ink-canon.jpg', desc: 'Genuine Canon PG-245 black ink cartridge.' },
  { id: 'ink-003', sku: 'EP-INK-003', name: 'Brother TN-1050 Toner', category: 'Ink & Toner', price: 620.00, stock: 6, image: './assets/products/toner-brother.jpg', desc: 'Genuine Brother TN-1050 black toner.' },

  // FILES & FOLDERS
  { id: 'fil-001', sku: 'EP-FIL-001', name: 'Lever Arch File A4 (Pack of 10)', category: 'Files & Folders', price: 220.00, stock: 25, image: './assets/products/file-lever.jpg', desc: 'A4 lever arch files, assorted colours. Pack of 10.', tags: ['bulk'] },
  { id: 'fil-002', sku: 'EP-FIL-002', name: 'Box File A4 (Pack of 5)', category: 'Files & Folders', price: 165.00, stock: 30, image: './assets/products/file-box.jpg', desc: 'A4 box files with finger hole and lid.' },
  { id: 'fil-003', sku: 'EP-FIL-003', name: 'Report Folder A4 (Pack of 25)', category: 'Files & Folders', price: 140.00, stock: 40, image: './assets/products/folder-report.jpg', desc: 'Clear-front A4 report folders with prongs.' },

  // BINDERS
  { id: 'bnd-001', sku: 'EP-BND-001', name: '2-Ring Binder A4 (Pack of 10)', category: 'Binders', price: 195.00, stock: 20, image: './assets/products/binder-2ring.jpg', desc: 'A4 2-ring binders, 25mm capacity.' },
  { id: 'bnd-002', sku: 'EP-BND-002', name: 'Comb Binding Spines (Pack of 100)', category: 'Binders', price: 88.00, stock: 50, image: './assets/products/binder-comb.jpg', desc: '12mm black plastic comb binding spines.' },

  // STAPLERS & PUNCHES
  { id: 'stp-001', sku: 'EP-STP-001', name: 'Full-Strip Stapler', category: 'Staplers & Punches', price: 125.00, stock: 18, image: './assets/products/stapler-full.jpg', desc: 'Metal full-strip stapler, 25-sheet capacity.' },
  { id: 'stp-002', sku: 'EP-STP-002', name: 'Staples 24/6 (Box of 5000)', category: 'Staplers & Punches', price: 42.00, stock: 80, image: './assets/products/staples.jpg', desc: 'Standard 24/6 staples. Box of 5000.', tags: ['popular'] },
  { id: 'stp-003', sku: 'EP-STP-003', name: '2-Hole Punch (25 Sheets)', category: 'Staplers & Punches', price: 155.00, stock: 15, image: './assets/products/punch.jpg', desc: 'Heavy-duty 2-hole punch, adjustable guide.' },

  // SCISSORS & CUTTERS
  { id: 'sci-001', sku: 'EP-SCI-001', name: 'Office Scissors 21cm', category: 'Scissors & Cutters', price: 68.00, stock: 22, image: './assets/products/scissors.jpg', desc: 'Stainless steel office scissors, 21cm.' },
  { id: 'sci-002', sku: 'EP-SCI-002', name: 'A4 Paper Trimmer', category: 'Scissors & Cutters', price: 340.00, stock: 8, image: './assets/products/trimmer.jpg', desc: 'A4 guillotine-style paper trimmer with ruler.' },
  { id: 'sci-003', sku: 'EP-SCI-003', name: 'Snap-Off Utility Knife', category: 'Scissors & Cutters', price: 45.00, stock: 35, image: './assets/products/knife.jpg', desc: '18mm snap-off blade utility knife.' },

  // ADHESIVES
  { id: 'adh-001', sku: 'EP-ADH-001', name: 'Glue Sticks 21g (Pack of 12)', category: 'Adhesives & Glues', price: 95.00, stock: 40, image: './assets/products/glue-stick.jpg', desc: 'Acid-free 21g glue sticks. Pack of 12.', tags: ['popular'] },
  { id: 'adh-002', sku: 'EP-ADH-002', name: 'Correction Tape (Pack of 5)', category: 'Adhesives & Glues', price: 78.00, stock: 32, image: './assets/products/correction.jpg', desc: '5mm x 8m correction tape. Pack of 5.' },
  { id: 'adh-003', sku: 'EP-ADH-003', name: 'Liquid Glue 125ml', category: 'Adhesives & Glues', price: 38.00, stock: 45, image: './assets/products/glue-liquid.jpg', desc: 'All-purpose clear liquid glue, 125ml.' },

  // HIGHLIGHTERS & MARKERS
  { id: 'hlg-001', sku: 'EP-HLG-001', name: 'Highlighters (Pack of 6 Colours)', category: 'Highlighters & Markers', price: 68.00, stock: 50, image: './assets/products/highlighter.jpg', desc: 'Chisel-tip fluorescent highlighters, 6 colours.', tags: ['popular'] },
  { id: 'hlg-002', sku: 'EP-HLG-002', name: 'Whiteboard Markers (Pack of 4)', category: 'Highlighters & Markers', price: 82.00, stock: 28, image: './assets/products/marker-wb.jpg', desc: 'Low-odour whiteboard markers, 4 colours.' },
  { id: 'hlg-003', sku: 'EP-HLG-003', name: 'Permanent Markers (Pack of 12)', category: 'Highlighters & Markers', price: 145.00, stock: 20, image: './assets/products/marker-perm.jpg', desc: 'Black permanent markers. Pack of 12.' },

  // TAPES & DISPENSERS
  { id: 'tap-001', sku: 'EP-TAP-001', name: 'Sellotape 18mm x 33m (Pack of 8)', category: 'Tapes & Dispensers', price: 62.00, stock: 60, image: './assets/products/tape-sello.jpg', desc: 'Clear sellotape. Pack of 8.' },
  { id: 'tap-002', sku: 'EP-TAP-002', name: 'Desk Tape Dispenser', category: 'Tapes & Dispensers', price: 88.00, stock: 15, image: './assets/products/tape-disp.jpg', desc: 'Weighted desktop tape dispenser, holds 25mm rolls.' },
  { id: 'tap-003', sku: 'EP-TAP-003', name: 'Packaging Tape 48mm (Pack of 6)', category: 'Tapes & Dispensers', price: 125.00, stock: 25, image: './assets/products/tape-pack.jpg', desc: 'Heavy-duty clear packaging tape.' },

  // CALCULATORS
  { id: 'cal-001', sku: 'EP-CAL-001', name: 'Desktop Calculator 12-Digit', category: 'Calculators', price: 195.00, stock: 12, image: './assets/products/calc-desk.jpg', desc: '12-digit desktop calculator with large display.' },
  { id: 'cal-002', sku: 'EP-CAL-002', name: 'Scientific Calculator', category: 'Calculators', price: 285.00, stock: 10, image: './assets/products/calc-sci.jpg', desc: '240-function scientific calculator.' },
  { id: 'cal-003', sku: 'EP-CAL-003', name: 'Pocket Calculator 8-Digit', category: 'Calculators', price: 95.00, stock: 20, image: './assets/products/calc-pocket.jpg', desc: 'Compact 8-digit pocket calculator.' },

  // OFFICE ACCESSORIES
  { id: 'acc-001', sku: 'EP-ACC-001', name: 'Desk Organiser Set', category: 'Office Accessories', price: 220.00, stock: 10, image: './assets/products/organiser.jpg', desc: 'Multi-compartment desk organiser, black mesh.' },
  { id: 'acc-002', sku: 'EP-ACC-002', name: 'Name Badges (Pack of 50)', category: 'Office Accessories', price: 145.00, stock: 20, image: './assets/products/badges.jpg', desc: 'Clip-on name badges with insert cards.' },
  { id: 'acc-003', sku: 'EP-ACC-003', name: 'A4 Laminating Pouches 80mic (Pack of 100)', category: 'Office Accessories', price: 175.00, stock: 22, image: './assets/products/laminating.jpg', desc: '80-micron A4 laminating pouches.' }
];

const CATEGORIES = [
  'Pens', 'Pencils', 'Notebooks', 'Paper & Boards', 'Ink & Toner',
  'Files & Folders', 'Binders', 'Staplers & Punches', 'Scissors & Cutters',
  'Adhesives & Glues', 'Highlighters & Markers', 'Tapes & Dispensers',
  'Calculators', 'Office Accessories'
];

// Helper: format currency
function formatPrice(amount) {
  return 'R ' + amount.toFixed(2);
}

// Helper: get product by id
function getProduct(id) {
  return PRODUCTS.find(p => p.id === id);
}