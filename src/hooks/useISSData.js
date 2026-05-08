import { useState, useEffect, useCallback, useRef } from 'react';
import axios from 'axios';
import { calculateSpeed } from '../utils/haversine';

export const useISSData = () => {
  const [positions, setPositions] = useState([]);
  const [currentPosition, setCurrentPosition] = useState(null);
  const [speed, setSpeed] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const lastFetchTime = useRef(null);
  const [totalTracked, setTotalTracked] = useState(0);

  const fetchISSData = useCallback(async () => {
    try {
      const response = await axios.get('https://api.wheretheiss.at/v1/satellites/25544');
      const { latitude, longitude, timestamp: ts, velocity } = response.data;
      const timestamp = ts * 1000;
      
      const newPos = { 
        lat: parseFloat(latitude), 
        lng: parseFloat(longitude), 
        timestamp 
      };

      setPositions(prev => {
        const updated = [...prev, newPos];
        if (updated.length > 15) return updated.slice(updated.length - 15);
        return updated;
      });

      setCurrentPosition(newPos);
      setTotalTracked(prev => prev + 1);
      
      // WhereTheISS API provides exact velocity in km/h directly!
      setSpeed(velocity || 27600);

      lastFetchTime.current = timestamp;
      setLoading(false);
      setError(null);
    } catch (err) {
      console.error('Failed to fetch ISS data', err);
      setError('Failed to fetch ISS data');
      setLoading(false);
    }
  }, [currentPosition]);

  useEffect(() => {
    fetchISSData();
    const interval = setInterval(fetchISSData, 15000);
    return () => clearInterval(interval);
  }, []); // Only on mount, we use interval

  return { currentPosition, positions, speed, totalTracked, loading, error, refresh: fetchISSData };
};
