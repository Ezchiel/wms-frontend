import { useLocation } from 'react-router-dom';
import { ClipboardList, ClipboardCheck, PackageSearch, QrCode, User } from 'lucide-react';
import NavItem from './NavItem';

function NavigationBar() {
  const location = useLocation();

  return (
    <nav className="fixed bottom-0 left-0 w-full z-50 flex justify-around items-center px-4 pb-6 pt-3 bg-white/95 backdrop-blur-md border-t border-wms-border-color shadow-[0_-4px_20px_rgba(0,0,0,0.02)] rounded-t-2xl">
      <NavItem
        icon={ClipboardList}
        label="Putaway"
        path="/mobile/tasks"
        active={location.pathname === '/mobile/tasks'}
      />
      <NavItem
        icon={ClipboardCheck}
        label="Checks"
        path="/mobile/inventory-check-mobile"
        active={location.pathname === '/mobile/inventory-check-mobile'}
      />
      <NavItem
        icon={PackageSearch}
        label="Picking"
        path="/mobile/picking"
        active={location.pathname === '/mobile/picking'}
      />
      <NavItem
        icon={QrCode}
        label="Scan"
        path="/mobile/scan"
        active={location.pathname === '/mobile/scan'}
      />
      <NavItem
        icon={User}
        label="Profile"
        path="/mobile/profile"
        active={location.pathname === '/mobile/profile'}
      />
    </nav>
  );
}

export default NavigationBar;
