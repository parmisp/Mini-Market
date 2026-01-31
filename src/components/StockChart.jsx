import React from 'react';

const StockChart = ({ history = [], trend = 'up', compact = true }) => {
  // Use history data if available, otherwise generate sample data
  const data = history.length > 0 ? history : (() => {
    const points = [];
    const baseValue = 50;
    const trendModifier = trend === 'up' ? 1 : -1;
    
    for (let i = 0; i < 20; i++) {
      const noise = Math.random() * 10 - 5;
      const trendValue = (i / 20) * 30 * trendModifier;
      points.push(baseValue + trendValue + noise);
    }
    return points;
  })();

  const { width, height } = compact ? { width: 120, height: 50 } : { width: 600, height: 300 };
  const padding = compact ? 5 : 20;
  
  // Calculate min/max for scaling
  const minValue = Math.min(...data);
  const maxValue = Math.max(...data);
  const range = maxValue - minValue || 1; 
  
  // Create path for line chart
  const createPath = () => {
    const xStep = (width - padding * 2) / (data.length - 1);
    const points = data.map((value, index) => {
      const x = padding + index * xStep;
      const y = height - padding - ((value - minValue) / range) * (height - padding * 2);
      return `${x},${y}`;
    });
    return `M ${points.join(' L ')}`;
  };

  const pathD = createPath();
  const lineColor = trend === 'up' ? '#10B981' : '#EF4444'; // Game success/danger colors

  return (
    <svg 
      width={width} 
      height={height} 
      viewBox={`0 0 ${width} ${height}`}
      className={`${compact ? '' : 'w-full h-auto'}`}
    >
      <defs>
        {/* Glow effect for the line */}
        <filter id="glow">
          <feGaussianBlur stdDeviation="2" result="coloredBlur"/>
          <feMerge>
            <feMergeNode in="coloredBlur"/>
            <feMergeNode in="SourceGraphic"/>
          </feMerge>
        </filter>
        
        {/* Gradient for area under curve */}
        <linearGradient id="areaGradient" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" style={{ stopColor: lineColor, stopOpacity: 0.3 }} />
          <stop offset="100%" style={{ stopColor: lineColor, stopOpacity: 0 }} />
        </linearGradient>
      </defs>
      
      {!compact && [...Array(5)].map((_, i) => (
        <line
          key={i}
          x1={padding}
          y1={padding + (i * (height - padding * 2) / 4)}
          x2={width - padding}
          y2={padding + (i * (height - padding * 2) / 4)}
          stroke="rgba(148, 163, 184, 0.1)"
          strokeWidth="1"
        />
      ))}
      
      {/* Area under curve */}
      <path
        d={`${pathD} L ${width - padding},${height - padding} L ${padding},${height - padding} Z`}
        fill="url(#areaGradient)"
      />
      
      {/* Main line */}
      <path
        d={pathD}
        fill="none"
        stroke={lineColor}
        strokeWidth={compact ? 3 : 2}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      
      {!compact && (
        <>
          <text x={padding} y={height - 5} fill="rgba(148, 163, 184, 0.6)" fontSize="10" textAnchor="start">0h</text>
          <text x={width / 2} y={height - 5} fill="rgba(148, 163, 184, 0.6)" fontSize="10" textAnchor="middle">12h</text>
          <text x={width - padding} y={height - 5} fill="rgba(148, 163, 184, 0.6)" fontSize="10" textAnchor="end">24h</text>
        </>
      )}
    </svg>
  );
};

export default StockChart;
