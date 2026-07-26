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

    const labelRow = document.createElement('div');
    labelRow.className = 'label-row';

    const label = document.createElement('label');
    label.textContent = def.label;
    label.htmlFor = `field-${key}`;
    labelRow.appendChild(label);

    if (def.helpItems) {
      def.helpItems.forEach(item => labelRow.appendChild(createHelpIcon(item)));
    }

    field.appendChild(labelRow);

    if (def.type === 'list') {
      field.appendChild(createListField(key, def, values, update));
    } else {
      const input = createInput(key, def);
      input.addEventListener('input', () => {
        values[key] = def.type === 'boolean' ? input.checked : input.value;
        update();
      });
      field.appendChild(input);
    }

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
    case 'date':
      input = document.createElement('input');
      input.type = 'date';
      input.value = def.default;
      break;
    case 'time':
      input = document.createElement('input');
      input.type = 'time';
      input.value = def.default;
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

function createListField(key, def, values, onChange) {
  const wrapper = document.createElement('div');
  wrapper.className = 'list-field';

  const itemsContainer = document.createElement('div');
  itemsContainer.className = 'list-items';
  wrapper.appendChild(itemsContainer);

  const addBtn = document.createElement('button');
  addBtn.type = 'button';
  addBtn.className = 'list-add-btn';

  const max = def.max || Infinity;

  function renderItems() {
    itemsContainer.innerHTML = '';

    values[key].forEach((item, idx) => {
      const row = document.createElement('div');
      row.className = 'list-item';

      const input = document.createElement('input');
      input.type = 'text';
      input.value = item;
      input.placeholder = def.placeholder || '';
      input.addEventListener('input', () => {
        values[key][idx] = input.value;
        onChange();
      });

      const removeBtn = document.createElement('button');
      removeBtn.type = 'button';
      removeBtn.className = 'list-remove-btn';
      removeBtn.textContent = '✕';
      removeBtn.addEventListener('click', () => {
        values[key].splice(idx, 1);
        renderItems();
        onChange();
      });

      row.appendChild(input);
      row.appendChild(removeBtn);
      itemsContainer.appendChild(row);
    });

    const atMax = values[key].length >= max;
    addBtn.disabled = atMax;
    addBtn.textContent = atMax
      ? `Máximo ${max} alcanzado`
      : `${def.addLabel || '+ Agregar'} (${values[key].length}/${max})`;
  }

  addBtn.addEventListener('click', () => {
    if (values[key].length < max) {
      values[key].push('');
      renderItems();
      onChange();
    }
  });

  renderItems();
  wrapper.appendChild(addBtn);
  return wrapper;
}

function createHelpIcon(item) {
  const wrapper = document.createElement('span');
  wrapper.className = 'help-icon-wrapper';

  const icon = document.createElement('button');
  icon.type = 'button';
  icon.className = 'help-icon';
  icon.textContent = '?';
  icon.setAttribute('aria-label', item.label);

  const popover = document.createElement('div');
  popover.className = 'help-popover';
  popover.innerHTML = `<strong>${item.label}</strong><div>${item.content}</div>`;

  icon.addEventListener('click', e => {
    e.stopPropagation();
    document.querySelectorAll('.help-popover.is-open').forEach(p => {
      if (p !== popover) p.classList.remove('is-open');
    });
    popover.classList.toggle('is-open');
  });

  wrapper.appendChild(icon);
  wrapper.appendChild(popover);
  return wrapper;
}

document.addEventListener('click', () => {
  document.querySelectorAll('.help-popover.is-open').forEach(p => p.classList.remove('is-open'));
});

function getDefaults(schema) {
  const values = {};
  Object.entries(schema.params).forEach(([key, def]) => {
    values[key] = def.type === 'list' ? [...(def.default || [])] : def.default;
  });
  return values;
}
