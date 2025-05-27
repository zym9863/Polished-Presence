<template>
  <div class="dashboard">
    <div class="welcome-section">
      <h2 class="page-title">
        <el-icon class="title-icon"><HomeFilled /></el-icon>
        仪表盘
      </h2>
      <p class="welcome-text" v-if="profile.name">
        您好，{{ profile.name }}！今天也要保持最佳状态哦～
      </p>
    </div>

    <!-- 统计卡片 -->
    <div class="stats-grid">
      <el-card class="stat-card" shadow="hover">
        <div class="stat-content">
          <div class="stat-icon habit">
            <el-icon :size="32"><Clock /></el-icon>
          </div>
          <div class="stat-info">
            <div class="stat-number">{{ progressStats.completedToday }}</div>
            <div class="stat-label">今日完成习惯</div>
            <div class="stat-total">/ {{ progressStats.totalHabits }}</div>
          </div>
        </div>
      </el-card>

      <el-card class="stat-card" shadow="hover">
        <div class="stat-content">
          <div class="stat-icon streak">
            <el-icon :size="32"><TrophyBase /></el-icon>
          </div>
          <div class="stat-info">
            <div class="stat-number">{{ progressStats.longestStreak }}</div>
            <div class="stat-label">最长连续记录</div>
            <div class="stat-total">天</div>
          </div>
        </div>
      </el-card>

      <el-card class="stat-card" shadow="hover">
        <div class="stat-content">
          <div class="stat-icon completion">
            <el-icon :size="32"><CircleCheck /></el-icon>
          </div>
          <div class="stat-info">
            <div class="stat-number">{{ progressStats.weeklyCompletion }}%</div>
            <div class="stat-label">本周完成率</div>
          </div>
        </div>
      </el-card>

      <el-card class="stat-card" shadow="hover">
        <div class="stat-content">
          <div class="stat-icon checklist">
            <el-icon :size="32"><List /></el-icon>
          </div>
          <div class="stat-info">
            <div class="stat-number">{{ completedChecklistItems }}</div>
            <div class="stat-label">清单完成项</div>
            <div class="stat-total">/ {{ checklist.length }}</div>
          </div>
        </div>
      </el-card>
    </div>

    <!-- 今日习惯快速操作 -->
    <div class="quick-actions">
      <el-card class="action-card" shadow="hover">
        <template #header>
          <div class="card-header">
            <span class="card-title">今日习惯</span>
            <el-button type="primary" text @click="navigateToHabits">
              查看全部
            </el-button>
          </div>
        </template>
        
        <div class="habits-list" v-if="todayHabits.length > 0">
          <div 
            v-for="habit in todayHabits.slice(0, 4)" 
            :key="habit.id"
            class="habit-item"
            :class="{ completed: habit.completed }"
          >
            <el-checkbox 
              :model-value="habit.completed"
              @change="handleHabitComplete(habit.id)"
              :disabled="habit.completed"
            >
              <span class="habit-title">{{ habit.title }}</span>
            </el-checkbox>
            <div class="habit-streak" v-if="habit.streak > 0">
              <el-icon><Lightning /></el-icon>
              {{ habit.streak }}
            </div>
          </div>
        </div>
        
        <el-empty v-else description="暂无习惯，去添加一个吧！" :image-size="120" />
      </el-card>

      <!-- 今日推荐 -->
      <el-card class="action-card" shadow="hover">
        <template #header>
          <div class="card-header">
            <span class="card-title">今日推荐</span>
            <el-button type="primary" text @click="navigateToStyle">
              更多建议
            </el-button>
          </div>
        </template>
        
        <div class="recommendations">
          <div class="recommendation-item" v-if="todayRecommendation">
            <div class="rec-icon">
              <el-icon :size="24"><Suitcase /></el-icon>
            </div>
            <div class="rec-content">
              <h4 class="rec-title">{{ todayRecommendation.occasion }}</h4>
              <p class="rec-description">
                {{ todayRecommendation.tips[0] }}
              </p>
            </div>
          </div>
          
          <div class="recommendation-item">
            <div class="rec-icon">
              <el-icon :size="24"><Reading /></el-icon>
            </div>
            <div class="rec-content">
              <h4 class="rec-title">礼仪提醒</h4>
              <p class="rec-description">
                记住，体面不仅在外表，更在举止和态度。
              </p>
            </div>
          </div>
        </div>
      </el-card>
    </div>

    <!-- 进度环形图 -->
    <div class="progress-section">
      <el-card class="progress-card" shadow="hover">
        <template #header>
          <span class="card-title">本周进度</span>
        </template>
        
        <div class="progress-content">
          <div class="progress-circle">
            <el-progress
              type="circle"
              :percentage="progressStats.weeklyCompletion"
              :width="120"
              :stroke-width="10"
              :color="progressColors"
            >
              <template #default="{ percentage }">
                <div class="progress-text">
                  <div class="percentage">{{ percentage }}%</div>
                  <div class="label">完成度</div>
                </div>
              </template>
            </el-progress>
          </div>
          
          <div class="progress-details">
            <div class="detail-item">
              <span class="detail-label">本周目标</span>
              <span class="detail-value">{{ progressStats.totalHabits * 7 }}</span>
            </div>
            <div class="detail-item">
              <span class="detail-label">已完成</span>
              <span class="detail-value">{{ Math.round(progressStats.totalHabits * 7 * progressStats.weeklyCompletion / 100) }}</span>
            </div>
            <div class="detail-item">
              <span class="detail-label">当前连击</span>
              <span class="detail-value">{{ progressStats.currentStreak }} 天</span>
            </div>
          </div>
        </div>
      </el-card>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useUserProfile } from '../composables/useUserProfile'
