import React from "react";

/**
 * Badge component to display purchase status
 * @param {string} status - Purchase status: "PENDING", "CONFIRMED", or "CANCELLED"
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
    PENDING: {
      label: "Pending",
      bgClass: "bg-yellow-100",
      textClass: "text-yellow-800",
      borderClass: "border-yellow-300"
    },
    CONFIRMED: {
      label: "Confirmed",
      bgClass: "bg-green-100",
      textClass: "text-green-800",
      borderClass: "border-green-300"
    },
    CANCELLED: {
      label: "Cancelled",
      bgClass: "bg-red-100",
      textClass: "text-red-800",
      borderClass: "border-red-300"
    }
  };

  const config = statusConfig[status] || statusConfig.PENDING;
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
