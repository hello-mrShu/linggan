# 灵感卡片收集器 - 产品需求文档

## 📋 产品概述

**产品名称**：灵感卡片收集器  
**产品定位**：移动端优先的灵感记录和管理工具  
**目标用户**：需要快速记录、分类和管理个人灵感、实操计划、备忘事项的用户  
**技术栈**：React + Supabase + Vercel + Tailwind CSS  

---

## ✅ 已完成功能

### 🎯 核心功能

#### 1. 用户认证系统
- ✅ **用户注册**：邮箱密码注册，支持邮箱验证（可配置开关）
- ✅ **用户登录**：安全的用户认证，支持会话保持
- ✅ **状态持久化**：登录状态在浏览器刷新后保持
- ✅ **登出功能**：安全的用户登出操作
- ✅ **用户隔离**：每个用户只能访问自己的数据

#### 2. 灵感卡片管理
- ✅ **卡片创建**：支持标题、内容、分类、图片URL
- ✅ **卡片展示**：美观的卡片式布局，支持图片预览
- ✅ **分类筛选**：全部、灵感、实操、备忘四类筛选
- ✅ **卡片删除**：长按显示删除按钮，支持确认取消
- ✅ **时间显示**：智能相对时间显示（刚刚、小时前、昨天等）

#### 3. 移动端优化
- ✅ **响应式设计**：完美适配手机和平板
- ✅ **触摸交互**：长按删除、滑动操作
- ✅ **底部导航**：原生风格的移动端导航
- ✅ **PWA支持**：可添加到主屏幕，支持离线访问

#### 4. 主题系统
- ✅ **暗黑模式**：完整的明暗主题切换
- ✅ **主题持久化**：用户偏好自动保存
- ✅ **自适应UI**：根据系统主题自动切换
- ✅ **品牌一致性**：统一的色彩方案

#### 5. 云端数据同步
- ✅ **实时同步**：所有操作实时保存到Supabase
- ✅ **跨设备访问**：任何设备登录都能看到数据
- ✅ **数据安全**：RLS策略保护，每用户数据隔离
- ✅ **本地存储**：浏览器离线时的数据缓存

---

## 🌐 iOS快捷指令API

### 🔗 API信息
- **API地址**：`https://linggan.vercel.app/api/add-idea`
- **请求方法**：POST
- **认证方式**：Bearer Token

### 📝 API调用方法

#### 1. cURL调用
```bash
curl -X POST https://linggan.vercel.app/api/add-idea \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer linggan_api_secret_token_2026_yishuai" \
  -d '{
    "content": "要记录的灵感内容",
    "category": "inspiration",
    "imageUrl": "可选的图片链接",
    "userEmail": "your-email@example.com"
  }'
```

#### 2. iOS快捷指令配置
- **URL**：`https://linggan.vercel.app/api/add-idea`
- **方法**：POST
- **Headers**：
  - `Content-Type: application/json`
  - `Authorization: Bearer linggan_api_secret_token_2026_yishuai`
- **Body（JSON）**：
  ```json
  {
    "content": "灵感内容",
    "category": "inspiration",
    "imageUrl": "可选图片URL"
  }
  ```

### 📋 支持的分类
- `inspiration` - 💡 灵感
- `practice` - 🛠️ 实操
- `memo` - 📝 备忘

### 🛡️ 安全机制
- **Token认证**：防止未授权访问
- **RLS策略**：数据库行级安全保护
- **数据验证**：严格的输入验证和类型检查
- **错误处理**：详细的错误信息返回

---

## 🏗️ 技术架构

### 📦 前端架构
- **框架**：React 19 + TypeScript
- **样式**：Tailwind CSS 3.4
- **状态管理**：React Hooks
- **构建工具**：Create React App
- **部署**：Vercel

### 🗄️ 后端架构
- **数据库**：Supabase PostgreSQL
- **认证**：Supabase Auth
- **API**：Vercel Serverless Functions
- **存储**：云端 + 本地缓存

### 🌐 部署架构
```
GitHub → Vercel → CDN → 用户
     ↓         ↓         ↓
代码   →  构建   →  静态资源
API    →  函数   →  接口
数据库 →  Supabase → 数据
```

---

## 📊 数据模型

### 👤 用户表 (auth.users)
```sql
- id: UUID (主键)
- email: TEXT (唯一)
- created_at: TIMESTAMPTZ
- updated_at: TIMESTAMPTZ
```

### 📝 灵感卡片表 (inspiration_cards)
```sql
- id: UUID (主键)
- user_id: UUID (外键)
- title: TEXT (必需)
- content: TEXT (可选)
- category: TEXT (枚举：inspiration/practice/memo)
- image_url: TEXT (可选)
- created_at: TIMESTAMPTZ
- updated_at: TIMESTAMPTZ
```

