import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { GraduationCap, Bell, ChevronDown, LogOut } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const AppNavbar = () => {
  const { user, logout } = useAuth();
  const [menuOpen, setMenuOpen] = useState(false);

  const initials = user?.fullName
    ? user.fullName.split(' ').slice(0, 2).map((n) => n[0]).join('').toUpperCase()
    : 'U';

  return (
    <header className="sticky top-0 z-40 h-16 bg-white border-b border-slate-100">
      <div className="h-full px-4 sm:px-6 flex items-center justify-between">
        <Link to="/dashboard" className="flex items-center gap-2">
          <div className="h-9 w-9 rounded-xl bg-primary flex items-center justify-center">
            <GraduationCap className="text-white h-5 w-5" />
          </div>
          <span className="font-bold text-slate-800 text-lg hidden sm:inline">UpBridge Rwanda</span>
        </Link>

        <div className="flex items-center gap-4">
          <button className="text-slate-500 hover:text-slate-700" aria-label="Notifications">
            <Bell className="h-5 w-5" />
          </button>

          <div className="relative">
            <button
              onClick={() => setMenuOpen((o) => !o)}
              className="flex items-center gap-2 text-sm font-medium text-slate-700"
            >
              <div className="h-8 w-8 rounded-full bg-primary/10 text-primary flex items-center justify-center text-xs font-bold">
                {initials}
              </div>
              <span className="hidden sm:inline">{user?.fullName?.split(' ')[0]}</span>
              <ChevronDown className="h-4 w-4 text-slate-400" />
            </button>

            {menuOpen && (
              <div className="absolute right-0 mt-2 w-44 bg-white rounded-xl shadow-lg border border-slate-100 py-1.5">
                <Link
                  to="/profile"
                  onClick={() => setMenuOpen(false)}
                  className="block px-4 py-2 text-sm text-slate-600 hover:bg-slate-50"
                >
                  My Profile
                </Link>
                <button
                  onClick={logout}
                  className="w-full text-left flex items-center gap-2 px-4 py-2 text-sm text-red-500 hover:bg-red-50"
                >
                  <LogOut className="h-4 w-4" /> Log Out
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default AppNavbar;
