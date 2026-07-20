/**
 * config-engine.js
 * Motor genérico compartido por TODOS los widgets.
 * No conoce nada específico de ningún widget: solo sabe leer
 * query params según un "schema" y construir URLs a partir de ellos.
 */

// Lee los parámetros actuales de la URL (usado DENTRO del widget.html)
export function readParams(schema) {
  const params = new URLSearchParams(window.location.search);
  const values = {};

  Object.entries(schema.params).forEach(([key, def]) => {
    const raw = params.get(key);

    if (raw === null) {
      values[key] = def.default;
      return;
    }

    switch (def.type) {
      case 'boolean':
        values[key] = raw === 'true';
        break;
      case 'number':
        values[key] = Number(raw);
        break;
      default:
        values[key] = raw;
    }
  });

  return values;
}

// Construye la URL final del widget con los valores elegidos (usado en configure.html)
export function buildUrl(baseUrl, schema, values) {
  const url = new URL(baseUrl, window.location.href);

  Object.entries(schema.params).forEach(([key, def]) => {
    const val = values[key] ?? def.default;
    url.searchParams.set(key, val);
  });

  return url.toString();
}
