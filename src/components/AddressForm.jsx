// src/components/AddressForm.jsx
import React, { useState, useEffect } from 'react';
import { validateAddress, commonCountries } from '../utils/addressValidation';

const AddressForm = ({ address, onSubmit, onCancel, loading }) => {
  const [formData, setFormData] = useState({
    recipientName: address?.recipientName || '',
    street: address?.street || '',
    additionalInfo: address?.additionalInfo || '',
    city: address?.city || '',
    state: address?.state || '',
    postalCode: address?.postalCode || '',
    country: address?.country || '',
    phone: address?.phone || '',
  });

  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});

  useEffect(() => {
    if (address) {
      setFormData({
        recipientName: address.recipientName || '',
        street: address.street || '',
        additionalInfo: address.additionalInfo || '',
        city: address.city || '',
        state: address.state || '',
        postalCode: address.postalCode || '',
        country: address.country || '',
        phone: address.phone || '',
      });
    }
  }, [address]);

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

  const handleBlur = (field) => {
    setTouched(prev => ({ ...prev, [field]: true }));
    // Validate on blur
    const validationErrors = validateAddress(formData);
    if (validationErrors[field]) {
      setErrors(prev => ({ ...prev, [field]: validationErrors[field] }));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    // Mark all fields as touched
    const allTouched = Object.keys(formData).reduce((acc, key) => {
      acc[key] = true;
      return acc;
    }, {});
    setTouched(allTouched);

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
      onSubmit(cleanData);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {/* Recipient Name */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Recipient Name <span className="text-red-500">*</span>
        </label>
        <input
          type="text"
          value={formData.recipientName}
          onChange={(e) => handleChange('recipientName', e.target.value)}
          onBlur={() => handleBlur('recipientName')}
          className={`w-full border rounded px-3 py-2 ${
            touched.recipientName && errors.recipientName ? 'border-red-500' : 'border-gray-300'
          }`}
          placeholder="Full name"
          disabled={loading}
        />
        {touched.recipientName && errors.recipientName && (
          <p className="text-red-600 text-xs mt-1">{errors.recipientName}</p>
        )}
      </div>

      {/* Street Address */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Street Address <span className="text-red-500">*</span>
        </label>
        <input
          type="text"
          value={formData.street}
          onChange={(e) => handleChange('street', e.target.value)}
          onBlur={() => handleBlur('street')}
          className={`w-full border rounded px-3 py-2 ${
            touched.street && errors.street ? 'border-red-500' : 'border-gray-300'
          }`}
          placeholder="123 Main Street"
          disabled={loading}
        />
        {touched.street && errors.street && (
          <p className="text-red-600 text-xs mt-1">{errors.street}</p>
        )}
      </div>

      {/* Additional Info */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Additional Info <span className="text-gray-500 text-xs">(Optional)</span>
        </label>
        <input
          type="text"
          value={formData.additionalInfo}
          onChange={(e) => handleChange('additionalInfo', e.target.value)}
          onBlur={() => handleBlur('additionalInfo')}
          className={`w-full border rounded px-3 py-2 ${
            touched.additionalInfo && errors.additionalInfo ? 'border-red-500' : 'border-gray-300'
          }`}
          placeholder="Apartment, floor, building, etc."
          disabled={loading}
        />
        {touched.additionalInfo && errors.additionalInfo && (
          <p className="text-red-600 text-xs mt-1">{errors.additionalInfo}</p>
        )}
      </div>

      {/* City and State */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            City <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            value={formData.city}
            onChange={(e) => handleChange('city', e.target.value)}
            onBlur={() => handleBlur('city')}
            className={`w-full border rounded px-3 py-2 ${
              touched.city && errors.city ? 'border-red-500' : 'border-gray-300'
            }`}
            placeholder="City"
            disabled={loading}
          />
          {touched.city && errors.city && (
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
            onBlur={() => handleBlur('state')}
            className={`w-full border rounded px-3 py-2 ${
              touched.state && errors.state ? 'border-red-500' : 'border-gray-300'
            }`}
            placeholder="State or Province"
            disabled={loading}
          />
          {touched.state && errors.state && (
            <p className="text-red-600 text-xs mt-1">{errors.state}</p>
          )}
        </div>
      </div>

      {/* Postal Code and Country */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Postal Code <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            value={formData.postalCode}
            onChange={(e) => handleChange('postalCode', e.target.value)}
            onBlur={() => handleBlur('postalCode')}
            className={`w-full border rounded px-3 py-2 ${
              touched.postalCode && errors.postalCode ? 'border-red-500' : 'border-gray-300'
            }`}
            placeholder="12345"
            disabled={loading}
          />
          {touched.postalCode && errors.postalCode && (
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
            onBlur={() => handleBlur('country')}
            className={`w-full border rounded px-3 py-2 ${
              touched.country && errors.country ? 'border-red-500' : 'border-gray-300'
            }`}
            disabled={loading}
          >
            <option value="">Select a country</option>
            {commonCountries.map(country => (
              <option key={country} value={country}>{country}</option>
            ))}
            <option value="">---</option>
            <option value="other">Other (type below)</option>
          </select>
          {formData.country === 'other' && (
            <input
              type="text"
              onChange={(e) => handleChange('country', e.target.value)}
              onBlur={() => handleBlur('country')}
              className="w-full border rounded px-3 py-2 mt-2 border-gray-300"
              placeholder="Enter country name"
              disabled={loading}
            />
          )}
          {touched.country && errors.country && (
            <p className="text-red-600 text-xs mt-1">{errors.country}</p>
          )}
        </div>
      </div>

      {/* Phone */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Phone Number <span className="text-gray-500 text-xs">(Optional)</span>
        </label>
        <input
          type="tel"
          value={formData.phone}
          onChange={(e) => handleChange('phone', e.target.value)}
          onBlur={() => handleBlur('phone')}
          className={`w-full border rounded px-3 py-2 ${
            touched.phone && errors.phone ? 'border-red-500' : 'border-gray-300'
          }`}
          placeholder="+1 234 567-8900"
          disabled={loading}
        />
        {touched.phone && errors.phone && (
          <p className="text-red-600 text-xs mt-1">{errors.phone}</p>
        )}
      </div>

      {/* Form Actions */}
      <div className="flex items-center justify-end gap-3 pt-4 border-t">
        <button
          type="button"
          onClick={onCancel}
          disabled={loading}
          className="px-4 py-2 text-gray-700 hover:text-gray-900 disabled:opacity-50"
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={loading}
          className="bg-blue-700 hover:bg-blue-800 text-white px-4 py-2 rounded font-medium disabled:opacity-50"
        >
          {loading ? 'Saving...' : address ? 'Update Address' : 'Add Address'}
        </button>
      </div>
    </form>
  );
};

export default AddressForm;
