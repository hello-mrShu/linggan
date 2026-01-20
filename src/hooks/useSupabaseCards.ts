import { useState, useEffect, useCallback } from 'react';
import { supabase, Database } from '../supabase';
import { InspirationCard } from '../types';

type CardRow = Database['public']['Tables']['inspiration_cards']['Row'];

export const useSupabaseCards = () => {
  const [cards, setCards] = useState<InspirationCard[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [user, setUser] = useState<any>(null);
  const [loadingCards, setLoadingCards] = useState(false);

  // 获取用户卡片
  const fetchCardsForUser = useCallback(async (userId: string) => {
    if (loadingCards) {
      console.log('Cards loading in progress, skipping...');
      return;
    }
    
    try {
      setLoadingCards(true);
      setError(null);

      const { data, error } = await supabase
        .from('inspiration_cards')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Database error:', error);
        throw error;
      }

      const transformedCards: InspirationCard[] = (data || []).map((card: CardRow) => ({
        id: card.id,
        title: card.title,
        content: card.content || undefined,
        category: card.category,
        imageUrl: card.image_url || undefined,
        timestamp: new Date(card.created_at),
      }));

      setCards(transformedCards);
      console.log('Cards loaded:', transformedCards.length, 'for user:', userId);
    } catch (err: any) {
      console.error('Error fetching cards:', err);
      setError('获取数据失败: ' + err.message);
      setCards([]);
    } finally {
      setLoadingCards(false);
      setLoading(false);
    }
  }, [loadingCards]);

  // 获取当前认证状态和卡片数据
  useEffect(() => {
    let isSubscribed = true;
    
    const initializeData = async () => {
      if (!isSubscribed) return;
      
      try {
        const { data: { session } } = await supabase.auth.getSession();
        const currentUser = session?.user ?? null;
        setUser(currentUser);

        if (currentUser) {
          console.log('Initial auth - user found:', currentUser.id);
          await fetchCardsForUser(currentUser.id);
        } else {
          console.log('Initial auth - no user found');
          setCards([]);
          setLoading(false);
          setError(null);
        }
      } catch (error) {
        console.error('Initialization error:', error);
        setCards([]);
        setLoading(false);
        setError('初始化失败，请刷新页面');
      }
    };

    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        if (!isSubscribed) return;
        
        const currentUser = session?.user ?? null;
        console.log('Auth state changed:', event, currentUser?.email);
        setUser(currentUser);
        
        if (currentUser) {
          await fetchCardsForUser(currentUser.id);
        } else {
          setCards([]);
          setLoading(false);
          setError(null);
        }
      }
    );

    initializeData();

    return () => {
      console.log('Cleaning up auth subscription');
      isSubscribed = false;
      subscription.unsubscribe();
    };
  }, [fetchCardsForUser]);

  // 添加新卡片
  const addCard = async (newCard: Omit<InspirationCard, 'id' | 'timestamp'>) => {
    try {
      const { data, error } = await supabase
        .from('inspiration_cards')
        .insert({
          user_id: user.id,
          title: newCard.title,
          content: newCard.content || null,
          category: newCard.category,
          image_url: newCard.imageUrl || null,
        })
        .select()
        .single();

      if (error) throw error;
      return data;
    } catch (err: any) {
      setError(err.message);
      console.error('Error adding card:', err);
      throw err;
    }
  };

  // 删除卡片
  const deleteCard = async (id: string) => {
    try {
      const { error } = await supabase
        .from('inspiration_cards')
        .delete()
        .eq('id', id);

      if (error) throw error;

      setCards(prev => prev.filter(card => card.id !== id));
    } catch (err: any) {
      setError(err.message);
      console.error('Error deleting card:', err);
      throw err;
    }
  };

  // 用户登录
  const signIn = async (email: string, password: string) => {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) throw error;
      return data;
    } catch (err: any) {
      setError(err.message);
      console.error('Error signing in:', err);
      throw err;
    }
  };

  // 用户注册
  const signUp = async (email: string, password: string) => {
    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
      });

      if (error) throw error;
      return data;
    } catch (err: any) {
      setError(err.message);
      console.error('Error signing up:', err);
      throw err;
    }
  };

  // 用户登出
  const signOut = async () => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
    } catch (err: any) {
      setError(err.message);
      console.error('Error signing out:', err);
      throw err;
    }
  };

  return {
    cards,
    loading,
    error,
    user,
    addCard,
    deleteCard,
    signIn,
    signUp,
    signOut,
  };
};