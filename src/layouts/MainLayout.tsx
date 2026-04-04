import React from 'react';
import { Outlet } from 'react-router-dom';
import Header from '../components/common/Header';
import NavigationBar from '../components/common/NavigationBar';

const MainLayout: React.FC = () => {
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

export default MainLayout;
