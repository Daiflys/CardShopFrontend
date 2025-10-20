import React from 'react';

export interface LogoProps {
  className?: string;
}

const Logo: React.FC<LogoProps> = ({ className = "w-8 h-8" }) => {
  return (
    <div className="flex items-center gap-2">
      {/* Logo SVG - 3 cards stacked */}
      <svg
        className={className}
        viewBox="0 0 32 32"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        {/* Back card */}
        <rect
          x="4"
          y="8"
          width="12"
          height="16"
          rx="1.5"
          fill="currentColor"
          opacity="0.4"
        />

        {/* Middle card */}
        <rect
          x="8"
          y="6"
          width="12"
          height="16"
          rx="1.5"
          fill="currentColor"
          opacity="0.7"
        />

        {/* Front card */}
        <rect
          x="12"
          y="4"
          width="12"
          height="16"
          rx="1.5"
          fill="currentColor"
        />

        {/* Small detail on front card */}
        <circle
          cx="18"
          cy="8"
          r="1.5"
          fill="white"
          opacity="0.8"
        />
      </svg>

      {/* Text */}
      <span className="text-xl font-bold">
        My TCG Shop
      </span>
    </div>
  );
};

export default Logo;
