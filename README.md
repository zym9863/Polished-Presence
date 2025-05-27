# 体面管家 - Personal Grooming Assistant

> **语言 / Languages:** [中文](README.md) | [English](README_EN.md)

一个专注于个人形象管理的现代化Web应用，帮助用户培养良好的生活习惯，提升个人素养和社交礼仪。

## ✨ 功能特色

### 🏠 智能仪表盘
- 个性化欢迎界面
- 实时进度统计
- 今日习惯快速操作
- 个性化推荐展示
- 可视化进度环形图

### 👤 个人资料管理
- 完整的用户信息设置
- 个性化偏好配置
- 颜色喜好选择
- 资料完成度追踪
- 智能引导流程

### 👔 着装建议系统
- 场景化着装推荐
- 颜色搭配指南
- 服装单品数据库
- 季节性建议
- 职业化搭配方案

### 📚 礼仪指南
- 分类礼仪知识
- 难度分级学习
- 实用场景示例
- 快速参考卡片
- 互动式学习体验

### ⏰ 习惯养成
- 智能习惯追踪
- 连击记录系统
- 分类管理
- 进度可视化
- 个性化提醒

### ✅ 生活清单
- 分时段清单管理
- 优先级设置
- 截止日期提醒
- 快速模板
- 完成度统计

## 🛠 技术栈

- **前端框架**: Vue 3 + TypeScript
- **UI组件库**: Element Plus
- **状态管理**: Vue Composition API
- **数据持久化**: LocalStorage
- **构建工具**: Vite
- **样式**: CSS3 + Flexbox/Grid

## 📦 项目结构

```
src/
├── components/           # Vue组件
│   ├── Dashboard.vue        # 仪表盘
│   ├── UserProfile.vue      # 个人资料
│   ├── StyleRecommendations.vue  # 着装建议
│   ├── EtiquetteGuide.vue   # 礼仪指南
│   ├── HabitsManager.vue    # 习惯管理
│   └── ChecklistManager.vue # 清单管理
├── composables/          # 组合式函数
│   ├── useLocalStorage.ts   # 本地存储
│   ├── useUserProfile.ts    # 用户资料管理
│   ├── useHabits.ts         # 习惯管理
│   └── useStyleRecommendations.ts  # 样式推荐
├── types/                # TypeScript类型定义
│   └── index.ts
├── App.vue               # 主应用组件
└── main.ts              # 应用入口
```

## 🚀 快速开始

### 环境要求
- Node.js >= 16.0.0
- npm >= 7.0.0

### 安装依赖
```bash
npm install
```

### 开发运行
```bash
npm run dev
```

### 构建生产版本
```bash
npm run build
```

### 预览生产版本
```bash
npm run preview
```

## 💡 使用指南

### 初次使用
1. 打开应用，系统会自动引导到个人资料页面
2. 填写基本信息（姓名、职业、个人风格）
3. 设置个人偏好（正式程度、预算范围、喜好颜色）
4. 完成设置后即可进入主应用界面

### 功能使用

#### 仪表盘
- 查看今日进度概览
- 快速完成习惯打卡
- 获取个性化推荐
- 监控周进度统计

#### 着装建议
- 选择不同场景获取着装建议
- 浏览颜色搭配指南
- 查看详细搭配要点
- 探索更多搭配方案

#### 礼仪指南
- 按分类浏览礼仪知识
- 根据难度选择学习内容
- 查看实用场景示例
- 使用快速参考功能

#### 习惯管理
- 添加个人习惯目标
- 每日打卡记录
- 查看连击统计
- 按分类管理习惯

#### 生活清单
- 创建分时段待办清单
- 设置优先级和截止时间
- 使用快速模板
- 追踪完成进度

## 🎨 设计理念

### 用户体验
- **简洁直观**: 清晰的信息架构和导航设计
- **响应式设计**: 适配各种设备屏幕
- **渐进式引导**: 新用户友好的引导流程
- **即时反馈**: 操作结果的及时反馈

### 视觉设计
- **现代简约**: 采用清新的配色方案
- **一致性**: 统一的组件和交互设计
- **可读性**: 优化的字体和间距设计
- **视觉层次**: 合理的信息优先级展示

### 功能设计
- **个性化**: 基于用户偏好的智能推荐
- **数据驱动**: 可视化的进度和统计展示
- **实用性**: 贴近生活的功能场景
- **成长性**: 习惯养成的长期追踪

## 🔧 自定义配置

### 主题定制
应用使用CSS变量进行主题管理，可以通过修改以下变量来自定义主题：

```css
:root {
  --primary-color: #667eea;
  --secondary-color: #764ba2;
  --success-color: #48bb78;
  --warning-color: #ed8936;
  --danger-color: #f56565;
}
```

### 数据配置
- 习惯分类和模板可在 `useHabits.ts` 中自定义
- 着装建议数据可在 `useStyleRecommendations.ts` 中配置
- 清单模板可在 `ChecklistManager.vue` 中调整

## 📱 响应式支持

应用完全支持响应式设计，在以下设备上都有良好的用户体验：
- 桌面端 (1200px+)
- 平板端 (768px - 1199px)
- 移动端 (320px - 767px)

## 🔒 数据安全

- 所有数据存储在用户本地浏览器中
- 不收集或上传任何个人信息
- 支持数据导出和备份
- 清除浏览器数据会重置应用状态

## 🤝 贡献指南

欢迎提交问题报告和功能建议！

### 开发流程
1. Fork 项目仓库
2. 创建功能分支 (`git checkout -b feature/amazing-feature`)
3. 提交更改 (`git commit -m 'Add amazing feature'`)
4. 推送到分支 (`git push origin feature/amazing-feature`)
5. 创建 Pull Request

### 代码规范
- 使用 TypeScript 进行类型检查
- 遵循 Vue 3 Composition API 最佳实践
- 保持组件的单一职责原则
- 编写清晰的注释和文档

## 📄 许可证

本项目采用 MIT 许可证 - 查看 [LICENSE](LICENSE) 文件了解详情

## 🙏 致谢

- [Vue.js](https://vuejs.org/) - 渐进式JavaScript框架
- [Element Plus](https://element-plus.org/) - Vue 3组件库
- [Vite](https://vitejs.dev/) - 下一代前端构建工具

---

**体面管家** - 让体面成为一种生活方式 ✨
