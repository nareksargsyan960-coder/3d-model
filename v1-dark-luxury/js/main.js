/* CADORO — V1 Dark Luxury */

import { mountSite, bindViewerControls, showViewerFallback } from '../../shared/site-ui.js';
import { createJewelryViewer, isWebGLAvailable } from '../../shared/jewelry-3d.js';

const GOLD = 0xd4af37;

mountSite({ lenis: true, swiper: true, lightbox: true, tilt: true });

if (isWebGLAvailable()) {
  const hero = createJewelryViewer(document.getElementById('hero-canvas'), {
    model: 'solitaire',
    metal: 'yellow',
    wireColor: GOLD,
    exposure: 1.08,
    autoRotate: true,
    autoRotateSpeed: 1.1,
  });
  bindViewerControls(hero, document.querySelector('.hero'));

  const materials = createJewelryViewer(document.getElementById('materials-canvas'), {
    model: 'eternity',
    metal: 'yellow',
    wireColor: GOLD,
    exposure: 1.0,
    autoRotate: true,
    autoRotateSpeed: 0.75,
  });
  bindViewerControls(materials, document.getElementById('materials'));
} else {
  showViewerFallback();
}
