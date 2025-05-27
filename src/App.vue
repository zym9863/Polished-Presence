<template>
  <div class="app">
    <!-- 顶部导航 -->
    <el-header class="header">
      <div class="header-content">
        <div class="logo">
          <el-icon class="logo-icon" :size="28">
            <User />
          </el-icon>
          <h1 class="app-title">体面管家</h1>
        </div>
        
        <div class="user-info" v-if="profile.name">
          <el-avatar :size="32">{{ profile.name.charAt(0) }}</el-avatar>
          <span class="username">{{ profile.name }}</span>
        </div>
      </div>
    </el-header>

    <!-- 主要内容区域 -->
    <el-container class="main-container">
      <!-- 侧边栏导航 -->
      <el-aside class="sidebar" width="240px">
        <el-menu
          :default-active="activeTab"
          class="sidebar-menu"
          @select="handleMenuSelect"
        >
          <el-menu-item index="dashboard">
            <el-icon><HomeFilled /></el-icon>
            <span>仪表盘</span>
          </el-menu-item>
          
          <el-menu-item index="profile">
            <el-icon><User /></el-icon>
            <span>个人资料</span>
          </el-menu-item>
          
          <el-menu-item index="style">
            <el-icon><Suitcase /></el-icon>
            <span>着装建议</span>
          </el-menu-item>
          
          <el-menu-item index="etiquette">
            <el-icon><Reading /></el-icon>
            <span>礼仪指南</span>
          </el-menu-item>
          
          <el-menu-item index="habits">
            <el-icon><Clock /></el-icon>
            <span>习惯养成</span>
          </el-menu-item>
          
          <el-menu-item index="checklist">
            <el-icon><List /></el-icon>
            <span>生活清单</span>
          </el-menu-item>
        </el-menu>
      </el-aside>

      <!-- 内容区域 -->
      <el-main class="content">
        <!-- 仪表盘 -->
        <Dashboard v-if="activeTab === 'dashboard'" />
        
        <!-- 个人资料 -->
        <UserProfile v-if="activeTab === 'profile'" />
        
        <!-- 着装建议 -->
        <StyleRecommendations v-if="activeTab === 'style'" />
        
        <!-- 礼仪指南 -->
        <EtiquetteGuide v-if="activeTab === 'etiquette'" />
        
        <!-- 习惯养成 -->
        <HabitsManager v-if="activeTab === 'habits'" />
        
        <!-- 生活清单 -->
        <ChecklistManager v-if="activeTab === 'checklist'" />
      </el-main>
    </el-container>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useUserProfile } from './composables/useUserProfile'

// 组件导入
import Dashboard from './components/Dashboard.vue'
import UserProfile from './components/UserProfile.vue'
import StyleRecommendations from './components/StyleRecommendations.vue'
import EtiquetteGuide from './components/EtiquetteGuide.vue'
import HabitsManager from './components/HabitsManager.vue'
import ChecklistManager from './components/ChecklistManager.vue'

const { profile, isProfileComplete } = useUserProfile()

// 当前活跃的标签页
const activeTab = ref('dashboard')

// 处理菜单选择
const handleMenuSelect = (key: string) => {
  activeTab.value = key
}

// 组件挂载时检查用户资料
onMounted(() => {
  if (!isProfileComplete.value) {
    activeTab.value = 'profile'
  }
})
</script>

<style scoped>
.app {
  height: 100vh;
  display: flex;
  flex-direction: column;
  background: var(--bg-gradient);
  position: relative;
  overflow: hidden;
}

.app::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: var(--bg-gradient);
  animation: gradientShift 20s ease infinite;
  z-index: -1;
}

.header {
  background: var(--bg-glass);
  backdrop-filter: blur(20px);
  border-bottom: 1px solid rgba(255, 255, 255, 0.2);
  box-shadow: var(--shadow-lg);
  height: 72px !important;
  line-height: 72px;
  padding: 0;
  position: relative;
  z-index: 100;
}

