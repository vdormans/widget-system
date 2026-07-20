/**
 * configurator.js
 * Renderiza automáticamente un formulario a partir de un schema.params,
 * actualiza una preview en vivo (iframe) y expone la URL final para copiar.
 *
 * Al agregar un widget nuevo, este archivo NO se toca.
 */

import { buildUrl } from './config-engine.js';

export function renderConfigurator({ schema, widgetUrl, formEl, previewEl, urlOutputEl, copyBtnEl }) {
  const values = getDefaults(schema);

  Object.entries(schema.params).forEach(([key, def]) => {
    const field = document.createElement('div');
    field.className = 'field';

    const label = document.createElement('label');
    label.textContent = def.label;
    label.htmlFor = `field-${key}`;
    field.appendChild(label);

    const input = createInput(key, def);
    input.addEventListener('input', () => {
      values[key] = def.type === 'boolean' ? input.checked : input.value;
      update();
    });

    field.appendChild(input);
    formEl.appendChild(field);
  });

  function update() {
    const finalUrl = buildUrl(widgetUrl, schema, values);
    urlOutputEl.value = finalUrl;
    if (previewEl) previewEl.src = finalUrl;
  }

  if (copyBtnEl) {
    copyBtnEl.addEventListener('click', async () => {
      await navigator.clipboard.writeText(urlOutputEl.value);
      const original = copyBtnEl.textContent;
      copyBtnEl.textContent = '¡Copiado!';
      setTimeout(() => (copyBtnEl.textContent = original), 1500);
    });
  }

  update();
}

function createInput(key, def) {
  let input;

  switch (def.type) {
    case 'color':
      input = document.createElement('input');
      input.type = 'color';
      input.value = def.default;
      break;
    case 'select':
      input = document.createElement('select');
      def.options.forEach(opt => {
        const option = document.createElement('option');
        option.value = opt;
        option.textContent = opt;
        if (opt === def.default) option.selected = true;
        input.appendChild(option);
      });
      break;
    case 'boolean':
      input = document.createElement('input');
      input.type = 'checkbox';
      input.checked = def.default;
      break;
    case 'number':
      input = document.createElement('input');
      input.type = 'number';
      input.value = def.default;
      break;
    default:
      input = document.createElement('input');
      input.type = 'text';
      input.value = def.default;
  }

  input.id = `field-${key}`;
  return input;
}

function getDefaults(schema) {
  const values = {};
  Object.entries(schema.params).forEach(([key, def]) => (values[key] = def.default));
  return values;
}
