import { useState, useEffect } from 'react';
import { fetchAstros } from '../services/api';

export const useAstros = () => {
  const [astros, setAstros] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadAstros = async () => {
      try {
        const data = await fetchAstros();
        setAstros(data.people || []);
      } catch (err) {
        setError('Failed to load astronauts');
      } finally {
        setLoading(false);
      }
    };
    loadAstros();
  }, []);

  return { astros, loading, error };
};
