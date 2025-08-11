import React, { useState } from "react";
import { setCardToSell } from "../api/postCardToSell";

const CardSellTab = ({ card }) => {
  const [quantity, setQuantity] = useState(1);
  const [language, setLanguage] = useState("English");
  const [condition, setCondition] = useState("Near Mint");
  const [comments, setComments] = useState("");
  const [price, setPrice] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  const handleSubmit = async (e) => {
    console.log("handleSubmit called");
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccessMessage("");
    try {
      const result = await setCardToSell(card.id, card.setName, card.name, card.imageUrl, price);
      console.log("result is: " + result + " result success is: " + result.success);
      setSuccessMessage("Card successfully put up for sale!");
    } catch (err) {
      //console.error("Error posting card to sell: ", err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form className="bg-white rounded-xl shadow p-6 max-w-lg mx-auto" onSubmit={handleSubmit}>
      {successMessage && (
        <div className="mb-4 p-3 bg-green-100 border border-green-400 text-green-700 rounded">
          {successMessage}
        </div>
      )}
      
      {error && (
        <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
          {error}
        </div>
      )}
      <div className="mb-4">
        <label className="block font-semibold mb-1">Quantity</label>
        <input type="number" min="1" className="border rounded px-3 py-2 w-full" value={quantity} onChange={e => setQuantity(e.target.value)} />
      </div>
      <div className="mb-4">
        <label className="block font-semibold mb-1">Language</label>
        <select className="border rounded px-3 py-2 w-full" value={language} onChange={e => setLanguage(e.target.value)}>
          <option>English</option>
          <option>Spanish</option>
          <option>German</option>
          <option>French</option>
        </select>
      </div>
      <div className="mb-4">
        <label className="block font-semibold mb-1">Condition</label>
        <select className="border rounded px-3 py-2 w-full" value={condition} onChange={e => setCondition(e.target.value)}>
          <option>Near Mint</option>
          <option>Excellent</option>
          <option>Good</option>
          <option>Light Played</option>
          <option>Played</option>
          <option>Poor</option>
        </select>
      </div>
      <div className="mb-4">
        <label className="block font-semibold mb-1">Comments</label>
        <input type="text" className="border rounded px-3 py-2 w-full" value={comments} onChange={e => setComments(e.target.value)} />
      </div>
      <div className="mb-4">
        <label className="block font-semibold mb-1">Price</label>
        <input type="number" min="0" step="0.01" className="border rounded px-3 py-2 w-full" value={price} onChange={e => setPrice(e.target.value)} />
      </div>
      <button type="submit" className="bg-blue-700 text-white px-4 py-2 rounded font-bold w-full">
        PUT FOR SALE
      </button>
    </form>
  );
};

export default CardSellTab; 