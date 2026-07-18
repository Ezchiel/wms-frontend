import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';

interface PageHeaderProps {
  title: string;
  subtitle?: React.ReactNode;
  backTo?: string | (() => void);
  rightSlot?: React.ReactNode;
}

const PageHeader: React.FC<PageHeaderProps> = ({
  title,
  subtitle,
  backTo,
  rightSlot,
}) => {
  const navigate = useNavigate();

  const handleBackClick = () => {
    if (typeof backTo === 'function') {
      backTo();
    } else if (typeof backTo === 'string') {
      navigate(backTo);
    } else {
      navigate(-1);
    }
  };

  return (
    <header className="flex items-center justify-between px-5 py-4 w-full sticky top-0 z-50 bg-white/95 backdrop-blur-md border-b border-wms-border-color shadow-sm">
      <div className="flex items-center gap-3">
        {backTo !== undefined && (
          <button
            onClick={handleBackClick}
            className="text-wms-text-main w-9 h-9 active:opacity-70 bg-wms-bg rounded-full flex items-center justify-center transition-colors hover:bg-wms-border-color shrink-0 cursor-pointer"
          >
            <ArrowLeft className="w-[18px] h-[18px]" />
          </button>
        )}
        <div>
          <h1 className="font-bold text-wms-text-main text-[17px] leading-tight">
            {title}
          </h1>
          {subtitle && (
            <div className="text-[11px] text-wms-primary font-semibold -mt-0.5">
              {subtitle}
            </div>
          )}
        </div>
      </div>
      {rightSlot && <div className="flex items-center gap-2">{rightSlot}</div>}
    </header>
  );
};

export default PageHeader;