---

## 🔧 环境配置

### 🌐 生产环境变量
```bash
REACT_APP_SUPABASE_URL=https://wnrrelychjpkbzwynfka.supabase.co
REACT_APP_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
API_AUTH_TOKEN=linggan_api_secret_token_2026_yishuai
```

### 🗄️ Supabase配置
- **RLS策略**：用户数据隔离
- **API访问**：Anon Key + Service Role
- **数据库表**：inspiration_cards表
- **认证设置**：邮件验证可配置

---

## 📱 移动端设计

### 🎨 UI/UX设计
- **卡片布局**：Material Design风格卡片
- **导航模式**：底部Tab导航 + 汉堡菜单
- **交互模式**：长按菜单、滑动手势
- **响应式**：320px - 768px完美适配
- **加载状态**：友好的loading和错误提示

### 🎯 移动端特性
- **PWA支持**：可安装到主屏幕
- **触摸优化**：长按删除、滑动操作
- **性能优化**：虚拟滚动、懒加载
- **主题适配**：自动适配系统主题

---

## 🚀 后续规划

### 🎯 短期优化 (1-2周)

#### 1. 性能优化
- [ ] **虚拟滚动**：大量数据时的性能优化
- [ ] **图片懒加载**：提升页面加载速度
- [ ] **数据分页**：优化大数据集显示
- [ ] **缓存策略**：更智能的数据缓存

#### 2. 用户体验
- [ ] **搜索功能**：快速查找历史灵感
- [ ] **卡片编辑**：支持修改已创建的卡片
- [ ] **批量操作**：批量删除、批量分类
- [ ] **拖拽排序**：卡片拖拽重新排序

#### 3. 数据分析
- [ ] **统计面板**：按分类统计卡片数量
- [ ] **趋势分析**：灵感创建时间趋势
- [ ] **导出功能**：支持导出JSON、CSV格式
- [ ] **备份恢复**：数据备份和恢复功能

### 🎯 中期扩展 (1-2月)

#### 1. 功能增强
- [ ] **标签系统**：为卡片添加多个标签
- [ ] **收藏功能**：重要卡片收藏
- [ ] **提醒功能**：定期提醒特定卡片
- [ ] **模板系统**：预设卡片模板
- [ ] **语音输入**：支持语音转文字

#### 2. 协作功能
- [ ] **分享功能**：生成分享链接
- [ ] **公开卡片**：可选择公开特定卡片
- [ ] **用户关注**：关注其他用户公开内容
- [ ] **评论系统**：卡片评论和讨论

#### 3. 多平台支持
- [ ] **微信小程序**：小程序版本
- [ ] **Flutter App**：原生移动应用
- [ ] **桌面应用**：Electron桌面版本
- [ ] **浏览器扩展**：Chrome/Firefox扩展

### 🎯 长期规划 (3-6月)

#### 1. 智能化
- [ ] **AI分类**：自动分类灵感内容
- [ ] **智能推荐**：基于历史推荐相关内容
- [ ] **语音助手**：AI语音对话管理
- [ ] **自动摘要**：灵感内容智能摘要

#### 2. 社区化
- [ ] **用户广场**：公开灵感展示平台
- [ ] **灵感主题**：热门话题和挑战
- [ ] **协作项目**：多人协作的项目管理
- [ ] **知识图谱**：灵感关联关系图谱

---

## 📈 技术债务

### 🔧 需要重构
- [ ] **状态管理**：考虑使用Zustand或Redux Toolkit
- [ ] **API抽象**：创建统一的API调用层
- [ ] **组件库**：提取通用组件库
- [ ] **测试覆盖**：添加单元测试和集成测试

### 🛡️ 安全加固
- [ ] **Rate Limiting**：API请求频率限制
- [ ] **Input Validation**：更严格的输入验证
- [ ] **CORS Policy**：更精确的跨域策略
- [ ] **日志监控**：添加应用性能监控

---

## 📞 部署信息

### 🌐 当前部署
- **前端应用**：https://linggan.vercel.app/
- **API接口**：https://linggan.vercel.app/api/add-idea
- **数据库**：Supabase (wnrrelychjpkbzwynfka)
- **源码仓库**：https://github.com/hello-mrShu/linggan.git

### 📱 访问方式
- **Web应用**：直接访问域名
- **PWA安装**：浏览器"添加到主屏幕"
- **iOS快捷指令**：通过快捷指令App调用API
- **移动端**：响应式设计完美适配

---

## 📚 相关文档

- **API文档**：`ios-shortcuts-api.md`
- **数据库Schema**：`supabase-schema.sql`
- **环境配置**：`.env.example`
- **用户手册**：需创建

---

*最后更新：2026-01-21*