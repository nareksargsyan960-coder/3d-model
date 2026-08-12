/* CADORO — V5 Corporate Clean (no motion) */

import { mountSite, bindViewerControls, showViewerFallback } from '../../shared/site-ui.js';
import { createJewelryViewer, isWebGLAvailable } from '../../shared/jewelry-3d.js';

mountSite({ motion: false, lenis: false, swiper: false, tilt: false, lightbox: true });

if (isWebGLAvailable()) {
  const common = { wireColor: 0x1a5fd0, autoRotate: false, exposure: 1.14 };
  bindViewerControls(
    createJewelryViewer(document.getElementById('hero-canvas'),
      { ...common, model: 'solitaire', metal: 'yellow' }),
    document.querySelector('.hero'),
  );
  bindViewerControls(
    createJewelryViewer(document.getElementById('materials-canvas'),
      { ...common, model: 'eternity', metal: 'yellow' }),
    document.getElementById('materials'),
  );
} else {
  showViewerFallback();
}
