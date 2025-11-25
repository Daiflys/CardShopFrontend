// src/components/CheckoutAddressForm.jsx
import React, { useState } from 'react';
import { validateAddress, commonCountries } from '../utils/addressValidation';
import Button from '../design/components/Button';

const CheckoutAddressForm = ({ onSubmit, onCancel, loading }) => {
  const [formData, setFormData] = useState({
    recipientName: '',
    street: '',
    additionalInfo: '',
    city: '',
    state: '',
    postalCode: '',
    country: '',
    phone: '',
  });

  const [saveForFuture, setSaveForFuture] = useState(true);
  const [errors, setErrors] = useState({});

  const handleChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[field];
        return newErrors;
      });
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    // Validate
    const validationErrors = validateAddress(formData);
    setErrors(validationErrors);

    if (Object.keys(validationErrors).length === 0) {
      // Clean up empty optional fields
      const cleanData = {
        recipientName: formData.recipientName,
        street: formData.street,
        city: formData.city,
        postalCode: formData.postalCode,
        country: formData.country,
        additionalInfo: formData.additionalInfo?.trim() || null,
        state: formData.state?.trim() || null,
        phone: formData.phone?.trim() || null,
      };
      onSubmit(cleanData, saveForFuture);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="md:col-span-2">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Recipient Name <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            value={formData.recipientName}
            onChange={(e) => handleChange('recipientName', e.target.value)}
            className={`w-full border rounded px-3 py-2 ${
              errors.recipientName ? 'border-red-500' : 'border-gray-300'
            }`}
            placeholder="Full name"
            disabled={loading}
          />
          {errors.recipientName && (
            <p className="text-red-600 text-xs mt-1">{errors.recipientName}</p>
          )}
        </div>

        <div className="md:col-span-2">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Street Address <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            value={formData.street}
            onChange={(e) => handleChange('street', e.target.value)}
            className={`w-full border rounded px-3 py-2 ${
              errors.street ? 'border-red-500' : 'border-gray-300'
            }`}
            placeholder="123 Main Street"
            disabled={loading}
          />
          {errors.street && (
            <p className="text-red-600 text-xs mt-1">{errors.street}</p>
          )}
        </div>

        <div className="md:col-span-2">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Apartment, floor, etc. <span className="text-gray-500 text-xs">(Optional)</span>
          </label>
          <input
            type="text"
            value={formData.additionalInfo}
            onChange={(e) => handleChange('additionalInfo', e.target.value)}
            className="w-full border rounded px-3 py-2 border-gray-300"
            placeholder="Apartment 4B"
            disabled={loading}
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            City <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            value={formData.city}
            onChange={(e) => handleChange('city', e.target.value)}
            className={`w-full border rounded px-3 py-2 ${
              errors.city ? 'border-red-500' : 'border-gray-300'
            }`}
            placeholder="City"
            disabled={loading}
          />
          {errors.city && (
            <p className="text-red-600 text-xs mt-1">{errors.city}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            State/Province <span className="text-gray-500 text-xs">(Optional)</span>
          </label>
          <input
            type="text"
            value={formData.state}
            onChange={(e) => handleChange('state', e.target.value)}
            className="w-full border rounded px-3 py-2 border-gray-300"
            placeholder="State"
            disabled={loading}
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Postal Code <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            value={formData.postalCode}
            onChange={(e) => handleChange('postalCode', e.target.value)}
            className={`w-full border rounded px-3 py-2 ${
              errors.postalCode ? 'border-red-500' : 'border-gray-300'
            }`}
            placeholder="12345"
            disabled={loading}
          />
          {errors.postalCode && (
            <p className="text-red-600 text-xs mt-1">{errors.postalCode}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Country <span className="text-red-500">*</span>
          </label>
          <select
            value={formData.country}
            onChange={(e) => handleChange('country', e.target.value)}
            className={`w-full border rounded px-3 py-2 ${
              errors.country ? 'border-red-500' : 'border-gray-300'
            }`}
            disabled={loading}
          >
            <option value="">Select a country</option>
            {commonCountries.map(country => (
              <option key={country} value={country}>{country}</option>
            ))}
          </select>
          {errors.country && (
            <p className="text-red-600 text-xs mt-1">{errors.country}</p>
          )}
        </div>

        <div className="md:col-span-2">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Phone <span className="text-gray-500 text-xs">(Optional)</span>
          </label>
          <input
            type="tel"
            value={formData.phone}
            onChange={(e) => handleChange('phone', e.target.value)}
            className={`w-full border rounded px-3 py-2 ${
              errors.phone ? 'border-red-500' : 'border-gray-300'
            }`}
            placeholder="+1 234 567-8900"
            disabled={loading}
          />
          {errors.phone && (
            <p className="text-red-600 text-xs mt-1">{errors.phone}</p>
          )}
        </div>
      </div>

      <div className="flex items-center gap-2 pt-2">
        <input
          type="checkbox"
          id="saveAddress"
          checked={saveForFuture}
          onChange={(e) => setSaveForFuture(e.target.checked)}
          className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
          disabled={loading}
        />
        <label htmlFor="saveAddress" className="text-sm text-gray-700">
          Save this address for future orders
        </label>
      </div>

      <div className="flex items-center justify-end gap-3 pt-4 border-t">
        <Button
          type="button"
          variant="ghost"
          onClick={onCancel}
          disabled={loading}
        >
          Cancel
        </Button>
        <Button
          type="submit"
          variant="primary"
          disabled={loading}
        >
          {loading ? 'Saving...' : 'Use This Address'}
        </Button>
      </div>
    </form>
  );
};

export default CheckoutAddressForm;
