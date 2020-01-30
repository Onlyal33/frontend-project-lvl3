import axios from 'axios';

const getrss = (url) => {
  const processedUrl = `https://cors-anywhere.herokuapp.com/${url}`;
  return axios.get(processedUrl);
};

export default getrss;
