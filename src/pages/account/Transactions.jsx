import React, { useState, useEffect } from "react";
import { getUserPurchases } from "../../api/accountInfo";
import ConditionIcon from "../../components/ConditionIcon";
import PurchaseStatusBadge from "../../components/PurchaseStatusBadge";
import Button from "../../design/components/Button";

const Transactions = () => {
  const [purchases, setPurchases] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 1,
    totalItems: 0,
    hasNext: false,
    hasPrev: false
  });
  const [itemsPerPage] = useState(10);

  // Helper function to group transactions
  const groupTransactions = (transactionsList) => {
    // Ensure we have an array to work with
    const transactions = Array.isArray(transactionsList) ? transactionsList : 
                        (transactionsList?.data && Array.isArray(transactionsList.data)) ? transactionsList.data : [];
    
    return transactions.reduce((acc, purchase) => {
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

  // Helper function to render transaction section
  const renderTransactionSection = (transactions, sectionTitle) => {
    return (
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h3 className="text-lg font-semibold text-blue-900">
            {sectionTitle}
          </h3>
        </div>
        {transactions.length === 0 ? (
          <div className="text-gray-600 text-sm bg-gray-50 p-6 rounded-lg text-center">
            No purchases found for this period.
          </div>
        ) : (
          transactions.map(transaction => (
            <div key={transaction.transaction_id || transaction.id} className="bg-white border border-gray-200 rounded-lg shadow-sm overflow-hidden">
              {/* Transaction Header */}
              <div className="bg-blue-50 border-blue-100 px-6 py-4 border-b">
                <div className="flex justify-between items-center">
                  <div className="flex items-center space-x-4">
                    <div className="flex items-center space-x-2">
                      <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                      </svg>
                      <span className="font-semibold text-blue-900">
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
                        <div className="flex items-center gap-2 mb-1">
                          <div className="font-medium text-gray-900">
                            Card ID: {purchase.cardId}
                          </div>
                          {purchase.status && (
                            <PurchaseStatusBadge status={purchase.status} size="sm" />
                          )}
                        </div>
                        <div className="text-sm text-gray-500">
                          Purchase ID: {purchase.id}
                        </div>
                        <div className="flex items-center space-x-2 mt-1">
                          <span className="text-sm text-gray-600">
                            Qty: {purchase.quantity}
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

  const loadTransactions = async (page = 1) => {
    setLoading(true);
    try {
      const response = await getUserPurchases(page, itemsPerPage);
      console.log("📊 Purchases data received:", response);

      // Handle PageResponse structure
      const purchasesList = response.content || [];
      const totalPages = response.totalPages || 1;
      const totalItems = response.totalElements || 0;

      setPurchases(purchasesList);
      setPagination({
        currentPage: page,
        totalPages: totalPages,
        totalItems: totalItems,
        hasNext: page < totalPages,
        hasPrev: page > 1
      });
    } catch (err) {
      console.error("❌ Error loading purchases:", err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handlePageChange = (newPage) => {
    setCurrentPage(newPage);
    loadTransactions(newPage);
  };

  useEffect(() => {
    loadTransactions(1);
  }, []);


  if (loading) {
    return <div className="text-center">Loading transactions...</div>;
  }

  if (error) {
    return <div className="text-center text-red-600">Error: {error}</div>;
  }

  const renderPagination = () => {
    if (pagination.totalPages <= 1) return null;

    const pages = [];
    const maxVisiblePages = 5;
    let startPage = Math.max(1, pagination.currentPage - Math.floor(maxVisiblePages / 2));
    let endPage = Math.min(pagination.totalPages, startPage + maxVisiblePages - 1);

    if (endPage - startPage + 1 < maxVisiblePages) {
      startPage = Math.max(1, endPage - maxVisiblePages + 1);
    }

    for (let i = startPage; i <= endPage; i++) {
      pages.push(i);
    }

    return (
      <div className="flex justify-between items-center mt-6 p-4 bg-gray-50 rounded-lg">
        <div className="text-sm text-gray-600">
          Showing {((pagination.currentPage - 1) * itemsPerPage) + 1} to {Math.min(pagination.currentPage * itemsPerPage, pagination.totalItems)} of {pagination.totalItems} purchases
        </div>
        <div className="flex items-center space-x-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => handlePageChange(pagination.currentPage - 1)}
            disabled={!pagination.hasPrev}
          >
            Previous
          </Button>
          {pages.map(page => (
            <Button
              key={page}
              variant="outline"
              size="sm"
              active={page === pagination.currentPage}
              onClick={() => handlePageChange(page)}
            >
              {page}
            </Button>
          ))}
          <Button
            variant="outline"
            size="sm"
            onClick={() => handlePageChange(pagination.currentPage + 1)}
            disabled={!pagination.hasNext}
          >
            Next
          </Button>
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-8">
      <h2 className="text-xl font-semibold text-gray-900">My Purchases</h2>

      {/* No transactions message */}
      {groupedPurchases.length === 0 ? (
        <div className="text-gray-600 text-sm bg-gray-50 p-6 rounded-lg text-center">
          No purchases found for this period.
        </div>
      ) : (
        <div className="space-y-8">
          {/* Purchases Section */}
          <div>
            {renderTransactionSection(groupedPurchases, "Purchases")}
            {renderPagination()}
          </div>
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
        <Button variant="primary" className="mt-4">
          Apply Filters
        </Button>
      </div>
    </div>
  );
};

export default Transactions;