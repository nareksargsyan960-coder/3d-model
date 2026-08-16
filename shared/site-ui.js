/**
 * CADORO — shared markup renderers and behaviour.
 *
 * Every design variant renders the same DOM with the same class names and then
 * styles it completely differently. That keeps the three designs an honest
 * comparison: same content, same interactions, different visual language.
 */

import * as DefaultData from './site-data.js';

let D = DefaultData;

/* -------------------------------------------------------------------------- */
/* Utilities                                                                   */
/* -------------------------------------------------------------------------- */

export const $ = (sel, root = document) => root.querySelector(sel);
export const $$ = (sel, root = document) => Array.from(root.querySelectorAll(sel));

const ESCAPES = { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' };
const esc = (v) => String(v).replace(/[&<>"']/g, (c) => ESCAPES[c]);

const prefersReducedMotion = () =>
  window.matchMedia('(prefers-reduced-motion: reduce)').matches;

const icon = (name) => `<i data-lucide="${esc(name)}" aria-hidden="true"></i>`;
const ui = (key, fallback) => D.UI?.[key] ?? fallback;

function paint(key, html) {
  const host = document.querySelector(`[data-render="${key}"]`);
  if (host) host.innerHTML = html;
  return host;
}

/* -------------------------------------------------------------------------- */
/* Renderers                                                                   */
/* -------------------------------------------------------------------------- */

function renderNav() {
  const links = D.NAV.map(
    (n) => `<a class="nav-link" href="${n.href}">${esc(n.label)}</a>`
  ).join('');
  paint('nav', links);
  paint('nav-mobile', links);
}

function renderStats() {
  paint('stats', D.STATS.map((s, i) => `
    <div class="stat" data-reveal style="--d:${i * 60}ms">
      <div class="stat-value" data-count="${s.value}" data-suffix="${esc(s.suffix)}">0${esc(s.suffix)}</div>
      <div class="stat-label">${esc(s.label)}</div>
    </div>`).join(''));
}

function renderServices() {
  paint('services', D.SERVICES.map((s, i) => `
    <article class="svc-card" data-reveal data-tilt style="--d:${i * 55}ms">
      <span class="svc-icon">${icon(s.icon)}</span>
      <h3 class="svc-title">${esc(s.title)}</h3>
      <p class="svc-text">${esc(s.text)}</p>
      <span class="svc-meta">${esc(s.meta)}</span>
    </article>`).join(''));
}

function renderProcess() {
  paint('process', D.PROCESS.map((p, i) => `
    <li class="step" data-reveal style="--d:${i * 55}ms">
      <span class="step-num">${String(i + 1).padStart(2, '0')}</span>
      <span class="step-day">${esc(p.day)}</span>
      <h3 class="step-title">${esc(p.title)}</h3>
      <p class="step-text">${esc(p.text)}</p>
    </li>`).join(''));
}

function renderPortfolio() {
  paint('filters', D.PORTFOLIO_FILTERS.map((f, i) => `
    <button type="button" class="filter-btn${i === 0 ? ' is-active' : ''}"
            data-filter="${esc(f.id)}" aria-pressed="${i === 0}">${esc(f.label)}</button>`).join(''));

  paint('portfolio', D.PORTFOLIO.map((p, i) => `
    <button type="button" class="pf-item" data-cat="${esc(p.cat)}" data-id="${esc(p.id)}"
            data-reveal style="--d:${(i % 4) * 60}ms"
            aria-label="${esc(ui('openCaseStudy', 'Open case study'))}: ${esc(p.title)}">
      <span class="pf-media">
        <img class="pf-img" src="${esc(p.img)}" alt="${esc(p.title)} — ${esc(p.metal)}" loading="lazy" decoding="async">
        <span class="pf-mesh" aria-hidden="true"></span>
        <span class="pf-badge">${esc(p.formats)}</span>
      </span>
      <span class="pf-info">
        <span class="pf-title">${esc(p.title)}</span>
        <span class="pf-spec">${esc(p.metal)}</span>
      </span>
    </button>`).join(''));
}

function renderMaterials() {
  paint('metals', Object.entries(D.METALS).map(([key, m], i) => `
    <button type="button" class="metal-btn${i === 0 ? ' is-active' : ''}" data-metal="${esc(key)}"
            aria-pressed="${i === 0}">
      <span class="metal-dot" style="--metal:${esc(m.css)}"></span>
      <span class="metal-name">${esc(m.label)}</span>
      <span class="metal-code">${esc(m.short)}</span>
    </button>`).join(''));
}

function renderCapabilities() {
  paint('capabilities', D.CAPABILITIES.map((c, i) => `
    <div class="cap-col" data-reveal style="--d:${i * 70}ms">
      <h3 class="cap-title">${esc(c.title)}</h3>
      <ul class="cap-list">
        ${c.items.map((it) => `<li>${esc(it)}</li>`).join('')}
      </ul>
    </div>`).join(''));
}

function renderWhy() {
  paint('why', D.WHY.map((w, i) => `
    <article class="why-card" data-reveal style="--d:${i * 60}ms">
      <span class="why-icon">${icon(w.icon)}</span>
      <h3 class="why-title">${esc(w.title)}</h3>
      <p class="why-text">${esc(w.text)}</p>
    </article>`).join(''));
}

function renderTestimonials() {
  paint('testimonials', D.TESTIMONIALS.map((t) => `
    <div class="swiper-slide">
      <figure class="tm-card">
        <span class="tm-mark">${icon('quote')}</span>
        <blockquote class="tm-quote">${esc(t.quote)}</blockquote>
        <figcaption class="tm-by">
          <span class="tm-name">${esc(t.name)}</span>
          <span class="tm-role">${esc(t.role)} · ${esc(t.place)}</span>
        </figcaption>
      </figure>
    </div>`).join(''));
}

function renderPricing() {
  paint('pricing', D.PRICING.map((p, i) => `
    <article class="price-card${p.featured ? ' price-card--featured' : ''}" data-reveal style="--d:${i * 70}ms">
      ${p.featured ? `<span class="price-flag">${esc(ui('mostOrdered', 'Most ordered'))}</span>` : ''}
      <h3 class="price-name">${esc(p.name)}</h3>
      <p class="price-blurb">${esc(p.blurb)}</p>
      <div class="price-value"><span class="price-from">${esc(ui('from', 'from'))}</span>
        <span class="price-num">${D.ESTIMATOR.symbol}${p.price}</span>
        <span class="price-unit">${esc(p.unit)}</span>
      </div>
      <ul class="price-list">
        ${p.features.map((f) => `<li>${icon('check')}<span>${esc(f)}</span></li>`).join('')}
      </ul>
      <a class="btn ${p.featured ? 'btn--primary' : 'btn--ghost'} price-cta" href="#contact">${esc(ui('startWith', 'Start with'))} ${esc(p.name)}</a>
    </article>`).join(''));
}

function renderFaq() {
  paint('faq', D.FAQ.map((f, i) => `
    <div class="faq-item" data-reveal style="--d:${i * 35}ms">
      <h3>
        <button type="button" class="faq-q" aria-expanded="false" aria-controls="faq-a-${i}" id="faq-q-${i}">
          <span>${esc(f.q)}</span>${icon('plus')}
        </button>
      </h3>
      <div class="faq-a" id="faq-a-${i}" role="region" aria-labelledby="faq-q-${i}" hidden>
        <p>${esc(f.a)}</p>
      </div>
    </div>`).join(''));
}

function renderEstimator() {
  const opts = (arr) => arr.map((o) => `<option value="${esc(o.id)}">${esc(o.label)}</option>`).join('');
  paint('estimator', `
    <div class="est-controls">
      <label class="field">
        <span class="field-label">${esc(ui('estimatorWhat', 'What are we modelling?'))}</span>
        <select class="field-input" id="est-type">${opts(D.ESTIMATOR.types)}</select>
      </label>
      <label class="field">
        <span class="field-label">${esc(ui('estimatorDetail', 'Level of detail'))}</span>
        <select class="field-input" id="est-complexity">${opts(D.ESTIMATOR.complexity)}</select>
      </label>
      <label class="field">
        <span class="field-label">${esc(ui('estimatorTurnaround', 'Turnaround'))}</span>
        <select class="field-input" id="est-turnaround">${opts(D.ESTIMATOR.turnaround)}</select>
      </label>
      <label class="field field--range">
        <span class="field-label">${esc(ui('estimatorStones', 'Stones to set'))} <output id="est-stones-out">0</output></span>
        <input class="field-range" type="range" id="est-stones" min="0" max="${D.ESTIMATOR.stone.max}" step="1" value="0">
      </label>
    </div>
    <div class="est-result" aria-live="polite">
      <div class="est-row">
        <span class="est-key">${esc(ui('estimatedRange', 'Estimated range'))}</span>
        <span class="est-val" id="est-price">—</span>
      </div>
      <div class="est-row">
        <span class="est-key">${esc(ui('workingDays', 'Working days'))}</span>
        <span class="est-val" id="est-days">—</span>
      </div>
      <p class="est-note">${esc(ui('estimatorNote', 'Indicative only — a written quote follows your brief. Complex pavé fields and articulated pieces are priced individually.'))}</p>
      <button type="button" class="btn btn--primary est-send" id="est-send">${icon('arrow-right')}<span>${esc(ui('estimatorSend', 'Send this brief to the studio'))}</span></button>
    </div>`);
}

function renderFooterMeta() {
  const b = D.BRAND;
  paint('footer-nav', D.NAV.map((n) => `<a href="${n.href}">${esc(n.label)}</a>`).join(''));
  paint('socials', b.socials.map((s) => `
    <a class="social" href="${esc(s.href)}" aria-label="${esc(s.label)}">${icon(s.icon)}</a>`).join(''));
  $$('[data-brand]').forEach((el) => { el.textContent = b[el.dataset.brand] ?? ''; });
  $$('[data-brand-href="email"]').forEach((el) => { el.href = `mailto:${b.email}`; });
  $$('[data-brand-href="phone"]').forEach((el) => { el.href = `tel:${b.phone.replace(/[^\d+]/g, '')}`; });
  $$('[data-brand-href="whatsapp"]').forEach((el) => { el.href = `https://wa.me/${b.whatsapp}`; });
  $$('[data-brand-href="telegram"]').forEach((el) => { el.href = `https://t.me/${b.telegram}`; });
  $$('[data-year]').forEach((el) => { el.textContent = new Date().getFullYear(); });
}

/* -------------------------------------------------------------------------- */
/* Behaviour                                                                   */
/* -------------------------------------------------------------------------- */

let lenis = null;
let motionEnabled = true;

function initScroll(config) {
  // `motion: false` variants opt out of every moving effect: no smooth scroll,
  // no scroll reveals, no counting numbers, no slider. Static by design.
  const still = !config.motion;
  const reduce = prefersReducedMotion() || still;
  const hasGsap = !still && typeof window.gsap !== 'undefined';
  const hasST = hasGsap && typeof window.ScrollTrigger !== 'undefined';

  if (hasST) window.gsap.registerPlugin(window.ScrollTrigger);

  if (config.motion && config.lenis && typeof window.Lenis !== 'undefined' && !reduce) {
    lenis = new window.Lenis({ duration: 1.05, smoothWheel: true, touchMultiplier: 1.6 });
    if (hasGsap) {
      lenis.on('scroll', () => { if (hasST) window.ScrollTrigger.update(); });
      window.gsap.ticker.add((t) => lenis.raf(t * 1000));
      window.gsap.ticker.lagSmoothing(0);
    } else {
      const raf = (t) => { lenis.raf(t); requestAnimationFrame(raf); };
      requestAnimationFrame(raf);
    }
  }
  return { hasGsap, hasST, reduce };
}

function initReveal({ hasST, reduce }) {
  const items = $$('[data-reveal]');
  if (reduce) { items.forEach((el) => el.classList.add('is-in')); return; }

  if (hasST) {
    items.forEach((el) => {
      window.ScrollTrigger.create({
        trigger: el,
        start: 'top 88%',
        once: true,
        onEnter: () => el.classList.add('is-in'),
      });
    });
    return;
  }

  const io = new IntersectionObserver((entries) => {
    entries.forEach((e) => {
      if (!e.isIntersecting) return;
      e.target.classList.add('is-in');
      io.unobserve(e.target);
    });
  }, { rootMargin: '0px 0px -10% 0px' });
  items.forEach((el) => io.observe(el));
}

function initNav() {
  const header = $('.site-header');
  const toggle = $('.nav-toggle');
  const drawer = $('.nav-drawer');
  const links = $$('.nav-link');
  const sections = D.NAV
    .map((n) => document.querySelector(n.href))
    .filter(Boolean);

  const onScroll = () => {
    header?.classList.toggle('is-stuck', window.scrollY > 24);
  };
  onScroll();
  window.addEventListener('scroll', onScroll, { passive: true });

  const closeDrawer = () => {
    drawer?.classList.remove('is-open');
    toggle?.setAttribute('aria-expanded', 'false');
    document.body.classList.remove('nav-locked');
  };

  toggle?.addEventListener('click', () => {
    const open = drawer.classList.toggle('is-open');
    toggle.setAttribute('aria-expanded', String(open));
    document.body.classList.toggle('nav-locked', open);
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') closeDrawer();
  });

  // Anchor navigation, routed through Lenis when it is running.
  $$('a[href^="#"]').forEach((a) => {
    a.addEventListener('click', (e) => {
      const id = a.getAttribute('href');
      if (!id || id === '#') return;
      const target = document.querySelector(id);
      if (!target) return;
      e.preventDefault();
      closeDrawer();
      const offset = -((header?.offsetHeight ?? 0) + 12);
      const top = target.getBoundingClientRect().top + window.scrollY + offset;
      if (lenis) lenis.scrollTo(target, { offset });
      else window.scrollTo({ top, behavior: motionEnabled ? 'smooth' : 'auto' });
      history.replaceState(null, '', id);
    });
  });

  // Scroll-spy
  if (sections.length) {
    const spy = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        const id = `#${entry.target.id}`;
        links.forEach((l) => l.classList.toggle('is-active', l.getAttribute('href') === id));
      });
    }, { rootMargin: '-45% 0px -50% 0px' });
    sections.forEach((s) => spy.observe(s));
  }
}

