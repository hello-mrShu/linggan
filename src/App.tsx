import React, { useState } from 'react';
import Header from './components/Header';
import Card from './components/Card';
import Navigation from './components/Navigation';
import FloatingActionButton from './components/FloatingActionButton';
import AddCardModal from './components/AddCardModal';
import { ThemeProvider } from './contexts/ThemeContext';
import { useLocalStorage } from './hooks/useLocalStorage';
import { InspirationCard } from './types';
import './index.css';

function AppContent() {
  const { cards, addCard, deleteCard } = useLocalStorage();
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [activeTab, setActiveTab] = useState<string>('inspiration');
  const [showAddModal, setShowAddModal] = useState<boolean>(false);

  const filteredCards = selectedCategory === 'all' 
    ? cards 
    : cards.filter(card => card.category === selectedCategory);

  const handleAddCard = () => {
    setShowAddModal(true);
  };

  const handleAddNewCard = (newCard: Omit<InspirationCard, 'id' | 'timestamp'>) => {
    addCard(newCard);
  };

  const handleDeleteCard = (id: string) => {
    deleteCard(id);
  };

  return (
    <div className="bg-background-light dark:bg-background-dark font-display text-slate-900 dark:text-slate-100 min-h-screen">
      <Header 
        selectedCategory={selectedCategory}
        onCategoryChange={setSelectedCategory}
      />
      
      <main className="px-6 py-2 space-y-6 pb-24">
        {filteredCards.map((card) => (
          <Card key={card.id} card={card} onDelete={handleDeleteCard} />
        ))}
        
        {filteredCards.length === 0 && (
          <div className="text-center py-12">
            <p className="text-slate-400 dark:text-slate-500">暂无灵感卡片</p>
          </div>
        )}
      </main>

      <FloatingActionButton onClick={handleAddCard} />
      
      <AddCardModal
        isOpen={showAddModal}
        onClose={() => setShowAddModal(false)}
        onAddCard={handleAddNewCard}
      />
      
      <Navigation 
        activeTab={activeTab}
        onTabChange={setActiveTab}
      />
    </div>
  );
}

function App() {
  return (
    <ThemeProvider>
      <AppContent />
    </ThemeProvider>
  );
}

export default App;
