# iOS 快捷指令 API 配置

## 📱 API 地址

部署到 Vercel 后，API 地址为：
```
https://your-vercel-domain.vercel.app/api/add-idea
```

## 🔐 认证配置

### 请求头 (Headers)
```
Authorization: Bearer linggan_api_secret_token_2024_please_change_this
Content-Type: application/json
```

### 请求体 (Body) - JSON格式
```json
{
  "content": "你的灵感内容",
  "category": "inspiration",
  "imageUrl": "可选的图片链接",
  "userEmail": "your-email@example.com"
}
```

## 📋 分类选项

- `inspiration` - 💡 灵感
- `practice` - 🛠️ 实操  
- `memo` - 📝 备忘

## 🚀 Vercel 部署环境变量

在 Vercel 项目设置中需要配置以下环境变量：

### 必需的环境变量
```
REACT_APP_SUPABASE_URL=https://wnrrelychjpkbzwynfka.supabase.co
REACT_APP_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InducnJlbHljaGpwa2J6d3luZmthIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Njg5MjM1ODcsImV4cCI6MjA4NDQ5OTU4N30.U3Fpok1IMJ1hwXxpGwISbtwXlPtWhagX0K5mPxMa7B8
API_AUTH_TOKEN=linggan_api_secret_token_2024_please_change_this
```

## 📖 iOS 快捷指令设置

### 方法1: 使用快捷指令App
1. 打开"快捷指令"App
2. 点击右上角 "+"
3. 添加操作：
   - "请求URL" (POST)
   - URL: `https://your-vercel-domain.vercel.app/api/add-idea`
   - 请求头：添加 "Authorization" 为 `Bearer linggan_api_secret_token_2024_please_change_this`
   - 请求体：JSON格式

### 方法2: 通过Siri语音
"嘿Siri，添加灵感到我的收藏"

## 🔒 安全说明

1. **修改默认Token**: 将 `API_AUTH_TOKEN` 改为更复杂的字符串
2. **限制访问**: API 只支持 POST 请求
3. **数据验证**: 严格验证输入内容
4. **用户隔离**: 每个用户只能访问自己的数据

## 📝 测试命令

```bash
curl -X POST https://your-vercel-domain.vercel.app/api/add-idea \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer linggan_api_secret_token_2024_please_change_this" \
  -d '{
    "content": "通过API添加的测试灵感",
    "category": "inspiration"
  }'
```

## 🚨 注意事项

1. 确保在 Supabase 中已创建 `inspiration_cards` 表
2. 用户邮箱必须已存在于 Supabase 的用户表中
3. 如未提供邮箱，默认使用第一个注册用户
4. 建议在生产环境中使用更强的认证Token