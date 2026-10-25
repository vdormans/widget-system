/**
 * download.js
 * Descarga la frase como imagen PNG. Solo se usa en configure.html (la ventana
 * de configuración); el widget final embebido en Notion NO incluye descarga.
 *
 * Sin backend: la tarjeta se vuelve a dibujar en un <canvas> a partir de la
 * configuración actual (leída de la URL final generada) y se descarga como PNG.
 */
import schema from './schema.js';
import { readParams } from '../../shared/config-engine.js';

// Debe mantenerse igual que los valores de widget.html / widget.js
const CARD_WIDTH = 340;        // max-width de .quote-card
const PAD_X = 28;
const PAD_Y = 32;
const SCALE = 3;               // 340px → 1020px de ancho (buena calidad para WhatsApp / TikTok)
const TEXT_SIZE = 17;
const TEXT_LINE_HEIGHT = TEXT_SIZE * 1.5;
const SYMBOL_SIZE = 32;
const SYMBOL_LINE_HEIGHT = SYMBOL_SIZE * 1.5;
const AUTHOR_SIZE = 13;
const AUTHOR_LINE_HEIGHT = AUTHOR_SIZE * 1.5;
const FONT_FAMILY = "PoppinsExport, Poppins, system-ui, sans-serif";

const BORDER_MAP = { Ninguno: 0, Fino: 1, Medio: 3, Grueso: 6 };
const RATIO_MAP = { '1:1': 1, '3:4': 3 / 4, '9:16': 9 / 16 }; // ancho / alto

export function setupDownload({ buttonEl, urlOutputEl, statusEl }) {
  const originalLabel = buttonEl.textContent;

  function setStatus(message, isError = false) {
    if (!statusEl) return;
    statusEl.textContent = message;
    statusEl.classList.toggle('is-error', isError);
  }

  buttonEl.addEventListener('click', async () => {
    buttonEl.disabled = true;
    buttonEl.textContent = 'Generando…';
    setStatus('');
    try {
      const config = readParams(schema, new URL(urlOutputEl.value).search);
      const blob = await renderQuoteImage(config);
      saveBlob(blob, 'frase.png');
      buttonEl.textContent = '¡Descargada!';
    } catch (err) {
      buttonEl.textContent = originalLabel;
      if (err && err.code === 'BG_IMAGE') {
        setStatus(
          'No se pudo cargar la imagen de fondo para la descarga. Algunos sitios no permiten ' +
          'usar sus imágenes fuera de su propia página. Prueba con la imagen en otro alojamiento, ' +
          'o descarga con fondo de color.',
          true
        );
      } else {
        console.error(err);
        setStatus('No se pudo generar la imagen. Inténtalo de nuevo.', true);
      }
    } finally {
      buttonEl.disabled = false;
      if (buttonEl.textContent === '¡Descargada!') {
        setTimeout(() => (buttonEl.textContent = originalLabel), 1500);
      }
    }
  });
}

export async function renderQuoteImage(config) {
  await loadFont();

  const ratio = RATIO_MAP[config.aspectRatio] || RATIO_MAP['3:4'];
  const W = CARD_WIDTH;
  const H = Math.round((W * SCALE) / ratio) / SCALE;
  const bw = BORDER_MAP[config.borderWidth] ?? 0;
  const radius = Math.max(0, Number(config.borderRadius) || 0);
  const innerRadius = Math.max(0, radius - bw);

  const canvas = document.createElement('canvas');
  canvas.width = Math.round(W * SCALE);
  canvas.height = Math.round(H * SCALE);
  const ctx = canvas.getContext('2d');
  ctx.scale(SCALE, SCALE);

  // Imagen de fondo (se carga primero para fallar rápido y con un mensaje claro)
  const useImage = config.backgroundType === 'Imagen' && config.backgroundImage;
  const bgImage = useImage ? await loadImage(config.backgroundImage) : null;

  // ---- Fondo ----
  if (config.backgroundType === 'Color') {
    ctx.beginPath();
    roundRectPath(ctx, 0, 0, W, H, radius);
    ctx.fillStyle = config.backgroundColor;
    ctx.fill();
  } else if (bgImage) {
    ctx.save();
    ctx.beginPath();
    roundRectPath(ctx, bw, bw, W - 2 * bw, H - 2 * bw, innerRadius);
    ctx.clip();
    drawCover(ctx, bgImage, bw, bw, W - 2 * bw, H - 2 * bw);
    const opacity = Math.min(100, Math.max(0, Number(config.overlayOpacity) || 0)) / 100;
    ctx.fillStyle = `rgba(0, 0, 0, ${opacity})`;
    ctx.fillRect(bw, bw, W - 2 * bw, H - 2 * bw);
    ctx.restore();
  }

  // ---- Borde (anillo entre el contorno exterior y el interior) ----
  if (bw > 0) {
    ctx.save();
    ctx.beginPath();
    roundRectPath(ctx, 0, 0, W, H, radius);
    roundRectPath(ctx, bw, bw, W - 2 * bw, H - 2 * bw, innerRadius);
    ctx.fillStyle = config.borderColor;
    ctx.fill('evenodd');
    ctx.restore();
  }

  // Área de contenido: misma que la capa .quote-text-layer del widget
  const layerX = bw + PAD_X;
  const layerY = bw + PAD_Y;
  const layerW = W - 2 * bw - 2 * PAD_X;
  const layerH = H - 2 * bw - 2 * PAD_Y;

  ctx.fillStyle = config.textColor;

  // ---- Símbolo (arriba, centrado) ----
  if (config.symbol) {
    ctx.font = `400 ${SYMBOL_SIZE}px ${FONT_FAMILY}`;
    ctx.textAlign = 'center';
    drawLine(ctx, config.symbol, layerX + layerW / 2, layerY, SYMBOL_LINE_HEIGHT);
  }

  // ---- Autor (abajo, alineado a la derecha) ----
  if (config.author) {
    ctx.save();
    ctx.globalAlpha = 0.8;
    ctx.font = `italic 400 ${AUTHOR_SIZE}px ${FONT_FAMILY}`;
    ctx.textAlign = 'right';
    drawLine(ctx, config.author, layerX + layerW, layerY + layerH - AUTHOR_LINE_HEIGHT, AUTHOR_LINE_HEIGHT);
    ctx.restore();
  }

  // ---- Frase (posición libre en % dentro del área de contenido) ----
  // El navegador colapsa espacios y saltos de línea; se replica igual para que coincida con el widget
  const fullText = `\u201C${String(config.text).replace(/\s+/g, ' ')}\u201D`;
  ctx.font = `400 ${TEXT_SIZE}px ${FONT_FAMILY}`;
  ctx.textAlign = 'center';
  const lines = wrapText(ctx, fullText, layerW);
  const boxW = Math.min(ctx.measureText(fullText).width, layerW);
  const boxH = lines.length * TEXT_LINE_HEIGHT;
  const px = clampPercent(config.textX) / 100;
  const py = clampPercent(config.textY) / 100;
  const boxLeft = layerX + px * layerW - px * boxW;
  const boxTop = layerY + py * layerH - py * boxH;
  lines.forEach((line, i) => {
    drawLine(ctx, line, boxLeft + boxW / 2, boxTop + i * TEXT_LINE_HEIGHT, TEXT_LINE_HEIGHT);
  });

  return new Promise((resolve, reject) => {
    try {
      canvas.toBlob(blob => (blob ? resolve(blob) : reject(new Error('toBlob vacío'))), 'image/png');
    } catch (err) {
      reject(err);
    }
  });
}

