import { Outlet } from 'react-router-dom';
import NavigationBar from './NavigationBar';

function MobileLayout() {
  return (
    <div className="bg-wms-bg min-h-screen pb-24 font-sans">
      <Outlet />
      <NavigationBar />
    </div>
  );
}

export default MobileLayout;
