import { Outlet, useLocation } from 'react-router-dom';
import Header from './Header';
import NavigationBar from './NavigationBar';

function MobileLayout() {
  const location = useLocation();
  const currentPath = location.pathname;

  // Check URL '/mobile/count-and-label'
  const isCountingPage = currentPath.startsWith('/mobile/count-and-label');

  return (
    <div className="bg-wms-bg min-h-screen pb-24 font-sans">
      {!isCountingPage && <Header />}
      <Outlet />
      <NavigationBar />
    </div>
  );
}

export default MobileLayout;
