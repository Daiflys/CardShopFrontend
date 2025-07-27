import React, { useState } from "react";

const CardSellTab = ({ card }) => {
  const [quantity, setQuantity] = useState(1);
  const [language, setLanguage] = useState("English");
  const [condition, setCondition] = useState("Near Mint");
  const [comments, setComments] = useState("");
  const [price, setPrice] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    // Aquí iría la lógica para poner la carta a la venta
    alert("Put for sale: " + JSON.stringify({
      cardId: card?.id,
      quantity,
      language,
      condition,
      comments,
      price
    }));
  };

  return (
    <form className="bg-white rounded-xl shadow p-6 max-w-lg mx-auto" onSubmit={handleSubmit}>
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