import { useHabits } from '../composables/useHabits'
import { useStyleRecommendations } from '../composables/useStyleRecommendations'

const { profile } = useUserProfile()
const { 
  todayHabits, 
  progressStats, 
  checklist, 
  completeHabit 
} = useHabits()
const { getRecommendationsForUser } = useStyleRecommendations()

// 计算已完成的清单项数量
const completedChecklistItems = computed(() => {
  return checklist.value.filter(item => item.completed).length
})

// 获取今日推荐
const todayRecommendation = computed(() => {
  const recommendations = getRecommendationsForUser.value
  return recommendations.length > 0 ? recommendations[0] : null
})

// 进度条颜色配置
const progressColors = [
  { color: '#f56565', percentage: 30 },
  { color: '#ed8936', percentage: 60 },
  { color: '#48bb78', percentage: 80 },
  { color: '#38b2ac', percentage: 100 }
]

// 处理习惯完成
const handleHabitComplete = (habitId: string) => {
  completeHabit(habitId)
}

// 导航到其他页面
const navigateToHabits = () => {
  // 这里可以通过 emit 事件来通知父组件切换页面
  // 或者使用路由跳转（如果使用了 Vue Router）
}

const navigateToStyle = () => {
  // 同上
}
</script>

<style scoped>
.dashboard {
  max-width: 1200px;
  margin: 0 auto;
  animation: slideUp var(--transition-slow);
}

.welcome-section {
  margin-bottom: var(--space-2xl);
  text-align: center;
  padding: var(--space-xl) 0;
}

.page-title {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: var(--space-md);
  margin: 0 0 var(--space-md) 0;
  font-size: 2.5rem;
  font-weight: 700;
  color: var(--text-primary);
  position: relative;
}

.page-title::after {
  content: '';
  position: absolute;
  bottom: -8px;
  left: 50%;
  transform: translateX(-50%);
  width: 60px;
  height: 4px;
  background: var(--primary-gradient);
  border-radius: 2px;
}

.title-icon {
  color: var(--primary-color);
  filter: drop-shadow(0 2px 4px rgba(102, 126, 234, 0.3));
  animation: float 3s ease-in-out infinite;
}

.welcome-text {
  margin: 0;
  font-size: 1.125rem;
  color: var(--text-muted);
  opacity: 0;
  animation: fadeIn var(--transition-slow) 0.3s forwards;
}

.stats-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: var(--space-xl);
  margin-bottom: var(--space-2xl);
}

.stat-card {
  transition: all var(--transition-normal);
  border: 1px solid var(--border-light);
  background: var(--bg-primary);
  position: relative;
  overflow: hidden;
}

.stat-card::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 4px;
  background: var(--primary-gradient);
  transform: scaleX(0);
  transition: transform var(--transition-normal);
}

.stat-card:hover {
  transform: translateY(-8px) scale(1.02);
  box-shadow: var(--shadow-xl);
  border-color: var(--primary-color);
}

.stat-card:hover::before {
  transform: scaleX(1);
}

.stat-content {
  display: flex;
  align-items: center;
  gap: var(--space-lg);
  padding: var(--space-lg);
}

.stat-icon {
  width: 72px;
  height: 72px;
  border-radius: var(--radius-xl);
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  position: relative;
  overflow: hidden;
  flex-shrink: 0;
}

.stat-icon::before {
  content: '';
  position: absolute;
  top: -50%;
  left: -50%;
  width: 200%;
  height: 200%;
  background: linear-gradient(45deg, transparent, rgba(255, 255, 255, 0.3), transparent);
  transform: rotate(45deg);
  transition: transform var(--transition-slow);
}

.stat-card:hover .stat-icon::before {
  transform: translateX(100%) rotate(45deg);
}

