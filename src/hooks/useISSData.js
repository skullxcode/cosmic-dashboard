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
      const response = await axios.get('http://api.open-notify.org/iss-now.json');
      const { latitude, longitude } = response.data.iss_position;
      const timestamp = response.data.timestamp * 1000;
      
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
      
      if (lastFetchTime.current && currentPosition) {
        const currentSpeed = calculateSpeed(
          currentPosition.lat, 
          currentPosition.lng, 
          currentPosition.timestamp,
          newPos.lat, 
          newPos.lng, 
          newPos.timestamp
        );
        // ISS speed is typically around 27,600 km/h, sanity check
        if (currentSpeed > 0 && currentSpeed < 50000) {
          setSpeed(currentSpeed);
        } else if (currentSpeed > 50000) {
           setSpeed(27600); // fallback to approx average if reading is weird
        }
      } else {
        setSpeed(27580); // Init approx speed
      }

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
