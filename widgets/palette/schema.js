export default {
  id: 'palette',
  name: 'Paleta de Colores',
  params: {
    colors: {
      type: 'object-list',
      label: 'Colores',
      addLabel: '+ Agregar color',
      default: [],
      itemFields: [
        { key: 'hex',  type: 'text', label: 'HEX',                default: '#f26800', placeholder: '#F26800', preview: 'color' },
        { key: 'name', type: 'text', label: 'Nombre (opcional)',  default: '',        placeholder: 'Sunset Sky' }
      ]
    },
    borderRadius: { type: 'number', label: 'Bordes redondeados de cada tarjeta (px)', default: 8 }
  }
};