function initCounters({ reduce }) {
  const els = $$('[data-count]');
  if (!els.length) return;

  const run = (el) => {
    const target = Number(el.dataset.count) || 0;
    const suffix = el.dataset.suffix || '';
    if (reduce) { el.textContent = target.toLocaleString() + suffix; return; }
    const start = performance.now();
    const dur = 1400;
    const step = (now) => {
      const t = Math.min(1, (now - start) / dur);
      const eased = 1 - Math.pow(1 - t, 3);
      el.textContent = Math.round(target * eased).toLocaleString() + suffix;
      if (t < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  };

  const io = new IntersectionObserver((entries) => {
    entries.forEach((e) => {
      if (!e.isIntersecting) return;
      run(e.target);
      io.unobserve(e.target);
    });
  }, { threshold: 0.4 });
  els.forEach((el) => io.observe(el));
}

/**
 * Small purpose-built lightbox. A library was tried first, but building the
 * gallery from a data array rather than DOM anchors — which is what filtering
 * needs — made it throw. Sixty lines here buys a clean console, a caption that
 * can carry the full case notes, and a proper focus trap.
 */
function createLightbox() {
  const el = document.createElement('div');
  el.className = 'lb';
  el.hidden = true;
  el.setAttribute('role', 'dialog');
  el.setAttribute('aria-modal', 'true');
  el.setAttribute('aria-label', ui('caseStudy', 'Case study'));
  el.innerHTML = `
    <div class="lb-backdrop" data-lb-close></div>
    <div class="lb-panel">
      <button class="lb-nav lb-prev" type="button" aria-label="${esc(ui('previousPiece', 'Previous piece'))}">${icon('chevron-left')}</button>
      <figure class="lb-figure">
        <img class="lb-img" alt="">
        <figcaption class="lb-cap">
          <span class="lb-count"></span>
          <h3 class="lb-title"></h3>
          <p class="lb-meta"></p>
          <p class="lb-note"></p>
          <p class="lb-formats"></p>
        </figcaption>
      </figure>
      <button class="lb-nav lb-next" type="button" aria-label="${esc(ui('nextPiece', 'Next piece'))}">${icon('chevron-right')}</button>
      <button class="lb-close" type="button" data-lb-close aria-label="${esc(ui('close', 'Close'))}">${icon('x')}</button>
    </div>`;
  document.body.appendChild(el);

  let list = [];
  let index = 0;
  let opener = null;

  const parts = {
    img: $('.lb-img', el), title: $('.lb-title', el), meta: $('.lb-meta', el),
    note: $('.lb-note', el), formats: $('.lb-formats', el), count: $('.lb-count', el),
    close: $('.lb-close', el),
  };

  const paintSlide = () => {
    const p = list[index];
    if (!p) return;
    parts.img.src = p.img;
    parts.img.alt = `${p.title} — ${p.metal}`;
    parts.title.textContent = p.title;
    parts.meta.textContent = `${p.metal} · ${p.stones}`;
    parts.note.textContent = p.note;
    parts.formats.textContent = `${ui('deliveredAs', 'Delivered as')} ${p.formats}`;
    parts.count.textContent = `${index + 1} / ${list.length}`;
  };

  const step = (dir) => {
    index = (index + dir + list.length) % list.length;
    paintSlide();
  };

  const close = () => {
    el.hidden = true;
    document.body.classList.remove('nav-locked');
    lenis?.start();
    opener?.focus();
  };

  const open = (items, at, trigger) => {
    list = items;
    index = at;
    opener = trigger;
    paintSlide();
    el.hidden = false;
    document.body.classList.add('nav-locked');
    lenis?.stop();
    parts.close.focus();
  };

  $$('[data-lb-close]', el).forEach((b) => b.addEventListener('click', close));
  $('.lb-prev', el).addEventListener('click', () => step(-1));
  $('.lb-next', el).addEventListener('click', () => step(1));

  el.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') { e.stopPropagation(); close(); }
    else if (e.key === 'ArrowLeft') step(-1);
    else if (e.key === 'ArrowRight') step(1);
    else if (e.key === 'Tab') {
      // Keep focus inside the dialog.
      const focusable = $$('button', el).filter((b) => b.offsetParent !== null);
      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
      else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
    }
  });

  window.lucide?.createIcons({ nameAttr: 'data-lucide' });
  return { open };
}

