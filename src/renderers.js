const renderFeedsList = (feeds) => {
  const feedsList = document.getElementById('rss-feeds');
  feedsList.innerHTML = '';
  feeds.map(({ title, description }) => {
    const el = document.createElement('li');
    el.classList.add('list-group-item');
    el.textContent = `${title}: ${description}`;
    return el;
  })
    .forEach((el) => feedsList.append(el));
};

const renderPostsList = (posts) => {
  const postsList = document.getElementById('posts');
  postsList.innerHTML = '';
  posts.map(({ title, link }) => {
    const el = document.createElement('li');
    el.classList.add('list-group-item');
    el.innerHTML = `<a href="${link}">${title}</a>`;
    return el;
  })
    .forEach((el) => postsList.append(el));
};

export { renderPostsList, renderFeedsList };
