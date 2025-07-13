import React from "react";

const ProductCard = ({ id, name, image }) => (
  <div className="bg-white rounded-lg shadow p-3 flex flex-col items-center min-w-[140px] max-w-[160px]">
    <div className="w-24 h-32 flex items-center justify-center mb-2">
      <img src={image} alt={name} className="object-contain h-full w-full" />
    </div>
    <span className="text-lg font-bold text-blue-800 mb-1">{id}</span>
    <span className="text-sm text-gray-700 text-center">{name}</span>
  </div>
);

export default ProductCard; 