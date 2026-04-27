import React, { useState } from 'react';
import { NavLink, useLocation } from 'react-router-dom';

interface NavItem {
  icon: string;
  title: string;
  subItems: {
    title: string;
    path: string;
  }[];
}

const NavigationBar: React.FC = () => {
  const location = useLocation();

  const navItem: NavItem[] = [
    {
      icon: 'fa-brands fa-buffer',
      title: 'Management',
      subItems: [
        { title: 'Users', path: '/users' },
        { title: 'Product groups', path: '/product-groups' },
        { title: 'Products', path: '/products' },
        { title: 'Partners', path: '/partners' },
        { title: 'Storage location', path: '/storage-locations' },
      ],
    },
    {
      icon: 'fa-solid fa-briefcase',
      title: 'Operations',
      subItems: [
        { title: 'Inventory stocks', path: '/inventory-stocks' },
        { title: 'Inventory receipts', path: '/inventory-receipts' },
        { title: 'Inventory issues', path: '/inventory-issues' },
        { title: 'Inventory checks', path: '/inventory-checks' },
        { title: 'Inventory transactions', path: '/inventory-transactions' },
      ],
    },
    {
      icon: 'fa-solid fa-chart-area',
      title: 'Reports & Analytics',
      subItems: [{ title: 'Dashboard', path: '/dashboard' }],
    },
  ];

  const [openIndices, setOpenIndices] = useState<number[]>(() => {
    const activeIndices: number[] = [];
    navItem.forEach((item, index) => {
      if (item.subItems.some((sub) => sub.path === location.pathname)) {
        activeIndices.push(index);
      }
    });
    return activeIndices;
  });

  const handleToggle = (index: number) => {
    setOpenIndices((prev) =>
      prev.includes(index) ? prev.filter((i) => i !== index) : [...prev, index]
    );
  };

  return (
    <nav className="h-full w-65 fixed bg-wms-dark text-white flex flex-col rounded-r-4xl overflow-hidden z-10">
      <div className="bg-wms-primary text-white text-[24px] text-center font-bold p-3 rounded-r-4xl tracking-[2px] shrink-0 z-10">
        WMS
      </div>
      <ul
        className="list-none text-wms-muted flex-1 overflow-x-hidden overflow-y-[overlay]
        [&::-webkit-scrollbar]:w-1.5
        [&::-webkit-scrollbar-track]:bg-transparent
        [&::-webkit-scrollbar-thumb]:bg-white/20
        [&::-webkit-scrollbar-thumb]:rounded-full
        hover:[&::-webkit-scrollbar-thumb]:bg-white/30"
      >
        {navItem.map((element, index) => {
          const isOpen = openIndices.includes(index);

          return (
            <li key={index} className="flex flex-col">
              {/* --- NAV ITEM --- */}
              <div
                onClick={() => handleToggle(index)}
                className={`py-5 px-6.25 flex items-center justify-between cursor-pointer text-[14px] transition-all duration-300 hover:text-white ${isOpen ? 'text-white bg-white/5' : ''}`}
              >
                <div className="flex items-center gap-3.75">
                  <i className={element.icon}></i>
                  <span>{element.title}</span>
                </div>
                <i
                  className={`fa-solid fa-chevron-down transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`}
                ></i>
              </div>

              {/* --- SUB ITEM --- */}
              <div
                className={`overflow-hidden transition-all duration-500 ease-in-out ${isOpen ? 'max-h-125 opacity-100' : 'max-h-0 opacity-0'}`}
              >
                <ul className="flex flex-col list-none bg-black/10">
                  {element.subItems.map((sub, subIndex) => (
                    <li key={subIndex}>
                      <NavLink
                        to={sub.path}
                        className={({ isActive }) =>
                          `block py-3 pl-13 pr-6 cursor-pointer text-[13px] rounded-r-4xl transition-colors duration-200 ${isActive ? 'bg-blue-600 text-white font-medium' : 'text-wms-muted hover:text-white'}`
                        }
                      >
                        {sub.title}
                      </NavLink>
                    </li>
                  ))}
                </ul>
              </div>
            </li>
          );
        })}
      </ul>
    </nav>
  );
};

export default NavigationBar;
