import { useState, useEffect, useCallback } from 'react';
import { fetchNews } from '../services/api';

const CACHE_KEY = 'cosmic_news_cache';
const CACHE_DURATION = 15 * 60 * 1000; // 15 minutes

export const useNewsData = () => {
  const [news, setNews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const loadNews = useCallback(async (force = false) => {
    setLoading(true);
    setError(null);
    try {
      if (!force) {
        const cached = localStorage.getItem(CACHE_KEY);
        if (cached) {
          const { timestamp, data } = JSON.parse(cached);
          if (Date.now() - timestamp < CACHE_DURATION) {
            setNews(data);
            setLoading(false);
            return;
          }
        }
      }

      const results = await fetchNews();
      const top10 = results.slice(0, 10);
      setNews(top10);
      localStorage.setItem(CACHE_KEY, JSON.stringify({
        timestamp: Date.now(),
        data: top10
      }));
    } catch (err) {
      setError(err.message || 'Failed to load news');
      // On error, fallback to cache if available
      const cached = localStorage.getItem(CACHE_KEY);
      if (cached) {
        setNews(JSON.parse(cached).data);
      }
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadNews();
  }, [loadNews]);

  return { news, loading, error, refresh: () => loadNews(true) };
};
