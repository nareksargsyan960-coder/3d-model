/* CADORO — V2 Light Gallery */

import { mountSite, bindViewerControls, showViewerFallback } from '../../shared/site-ui.js';
import { createJewelryViewer, isWebGLAvailable } from '../../shared/jewelry-3d.js';

/* ── theme toggle ───────────────────────────────────────────────────────── */

const STORAGE_KEY = 'cadoro-theme';
const root = document.documentElement;

const applyTheme = (theme) => {
  root.dataset.theme = theme;
  const btn = document.getElementById('theme-toggle');
  btn?.setAttribute('aria-pressed', String(theme === 'dark'));
  document.querySelector('meta[name="theme-color"]')
    ?.setAttribute('content', theme === 'dark' ? '#14140f' : '#fafaf7');
  return theme;
};

// This variant's whole identity is the light gallery, so light is the default
// even on a dark-preferring OS. The toggle (and localStorage) still wins.
let theme = applyTheme(localStorage.getItem(STORAGE_KEY) || 'light');

mountSite({ lenis: true, swiper: true, lightbox: true, tilt: false });

document.getElementById('theme-toggle')?.addEventListener('click', () => {
  theme = applyTheme(theme === 'dark' ? 'light' : 'dark');
  localStorage.setItem(STORAGE_KEY, theme);
});

/* ── 3D ─────────────────────────────────────────────────────────────────── */

const BRONZE = 0xb08d57;

if (isWebGLAvailable()) {
  const hero = createJewelryViewer(document.getElementById('hero-canvas'), {
    model: 'solitaire',
    metal: 'white',
    wireColor: BRONZE,
    exposure: 1.16,        // brighter, to read as a product shot on a pale ground
    autoRotate: true,
    autoRotateSpeed: 0.9,
    fitMargin: 1.24,       // extra air suits the gallery layout
  });
  bindViewerControls(hero, document.querySelector('.hero'));

  const materials = createJewelryViewer(document.getElementById('materials-canvas'), {
    model: 'eternity',
    metal: 'yellow',
    wireColor: BRONZE,
    exposure: 1.12,
    autoRotate: true,
    autoRotateSpeed: 0.7,
    fitMargin: 1.2,
  });
  bindViewerControls(materials, document.getElementById('materials'));
} else {
  showViewerFallback();
}