function initPortfolio(config) {
  const grid = $('[data-render="portfolio"]');
  if (!grid) return;

  const items = $$('.pf-item', grid);
  const buttons = $$('.filter-btn');
  const lightbox = config.lightbox ? createLightbox() : null;
  let visible = D.PORTFOLIO.slice();

  const applyFilter = (cat) => {
    visible = cat === 'all' ? D.PORTFOLIO.slice() : D.PORTFOLIO.filter((p) => p.cat === cat);
    const ids = new Set(visible.map((p) => p.id));
    items.forEach((el) => {
      const show = ids.has(el.dataset.id);
      el.classList.toggle('is-hidden', !show);
      el.tabIndex = show ? 0 : -1;
    });
    window.ScrollTrigger?.refresh();
  };

  buttons.forEach((btn) => {
    btn.addEventListener('click', () => {
      buttons.forEach((b) => {
        const on = b === btn;
        b.classList.toggle('is-active', on);
        b.setAttribute('aria-pressed', String(on));
      });
      applyFilter(btn.dataset.filter);
    });
  });

  items.forEach((el) => {
    el.addEventListener('click', () => {
      const at = visible.findIndex((p) => p.id === el.dataset.id);
      if (lightbox && at >= 0) lightbox.open(visible, at, el);
    });
  });
}

