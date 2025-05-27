<template>
  <div class="user-profile">
    <div class="profile-header">
      <h2 class="page-title">
        <el-icon class="title-icon"><User /></el-icon>
        个人资料
      </h2>
      <p class="page-subtitle">
        完善您的个人信息，获得更精准的个性化建议
      </p>
    </div>

    <div class="profile-content">
      <el-row :gutter="24">
        <!-- 基本信息 -->
        <el-col :span="12">
          <el-card class="profile-card" shadow="hover">
            <template #header>
              <div class="card-header">
                <span class="card-title">基本信息</span>
              </div>
            </template>
            
            <el-form :model="profileForm" label-width="100px" class="profile-form">
              <el-form-item label="姓名">
                <el-input 
                  v-model="profileForm.name" 
                  placeholder="请输入您的姓名"
                  @change="handleProfileUpdate"
                />
              </el-form-item>
              
              <el-form-item label="职业">
                <el-select 
                  v-model="profileForm.profession" 
                  placeholder="请选择您的职业"
                  @change="handleProfileUpdate"
                  style="width: 100%"
                >
                  <el-option label="企业管理" value="企业管理" />
                  <el-option label="金融投资" value="金融投资" />
                  <el-option label="法律服务" value="法律服务" />
                  <el-option label="咨询顾问" value="咨询顾问" />
                  <el-option label="销售市场" value="销售市场" />
                  <el-option label="技术研发" value="技术研发" />
                  <el-option label="医疗健康" value="医疗健康" />
                  <el-option label="教育培训" value="教育培训" />
                  <el-option label="媒体传播" value="媒体传播" />
                  <el-option label="创意设计" value="创意设计" />
                  <el-option label="自由职业" value="自由职业" />
                  <el-option label="其他" value="其他" />
                </el-select>
              </el-form-item>
              
              <el-form-item label="个人风格">
                <el-select 
                  v-model="profileForm.style" 
                  placeholder="请选择您的个人风格"
                  @change="handleProfileUpdate"
                  style="width: 100%"
                >
                  <el-option label="经典商务" value="经典商务" />
                  <el-option label="现代简约" value="现代简约" />
                  <el-option label="优雅知性" value="优雅知性" />
                  <el-option label="时尚前卫" value="时尚前卫" />
                  <el-option label="休闲舒适" value="休闲舒适" />
                  <el-option label="艺术文艺" value="艺术文艺" />
                </el-select>
              </el-form-item>
            </el-form>
          </el-card>
        </el-col>
        
        <!-- 偏好设置 -->
        <el-col :span="12">
          <el-card class="profile-card" shadow="hover">
            <template #header>
              <div class="card-header">
                <span class="card-title">偏好设置</span>
              </div>
            </template>
            
            <el-form :model="preferencesForm" label-width="100px" class="profile-form">
              <el-form-item label="正式程度">
                <el-radio-group 
                  v-model="preferencesForm.formality" 
                  @change="handlePreferencesUpdate"
                >
                  <el-radio value="casual">休闲</el-radio>
                  <el-radio value="business">商务</el-radio>
                  <el-radio value="formal">正式</el-radio>
                </el-radio-group>
              </el-form-item>
              
              <el-form-item label="预算范围">
                <el-radio-group 
                  v-model="preferencesForm.budget" 
                  @change="handlePreferencesUpdate"
                >
                  <el-radio value="low">经济型</el-radio>
                  <el-radio value="medium">中等</el-radio>
                  <el-radio value="high">高端</el-radio>
                </el-radio-group>
              </el-form-item>
              
              <el-form-item label="偏好颜色">
                <div class="color-selection">
                  <div 
                    v-for="color in colorOptions" 
                    :key="color.value"
                    class="color-item"
                    :class="{ active: preferencesForm.colors.includes(color.value) }"
                    @click="toggleColor(color.value)"
                  >
                    <div 
                      class="color-swatch" 
                      :style="{ backgroundColor: color.hex }"
                    ></div>
                    <span class="color-name">{{ color.label }}</span>
                  </div>
                </div>
              </el-form-item>
            </el-form>
          </el-card>
        </el-col>
      </el-row>
      
      <!-- 完成度指示器 -->
      <div class="completion-section">
        <el-card class="completion-card" shadow="hover">
          <div class="completion-content">
            <div class="completion-info">
              <h3 class="completion-title">资料完成度</h3>
              <p class="completion-subtitle">
                完善资料可以获得更精准的个性化推荐
              </p>
            </div>
            
            <div class="completion-progress">
              <el-progress
                type="circle"
                :percentage="completionPercentage"
                :width="100"
                :stroke-width="8"
                :color="progressColor"
              >
                <template #default="{ percentage }">
                  <span class="progress-text">{{ percentage }}%</span>
                </template>
              </el-progress>
            </div>
            
            <div class="completion-status">
              <el-tag 
                :type="isProfileComplete ? 'success' : 'warning'"
                size="large"
              >
                {{ isProfileComplete ? '资料完整' : '待完善' }}
              </el-tag>
            </div>
          </div>
          
          <div class="completion-checklist" v-if="!isProfileComplete">
            <h4 class="checklist-title">还需要完善：</h4>
            <ul class="checklist">
              <li v-if="!profileForm.name" class="checklist-item">
                <el-icon class="item-icon"><Warning /></el-icon>
                请填写姓名
              </li>
              <li v-if="!profileForm.profession" class="checklist-item">
                <el-icon class="item-icon"><Warning /></el-icon>
                请选择职业
              </li>
              <li v-if="!profileForm.style" class="checklist-item">
                <el-icon class="item-icon"><Warning /></el-icon>
                请选择个人风格
              </li>
              <li v-if="preferencesForm.colors.length === 0" class="checklist-item">
                <el-icon class="item-icon"><Warning /></el-icon>
                请选择偏好颜色
              </li>
            </ul>
          </div>
        </el-card>
      </div>
      
      <!-- 保存按钮 -->
      <div class="action-section">
        <el-button 
          type="primary" 
          size="large"
          @click="saveProfile"
          :disabled="!hasChanges"
        >
          <el-icon><Check /></el-icon>
          保存设置
        </el-button>
        
        <el-button 
          v-if="isProfileComplete"
          type="success" 
          size="large"
          @click="goToDashboard"
        >
          <el-icon><ArrowRight /></el-icon>
          进入应用
        </el-button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, reactive, watch } from 'vue'
