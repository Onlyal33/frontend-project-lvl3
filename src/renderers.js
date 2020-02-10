import i18next from 'i18next';
import $ from 'jquery';

const renderChannels = (channels, containers) => {
  const { ul } = containers;
  ul.innerHTML = '';
  channels.forEach(({ title, description }) => {
    const li = document.createElement('li');
    li.classList.add('list-group-item');
    li.textContent = `${title}: ${description}`;
    ul.append(li);
  });
};

const renderItems = (items, containers) => {
  const { table } = containers;
  table.innerHTML = '';
  items.forEach(({ title, link, id }) => {
    const tr = document.createElement('tr');
    const tdLink = document.createElement('td');
    tdLink.innerHTML = `<a href="${link}">${title}</a>`;
    tr.append(tdLink);
    const tdButton = document.createElement('td');
    const button = document.createElement('button');
    button.innerHTML = i18next.t('items.button');
    button.setAttribute('type', 'button');
    button.setAttribute('data-toggle', 'modal');
    button.setAttribute('data-itemid', id);
    button.setAttribute('data-target', '#showDescModal');
    button.classList.add('btn', 'btn-primary');
    tdButton.append(button);
    tr.append(tdButton);
    table.append(tr);
  });
};

const renderAlerts = (state, containers) => {
  const { alerts } = containers;
  const { errors } = state;
  alerts.innerHTML = '';
  errors.forEach(({ type, id }) => {
    const alert = document.createElement('div');
    alert.classList.add('alert', 'alert-warning', 'alert-dismissible', 'fade', 'show');
    alert.setAttribute('role', 'alert');
    alert.textContent = i18next.t(`errors.${type}`);
    const button = document.createElement('button');
    button.classList.add('close');
    button.setAttribute('type', 'button');
    button.setAttribute('data-dismiss', 'alert');
    button.setAttribute('aria-label', 'Close');
    button.innerHTML = '<span aria-hidden="true">&times;</span>';
    alert.append(button);
    $(alert).on('close.bs.alert', () => {
      const index = state.errors.findIndex(({ id: idToRemove }) => id === idToRemove);
      state.errors.splice(index, 1);
    });
    alerts.append(alert);
  });
};

export { renderItems, renderChannels, renderAlerts };
