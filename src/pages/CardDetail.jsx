import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import CardInfoTab from "./CardInfoTab";
import CardSellTab from "./CardSellTab";
import { getCardDetail } from "../api/card";

const CardDetail = () => {
  const { cardId } = useParams();
  const [card, setCard] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [activeTab, setActiveTab] = useState("info");

  useEffect(() => {
    setLoading(true);
    getCardDetail(cardId)
      .then(setCard)
      .catch(err => setError(err.message))
      .finally(() => setLoading(false));
  }, [cardId]);

  if (loading) return <div className="p-8 text-center">Cargando...</div>;
  if (error) return <div className="p-8 text-center text-red-600">{error}</div>;
  if (!card) return null;

  return (
    <div className="bg-gray-50 min-h-screen pb-10">
      <div className="max-w-5xl mx-auto bg-white rounded-xl shadow p-6 mt-8">
        <div className="flex border-b mb-4">
          <button
            className={`px-4 py-2 ${activeTab === "info" ? "border-b-2 border-blue-700 font-bold" : ""}`}
            onClick={() => setActiveTab("info")}
          >
            Info.
          </button>
          <button
            className={`px-4 py-2 ${activeTab === "sell" ? "border-b-2 border-blue-700 font-bold" : ""}`}
            onClick={() => setActiveTab("sell")}
          >
            Sell
          </button>
        </div>
        {activeTab === "info" && <CardInfoTab card={card} />}
        {activeTab === "sell" && <CardSellTab card={card} />}
      </div>
    </div>
  );
};

export default CardDetail; 