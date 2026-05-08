import React, { useEffect, useRef } from 'react';
import { MapContainer, TileLayer, Marker, Popup, Polyline, useMap } from 'react-leaflet';
import L from 'leaflet';
import { motion } from 'framer-motion';

// Custom Map center update hook
const MapUpdater = ({ center, autoCenter, setAutoCenter }) => {
  const map = useMap();
  
  useEffect(() => {
    if (center && center.lat && center.lng && autoCenter) {
      map.setView([center.lat, center.lng], map.getZoom());
    }
  }, [center, map, autoCenter]);

  // Disable autoCenter if user drags map
  useEffect(() => {
    const handleDragStart = () => setAutoCenter(false);
    map.on('dragstart', handleDragStart);
    return () => map.off('dragstart', handleDragStart);
  }, [map, setAutoCenter]);

  return null;
};

// SVG ISS Icon
const issIconSvg = `
<svg width="40" height="40" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
  <path d="M22 12C22 17.5228 17.5228 22 12 22C6.47715 22 2 17.5228 2 12C2 6.47715 6.47715 2 12 2" stroke="#00f3ff" stroke-width="1.5" stroke-linecap="round"/>
  <rect x="2" y="9" width="6" height="6" fill="#bc13fe" fill-opacity="0.5" stroke="#00f3ff" stroke-width="1.5"/>
  <rect x="16" y="9" width="6" height="6" fill="#bc13fe" fill-opacity="0.5" stroke="#00f3ff" stroke-width="1.5"/>
  <rect x="10" y="8" width="4" height="8" fill="#1f2937" stroke="#00f3ff" stroke-width="1.5"/>
  <path d="M8 12H10" stroke="#00f3ff" stroke-width="1.5" stroke-linecap="round"/>
  <path d="M14 12H16" stroke="#00f3ff" stroke-width="1.5" stroke-linecap="round"/>
</svg>
`;

const issIcon = new L.DivIcon({
  html: `<div class="animate-pulse">${issIconSvg}</div>`,
  className: 'bg-transparent',
  iconSize: [40, 40],
  iconAnchor: [20, 20],
});

const ISSMap = ({ positions, currentPosition }) => {
  const [autoCenter, setAutoCenter] = React.useState(true);
  const pathCoordinates = positions.map(pos => [pos.lat, pos.lng]);

  if (!currentPosition) {
    return (
      <div className="w-full h-full flex items-center justify-center bg-space-800 rounded-2xl animate-pulse">
        <span className="text-neon-blue">Loading satellite data...</span>
      </div>
    );
  }

  return (
    <div className="w-full h-full relative rounded-2xl overflow-hidden border border-white/10 shadow-[0_0_20px_rgba(0,243,255,0.1)] group">
      
      {/* Interactive Map */}
      <MapContainer 
        center={[currentPosition.lat, currentPosition.lng]} 
        zoom={4} 
        style={{ height: '100%', width: '100%', background: '#0b0f19' }}
        zoomControl={false}
      >
        <TileLayer
          className="dark-map-tiles"
          url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
          attribution='&copy; <a href="https://carto.com/attributions">CARTO</a>'
        />
        
        <MapUpdater center={currentPosition} autoCenter={autoCenter} setAutoCenter={setAutoCenter} />

        <Polyline 
          positions={pathCoordinates} 
          color="#bc13fe" 
          weight={4} 
          opacity={0.8} 
          dashArray="10, 15"
          className="animate-pulse"
        />

        <Marker position={[currentPosition.lat, currentPosition.lng]} icon={issIcon}>
          <Popup className="glass-popup">
            <div className="text-space-900 font-medium">
              <p className="font-bold text-lg mb-1">ISS Location</p>
              <p>Lat: {currentPosition.lat.toFixed(4)}°</p>
              <p>Lng: {currentPosition.lng.toFixed(4)}°</p>
            </div>
          </Popup>
        </Marker>
      </MapContainer>

      {/* Radar & Crosshair Overlays */}
      {autoCenter && (
        <>
          <div className="radar-sweep"></div>
          <div className="crosshair"></div>
        </>
      )}
      
      {/* HUD Overlay */}
      <div className="absolute top-4 left-4 z-[500] flex flex-col gap-3">
        <div className="glass-panel px-4 py-2 flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-neon-blue animate-pulse shadow-[0_0_8px_#00f3ff]"></div>
          <span className="text-sm font-semibold tracking-wider text-neon-blue uppercase">Live Tracking</span>
        </div>
        
        <button 
          onClick={() => setAutoCenter(!autoCenter)}
          className={`px-4 py-2 text-xs font-bold uppercase tracking-wider rounded-xl transition-all border ${
            autoCenter 
              ? 'bg-neon-purple/20 text-neon-purple border-neon-purple shadow-[0_0_10px_rgba(188,19,254,0.3)]' 
              : 'bg-space-800 text-gray-400 border-white/10 hover:border-white/30'
          }`}
        >
          {autoCenter ? 'Auto-Center: ON' : 'Auto-Center: OFF'}
        </button>
      </div>

      {/* Grid Coordinates HUD */}
      <div className="absolute bottom-4 left-4 z-[500] pointer-events-none">
        <div className="text-[10px] text-neon-blue/70 font-mono flex flex-col gap-1">
          <span>SYS_TRACKING_MODE: ACTIVE</span>
          <span>LAT_TGT: {currentPosition.lat.toFixed(6)}</span>
          <span>LNG_TGT: {currentPosition.lng.toFixed(6)}</span>
        </div>
      </div>
    </div>
  );
};

export default ISSMap;
