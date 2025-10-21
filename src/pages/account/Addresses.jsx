// src/pages/account/Addresses.jsx
import React, { useEffect, useState } from 'react';
import useAddressStore from '../../store/addressStore';
import AddressCard from '../../components/AddressCard';
import AddressFormModal from '../../components/AddressFormModal';

const Addresses = () => {
  const {
    addresses,
    loading,
    error,
    loadAddresses,
    removeAddress,
    markAsPrimary,
    canAddMoreAddresses,
    getAddressCount,
  } = useAddressStore();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState('create');
  const [selectedAddress, setSelectedAddress] = useState(null);
  const [actionLoading, setActionLoading] = useState({ id: null, action: null });

  useEffect(() => {
    loadAddresses();
  }, [loadAddresses]);

  const handleAddNew = () => {
    setModalMode('create');
    setSelectedAddress(null);
    setIsModalOpen(true);
  };

  const handleEdit = (address) => {
    setModalMode('edit');
    setSelectedAddress(address);
    setIsModalOpen(true);
  };

  const handleDelete = async (id) => {
    setActionLoading({ id, action: 'delete' });
    try {
      await removeAddress(id);
    } finally {
      setActionLoading({ id: null, action: null });
    }
  };

  const handleSetPrimary = async (id) => {
    setActionLoading({ id, action: 'setPrimary' });
    try {
      await markAsPrimary(id);
    } finally {
      setActionLoading({ id: null, action: null });
    }
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedAddress(null);
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-lg font-semibold text-gray-900">Shipping Addresses</h2>
          <p className="text-sm text-gray-600 mt-1">
            Manage your shipping addresses ({getAddressCount()}/5)
          </p>
        </div>
        <button
          onClick={handleAddNew}
          disabled={!canAddMoreAddresses() || loading}
          className="bg-blue-700 hover:bg-blue-800 text-white px-4 py-2 rounded font-medium disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          Add Address
        </button>
      </div>

      {!canAddMoreAddresses() && (
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-4">
          <p className="text-sm text-yellow-800">
            You have reached the maximum limit of 5 addresses. Please delete an existing address to add a new one.
          </p>
        </div>
      )}

      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-4">
          <p className="text-sm text-red-800">{error}</p>
        </div>
      )}

      {loading && addresses.length === 0 ? (
        <div className="text-center py-12">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-700"></div>
          <p className="text-gray-600 mt-2">Loading addresses...</p>
        </div>
      ) : addresses.length === 0 ? (
        <div className="text-center py-12 bg-gray-50 rounded-lg border-2 border-dashed border-gray-300">
          <svg className="w-16 h-16 text-gray-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
          </svg>
          <h3 className="text-lg font-medium text-gray-900 mb-2">No addresses yet</h3>
          <p className="text-gray-600 mb-4">Add your first shipping address to get started</p>
          <button
            onClick={handleAddNew}
            className="bg-blue-700 hover:bg-blue-800 text-white px-4 py-2 rounded font-medium inline-flex items-center gap-2"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            Add Your First Address
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {addresses.map((address) => (
            <AddressCard
              key={address.id}
              address={address}
              onEdit={handleEdit}
              onDelete={handleDelete}
              onSetPrimary={handleSetPrimary}
              isDeleting={actionLoading.id === address.id && actionLoading.action === 'delete'}
              isSettingPrimary={actionLoading.id === address.id && actionLoading.action === 'setPrimary'}
            />
          ))}
        </div>
      )}

      <AddressFormModal
        isOpen={isModalOpen}
        mode={modalMode}
        address={selectedAddress}
        onClose={handleCloseModal}
      />
    </div>
  );
};

export default Addresses;
