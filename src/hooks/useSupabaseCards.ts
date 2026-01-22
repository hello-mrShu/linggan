import { useState, useEffect } from 'react';
import { supabase } from '../supabase';
import { InspirationCard } from '../types';

export const useSupabaseCards = () => {
  const [cards, setCards] = useState<InspirationCard[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [user, setUser] = useState<any>(null);

  // 获取用户卡片
  const fetchCards = async (userId: string) => {
    try {
      setLoading(true);
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

      const transformedCards: InspirationCard[] = (data || []).map((card: any) => ({
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
      setLoading(false);
    }
  };

  // 检查初始认证状态
  useEffect(() => {
    const initializeAuth = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        console.log('Session check:', session?.user?.email);
        
        if (session?.user) {
          setUser(session.user);
          await fetchCards(session.user.id);
        } else {
          setUser(null);
          setCards([]);
          setLoading(false);
        }
      } catch (error) {
        console.error('Auth initialization error:', error);
        setUser(null);
        setCards([]);
        setLoading(false);
        setError('认证初始化失败');
      }
    };

    initializeAuth();

    // 改进的认证状态监听
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        console.log('Auth event:', event, session?.user?.email);
        
        if (event === 'SIGNED_IN' && session?.user) {
          setUser(session.user);
          await fetchCards(session.user.id);
        } else if (event === 'SIGNED_OUT') {
          setUser(null);
          setCards([]);
          setLoading(false);
          setError(null);
        } else if (event === 'TOKEN_REFRESHED') {
          // Token刷新，保持当前登录状态
          console.log('Token refreshed, maintaining current auth state');
        }
      }
    );

    return () => {
      console.log('Unsubscribing from auth changes');
      subscription.unsubscribe();
    };
  }, []);

  // 添加新卡片
  const addCard = async (newCard: Omit<InspirationCard, 'id' | 'timestamp'>) => {
    if (!user) throw new Error('用户未登录');
    
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
      
      const transformedCard: InspirationCard = {
        id: data.id,
        title: data.title,
        content: data.content || undefined,
        category: data.category,
        imageUrl: data.image_url || undefined,
        timestamp: new Date(data.created_at),
      };

      setCards(prev => [transformedCard, ...prev]);
      return transformedCard;
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
      setUser(data.user);
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
      
      setUser(null);
      setCards([]);
      setLoading(false);
      setError(null);
    } catch (err: any) {
      setError(err.message);
      console.error('Error signing out:', err);
      throw err;
    }
  };

  // 手动重试加载
  const retryLoad = async () => {
    if (user) {
      console.log('Manual retry: attempting to reload cards');
      try {
        await fetchCards(user.id);
      } catch (error) {
        console.error('Retry failed:', error);
      }
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
    retryLoad,
  };
};