.header-content {
  display: flex;
  justify-content: space-between;
  align-items: center;
  height: 100%;
  padding: 0 var(--space-xl);
  max-width: 1400px;
  margin: 0 auto;
}

.logo {
  display: flex;
  align-items: center;
  gap: var(--space-md);
  transition: transform var(--transition-normal);
}

.logo:hover {
  transform: scale(1.02);
}

.logo-icon {
  color: var(--primary-color);
  filter: drop-shadow(0 2px 4px rgba(102, 126, 234, 0.3));
  transition: all var(--transition-normal);
}

.logo:hover .logo-icon {
  transform: rotate(5deg);
  filter: drop-shadow(0 4px 8px rgba(102, 126, 234, 0.4));
}

.app-title {
  margin: 0;
  font-size: 1.75rem;
  font-weight: 700;
  background: var(--primary-gradient);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  letter-spacing: -0.02em;
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.user-info {
  display: flex;
  align-items: center;
  gap: var(--space-md);
  padding: var(--space-sm) var(--space-md);
  border-radius: var(--radius-xl);
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.2);
  transition: all var(--transition-normal);
}

.user-info:hover {
  background: rgba(255, 255, 255, 0.15);
  transform: translateY(-1px);
  box-shadow: var(--shadow-md);
}

.username {
  font-weight: 600;
  color: var(--text-primary);
  font-size: 0.95rem;
}

.main-container {
  flex: 1;
  background: transparent;
  position: relative;
  overflow: hidden;
}

.sidebar {
  background: var(--bg-glass);
  backdrop-filter: blur(20px);
  border-right: 1px solid rgba(255, 255, 255, 0.2);
  box-shadow: var(--shadow-xl);
  position: relative;
  z-index: 50;
}

.sidebar::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: linear-gradient(180deg, rgba(255, 255, 255, 0.1) 0%, rgba(255, 255, 255, 0.05) 100%);
  pointer-events: none;
}

.sidebar-menu {
  border: none;
  background: transparent;
  padding: var(--space-lg) 0;
  position: relative;
  z-index: 1;
}

.sidebar-menu .el-menu-item {
  margin: var(--space-xs) var(--space-md);
  border-radius: var(--radius-lg);
  transition: all var(--transition-normal);
  position: relative;
  overflow: hidden;
  font-weight: 500;
  font-size: 0.95rem;
}

.sidebar-menu .el-menu-item::before {
  content: '';
  position: absolute;
  top: 0;
  left: -100%;
  width: 100%;
  height: 100%;
  background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.2), transparent);
  transition: left var(--transition-slow);
}

.sidebar-menu .el-menu-item:hover::before {
  left: 100%;
}

.sidebar-menu .el-menu-item:hover {
  background: rgba(102, 126, 234, 0.15);
  color: var(--primary-dark);
  transform: translateX(4px);
  box-shadow: var(--shadow-md);
}

.sidebar-menu .el-menu-item.is-active {
  background: var(--primary-gradient);
  color: white;
  transform: translateX(8px);
  box-shadow: var(--shadow-lg);
  border: 1px solid rgba(255, 255, 255, 0.3);
}

.sidebar-menu .el-menu-item.is-active::after {
  content: '';
  position: absolute;
  right: -1px;
  top: 50%;
  transform: translateY(-50%);
  width: 4px;
  height: 24px;
  background: rgba(255, 255, 255, 0.8);
  border-radius: 2px 0 0 2px;
}

.content {
  background: var(--bg-glass);
  backdrop-filter: blur(20px);
  border-radius: var(--radius-2xl) 0 0 0;
  margin: var(--space-lg) var(--space-lg) var(--space-lg) 0;
  box-shadow: var(--shadow-xl);
  padding: var(--space-2xl);
  overflow-y: auto;
  position: relative;
  border: 1px solid rgba(255, 255, 255, 0.2);
}

.content::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: linear-gradient(135deg, rgba(255, 255, 255, 0.1) 0%, rgba(255, 255, 255, 0.05) 100%);
  pointer-events: none;
  border-radius: var(--radius-2xl) 0 0 0;
}