function initFaq() {
  const items = $$('.faq-item');
  items.forEach((item) => {
    const btn = $('.faq-q', item);
    const panel = $('.faq-a', item);
    btn.addEventListener('click', () => {
      const open = btn.getAttribute('aria-expanded') === 'true';
      items.forEach((other) => {
        const b = $('.faq-q', other);
        const p = $('.faq-a', other);
        b.setAttribute('aria-expanded', 'false');
        p.hidden = true;
        other.classList.remove('is-open');
      });
      if (!open) {
        btn.setAttribute('aria-expanded', 'true');
        panel.hidden = false;
        item.classList.add('is-open');
      }
    });
  });
}

function initEstimator() {
  const type = $('#est-type');
  if (!type) return;
  const complexity = $('#est-complexity');
  const turnaround = $('#est-turnaround');
  const stones = $('#est-stones');
  const stonesOut = $('#est-stones-out');
  const priceEl = $('#est-price');
  const daysEl = $('#est-days');
  const send = $('#est-send');
  let last = null;

  const update = () => {
    stonesOut.textContent = stones.value;
    last = D.estimate({
      type: type.value,
      complexity: complexity.value,
      stones: stones.value,
      turnaround: turnaround.value,
    });
    priceEl.textContent = `${D.ESTIMATOR.symbol}${last.low.toLocaleString()} – ${D.ESTIMATOR.symbol}${last.high.toLocaleString()}`;
    if (D.UI) {
      const mod10 = last.days % 10;
      const mod100 = last.days % 100;
      const dayWord = mod10 === 1 && mod100 !== 11
        ? ui('dayOne', 'working day')
        : mod10 >= 2 && mod10 <= 4 && !(mod100 >= 12 && mod100 <= 14)
          ? ui('daysFew', 'working days')
          : ui('daysMany', 'working days');
      daysEl.textContent = `${last.days} ${dayWord}`;
    } else {
      daysEl.textContent = `${last.days} working day${last.days === 1 ? '' : 's'}`;
    }
  };

  [type, complexity, turnaround].forEach((el) => el.addEventListener('change', update));
  stones.addEventListener('input', update);
  update();

  send?.addEventListener('click', () => {
    const message = $('#f-message');
    const contact = document.querySelector('#contact');
    if (message && last) {
      message.value =
        `${ui('estimatorBrief', 'Estimator brief')}: ${last.label}.\n` +
        `${ui('indicativeRange', 'Indicative range')} ${D.ESTIMATOR.symbol}${last.low}–${D.ESTIMATOR.symbol}${last.high}, ` +
        `${ui('aboutDays', 'about')} ${last.days} ${ui('daysMany', 'working days')}.\n\n${ui('projectDetails', 'Project details')}: `;
      message.dispatchEvent(new Event('input'));
    }
    if (contact) {
      if (lenis) lenis.scrollTo(contact, { offset: -80 });
      else contact.scrollIntoView({ behavior: 'smooth' });
      setTimeout(() => $('#f-name')?.focus(), 600);
    }
  });
}