import { useUserProfile } from '../composables/useUserProfile'
import { ElMessage } from 'element-plus'

const { profile, isProfileComplete, updateProfile, updatePreferences } = useUserProfile()

// 表单数据
const profileForm = reactive({
  name: profile.value.name,
  profession: profile.value.profession,
  style: profile.value.style
})

const preferencesForm = reactive({
  formality: profile.value.preferences.formality,
  budget: profile.value.preferences.budget,
  colors: [...profile.value.preferences.colors]
})

// 颜色选项
const colorOptions = [
  { label: '黑色', value: '黑色', hex: '#000000' },
  { label: '白色', value: '白色', hex: '#FFFFFF' },
  { label: '深蓝色', value: '深蓝色', hex: '#1a365d' },
  { label: '灰色', value: '灰色', hex: '#718096' },
  { label: '米色', value: '米色', hex: '#f7fafc' },
  { label: '棕色', value: '棕色', hex: '#8b4513' },
  { label: '深红色', value: '深红色', hex: '#c53030' },
  { label: '深绿色', value: '深绿色', hex: '#276749' }
]

// 是否有变更
const hasChanges = ref(false)

// 完成度百分比
const completionPercentage = computed(() => {
  let completed = 0
  let total = 4
  
  if (profileForm.name) completed++
  if (profileForm.profession) completed++
  if (profileForm.style) completed++
  if (preferencesForm.colors.length > 0) completed++
  
  return Math.round((completed / total) * 100)
})

