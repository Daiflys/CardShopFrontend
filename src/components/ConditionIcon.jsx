import React from 'react';

const conditionOptions = [
  { code: "MT", name: "Mint", color: "bg-cyan-400" },
  { code: "NM", name: "Near Mint", color: "bg-green-500" },
  { code: "EX", name: "Excellent", color: "bg-yellow-600" },
  { code: "GD", name: "Good", color: "bg-yellow-500" },
  { code: "LP", name: "Light Played", color: "bg-orange-500" },
  { code: "PL", name: "Played", color: "bg-red-400" },
  { code: "PO", name: "Poor", color: "bg-red-600" }
];

const ConditionIcon = ({ condition, showName = false, size = "sm" }) => {
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

  const sizeClasses = {
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