import axios from 'axios';

export const fetchNews = async () => {
  let apiKey = import.meta.env.VITE_NEWS_API_KEY;

  const response = await fetch(`https://newsdata.io/api/1/latest?apikey=${apiKey}`);
  const data = await response.json();
  
  if (data.status === 'error') {
    throw new Error(data.results?.message || data.message || 'News API Error');
  }
  
  return Array.isArray(data.results) ? data.results : [];
};

export const fetchAstros = async () => {
  const response = await axios.get('http://api.open-notify.org/astros.json');
  return response.data;
};
