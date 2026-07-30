import React from 'react';
import { Outlet } from 'react-router-dom';
import AppNavbar from '../components/AppNavbar';
import Sidebar from '../components/Sidebar';

const AppLayout = () => {
  return (
    <div className="min-h-screen bg-background">
      <AppNavbar />
      <div className="flex">
        <Sidebar />
        <main className="flex-1 min-w-0 p-4 sm:p-6 lg:p-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default AppLayout;
