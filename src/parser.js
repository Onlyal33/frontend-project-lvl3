const parse = (data) => {
  const parser = new DOMParser();
  const parsedXml = parser.parseFromString(data, 'text/xml');
  const title = parsedXml.querySelector('title').textContent;
  const description = parsedXml.querySelector('description').textContent;
  const items = [...parsedXml.querySelectorAll('item')].map((el) => {
    const result = {
      title: el.querySelector('title').textContent,
      link: el.querySelector('link').textContent,
      description: el.querySelector('description').textContent,
    };
    return result;
  });
  return { title, description, items };
};

export default parse;
