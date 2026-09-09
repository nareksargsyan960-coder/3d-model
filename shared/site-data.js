/**
 * CADORO — single source of truth for site content.
 *
 * All three design variants import this module and render it with their own
 * templates, so copy stays in sync while the visual language stays independent.
 * Replace the placeholder figures and contact details before going live.
 */

export const BRAND = {
  name: 'CADORO',
  tagline: 'Jewelry CAD Studio',
  promise: 'From sketch to cast-ready.',
  email: 'studio@cadoro.example',
  phone: '+1 (555) 018-4420',
  whatsapp: '15550184420',
  telegram: 'cadoro_studio',
  address: 'Studio 4, 118 Goldsmith Row',
  city: 'Lisbon, Portugal',
  hours: 'Mon – Fri · 09:00 – 18:00 WET',
  founded: 2016,
  socials: [
    { label: 'Instagram', icon: 'instagram', href: '#' },
    { label: 'Behance', icon: 'palette', href: '#' },
    { label: 'LinkedIn', icon: 'linkedin', href: '#' },
  ],
};

/**
 * Metal catalogue. `color` / `roughness` drive the three.js material, `css`
 * drives the swatch dot — kept here so the UI can render swatches without
 * pulling in three.js.
 */
export const METALS = {
  yellow:   { label: '18K Yellow Gold', short: '18K YG', color: 0xd6a13d, roughness: 0.16, css: '#d6a13d' },
  rose:     { label: '18K Rose Gold',   short: '18K RG', color: 0xd08a6e, roughness: 0.18, css: '#d08a6e' },
  white:    { label: '18K White Gold',  short: '18K WG', color: 0xe8e8ee, roughness: 0.10, css: '#e8e8ee' },
  platinum: { label: 'Platinum 950',    short: 'PT950',  color: 0xd0d5da, roughness: 0.22, css: '#d0d5da' },
  silver:   { label: 'Sterling Silver', short: '925',    color: 0xc2c7cd, roughness: 0.14, css: '#c2c7cd' },
};

export const STATS = [
  { value: 1240, suffix: '+', label: 'Models delivered' },
  { value: 9, suffix: ' yrs', label: 'In production CAD' },
  { value: 40, suffix: '+', label: 'Brands & workshops' },
  { value: 14, suffix: '', label: 'Countries shipped to' },
];

export const SERVICES = [
  {
    icon: 'gem',
    title: 'CAD Jewelry Modeling',
    text: 'Rings, pendants, earrings and bracelets modelled in Rhino and Matrix to real manufacturing tolerances — not pretty meshes that fall apart on the casting table.',
    meta: 'Rhino · Matrix · ZBrush',
  },
  {
    icon: 'pen-tool',
    title: 'Sketch & Photo to 3D',
    text: 'Send a napkin drawing, a CAD-less legacy piece or a single photograph of an heirloom. We rebuild it as a clean, editable, re-sizeable model.',
    meta: 'Reverse engineering',
  },
  {
    icon: 'image',
    title: 'Photoreal Rendering',
    text: 'Studio-lit renders and 360° turntables in your chosen metal and stone, ready for the catalogue or client approval before a gram of gold is melted.',
    meta: 'KeyShot · 4K · turntables',
  },
  {
    icon: 'file-check',
    title: 'Print & Cast-Ready Prep',
    text: 'Watertight meshes, wall-thickness audit, sprue placement and shrinkage compensation checked against your caster\'s written spec sheet.',
    meta: 'STL · 3MF · watertight',
  },
  {
    icon: 'sparkles',
    title: 'Stone Setting & Pavé',
    text: 'Prong, bezel, channel and micro-pavé layouts with accurate seats, girdle clearance and a stone schedule your setter can actually order from.',
    meta: 'Seats · schedules · CAD pavé',
  },
  {
    icon: 'cpu',
    title: 'CNC & Wax Milling Files',
    text: 'Toolpath-friendly geometry and true STEP solids for wax milling, direct metal machining and hard-tooling programmes.',
    meta: 'STEP · IGES · solids',
  },
];

export const PROCESS = [
  { day: 'Day 0', title: 'Brief', text: 'You send sketches, references, stone sizes and finger size. We confirm scope, price and delivery date in writing before anything starts.' },
  { day: 'Day 1', title: 'Concept block-out', text: 'We rough the silhouette and share a first turntable, so proportions and volume are agreed while changes are still cheap.' },
  { day: 'Day 2–3', title: 'CAD modeling', text: 'The full solid model is built with real tolerances: seats, clearances, wall thickness and finger comfort fit.' },
  { day: 'Day 4', title: 'Render approval', text: 'Studio renders in the metal and stone you specified. You approve, or mark up exactly what to change.' },
  { day: 'Day 5', title: 'Revisions', text: 'Two rounds of revisions are included in every quote. Most projects only ever use one.' },
  { day: 'Day 6', title: 'File delivery', text: 'STL, 3DM, OBJ, STEP and 3MF, plus a stone schedule, weight estimate in your metal and a printable spec sheet.' },
];

