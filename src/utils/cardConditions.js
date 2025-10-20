// Card condition options utility - centralized definition

export const conditionOptions = [
  { code: "MT", name: "Mint", color: "bg-cyan-400" },
  { code: "NM", name: "Near Mint", color: "bg-green-500" },
  { code: "EX", name: "Excellent", color: "bg-yellow-600" },
  { code: "GD", name: "Good", color: "bg-yellow-500" },
  { code: "LP", name: "Light Played", color: "bg-orange-500" },
  { code: "PL", name: "Played", color: "bg-red-400" },
  { code: "PO", name: "Poor", color: "bg-red-600" }
];

export const getConditionName = (conditionCode) => {
  const condition = conditionOptions.find(opt => opt.code === conditionCode);
  return condition ? condition.name : 'Unknown';
};

export const getConditionColor = (conditionCode) => {
  const condition = conditionOptions.find(opt => opt.code === conditionCode);
  return condition ? condition.color : 'bg-gray-400';
};
