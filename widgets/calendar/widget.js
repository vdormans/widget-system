import schema from './schema.js';
import { readParams } from '../../shared/config-engine.js';

const config = readParams(schema);

document.documentElement.style.setProperty('--bg', config.bg);
document.documentElement.style.setProperty('--text', config.text);
document.documentElement.style.setProperty('--accent', config.accent);
document.documentElement.style.setProperty('--radius', `${config.borderRadius}px`);
document.documentElement.style.setProperty('--today-text', getContrastColor(config.accent));

const MONTHS = [
  'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
  'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'
];

const DAY_LABELS = {
  Lunes:   ['L', 'M', 'M', 'J', 'V', 'S', 'D'],
  Domingo: ['D', 'L', 'M', 'M', 'J', 'V', 'S']
};

const now = new Date();
const year = now.getFullYear();
const month = now.getMonth();
const today = now.getDate();

document.getElementById('month-label').textContent = `${MONTHS[month]} ${year}`;

// Encabezado de días de la semana, según si inicia en Lunes o Domingo
const dayLabels = DAY_LABELS[config.startDay] || DAY_LABELS.Lunes;
const headerRow = document.getElementById('day-headers');
dayLabels.forEach(label => {
  const cell = document.createElement('div');
  cell.className = 'day-label';
  cell.textContent = label;
  headerRow.appendChild(cell);
});

// getDay() de JS siempre devuelve 0=Domingo..6=Sábado; lo ajustamos según el inicio elegido
const firstWeekday = new Date(year, month, 1).getDay();
const offset = config.startDay === 'Domingo' ? firstWeekday : (firstWeekday + 6) % 7;
const daysInMonth = new Date(year, month + 1, 0).getDate();

const grid = document.getElementById('days-grid');

for (let i = 0; i < offset; i++) {
  const empty = document.createElement('div');
  empty.className = 'day-cell empty';
  grid.appendChild(empty);
}

for (let d = 1; d <= daysInMonth; d++) {
  const cell = document.createElement('div');
  cell.className = 'day-cell';
  if (d === today) cell.classList.add('today');
  cell.textContent = d;
  grid.appendChild(cell);
}

// Elige texto claro u oscuro para el número del día actual, según qué tan claro sea el color de acento
function getContrastColor(hex) {
  const c = hex.replace('#', '');
  const r = parseInt(c.substring(0, 2), 16);
  const g = parseInt(c.substring(2, 4), 16);
  const b = parseInt(c.substring(4, 6), 16);
  const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
  return luminance > 0.6 ? '#171717' : '#ffffff';
}
