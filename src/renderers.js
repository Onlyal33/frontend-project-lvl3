import i18next from 'i18next';

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

export { renderItems, renderChannels };
