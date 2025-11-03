import React, { useState } from "react";
import useCartStore from "../store/cartStore";
import useAddressStore from "../store/addressStore";
import { useNavigate } from "react-router-dom";
import { batchCheckout } from "../api/purchases";
import { getPaymentProviderByKey } from "../payments/providers";
import PaymentMethodSelector from "../components/PaymentMethodSelector";
import ConditionIcon from "../components/ConditionIcon";
import AddressSelector from "../components/AddressSelector";
import CheckoutAddressForm from "../components/CheckoutAddressForm";

const Checkout = () => {
  const {
    cartItems,
    updateItemQuantity,
    removeItemFromCart,
    getCartTotal,
    clearCart,
    loading: cartLoading,
    error: cartError,
  } = useCartStore();

  const { addAddress, addresses } = useAddressStore();

  const navigate = useNavigate();

  const [updatingId, setUpdatingId] = useState(null);
  const [step, setStep] = useState("cart"); // "cart", "shipping", "review"
  const [placing, setPlacing] = useState(false);
  const [orderSuccess, setOrderSuccess] = useState(false);
  const [checkoutError, setCheckoutError] = useState("");
  const [selectedPayment, setSelectedPayment] = useState('redsys');

  // Address state
  const [selectedAddressId, setSelectedAddressId] = useState(null);
  const [showNewAddressForm, setShowNewAddressForm] = useState(false);
  const [newAddressData, setNewAddressData] = useState(null);

  const handleQuantityChange = (itemId, quantity) => {
    const sanitizedQty = Math.max(0, Number(quantity || 0));
    setUpdatingId(itemId);
    try {
      updateItemQuantity(itemId, sanitizedQty);
    } finally {
      setUpdatingId(null);
    }
  };

  const handleRemove = (itemId) => {
    setUpdatingId(itemId);
    try {
      removeItemFromCart(itemId);
    } finally {
      setUpdatingId(null);
    }
  };

  const handleProceedToShipping = () => {
    setStep("shipping");
  };

  const handleSelectAddress = (addressId) => {
    setSelectedAddressId(addressId);
    setShowNewAddressForm(false);
    setNewAddressData(null);
  };

  const handleAddNewAddress = () => {
    setShowNewAddressForm(true);
    setSelectedAddressId(null);
  };

  const handleNewAddressSubmit = async (addressData, saveForFuture) => {
    if (saveForFuture) {
      // Save address to user's address book
      const result = await addAddress(addressData);
      if (result.success && result.address) {
        setSelectedAddressId(result.address.id);
        setShowNewAddressForm(false);
        setNewAddressData(null);
      }
    } else {
      // Use address for this order only (don't save)
      setNewAddressData(addressData);
      setShowNewAddressForm(false);
      setSelectedAddressId(null);
    }
  };

  const handleCancelNewAddress = () => {
    setShowNewAddressForm(false);
  };

  const handleContinueToReview = () => {
    if (!selectedAddressId && !newAddressData) {
      setCheckoutError("Please select or add a shipping address");
      return;
    }
    setCheckoutError("");
    setStep("review");
  };

  const handlePlaceOrder = async () => {
    setPlacing(true);
    setCheckoutError("");
    try {
      console.log("🚀 Starting checkout with items:", cartItems.length);

      // Get the selected address
      let shippingAddress = null;
      if (selectedAddressId) {
        shippingAddress = addresses.find(addr => addr.id === selectedAddressId);
      } else if (newAddressData) {
        shippingAddress = newAddressData;
      }

      console.log("📋 Shipping address:", shippingAddress);

      // Step 1: Payment via selected provider (modular)
      console.log("💳 Processing payment with:", selectedPayment);
      const provider = getPaymentProviderByKey(selectedPayment);
      if (!provider) throw new Error('Invalid payment provider');
      const amount = Number(getCartTotal().toFixed(2));
      const paymentResult = await provider.pay({
        amount,
        currency: 'EUR',
        cartItems,
        shippingAddress,
      });
      console.log("✅ Payment successful:", paymentResult);

      if (!paymentResult.success) {
        throw new Error("Payment failed");
      }

      // Step 2: Prepare batch checkout request
      console.log("📦 Preparing batch checkout...");
      console.log("🛒 Cart items full data:", JSON.stringify(cartItems, null, 2));

      // Debug localStorage
      const localStorageCart = localStorage.getItem('shopping_cart');
      console.log("💾 localStorage cart:", localStorageCart);

      // Map cart items to the format expected by backend
      const items = cartItems.map(item => {
        console.log(`🔍 Item details:`, {
          id: item.id,
          cardToSellId: item.cardToSellId,
          name: item.cardName
        });

        const cardToSellId = item.cardToSellId || (typeof item.id === 'string' ? Number(item.id) : item.id);
        console.log(`   ➡️ Mapping item: ${item.cardName} -> cardToSellId: ${cardToSellId} (from ${item.cardToSellId ? 'cardToSellId' : 'id'})`);

        if (!cardToSellId || cardToSellId === null || isNaN(cardToSellId)) {
          console.error(`❌ Invalid cardToSellId for item ${item.cardName}:`, {
            cardToSellId: item.cardToSellId,
            id: item.id,
            computed: cardToSellId
          });
        }

        return {
          cardToSellId: cardToSellId,
          quantity: item.quantity || 1
        };
      });

      const checkoutRequest = {
        items: items,
        paymentProviderId: paymentResult.transactionId,
        paymentProvider: paymentResult.provider
      };

      console.log("📦 Batch checkout request:", JSON.stringify(checkoutRequest, null, 2));

      // Make single batch checkout call
      const result = await batchCheckout(checkoutRequest);

      console.log("📊 Batch checkout result:", result);

      if (result.success && result.purchases && result.purchases.length > 0) {
        // Clear cart after successful checkout
        console.log("🧹 Clearing cart...");
        clearCart();
        setOrderSuccess(true);
        console.log(`✅ Successfully created ${result.purchases.length} purchases with transaction ID: ${result.transactionId}`);
      } else {
        // Handle failure
        console.warn("⚠️ Checkout failed:", result.message);
        setCheckoutError(result.message || "Checkout failed");
      }
    } catch (e) {
      console.error("❌ Checkout exception:", e);
      setCheckoutError(e.message || "Error processing your order");
    } finally {
      setPlacing(false);
    }
  };

  const getSelectedAddressForDisplay = () => {
    if (selectedAddressId) {
      return addresses.find(addr => addr.id === selectedAddressId);
    }
    return newAddressData;
  };

  return (
    <div className="px-6 py-8">
      <h1 className="text-2xl font-bold text-gray-900 mb-6">
        {orderSuccess ? "Order placed" : step === "cart" ? "Your cart" : step === "shipping" ? "Shipping Address" : "Review Order"}
      </h1>

      {cartError && (
        <div className="mb-4 p-3 bg-red-100 border border-red-300 text-red-700 rounded">
          {cartError}
        </div>
      )}

      {orderSuccess ? (
        <div className="max-w-xl bg-white border rounded-lg shadow p-6">
          <p className="text-green-700 font-semibold mb-2">Your order is pending confirmation.</p>
          <p className="text-gray-600 mb-4">
            The seller will review your order and confirm it shortly. You will receive a notification once confirmed.
          </p>
          <div className="flex gap-3">
            <button
              className="bg-blue-700 hover:bg-blue-800 text-white py-2 px-4 rounded"
              onClick={() => navigate('/')}
            >
              Continue shopping
            </button>
            <button
              className="bg-gray-600 hover:bg-gray-700 text-white py-2 px-4 rounded"
              onClick={() => navigate('/account/transactions')}
            >
              View my orders
            </button>
          </div>
        </div>
      ) : checkoutError && step === "review" ? (
        <div className="max-w-xl bg-white border rounded-lg shadow p-6">
          <div className="p-3 bg-red-100 border border-red-400 text-red-700 rounded mb-4">
            {checkoutError}
          </div>
          <button
            className="bg-blue-700 hover:bg-blue-800 text-white py-2 px-4 rounded"
            onClick={() => setCheckoutError("")}
          >
            Try again
          </button>
        </div>
      ) : cartItems.length === 0 ? (
        <div className="text-center text-gray-600 py-16">
          Your cart is empty
        </div>
      ) : step === "cart" ? (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-4">
            {cartItems.map((item) => (
              <div key={item.id} className="flex items-center gap-4 bg-white rounded-lg border p-4 shadow-sm">
                <div className="w-16 h-20 bg-gray-100 rounded flex items-center justify-center overflow-hidden">
                  {item.imageUrl ? (
                    <img src={item.imageUrl} alt={item.cardName} className="w-full h-full object-contain" />
                  ) : (
                    <span className="text-gray-400 text-xs">IMG</span>
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="font-semibold text-gray-900 truncate">{item.cardName}</div>
                  <div className="text-sm text-gray-500 truncate">{item.setName || item.set}</div>
                  {item.condition && (
                    <div className="mt-1">
                      <ConditionIcon condition={item.condition} size="xs" />
                    </div>
                  )}
                </div>
                <div className="w-24 text-right font-semibold text-green-700">
                  €{Number(item.price || 0).toFixed(2)}
                </div>
                <div className="flex items-center gap-2">
                  <input
                    type="number"
                    min="0"
                    className="w-20 border rounded px-2 py-1"
                    value={item.quantity}
                    onChange={(e) => handleQuantityChange(item.id, e.target.value)}
                    disabled={cartLoading || updatingId === item.id}
                  />
                  <button
                    onClick={() => handleRemove(item.id)}
                    className="text-red-600 hover:text-red-700 font-medium"
                    disabled={cartLoading || updatingId === item.id}
                  >
                    Remove
                  </button>
                </div>
              </div>
            ))}
          </div>

          <aside className="bg-white rounded-lg border p-4 h-fit shadow-sm">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Summary</h2>
            <div className="flex justify-between text-gray-700 mb-2">
              <span>Subtotal</span>
              <span>€{getCartTotal().toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-gray-500 text-sm mb-4">
              <span>Shipping</span>
              <span>Calculated at next step</span>
            </div>
            <button
              className="w-full bg-blue-700 hover:bg-blue-800 text-white py-2 rounded font-semibold disabled:opacity-50"
              disabled={cartLoading}
              onClick={handleProceedToShipping}
            >
              Proceed to shipping
            </button>
          </aside>
        </div>
      ) : step === "shipping" ? (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg border p-4 shadow-sm">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Select Shipping Address</h2>

              {checkoutError && (
                <div className="mb-4 p-3 bg-red-100 border border-red-300 text-red-700 rounded text-sm">
                  {checkoutError}
                </div>
              )}

              {showNewAddressForm ? (
                <CheckoutAddressForm
                  onSubmit={handleNewAddressSubmit}
                  onCancel={handleCancelNewAddress}
                  loading={false}
                />
              ) : (
                <AddressSelector
                  selectedAddressId={selectedAddressId}
                  onSelectAddress={handleSelectAddress}
                  onAddNew={handleAddNewAddress}
                />
              )}

              {!showNewAddressForm && (
                <div className="flex items-center justify-between mt-6 pt-4 border-t">
                  <button
                    className="text-gray-700 hover:text-gray-900"
                    onClick={() => setStep("cart")}
                  >
                    Back to cart
                  </button>
                  <button
                    className="bg-blue-700 hover:bg-blue-800 text-white px-5 py-2 rounded font-semibold disabled:opacity-50"
                    onClick={handleContinueToReview}
                    disabled={!selectedAddressId && !newAddressData}
                  >
                    Continue to review
                  </button>
                </div>
              )}
            </div>
          </div>

          <aside className="bg-white rounded-lg border p-4 h-fit shadow-sm">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Summary</h2>
            <div className="flex justify-between text-gray-700 mb-2">
              <span>Items</span>
              <span>{cartItems.reduce((c, it) => c + it.quantity, 0)}</span>
            </div>
            <div className="flex justify-between text-gray-700 mb-2">
              <span>Subtotal</span>
              <span>€{getCartTotal().toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-gray-500 text-sm mb-4">
              <span>Shipping</span>
              <span>Calculated at delivery</span>
            </div>
          </aside>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-4">
            {/* Shipping Address */}
            <div className="bg-white rounded-lg border p-4 shadow-sm">
              <div className="flex items-center justify-between mb-3">
                <h2 className="text-lg font-semibold text-gray-900">Shipping Address</h2>
                <button
                  onClick={() => setStep("shipping")}
                  className="text-blue-700 hover:text-blue-800 text-sm font-medium"
                >
                  Change
                </button>
              </div>
              {(() => {
                const addr = getSelectedAddressForDisplay();
                if (!addr) return <p className="text-gray-500">No address selected</p>;
                return (
                  <div className="text-sm text-gray-700">
                    <p className="font-semibold">{addr.recipientName}</p>
                    <p>{addr.street}</p>
                    {addr.additionalInfo && <p>{addr.additionalInfo}</p>}
                    <p>
                      {addr.city}
                      {addr.state && `, ${addr.state}`} {addr.postalCode}
                    </p>
                    <p>{addr.country}</p>
                    {addr.phone && <p className="mt-1">{addr.phone}</p>}
                  </div>
                );
              })()}
            </div>

            {/* Order Items */}
            <div className="bg-white rounded-lg border p-4 shadow-sm">
              <div className="flex items-center justify-between mb-3">
                <h2 className="text-lg font-semibold text-gray-900">Payment Method</h2>
              </div>
              <div>
                <PaymentMethodSelector
                  selectedKey={selectedPayment}
                  onChange={setSelectedPayment}
                />
              </div>
            </div>

            <div className="bg-white rounded-lg border p-4 shadow-sm">
              <h2 className="text-lg font-semibold text-gray-900 mb-3">Order Items</h2>
              <div className="space-y-3">
                {cartItems.map((item) => (
                  <div key={item.id} className="flex items-center gap-4 pb-3 border-b last:border-b-0">
                    <div className="w-12 h-16 bg-gray-100 rounded flex items-center justify-center overflow-hidden">
                      {item.imageUrl ? (
                        <img src={item.imageUrl} alt={item.cardName} className="w-full h-full object-contain" />
                      ) : (
                        <span className="text-gray-400 text-xs">IMG</span>
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="font-medium text-gray-900 text-sm truncate">{item.cardName}</div>
                      <div className="text-xs text-gray-500 truncate">{item.setName || item.set}</div>
                      {item.condition && (
                        <div className="mt-1">
                          <ConditionIcon condition={item.condition} size="xs" />
                        </div>
                      )}
                    </div>
                    <div className="text-sm text-gray-700">
                      x{item.quantity}
                    </div>
                    <div className="w-20 text-right font-semibold text-green-700 text-sm">
                      €{(Number(item.price || 0) * item.quantity).toFixed(2)}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="flex items-center justify-between">
              <button
                className="text-gray-700 hover:text-gray-900"
                onClick={() => setStep("shipping")}
                disabled={placing}
              >
                Back to shipping
              </button>
              <button
                className="bg-green-600 hover:bg-green-700 text-white px-6 py-2.5 rounded font-semibold disabled:opacity-50"
                onClick={handlePlaceOrder}
                disabled={placing}
              >
                {placing ? 'Placing order...' : 'Place order'}
              </button>
            </div>
          </div>

          <aside className="bg-white rounded-lg border p-4 h-fit shadow-sm">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Order Summary</h2>
            <div className="flex justify-between text-gray-700 mb-2">
              <span>Items ({cartItems.reduce((c, it) => c + it.quantity, 0)})</span>
              <span>€{getCartTotal().toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-gray-500 text-sm mb-4 pb-4 border-b">
              <span>Shipping</span>
              <span>Free</span>
            </div>
            <div className="flex justify-between text-lg font-bold text-gray-900">
              <span>Total</span>
              <span>€{getCartTotal().toFixed(2)}</span>
            </div>
          </aside>
        </div>
      )}
    </div>
  );
};

export default Checkout;
