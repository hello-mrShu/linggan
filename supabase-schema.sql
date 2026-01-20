-- 创建灵感卡片表
CREATE TABLE inspiration_cards (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  content TEXT,
  category TEXT NOT NULL CHECK (category IN ('inspiration', 'practice', 'memo')),
  image_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 创建索引提高查询性能
CREATE INDEX idx_cards_user_id ON inspiration_cards(user_id);
CREATE INDEX idx_cards_category ON inspiration_cards(category);
CREATE INDEX idx_cards_created_at ON inspiration_cards(created_at DESC);

-- 设置行级安全策略 (RLS)
ALTER TABLE inspiration_cards ENABLE ROW LEVEL SECURITY;

-- 允许认证用户只能访问自己的卡片
CREATE POLICY "Users can view their own cards" ON inspiration_cards
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own cards" ON inspiration_cards
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own cards" ON inspiration_cards
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own cards" ON inspiration_cards
  FOR DELETE USING (auth.uid() = user_id);