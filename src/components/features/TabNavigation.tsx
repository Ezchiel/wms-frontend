import type React from 'react';

interface TabNavigationProps {
  tabs: string[];
  getTabColor: (index: number) => string;
  onTabChange: (newIndex: number) => void;
  activeTabIndex: number;
}

const TabNavigation: React.FC<TabNavigationProps> = ({
  tabs,
  getTabColor,
  onTabChange,
  activeTabIndex,
}) => {
  return (
    <div className="flex">
      {tabs.map((element, index) => (
        <button
          className="relative h-12 w-40 flex items-center justify-center -mr-6 group cursor-pointer"
          style={{ zIndex: index === activeTabIndex ? 50 : tabs.length - index }}
          key={index}
          onClick={() => onTabChange(index)}
        >
          {index === 0 ? (
            <svg
              className="absolute inset-0 w-full h-full"
              style={{ color: getTabColor(index) }}
              preserveAspectRatio="none"
              width="160"
              height="48"
              viewBox="0 0 160 48"
              fill="currentColor"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M0 12C0 5.37258 5.37258 0 12 0H130.631C136.137 0 140.937 3.74757 142.272 9.08957L149.382 37.5286C150.683 42.7311 154.78 46.7717 160 48H1C0.447719 48 0 47.5523 0 47V12Z"
                fill="currentColor"
              />
            </svg>
          ) : (
            <svg
              className="absolute inset-0 w-full h-full"
              style={{ color: getTabColor(index) }}
              preserveAspectRatio="none"
              width="220"
              height="48"
              viewBox="0 0 220 48"
              fill="currentColor"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M21.8492 8.49337C23.3912 3.44698 28.0487 0 33.3255 0H186.675C191.951 0 196.609 3.44698 198.151 8.49338L206.52 35.8821C208.421 42.1066 213.609 46.7696 220 48H0C6.39123 46.7696 11.5785 42.1066 13.4805 35.8821L21.8492 8.49337Z"
                fill="currentColor"
              />
            </svg>
          )}
          <span className={`relative z-10 text-[14px] ${index === 0 ? 'pr-3' : ''}`}>
            {element}
          </span>
        </button>
      ))}
    </div>
  );
};

export default TabNavigation;
