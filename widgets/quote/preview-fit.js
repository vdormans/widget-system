/**
 * preview-fit.js
 * Ajusta el alto del iframe de previsualización para que la tarjeta se vea
 * completa (sin recorte ni barra de scroll), según el formato elegido.
 * Solo se usa en configure.html de este widget.
 */

// Relación ancho / alto de cada formato (mismos valores que RATIO_MAP en widget.js)
const RATIOS = { '1:1': 1, '3:4': 3 / 4, '9:16': 9 / 16 };
const CARD_MAX_WIDTH = 340; // mismo max-width que .quote-card en widget.html
const BREATHING_ROOM = 16;  // px extra para que el borde no quede pegado al marco

export function fitPreview(iframeEl, wrapEl) {
  function fit() {
    let ratio = RATIOS['3:4'];
    try {
      // El formato se lee de la propia URL de la preview (funciona aunque el iframe aún no cargue)
      const chosen = new URL(iframeEl.src).searchParams.get('aspectRatio');
      if (RATIOS[chosen]) ratio = RATIOS[chosen];
    } catch {
      /* si la URL no es válida se usa 3:4 */
    }
    const cardWidth = Math.min(CARD_MAX_WIDTH, iframeEl.clientWidth || wrapEl.clientWidth);
    iframeEl.style.height = `${Math.ceil(cardWidth / ratio) + BREATHING_ROOM}px`;
  }

  iframeEl.addEventListener('load', fit);

  // Recalcular solo si cambia el ANCHO disponible (evita bucles con el alto)
  let lastWidth = wrapEl.clientWidth;
  new ResizeObserver(() => {
    if (wrapEl.clientWidth !== lastWidth) {
      lastWidth = wrapEl.clientWidth;
      fit();
    }
  }).observe(wrapEl);

  fit();
}
