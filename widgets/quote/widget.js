import schema from './schema.js';
import { readParams } from '../../shared/config-engine.js';

const config = readParams(schema);

const BORDER_MAP = { Ninguno: '0px', Fino: '1px', Medio: '3px', Grueso: '6px' };
const RATIO_MAP = { '1:1': '1 / 1', '3:4': '3 / 4', '9:16': '9 / 16' };

document.documentElement.style.setProperty('--radius', `${config.borderRadius}px`);
document.documentElement.style.setProperty('--aspect-ratio', RATIO_MAP[config.aspectRatio] || RATIO_MAP['3:4']);
document.documentElement.style.setProperty('--border-width', BORDER_MAP[config.borderWidth] || '0px');
document.documentElement.style.setProperty('--border-color', config.borderColor);
document.documentElement.style.setProperty('--text-color', config.textColor);

const cardEl = document.getElementById('quote-card');
const overlayEl = document.getElementById('quote-overlay');
const symbolEl = document.getElementById('quote-symbol');
const textEl = document.getElementById('quote-text');
const authorEl = document.getElementById('quote-author');

// Fondo: color sólido, imagen (con capa oscura encima para que el texto no se pierda), o ninguno
if (config.backgroundType === 'Imagen' && config.backgroundImage) {
  cardEl.style.backgroundImage = `url("${config.backgroundImage}")`;
  cardEl.style.backgroundSize = 'cover';
  cardEl.style.backgroundPosition = 'center';
  cardEl.style.backgroundColor = 'transparent';
  overlayEl.style.background = `rgba(0, 0, 0, ${config.overlayOpacity / 100})`;
  overlayEl.style.display = 'block';
} else if (config.backgroundType === 'Color') {
  cardEl.style.backgroundColor = config.backgroundColor;
  overlayEl.style.display = 'none';
} else {
  cardEl.style.backgroundColor = 'transparent';
  overlayEl.style.display = 'none';
}

// Símbolo opcional
if (config.symbol) {
  symbolEl.textContent = config.symbol;
} else {
  symbolEl.style.display = 'none';
}

textEl.textContent = config.text;

// Autor opcional
if (config.author) {
  authorEl.textContent = config.author;
} else {
  authorEl.style.display = 'none';
}
