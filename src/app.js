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
    state.errorModal.description = 'invalidRss';
  } else {
    state.errorModal.description = 'network';
  }
  state.form.state = 'valid';
  state.errorModal.visibility = 'shown';
  console.log(error);
};

const processUrl = (url) => `${config.proxyUrl}${url}`;

const updateItems = ({ url, id }, state) => {
  const processedUrl = processUrl(url);
  return axios.get(processedUrl)
    .then(({ data }) => {
      const { items } = parse(data);
      const existingLinks = state.items.filter(({ channelId }) => channelId === id)
        .map(({ link }) => link);
      const filtered = items.filter(({ link }) => !existingLinks.includes(link));
      const processed = addIds(filtered, id);
      state.items.unshift(...processed);
      setTimeout(updateItems, state.updatePeriod, { url, id }, state);
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
      activeId: null,
    },
    errorModal: {
      visibility: 'hidden',
      description: null,
    },
  };

  const containers = {
    input: document.querySelector('input[type="text"]'),
    button: document.getElementById('submit-rss'),
    modalBody: $('#showDescModal').find('.modal-body'),
    form: document.getElementById('rss'),
    ul: document.getElementById('channels'),
    table: document.getElementById('items'),
    errorModal: $('#errorModal'),
    errorModalDesc: $('#errorDescription'),
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
    const processedUrl = processUrl(url);
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
    state.modal.activeId = id;
  });

  $('#showDescModal').on('hide.bs.modal', () => {
    state.modal.activeId = null;
  });

  $('#errorModal').on('hide.bs.modal', () => {
    state.errorModal.visibility = 'hidden';
    state.errorModal.description = null;
  });
};

const app = () => i18next.init({
  lng: 'en',
  resources,
}).then(run);

export default app;
