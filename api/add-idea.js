const { createClient } = require('@supabase/supabase-js');

// 硬编码配置（解决Vercel环境变量问题）
const supabaseUrl = 'https://wnrrelychjpkbzwynfka.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InducnJlbHljaGpwa2J6d3luZmthIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Njg5MjM1ODcsImV4cCI6MjA4NDQ5OTU4N30.U3Fpok1IMJ1hwXxpGwISbtwXlPtWhagX0K5mPxMa7B8';
const apiAuthToken = 'linggan_api_secret_token_2026_yishuai';

// 用户ID
const DEFAULT_USER_ID = 'ed6bc139-d7dd-4a4d-8450-6b6570e543c8';

// 初始化Supabase客户端
const supabase = createClient(supabaseUrl, supabaseAnonKey);

// 验证分类有效性
const validCategories = ['inspiration', 'practice', 'memo'];

// 验证授权Token
function validateAuth(headers) {
  const authHeader = headers.authorization || headers.Authorization;
  if (!authHeader) {
    return { error: '缺少Authorization header', status: 401 };
  }
  
  const token = authHeader.replace('Bearer ', '');
  if (token !== apiAuthToken) {
    return { error: '无效的认证Token', status: 401 };
  }
  
  return { valid: true };
}

// 主处理函数
module.exports = async (req, res) => {
  // 设置CORS头
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  // 只允许POST请求
  if (req.method !== 'POST') {
    return res.status(405).json({ error: '只支持POST请求' });
  }

  try {
    // 验证认证
    const authResult = validateAuth(req.headers);
    if (!authResult.valid) {
      return res.status(authResult.status).json({ error: authResult.error });
    }

    // 解析请求体
    const { content, category, imageUrl } = req.body;

    // 验证必需字段
    if (!content || typeof content !== 'string' || content.trim().length === 0) {
      return res.status(400).json({ error: '内容不能为空' });
    }

    if (!category || !validCategories.includes(category)) {
      return res.status(400).json({ 
        error: '无效的分类', 
        validCategories 
      });
    }

    // 插入数据到数据库（RLS策略会验证Authorization header）
    const { data, error } = await supabase
      .from('inspiration_cards')
      .insert({
        user_id: DEFAULT_USER_ID,
        title: content.trim(),
        content: null, // 快捷指令只传入标题
        category: category,
        image_url: imageUrl || null,
      })
      .select()
      .single();

    if (error) {
      console.error('Database error:', error);
      return res.status(500).json({ error: '保存失败: ' + error.message });
    }

    // 返回成功响应
    return res.status(200).json({
      success: true,
      message: '灵感添加成功',
      data: {
        id: data.id,
        title: data.title,
        category: data.category,
        created_at: data.created_at
      }
    });

  } catch (error) {
    console.error('API Error:', error);
    return res.status(500).json({ 
      error: '服务器内部错误: ' + error.message 
    });
  }
};