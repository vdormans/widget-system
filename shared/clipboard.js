/**
 * clipboard.js
 * Copia texto al portapapeles. Usado por cualquier widget con "clic para copiar"
 * (paleta de colores, degradados, etc). Incluye respaldo por si el navegador
 * bloquea el método moderno dentro de un iframe embebido.
 */
export async function copyToClipboard(text) {
  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch {
    try {
      const temp = document.createElement('textarea');
      temp.value = text;
      temp.style.position = 'fixed';
      temp.style.opacity = '0';
      document.body.appendChild(temp);
      temp.select();
      document.execCommand('copy');
      document.body.removeChild(temp);
      return true;
    } catch {
      return false;
    }
  }
}
