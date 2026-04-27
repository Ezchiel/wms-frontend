import React from 'react';
import { Outlet } from 'react-router-dom';
import Header from './Header';
import NavigationBar from './NavigationBar';

const AdminLayout: React.FC = () => {
  return (
    <div className="flex h-screen bg-wms-bg text-wms-text-main">
      <NavigationBar />
      <div className="w-full pb-15 overflow-auto">
        <Header />
        <Outlet />
      </div>
    </div>
  );
};

export default AdminLayout;