// 进度条颜色
const progressColor = computed(() => {
  if (completionPercentage.value < 50) return '#f56565'
  if (completionPercentage.value < 80) return '#ed8936'
  return '#48bb78'
})

// 监听表单变化
watch([profileForm, preferencesForm], () => {
  hasChanges.value = true
}, { deep: true })

// 切换颜色选择
const toggleColor = (color: string) => {
  const index = preferencesForm.colors.indexOf(color)
  if (index > -1) {
    preferencesForm.colors.splice(index, 1)
  } else {
    preferencesForm.colors.push(color)
  }
  hasChanges.value = true
}

// 处理基本信息更新
const handleProfileUpdate = () => {
  hasChanges.value = true
}

// 处理偏好设置更新
const handlePreferencesUpdate = () => {
  hasChanges.value = true
}

// 保存设置
const saveProfile = () => {
  updateProfile({
    name: profileForm.name,
    profession: profileForm.profession,
    style: profileForm.style
  })
  
  updatePreferences({
    formality: preferencesForm.formality,
    budget: preferencesForm.budget,
    colors: preferencesForm.colors
  })
  
  hasChanges.value = false
  ElMessage.success('设置已保存')
}

// 前往仪表盘
const goToDashboard = () => {
  // 这里应该触发页面切换事件
  ElMessage.success('欢迎使用体面管家！')
}
</script>

<style scoped>
.user-profile {
  max-width: 1200px;
  margin: 0 auto;
  animation: slideUp var(--transition-slow);
}

.profile-header {
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
  width: 80px;
  height: 4px;
  background: var(--primary-gradient);
  border-radius: 2px;
}

.title-icon {
  color: var(--primary-color);
  filter: drop-shadow(0 2px 4px rgba(102, 126, 234, 0.3));
  animation: float 3s ease-in-out infinite;
}

.page-subtitle {
  margin: 0;
  font-size: 1.125rem;
  color: var(--text-muted);
  opacity: 0;
  animation: fadeIn var(--transition-slow) 0.3s forwards;
}

.profile-content {
  display: flex;
  flex-direction: column;
  gap: var(--space-xl);
}

.profile-card {
  height: 100%;
  border: 1px solid var(--border-light);
  background: var(--bg-primary);
  transition: all var(--transition-normal);
  position: relative;
  overflow: hidden;
}

.profile-card::before {
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

.profile-card:hover {
  transform: translateY(-4px);
  box-shadow: var(--shadow-xl);
  border-color: var(--primary-color);
}

.profile-card:hover::before {
  transform: scaleX(1);
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

.profile-form {
  padding: var(--space-lg);
}

.color-selection {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(140px, 1fr));
  gap: var(--space-md);
}

.color-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: var(--space-sm);
  padding: var(--space-md);
  border-radius: var(--radius-lg);
  cursor: pointer;
  transition: all var(--transition-normal);
  border: 2px solid transparent;
  background: var(--bg-secondary);
  position: relative;
  overflow: hidden;
}

.color-item::before {
  content: '';
  position: absolute;
  top: 0;
  left: -100%;
  width: 100%;
  height: 100%;
  background: linear-gradient(90deg, transparent, rgba(102, 126, 234, 0.1), transparent);
  transition: left var(--transition-slow);
}

.color-item:hover::before {
  left: 100%;
}

.color-item:hover {
  background: rgba(102, 126, 234, 0.05);
  border-color: var(--primary-color);
  transform: translateY(-2px);
  box-shadow: var(--shadow-md);
}

.color-item.active {
  background: linear-gradient(135deg, rgba(102, 126, 234, 0.1) 0%, rgba(118, 75, 162, 0.1) 100%);
  border-color: var(--primary-color);
  transform: translateY(-4px);
  box-shadow: var(--shadow-lg);
}

.color-item.active::after {
  content: '✓';
  position: absolute;
  top: var(--space-xs);
  right: var(--space-xs);
  width: 20px;
  height: 20px;
  background: var(--primary-gradient);
  color: white;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 12px;
  font-weight: 700;
}

