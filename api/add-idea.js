const { createClient } = require('@supabase/supabase-js');

// 从环境变量获取配置
const supabaseUrl = process.env.REACT_APP_SUPABASE_URL;
const supabaseAnonKey = process.env.REACT_APP_SUPABASE_ANON_KEY;
const apiAuthToken = process.env.API_AUTH_TOKEN;

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
    const { content, category, imageUrl, userEmail } = req.body;

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

    // 查找用户ID（基于邮箱）
    let userId;
    if (userEmail) {
      const { data: { users }, error } = await supabase.auth.admin.listUsers();
      if (error) {
        console.error('Error fetching users:', error);
        return res.status(500).json({ error: '获取用户信息失败' });
      }

      const user = users.find(u => u.email === userEmail);
      if (!user) {
        return res.status(404).json({ error: '用户不存在' });
      }
      userId = user.id;
    } else {
      // 如果没有提供邮箱，使用第一个用户（单用户模式）
      const { data: { users }, error } = await supabase.auth.admin.listUsers();
      if (error || users.length === 0) {
        return res.status(500).json({ error: '没有找到用户' });
      }
      userId = users[0].id;
    }

    // 插入数据到数据库
    const { data, error } = await supabase
      .from('inspiration_cards')
      .insert({
        user_id: userId,
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