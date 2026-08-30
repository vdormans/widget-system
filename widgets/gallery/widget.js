import schema from './schema.js';
import { readParams } from '../../shared/config-engine.js';

const config = readParams(schema);
const images = (config.images || []).filter(Boolean);

const RATIO_MAP = { '1:1': '1 / 1', '3:4': '3 / 4', '9:16': '9 / 16' };
const POSITION_MAP = { 'Izquierda': 'left center', 'Centro': 'center center', 'Derecha': 'right center' };

document.documentElement.style.setProperty('--radius', `${config.borderRadius}px`);
document.documentElement.style.setProperty('--dot-color', config.dotColor);
document.documentElement.style.setProperty('--aspect-ratio', RATIO_MAP[config.aspectRatio] || RATIO_MAP['3:4']);
document.documentElement.style.setProperty('--img-position', POSITION_MAP[config.focalPoint] || POSITION_MAP['Centro']);

const containerEl = document.getElementById('gallery-container');
const placeholderEl = document.getElementById('placeholder');
const imgEl = document.getElementById('gallery-img');
const dotsEl = document.getElementById('dots');

let currentIndex = 0;
let isTransitioning = false;
const FADE_MS = 200;

// Construye un punto por imagen; cada uno navega directo a su índice al hacer clic
images.forEach((_, idx) => {
  const dot = document.createElement('button');
  dot.type = 'button';
  dot.className = 'dot';
  dot.setAttribute('aria-label', `Ver imagen ${idx + 1}`);
  dot.addEventListener('click', () => goToImage(idx));
  dotsEl.appendChild(dot);
});

function goToImage(idx) {
  if (idx === currentIndex || isTransitioning) return;
  isTransitioning = true;

  // Fade-out sutil, luego cambia la imagen y hace fade-in
  imgEl.style.opacity = '0';
  setTimeout(() => {
    currentIndex = idx;
    imgEl.src = images[currentIndex];
    updateDots();
    imgEl.style.opacity = '1';
    isTransitioning = false;
  }, FADE_MS);
}

function updateDots() {
  [...dotsEl.children].forEach((dot, idx) => {
    dot.classList.toggle('active', idx === currentIndex);
  });
}

function render() {
  if (images.length === 0) {
    containerEl.style.display = 'none';
    placeholderEl.style.display = 'flex';
    return;
  }

  // Primera carga: sin transición, se muestra directo
  imgEl.src = images[currentIndex];

  // Los puntos solo aparecen si hay más de una imagen
  dotsEl.style.display = images.length > 1 ? 'flex' : 'none';

  updateDots();
}

render();
