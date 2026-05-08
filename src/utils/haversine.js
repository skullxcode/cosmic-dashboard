export const calculateDistance = (lat1, lon1, lat2, lon2) => {
  if (lat1 === lat2 && lon1 === lon2) {
    return 0;
  }
  const R = 6371; // Radius of the earth in km
  const dLat = deg2rad(lat2 - lat1);
  const dLon = deg2rad(lon2 - lon1);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) *
    Math.sin(dLon / 2) * Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  const d = R * c; // Distance in km
  return d;
};

const deg2rad = (deg) => {
  return deg * (Math.PI / 180);
};

export const calculateSpeed = (lat1, lon1, time1, lat2, lon2, time2) => {
  const distance = calculateDistance(lat1, lon1, lat2, lon2); // in km
  const timeDiffHours = (time2 - time1) / 1000 / 3600; // time diff in hours
  if (timeDiffHours === 0) return 0;
  return distance / timeDiffHours; // speed in km/h
};
