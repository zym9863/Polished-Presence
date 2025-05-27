<template>
  <div class="habits-manager">
    <div class="page-header">
      <h2 class="page-title">
        <el-icon class="title-icon"><Clock /></el-icon>
        习惯养成
      </h2>
      <p class="page-subtitle">
        培养良好的日常习惯，让体面成为一种生活方式
      </p>
    </div>

    <!-- 进度概览 -->
    <div class="progress-overview">
      <el-row :gutter="20">
        <el-col :span="6">
          <el-card class="stat-card" shadow="hover">
            <div class="stat-content">
              <div class="stat-number">{{ progressStats.completedToday }}</div>
              <div class="stat-label">今日完成</div>
              <div class="stat-progress">
                <el-progress 
                  :percentage="Math.round((progressStats.completedToday / progressStats.totalHabits) * 100)"
                  :show-text="false"
                  stroke-width="4"
                />
              </div>
            </div>
          </el-card>
        </el-col>
        
        <el-col :span="6">
          <el-card class="stat-card" shadow="hover">
            <div class="stat-content">
              <div class="stat-number">{{ progressStats.longestStreak }}</div>
              <div class="stat-label">最长连击</div>
              <div class="stat-unit">天</div>
            </div>
          </el-card>
        </el-col>
        
        <el-col :span="6">
          <el-card class="stat-card" shadow="hover">
            <div class="stat-content">
              <div class="stat-number">{{ progressStats.currentStreak }}</div>
              <div class="stat-label">当前连击</div>
              <div class="stat-unit">天</div>
            </div>
          </el-card>
        </el-col>
        
        <el-col :span="6">
          <el-card class="stat-card" shadow="hover">
            <div class="stat-content">
              <div class="stat-number">{{ progressStats.weeklyCompletion }}%</div>
              <div class="stat-label">本周完成率</div>
            </div>
          </el-card>
        </el-col>
      </el-row>
    </div>

    <!-- 今日习惯 -->
    <div class="today-habits">
      <el-card class="habits-card" shadow="hover">
        <template #header>
          <div class="card-header">
            <span class="card-title">今日习惯</span>
            <el-button type="primary" @click="showAddDialog = true">
              <el-icon><Plus /></el-icon>
              添加习惯
            </el-button>
          </div>
        </template>
        
        <div class="habits-list" v-if="todayHabits.length > 0">
          <div 
            v-for="habit in todayHabits"
            :key="habit.id"
            class="habit-item"
            :class="{ completed: habit.completed }"
          >
            <div class="habit-main">
              <el-checkbox 
                :model-value="habit.completed"
                @change="handleHabitComplete(habit.id)"
                :disabled="habit.completed"
                size="large"
              >
                <div class="habit-info">
                  <h4 class="habit-title">{{ habit.title }}</h4>
                  <p class="habit-description">{{ habit.description }}</p>
                </div>
              </el-checkbox>
            </div>
            
            <div class="habit-meta">
              <div class="habit-category">
                <el-tag 
                  :type="getCategoryTagType(habit.category)"
                  size="small"
                >
                  {{ getCategoryLabel(habit.category) }}
                </el-tag>
              </div>
              
              <div class="habit-streak" v-if="habit.streak > 0">
                <el-icon class="streak-icon"><Lightning /></el-icon>
                <span class="streak-number">{{ habit.streak }}</span>
              </div>
              
              <el-dropdown @command="handleHabitAction">
                <el-button type="text" size="small">
                  <el-icon><MoreFilled /></el-icon>
                </el-button>
                <template #dropdown>
                  <el-dropdown-menu>
                    <el-dropdown-item :command="`edit-${habit.id}`">编辑</el-dropdown-item>
                    <el-dropdown-item :command="`delete-${habit.id}`" divided>删除</el-dropdown-item>
                  </el-dropdown-menu>
                </template>
              </el-dropdown>
            </div>
          </div>
        </div>
        
        <el-empty v-else description="还没有添加习惯，点击上方按钮添加第一个习惯吧！" />
      </el-card>
    </div>

    <!-- 习惯分类 -->
    <div class="habits-categories">
      <el-card class="categories-card" shadow="hover">
        <template #header>
          <span class="card-title">按分类管理</span>
        </template>
        
        <el-tabs v-model="activeCategory" type="border-card">
          <el-tab-pane 
            v-for="category in categories"
            :key="category.key"
            :label="category.label"
            :name="category.key"
          >
            <div class="category-habits">
              <div 
                v-for="habit in getHabitsByCategory(category.key)"
                :key="habit.id"
                class="category-habit-item"
              >
                <div class="habit-summary">
                  <div class="habit-basic">
                    <h5 class="habit-name">{{ habit.title }}</h5>
                    <span class="habit-frequency">{{ getFrequencyLabel(habit.frequency) }}</span>
                  </div>
                  <div class="habit-progress">
                    <el-progress
                      type="circle"
                      :percentage="getHabitProgress(habit)"
                      :width="40"
                      :stroke-width="4"
                      :show-text="false"
                    />
                  </div>
                </div>
              </div>
              
              <div v-if="getHabitsByCategory(category.key).length === 0" class="empty-category">
                <el-icon><Box /></el-icon>
                <span>暂无{{ category.label }}习惯</span>
              </div>
            </div>
          </el-tab-pane>
        </el-tabs>
      </el-card>
    </div>

    <!-- 添加习惯对话框 -->
    <el-dialog
      v-model="showAddDialog"
      title="添加新习惯"
      width="500px"
      center
    >
      <el-form :model="newHabitForm" label-width="80px">
        <el-form-item label="习惯名称" required>
          <el-input 
            v-model="newHabitForm.title"
            placeholder="请输入习惯名称"
          />
        </el-form-item>
        
        <el-form-item label="详细描述">
          <el-input 
            v-model="newHabitForm.description"
            type="textarea"
            :rows="3"
            placeholder="请输入习惯的详细描述"
          />
        </el-form-item>
        
        <el-form-item label="分类">
          <el-select v-model="newHabitForm.category" style="width: 100%">
            <el-option 
              v-for="category in categories"
              :key="category.key"
              :label="category.label"
              :value="category.key"
            />
          </el-select>
        </el-form-item>
        
        <el-form-item label="频率">
          <el-radio-group v-model="newHabitForm.frequency">
            <el-radio value="daily">每日</el-radio>
            <el-radio value="weekly">每周</el-radio>
            <el-radio value="monthly">每月</el-radio>
          </el-radio-group>
        </el-form-item>
      </el-form>
      
      <template #footer>
        <div class="dialog-footer">
          <el-button @click="showAddDialog = false">取消</el-button>
          <el-button type="primary" @click="addNewHabit">
            <el-icon><Check /></el-icon>
            添加
          </el-button>
        </div>
      </template>
    </el-dialog>

    <!-- 编辑习惯对话框 -->
    <el-dialog
      v-model="showEditDialog"
      title="编辑习惯"
      width="500px"
      center
    >
      <el-form :model="editHabitForm" label-width="80px" v-if="editHabitForm">
        <el-form-item label="习惯名称" required>
          <el-input 
            v-model="editHabitForm.title"
            placeholder="请输入习惯名称"
          />
        </el-form-item>
        
        <el-form-item label="详细描述">
          <el-input 
            v-model="editHabitForm.description"
            type="textarea"
            :rows="3"
            placeholder="请输入习惯的详细描述"
          />
        </el-form-item>
        
        <el-form-item label="分类">
          <el-select v-model="editHabitForm.category" style="width: 100%">
            <el-option 
              v-for="category in categories"
              :key="category.key"
              :label="category.label"
              :value="category.key"
            />
          </el-select>
        </el-form-item>
        
        <el-form-item label="频率">
          <el-radio-group v-model="editHabitForm.frequency">
            <el-radio value="daily">每日</el-radio>
            <el-radio value="weekly">每周</el-radio>
            <el-radio value="monthly">每月</el-radio>
          </el-radio-group>
        </el-form-item>
      </el-form>
      
      <template #footer>
        <div class="dialog-footer">
          <el-button @click="showEditDialog = false">取消</el-button>
          <el-button type="primary" @click="updateHabit">
            <el-icon><Check /></el-icon>
            保存
          </el-button>
        </div>
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, reactive } from 'vue'
import { useHabits } from '../composables/useHabits'
import type { Habit } from '../types'
import { ElMessage, ElMessageBox } from 'element-plus'