.color-swatch {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  border: 3px solid var(--border-color);
  box-shadow: var(--shadow-sm);
  transition: all var(--transition-normal);
}

.color-item:hover .color-swatch {
  transform: scale(1.1);
  box-shadow: var(--shadow-md);
}

.color-item.active .color-swatch {
  border-color: var(--primary-color);
  transform: scale(1.1);
  box-shadow: 0 4px 12px rgba(102, 126, 234, 0.3);
}

.color-name {
  font-size: 0.875rem;
  color: var(--text-secondary);
  text-align: center;
  font-weight: 600;
}

.completion-section {
  margin-top: var(--space-xl);
}

.completion-card {
  background: linear-gradient(135deg, var(--bg-secondary) 0%, var(--bg-tertiary) 100%);
  border: 1px solid var(--border-light);
  transition: all var(--transition-normal);
  position: relative;
  overflow: hidden;
}

.completion-card::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 4px;
  background: var(--primary-gradient);
}

.completion-card:hover {
  transform: translateY(-2px);
  box-shadow: var(--shadow-lg);
}

.completion-content {
  display: flex;
  align-items: center;
  gap: var(--space-2xl);
  margin-bottom: var(--space-xl);
  padding: var(--space-xl);
}

.completion-info {
  flex: 1;
}

