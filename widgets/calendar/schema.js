export default {
  id: 'calendar',
  name: 'Calendario',
  params: {
    bg:           { type: 'color',  label: 'Color de fondo',            default: '#262626' },
    text:         { type: 'color',  label: 'Color de texto',            default: '#d9d9d9' },
    accent:       { type: 'color',  label: 'Color del día actual',      default: '#ffffff' },
    startDay:     { type: 'select',  label: 'Inicio de semana',          options: ['Lunes', 'Domingo'], default: 'Lunes' },
    borderRadius: { type: 'number',  label: 'Bordes redondeados (px)',   default: 16 },
    navigable:    { type: 'boolean', label: 'Permitir cambiar de mes (adelantar/retroceder)', default: false }
  }
};

