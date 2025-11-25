// src/components/AddressFormModal.jsx
import React from 'react';
import AddressForm from './AddressForm';
import useAddressStore from '../store/addressStore';
import Button from '../design/components/Button';

const AddressFormModal = ({ isOpen, mode, address, onClose }) => {
  const { addAddress, editAddress, loading } = useAddressStore();

  const handleSubmit = async (formData) => {
    let result;
    if (mode === 'edit' && address) {
      result = await editAddress(address.id, formData);
    } else {
      result = await addAddress(formData);
    }

    if (result.success) {
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-white border-b px-6 py-4 flex items-center justify-between">
          <h2 className="text-xl font-semibold text-gray-900">
            {mode === 'edit' ? 'Edit Address' : 'Add New Address'}
          </h2>
          <Button
            variant="ghost"
            onClick={onClose}
            disabled={loading}
            className="text-gray-400 hover:text-gray-600"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </Button>
        </div>

        <div className="px-6 py-4">
          <AddressForm
            address={address}
            onSubmit={handleSubmit}
            onCancel={onClose}
            loading={loading}
          />
        </div>
      </div>
    </div>
  );
};

export default AddressFormModal;
