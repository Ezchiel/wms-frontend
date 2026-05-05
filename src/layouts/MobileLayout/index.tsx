import { Outlet, useLocation } from 'react-router-dom';
import Header from './Header';
import NavigationBar from './NavigationBar';

function MobileLayout() {
  const location = useLocation();

  // Get "/mobile/count-and-label"
  const currentPath = location.pathname;

  return (
    <div className="bg-wms-bg min-h-screen pb-24 font-sans">
      {currentPath === '/mobile/count-and-label' || <Header />}
      <Outlet />
      <NavigationBar />
    </div>
  );
}

export default MobileLayout;
