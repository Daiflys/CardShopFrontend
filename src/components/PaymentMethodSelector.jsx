import React from 'react';
import { getPaymentProviders } from '../payments/providers';

const PaymentMethodSelector = ({ selectedKey, onChange }) => {
  const providers = getPaymentProviders();
  return (
    <div className="space-y-3">
      {providers.map((p) => (
        <label key={p.key} className="flex items-center gap-3 p-3 border rounded-md cursor-pointer hover:bg-gray-50">
          <input
            type="radio"
            name="paymentProvider"
            value={p.key}
            checked={selectedKey === p.key}
            onChange={() => onChange(p.key)}
          />
          {p.logoUrl ? (
            <img src={p.logoUrl} alt={p.label} className="h-5" />
          ) : (
            <span className="text-sm font-medium text-gray-900">{p.label}</span>
          )}
          {p.isTest && (
            <span className="ml-auto text-xs bg-yellow-100 text-yellow-800 px-2 py-0.5 rounded">Test</span>
          )}
        </label>
      ))}
    </div>
  );
};

export default PaymentMethodSelector;

