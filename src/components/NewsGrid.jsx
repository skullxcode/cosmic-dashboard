import React, { useState, useMemo } from 'react';
import NewsCard from './NewsCard';
import SearchBar from './SearchBar';
import { useDashboardData } from '../context/DataContext';

const SkeletonCard = () => (
  <div className="glass-panel overflow-hidden h-full animate-pulse">
    <div className="h-48 bg-white/5"></div>
    <div className="p-5 flex flex-col gap-3">
      <div className="h-4 w-1/3 bg-white/5 rounded"></div>
      <div className="h-6 w-full bg-white/10 rounded"></div>
      <div className="h-4 w-full bg-white/5 rounded mt-2"></div>
      <div className="h-4 w-2/3 bg-white/5 rounded"></div>
      <div className="h-10 w-full bg-white/5 rounded mt-4"></div>
    </div>
  </div>
);

const NewsGrid = () => {
  const { newsData } = useDashboardData();
  const { news, loading, error, refresh } = newsData;
  const [searchTerm, setSearchTerm] = useState('');
  const [sortSource, setSortSource] = useState('');
  const [sortDate, setSortDate] = useState('newest');

  const filteredNews = useMemo(() => {
    if (!news) return [];
    let filtered = [...news];

    // Search
    if (searchTerm) {
      const lower = searchTerm.toLowerCase();
      filtered = filtered.filter(n => 
        (n.title && n.title.toLowerCase().includes(lower)) || 
        (n.description && n.description.toLowerCase().includes(lower))
      );
    }

    // Sort by source
    if (sortSource === 'sort') {
      filtered.sort((a, b) => (a.source_id || '').localeCompare(b.source_id || ''));
    }

    // Sort by date
    if (sortDate === 'newest') {
      filtered.sort((a, b) => new Date(b.pubDate || 0) - new Date(a.pubDate || 0));
    } else {
      filtered.sort((a, b) => new Date(a.pubDate || 0) - new Date(b.pubDate || 0));
    }

    return filtered;
  }, [news, searchTerm, sortSource, sortDate]);

  return (
    <div className="w-full">
      <SearchBar 
        onSearch={setSearchTerm} 
        onSortSource={setSortSource} 
        onSortDate={setSortDate} 
        onRefresh={refresh}
        isRefreshing={loading}
      />
      
      {error && (
        <div className="bg-red-500/10 border border-red-500/50 text-red-400 p-4 rounded-xl mb-6 flex justify-between items-center">
          <span>{error}</span>
          <button onClick={refresh} className="text-sm bg-red-500/20 px-3 py-1 rounded hover:bg-red-500/40 transition">Retry</button>
        </div>
      )}

      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {[...Array(6)].map((_, i) => <SkeletonCard key={i} />)}
        </div>
      ) : filteredNews.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {filteredNews.map((article, i) => (
            <NewsCard key={article.article_id || i} article={article} />
          ))}
        </div>
      ) : (
        <div className="text-center py-12 text-gray-400 glass-panel">
          No news articles found. Try adjusting your search.
        </div>
      )}
    </div>
  );
};

export default NewsGrid;