function initForm() {
  const form = $('#contact-form');
  if (!form) return;

  const status = $('#form-status');
  const drop = $('#f-drop');
  const fileInput = $('#f-file');
  const fileList = $('#f-filelist');
  const submit = $('#form-submit');

  const setError = (field, msg) => {
    const wrap = field.closest('.field');
    const err = wrap?.querySelector('.field-error');
    field.setAttribute('aria-invalid', msg ? 'true' : 'false');
    wrap?.classList.toggle('has-error', !!msg);
    if (err) err.textContent = msg || '';
    return !msg;
  };

  const validators = {
    'f-name': (v) => (v.trim().length >= 2 ? '' : ui('nameError', 'Please tell us your name.')),
    'f-email': (v) => (/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v.trim()) ? '' : ui('emailError', 'A valid email address is required for the quote.')),
    'f-message': (v) => (v.trim().length >= 12 ? '' : ui('messageError', 'A sentence or two about the piece helps us quote accurately.')),
  };

  const validateField = (field) => setError(field, validators[field.id]?.(field.value) ?? '');

  Object.keys(validators).forEach((id) => {
    const field = document.getElementById(id);
    field?.addEventListener('blur', () => validateField(field));
    field?.addEventListener('input', () => {
      if (field.closest('.field')?.classList.contains('has-error')) validateField(field);
    });
  });

  /* Drag & drop — files are listed locally and never uploaded anywhere. */
  const showFiles = (files) => {
    const names = Array.from(files).slice(0, 6);
    fileList.innerHTML = names.length
      ? names.map((f) => `
          <li><i data-lucide="file-check" aria-hidden="true"></i>
          <span>${esc(f.name)}</span>
          <em>${(f.size / 1024).toFixed(0)} KB</em></li>`).join('')
      : '';
    window.lucide?.createIcons();
  };

  if (drop) {
    ['dragenter', 'dragover'].forEach((ev) =>
      drop.addEventListener(ev, (e) => { e.preventDefault(); drop.classList.add('is-over'); }));
    ['dragleave', 'drop'].forEach((ev) =>
      drop.addEventListener(ev, (e) => { e.preventDefault(); drop.classList.remove('is-over'); }));
    drop.addEventListener('drop', (e) => {
      if (e.dataTransfer?.files?.length) {
        fileInput.files = e.dataTransfer.files;
        showFiles(e.dataTransfer.files);
      }
    });
    drop.addEventListener('click', () => fileInput.click());
    drop.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); fileInput.click(); }
    });
    fileInput?.addEventListener('change', () => showFiles(fileInput.files));
  }

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const fields = Object.keys(validators).map((id) => document.getElementById(id));
    const ok = fields.map(validateField).every(Boolean);

    if (!ok) {
      status.className = 'form-status is-error';
      status.textContent = ui('correctFields', 'Please correct the highlighted fields.');
      fields.find((f) => f.getAttribute('aria-invalid') === 'true')?.focus();
      return;
    }

    submit.disabled = true;
    submit.classList.add('is-loading');
    status.className = 'form-status is-pending';
    status.textContent = ui('sending', 'Sending…');

    // Demo only: there is no backend, so we simulate the round trip.
    setTimeout(() => {
      submit.disabled = false;
      submit.classList.remove('is-loading');
      form.classList.add('is-sent');
      status.className = 'form-status is-ok';
      status.innerHTML =
        `<strong>${esc(ui('thanks', 'Thank you — your brief looks good.'))}</strong> ` +
        esc(ui('demoNotSent', 'This demo form is not connected to a backend yet, so nothing was actually sent. Wiring it to Formspree, EmailJS or your own endpoint takes one line of configuration.'));
      status.focus?.();
    }, 900);
  });
}

