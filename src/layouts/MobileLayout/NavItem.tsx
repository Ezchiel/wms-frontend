import { Link } from 'react-router-dom';

interface NavItemProps {
  icon: string;
  label: string;
  path: string;
  active?: boolean;
}

function NavItem({ icon, label, path, active = false }: NavItemProps) {
  return (
    <Link
      to={path}
      className={`flex flex-col items-center justify-center px-4 py-2 rounded-xl active:scale-95 transition-all duration-200 ${
        active ? 'bg-wms-primary/10 text-wms-primary' : 'text-wms-muted hover:text-wms-primary'
      }`}
    >
      <i className={`${icon} text-[20px] mb-1.5`}></i>
      <span className="text-[11px] font-semibold tracking-wide">{label}</span>
    </Link>
  );
}

export default NavItem;
