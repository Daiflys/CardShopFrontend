import React, { useEffect, useState } from 'react';

// Generic payment return page for any provider.
// Expects query params like: ?provider=redsys&status=ok

const PaymentReturn = () => {
  const [provider, setProvider] = useState('');
  const [status, setStatus] = useState('pending');
  const [message, setMessage] = useState('Waiting for confirmation...');
  const [intent, setIntent] = useState('');

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const p = params.get('provider') || 'unknown';
    const st = params.get('status');
    const it = params.get('intent') || '';
    setProvider(p);
    setIntent(it);
    if (st === 'ok') {
      setStatus('ok');
      setMessage(it === 'preauth' ? 'Payment preauthorized. Capture will be done later.' : 'Payment authorized. Your order will be processed.');
    } else if (st === 'ko') {
      setStatus('ko');
      setMessage('Payment failed or was canceled.');
    } else {
      setStatus('unknown');
      setMessage('Awaiting backend confirmation.');
    }
  }, []);

  return (
    <main className="max-w-xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-1">Payment</h1>
      <p className="text-sm text-gray-600 mb-1">Provider: {provider}</p>
      {intent && (
        <p className="text-sm text-gray-500 mb-4">Intent: {intent}</p>
      )}
      <div className={`p-4 rounded border ${status === 'ok' ? 'border-green-300 bg-green-50 text-green-800' : status === 'ko' ? 'border-red-300 bg-red-50 text-red-800' : 'border-gray-300 bg-gray-50 text-gray-700' }`}>
        {message}
      </div>
      <p className="mt-4 text-sm text-gray-600">
        This is a generic return page. In a real integration, the backend validates
        the payment notification and redirects here with the final status.
      </p>
    </main>
  );
};

export default PaymentReturn;
