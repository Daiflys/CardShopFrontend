import React from "react";
import { NavLink, Outlet } from "react-router-dom";

const tabs = [
  { to: "/account/profile", label: "Account / Profile" },
  { to: "/account/transactions", label: "Transactions" },
  { to: "/account/addresses", label: "Addresses" },
  { to: "/account/settings", label: "Settings" },
];

const AccountLayout = () => {
  return (
    <div className="px-6 py-8">
      <h1 className="text-2xl font-bold text-gray-900 mb-4">My account</h1>
      <div className="bg-white rounded-lg border shadow-sm">
        <div className="border-b px-4">
          <nav className="flex gap-4 overflow-x-auto py-3">
            {tabs.map(tab => (
              <NavLink
                key={tab.to}
                to={tab.to}
                className={({ isActive }) => `px-3 py-2 rounded-md text-sm font-medium ${isActive ? 'bg-blue-100 text-blue-800' : 'text-gray-700 hover:bg-gray-50'}`}
              >
                {tab.label}
              </NavLink>
            ))}
          </nav>
        </div>
        <div className="p-4">
          <Outlet />
        </div>
      </div>
    </div>
  );
};

export default AccountLayout;


