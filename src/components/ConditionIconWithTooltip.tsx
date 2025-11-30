import React from 'react';
import ConditionIcon, { ConditionIconProps } from './ConditionIcon';
import Tooltip from './Tooltip';
import { getConditionName } from '../utils/cardConditions';

export interface ConditionIconWithTooltipProps extends ConditionIconProps {
  tooltipClassName?: string;
}

/**
 * ConditionIcon component with automatic tooltip showing full condition name
 * Example: "NM" icon shows "Near Mint" on hover
 *
 * This is the standard way to display condition icons across the app.
 */
const ConditionIconWithTooltip: React.FC<ConditionIconWithTooltipProps> = ({
  condition,
  showName = false,
  size = "sm",
  tooltipClassName
}) => {
  const conditionName = getConditionName(condition);

  return (
    <Tooltip content={conditionName} className={tooltipClassName}>
      <ConditionIcon condition={condition} showName={showName} size={size} />
    </Tooltip>
  );
};

export default ConditionIconWithTooltip;
