// Redsys Test Payment Provider (simulated)
// This provider simulates a successful Redsys card payment in development.

import type { PaymentInitParams, PaymentResult } from './types';

export interface RedsysConfig {
  merchantCode?: string;
  terminal?: string;
  currency?: string; // e.g. '978' for EUR per Redsys, but we use display ISO like 'EUR' for app
  testMode?: boolean;
}

export const redsysTestProvider = {
  key: 'redsys',
  label: 'Credit/Debit Card',
  isTest: true,
  behavior: 'local' as const,
  async pay(params: PaymentInitParams): Promise<PaymentResult> {
    // Simulate slight processing latency
    const delay = Math.random() * 250 + 150;
    await new Promise((r) => setTimeout(r, delay));

    const ts = Date.now();
    const rnd = Math.random().toString(36).slice(2, 10);
    const id = `redsys_test_${ts}_${rnd}`;

    return {
      success: true,
      transactionId: id,
      provider: 'redsys',
      testMode: true,
    };
  },
};

export type RedsysProvider = typeof redsysTestProvider;

export const redsysProviderFromEnv = (): RedsysProvider => {
  const mode = (import.meta.env.VITE_REDSYS_MODE || 'local').toLowerCase();
  if (mode === 'local') return redsysTestProvider as RedsysProvider;

  // Placeholder for redirect mode (requires backend signature)
  const redirectProvider: RedsysProvider = {
    key: 'redsys',
    label: 'Credit/Debit Card (Redsys)',
    isTest: true,
    behavior: 'redirect' as const,
    async pay(params: PaymentInitParams) {
      const API_BASE_URL = (import.meta.env.VITE_API_BASE_URL as string) || '/api';
      const BASE_RETURN_URL = (import.meta.env.VITE_REDSYS_RETURN_URL as string) || `${window.location.origin}/payment/return?provider=redsys`;

      // Use provided orderId or generate one (backend may override/validate)
      const orderId = params.orderId || `ORD${Date.now().toString().slice(-8)}`; // 4-12 chars
      console.log('[Redsys] Using orderId:', orderId);

      // Default to preauthorization intent for delayed capture
      const intent = params.intent || 'preauth';
      // Ensure return URL carries provider and intent for better UX messaging
      const returnUrl = BASE_RETURN_URL.includes('intent=')
        ? BASE_RETURN_URL
        : `${BASE_RETURN_URL}${BASE_RETURN_URL.includes('?') ? '&' : '?'}intent=${encodeURIComponent(intent)}`;

    const token = localStorage.getItem('authToken');
      console.log('[Redsys] Init request →', `${API_BASE_URL}/payments/redsys/init`);
      console.log('[Redsys] Transaction ID:', params.transactionId || 'NOT PROVIDED');
      const initRes = await fetch(`${API_BASE_URL}/payments/redsys/init`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(token ? { 'Authorization': `Bearer ${token}` } : {}),
        },
        body: JSON.stringify({
          amount: params.amount,
          currency: params.currency || 'EUR',
          orderId,
          returnUrl,
          intent, // let backend set DS_MERCHANT_TRANSACTIONTYPE accordingly
          transactionId: params.transactionId, // transaction ID from purchases/checkout
        }),
      });

      if (!initRes.ok) {
        const txt = await initRes.text();
        console.error('[Redsys] Init failed', initRes.status, txt);
        throw new Error(`Redsys init failed: ${initRes.status} ${txt}`);
      }
      const data = await initRes.json();

      // 🔥 DEBUG COMPLETO - Ver respuesta del backend
      console.log('🟢 [BACKEND RESPONSE] Full response:', JSON.stringify(data, null, 2));
      console.log('🟢 [BACKEND RESPONSE] Ds_MerchantParameters RAW:', data.params?.Ds_MerchantParameters);
      console.log('🟢 [BACKEND RESPONSE] Ds_Signature RAW:', data.params?.Ds_Signature);
      console.log('🟢 [BACKEND RESPONSE] Ds_SignatureVersion:', data.params?.Ds_SignatureVersion);

      // 🔥 DECODIFICAR Ds_MerchantParameters para ver qué contiene
      if (data.params?.Ds_MerchantParameters) {
        try {
          const decoded = atob(data.params.Ds_MerchantParameters);
          console.log('🔓 [DECODED] Ds_MerchantParameters JSON:', decoded);
          const parsed = JSON.parse(decoded);
          console.log('🔓 [PARSED] Merchant params:', parsed);
          console.log('🔓 [PARSED] DS_MERCHANT_MERCHANTCODE:', parsed.DS_MERCHANT_MERCHANTCODE);
          console.log('🔓 [PARSED] DS_MERCHANT_TERMINAL:', parsed.DS_MERCHANT_TERMINAL);
          console.log('🔓 [PARSED] DS_MERCHANT_ORDER:', parsed.DS_MERCHANT_ORDER);
          console.log('🔓 [PARSED] DS_MERCHANT_AMOUNT:', parsed.DS_MERCHANT_AMOUNT);
        } catch (e) {
          console.error('❌ [ERROR] Cannot decode Ds_MerchantParameters:', e);
        }
      } else {
        console.error('❌ [ERROR] Ds_MerchantParameters is missing!');
      }

      if (!data?.url || !data?.params) throw new Error('Invalid Redsys init response');
      console.log('[Redsys] Init OK → submitting form to', data.url, 'for order', orderId);

      // Build and submit form
      const form = document.createElement('form');
      form.method = data.method || 'POST';
      form.action = data.url;

      console.log('═══════════════════════════════════════════════════════');
      console.log('🌐🌐🌐 URL DE REDIRECCIÓN A REDSYS 🌐🌐🌐');
      console.log('═══════════════════════════════════════════════════════');
      console.log('🔴 NAVEGANDO A:', data.url);
      console.log('🔴 METHOD:', data.method || 'POST');
      console.log('═══════════════════════════════════════════════════════');
      console.log('🔶 [FORM BUILD] Creating form');
      console.log('🔶 [FORM BUILD] Action URL:', data.url);
      console.log('🔶 [FORM BUILD] Method:', data.method || 'POST');
      console.log('🔶 [FORM BUILD] Total fields:', Object.keys(data.params).length);

      Object.entries(data.params).forEach(([k, v]) => {
        const input = document.createElement('input');
        input.type = 'hidden';
        input.name = k;
        input.value = String(v);
        form.appendChild(input);

        console.log(`🔶 [FORM FIELD] ${k}:`, String(v).substring(0, 100) + (String(v).length > 100 ? '...' : ''));
      });

      document.body.appendChild(form);

      // 🔥 MOSTRAR TODO LO QUE SE ENVÍA A REDSYS
      console.log('═══════════════════════════════════════════════════════');
      console.log('🚀 DATOS ENVIADOS A REDSYS TPV');
      console.log('═══════════════════════════════════════════════════════');
      console.log('📍 URL:', data.url);
      console.log('📍 Method:', data.method || 'POST');
      console.log('───────────────────────────────────────────────────────');
      console.log('📦 CAMPO 1: Ds_SignatureVersion');
      console.log('   Valor:', data.params.Ds_SignatureVersion);
      console.log('───────────────────────────────────────────────────────');
      console.log('📦 CAMPO 2: Ds_MerchantParameters (Base64)');
      console.log('   Valor:', data.params.Ds_MerchantParameters);
      console.log('   Longitud:', data.params.Ds_MerchantParameters?.length, 'caracteres');
      console.log('───────────────────────────────────────────────────────');
      console.log('📦 CAMPO 3: Ds_Signature (Base64)');
      console.log('   Valor:', data.params.Ds_Signature);
      console.log('   Longitud:', data.params.Ds_Signature?.length, 'caracteres');
      console.log('═══════════════════════════════════════════════════════');
      console.log('🔓 CONTENIDO DECODIFICADO de Ds_MerchantParameters:');
      console.log('═══════════════════════════════════════════════════════');
      try {
        const decoded = atob(data.params.Ds_MerchantParameters);
        const parsed = JSON.parse(decoded);
        console.log('📋 JSON Completo:', JSON.stringify(parsed, null, 2));
        console.log('───────────────────────────────────────────────────────');
        console.log('📌 PARÁMETROS CLAVE:');
        console.log('   ├─ DS_MERCHANT_MERCHANTCODE:', parsed.DS_MERCHANT_MERCHANTCODE);
        console.log('   ├─ DS_MERCHANT_TERMINAL:', parsed.DS_MERCHANT_TERMINAL);
        console.log('   ├─ DS_MERCHANT_ORDER:', parsed.DS_MERCHANT_ORDER);
        console.log('   ├─ DS_MERCHANT_AMOUNT:', parsed.DS_MERCHANT_AMOUNT, '(céntimos)');
        console.log('   ├─ DS_MERCHANT_CURRENCY:', parsed.DS_MERCHANT_CURRENCY, '(978=EUR)');
        console.log('   ├─ DS_MERCHANT_TRANSACTIONTYPE:', parsed.DS_MERCHANT_TRANSACTIONTYPE, parsed.DS_MERCHANT_TRANSACTIONTYPE === '0' ? '(SALE)' : parsed.DS_MERCHANT_TRANSACTIONTYPE === '1' ? '(PREAUTH)' : '');
        console.log('   ├─ DS_MERCHANT_MERCHANTURL:', parsed.DS_MERCHANT_MERCHANTURL);
        console.log('   ├─ DS_MERCHANT_URLOK:', parsed.DS_MERCHANT_URLOK);
        console.log('   └─ DS_MERCHANT_URLKO:', parsed.DS_MERCHANT_URLKO);

        // Verificar campos innecesarios
        const unnecessaryFields = ['Ds_Response', 'Ds_AuthorisationCode', 'Ds_TransactionType'];
        const foundUnnecessary = unnecessaryFields.filter(field => parsed[field] !== undefined);
        if (foundUnnecessary.length > 0) {
          console.log('───────────────────────────────────────────────────────');
          console.log('⚠️  CAMPOS INNECESARIOS DETECTADOS:');
          foundUnnecessary.forEach(field => {
            console.log(`   ⚠️  ${field}:`, parsed[field]);
          });
        }

        // Verificar formato de ORDER
        const orderValue = parsed.DS_MERCHANT_ORDER;
        if (orderValue) {
          const first4 = orderValue.substring(0, 4);
          const isNumeric = /^\d{4}$/.test(first4);
          if (!isNumeric) {
            console.log('───────────────────────────────────────────────────────');
            console.log('❌ PROBLEMA: DS_MERCHANT_ORDER NO cumple formato Redsys');
            console.log('   Valor actual:', orderValue);
            console.log('   Primeros 4 caracteres:', first4, '← DEBEN SER NUMÉRICOS');
            console.log('   Formato requerido: Primeros 4 dígitos numéricos (0-9)');
          } else {
            console.log('───────────────────────────────────────────────────────');
            console.log('✅ DS_MERCHANT_ORDER tiene formato correcto');
            console.log('   Primeros 4 caracteres:', first4, '✓ Numéricos');
          }
        }
      } catch (e) {
        console.error('❌ Error decodificando Ds_MerchantParameters:', e);
      }
      console.log('═══════════════════════════════════════════════════════');
      console.log('✅ Enviando formulario a Redsys...');
      console.log('═══════════════════════════════════════════════════════');

      console.log('[Redsys] Submitting redirect form with fields:', Object.keys(data.params));
      console.log('🌐 NAVEGANDO A:', form.action);
      console.log('🌐 URL COMPLETA DE REDIRECCIÓN:', form.action);
      form.submit();

      // Return a never-resolving promise to prevent caller from continuing
      return new Promise<PaymentResult>(() => {});
    },
  };
  return redirectProvider;
};
