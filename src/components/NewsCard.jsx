import React from 'react';
import { motion } from 'framer-motion';

const NewsCard = ({ article }) => {
  const defaultImage = 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?q=80&w=600&auto=format&fit=crop';
  
  return (
    <motion.div 
      whileHover={{ y: -5 }}
      className="glass-panel overflow-hidden flex flex-col h-full group"
    >
      <div className="h-48 overflow-hidden relative">
        <img 
          src={article.image_url || defaultImage} 
          alt={article.title} 
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
          onError={(e) => { e.target.src = defaultImage }}
        />
        <div className="absolute top-2 right-2 bg-space-900/80 backdrop-blur-sm text-xs px-2 py-1 rounded text-neon-blue border border-white/10">
          {article.source_id || 'News'}
        </div>
      </div>
      <div className="p-5 flex-1 flex flex-col">
        <div className="flex justify-between items-center text-xs text-gray-400 mb-2">
          <span>{article.pubDate ? new Date(article.pubDate).toLocaleDateString() : 'Recent'}</span>
          <span className="truncate ml-2">{article.creator ? article.creator[0] : 'Unknown'}</span>
        </div>
        <h3 className="text-lg font-semibold text-white mb-2 line-clamp-2 leading-tight group-hover:text-neon-purple transition-colors">
          {article.title}
        </h3>
        <p className="text-gray-400 text-sm mb-4 line-clamp-3 flex-1">
          {article.description || 'No description available for this article.'}
        </p>
        <a 
          href={article.link} 
          target="_blank" 
          rel="noopener noreferrer"
          className="mt-auto inline-block text-center w-full bg-white/5 hover:bg-neon-purple text-white py-2 rounded-lg transition-colors border border-white/10 hover:border-neon-purple font-medium text-sm"
        >
          Read More
        </a>
      </div>
    </motion.div>
  );
};

export default NewsCard;
