export interface InspirationCard {
  id: string;
  title: string;
  category: 'inspiration' | 'practice' | 'memo';
  content?: string;
  imageUrl?: string;
  timestamp: Date;
}

export interface Category {
  id: string;
  name: string;
  label: string;
  color: string;
  bgColor: string;
  textColor: string;
}

export const CATEGORIES: Category[] = [
  {
    id: 'all',
    name: '全部',
    label: '全部',
    color: 'primary',
    bgColor: 'bg-primary',
    textColor: 'text-white',
  },
  {
    id: 'inspiration',
    name: '灵感',
    label: '💡 灵感',
    color: 'primary',
    bgColor: 'bg-primary/10',
    textColor: 'text-primary',
  },
  {
    id: 'practice',
    name: '实操',
    label: '🛠️ 实操',
    color: 'green',
    bgColor: 'bg-green-100 dark:bg-green-900/30',
    textColor: 'text-green-600 dark:text-green-400',
  },
  {
    id: 'memo',
    name: '备忘',
    label: '📝 备忘',
    color: 'purple',
    bgColor: 'bg-purple-100 dark:bg-purple-900/30',
    textColor: 'text-purple-600 dark:text-purple-400',
  },
];