import React, { useState } from "react";
import useCartStore from "../store/cartStore";
import { useNavigate } from "react-router-dom";
import { checkout } from "../api/cart";
import ConditionIcon from "../components/ConditionIcon";

const Checkout = () => {
  const {
    cartItems,
    updateItemQuantity,
    removeItemFromCart,
    getCartTotal,
    loading,
    error,
    clearCart,
  } = useCartStore();

  const navigate = useNavigate();

  const [updatingId, setUpdatingId] = useState(null);
  const [step, setStep] = useState("cart");
  const [placing, setPlacing] = useState(false);
  const [orderSuccess, setOrderSuccess] = useState(false);
  const [checkoutError, setCheckoutError] = useState("");

  const [shipping, setShipping] = useState({
    fullName: "",
    email: "",
    address: "",
    city: "",
    postalCode: "",
    country: "",
  });
  const [errors, setErrors] = useState({});

  const handleQuantityChange = async (itemId, quantity) => {
    const sanitizedQty = Math.max(0, Number(quantity || 0));
    setUpdatingId(itemId);
    try {
      await updateItemQuantity(itemId, sanitizedQty);
    } finally {
      setUpdatingId(null);
    }
  };

  const handleRemove = async (itemId) => {
    setUpdatingId(itemId);
    try {
      await removeItemFromCart(itemId);
    } finally {
      setUpdatingId(null);
    }
  };

  const validateShipping = () => {
    const newErrors = {};
    if (!shipping.fullName.trim()) newErrors.fullName = "Full name is required";
    if (!shipping.email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(shipping.email)) newErrors.email = "Valid email is required";
    if (!shipping.address.trim()) newErrors.address = "Address is required";
    if (!shipping.city.trim()) newErrors.city = "City is required";
    if (!shipping.postalCode.trim()) newErrors.postalCode = "Postal code is required";
    if (!shipping.country.trim()) newErrors.country = "Country is required";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handlePlaceOrder = async () => {
    if (!validateShipping()) return;
    setPlacing(true);
    setCheckoutError("");
    try {
      const result = await checkout(cartItems);
      if (result.success) {
        // Clear cart after successful batch purchase
        for (const item of cartItems) {
          await updateItemQuantity(item.id, 0);
        }
        setOrderSuccess(true);
      } else {
        // Handle partial failure or complete failure
        setCheckoutError(result.message || "Some items could not be purchased");
      }
    } catch (e) {
      setCheckoutError(e.message || "Error processing your order");
    } finally {
      setPlacing(false);
    }
  };

  return (
    <div className="px-6 py-8">
      <h1 className="text-2xl font-bold text-gray-900 mb-6">
        {orderSuccess ? "Order placed" : step === "cart" ? "Your cart" : "Checkout"}
      </h1>

      {error && (
        <div className="mb-4 p-3 bg-red-100 border border-red-300 text-red-700 rounded">
          {error}
        </div>
      )}

      {orderSuccess ? (
        <div className="max-w-xl bg-white border rounded-lg shadow p-6">
          <p className="text-green-700 font-semibold mb-2">Your order was placed successfully.</p>
          <p className="text-gray-600 mb-4">You will receive a confirmation email shortly.</p>
          <div className="flex gap-3">
            <button
              className="bg-blue-700 hover:bg-blue-800 text-white py-2 px-4 rounded"
              onClick={() => navigate('/')}
            >
              Continue shopping
            </button>
          </div>
        </div>
      ) : checkoutError ? (
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
                  {item.image_url ? (
                    <img src={item.image_url} alt={item.card_name || item.name} className="w-full h-full object-contain" />
                  ) : (
                    <span className="text-gray-400 text-xs">IMG</span>
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="font-semibold text-gray-900 truncate">{item.card_name || item.name}</div>
                  <div className="text-sm text-gray-500 truncate">{item.set}</div>
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
                    disabled={loading || updatingId === item.id}
                  />
                  <button
                    onClick={() => handleRemove(item.id)}
                    className="text-red-600 hover:text-red-700 font-medium"
                    disabled={loading || updatingId === item.id}
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
              disabled={loading}
              onClick={() => setStep("details")}
            >
              Proceed to checkout
            </button>
          </aside>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg border p-4 shadow-sm">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Shipping details</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Full name</label>
                  <input
                    type="text"
                    className={`w-full border rounded px-3 py-2 ${errors.fullName ? 'border-red-500' : ''}`}
                    value={shipping.fullName}
                    onChange={(e) => setShipping({ ...shipping, fullName: e.target.value })}
                  />
                  {errors.fullName && <p className="text-red-600 text-xs mt-1">{errors.fullName}</p>}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                  <input
                    type="email"
                    className={`w-full border rounded px-3 py-2 ${errors.email ? 'border-red-500' : ''}`}
                    value={shipping.email}
                    onChange={(e) => setShipping({ ...shipping, email: e.target.value })}
                  />
                  {errors.email && <p className="text-red-600 text-xs mt-1">{errors.email}</p>}
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Address</label>
                  <input
                    type="text"
                    className={`w-full border rounded px-3 py-2 ${errors.address ? 'border-red-500' : ''}`}
                    value={shipping.address}
                    onChange={(e) => setShipping({ ...shipping, address: e.target.value })}
                  />
                  {errors.address && <p className="text-red-600 text-xs mt-1">{errors.address}</p>}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">City</label>
                  <input
                    type="text"
                    className={`w-full border rounded px-3 py-2 ${errors.city ? 'border-red-500' : ''}`}
                    value={shipping.city}
                    onChange={(e) => setShipping({ ...shipping, city: e.target.value })}
                  />
                  {errors.city && <p className="text-red-600 text-xs mt-1">{errors.city}</p>}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Postal code</label>
                  <input
                    type="text"
                    className={`w-full border rounded px-3 py-2 ${errors.postalCode ? 'border-red-500' : ''}`}
                    value={shipping.postalCode}
                    onChange={(e) => setShipping({ ...shipping, postalCode: e.target.value })}
                  />
                  {errors.postalCode && <p className="text-red-600 text-xs mt-1">{errors.postalCode}</p>}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Country</label>
                  <input
                    type="text"
                    className={`w-full border rounded px-3 py-2 ${errors.country ? 'border-red-500' : ''}`}
                    value={shipping.country}
                    onChange={(e) => setShipping({ ...shipping, country: e.target.value })}
                  />
                  {errors.country && <p className="text-red-600 text-xs mt-1">{errors.country}</p>}
                </div>
              </div>

              <div className="flex items-center justify-between mt-6">
                <button
                  className="text-gray-700 hover:text-gray-900"
                  onClick={() => setStep("cart")}
                  disabled={placing}
                >
                  Back to cart
                </button>
                <button
                  className="bg-green-600 hover:bg-green-700 text-white px-5 py-2 rounded font-semibold disabled:opacity-50"
                  onClick={handlePlaceOrder}
                  disabled={placing}
                >
                  {placing ? 'Placing…' : 'Place order'}
                </button>
              </div>
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
      )}
    </div>
  );
};

export default Checkout;