const {
  habits,
  todayHabits,
  progressStats,
  completeHabit,
  addHabit,
  removeHabit
} = useHabits()

// 对话框状态
const showAddDialog = ref(false)
const showEditDialog = ref(false)
const activeCategory = ref('grooming')
const editingHabitId = ref('')

// 表单数据
const newHabitForm = reactive({
  title: '',
  description: '',
  category: 'grooming' as Habit['category'],
  frequency: 'daily' as Habit['frequency']
})

const editHabitForm = ref<Partial<Habit> | null>(null)

// 分类配置
const categories = [
  { key: 'grooming', label: '个人护理' },
  { key: 'health', label: '健康生活' },
  { key: 'home', label: '居家整理' },
  { key: 'social', label: '社交礼仪' }
]

// 获取分类标签类型
const getCategoryTagType = (category: string) => {
  const types: Record<string, string> = {
    'grooming': 'primary',
    'health': 'success',
    'home': 'warning',
    'social': 'danger'
  }
  return types[category] || 'info'
}

// 获取分类标签
const getCategoryLabel = (category: string) => {
  const labels: Record<string, string> = {
    'grooming': '护理',
    'health': '健康',
    'home': '居家',
    'social': '社交'
  }
  return labels[category] || category
}

// 获取频率标签
const getFrequencyLabel = (frequency: string) => {
  const labels: Record<string, string> = {
    'daily': '每日',
    'weekly': '每周',
    'monthly': '每月'
  }
  return labels[frequency] || frequency
}

