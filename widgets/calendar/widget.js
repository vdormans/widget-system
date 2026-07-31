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

const baseDate = new Date(); // fecha real de hoy, no cambia
let offset = 0; // meses de diferencia respecto al mes actual

// Encabezado de días de la semana: se arma una sola vez, no cambia al navegar
const dayLabels = DAY_LABELS[config.startDay] || DAY_LABELS.Lunes;
const headerRow = document.getElementById('day-headers');
dayLabels.forEach(label => {
  const cell = document.createElement('div');
  cell.className = 'day-label';
  cell.textContent = label;
  headerRow.appendChild(cell);
});

const monthLabelEl = document.getElementById('month-label');
const grid = document.getElementById('days-grid');
const prevBtn = document.getElementById('prev-month');
const nextBtn = document.getElementById('next-month');

function renderMonth() {
  const viewDate = new Date(baseDate.getFullYear(), baseDate.getMonth() + offset, 1);
  const year = viewDate.getFullYear();
  const month = viewDate.getMonth();
  const isCurrentMonth = offset === 0;

  monthLabelEl.textContent = `${MONTHS[month]} ${year}`;
  grid.innerHTML = '';

  const firstWeekday = new Date(year, month, 1).getDay();
  const offsetCells = config.startDay === 'Domingo' ? firstWeekday : (firstWeekday + 6) % 7;
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const totalRows = Math.ceil((offsetCells + daysInMonth) / 7);
  grid.style.gridTemplateRows = `repeat(${totalRows}, 1fr)`;

  for (let i = 0; i < offsetCells; i++) {
    grid.appendChild(document.createElement('div'));
  }

  for (let d = 1; d <= daysInMonth; d++) {
    const cell = document.createElement('div');
    cell.className = 'day-cell';

    const number = document.createElement('span');
    number.className = 'day-number';
    if (isCurrentMonth && d === baseDate.getDate()) {
      number.classList.add('today');
    }
    number.textContent = d;

    cell.appendChild(number);
    grid.appendChild(cell);
  }
}

renderMonth();

if (config.navigable) {
  prevBtn.style.display = 'flex';
  nextBtn.style.display = 'flex';
  prevBtn.addEventListener('click', () => {
    offset -= 1;
    renderMonth();
  });
  nextBtn.addEventListener('click', () => {
    offset += 1;
    renderMonth();
  });
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