const U = (id, w = 900) =>
  `https://images.unsplash.com/photo-${id}?auto=format&fit=crop&w=${w}&q=80`;

export const PORTFOLIO = [
  { id: 'aurora',   cat: 'rings',     title: 'Aurora Halo',        img: U('1605100804763-247f67b3557e'), metal: '18K White & Rose Gold', stones: '1.20 ct centre · 42 pavé', formats: 'STL · 3DM · STEP', note: 'Two-tone halo with a split shank. Rose-gold milgrain modelled as a separate solid so the client can cast it in one metal or two.' },
  { id: 'cabochon', cat: 'rings',     title: 'Cabochon Trio',      img: U('1608042314453-ae338d80c427'), metal: '18K Yellow Gold', stones: 'Turquoise · carnelian · agate', formats: 'STL · 3DM · OBJ', note: 'Three bezel settings sharing one parametric band profile, so the whole family re-sizes from a single parameter.' },
  { id: 'vela',     cat: 'rings',     title: 'Vela Stacking Set',  img: U('1584302179602-e4c3d3fd629d'), metal: '14K Yellow Gold', stones: '1.8 mm hollow bands', formats: 'STL · 3MF', note: 'Hollow-core stacking bands weight-optimised to cut 31% of metal without losing rigidity.' },
  { id: 'lumen',    cat: 'pendants',  title: 'Lumen Cushion Halo', img: U('1589128777073-263566ae5e4d'), metal: '18K White Gold', stones: '0.55 ct cushion · 20 halo', formats: 'STL · 3DM · STEP', note: 'Cushion halo with a hidden bail. Bail geometry tested against a 0.9 mm box chain before release.' },
  { id: 'solstice', cat: 'pendants',  title: 'Solstice Layer Set', img: U('1599643478518-a784e5dc4c8f'), metal: '14K Yellow Gold', stones: 'London blue topaz', formats: 'STL · OBJ', note: 'A layered pair designed to hang at 42 cm and 50 cm without the two pendants colliding.' },
  { id: 'akoya',    cat: 'pendants',  title: 'Akoya Strand',       img: U('1515562141207-7a88fb7ce338'), metal: 'Platinum 950 clasp', stones: '7.5 mm Akoya · pavé rondelle', formats: 'STL · 3DM', note: 'Pavé rondelle clasp modelled with the drill channel included, so the stringer needed no rework.' },
  { id: 'monstera', cat: 'earrings',  title: 'Monstera Drop',      img: U('1535632066927-ab7c9ab60908'), metal: 'Rhodium-plated silver', stones: 'Sapphire pear · baguette frame', formats: 'STL · 3DM', note: 'Articulated drop with a 0.6 mm jump-ring tolerance so the piece swings instead of sitting rigid.' },
  { id: 'torsade',  cat: 'earrings',  title: 'Torsade Hoop',       img: U('1617038220319-276d3cfab638'), metal: '18K Yellow Gold', stones: '—', formats: 'STL · 3MF · STEP', note: 'Hollow twisted hoop, 24 mm. Twist generated parametrically so pitch and gauge are adjustable on request.' },
  { id: 'infinity', cat: 'bracelets', title: 'Infinity Line',      img: U('1611591437281-460bfbe1220a'), metal: '18K Rose Gold', stones: '186 pavé stones', formats: 'STL · 3DM', note: 'Repeating link with a shared-prong pavé field. Stone schedule generated straight from the model.' },
  { id: 'cable',    cat: 'bracelets', title: 'Cable Link',         img: U('1602173574767-37ac01994b2a'), metal: '14K Yellow Gold', stones: '—', formats: 'STL · STEP', note: '9 mm oval links with a lobster clasp, each link modelled as a separate castable solid.' },
  { id: 'tennis',   cat: 'bracelets', title: 'Tennis Classic',     img: U('1573408301185-9146fe634ad0'), metal: 'Platinum 950', stones: '52 × 0.05 ct', formats: 'STL · 3DM · STEP', note: 'Four-prong tennis line with a concealed box clasp and a figure-eight safety catch.' },
  { id: 'ginkgo',   cat: 'custom',    title: 'Ginkgo Signature',   img: U('1620656798579-1984d9e87df7'), metal: '18K Yellow Gold', stones: '—', formats: 'STL · OBJ · 3MF', note: 'Sculpted pendant and matching open ring, digitally sculpted in ZBrush then retopologised for casting.' },
];

