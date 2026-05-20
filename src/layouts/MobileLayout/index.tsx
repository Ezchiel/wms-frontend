import { Outlet, useLocation } from 'react-router-dom';
import Header from './Header';
import NavigationBar from './NavigationBar';

function MobileLayout() {
  const location = useLocation();
  const currentPath = location.pathname;

  // No header needed
  const pathsWithoutHeader = ['/mobile/count-and-label', '/mobile/put-away'];
  const shouldHideHeader = pathsWithoutHeader.some((path) => currentPath.startsWith(path));

  return (
    <div className="bg-wms-bg min-h-screen pb-24 font-sans">
      {!shouldHideHeader && <Header />}
      <Outlet />
      <NavigationBar />
    </div>
  );
}

export default MobileLayout;
