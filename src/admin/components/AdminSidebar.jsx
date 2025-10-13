import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';

const AdminSidebar = ({ isCollapsed, setIsCollapsed }) => {
  const location = useLocation();

  const menuItems = [
    {
      title: 'Main',
      items: [
        { title: 'Dashboard', path: '/admin', icon: '📊' },
      ]
    },
    {
      title: 'Data',
      items: [
        { title: 'Bulk Upload', path: '/admin/bulk-upload', icon: '📤' },
        { title: 'Manage Cards', path: '/admin/manage-cards', icon: '🃏' },
        { title: 'Manage Users', path: '/admin/users', icon: '👥' },
      ]
    },
    {
      title: 'Reports',
      items: [
        { title: 'Sales Overview', path: '/admin/sales', icon: '💰' },
        { title: 'Inventory', path: '/admin/inventory', icon: '📦' },
      ]
    }
  ];

  return (
    <div className={`bg-slate-900 text-white h-screen transition-all duration-300 ${isCollapsed ? 'w-20' : 'w-64'} flex flex-col`}>
      {/* Header */}
      <div className="p-4 flex items-center justify-between border-b border-slate-700">
        {!isCollapsed && (
          <div>
            <h1 className="text-xl font-bold text-blue-400">Admin Panel</h1>
            <p className="text-xs text-gray-400">CardMarket</p>
          </div>
        )}
        <button
          onClick={() => setIsCollapsed(!isCollapsed)}
          className="p-2 hover:bg-slate-800 rounded transition-colors"
        >
          {isCollapsed ? '➡️' : '⬅️'}
        </button>
      </div>

      {/* User Info */}
      {!isCollapsed && (
        <div className="p-4 border-b border-slate-700">
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 bg-blue-500 rounded-full flex items-center justify-center text-xl">
              👤
            </div>
            <div>
              <p className="font-semibold">Admin User</p>
              <p className="text-xs text-gray-400">Administrator</p>
            </div>
          </div>
        </div>
      )}

      {/* Menu Items */}
      <nav className="flex-1 overflow-y-auto py-4">
        {menuItems.map((section, idx) => (
          <div key={idx} className="mb-6">
            {!isCollapsed && (
              <h3 className="px-4 mb-2 text-xs font-semibold text-gray-400 uppercase">
                {section.title}
              </h3>
            )}
            <div className="space-y-1">
              {section.items.map((item, itemIdx) => {
                const isActive = location.pathname === item.path;
                return (
                  <Link
                    key={itemIdx}
                    to={item.path}
                    className={`flex items-center px-4 py-3 transition-colors ${
                      isActive
                        ? 'bg-blue-600 text-white'
                        : 'text-gray-300 hover:bg-slate-800'
                    }`}
                    title={isCollapsed ? item.title : ''}
                  >
                    <span className="text-xl">{item.icon}</span>
                    {!isCollapsed && (
                      <span className="ml-3 font-medium">{item.title}</span>
                    )}
                  </Link>
                );
              })}
            </div>
          </div>
        ))}
      </nav>

      {/* Footer */}
      <div className="p-4 border-t border-slate-700">
        <Link
          to="/"
          className="flex items-center px-4 py-2 text-gray-300 hover:bg-slate-800 rounded transition-colors"
          title={isCollapsed ? 'Back to Site' : ''}
        >
          <span className="text-xl">🏠</span>
          {!isCollapsed && <span className="ml-3">Back to Site</span>}
        </Link>
      </div>
    </div>
  );
};

export default AdminSidebar;
