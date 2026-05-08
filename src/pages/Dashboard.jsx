import React from 'react';
import { motion } from 'framer-motion';
import { FiRefreshCw, FiMap, FiUsers, FiGlobe, FiActivity } from 'react-icons/fi';
import { useDashboardData } from '../context/DataContext';
import ISSMap from '../map/ISSMap';
import ISSLineChart from '../charts/ISSLineChart';
import NewsDoughnutChart from '../charts/NewsDoughnutChart';
import NewsGrid from '../components/NewsGrid';

const StatCard = ({ title, value, icon: Icon, colorClass }) => (
  <motion.div 
    whileHover={{ scale: 1.02 }}
    className="glass-panel p-5 flex items-center gap-4 relative overflow-hidden group"
  >
    <div className={`w-12 h-12 rounded-full flex items-center justify-center shrink-0 bg-white/5 border border-white/10 group-hover:border-${colorClass} transition-colors`}>
      <Icon className={`text-2xl text-${colorClass}`} />
    </div>
    <div className="z-10">
      <p className="text-gray-400 text-sm font-medium uppercase tracking-wider">{title}</p>
      <h3 className="text-2xl font-bold text-white mt-1">{value}</h3>
    </div>
    {/* Background Glow */}
    <div className={`absolute -right-6 -bottom-6 w-24 h-24 bg-${colorClass} rounded-full blur-3xl opacity-10 group-hover:opacity-20 transition-opacity`}></div>
  </motion.div>
);

const Dashboard = () => {
  const { issData, newsData, astroData } = useDashboardData();

  return (
    <div className="min-h-screen bg-space-900 pb-20">
      {/* Header */}
      <header className="sticky top-0 z-40 bg-space-900/80 backdrop-blur-xl border-b border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-neon-blue to-neon-purple flex items-center justify-center">
              <FiGlobe className="text-white text-xl" />
            </div>
            <h1 className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-neon-blue to-neon-purple tracking-wide">
              Cosmic Intelligence
            </h1>
          </div>
          <div className="flex gap-4 items-center">
            <button 
              onClick={issData.refresh}
              className="flex items-center gap-2 px-4 py-2 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl transition-colors text-sm font-medium"
            >
              <FiRefreshCw className={issData.loading ? "animate-spin text-neon-blue" : "text-neon-blue"} />
              <span className="hidden sm:inline">Sync Data</span>
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 space-y-8">
        
        {/* Stats Row */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <StatCard 
            title="ISS Velocity" 
            value={`${issData.speed ? Math.round(issData.speed).toLocaleString() : '--'} km/h`}
            icon={FiActivity}
            colorClass="neon-blue"
          />
          <StatCard 
            title="Latitude" 
            value={issData.currentPosition ? issData.currentPosition.lat.toFixed(4) : '--'}
            icon={FiMap}
            colorClass="neon-purple"
          />
          <StatCard 
            title="Longitude" 
            value={issData.currentPosition ? issData.currentPosition.lng.toFixed(4) : '--'}
            icon={FiMap}
            colorClass="neon-purple"
          />
          <StatCard 
            title="People In Space" 
            value={astroData.loading ? '--' : astroData.astros.length}
            icon={FiUsers}
            colorClass="green-400"
          />
        </div>

        {/* Map & Speed Chart */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 h-[450px] glass-panel p-2">
            <ISSMap positions={issData.positions} currentPosition={issData.currentPosition} />
          </div>
          <div className="flex flex-col gap-6">
            <div className="glass-panel p-5 flex-1 flex flex-col">
              <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-neon-blue animate-pulse"></div>
                Speed Telemetry
              </h3>
              <ISSLineChart positions={issData.positions} currentSpeed={issData.speed} />
            </div>
            <div className="glass-panel p-5 h-48 overflow-y-auto custom-scrollbar">
              <h3 className="text-sm text-gray-400 font-bold uppercase tracking-wider mb-3">Astronauts Manifest</h3>
              {astroData.loading ? (
                <div className="animate-pulse space-y-2">
                  <div className="h-4 bg-white/10 rounded w-3/4"></div>
                  <div className="h-4 bg-white/10 rounded w-1/2"></div>
                </div>
              ) : (
                <ul className="space-y-3">
                  {astroData.astros.map((a, i) => (
                    <li key={i} className="flex justify-between items-center text-sm border-b border-white/5 pb-2">
                      <span className="text-white font-medium">{a.name}</span>
                      <span className="text-neon-purple text-xs px-2 py-1 bg-neon-purple/10 rounded-full">{a.craft}</span>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>
        </div>

        {/* News Section */}
        <div className="pt-8">
          <div className="flex items-center gap-4 mb-6">
            <h2 className="text-2xl font-bold text-white">Intergalactic News</h2>
            <div className="h-px flex-1 bg-gradient-to-r from-white/20 to-transparent"></div>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
            <div className="lg:col-span-1">
              <div className="glass-panel p-5 sticky top-24">
                <h3 className="text-lg font-semibold mb-4">Source Distribution</h3>
                <NewsDoughnutChart news={newsData.news} />
              </div>
            </div>
            <div className="lg:col-span-3">
              <NewsGrid />
            </div>
          </div>
        </div>

      </main>
    </div>
  );
};

export default Dashboard;
