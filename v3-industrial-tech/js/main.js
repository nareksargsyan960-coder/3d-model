/* CADORO — V3 Industrial Tech */

import { mountSite, bindViewerControls, showViewerFallback } from '../../shared/site-ui.js';
import { createJewelryViewer, isWebGLAvailable } from '../../shared/jewelry-3d.js';

const CYAN = 0x4da3ff;

mountSite({ lenis: true, swiper: true, lightbox: true, tilt: true });

if (isWebGLAvailable()) {
  // The hero opens in wireframe on purpose: this variant sells the CAD itself.
  const hero = createJewelryViewer(document.getElementById('hero-canvas'), {
    model: 'solitaire',
    metal: 'white',
    wireframe: true,
    wireColor: CYAN,
    grid: true,
    exposure: 1.0,
    autoRotate: true,
    autoRotateSpeed: 1.0,
  });
  bindViewerControls(hero, document.querySelector('.hero'));

  // Reflect the wireframe-first default in the toggle button state.
  const wireBtn = document.querySelector('.hero [data-toggle="wireframe"]');
  wireBtn?.setAttribute('aria-pressed', 'true');
  wireBtn?.classList.add('is-active');

  const materials = createJewelryViewer(document.getElementById('materials-canvas'), {
    model: 'eternity',
    metal: 'platinum',
    wireColor: CYAN,
    exposure: 1.02,
    autoRotate: true,
    autoRotateSpeed: 0.7,
  });
  bindViewerControls(materials, document.getElementById('materials'));
} else {
  showViewerFallback();
}
