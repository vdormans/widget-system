export default {
  id: 'gallery',
  name: 'Galería de Fotos',
  params: {
    images: {
      type: 'list',
      label: 'Imágenes',
      max: 5,
      default: [],
      placeholder: 'https://... (URL directa de la imagen)',
      addLabel: '+ Agregar imagen',
      helpItems: [
        {
          label: '¿Cómo obtengo el link de una imagen subida a Notion?',
          content: 'Sube la imagen a un bloque de tu página de Notion, haz clic derecho sobre ella y elige "Copiar link de la imagen". Pega esa URL aquí.'
        },
        {
          label: 'Webs recomendadas para alojar imágenes',
          content: '<a href="https://uploadimgur.com" target="_blank" rel="noopener">uploadimgur.com</a><br><a href="https://es.imgbb.com" target="_blank" rel="noopener">es.imgbb.com</a><br><a href="https://www.image2url.com/es" target="_blank" rel="noopener">image2url.com</a>'
        }
      ]
    },
    borderRadius: { type: 'number', label: 'Bordes redondeados (px)',   default: 16 },
    arrowColor:   { type: 'color',  label: 'Color de las flechas',      default: '#ffffff' },
    arrowBg:      { type: 'color',  label: 'Fondo del botón de flecha', default: '#000000' }
  }
};