function initTestimonials(config) {
  if (!config.motion || !config.swiper || typeof window.Swiper === 'undefined') return;
  const el = $('.tm-swiper');
  if (!el) return;
  new window.Swiper(el, {
    slidesPerView: 1,
    spaceBetween: 24,
    loop: true,
    autoplay: prefersReducedMotion() ? false : { delay: 6000, disableOnInteraction: true, pauseOnMouseEnter: true },
    pagination: { el: '.tm-dots', clickable: true },
    keyboard: { enabled: true },
    a11y: { enabled: true },
    breakpoints: { 760: { slidesPerView: 2 }, 1180: { slidesPerView: 3 } },
  });
}

function initTilt(config) {
  if (!config.tilt || typeof window.VanillaTilt === 'undefined') return;
  if (prefersReducedMotion() || window.matchMedia('(pointer: coarse)').matches) return;
  window.VanillaTilt.init($$('[data-tilt]'), {
    max: 5, speed: 700, glare: true, 'max-glare': 0.14, scale: 1.01,
  });
}

function initPreloader() {
  const pre = $('.preloader');
  if (!pre) return;
  const done = () => {
    pre.classList.add('is-done');
    setTimeout(() => pre.remove(), 700);
  };
  if (document.readyState === 'complete') setTimeout(done, 350);
  else window.addEventListener('load', () => setTimeout(done, 350));
  // Never let a slow CDN keep the page hidden.
  setTimeout(done, 4000);
}

