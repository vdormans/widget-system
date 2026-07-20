import schema from './schema.js';
import { readParams } from '../../shared/config-engine.js';

const config = readParams(schema);

document.documentElement.style.setProperty('--bg', config.bg);
document.documentElement.style.setProperty('--text', config.text);

const DAYS = {
  es: ['Domingo', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado'],
  en: ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']
};

function updateClock() {
  const now = new Date();
  let hours = now.getHours();
  const minutes = String(now.getMinutes()).padStart(2, '0');
  let ampmLabel = '';

  if (config.format === '12h') {
    ampmLabel = hours >= 12 ? 'PM' : 'AM';
    hours = hours % 12 || 12;
  }
  hours = String(hours).padStart(2, '0');

  document.getElementById('hours').textContent = hours;
  document.getElementById('minutes').textContent = minutes;
  document.getElementById('ampm').textContent = ampmLabel;
  document.getElementById('day').textContent = DAYS[config.lang][now.getDay()];
}

setInterval(updateClock, 1000);
updateClock();
