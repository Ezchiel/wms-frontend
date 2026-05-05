function Header() {
  return (
    <header className="flex items-center justify-between px-5 py-4 w-full sticky top-0 z-50 bg-white/95 backdrop-blur-md border-b border-wms-border-color shadow-sm">
      <div className="flex items-center gap-3">
        <button className="text-wms-text-main w-9 h-9 active:opacity-70 bg-wms-bg rounded-full flex items-center justify-center">
          <i className="fa-solid fa-bars text-[18px]"></i>
        </button>
        <h1 className="font-bold text-wms-text-main text-[17px]">Warehouse Tasks</h1>
      </div>
      <button className="text-wms-text-main w-9 h-9 active:opacity-70 bg-wms-bg rounded-full flex items-center justify-center relative">
        <i className="fa-regular fa-bell text-[18px]"></i>
        <span className="absolute top-2 right-2.5 w-2 h-2 bg-red-500 rounded-full border border-white"></span>
      </button>
    </header>
  );
}

export default Header;
