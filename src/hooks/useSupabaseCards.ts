import { useState, useEffect } from 'react';
import { supabase } from '../supabase';
import { InspirationCard } from '../types';

export const useSupabaseCards = () => {
  const [cards, setCards] = useState<InspirationCard[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [user, setUser] = useState<any>(null);



  // 简单的认证检查
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        if (session?.user) {
          console.log('User session found:', session.user.email);
          setUser(session.user);
          
          // 只有在未初始化时才加载卡片
          if (!isInitialized) {
            await loadCards(session.user.id);
            setIsInitialized(true);
          }
        } else {
          console.log('No user session found');
          setUser(null);
          setCards([]);
          setLoading(false);
          setIsInitialized(true);
        }
      } catch (error) {
        console.error('Auth check failed:', error);
        setError('认证检查失败');
        setCards([]);
        setLoading(false);
        setIsInitialized(true);
      }
    };

    checkAuth();

    // 监听认证状态变化，但减少不必要的重新加载
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        console.log('Auth state event:', event, 'user:', session?.user?.email);
        
        if (event === 'SIGNED_IN' && session?.user) {
          console.log('User signed in:', session.user.email);
          setUser(session.user);
          if (!isInitialized) {
            await loadCards(session.user.id);
            setIsInitialized(true);
          }
        } else if (event === 'SIGNED_OUT') {
          console.log('User signed out');
          setUser(null);
          setCards([]);
          setLoading(false);
        } else if (event === 'TOKEN_REFRESHED') {
          console.log('Token refreshed for:', session?.user?.email);
          // 保持当前状态，不重新加载
        }
      }
    );

    return () => {
      console.log('Cleaning up auth subscription');
      subscription.unsubscribe();
    };
  }, []);

  // 加载卡片数据
  const loadCards = async (userId: string) => {
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
      console.log('Cards loaded successfully:', transformedCards.length);
    } catch (err: any) {
      console.error('Error loading cards:', err);
      setError('数据加载失败');
      setCards([]);
    } finally {
      setLoading(false);
    }
  };

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
      setError('添加卡片失败');
      throw err;
    }
  };

  // 删除卡片
  const deleteCard = async (id: string) => {
    if (!user) throw new Error('用户未登录');
    
    try {
      const { error } = await supabase
        .from('inspiration_cards')
        .delete()
        .eq('id', id);

      if (error) throw error;
      
      setCards(prev => prev.filter(card => card.id !== id));
      console.log('Card deleted successfully:', id);
    } catch (err: any) {
      setError('删除卡片失败');
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
      console.log('User signed in successfully:', email);
      return data;
    } catch (err: any) {
      setError('登录失败');
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
      
      console.log('User signed up successfully:', email);
      return data;
    } catch (err: any) {
      setError('注册失败');
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
      setIsInitialized(false);
      console.log('User signed out successfully');
    } catch (err: any) {
      setError('登出失败');
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