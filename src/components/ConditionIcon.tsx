import React from 'react';
import { conditionOptions } from '../utils/cardConditions.ts';

export type ConditionIconSize = 'xs' | 'sm' | 'md';

export interface ConditionIconProps {
  condition: string;
  showName?: boolean;
  size?: ConditionIconSize;
}

const ConditionIcon: React.FC<ConditionIconProps> = ({
  condition,
  showName = false,
  size = "sm"
}) => {
  const conditionData = conditionOptions.find(opt => opt.code === condition);

  if (!conditionData) {
    return showName ? (
      <span className="text-gray-500 text-xs">Unknown</span>
    ) : (
      <span className="inline-block px-2 py-1 rounded bg-gray-400 text-white text-xs font-bold">
        ??
      </span>
    );
  }

  const sizeClasses: Record<ConditionIconSize, string> = {
    xs: "px-2 py-1 text-xs w-9 text-center",
    sm: "px-2 py-1 text-xs w-10 text-center",
    md: "px-3 py-1 text-sm w-12 text-center"
  };

  return (
    <div className="flex items-center">
      <span className={`inline-block rounded text-white font-bold mr-2 ${conditionData.color} ${sizeClasses[size]}`}>
        {conditionData.code}
      </span>
      {showName && <span className="text-sm">{conditionData.name}</span>}
    </div>
  );
};

export default ConditionIcon;
