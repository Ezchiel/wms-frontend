import { Link } from 'react-router-dom';
import type { LucideIcon } from 'lucide-react';

interface NavItemProps {
  icon: LucideIcon;
  label: string;
  path: string;
  active?: boolean;
}

function NavItem({ icon: Icon, label, path, active = false }: NavItemProps) {
  return (
    <Link
      to={path}
      className={`flex flex-col items-center justify-center px-4 py-2 rounded-xl active:scale-95 transition-all duration-200 ${
        active ? 'bg-wms-primary/10 text-wms-primary' : 'text-wms-muted hover:text-wms-primary'
      }`}
    >
      <Icon className="w-5 h-5 mb-1.5" />
      <span className="text-[11px] font-semibold tracking-wide">{label}</span>
    </Link>
  );
}

export default NavItem;
