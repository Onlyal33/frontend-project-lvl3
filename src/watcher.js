import { watch } from 'melanke-watchjs';
import { renderFeedsList, renderPostsList } from './renderers';

export default (state) => {
  const input = document.querySelector('input[type="text"]');
  const button = document.getElementById('submit-rss');

  watch(state, 'input', () => {
    switch (state.input.state) {
      case 'empty':
        input.classList.remove('is-invalid');
        input.classList.remove('is-valid');
        button.disabled = true;
        break;
      case 'valid':
        input.classList.add('is-valid');
        input.classList.remove('is-invalid');
        button.disabled = false;
        break;
      case 'invalid':
        input.classList.add('is-invalid');
        input.classList.remove('is-valid');
        button.disabled = true;
        break;
      default:
        throw new Error('unexpected state of input');
    }
  });

  watch(state, 'form', () => {
    switch (state.form) {
      case 'waiting':
        input.disabled = false;
        input.value = state.input.value;
        break;
      case 'processing':
        button.disabled = true;
        input.disabled = true;
        break;
      default:
        throw new Error('unexpected state of form');
    }
  });

  watch(state, 'feeds', () => {
    renderFeedsList(state.feeds);
  });

  watch(state, 'posts', () => {
    renderPostsList(state.posts);
  });
};