.stat-icon.habit {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  box-shadow: 0 8px 20px rgba(102, 126, 234, 0.4);
}

.stat-icon.streak {
  background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%);
  box-shadow: 0 8px 20px rgba(240, 147, 251, 0.4);
}

.stat-icon.completion {
  background: linear-gradient(135deg, #4facfe 0%, #00f2fe 100%);
  box-shadow: 0 8px 20px rgba(79, 172, 254, 0.4);
}

.stat-icon.checklist {
  background: linear-gradient(135deg, #43e97b 0%, #38f9d7 100%);
  box-shadow: 0 8px 20px rgba(67, 233, 123, 0.4);
}

.stat-info {
  flex: 1;
}

.stat-number {
  font-size: 2.5rem;
  font-weight: 800;
  color: var(--text-primary);
  line-height: 1;
  background: var(--primary-gradient);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.stat-label {
  font-size: 0.875rem;
  color: var(--text-muted);
  margin-top: var(--space-xs);
  font-weight: 500;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.stat-total {
  font-size: 1.125rem;
  color: var(--text-light);
  display: inline;
  font-weight: 600;
}

.quick-actions {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: var(--space-xl);
  margin-bottom: var(--space-2xl);
}

.action-card {
  min-height: 350px;
  border: 1px solid var(--border-light);
  background: var(--bg-primary);
  transition: all var(--transition-normal);
  position: relative;
  overflow: hidden;
}

.action-card::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 3px;
  background: var(--primary-gradient);
}

.action-card:hover {
  transform: translateY(-4px);
  box-shadow: var(--shadow-xl);
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: var(--space-lg) var(--space-lg) 0;
}

.card-title {
  font-size: 1.25rem;
  font-weight: 700;
  color: var(--text-primary);
  position: relative;
}

.card-title::after {
  content: '';
  position: absolute;
  bottom: -4px;
  left: 0;
  width: 30px;
  height: 2px;
  background: var(--primary-gradient);
  border-radius: 1px;
}

.habits-list {
  display: flex;
  flex-direction: column;
  gap: var(--space-md);
  padding: var(--space-lg);
}

.habit-item {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: var(--space-md);
  border-radius: var(--radius-lg);
  background: var(--bg-secondary);
  transition: all var(--transition-normal);
  border: 2px solid transparent;
  position: relative;
  overflow: hidden;
}

.habit-item::before {
  content: '';
  position: absolute;
  top: 0;
  left: -100%;
  width: 100%;
  height: 100%;
  background: linear-gradient(90deg, transparent, rgba(102, 126, 234, 0.1), transparent);
  transition: left var(--transition-slow);
}

.habit-item:hover::before {
  left: 100%;
}

.habit-item:hover {
  background: rgba(102, 126, 234, 0.05);
  border-color: var(--primary-color);
  transform: translateX(4px);
  box-shadow: var(--shadow-md);
}

.habit-item.completed {
  background: linear-gradient(135deg, rgba(67, 233, 123, 0.1) 0%, rgba(56, 249, 215, 0.1) 100%);
  border-color: #43e97b;
  box-shadow: 0 4px 12px rgba(67, 233, 123, 0.2);
}

.habit-title {
  font-weight: 600;
  color: var(--text-primary);
}

.habit-streak {
  display: flex;
  align-items: center;
  gap: var(--space-xs);
  color: #f6ad55;
  font-weight: 700;
  font-size: 0.875rem;
  padding: var(--space-xs) var(--space-sm);
  background: rgba(246, 173, 85, 0.1);
  border-radius: var(--radius-md);
  border: 1px solid rgba(246, 173, 85, 0.3);
}

.recommendations {
  display: flex;
  flex-direction: column;
  gap: var(--space-lg);
  padding: var(--space-lg);
}

.recommendation-item {
  display: flex;
  gap: var(--space-lg);
  padding: var(--space-lg);
  border-radius: var(--radius-lg);
  background: var(--bg-secondary);
  transition: all var(--transition-normal);
  border: 2px solid transparent;
  position: relative;
  overflow: hidden;
}

.recommendation-item::before {
  content: '';
  position: absolute;
  top: 0;
  left: -100%;
  width: 100%;
  height: 100%;
  background: linear-gradient(90deg, transparent, rgba(102, 126, 234, 0.1), transparent);
  transition: left var(--transition-slow);
}

.recommendation-item:hover::before {
  left: 100%;
}

.recommendation-item:hover {
  background: rgba(102, 126, 234, 0.05);
  border-color: var(--primary-color);
  transform: translateY(-2px);
  box-shadow: var(--shadow-md);
}

.rec-icon {
  width: 56px;
  height: 56px;
  border-radius: var(--radius-lg);
  background: var(--primary-gradient);
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  box-shadow: 0 6px 16px rgba(102, 126, 234, 0.4);
  position: relative;
  overflow: hidden;
}

.rec-icon::before {
  content: '';
  position: absolute;
  top: -50%;
  left: -50%;
  width: 200%;
  height: 200%;
  background: linear-gradient(45deg, transparent, rgba(255, 255, 255, 0.3), transparent);
  transform: rotate(45deg);
  transition: transform var(--transition-slow);
}

.recommendation-item:hover .rec-icon::before {
  transform: translateX(100%) rotate(45deg);
}

.rec-content {
  flex: 1;
}

.rec-title {
  margin: 0 0 var(--space-sm) 0;
  font-size: 1.125rem;
  font-weight: 700;
  color: var(--text-primary);
}

.rec-description {
  margin: 0;
  font-size: 0.95rem;
  color: var(--text-muted);
  line-height: 1.6;
}

.progress-section {
  margin-bottom: var(--space-xl);
}

.progress-card {
  max-width: 700px;
  margin: 0 auto;
  border: 1px solid var(--border-light);
  background: var(--bg-primary);
  position: relative;
  overflow: hidden;
}

.progress-card::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 4px;
  background: var(--primary-gradient);
}

.progress-content {
  display: flex;
  align-items: center;
  gap: var(--space-2xl);
  justify-content: center;
  padding: var(--space-2xl);
}

.progress-circle {
  text-align: center;
  position: relative;
}

.progress-text {
  text-align: center;
}

.percentage {
  font-size: 1.5rem;
  font-weight: 800;
  background: var(--primary-gradient);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.label {
  font-size: 0.875rem;
  color: var(--text-muted);
  margin-top: var(--space-xs);
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.progress-details {
  display: flex;
  flex-direction: column;
  gap: var(--space-lg);
}

.detail-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  min-width: 180px;
  padding: var(--space-md);
  background: var(--bg-secondary);
  border-radius: var(--radius-md);
  border: 1px solid var(--border-light);
  transition: all var(--transition-normal);
}

.detail-item:hover {
  background: rgba(102, 126, 234, 0.05);
  border-color: var(--primary-color);
  transform: translateX(4px);
}

.detail-label {
  font-size: 0.875rem;
  color: var(--text-muted);
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.detail-value {
  font-size: 1.125rem;
  font-weight: 700;
  color: var(--text-primary);
}

/* 动画增强 */
.stat-card {
  animation: slideUp var(--transition-slow);
  animation-fill-mode: both;
}

.stat-card:nth-child(1) { animation-delay: 0.1s; }
.stat-card:nth-child(2) { animation-delay: 0.2s; }
.stat-card:nth-child(3) { animation-delay: 0.3s; }
.stat-card:nth-child(4) { animation-delay: 0.4s; }

.action-card {
  animation: slideUp var(--transition-slow);
  animation-fill-mode: both;
}

.action-card:nth-child(1) { animation-delay: 0.5s; }
.action-card:nth-child(2) { animation-delay: 0.6s; }

.progress-card {
  animation: slideUp var(--transition-slow) 0.7s both;
}

/* 响应式设计 */
@media (max-width: 1024px) {
  .stats-grid {
    grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
    gap: var(--space-lg);
  }
  
  .progress-content {
    gap: var(--space-xl);
  }
}

@media (max-width: 768px) {
  .dashboard {
    animation: none;
  }
  
  .page-title {
    font-size: 2rem;
    flex-direction: column;
    gap: var(--space-sm);
  }
  
  .stats-grid {
    grid-template-columns: 1fr;
    gap: var(--space-md);
  }
  
  .quick-actions {
    grid-template-columns: 1fr;
    gap: var(--space-lg);
  }
  
  .progress-content {
    flex-direction: column;
    gap: var(--space-xl);
  }
  
  .stat-content {
    gap: var(--space-md);
    padding: var(--space-md);
  }
  
  .stat-icon {
    width: 60px;
    height: 60px;
  }
  
  .stat-number {
    font-size: 2rem;
  }
  
  .card-header,
  .habits-list,
  .recommendations {
    padding: var(--space-md);
  }
  
  .progress-content {
    padding: var(--space-lg);
  }
  
  /* 禁用动画以提升移动端性能 */
  .stat-card,
  .action-card,
  .progress-card {
    animation: none;
  }
}

@media (max-width: 480px) {
  .page-title {
    font-size: 1.75rem;
  }
  
  .stat-number {
    font-size: 1.75rem;
  }
  
  .card-title {
    font-size: 1.125rem;
  }
  
  .progress-details {
    gap: var(--space-md);
  }
  
  .detail-item {
    padding: var(--space-sm);
    min-width: 150px;
  }
}
</style>
