// src/utils/mockPayment.ts

export interface MockPaymentResult {
  success: boolean;
  transactionId: string;
  provider: string;
}

/**
 * Simulates a payment transaction by generating a mock transaction ID
 * @returns Promise with payment result containing transaction ID and provider info
 */
export const mockPayment = async (): Promise<MockPaymentResult> => {
  // Simulate network delay (100-300ms)
  const delay = Math.random() * 200 + 100;
  await new Promise(resolve => setTimeout(resolve, delay));

  // Generate a unique transaction ID
  const timestamp = Date.now();
  const randomString = Math.random().toString(36).substring(2, 15);
  const transactionId = `mock_${timestamp}_${randomString}`;

  return {
    success: true,
    transactionId,
    provider: "mock"
  };
};
