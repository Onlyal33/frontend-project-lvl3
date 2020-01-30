import isURL from 'validator/lib/isURL';
import watch from './watcher';
import getrss from './request';
import parse from './parser';

const app = () => {
  const state = {
    input: {
      value: null,
      state: 'empty',
    },
    form: 'waiting',
    feeds: [],
    posts: [],
  };

  watch(state);

  const input = document.querySelector('input[type="text"]');
  const form = document.getElementById('rss');
  const urls = [];

  input.addEventListener('input', ({ target }) => {
    const { value } = target;
    state.input.value = value;
    if (value.length === 0) {
      state.input.state = 'empty';
    } else if (isURL(value) && !urls.includes(value)) {
      state.input.state = 'valid';
    } else {
      state.input.state = 'invalid';
    }
  });

  form.addEventListener('submit', (event) => {
    event.preventDefault();
    state.form = 'processing';
    const formData = new FormData(event.target);
    const url = formData.get('url');
    const responce = getrss(url);
    responce.then(({ data }) => {
      const { title, description, posts } = parse(data);
      state.feeds.unshift({ title, description, url });
      urls.push(url);
      state.posts.unshift(...posts);
      state.input.value = null;
      state.form = 'waiting';
    }).catch(() => {
      const { value } = input;
      state.input.value = null;
      state.form = 'waiting';
      state.input.value = value;
      throw new Error('Network problem. Please, try again later.');
    });
  });
};

export default app;
