import React from 'react';
import { Grid3x3, Compass, User } from 'lucide-react';

interface NavigationProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
}

const Navigation: React.FC<NavigationProps> = ({ activeTab, onTabChange }) => {
  const tabs = [
    { id: 'inspiration', label: '灵感', icon: Grid3x3 },
    { id: 'explore', label: '发现', icon: Compass },
    { id: 'profile', label: '我的', icon: User },
  ];

  return (
    <nav className="fixed bottom-0 w-full bg-white/90 dark:bg-slate-900/90 backdrop-blur-lg border-t border-slate-200 dark:border-slate-800 px-6 py-2 pb-6 flex justify-around items-center z-30">
      {tabs.map((tab) => {
        const Icon = tab.icon;
        const isActive = activeTab === tab.id;
        
        return (
          <button
            key={tab.id}
            onClick={() => onTabChange(tab.id)}
            className={`flex flex-col items-center gap-1 transition-colors ${
              isActive 
                ? 'text-primary' 
                : 'text-slate-400 dark:text-slate-500'
            }`}
          >
            <Icon className={`w-5 h-5 ${isActive ? 'fill-1' : ''}`} />
            <span className="text-[10px] font-medium">{tab.label}</span>
          </button>
        );
      })}
    </nav>
  );
};

export default Navigation;