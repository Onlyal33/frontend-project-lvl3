import $ from 'jquery';
import _ from 'lodash';
import i18next from 'i18next';
import isURL from 'validator/lib/isURL';
import watch from './watcher';
import getResponse from './http';
import parse from './parser';
import resources from './locales';

const addIds = (items, channelId) => items.map((el) => ({ ...el, channelId, id: _.uniqueId() }));

const processError = (args) => {
  const { error, description, state } = args;
  state.form.state = 'valid';
  if (state.errorModal.visibility !== 'shown') {
    state.errorModal.visibility = 'shown';
    state.errorModal.description = description;
  }
  throw error;
};

const updateItems = ({ url, id }, state) => getResponse(url)
  .catch((error) => processError({ error, state, description: 'network' }))
  .then(({ data }) => {
    const { items } = parse(data);
    const existingLinks = state.items.filter(({ channelId }) => channelId === id)
      .map(({ link }) => link);
    const filtered = items.filter(({ link }) => !existingLinks.includes(link));
    const processed = addIds(filtered, id);
    state.items.unshift(...processed);
    setTimeout(updateItems, state.updatePeriod, { url, id }, state);
  })
  .catch((error) => processError({ error, state, description: 'onItemsUpdate' }));

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
    updatePeriod: 5000,
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
    getResponse(url)
      .catch((error) => processError({ error, state, description: 'network' }))
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
        setTimeout(updateItems, state.updatePeriod, channel, state);
      })
      .catch((error) => processError({ error, state, description: 'invalidRss' }));
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
}).then(() => run());

export default app;
