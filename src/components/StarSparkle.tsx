import React from 'react';

interface StarSparkleProps {
  className?: string;
  size?: number;
}

export const StarSparkle: React.FC<StarSparkleProps> = ({ className = 'text-indigo-600', size = 28 }) => {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 40 40"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      {/* 8-pointed crystal star insignia matching the reference design */}
      <path
        d="M20 2L23.5 14L35.5 10L27 19.5L38 20L27 23.5L35.5 33L23.5 29L20 41L16.5 29L4.5 33L13 23.5L2 20L13 16.5L4.5 7L16.5 11L20 2Z"
        fill="currentColor"
        opacity="0.15"
      />
      <path
        d="M20 4L22.8 15.2L34 12L25.8 20L34 28L22.8 24.8L20 36L17.2 24.8L6 28L14.2 20L6 12L17.2 15.2L20 4Z"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinejoin="round"
      />
      <circle cx="20" cy="20" r="2.5" fill="currentColor" />
    </svg>
  );
};

export const MiniSparkle: React.FC<{ className?: string; size?: number }> = ({ className = 'text-indigo-400', size = 16 }) => {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="currentColor"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      <path d="M12 0L14.2 8.8L23 11L14.2 13.2L12 22L9.8 13.2L1 11L9.8 8.8L12 0Z" />
    </svg>
  );
};
