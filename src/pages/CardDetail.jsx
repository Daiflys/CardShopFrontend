import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import CardInfoTab from "./CardInfoTab";
import CardSellTab from "./CardSellTab";
import PageLayout from "../components/PageLayout";
import { getCardDetail } from "../api/card";
import { decodeJWTToken } from "../utils/oauth";
import { isAdmin } from "../utils/userRoles";
import Button from "../design/components/Button";

const CardDetail = () => {
  const { cardId } = useParams();
  const [card, setCard] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [activeTab, setActiveTab] = useState("info");
  const [userIsAdmin, setUserIsAdmin] = useState(false);

  // Check if user is admin
  useEffect(() => {
    const token = localStorage.getItem("authToken");
    if (token && token.split(".").length === 3) {
      try {
        const payload = decodeJWTToken(token);
        if (payload && payload.role) {
          setUserIsAdmin(isAdmin(payload.role));
        }
      } catch {
        // ignore decoding errors
        setUserIsAdmin(false);
      }
    }
  }, []);

  useEffect(() => {
    setLoading(true);
    getCardDetail(cardId)
      .then(setCard)
      .catch(err => setError(err.message))
      .finally(() => setLoading(false));
  }, [cardId]);

  if (loading) {
    return (
      <div className="bg-gray-50 min-h-screen">
        <PageLayout containerClassName="px-0 py-4 sm:px-4" maxWidth="max-w-6xl">
          <div className="sm:bg-white sm:rounded-xl sm:shadow p-4 sm:p-6">
            <div className="animate-pulse">
              {/* Loading skeleton for tabs */}
              <div className="flex border-b mb-4">
                <div className="h-10 bg-gray-200 rounded w-24 mr-4"></div>
                <div className="h-10 bg-gray-200 rounded w-24"></div>
              </div>

              {/* Loading skeleton for content */}
              <div className="flex flex-col lg:flex-row gap-6">
                <div className="lg:w-1/3">
                  <div className="bg-gray-200 rounded-lg aspect-[3/4] w-full"></div>
                </div>
                <div className="lg:w-2/3 space-y-4">
                  <div className="h-8 bg-gray-200 rounded w-3/4"></div>
                  <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                  <div className="h-4 bg-gray-200 rounded w-2/3"></div>
                  <div className="space-y-2">
                    <div className="h-4 bg-gray-200 rounded"></div>
                    <div className="h-4 bg-gray-200 rounded"></div>
                    <div className="h-4 bg-gray-200 rounded w-5/6"></div>
                  </div>
                </div>
              </div>
            </div>

            {/* Loading indicator with text */}
            <div className="text-center mt-8">
              <div className="inline-flex items-center px-4 py-2 font-semibold leading-6 text-sm shadow rounded-md text-sky-600 bg-sky-50 border border-sky-200">
                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-sky-600" fill="none" viewBox="0 0 24 24" aria-hidden="true">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="m4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Loading card details...
              </div>
            </div>
          </div>
        </PageLayout>
      </div>
    );
  }
  if (error) {
    return (
      <div className="bg-gray-50 min-h-screen">
        <PageLayout containerClassName="px-0 py-4 sm:px-4" maxWidth="max-w-6xl">
          <div className="sm:bg-white sm:rounded-xl sm:shadow p-4 sm:p-6">
            <div className="text-center py-12">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-red-100 rounded-full mb-4">
                <svg className="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z" />
                </svg>
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">Error Loading Card</h3>
              <p className="text-gray-600 mb-4">{error}</p>
              <Button
                variant="danger"
                onClick={() => window.location.reload()}
              >
                Try Again
              </Button>
            </div>
          </div>
        </PageLayout>
      </div>
    );
  }
  if (!card) return null;

  return (
    <div className="bg-gray-50 min-h-screen">
      <PageLayout containerClassName="px-0 py-4 sm:px-4" maxWidth="max-w-6xl">
        <div className="sm:bg-white sm:rounded-xl sm:shadow p-4 sm:p-6">
          {userIsAdmin && (
            <div className="flex border-b mb-4">
              <Button
                variant="tab"
                active={activeTab === "info"}
                onClick={() => setActiveTab("info")}
                className="px-4 py-2 -mb-px text-sm sm:text-base rounded-none"
              >
                Info
              </Button>
              <Button
                variant="tab"
                active={activeTab === "sell"}
                onClick={() => setActiveTab("sell")}
                className="px-4 py-2 -mb-px text-sm sm:text-base rounded-none"
              >
                Sell
              </Button>
            </div>
          )}
          {userIsAdmin ? (
            <>
              {activeTab === "info" && <CardInfoTab card={card} />}
              {activeTab === "sell" && <CardSellTab card={card} />}
            </>
          ) : (
            <CardInfoTab card={card} />
          )}
        </div>
      </PageLayout>
    </div>
  );
};

export default CardDetail;
