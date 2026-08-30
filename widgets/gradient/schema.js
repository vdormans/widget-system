export default {
  id: 'gradient',
  name: 'Degradado de Colores',
  params: {
    colors: {
      type: 'object-list',
      label: 'Colores del degradado',
      max: 8,
      addLabel: '+ Agregar color',
      default: [],
      itemFields: [
        { key: 'hex', type: 'text', label: 'HEX', default: '#879af2', placeholder: '#879AF2', preview: 'color' }
      ]
    },
    direction:    { type: 'select', label: 'Dirección del degradado',              options: ['Horizontal', 'Vertical', 'Diagonal'], default: 'Diagonal' },
    borderRadius: { type: 'number', label: 'Bordes redondeados (px)',              default: 16 }
  }
};
