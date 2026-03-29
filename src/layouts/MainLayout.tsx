import React from 'react';
import { Outlet } from 'react-router-dom';
import Header from '../components/Header';
import NavigationBar from '../components/NavigationBar';

const MainLayout: React.FC = () => {
  return (
    <div className="flex h-screen bg-wms-bg text-wms-text-main">
      <NavigationBar />
      <div className="w-full">
        <Header />
        <Outlet />
      </div>
    </div>
  );
};

export default MainLayout;
