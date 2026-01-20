import { useState, useEffect } from 'react';
import { supabase, Database } from '../supabase';
import { InspirationCard } from '../types';

type CardRow = Database['public']['Tables']['inspiration_cards']['Row'];

export const useSupabaseCards = () => {
  const [cards, setCards] = useState<InspirationCard[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [user, setUser] = useState<any>(null);

  // 监听认证状态
  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        setUser(session?.user ?? null);
        if (session?.user) {
          await fetchCards();
        } else {
          setCards([]);
          setLoading(false);
        }
      }
    );

    return () => subscription.unsubscribe();
  }, []);

  // 获取用户卡片
  const fetchCards = async () => {
    try {
      setLoading(true);
      setError(null);

      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        setCards([]);
        setLoading(false);
        return;
      }

      const { data, error } = await supabase
        .from('inspiration_cards')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (error) throw error;

      const transformedCards: InspirationCard[] = data.map((card: CardRow) => ({
        id: card.id,
        title: card.title,
        content: card.content || undefined,
        category: card.category,
        imageUrl: card.image_url || undefined,
        timestamp: new Date(card.created_at),
      }));

      setCards(transformedCards);
    } catch (err: any) {
      setError(err.message);
      console.error('Error fetching cards:', err);
    } finally {
      setLoading(false);
    }
  };

  // 添加新卡片
  const addCard = async (newCard: Omit<InspirationCard, 'id' | 'timestamp'>) => {
    try {
      if (!user) throw new Error('用户未登录');

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

  // 更新卡片
  const updateCard = async (id: string, updates: Partial<InspirationCard>) => {
    try {
      const updateData: any = {};
      if (updates.title) updateData.title = updates.title;
      if (updates.content !== undefined) updateData.content = updates.content || null;
      if (updates.category) updateData.category = updates.category;
      if (updates.imageUrl !== undefined) updateData.image_url = updates.imageUrl || null;

      const { data, error } = await supabase
        .from('inspiration_cards')
        .update(updateData)
        .eq('id', id)
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

      setCards(prev => prev.map(card => card.id === id ? transformedCard : card));
      return transformedCard;
    } catch (err: any) {
      setError(err.message);
      console.error('Error updating card:', err);
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
      
      // 注册成功后自动登录
      if (data.user && !data.session) {
        // 邮件验证需要的情况
        throw new Error('注册成功，请检查邮箱并点击验证链接');
      }
      
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
    updateCard,
    signIn,
    signUp,
    signOut,
    fetchCards,
  };
};