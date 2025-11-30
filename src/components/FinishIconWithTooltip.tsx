import React from 'react';
import Tooltip from './Tooltip';
import { getFinishIcon, getFinishName } from '../utils/cardFinishes';

export interface FinishIconWithTooltipProps {
  finishCode: string;
  tooltipClassName?: string;
  className?: string;
}

/**
 * Finish icon component with automatic tooltip showing full finish name
 * Example: "⭐" icon shows "Foil" on hover, "⚡" shows "Etched"
 *
 * This is the standard way to display finish icons across the app.
 */
const FinishIconWithTooltip: React.FC<FinishIconWithTooltipProps> = ({
  finishCode,
  tooltipClassName,
  className = ''
}) => {
  const finishName = getFinishName(finishCode);
  const finishIcon = getFinishIcon(finishCode);

  // If there's no icon (nonfoil), just show a dash without tooltip
  if (!finishIcon || finishIcon === '') {
    return <span className={`text-sm text-gray-400 ${className}`}>-</span>;
  }

  return (
    <Tooltip content={finishName} className={tooltipClassName}>
      <span className={`text-sm font-medium text-gray-700 ${className}`}>
        {finishIcon}
      </span>
    </Tooltip>
  );
};

export default FinishIconWithTooltip;