// ---------- utilidades ----------

function clampPercent(v) {
  return Number.isFinite(Number(v)) ? Math.min(100, Math.max(0, Number(v))) : 50;
}

function roundRectPath(ctx, x, y, w, h, r) {
  const rr = Math.min(r, w / 2, h / 2);
  ctx.moveTo(x + rr, y);
  ctx.arcTo(x + w, y, x + w, y + h, rr);
  ctx.arcTo(x + w, y + h, x, y + h, rr);
  ctx.arcTo(x, y + h, x, y, rr);
  ctx.arcTo(x, y, x + w, y, rr);
  ctx.closePath();
}

// Equivalente a background-size: cover; background-position: center
function drawCover(ctx, img, x, y, w, h) {
  const scale = Math.max(w / img.naturalWidth, h / img.naturalHeight);
  const dw = img.naturalWidth * scale;
  const dh = img.naturalHeight * scale;
  ctx.drawImage(img, x + (w - dw) / 2, y + (h - dh) / 2, dw, dh);
}

// Dibuja una línea centrando su caja de altura `lineHeight` igual que lo hace el CSS
function drawLine(ctx, text, x, lineTop, lineHeight) {
  const m = ctx.measureText(text);
  if (m.fontBoundingBoxAscent !== undefined) {
    const ascent = m.fontBoundingBoxAscent;
    const descent = m.fontBoundingBoxDescent;
    ctx.textBaseline = 'alphabetic';
    ctx.fillText(text, x, lineTop + (lineHeight - (ascent + descent)) / 2 + ascent);
  } else {
    ctx.textBaseline = 'middle';
    ctx.fillText(text, x, lineTop + lineHeight / 2);
  }
}

// Salto de línea por palabras (y por letras si una palabra sola no cabe)
function wrapText(ctx, text, maxWidth) {
  const lines = [];
  let current = '';
  const pushWord = word => {
    const attempt = current ? `${current} ${word}` : word;
    if (ctx.measureText(attempt).width <= maxWidth) {
      current = attempt;
      return;
    }
    if (current) {
      lines.push(current);
      current = '';
    }
    if (ctx.measureText(word).width <= maxWidth) {
      current = word;
      return;
    }
    let chunk = '';
    for (const ch of word) {
      if (ctx.measureText(chunk + ch).width > maxWidth && chunk) {
        lines.push(chunk);
        chunk = ch;
      } else {
        chunk += ch;
      }
    }
    current = chunk;
  };
  text.split(' ').forEach(pushWord);
  if (current) lines.push(current);
  return lines;
}

function loadImage(url) {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = 'anonymous'; // sin esto el canvas quedaría "contaminado" y no se podría exportar
    img.onload = () => resolve(img);
    img.onerror = () => reject(Object.assign(new Error('No se pudo cargar la imagen'), { code: 'BG_IMAGE' }));
    img.src = url;
  });
}

// Carga Poppins (la misma tipografía del widget) bajo un nombre propio, para que el
// canvas la use sin cambiar la tipografía de la página de configuración.
let fontPromise = null;
function loadFont() {
  if (!fontPromise) {
    fontPromise = (async () => {
      try {
        const res = await fetch('https://fonts.googleapis.com/css2?family=Poppins:wght@400;600&display=swap');
        const css = (await res.text()).replace(/font-family:\s*'Poppins'/g, "font-family: 'PoppinsExport'");
        const style = document.createElement('style');
        style.textContent = css;
        document.head.appendChild(style);
        await Promise.all([
          document.fonts.load(`400 ${TEXT_SIZE}px PoppinsExport`, 'áéíóúñ¿¡“”AaZz'),
          document.fonts.load(`400 ${SYMBOL_SIZE}px PoppinsExport`)
        ]);
      } catch {
        /* sin conexión a Google Fonts: se usa Poppins local o la tipografía del sistema */
      }
    })();
  }
  return fontPromise;
}

function saveBlob(blob, filename) {
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  a.remove();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}
