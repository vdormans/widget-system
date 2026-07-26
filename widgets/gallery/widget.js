import schema from './schema.js';
import { readParams } from '../../shared/config-engine.js';

const config = readParams(schema);
const images = (config.images || []).filter(Boolean);

document.documentElement.style.setProperty('--radius', `${config.borderRadius}px`);
document.documentElement.style.setProperty('--arrow-color', config.arrowColor);
document.documentElement.style.setProperty('--arrow-bg', config.arrowBg);

const containerEl = document.getElementById('gallery-container');
const placeholderEl = document.getElementById('placeholder');
const imgEl = document.getElementById('gallery-img');
const prevBtn = document.getElementById('prev-btn');
const nextBtn = document.getElementById('next-btn');

let currentIndex = 0;

function render() {
  if (images.length === 0) {
    containerEl.style.display = 'none';
    placeholderEl.style.display = 'flex';
    return;
  }

  imgEl.src = images[currentIndex];

  // Las flechas solo aparecen si hay más de una imagen
  const showArrows = images.length > 1;
  prevBtn.style.display = showArrows ? 'flex' : 'none';
  nextBtn.style.display = showArrows ? 'flex' : 'none';
}

prevBtn.addEventListener('click', () => {
  currentIndex = (currentIndex - 1 + images.length) % images.length;
  render();
});

nextBtn.addEventListener('click', () => {
  currentIndex = (currentIndex + 1) % images.length;
  render();
});

render();
