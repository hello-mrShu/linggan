import React, { useState } from 'react';
import { Trash2, X } from 'lucide-react';
import { InspirationCard } from '../types';

interface CardProps {
  card: InspirationCard;
  onDelete: (id: string) => void;
}

const Card: React.FC<CardProps> = ({ card, onDelete }) => {
  const [isPressed, setIsPressed] = useState(false);
  const [showActions, setShowActions] = useState(false);
  const [pressTimer, setPressTimer] = useState<NodeJS.Timeout | null>(null);
  const formatTime = (date: Date) => {
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    
    if (days === 0) {
      const hours = Math.floor(diff / (1000 * 60 * 60));
      if (hours === 0) {
        const minutes = Math.floor(diff / (1000 * 60));
        return minutes <= 1 ? '刚刚' : `${minutes}分钟前`;
      }
      return `${hours}小时前`;
    } else if (days === 1) {
      return '昨天';
    } else if (days < 7) {
      return `${days}天前`;
    } else {
      return date.toLocaleDateString('zh-CN', { 
        month: 'numeric', 
        day: 'numeric',
        hour: 'numeric',
        minute: '2-digit'
      });
    }
  };

  const getCategoryStyle = (category: string) => {
    switch (category) {
      case 'inspiration':
        return 'bg-primary/10 text-primary';
      case 'practice':
        return 'bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400';
      case 'memo':
        return 'bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400';
      default:
        return 'bg-gray-100 text-gray-600';
    }
  };

  const getCategoryLabel = (category: string) => {
    switch (category) {
      case 'inspiration':
        return '💡 灵感';
      case 'practice':
        return '🛠️ 实操';
      case 'memo':
        return '📝 备忘';
      default:
        return category;
    }
  };

  const handleMouseDown = () => {
    const timer = setTimeout(() => {
      setIsPressed(true);
      setShowActions(true);
    }, 500);
    setPressTimer(timer);
  };

  const handleMouseUp = () => {
    if (pressTimer) {
      clearTimeout(pressTimer);
      setPressTimer(null);
    }
  };

  const handleClick = () => {
    if (showActions) {
      setShowActions(false);
      setIsPressed(false);
    }
  };

  const handleTouchStart = () => {
    const timer = setTimeout(() => {
      setIsPressed(true);
      setShowActions(true);
    }, 500);
    setPressTimer(timer);
  };

  const handleTouchEnd = () => {
    if (pressTimer) {
      clearTimeout(pressTimer);
      setPressTimer(null);
    }
  };

  const handleDelete = () => {
    if (window.confirm('确定要删除这张灵感卡片吗？')) {
      onDelete(card.id);
    }
  };

  return (
    <div className="@container">
      <div className="relative">
        <div 
          className={`flex flex-col items-stretch justify-start rounded-xl bg-white dark:bg-slate-800 custom-shadow overflow-hidden border transition-all ${
            isPressed 
              ? 'border-red-300 dark:border-red-700 shadow-red-200/50 dark:shadow-red-900/20' 
              : 'border-slate-100 dark:border-slate-700'
          } ${
            showActions ? 'transform scale-[0.98] cursor-pointer' : ''
          }`}
          onMouseDown={handleMouseDown}
          onMouseUp={handleMouseUp}
          onMouseLeave={handleMouseUp}
          onTouchStart={handleTouchStart}
          onTouchEnd={handleTouchEnd}
          onClick={handleClick}
        >
          {card.imageUrl && (
            <div 
              className="w-full aspect-[21/9] bg-center bg-no-repeat bg-cover" 
              style={{ backgroundImage: `url(${card.imageUrl})` }}
              title={card.title}
            />
          )}
          <div className="flex w-full flex-col items-stretch justify-center gap-3 p-5">
            <div className="flex items-start justify-between">
              <span className={`px-2.5 py-1 text-xs font-semibold rounded-full uppercase tracking-wide ${getCategoryStyle(card.category)}`}>
                {getCategoryLabel(card.category)}
              </span>
              {showActions && (
                <button
                  onClick={handleDelete}
                  className="p-1.5 rounded-full bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400 hover:bg-red-200 dark:hover:bg-red-900/50 transition-colors"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              )}
            </div>
            <p className="text-slate-800 dark:text-slate-100 text-lg font-semibold leading-relaxed">
              {card.title}
            </p>
            {card.content && (
              <p className="text-slate-600 dark:text-slate-300 text-sm leading-relaxed">
                {card.content}
              </p>
            )}
            <div className="flex items-center justify-end">
              <p className="text-slate-400 dark:text-slate-500 text-xs font-medium">
                {formatTime(card.timestamp)}
              </p>
            </div>
          </div>
        </div>
        
        {showActions && (
          <div className="absolute inset-0 flex items-center justify-center bg-black/60 rounded-xl transition-opacity">
            <div className="text-center">
              <div className="flex gap-6">
                <div className="flex flex-col items-center gap-2">
                  <button
                    onClick={handleDelete}
                    className="w-16 h-16 bg-red-500 text-white rounded-full flex items-center justify-center hover:bg-red-600 transition-colors shadow-lg"
                  >
                    <Trash2 className="w-8 h-8" />
                  </button>
                  <p className="text-white text-sm font-medium">删除</p>
                </div>
                <div className="flex flex-col items-center gap-2">
                  <button
                    onClick={() => {
                      setShowActions(false);
                      setIsPressed(false);
                    }}
                    className="w-16 h-16 bg-slate-600 text-white rounded-full flex items-center justify-center hover:bg-slate-700 transition-colors shadow-lg"
                  >
                    <X className="w-8 h-8" />
                  </button>
                  <p className="text-white text-sm font-medium">取消</p>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Card;