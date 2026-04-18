import React from 'react';
import PropTypes from 'prop-types';

export function CircularProgress({ progress, size = 120, strokeWidth = 10, color = "#ccff00" }) {
  const radius = (size - strokeWidth) / 2;
  const circumference = radius * 2 * Math.PI;
  const offset = circumference - (progress / 100) * circumference;

  return (
    <div className="relative flex justify-center items-center" style={{ width: size, height: size }}>
      <svg width={size} height={size} className="transform -rotate-90">
        {/* Background circle */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke="rgba(255,255,255,0.1)"
          strokeWidth={strokeWidth}
          fill="transparent"
        />
        {/* Progress circle */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke={progress >= 100 ? '#22c55e' : color}
          strokeWidth={strokeWidth}
          fill="transparent"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          strokeLinecap="round"
          className="transition-all duration-500 ease-out"
          style={{ filter: `drop-shadow(0 0 6px ${progress >= 100 ? '#22c55e' : color})` }}
        />
      </svg>
      <div className="absolute flex flex-col items-center justify-center text-center">
        <span className="text-2xl font-bold text-white">
          {progress}%
        </span>
      </div>
    </div>
  );
}

CircularProgress.propTypes = {
  progress: PropTypes.number.isRequired,
  size: PropTypes.number,
  strokeWidth: PropTypes.number,
  color: PropTypes.string,
};
