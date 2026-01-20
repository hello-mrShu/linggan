import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://wnrrelychjpkbzwynfka.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InducnJlbHljaGpwa2J6d3luZmthIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Njg5MjM1ODcsImV4cCI6MjA4NDQ5OTU4N30.U3Fpok1IMJ1hwXxpGwISbtwXlPtWhagX0K5mPxMa7B8';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// 数据库类型定义
export interface Database {
  public: {
    Tables: {
      inspiration_cards: {
        Row: {
          id: string;
          user_id: string;
          title: string;
          content: string | null;
          category: 'inspiration' | 'practice' | 'memo';
          image_url: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          title: string;
          content?: string | null;
          category: 'inspiration' | 'practice' | 'memo';
          image_url?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          title?: string;
          content?: string | null;
          category?: 'inspiration' | 'practice' | 'memo';
          image_url?: string | null;
          created_at?: string;
          updated_at?: string;
        };
      };
    };
  };
}