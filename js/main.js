/* CADORO — V1 Dark Luxury */

import { mountSite, bindViewerControls, showViewerFallback } from '../shared/site-ui.js';
import { createJewelryViewer, isWebGLAvailable } from '../shared/jewelry-3d.js';
import * as russianData from './site-data-ru.js';

const GOLD = 0xd4af37;

mountSite({ data: russianData, lenis: true, swiper: true, lightbox: true, tilt: true });

if (isWebGLAvailable()) {
  // 1. Hero 3D Viewer (loads immediately for the top of the page)
  const heroCanvas = document.getElementById('hero-canvas');
  if (heroCanvas) {
    const hero = createJewelryViewer(heroCanvas, {
      model: 'solitaire',
      metal: 'yellow',
      wireColor: GOLD,
      exposure: 1.08,
      autoRotate: true,
      autoRotateSpeed: 1.1,
    });
    bindViewerControls(hero, document.querySelector('.hero'));
  }

  // 2. Materials 3D Viewer (lazy-loaded on scroll to optimize initial mobile load)
  const materialsSection = document.getElementById('materials');
  const materialsCanvas = document.getElementById('materials-canvas');

  if (materialsSection && materialsCanvas) {
    let materialsViewer = null;

    const initMaterialsViewer = () => {
      if (materialsViewer) return;
      materialsViewer = createJewelryViewer(materialsCanvas, {
        model: 'eternity',
        metal: 'yellow',
        wireColor: GOLD,
        exposure: 1.0,
        autoRotate: true,
        autoRotateSpeed: 0.75,
      });
      bindViewerControls(materialsViewer, materialsSection);
    };

    if ('IntersectionObserver' in window) {
      const observer = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting) {
          initMaterialsViewer();
          observer.disconnect();
        }
      }, { rootMargin: '300px 0px' });
      observer.observe(materialsSection);

      // Pre-initialize if user taps anywhere in materials controls before scrolling fully into view
      materialsSection.addEventListener('pointerdown', () => {
        initMaterialsViewer();
        observer.disconnect();
      }, { once: true });
    } else {
      initMaterialsViewer();
    }
  }
} else {
  showViewerFallback();
}
