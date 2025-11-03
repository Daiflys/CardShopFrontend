import React, { useEffect, useState } from 'react';

// Placeholder return page for Redsys redirects.
// In real flow, Redsys posts to your OK/KO URLs. Your backend should validate
// signature and then redirect to this page with a status param.

const RedsysReturn = () => {
  const [status, setStatus] = useState('pending');
  const [message, setMessage] = useState('Waiting for confirmation...');

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const st = params.get('status');
    if (st === 'ok') {
      setStatus('ok');
      setMessage('Payment authorized. Your order will be processed.');
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
      <h1 className="text-2xl font-bold mb-4">Redsys Payment</h1>
      <div className={`p-4 rounded border ${status === 'ok' ? 'border-green-300 bg-green-50 text-green-800' : status === 'ko' ? 'border-red-300 bg-red-50 text-red-800' : 'border-gray-300 bg-gray-50 text-gray-700' }`}>
        {message}
      </div>
      <p className="mt-4 text-sm text-gray-600">
        This is a placeholder page. In a real integration, the backend validates the
        Redsys signature and creates the order, then redirects here.
      </p>
    </main>
  );
};

export default RedsysReturn;