/** FAQ rich-result markup, generated so the copy only lives in site-data.js. */
function injectJsonLd() {
  const data = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: D.FAQ.map((f) => ({
      '@type': 'Question',
      name: f.q,
      acceptedAnswer: { '@type': 'Answer', text: f.a },
    })),
  };
  const tag = document.createElement('script');
  tag.type = 'application/ld+json';
  tag.textContent = JSON.stringify(data);
  document.head.appendChild(tag);
}

/**
 * Wires the model / wireframe / stone / metal controls to a viewer created by
 * jewelry-3d.js. Kept here so all three variants share one implementation.
 */
export function bindViewerControls(viewer, root = document) {
  if (!viewer || !root) return;

  const group = (selector, onPick) => {
    const btns = $$(selector, root);
    btns.forEach((btn) => {
      btn.addEventListener('click', () => {
        btns.forEach((b) => {
          const on = b === btn;
          b.classList.toggle('is-active', on);
          if (b.hasAttribute('aria-pressed')) b.setAttribute('aria-pressed', String(on));
        });
        onPick(btn);
      });
    });
  };

  group('[data-model]', (btn) => viewer.setModel(btn.dataset.model));
  group('[data-metal]', (btn) => viewer.setMetal(btn.dataset.metal));

  $$('[data-toggle]', root).forEach((btn) => {
    btn.addEventListener('click', () => {
      const on = btn.getAttribute('aria-pressed') !== 'true';
      btn.setAttribute('aria-pressed', String(on));
      btn.classList.toggle('is-active', on);
      if (btn.dataset.toggle === 'wireframe') viewer.setWireframe(on);
      if (btn.dataset.toggle === 'gems') viewer.setGems(on);
      if (btn.dataset.toggle === 'spin') viewer.setAutoRotate(on);
    });
  });

  // Pause the auto-spin while the visitor is driving the model themselves.
  const spinBtn = root.querySelector('[data-toggle="spin"]');
  viewer.controls.addEventListener('start', () => {
    viewer.setAutoRotate(false);
    spinBtn?.setAttribute('aria-pressed', 'false');
    spinBtn?.classList.remove('is-active');
  });
}

