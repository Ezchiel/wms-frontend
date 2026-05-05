import NavItem from './NavItem';

function NavigationBar() {
  return (
    <nav className="fixed bottom-0 left-0 w-full z-50 flex justify-around items-center px-4 pb-6 pt-3 bg-white/95 backdrop-blur-md border-t border-wms-border-color shadow-[0_-4px_20px_rgba(0,0,0,0.02)] rounded-t-2xl">
      <NavItem icon="fa-solid fa-clipboard-list" label="Tasks" active />
      <NavItem icon="fa-solid fa-boxes-stacked" label="Inventory" />
      <NavItem icon="fa-solid fa-qrcode" label="Scan" />
      <NavItem icon="fa-solid fa-user" label="Profile" />
    </nav>
  );
}

export default NavigationBar;
