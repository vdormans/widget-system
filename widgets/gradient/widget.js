import schema from './schema.js';
import { readParams } from '../../shared/config-engine.js';
import { copyToClipboard } from '../../shared/clipboard.js';

const config = readParams(schema);
document.documentElement.style.setProperty('--radius', `${config.borderRadius}px`);

const cardEl = document.getElementById('gradient-card');
const swatchEl = document.getElementById('gradient-swatch');
const listEl = document.getElementById('hex-list');
const placeholderEl = document.getElementById('placeholder');

const colors = (config.colors || [])
  .filter(c => c && c.hex)
  .map(c => c.hex);

if (colors.length === 0) {
  cardEl.style.display = 'none';
  placeholderEl.style.display = 'flex';
} else {
  const ANGLES = { Horizontal: '90deg', Vertical: '180deg', Diagonal: '135deg' };
  const angle = ANGLES[config.direction] || ANGLES.Diagonal;

  // Con un solo color no hay degradado real: se muestra como color sólido
  swatchEl.style.background = colors.length === 1
    ? colors[0]
    : `linear-gradient(${angle}, ${colors.join(', ')})`;

  colors.forEach(hex => {
    const item = document.createElement('button');
    item.type = 'button';
    item.className = 'hex-item';
    item.style.color = hex;
    item.textContent = hex.toUpperCase();
    item.title = 'Clic para copiar';

    item.addEventListener('click', async () => {
      const success = await copyToClipboard(hex);
      const original = item.textContent;
      item.textContent = success ? '¡Copiado!' : 'No se pudo copiar';
      setTimeout(() => (item.textContent = original), 1200);
    });

    listEl.appendChild(item);
  });
}
