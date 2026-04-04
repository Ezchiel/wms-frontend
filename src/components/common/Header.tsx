import type React from 'react';

const Header: React.FC = () => {
  return (
    <header className="w-full pr-10 pt-5 flex justify-end items-center gap-5 mb-5">
      <button className="bg-white w-10 h-10 rounded-[50%] flex items-center justify-center text-wms-muted cursor-pointer shadow-[0_2px_5px_rgba(0,0,0,0.05)">
        <i className="fa-solid fa-magnifying-glass"></i>
      </button>
      <button className="bg-white w-10 h-10 rounded-[50%] flex items-center justify-center text-wms-muted cursor-pointer shadow-[0_2px_5px_rgba(0,0,0,0.05)">
        <i className="fa-regular fa-bell"></i>
      </button>
      <div className="flex items-center gap-2.5 text-[14px] font-medium cursor-pointer">
        <img
          className="w-8.75 h-8.75 rounded-[50%] object-cover"
          src="https://i.pinimg.com/736x/d4/68/b9/d468b96d92d70507f0b9b4b8e56e8b05.jpg"
          alt="Frieren"
        />
        <span>Frieren</span>
        <i className="fa-solid fa-ellipsis-vertical ml-2.5 text-wms-muted"></i>
      </div>
    </header>
  );
};

export default Header;
