import { useState, useEffect } from 'react';
import { InspirationCard } from '../types';

const STORAGE_KEY = 'inspo-note-cards';

export const useLocalStorage = () => {
  const [cards, setCards] = useState<InspirationCard[]>([]);

  useEffect(() => {
    try {
      const storedCards = localStorage.getItem(STORAGE_KEY);
      if (storedCards) {
        const parsedCards = JSON.parse(storedCards);
        // Convert timestamp strings back to Date objects
        const cardsWithDates = parsedCards.map((card: any) => ({
          ...card,
          timestamp: new Date(card.timestamp),
        }));
        setCards(cardsWithDates);
      } else {
        // If no stored cards, use mock data
        setCards([]);
      }
    } catch (error) {
      console.error('Error loading cards from localStorage:', error);
      setCards([]);
    }
  }, []);

  const saveCards = (newCards: InspirationCard[]) => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(newCards));
      setCards(newCards);
    } catch (error) {
      console.error('Error saving cards to localStorage:', error);
    }
  };

  const addCard = (newCard: Omit<InspirationCard, 'id' | 'timestamp'>) => {
    const card: InspirationCard = {
      ...newCard,
      id: Date.now().toString(),
      timestamp: new Date(),
    };
    const updatedCards = [card, ...cards];
    saveCards(updatedCards);
    return card;
  };

  const deleteCard = (id: string) => {
    const updatedCards = cards.filter(card => card.id !== id);
    saveCards(updatedCards);
  };

  const updateCard = (id: string, updates: Partial<InspirationCard>) => {
    const updatedCards = cards.map(card =>
      card.id === id ? { ...card, ...updates } : card
    );
    saveCards(updatedCards);
  };

  return {
    cards,
    addCard,
    deleteCard,
    updateCard,
    setCards: saveCards,
  };
};