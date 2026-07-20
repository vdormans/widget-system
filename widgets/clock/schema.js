export default {
  id: 'clock',
  name: 'Reloj Flip',
  params: {
    bg:     { type: 'color',  label: 'Fondo de la tarjeta', default: '#262626' },
    text:   { type: 'color',  label: 'Color del texto',     default: '#d9d9d9' },
    format: { type: 'select', label: 'Formato de hora',     options: ['12h', '24h'], default: '12h' },
    lang:   { type: 'select', label: 'Idioma',              options: ['es', 'en'],   default: 'es' }
  }
};
