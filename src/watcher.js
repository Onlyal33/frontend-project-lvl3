import { watch } from 'melanke-watchjs';
import _ from 'lodash';
import i18next from 'i18next';
import { renderChannels, renderItems } from './renderers';

export default (state, containers) => {
  const {
    input,
    button,
    modalBody,
    errorModal,
    errorModalDesc,
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
        throw new Error('Unexpected state of form');
    }
  });

  watch(state, 'channels', () => {
    renderChannels(state.channels, containers);
  });

  watch(state, 'items', () => {
    renderItems(state.items, containers);
  });

  watch(state, 'errorModal', () => {
    switch (state.errorModal.visibility) {
      case 'shown':
        errorModalDesc.html(i18next.t(`errors.${state.errorModal.description}`));
        errorModal.modal('show');
        break;
      case 'hidden':
        errorModalDesc.html(null);
        break;
      default:
        throw new Error('Unexpected state of input');
    }
  });

  watch(state, 'modal', () => {
    if (state.modal.activeId) {
      const { description } = _.find(state.items, { id: state.modal.activeId });
      modalBody.html(description);
    } else {
      modalBody.html(null);
    }
  });
};
