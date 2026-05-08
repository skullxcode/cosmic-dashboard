import React, { useMemo } from 'react';
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, Legend } from 'recharts';

const COLORS = ['#00f3ff', '#bc13fe', '#4ade80', '#facc15', '#f87171', '#818cf8'];

const CustomTooltip = ({ active, payload }) => {
  if (active && payload && payload.length) {
    return (
      <div className="glass-panel p-3 border-white/20 text-sm text-white">
        <p className="font-bold mb-1">{payload[0].name}</p>
        <p>{`${payload[0].value} Article(s)`}</p>
      </div>
    );
  }
  return null;
};

const NewsDoughnutChart = ({ news }) => {
  const data = useMemo(() => {
    if (!news || news.length === 0) return [];
    
    const sourceCount = {};
    news.forEach(article => {
      // NewsData.io sometimes uses source_id
      const source = article.source_id || 'Unknown';
      sourceCount[source] = (sourceCount[source] || 0) + 1;
    });

    return Object.keys(sourceCount).map(key => ({
      name: key,
      value: sourceCount[key]
    })).sort((a, b) => b.value - a.value).slice(0, 5); // Top 5
  }, [news]);

  if (data.length === 0) {
    return (
      <div className="w-full h-full flex items-center justify-center text-gray-400">
        No news data available.
      </div>
    );
  }

  return (
    <div className="w-full h-full min-h-[250px] relative">
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            innerRadius={60}
            outerRadius={80}
            paddingAngle={5}
            dataKey="value"
            stroke="none"
          >
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
            ))}
          </Pie>
          <Tooltip content={<CustomTooltip />} />
          <Legend 
            verticalAlign="bottom" 
            height={36} 
            iconType="circle"
            wrapperStyle={{ fontSize: '12px', paddingTop: '20px' }}
          />
        </PieChart>
      </ResponsiveContainer>
      {/* Center Text */}
      <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none pb-8">
        <span className="text-2xl font-bold text-white">{news.length}</span>
        <span className="text-xs text-gray-400 uppercase tracking-wider">Total</span>
      </div>
    </div>
  );
};

export default NewsDoughnutChart;
