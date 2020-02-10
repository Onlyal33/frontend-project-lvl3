import $ from 'jquery';
import _ from 'lodash';
import i18next from 'i18next';
import isURL from 'validator/lib/isURL';
import axios from 'axios';
import watch from './watcher';
import parse from './parser';
import resources from './locales';

const config = { updatePeriod: 5000, proxyUrl: 'https://cors-anywhere.herokuapp.com/' };

const addIds = (items, channelId) => items.map((el) => ({ ...el, channelId, id: _.uniqueId() }));

const processError = (args) => {
  const { error, state } = args;
  if (error.response || error instanceof TypeError) {
    state.errors.push({ id: _.uniqueId(), type: 'invalidRss' });
  } else {
    state.errors.push({ id: _.uniqueId(), type: 'network' });
  }
  state.form.state = 'valid';
  console.log(error);
};

const prependProxyToUrl = (url) => `${config.proxyUrl}${url}`;

const updateItems = ({ url, id }, state) => {
  const processedUrl = prependProxyToUrl(url);
  return axios.get(processedUrl)
    .then(({ data }) => {
      const { items } = parse(data);
      const existingItems = state.items.filter(({ channelId }) => channelId === id);
      const newItems = _.differenceBy(items, existingItems, 'link');
      const processedItems = addIds(newItems, id);
      state.items.unshift(...processedItems);
      setTimeout(updateItems, config.updatePeriod, { url, id }, state);
    })
    .catch((error) => processError({ error, state }));
};

const run = () => {
  const state = {
    form: {
      input: null,
      state: 'empty',
    },
    channels: [],
    items: [],
    modal: {
      state: 'hidden',
      activeId: null,
    },
    errors: [],
  };

  const containers = {
    input: document.querySelector('input[type="text"]'),
    button: document.getElementById('submit-rss'),
    modalBody: $('#showDescModal').find('.modal-body'),
    alerts: document.getElementById('alerts'),
    form: document.getElementById('rss'),
    ul: document.getElementById('channels'),
    table: document.getElementById('items'),
  };

  watch(state, containers);

  containers.input.addEventListener('input', ({ target }) => {
    const { value } = target;
    state.form.input = value;
    if (value.length === 0) {
      state.form.state = 'empty';
    } else if (isURL(value) && !state.channels.map(({ url }) => url).includes(value)) {
      state.form.state = 'valid';
    } else {
      state.form.state = 'invalid';
    }
  });

  containers.form.addEventListener('submit', (event) => {
    event.preventDefault();
    state.form.state = 'processing';
    const formData = new FormData(event.target);
    const url = formData.get('url');
    const processedUrl = prependProxyToUrl(url);
    axios.get(processedUrl)
      .then(({ data }) => {
        const { title, description, items } = parse(data);
        const id = state.channels.length;
        const channel = {
          title, description, url, id,
        };
        state.channels.unshift(channel);
        const processedItems = addIds(items, id);
        state.items.unshift(...processedItems);
        state.form.input = null;
        state.form.state = 'empty';
        setTimeout(updateItems, config.updatePeriod, channel, state);
      })
      .catch((error) => processError({ error, state }));
  });

  $('#showDescModal').on('show.bs.modal', (event) => {
    const button = $(event.relatedTarget);
    const id = button.data('itemid').toString();
    const { description } = _.find(state.items, { id });
    state.modal.description = description;
    state.modal.state = 'shown';
  });

  $('#showDescModal').on('hide.bs.modal', () => {
    state.modal.description = null;
    state.modal.state = 'hidden';
  });
};

const app = () => i18next.init({
  lng: 'en',
  resources,
}).then(run);

export default app;
