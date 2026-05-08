import React from 'react';
import { FiSearch, FiRefreshCw } from 'react-icons/fi';

const SearchBar = ({ onSearch, onSortSource, onSortDate, onRefresh, isRefreshing }) => {
  return (
    <div className="flex flex-col md:flex-row gap-4 justify-between items-center bg-space-800/50 p-4 rounded-2xl border border-white/5 mb-6">
      <div className="relative w-full md:w-96">
        <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
        <input 
          type="text" 
          placeholder="Search news..." 
          onChange={(e) => onSearch(e.target.value)}
          className="w-full bg-space-900 text-white rounded-xl pl-10 pr-4 py-2 border border-white/10 focus:outline-none focus:border-neon-blue/50 transition-colors"
        />
      </div>
      
      <div className="flex gap-3 w-full md:w-auto overflow-x-auto pb-2 md:pb-0">
        <select 
          onChange={(e) => onSortSource(e.target.value)}
          className="bg-space-900 text-white rounded-xl px-4 py-2 border border-white/10 focus:outline-none focus:border-neon-purple/50 appearance-none min-w-[140px]"
        >
          <option value="">All Sources</option>
          {/* Options will be dynamic in full implementation */}
          <option value="sort">Sort by Source</option>
        </select>
        
        <select 
          onChange={(e) => onSortDate(e.target.value)}
          className="bg-space-900 text-white rounded-xl px-4 py-2 border border-white/10 focus:outline-none focus:border-neon-purple/50 appearance-none min-w-[140px]"
        >
          <option value="newest">Newest First</option>
          <option value="oldest">Oldest First</option>
        </select>

        <button 
          onClick={onRefresh}
          className="bg-white/5 hover:bg-white/10 text-white p-2.5 rounded-xl border border-white/10 transition-colors flex items-center justify-center shrink-0"
          title="Refresh News"
        >
          <FiRefreshCw className={isRefreshing ? "animate-spin text-neon-blue" : ""} />
        </button>
      </div>
    </div>
  );
};

export default SearchBar;
