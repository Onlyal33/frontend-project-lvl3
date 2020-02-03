import axios from 'axios';

const getResponse = (url) => {
  const processedUrl = `https://cors-anywhere.herokuapp.com/${url}`;
  return axios.get(processedUrl);
};

export default getResponse;
