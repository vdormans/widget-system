import schema from './schema.js';
import { readParams } from '../../shared/config-engine.js';
import { copyToClipboard } from '../../shared/clipboard.js';

const config = readParams(schema);
document.documentElement.style.setProperty('--radius', `${config.borderRadius}px`);

const wrapperEl = document.getElementById('palette-wrapper');
const placeholderEl = document.getElementById('placeholder');

const colors = (config.colors || []).filter(c => c && c.hex);

if (colors.length === 0) {
  wrapperEl.style.display = 'none';
  placeholderEl.style.display = 'flex';
} else {
  colors.forEach(color => {
    wrapperEl.appendChild(buildCard(color));
  });
}

function buildCard(color) {
  const card = document.createElement('div');
  card.className = 'color-card';

  const swatch = document.createElement('div');
  swatch.className = 'color-swatch';
  swatch.style.background = color.hex;
  card.appendChild(swatch);

  const info = document.createElement('div');
  info.className = 'color-info';

  if (color.name) {
    const nameEl = document.createElement('div');
    nameEl.className = 'color-name';
    nameEl.textContent = color.name;
    info.appendChild(nameEl);
  }

  const hexEl = document.createElement('button');
  hexEl.type = 'button';
  hexEl.className = 'color-hex';
  hexEl.textContent = color.hex.toUpperCase();
  hexEl.title = 'Clic para copiar';

  hexEl.addEventListener('click', async () => {
    const success = await copyToClipboard(color.hex);
    const original = hexEl.textContent;
    hexEl.textContent = success ? '¡Copiado!' : 'No se pudo copiar';
    setTimeout(() => (hexEl.textContent = original), 1200);
  });

  info.appendChild(hexEl);
  card.appendChild(info);

  return card;
}
