import React from "react";

/**
 * Badge component to display purchase status
 * @param {string} status - Purchase status: "AWAITING_VENDOR_CONFIRMATION", "CONFIRMED", "CANCELLED", etc.
 * @param {string} size - Badge size: "sm", "md", or "lg"
 */
const PurchaseStatusBadge = ({ status, size = "md" }) => {
  // Size classes
  const sizeClasses = {
    sm: "text-xs px-2 py-0.5",
    md: "text-sm px-2.5 py-1",
    lg: "text-base px-3 py-1.5"
  };

  // Status colors and labels
  const statusConfig = {
    AWAITING_VENDOR_CONFIRMATION: {
      label: "Awaiting Vendor Confirmation",
      bgClass: "bg-yellow-100",
      textClass: "text-yellow-800",
      borderClass: "border-yellow-300"
    },
    AUTHORIZED: {
      label: "Authorized",
      bgClass: "bg-blue-100",
      textClass: "text-blue-800",
      borderClass: "border-blue-300"
    },
    CONFIRMED: {
      label: "Confirmed",
      bgClass: "bg-green-100",
      textClass: "text-green-800",
      borderClass: "border-green-300"
    },
    CREATED: {
      label: "Created",
      bgClass: "bg-gray-100",
      textClass: "text-gray-800",
      borderClass: "border-gray-300"
    },
    CANCELLED: {
      label: "Cancelled",
      bgClass: "bg-red-100",
      textClass: "text-red-800",
      borderClass: "border-red-300"
    },
    FAILED: {
      label: "Failed",
      bgClass: "bg-red-200",
      textClass: "text-red-900",
      borderClass: "border-red-400"
    },
    REFUNDED: {
      label: "Refunded",
      bgClass: "bg-orange-100",
      textClass: "text-orange-800",
      borderClass: "border-orange-300"
    },
    EXPIRED: {
      label: "Expired",
      bgClass: "bg-gray-200",
      textClass: "text-gray-700",
      borderClass: "border-gray-400"
    }
  };

  const config = statusConfig[status] || statusConfig.AWAITING_VENDOR_CONFIRMATION;
  const sizeClass = sizeClasses[size] || sizeClasses.md;

  return (
    <span
      className={`inline-flex items-center font-semibold rounded-full border ${config.bgClass} ${config.textClass} ${config.borderClass} ${sizeClass}`}
    >
      {config.label}
    </span>
  );
};

export default PurchaseStatusBadge;
