// src/components/AddressCard.jsx
import React, { useState } from 'react';

const AddressCard = ({ address, onEdit, onDelete, onSetPrimary, isDeleting, isSettingPrimary }) => {
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  const handleDelete = () => {
    setShowDeleteConfirm(true);
  };

  const confirmDelete = () => {
    onDelete(address.id);
    setShowDeleteConfirm(false);
  };

  const cancelDelete = () => {
    setShowDeleteConfirm(false);
  };

  return (
    <div className="bg-white rounded-lg border shadow-sm p-4 relative">
      {address.isPrimary && (
        <div className="absolute top-3 right-3">
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
            PRIMARY
          </span>
        </div>
      )}

      <div className="mb-3">
        <h3 className="font-semibold text-gray-900 text-lg">{address.recipientName}</h3>
      </div>

      <div className="space-y-1 text-sm text-gray-700 mb-4">
        <p>{address.street}</p>
        {address.additionalInfo && <p className="text-gray-600">{address.additionalInfo}</p>}
        <p>
          {address.city}
          {address.state && `, ${address.state}`} {address.postalCode}
        </p>
        <p>{address.country}</p>
        {address.phone && (
          <p className="flex items-center gap-1 mt-2">
            <svg className="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
            </svg>
            <span>{address.phone}</span>
          </p>
        )}
      </div>

      {showDeleteConfirm ? (
        <div className="bg-red-50 border border-red-200 rounded p-3 mb-3">
          <p className="text-sm text-red-800 mb-2">Are you sure you want to delete this address?</p>
          <div className="flex gap-2">
            <button
              onClick={confirmDelete}
              disabled={isDeleting}
              className="bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded text-sm disabled:opacity-50"
            >
              {isDeleting ? 'Deleting...' : 'Yes, delete'}
            </button>
            <button
              onClick={cancelDelete}
              disabled={isDeleting}
              className="bg-gray-200 hover:bg-gray-300 text-gray-800 px-3 py-1 rounded text-sm disabled:opacity-50"
            >
              Cancel
            </button>
          </div>
        </div>
      ) : (
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => onEdit(address)}
            className="text-blue-700 hover:text-blue-800 border border-blue-700 hover:border-blue-800 px-3 py-1.5 rounded text-sm font-medium transition-colors"
          >
            Edit
          </button>
          <button
            onClick={handleDelete}
            className="text-red-600 hover:text-red-700 border border-red-600 hover:border-red-700 px-3 py-1.5 rounded text-sm font-medium transition-colors"
          >
            Delete
          </button>
          {!address.isPrimary && (
            <button
              onClick={() => onSetPrimary(address.id)}
              disabled={isSettingPrimary}
              className="text-gray-700 hover:text-gray-900 border border-gray-300 hover:border-gray-400 px-3 py-1.5 rounded text-sm font-medium transition-colors disabled:opacity-50"
            >
              {isSettingPrimary ? 'Setting...' : 'Set as Primary'}
            </button>
          )}
        </div>
      )}
    </div>
  );
};

export default AddressCard;
