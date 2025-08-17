import React from "react";

const Transactions = () => {
  return (
    <div className="space-y-4">
      <h2 className="text-xl font-semibold text-gray-900">Transactions</h2>
      <div className="text-gray-600 text-sm">No transactions for this period.</div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="md:col-span-1">
          <label className="block text-sm font-medium text-gray-700 mb-1">Date range</label>
          <select className="w-full border rounded px-3 py-2">
            <option>Current month</option>
            <option>Last 30 days</option>
            <option>Last 90 days</option>
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">From</label>
          <input type="date" className="w-full border rounded px-3 py-2" />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">To</label>
          <input type="date" className="w-full border rounded px-3 py-2" />
        </div>
      </div>
      <button className="px-4 py-2 border rounded hover:bg-gray-50">Filter</button>
    </div>
  );
};

export default Transactions;


