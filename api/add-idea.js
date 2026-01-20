module.exports = async (req, res) => {
  // 设置CORS头
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method === 'GET') {
    return res.status(200).json({ 
      message: 'API is working!',
      method: req.method,
      timestamp: new Date().toISOString(),
      env: {
        hasSupabaseUrl: !!process.env.REACT_APP_SUPABASE_URL,
        hasSupabaseKey: !!process.env.REACT_APP_SUPABASE_ANON_KEY,
        hasApiToken: !!process.env.API_AUTH_TOKEN
      }
    });
  }

  if (req.method === 'POST') {
    try {
      const { content, category } = req.body;
      
      return res.status(200).json({
        success: true,
        message: '想法接收成功',
        data: {
          content,
          category,
          received_at: new Date().toISOString()
        }
      });
    } catch (error) {
      return res.status(500).json({
        error: '处理失败: ' + error.message
      });
    }
  }

  return res.status(405).json({ error: 'Method not allowed' });
};