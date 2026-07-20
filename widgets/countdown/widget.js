import schema from './schema.js';
import { readParams } from '../../shared/config-engine.js';

const config = readParams(schema);

document.documentElement.style.setProperty('--text', config.textColor);
document.documentElement.style.setProperty('--border', config.borderColor);

document.getElementById('custom-message').textContent = config.title;

const timerEl = document.getElementById('timer');
const endMessageEl = document.getElementById('end-message');

// Orden fijo, del mayor al menor. Solo se incluyen las unidades activas.
const UNIT_DEFS = [
  { key: 'months', label: 'Meses',   ms: 1000 * 60 * 60 * 24 * 30.44, active: config.showMonths },
  { key: 'weeks',  label: 'Semanas', ms: 1000 * 60 * 60 * 24 * 7,     active: config.showWeeks },
  { key: 'days',   label: 'Días',    ms: 1000 * 60 * 60 * 24,         active: config.showDays },
  { key: 'hours',  label: 'Horas',   ms: 1000 * 60 * 60,              active: config.showHours }
];

const activeUnits = UNIT_DEFS.filter(u => u.active);

// Construye el timer solo con las unidades elegidas, con separadores entre ellas
activeUnits.forEach((unit, index) => {
  if (index > 0) {
    const sep = document.createElement('div');
    sep.className = 'separator';
    timerEl.appendChild(sep);
  }
  const section = document.createElement('div');
  section.className = 'time-section';
  section.innerHTML = `
    <div id="${unit.key}" class="time-value">0</div>
    <div class="time-label">${unit.label}</div>
  `;
  timerEl.appendChild(section);
});

// Construye la fecha objetivo a partir de date + time
const [year, month, day] = config.date.split('-').map(Number);
const [hourStr, minuteStr] = config.time.split(':');
const targetDate = new Date(year, month - 1, day, Number(hourStr), Number(minuteStr), 0);

function updateCountdown() {
  const now = new Date();
  let timeLeft = targetDate - now;

  if (timeLeft <= 0) {
    timerEl.style.display = 'none';
    endMessageEl.textContent = config.endMessage;
    endMessageEl.style.display = 'block';
    return;
  }

  // Cascada: cada unidad activa consume su parte del tiempo restante,
  // lo que no se muestra (ej. si "meses" está apagado) se acumula en la siguiente unidad activa
  activeUnits.forEach(unit => {
    const value = Math.floor(timeLeft / unit.ms);
    timeLeft -= value * unit.ms;
    document.getElementById(unit.key).textContent = value;
  });
}

updateCountdown();
setInterval(updateCountdown, 1000);
