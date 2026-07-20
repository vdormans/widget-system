export default {
  id: 'countdown',
  name: 'Cuenta Regresiva',
  params: {
    title:       { type: 'text',    label: 'Título',                 default: 'Cuenta regresiva' },
    date:        { type: 'date',    label: 'Fecha objetivo',         default: '2026-12-31' },
    time:        { type: 'time',    label: 'Hora objetivo',          default: '00:00' },
    showMonths:  { type: 'boolean', label: 'Mostrar meses',          default: true },
    showWeeks:   { type: 'boolean', label: 'Mostrar semanas',        default: true },
    showDays:    { type: 'boolean', label: 'Mostrar días',           default: true },
    showHours:   { type: 'boolean', label: 'Mostrar horas',          default: true },
    endMessage:  { type: 'text',    label: 'Mensaje al finalizar',   default: '¡Llegó el día! 🎉' },
    textColor:   { type: 'color',   label: 'Color de texto',         default: '#ffffff' },
    borderColor: { type: 'color',   label: 'Color de borde',         default: '#4d4d4d' }
  }
};
