const parse = (data) => {
  const parser = new DOMParser();
  const dom = parser.parseFromString(data, 'text/html');
  const rsstitle = dom.querySelector('title').textContent;
  const description = dom.querySelector('description').textContent;
  const posts = Array.from(dom.querySelectorAll('item')).map((el) => {
    const title = el.querySelector('title').textContent;
    const link = el.querySelector('guid').textContent;
    return ({ title, link });
  });
  return { title: rsstitle, description, posts };
};
export default parse;
