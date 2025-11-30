import React, { useState, ReactNode } from 'react';

export interface TooltipProps {
  content: string;
  children: ReactNode;
  className?: string;
}

/**
 * Reusable Tooltip component that shows content on hover
 * Used across the app for condition icons, language flags, finish icons, etc.
 */
const Tooltip: React.FC<TooltipProps> = ({ content, children, className = '' }) => {
  const [isVisible, setIsVisible] = useState(false);

  return (
    <div
      className={`relative inline-flex ${className}`}
      onMouseEnter={() => setIsVisible(true)}
      onMouseLeave={() => setIsVisible(false)}
    >
      {children}
      {isVisible && (
        <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-2 py-1 bg-gray-900 text-white text-xs rounded whitespace-nowrap z-50 pointer-events-none">
          {content}
          {/* Triangle pointer */}
          <div className="absolute top-full left-1/2 transform -translate-x-1/2 border-4 border-transparent border-t-gray-900"></div>
        </div>
      )}
    </div>
  );
};

export default Tooltip;
