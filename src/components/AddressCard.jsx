// src/components/AddressCard.jsx
import React, { useState } from 'react';
import Button from '../design/components/Button';

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
            <Button
              variant="danger"
              size="sm"
              onClick={confirmDelete}
              disabled={isDeleting}
            >
              {isDeleting ? 'Deleting...' : 'Yes, delete'}
            </Button>
            <Button
              variant="secondary"
              size="sm"
              onClick={cancelDelete}
              disabled={isDeleting}
            >
              Cancel
            </Button>
          </div>
        </div>
      ) : (
        <div className="flex flex-wrap gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => onEdit(address)}
            className="text-blue-700 hover:text-blue-800 border-blue-700 hover:border-blue-800"
          >
            Edit
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={handleDelete}
            className="text-red-600 hover:text-red-700 border-red-600 hover:border-red-700"
          >
            Delete
          </Button>
          {!address.isPrimary && (
            <Button
              variant="outline"
              size="sm"
              onClick={() => onSetPrimary(address.id)}
              disabled={isSettingPrimary}
            >
              {isSettingPrimary ? 'Setting...' : 'Set as Primary'}
            </Button>
          )}
        </div>
      )}
    </div>
  );
};

export default AddressCard;
