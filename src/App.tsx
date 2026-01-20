import React, { useState } from 'react';
import Header from './components/Header';
import Card from './components/Card';
import Navigation from './components/Navigation';
import FloatingActionButton from './components/FloatingActionButton';
import AddCardModal from './components/AddCardModal';
import AuthModal from './components/AuthModal';
import { ThemeProvider } from './contexts/ThemeContext';
import { useSupabaseCards } from './hooks/useSupabaseCards';
import { InspirationCard } from './types';
import './index.css';

function AppContent() {
  const { 
    cards, 
    addCard, 
    deleteCard, 
    user, 
    signIn, 
    signUp, 
    signOut,
    loading,
    error 
  } = useSupabaseCards();
  
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [activeTab, setActiveTab] = useState<string>('inspiration');
  const [showAddModal, setShowAddModal] = useState<boolean>(false);
  const [showAuthModal, setShowAuthModal] = useState<boolean>(false);

  const filteredCards = selectedCategory === 'all' 
    ? cards 
    : cards.filter(card => card.category === selectedCategory);

  const handleAddCard = () => {
    setShowAddModal(true);
  };

  const handleAddNewCard = async (newCard: Omit<InspirationCard, 'id' | 'timestamp'>) => {
    try {
      await addCard(newCard);
    } catch (error) {
      console.error('添加卡片失败:', error);
    }
  };

  const handleDeleteCard = async (id: string) => {
    try {
      await deleteCard(id);
    } catch (error) {
      console.error('删除卡片失败:', error);
    }
  };

  const handleLogin = async (email: string, password: string) => {
    await signIn(email, password);
    setShowAuthModal(false);
  };

  const handleSignup = async (email: string, password: string) => {
    await signUp(email, password);
    setShowAuthModal(false);
  };

  const handleLogout = async () => {
    await signOut();
  };

  return (
    <div className="bg-background-light dark:bg-background-dark font-display text-slate-900 dark:text-slate-100 min-h-screen">
      <Header 
        selectedCategory={selectedCategory}
        onCategoryChange={setSelectedCategory}
        user={user}
        onLogin={() => setShowAuthModal(true)}
        onLogout={handleLogout}
      />
      
      <main className="px-6 py-2 space-y-6 pb-24">
        {loading ? (
          <div className="text-center py-12">
            <div className="inline-block w-6 h-6 border-2 border-primary border-t-transparent rounded-full animate-spin"></div>
            <p className="text-slate-400 dark:text-slate-500 mt-2">加载中...</p>
          </div>
        ) : error ? (
          <div className="text-center py-12">
            <p className="text-red-500 dark:text-red-400">加载失败: {error}</p>
            <button 
              onClick={() => window.location.reload()} 
              className="mt-2 text-primary hover:text-primary/80"
            >
              重新加载
            </button>
          </div>
        ) : !user ? (
          <div className="text-center py-12">
            <p className="text-slate-400 dark:text-slate-500 text-lg mb-4">
              请登录以查看和管理您的灵感卡片
            </p>
            <button
              onClick={() => setShowAuthModal(true)}
              className="px-6 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors"
            >
              立即登录
            </button>
          </div>
        ) : (
          <>
            {filteredCards.map((card) => (
              <Card key={card.id} card={card} onDelete={handleDeleteCard} />
            ))}
            
            {filteredCards.length === 0 && (
              <div className="text-center py-12">
                <p className="text-slate-400 dark:text-slate-500 text-lg mb-4">
                  还没有灵感卡片
                </p>
                <p className="text-slate-400 dark:text-slate-500 text-sm">
                  点击右下角的 + 按钮添加您的第一张卡片
                </p>
              </div>
            )}
          </>
        )}
      </main>

      {user && (
        <FloatingActionButton onClick={handleAddCard} />
      )}
      
      <AddCardModal
        isOpen={showAddModal}
        onClose={() => setShowAddModal(false)}
        onAddCard={handleAddNewCard}
      />
      
      <AuthModal
        isOpen={showAuthModal}
        onClose={() => setShowAuthModal(false)}
        onSignIn={handleLogin}
        onSignUp={handleSignup}
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