// 按分类获取习惯
const getHabitsByCategory = (category: string) => {
  return habits.value.filter(habit => habit.category === category)
}

// 获取习惯进度
const getHabitProgress = (habit: Habit) => {
  // 这里可以根据习惯的完成情况计算进度
  // 简单示例：基于连击天数
  if (habit.frequency === 'daily') {
    return Math.min((habit.streak / 30) * 100, 100)
  } else if (habit.frequency === 'weekly') {
    return Math.min((habit.streak / 12) * 100, 100)
  } else {
    return Math.min((habit.streak / 6) * 100, 100)
  }
}

// 处理习惯完成
const handleHabitComplete = (habitId: string) => {
  completeHabit(habitId)
  ElMessage.success('习惯已完成！继续保持！')
}

// 处理习惯操作
const handleHabitAction = (command: string) => {
  const [action, habitId] = command.split('-')
  
  if (action === 'edit') {
    const habit = habits.value.find(h => h.id === habitId)
    if (habit) {
      editHabitForm.value = { ...habit }
      editingHabitId.value = habitId
      showEditDialog.value = true
    }
  } else if (action === 'delete') {
    ElMessageBox.confirm(
      '确定要删除这个习惯吗？此操作不可恢复。',
      '确认删除',
      {
        confirmButtonText: '删除',
        cancelButtonText: '取消',
        type: 'warning',
      }
    ).then(() => {
      removeHabit(habitId)
      ElMessage.success('习惯已删除')
    }).catch(() => {
      // 用户取消删除
    })
  }
}

// 添加新习惯
const addNewHabit = () => {
  if (!newHabitForm.title.trim()) {
    ElMessage.warning('请输入习惯名称')
    return
  }
  
  addHabit({
    title: newHabitForm.title,
    description: newHabitForm.description,
    category: newHabitForm.category,
    frequency: newHabitForm.frequency
  })
  
  // 重置表单
  Object.assign(newHabitForm, {
    title: '',
    description: '',
    category: 'grooming',
    frequency: 'daily'
  })
  
  showAddDialog.value = false
  ElMessage.success('习惯添加成功！')
}

