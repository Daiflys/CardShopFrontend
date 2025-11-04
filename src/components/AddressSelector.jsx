// src/components/AddressSelector.jsx
import React, { useEffect } from 'react';
import useAddressStore from '../store/addressStore';
import Button from '../design/components/Button';

const AddressSelector = ({ selectedAddressId, onSelectAddress, onAddNew }) => {
  const { addresses, loading, error, loadAddresses } = useAddressStore();

  useEffect(() => {
    loadAddresses();
  }, [loadAddresses]);

  useEffect(() => {
    // Auto-select primary address if no address is selected
    if (addresses.length > 0 && !selectedAddressId) {
      const primary = addresses.find(addr => addr.isPrimary);
      if (primary) {
        onSelectAddress(primary.id);
      }
    }
  }, [addresses, selectedAddressId, onSelectAddress]);

  if (loading) {
    return (
      <div className="text-center py-8">
        <div className="inline-block animate-spin rounded-full h-6 w-6 border-b-2 border-blue-700"></div>
        <p className="text-gray-600 mt-2 text-sm">Loading addresses...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-4">
        <p className="text-sm text-red-800">{error}</p>
      </div>
    );
  }

  if (addresses.length === 0) {
    return (
      <div className="bg-gray-50 rounded-lg border-2 border-dashed border-gray-300 p-6 text-center">
        <svg className="w-12 h-12 text-gray-400 mx-auto mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
        </svg>
        <p className="text-gray-700 mb-3">No saved addresses found</p>
        <Button
          variant="link"
          onClick={onAddNew}
        >
          Add a new address
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {addresses.map((address) => (
        <label
          key={address.id}
          className={`flex items-start gap-3 p-4 border-2 rounded-lg cursor-pointer transition-all ${
            selectedAddressId === address.id
              ? 'border-blue-600 bg-blue-50'
              : 'border-gray-200 hover:border-gray-300'
          }`}
        >
          <input
            type="radio"
            name="shippingAddress"
            value={address.id}
            checked={selectedAddressId === address.id}
            onChange={() => onSelectAddress(address.id)}
            className="mt-1 h-4 w-4 text-blue-600 focus:ring-blue-500"
          />
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-1">
              <span className="font-semibold text-gray-900">{address.recipientName}</span>
              {address.isPrimary && (
                <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-blue-100 text-blue-800">
                  PRIMARY
                </span>
              )}
            </div>
            <div className="text-sm text-gray-700 space-y-0.5">
              <p>{address.street}</p>
              {address.additionalInfo && <p className="text-gray-600">{address.additionalInfo}</p>}
              <p>
                {address.city}
                {address.state && `, ${address.state}`} {address.postalCode}
              </p>
              <p>{address.country}</p>
              {address.phone && (
                <p className="text-gray-600 mt-1">{address.phone}</p>
              )}
            </div>
          </div>
        </label>
      ))}

      <Button
        variant="outline"
        onClick={onAddNew}
        className="w-full flex items-center justify-center gap-2 border-2 border-dashed hover:border-blue-600 hover:text-blue-700"
      >
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
        </svg>
        Use a different address
      </Button>
    </div>
  );
};

export default AddressSelector;
