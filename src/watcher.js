import { watch } from 'melanke-watchjs';
import { renderChannels, renderItems, renderAlerts } from './renderers.js';

export default (state, containers) => {
  const {
    input,
    button,
    modalBody,
  } = containers;

  watch(state, 'form', () => {
    switch (state.form.state) {
      case 'empty':
        input.classList.remove('is-invalid');
        input.classList.remove('is-valid');
        button.disabled = true;
        input.disabled = false;
        input.value = null;
        break;
      case 'valid':
        input.classList.add('is-valid');
        input.classList.remove('is-invalid');
        button.disabled = false;
        input.disabled = false;
        break;
      case 'invalid':
        input.classList.add('is-invalid');
        input.classList.remove('is-valid');
        button.disabled = true;
        break;
      case 'processing':
        input.disabled = true;
        button.disabled = true;
        break;
      default:
        throw new Error(`${state.form.state}: unexpected state of form`);
    }
  });

  watch(state, 'channels', () => {
    renderChannels(state.channels, containers);
  });

  watch(state, 'items', () => {
    renderItems(state.items, containers);
  });

  watch(state, 'errors', () => {
    renderAlerts(state, containers);
  });

  watch(state, 'modal', () => {
    switch (state.modal.state) {
      case 'shown':
        modalBody.html(state.modal.description);
        break;
      case 'hidden':
        modalBody.html(null);
        break;
      default:
        throw new Error(`${state.modal.state}: unexpected state of modal`);
    }
  });
};
