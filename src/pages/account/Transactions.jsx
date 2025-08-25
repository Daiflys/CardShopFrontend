import React, { useState, useEffect } from "react";
import { getUserTransactions } from "../../api/accountInfo";
import ProductCard from "../../components/ProductCard";

const Transactions = () => {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    setLoading(true);
    getUserTransactions()
      .then(setTransactions)
      .catch(err => setError(err.message))
      .finally(() => setLoading(false));
  }, []);


  if (loading) {
    return <div className="text-center">Loading transactions...</div>;
  }

  if (error) {
    return <div className="text-center text-red-600">Error: {error}</div>;
  }

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
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {transactions.map(transaction => (
          <div key={transaction.card_id || transaction.id} className="border rounded p-4">
            {/* Reemplaza ProductCard con el contenido que necesites */}
            <div className="text-sm text-gray-600">
              Transaction ID: {transaction.card_id || transaction.id}
              Price: {transaction.price}
            </div>
            {/* Agrega más campos según la estructura de tus transacciones */}
          </div>
        ))}
      </div>
      <button className="px-4 py-2 border rounded hover:bg-gray-50">Filter</button>
    </div>
  );
};

export default Transactions;