.completion-title {
  margin: 0 0 var(--space-sm) 0;
  font-size: 1.5rem;
  font-weight: 700;
  color: var(--text-primary);
  background: var(--primary-gradient);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.completion-subtitle {
  margin: 0;
  font-size: 0.95rem;
  color: var(--text-muted);
  line-height: 1.6;
}

.completion-progress {
  flex-shrink: 0;
  position: relative;
}

.completion-progress::before {
  content: '';
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 140px;
  height: 140px;
  background: radial-gradient(circle, rgba(102, 126, 234, 0.1) 0%, transparent 70%);
  border-radius: 50%;
  z-index: -1;
}

.progress-text {
  font-size: 0.875rem;
  font-weight: 700;
  color: var(--text-primary);
}

.completion-status {
  flex-shrink: 0;
}

.completion-checklist {
  border-top: 1px solid var(--border-color);
  padding: var(--space-xl) var(--space-xl) 0;
}

.checklist-title {
  margin: 0 0 var(--space-lg) 0;
  font-size: 1.125rem;
  font-weight: 700;
  color: var(--text-primary);
  display: flex;
  align-items: center;
  gap: var(--space-sm);
}

.checklist-title::before {
  content: '⚠️';
  font-size: 1.25rem;
}

.checklist {
  margin: 0;
  padding: 0;
  list-style: none;
  display: flex;
  flex-direction: column;
  gap: var(--space-md);
}

.checklist-item {
  display: flex;
  align-items: center;
  gap: var(--space-sm);
  font-size: 0.95rem;
  color: #e53e3e;
  padding: var(--space-sm) var(--space-md);
  background: rgba(229, 62, 62, 0.05);
  border-radius: var(--radius-md);
  border-left: 4px solid #e53e3e;
  transition: all var(--transition-normal);
}

.checklist-item:hover {
  background: rgba(229, 62, 62, 0.1);
  transform: translateX(4px);
}

.item-icon {
  color: #ed8936;
  flex-shrink: 0;
}

.action-section {
  display: flex;
  justify-content: center;
  gap: var(--space-lg);
  margin-top: var(--space-2xl);
  padding: var(--space-xl) 0;
  border-top: 1px solid var(--border-color);
  position: relative;
}

.action-section::before {
  content: '';
  position: absolute;
  top: 0;
  left: 50%;
  transform: translateX(-50%);
  width: 100px;
  height: 2px;
  background: var(--primary-gradient);
}

/* 动画增强 */
.profile-card {
  animation: slideUp var(--transition-slow);
  animation-fill-mode: both;
}

.profile-card:nth-child(1) { animation-delay: 0.1s; }
.profile-card:nth-child(2) { animation-delay: 0.2s; }

.completion-card {
  animation: slideUp var(--transition-slow) 0.3s both;
}

/* 表单控件增强 */
:deep(.el-form-item__label) {
  font-weight: 600;
  color: var(--text-primary);
}

:deep(.el-input__wrapper) {
  border-radius: var(--radius-md);
  transition: all var(--transition-normal);
  box-shadow: var(--shadow-sm);
}

:deep(.el-input__wrapper:hover) {
  box-shadow: var(--shadow-md);
}

:deep(.el-input__wrapper.is-focus) {
  box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
}

:deep(.el-select .el-input__wrapper) {
  transition: all var(--transition-normal);
}

:deep(.el-radio__label) {
  font-weight: 500;
  color: var(--text-secondary);
}

:deep(.el-radio.is-checked .el-radio__label) {
  color: var(--primary-color);
  font-weight: 600;
}

:deep(.el-button) {
  border-radius: var(--radius-md);
  font-weight: 600;
  transition: all var(--transition-normal);
}

:deep(.el-button--primary) {
  background: var(--primary-gradient);
  border: none;
  box-shadow: 0 4px 12px rgba(102, 126, 234, 0.3);
}

:deep(.el-button--primary:hover) {
  transform: translateY(-2px);
  box-shadow: 0 6px 16px rgba(102, 126, 234, 0.4);
}

:deep(.el-button--success) {
  background: linear-gradient(135deg, #43e97b 0%, #38f9d7 100%);
  border: none;
  box-shadow: 0 4px 12px rgba(67, 233, 123, 0.3);
}

:deep(.el-button--success:hover) {
  transform: translateY(-2px);
  box-shadow: 0 6px 16px rgba(67, 233, 123, 0.4);
}

:deep(.el-progress-circle__track) {
  stroke: var(--border-light);
}

:deep(.el-tag) {
  border-radius: var(--radius-lg);
  font-weight: 600;
  letter-spacing: 0.5px;
  text-transform: uppercase;
}

:deep(.el-tag--success) {
  background: linear-gradient(135deg, rgba(67, 233, 123, 0.1) 0%, rgba(56, 249, 215, 0.1) 100%);
  border-color: #43e97b;
  color: #22543d;
}

:deep(.el-tag--warning) {
  background: linear-gradient(135deg, rgba(246, 173, 85, 0.1) 0%, rgba(237, 137, 54, 0.1) 100%);
  border-color: #f6ad55;
  color: #744210;
}

/* 响应式设计 */
@media (max-width: 1024px) {
  .completion-content {
    gap: var(--space-xl);
  }
  
  .color-selection {
    grid-template-columns: repeat(auto-fill, minmax(120px, 1fr));
  }
}

@media (max-width: 768px) {
  .user-profile {
    animation: none;
  }
  
  .page-title {
    font-size: 2rem;
    flex-direction: column;
    gap: var(--space-sm);
  }
  
  .completion-content {
    flex-direction: column;
    text-align: center;
    gap: var(--space-lg);
  }
  
  .color-selection {
    grid-template-columns: repeat(auto-fill, minmax(100px, 1fr));
    gap: var(--space-sm);
  }
  
  .action-section {
    flex-direction: column;
    align-items: center;
    gap: var(--space-md);
  }
  
  .card-header,
  .profile-form,
  .completion-content,
  .completion-checklist {
    padding: var(--space-md);
  }
  
  /* 禁用动画以提升移动端性能 */
  .profile-card,
  .completion-card {
    animation: none;
  }
}

@media (max-width: 480px) {
  .page-title {
    font-size: 1.75rem;
  }
  
  .completion-title {
    font-size: 1.25rem;
  }
  
  .color-item {
    padding: var(--space-sm);
  }
  
  .color-swatch {
    width: 32px;
    height: 32px;
  }
  
  .completion-progress::before {
    width: 120px;
    height: 120px;
  }
}
</style>