export const PORTFOLIO_FILTERS = [
  { id: 'all', label: 'All work' },
  { id: 'rings', label: 'Rings' },
  { id: 'pendants', label: 'Pendants' },
  { id: 'earrings', label: 'Earrings' },
  { id: 'bracelets', label: 'Bracelets' },
  { id: 'custom', label: 'Custom' },
];

export const LIFESTYLE = {
  hands: U('1596944924616-7b38e7cfac36', 1200),
  model: U('1550639525-c97d455acf70', 1200),
};

export const CAPABILITIES = [
  { title: 'Software', items: ['Rhino + Grasshopper', 'MatrixGold', 'ZBrush', 'Blender', 'KeyShot 12'] },
  { title: 'Delivery formats', items: ['STL — printing & casting', '3DM — editable NURBS', 'STEP / IGES — solids & CNC', 'OBJ — rendering & review', '3MF — modern print queues'] },
  { title: 'Checked before delivery', items: ['Watertight, manifold mesh', 'Min. wall thickness 0.6 mm', 'Prong seats & girdle clearance', 'Comfort-fit inner profile', 'Weight estimate per metal'] },
];

export const WHY = [
  { icon: 'shield-check', title: 'NDA by default', text: 'Every project is covered by a mutual NDA before the first file moves. Your designs are never used in our public portfolio without written consent.' },
  { icon: 'ruler', title: 'Manufacturing-checked', text: 'We model against your caster\'s spec, not a generic template. Wall thickness, shrinkage and sprue placement are verified before you get the files.' },
  { icon: 'clock', title: 'First render in 48 h', text: 'You see a real render of your piece within two working days of the brief being confirmed — not a week later.' },
  { icon: 'download', title: 'You own the files', text: 'Full commercial rights and the editable source model, not just a locked STL. No licence fees, no per-cast royalties, ever.' },
];

export const TESTIMONIALS = [
  { quote: 'We sent a 1970s heirloom ring and three blurry photographs. What came back was a clean parametric model that cast first time — no rework, no lost wax.', name: 'Marta Silveira', role: 'Owner, Silveira Ourivesaria', place: 'Porto, Portugal' },
  { quote: 'The stone schedule alone saved our setter two days per collection. It is the first CAD studio we have worked with that thinks about what happens after the file lands.', name: 'Daniel Okonkwo', role: 'Production Lead, Meridian Fine', place: 'London, UK' },
  { quote: 'Forty-two pieces over eighteen months and not one casting failure. Their wall-thickness audit catches things our own team used to miss.', name: 'Yelena Abrahamyan', role: 'Founder, Nore Atelier', place: 'Yerevan, Armenia' },
  { quote: 'Renders good enough to sell from. We listed six pieces on pre-order using their turntables before a single one had been cast.', name: 'Chris Laurent', role: 'Creative Director, Maison Laurent', place: 'Antwerp, Belgium' },
];

export const FAQ = [
  { q: 'What exactly do I receive at the end?', a: 'A folder containing the print-ready STL, the editable 3DM source model, STEP solids for CNC, an OBJ for rendering, plus a stone schedule, a weight estimate in your chosen metal and a one-page printable spec sheet.' },
  { q: 'Can you work from a photograph or a hand sketch?', a: 'Yes — that is most of our work. A clear photograph with a reference for scale (a coin, a ruler, or the finger size) is usually enough. For heirloom reproduction we ask for three angles.' },
  { q: 'Will the file actually cast without rework?', a: 'That is the whole job. Every model is checked for watertight geometry, a minimum 0.6 mm wall thickness, prong seats, girdle clearance and shrinkage compensation. If your caster has a written spec, we model to theirs instead of ours.' },
  { q: 'How many revisions are included?', a: 'Two rounds on Essential and Studio, unlimited minor revisions on Production. A "round" means one consolidated list of changes, not one change at a time.' },
  { q: 'Who owns the finished model?', a: 'You do — outright, including the editable source file and full commercial rights. There are no licence fees and no royalty per cast. We only show a piece in our portfolio if you agree in writing.' },
  { q: 'Do you sign an NDA?', a: 'Always, and before you send anything. A mutual NDA is issued as part of the first reply to every enquiry.' },
  { q: 'How fast can you turn a piece around?', a: 'Standard is five to six working days from a confirmed brief. A rush slot delivers in 48 hours where the queue allows.' },
  { q: 'Do you cast and manufacture as well?', a: 'No, and that is deliberate. We are a modelling studio, so we stay neutral and work with whichever casting house or 3D print bureau you already trust.' },
];

export const NAV = [
  { href: '#work', label: 'Work' },
  { href: '#services', label: 'Services' },
  { href: '#process', label: 'Process' },
  { href: '#materials', label: 'Materials' },
  { href: '#pricing', label: 'Pricing' },
  { href: '#contact', label: 'Contact' },
];
