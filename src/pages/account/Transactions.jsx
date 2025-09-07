import React, { useState, useEffect } from "react";
import { getUserTransactions } from "../../api/accountInfo";
import ConditionIcon from "../../components/ConditionIcon";

const Transactions = () => {
  const [purchases, setPurchases] = useState([]);
  const [sells, setSells] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Helper function to group transactions
  const groupTransactions = (transactionsList) => {
    return (transactionsList || []).reduce((acc, purchase) => {
      if (!purchase || !purchase.transactionId) {
        console.warn("Purchase sin transactionId:", purchase);
        return acc;
      }
      
      const transactionId = purchase.transactionId;
      if (!acc[transactionId]) {
        acc[transactionId] = {
          transaction_id: transactionId,
          purchase_date: purchase.purchaseDate,
          total_price: 0,
          purchases: []
        };
      }
      
      acc[transactionId].purchases.push(purchase);
      const price = Number(purchase.price || 0);
      acc[transactionId].total_price += price;
      return acc;
    }, {});
  };

  const groupedPurchases = Object.values(groupTransactions(purchases));
  const groupedSells = Object.values(groupTransactions(sells));

  // Calculate current month sales total
  const getCurrentMonthSalesTotal = () => {
    const currentDate = new Date();
    const currentYear = currentDate.getFullYear();
    const currentMonth = currentDate.getMonth();

    return sells.filter(sale => {
      if (!sale.purchaseDate) return false;
      const saleDate = new Date(sale.purchaseDate);
      return saleDate.getFullYear() === currentYear && saleDate.getMonth() === currentMonth;
    }).reduce((total, sale) => {
      return total + (Number(sale.price) || 0);
    }, 0);
  };

  const currentMonthSalesTotal = getCurrentMonthSalesTotal();

  // Helper function to render transaction section
  const renderTransactionSection = (transactions, sectionTitle, sectionType) => {
    const headerBgColor = sectionType === 'purchase' ? 'bg-blue-50 border-blue-100' : 'bg-indigo-50 border-indigo-100';
    const titleColor = sectionType === 'purchase' ? 'text-blue-900' : 'text-indigo-900';
    const iconColor = sectionType === 'purchase' ? 'text-blue-600' : 'text-indigo-600';

    return (
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h3 className={`text-lg font-semibold ${sectionType === 'purchase' ? 'text-blue-900' : 'text-indigo-900'}`}>
            {sectionTitle}
          </h3>
          {sectionType === 'sold' && (
            <div className="text-right">
              <div className="text-sm text-gray-600">Current Month Sales</div>
              <div className="text-xl font-bold text-green-600">
                €{currentMonthSalesTotal.toFixed(2)}
              </div>
            </div>
          )}
        </div>
        {transactions.length === 0 ? (
          <div className="text-gray-600 text-sm bg-gray-50 p-6 rounded-lg text-center">
            No {sectionType === 'purchase' ? 'purchases' : 'sales'} found for this period.
          </div>
        ) : (
          transactions.map(transaction => (
            <div key={transaction.transaction_id || transaction.id} className="bg-white border border-gray-200 rounded-lg shadow-sm overflow-hidden">
              {/* Transaction Header */}
              <div className={`${headerBgColor} px-6 py-4 border-b`}>
                <div className="flex justify-between items-center">
                  <div className="flex items-center space-x-4">
                    <div className="flex items-center space-x-2">
                      <svg className={`w-5 h-5 ${iconColor}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                      </svg>
                      <span className={`font-semibold ${titleColor}`}>
                        Transaction #{transaction.transaction_id || transaction.id}
                      </span>
                    </div>
                    {transaction.purchase_date && (
                      <span className="text-sm text-gray-600">
                        {new Date(transaction.purchase_date).toLocaleDateString()}
                      </span>
                    )}
                  </div>
                  <div className="text-right">
                    <div className="text-lg font-bold text-green-600">
                      €{Number(transaction.total_price || 0).toFixed(2)}
                    </div>
                    <div className="text-sm text-gray-500">
                      {transaction.purchases.length} item(s)
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Transaction Items */}
              <div className="p-6">
                <div className="space-y-3">
                  {transaction.purchases.map((purchase, index) => (
                    <div key={purchase.id || index} className="flex items-center space-x-4 p-3 bg-gray-50 rounded-lg">
                      <div className="w-16 h-20 bg-white rounded flex items-center justify-center overflow-hidden shadow-sm">
                        <div className="text-center">
                          <svg className="w-8 h-8 text-gray-400 mx-auto mb-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                          </svg>
                          <span className="text-xs text-gray-400">Card</span>
                        </div>
                      </div>
                      <div className="flex-1">
                        <div className="font-medium text-gray-900">
                          Card ID: {purchase.cardId}
                        </div>
                        <div className="text-sm text-gray-500">
                          Purchase ID: {purchase.id}
                        </div>
                        <div className="flex items-center space-x-2 mt-1">
                          <span className="text-sm text-gray-600">
                            Qty: {purchase.quantity}
                          </span>
                          <span className="text-sm text-gray-600">
                            • {sectionType === 'purchase' ? 'Seller' : 'Buyer'}: {sectionType === 'purchase' ? purchase.sellerId : purchase.buyerId || purchase.sellerId}
                          </span>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="font-semibold text-gray-900">
                          €{Number(purchase.price || 0).toFixed(2)}
                        </div>
                        <div className="text-sm text-gray-500">
                          €{(Number(purchase.price || 0) / Number(purchase.quantity || 1)).toFixed(2)} each
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    );
  };

  useEffect(() => {
    setLoading(true);
    getUserTransactions()
      .then(data => {
        console.log("📊 Transactions data received:", data);
        setPurchases(data.purchases || []);
        setSells(data.sells || []);
      })
      .catch(err => {
        console.error("❌ Error loading transactions:", err);
        setError(err.message);
      })
      .finally(() => setLoading(false));
  }, []);


  if (loading) {
    return <div className="text-center">Loading transactions...</div>;
  }

  if (error) {
    return <div className="text-center text-red-600">Error: {error}</div>;
  }

  return (
    <div className="space-y-8">
      <h2 className="text-xl font-semibold text-gray-900">Transactions</h2>
      
      {/* No transactions message */}
      {groupedPurchases.length === 0 && groupedSells.length === 0 ? (
        <div className="text-gray-600 text-sm bg-gray-50 p-6 rounded-lg text-center">
          No transactions found for this period.
        </div>
      ) : (
        <div className="space-y-8">
          {/* Purchases Section */}
          {renderTransactionSection(groupedPurchases, "Purchases", "purchase")}
          
          {/* Sells Section */}
          {renderTransactionSection(groupedSells, "Sales", "sold")}
        </div>
      )}
      
      {/* Filters Section */}
      <div className="mt-8 p-6 bg-gray-50 rounded-lg">
        <h3 className="text-lg font-semibold mb-4">Filter Transactions</h3>
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
        <button className="mt-4 px-6 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors">
          Apply Filters
        </button>
      </div>
    </div>
  );
};

export default Transactions;