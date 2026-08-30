export default {
  id: 'quote',
  name: 'Frases',
  params: {
    text:   { type: 'textarea', label: 'Frase',                    default: 'Escribe aquí tu frase', rows: 3 },
    symbol: { type: 'text',     label: 'Símbolo o emoji (opcional)', default: '', placeholder: '❤ 🌿 ✦' },
    author: { type: 'text',     label: 'Autor (opcional)',           default: '', placeholder: 'Anónimo' },

    borderWidth: { type: 'select', label: 'Grosor de borde',  options: ['Ninguno', 'Fino', 'Medio', 'Grueso'], default: 'Fino' },
    borderColor: { type: 'color',  label: 'Color de borde',   default: '#ffffff' },

    backgroundType:  { type: 'select', label: 'Tipo de fondo',           options: ['Color', 'Imagen', 'Ninguno'], default: 'Color' },
    backgroundColor: { type: 'color',  label: 'Color de fondo',          default: '#262626' },
    backgroundImage: {
      type: 'text',
      label: 'URL de la imagen de fondo',
      default: '',
      placeholder: 'https://... (solo si el tipo de fondo es Imagen)',
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
    overlayOpacity: { type: 'number', label: 'Oscurecido sobre la imagen (0-100)', default: 45 },

    textColor:    { type: 'color',  label: 'Color de texto',           default: '#ffffff' },
    aspectRatio:  { type: 'select', label: 'Formato',                  options: ['1:1', '3:4', '9:16'], default: '3:4' },
    borderRadius: { type: 'number', label: 'Bordes redondeados (px)',  default: 20 }
  }
};