// 更新习惯
const updateHabit = () => {
  if (!editHabitForm.value?.title?.trim()) {
    ElMessage.warning('请输入习惯名称')
    return
  }
  
  // 这里需要在 useHabits 中添加更新习惯的方法
  // 暂时通过删除旧的再添加新的来实现
  removeHabit(editingHabitId.value)
  addHabit({
    title: editHabitForm.value.title,
    description: editHabitForm.value.description || '',
    category: editHabitForm.value.category || 'grooming',
    frequency: editHabitForm.value.frequency || 'daily'
  })
  
  showEditDialog.value = false
  editHabitForm.value = null
  editingHabitId.value = ''
  ElMessage.success('习惯更新成功！')
}
</script>

<style scoped>
.habits-manager {
  max-width: 1200px;
  margin: 0 auto;
}

.page-header {
  margin-bottom: 32px;
  text-align: center;
}

.page-title {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 12px;
  margin: 0 0 12px 0;
  font-size: 28px;
  font-weight: 600;
  color: #2d3748;
}

.title-icon {
  color: #667eea;
}

.page-subtitle {
  margin: 0;
  font-size: 16px;
  color: #718096;
}

.progress-overview {
  margin-bottom: 32px;
}

.stat-card {
  text-align: center;
  transition: transform 0.2s ease;
}

.stat-card:hover {
  transform: translateY(-2px);
}

.stat-content {
  padding: 8px 0;
}

.stat-number {
  font-size: 28px;
  font-weight: 700;
  color: #667eea;
  line-height: 1;
  margin-bottom: 8px;
}

.stat-label {
  font-size: 14px;
  color: #718096;
  margin-bottom: 8px;
}

.stat-unit {
  font-size: 12px;
  color: #a0aec0;
}

.stat-progress {
  margin-top: 8px;
}

.today-habits {
  margin-bottom: 32px;
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.card-title {
  font-size: 18px;
  font-weight: 600;
  color: #2d3748;
}

.habits-list {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.habit-item {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 20px;
  border-radius: 12px;
  background: #f7fafc;
  transition: all 0.3s ease;
  border: 2px solid transparent;
}

.habit-item:hover {
  background: #edf2f7;
  border-color: #e2e8f0;
}

.habit-item.completed {
  background: #f0fff4;
  border-color: #9ae6b4;
}

.habit-main {
  flex: 1;
}

.habit-info {
  margin-left: 12px;
}

.habit-title {
  margin: 0 0 4px 0;
  font-size: 16px;
  font-weight: 600;
  color: #2d3748;
}

.habit-description {
  margin: 0;
  font-size: 14px;
  color: #718096;
  line-height: 1.4;
}

.habit-meta {
  display: flex;
  align-items: center;
  gap: 12px;
}

.habit-streak {
  display: flex;
  align-items: center;
  gap: 4px;
  color: #f6ad55;
  font-weight: 600;
}

.streak-icon {
  color: #ed8936;
}

.streak-number {
  font-size: 14px;
}

.habits-categories {
  margin-bottom: 32px;
}

.category-habits {
  min-height: 200px;
}

.category-habit-item {
  padding: 16px;
  border-radius: 8px;
  background: #f7fafc;
  margin-bottom: 12px;
}

.habit-summary {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.habit-basic {
  flex: 1;
}

.habit-name {
  margin: 0 0 4px 0;
  font-size: 14px;
  font-weight: 600;
  color: #2d3748;
}

.habit-frequency {
  font-size: 12px;
  color: #718096;
}

.habit-progress {
  flex-shrink: 0;
}

.empty-category {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 12px;
  padding: 40px;
  color: #a0aec0;
  font-size: 14px;
}

.dialog-footer {
  display: flex;
  justify-content: flex-end;
  gap: 12px;
}

/* 响应式设计 */
@media (max-width: 768px) {
  .progress-overview .el-col {
    margin-bottom: 16px;
  }
  
  .habit-item {
    flex-direction: column;
    align-items: flex-start;
    gap: 16px;
  }
  
  .habit-meta {
    align-self: flex-end;
  }
  
  .stat-number {
    font-size: 24px;
  }
}
</style>