/** Swaps every canvas for a still image when WebGL is unavailable. */
export function showViewerFallback() {
  $$('.viewer').forEach((stage) => {
    stage.classList.add('is-fallback');
    const fb = $('.viewer-fallback', stage);
    if (fb) fb.hidden = false;
    const canvas = $('canvas', stage);
    if (canvas) canvas.hidden = true;
  });
  $$('.vc').forEach((el) => { el.hidden = true; });
}

/* -------------------------------------------------------------------------- */
/* Entry point                                                                 */
/* -------------------------------------------------------------------------- */

export function mountSite(options = {}) {
  D = options.data ?? DefaultData;
  const config = Object.assign(
    { motion: true, lenis: true, swiper: true, tilt: false, lightbox: true },
    options
  );
  motionEnabled = config.motion;

  renderNav();
  renderStats();
  renderServices();
  renderProcess();
  renderPortfolio();
  renderMaterials();
  renderCapabilities();
  renderWhy();
  renderTestimonials();
  renderPricing();
  renderFaq();
  renderEstimator();
  renderFooterMeta();

  window.lucide?.createIcons();

  const env = initScroll(config);
  initNav();
  initReveal(env);
  initCounters(env);
  initPortfolio(config);
  initFaq();
  initEstimator();
  initForm();
  initTestimonials(config);
  initTilt(config);
  initPreloader();
  injectJsonLd();

  return { lenis, config };
}