.content > * {
  position: relative;
  z-index: 1;
}

/* 自定义滚动条 */
.content::-webkit-scrollbar {
  width: 6px;
}

.content::-webkit-scrollbar-track {
  background: rgba(255, 255, 255, 0.1);
  border-radius: 3px;
}

.content::-webkit-scrollbar-thumb {
  background: rgba(102, 126, 234, 0.3);
  border-radius: 3px;
  transition: background var(--transition-fast);
}

.content::-webkit-scrollbar-thumb:hover {
  background: rgba(102, 126, 234, 0.5);
}

/* 页面切换动画 */
.page-enter-active,
.page-leave-active {
  transition: all var(--transition-slow);
}

.page-enter-from {
  opacity: 0;
  transform: translateY(20px);
}

.page-leave-to {
  opacity: 0;
  transform: translateY(-20px);
}

/* 响应式设计 */
@media (max-width: 1024px) {
  .header-content {
    padding: 0 var(--space-lg);
  }
  
  .content {
    padding: var(--space-xl);
  }
}

@media (max-width: 768px) {
  .main-container {
    flex-direction: column;
  }
  
  .sidebar {
    width: 100% !important;
    height: auto;
    border-right: none;
    border-bottom: 1px solid rgba(255, 255, 255, 0.2);
  }
  
  .sidebar-menu {
    display: flex;
    overflow-x: auto;
    padding: var(--space-md) var(--space-sm);
    gap: var(--space-sm);
  }
  
  .sidebar-menu .el-menu-item {
    margin: 0;
    min-width: 120px;
    text-align: center;
    flex-shrink: 0;
    font-size: 0.875rem;
  }
  
  .sidebar-menu .el-menu-item:hover,
  .sidebar-menu .el-menu-item.is-active {
    transform: translateX(0);
  }
  
  .content {
    margin: 0;
    border-radius: 0;
    padding: var(--space-lg);
  }
  
  .content::before {
    border-radius: 0;
  }
  
  .header-content {
    padding: 0 var(--space-md);
  }
  
  .app-title {
    font-size: 1.5rem;
  }
}

@media (max-width: 480px) {
  .header {
    height: 64px !important;
    line-height: 64px;
  }
  
  .logo {
    gap: var(--space-sm);
  }
  
  .app-title {
    font-size: 1.25rem;
  }
  
  .user-info {
    padding: var(--space-xs) var(--space-sm);
    gap: var(--space-sm);
  }
  
  .username {
    font-size: 0.875rem;
  }
  
  .sidebar-menu {
    padding: var(--space-sm);
  }
  
  .sidebar-menu .el-menu-item {
    min-width: 100px;
    font-size: 0.8rem;
    padding: var(--space-sm);
  }
  
  .content {
    padding: var(--space-md);
  }
}

/* 高性能动画 */
@media (prefers-reduced-motion: no-preference) {
  .app::before {
    background: linear-gradient(-45deg, #667eea, #764ba2, #f093fb, #f5576c);
    background-size: 400% 400%;
    animation: gradientShift 20s ease infinite;
  }
}

/* 深色模式适配 */
@media (prefers-color-scheme: dark) {
  .header {
    background: rgba(26, 32, 44, 0.95);
    border-bottom: 1px solid rgba(255, 255, 255, 0.1);
  }
  
  .sidebar {
    background: rgba(26, 32, 44, 0.95);
    border-right: 1px solid rgba(255, 255, 255, 0.1);
  }
  
  .content {
    background: rgba(26, 32, 44, 0.95);
    border: 1px solid rgba(255, 255, 255, 0.1);
  }
  
  .user-info {
    background: rgba(255, 255, 255, 0.05);
    border: 1px solid rgba(255, 255, 255, 0.1);
  }
  
  .user-info:hover {
    background: rgba(255, 255, 255, 0.1);
  }
}
</style>
