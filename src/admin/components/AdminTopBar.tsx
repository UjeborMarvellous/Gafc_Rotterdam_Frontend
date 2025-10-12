import React, { useState } from 'react';
import { Menu, Search, Bell, User, ChevronDown, Settings, LogOut } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';

interface AdminTopBarProps {
  onMenuClick: () => void;
}

const AdminTopBar: React.FC<AdminTopBarProps> = ({ onMenuClick }) => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [showUserMenu, setShowUserMenu] = useState(false);

  return (
    <div className="sticky top-0 z-30 bg-white border-b border-slate-200 shadow-sm">
      <div className="px-5 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-14 sm:h-16">
          {/* Left side */}
          <div className="flex items-center gap-3">
            <button
              onClick={onMenuClick}
              className="lg:hidden p-1.5 rounded-lg text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition-colors duration-200"
            >
              <Menu className="w-5 h-5 sm:w-6 sm:h-6" />
            </button>

            {/* Title on mobile */}
            <h1 className="lg:hidden text-base sm:text-lg font-bold text-slate-900">Admin Panel</h1>

            {/* Search - Desktop only */}
            <div className="hidden md:block">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input
                  type="text"
                  placeholder="Search..."
                  className="w-48 lg:w-64 pl-10 pr-4 py-2 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200"
                />
              </div>
            </div>
          </div>

          {/* Right side */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* Notifications */}
            <button className="relative p-1.5 sm:p-2 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition-colors duration-200">
              <Bell className="w-4 h-4 sm:w-5 sm:h-5" />
              <span className="absolute top-0.5 right-0.5 sm:top-1 sm:right-1 w-2 h-2 bg-red-500 rounded-full"></span>
            </button>

            {/* User menu */}
            <div className="relative">
              <button
                onClick={() => setShowUserMenu(!showUserMenu)}
                className="flex items-center gap-2 p-1.5 sm:p-2 rounded-lg hover:bg-slate-100 transition-colors duration-200"
              >
                <div className="w-7 h-7 sm:w-8 sm:h-8 bg-gradient-to-br from-blue-500 to-blue-700 rounded-full flex items-center justify-center">
                  <User className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-white" />
                </div>
                <div className="hidden md:block text-left">
                  <p className="text-sm font-medium text-slate-900">
                    {user?.name || 'Admin User'}
                  </p>
                  <p className="text-xs text-slate-500">Administrator</p>
                </div>
                <ChevronDown className="hidden sm:block w-4 h-4 text-slate-400" />
              </button>

              {/* Dropdown menu */}
              {showUserMenu && (
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-slate-200 py-1 z-50">
                  <a
                    href="#"
                    className="flex items-center space-x-3 px-4 py-2 text-sm text-slate-700 hover:bg-slate-100 transition-colors duration-200"
                  >
                    <User className="w-4 h-4" />
                    <span>Profile</span>
                  </a>
                  <a
                    href="#"
                    className="flex items-center space-x-3 px-4 py-2 text-sm text-slate-700 hover:bg-slate-100 transition-colors duration-200"
                  >
                    <Settings className="w-4 h-4" />
                    <span>Settings</span>
                  </a>
                  <div className="border-t border-slate-200 my-1"></div>
                  <button
                    onClick={() => {
                      logout();
                      setShowUserMenu(false);
                      navigate('/admin/login');
                    }}
                    className="flex items-center space-x-3 w-full px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors duration-200"
                  >
                    <LogOut className="w-4 h-4" />
                    <span>Sign Out</span>
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminTopBar;
