import React from 'react';
import { Search, MoreHorizontal, Sun, Moon } from 'lucide-react';
import { CATEGORIES } from '../types';
import { useTheme } from '../contexts/ThemeContext';

interface HeaderProps {
  selectedCategory: string;
  onCategoryChange: (categoryId: string) => void;
}

const Header: React.FC<HeaderProps> = ({ selectedCategory, onCategoryChange }) => {
  const { theme, toggleTheme } = useTheme();

  return (
    <header className="sticky top-0 z-30 bg-background-light/80 dark:bg-background-dark/80 backdrop-blur-md border-b border-transparent">
      <div className="flex items-center justify-between px-6 py-4">
        <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">我的灵感</h1>
        <div className="flex gap-2">
          <button className="p-2 rounded-full hover:bg-white/50 dark:hover:bg-white/10 transition-colors">
            <Search className="w-5 h-5 text-slate-600 dark:text-slate-400" />
          </button>
          <button 
            onClick={toggleTheme}
            className="p-2 rounded-full hover:bg-white/50 dark:hover:bg-white/10 transition-colors"
          >
            {theme === 'light' ? (
              <Moon className="w-5 h-5 text-slate-600 dark:text-slate-400" />
            ) : (
              <Sun className="w-5 h-5 text-slate-600 dark:text-slate-400" />
            )}
          </button>
          <button className="p-2 rounded-full hover:bg-white/50 dark:hover:bg-white/10 transition-colors">
            <MoreHorizontal className="w-5 h-5 text-slate-600 dark:text-slate-400" />
          </button>
        </div>
      </div>
      
      {/* Category Filter Chips */}
      <div className="flex gap-3 px-6 pb-4 overflow-x-auto no-scrollbar">
        {CATEGORIES.map((category) => (
          <button
            key={category.id}
            onClick={() => onCategoryChange(category.id)}
            className={`flex h-9 shrink-0 items-center justify-center rounded-full px-5 shadow-sm transition-colors ${
              selectedCategory === category.id
                ? category.bgColor + ' ' + category.textColor
                : 'bg-white dark:bg-slate-800 custom-shadow border border-slate-100 dark:border-slate-700 text-slate-700 dark:text-slate-300'
            }`}
          >
            <p className="text-sm font-medium">{category.label}</p>
          </button>
        ))}
      </div>
    </header>
  );
};

export default Header;