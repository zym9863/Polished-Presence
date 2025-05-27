<template>
  <div class="checklist-manager">
    <div class="page-header">
      <h2 class="page-title">
        <el-icon class="title-icon"><List /></el-icon>
        生活清单
      </h2>
      <p class="page-subtitle">
        管理日常事务，保持生活的井然有序
      </p>
    </div>

    <!-- 清单概览 -->
    <div class="checklist-overview">
      <el-row :gutter="20">
        <el-col :span="8">
          <el-card class="overview-card" shadow="hover">
            <div class="overview-content">
              <div class="overview-icon morning">
                <el-icon :size="24"><Sunrise /></el-icon>
              </div>
              <div class="overview-info">
                <div class="overview-number">{{ getMorningProgress() }}%</div>
                <div class="overview-label">晨间完成度</div>
              </div>
            </div>
          </el-card>
        </el-col>
        
        <el-col :span="8">
          <el-card class="overview-card" shadow="hover">
            <div class="overview-content">
              <div class="overview-icon evening">
                <el-icon :size="24"><Moon /></el-icon>
              </div>
              <div class="overview-info">
                <div class="overview-number">{{ getEveningProgress() }}%</div>
                <div class="overview-label">晚间完成度</div>
              </div>
            </div>
          </el-card>
        </el-col>
        
        <el-col :span="8">
          <el-card class="overview-card" shadow="hover">
            <div class="overview-content">
              <div class="overview-icon total">
                <el-icon :size="24"><CircleCheck /></el-icon>
              </div>
              <div class="overview-info">
                <div class="overview-number">{{ getTotalProgress() }}%</div>
                <div class="overview-label">总体完成度</div>
              </div>
            </div>
          </el-card>
        </el-col>
      </el-row>
    </div>

    <!-- 快速操作 -->
    <div class="quick-actions">
      <el-card class="actions-card" shadow="hover">
        <template #header>
          <div class="card-header">
            <span class="card-title">快速操作</span>
            <el-button type="primary" @click="showAddDialog = true">
              <el-icon><Plus /></el-icon>
              添加清单项
            </el-button>
          </div>
        </template>
        
        <div class="action-buttons">
          <el-button 
            v-for="template in quickTemplates"
            :key="template.id"
            @click="addFromTemplate(template)"
            class="template-button"
          >
            <el-icon>
              <component :is="template.icon" />
            </el-icon>
            {{ template.title }}
          </el-button>
        </div>
      </el-card>
    </div>

    <!-- 分类清单 -->
    <div class="categorized-checklists">
      <el-tabs v-model="activeTab" type="border-card">
        <el-tab-pane 
          v-for="category in categories"
          :key="category.key"
          :name="category.key"
        >
          <template #label>
            <span class="tab-label">
              <el-icon>
                <component :is="category.icon" />
              </el-icon>
              {{ category.label }}
              <el-badge 
                :value="getUncompletedCount(category.key)" 
                :hidden="getUncompletedCount(category.key) === 0"
                class="tab-badge"
              />
            </span>
          </template>
          
          <div class="checklist-content">
            <div class="checklist-items">
              <el-card 
                v-for="item in getItemsByCategory(category.key)"
                :key="item.id"
                class="checklist-item"
                :class="{ completed: item.completed }"
                shadow="hover"
              >
                <div class="item-content">
                  <div class="item-main">
                    <el-checkbox 
                      :model-value="item.completed"
                      @change="toggleItem(item.id)"
                      size="large"
                    >
                      <div class="item-info">
                        <h4 class="item-title">{{ item.title }}</h4>
                        <p class="item-description">{{ item.description }}</p>
                      </div>
                    </el-checkbox>
                  </div>
                  
                  <div class="item-meta">
                    <el-tag 
                      :type="getPriorityType(item.priority)"
                      size="small"
                      class="priority-tag"
                    >
                      {{ getPriorityLabel(item.priority) }}
                    </el-tag>
                    
                    <div class="item-due" v-if="item.dueDate">
                      <el-icon><Clock /></el-icon>
                      <span class="due-text">{{ formatDueDate(item.dueDate) }}</span>
                    </div>
                    
                    <el-dropdown @command="handleItemAction">
                      <el-button type="text" size="small">
                        <el-icon><MoreFilled /></el-icon>
                      </el-button>
                      <template #dropdown>
                        <el-dropdown-menu>
                          <el-dropdown-item :command="`edit-${item.id}`">编辑</el-dropdown-item>
                          <el-dropdown-item :command="`delete-${item.id}`" divided>删除</el-dropdown-item>
                        </el-dropdown-menu>
                      </template>
                    </el-dropdown>
                  </div>
                </div>
              </el-card>
            </div>
            
            <div v-if="getItemsByCategory(category.key).length === 0" class="empty-list">
              <el-icon :size="48"><Box /></el-icon>
              <p>暂无{{ category.label }}清单项</p>
              <el-button type="primary" text @click="showAddDialog = true">
                添加第一个清单项
              </el-button>
            </div>
          </div>
        </el-tab-pane>
      </el-tabs>
    </div>

    <!-- 添加清单项对话框 -->
    <el-dialog
      v-model="showAddDialog"
      title="添加清单项"
      width="500px"
      center
    >
      <el-form :model="newItemForm" label-width="80px">
        <el-form-item label="标题" required>
          <el-input 
            v-model="newItemForm.title"
            placeholder="请输入清单项标题"
          />
        </el-form-item>
        
        <el-form-item label="描述">
          <el-input 
            v-model="newItemForm.description"
            type="textarea"
            :rows="3"
            placeholder="请输入详细描述"
          />
        </el-form-item>
        
        <el-form-item label="分类">
          <el-select v-model="newItemForm.category" style="width: 100%">
            <el-option 
              v-for="category in categories"
              :key="category.key"
              :label="category.label"
              :value="category.key"
            />
          </el-select>
        </el-form-item>
        
        <el-form-item label="优先级">
          <el-radio-group v-model="newItemForm.priority">
            <el-radio value="low">低</el-radio>
            <el-radio value="medium">中</el-radio>
            <el-radio value="high">高</el-radio>
          </el-radio-group>
        </el-form-item>
        
        <el-form-item label="截止日期">
          <el-date-picker
            v-model="newItemForm.dueDate"
            type="datetime"
            placeholder="选择截止日期"
            style="width: 100%"
          />
        </el-form-item>
      </el-form>
      
      <template #footer>
        <div class="dialog-footer">
          <el-button @click="showAddDialog = false">取消</el-button>
          <el-button type="primary" @click="addNewItem">
            <el-icon><Check /></el-icon>
            添加
          </el-button>
        </div>
      </template>
    </el-dialog>

    <!-- 编辑清单项对话框 -->
    <el-dialog
      v-model="showEditDialog"
      title="编辑清单项"
      width="500px"
      center
    >
      <el-form :model="editItemForm" label-width="80px" v-if="editItemForm">
        <el-form-item label="标题" required>
          <el-input 
            v-model="editItemForm.title"
            placeholder="请输入清单项标题"
          />
        </el-form-item>
        
        <el-form-item label="描述">
          <el-input 
            v-model="editItemForm.description"
            type="textarea"
            :rows="3"
            placeholder="请输入详细描述"
          />
        </el-form-item>
        
        <el-form-item label="分类">
          <el-select v-model="editItemForm.category" style="width: 100%">
            <el-option 
              v-for="category in categories"
              :key="category.key"
              :label="category.label"
              :value="category.key"
            />
          </el-select>
        </el-form-item>
        
        <el-form-item label="优先级">
          <el-radio-group v-model="editItemForm.priority">
            <el-radio value="low">低</el-radio>
            <el-radio value="medium">中</el-radio>
            <el-radio value="high">高</el-radio>
          </el-radio-group>
        </el-form-item>
        
        <el-form-item label="截止日期">
          <el-date-picker
            v-model="editItemForm.dueDate"
            type="datetime"
            placeholder="选择截止日期"
            style="width: 100%"
          />
        </el-form-item>
      </el-form>
      
      <template #footer>
        <div class="dialog-footer">
          <el-button @click="showEditDialog = false">取消</el-button>
          <el-button type="primary" @click="updateItem">
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
import type { ChecklistItem } from '../types'
import { ElMessage, ElMessageBox } from 'element-plus'

const {
  checklist,
  completeChecklistItem,
  addChecklistItem,
  removeChecklistItem
} = useHabits()

// 对话框状态
const showAddDialog = ref(false)
const showEditDialog = ref(false)
const activeTab = ref('morning')
const editingItemId = ref('')

// 表单数据
const newItemForm = reactive({
  title: '',
  description: '',
  category: 'morning' as ChecklistItem['category'],
  priority: 'medium' as ChecklistItem['priority'],
  dueDate: null as Date | null
})

const editItemForm = ref<Partial<ChecklistItem> | null>(null)

// 分类配置
const categories = [
  { key: 'morning', label: '晨间清单', icon: 'Sunrise' },
  { key: 'evening', label: '晚间清单', icon: 'Moon' },
  { key: 'weekly', label: '每周清单', icon: 'Calendar' },
  { key: 'monthly', label: '每月清单', icon: 'Date' }
]

// 快速模板
const quickTemplates = [
  {
    id: 'grooming',
    title: '个人护理',
    icon: 'User',
    category: 'morning',
    description: '完成基础护肤和仪容整理',
    priority: 'high'
  },
  {
    id: 'outfit',
    title: '检查着装',
    icon: 'Suitcase',
    category: 'morning',
    description: '确保服装搭配得体',
    priority: 'high'
  },
  {
    id: 'cleanup',
    title: '整理空间',
    icon: 'HomeFilled',
    category: 'evening',
    description: '收拾整理个人空间',
    priority: 'medium'
  },
  {
    id: 'review',
    title: '当日回顾',
    icon: 'Document',
    category: 'evening',
    description: '回顾今日收获和待改进之处',
    priority: 'low'
  }
]

// 计算各分类进度
const getMorningProgress = () => {
  const morningItems = getItemsByCategory('morning')
  if (morningItems.length === 0) return 0
  const completed = morningItems.filter(item => item.completed).length
  return Math.round((completed / morningItems.length) * 100)
}

const getEveningProgress = () => {
  const eveningItems = getItemsByCategory('evening')
  if (eveningItems.length === 0) return 0
  const completed = eveningItems.filter(item => item.completed).length
  return Math.round((completed / eveningItems.length) * 100)
}

const getTotalProgress = () => {
  if (checklist.value.length === 0) return 0
  const completed = checklist.value.filter(item => item.completed).length
  return Math.round((completed / checklist.value.length) * 100)
}

// 按分类获取清单项
const getItemsByCategory = (category: string) => {
  return checklist.value.filter(item => item.category === category)
    .sort((a, b) => {
      // 按优先级和完成状态排序
      if (a.completed !== b.completed) {
        return a.completed ? 1 : -1
      }
      const priorityOrder = { high: 3, medium: 2, low: 1 }
      return priorityOrder[b.priority] - priorityOrder[a.priority]
    })
}

// 获取未完成项目数量
const getUncompletedCount = (category: string) => {
  return getItemsByCategory(category).filter(item => !item.completed).length
}

// 获取优先级标签
const getPriorityLabel = (priority: string) => {
  const labels: Record<string, string> = {
    'high': '高',
    'medium': '中',
    'low': '低'
  }
  return labels[priority] || priority
}

// 获取优先级类型
const getPriorityType = (priority: string) => {
  const types: Record<string, string> = {
    'high': 'danger',
    'medium': 'warning',
    'low': 'info'
  }
  return types[priority] || 'info'
}

// 格式化截止日期
const formatDueDate = (date: Date) => {
  const now = new Date()
  const dueDate = new Date(date)
  const diffTime = dueDate.getTime() - now.getTime()
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
  
  if (diffDays < 0) {
    return '已过期'
  } else if (diffDays === 0) {
    return '今天'
  } else if (diffDays === 1) {
    return '明天'
  } else if (diffDays <= 7) {
    return `${diffDays}天后`
  } else {
    return dueDate.toLocaleDateString()
  }
}

// 切换清单项完成状态
const toggleItem = (itemId: string) => {
  completeChecklistItem(itemId)
  const item = checklist.value.find(item => item.id === itemId)
  if (item?.completed) {
    ElMessage.success('清单项已完成！')
  }
}

// 从模板添加
const addFromTemplate = (template: any) => {
  addChecklistItem({
    title: template.title,
    description: template.description,
    category: template.category,
    priority: template.priority
  })
  ElMessage.success(`已添加"${template.title}"到清单`)
}

// 处理清单项操作
const handleItemAction = (command: string) => {
  const [action, itemId] = command.split('-')
  
  if (action === 'edit') {
    const item = checklist.value.find(item => item.id === itemId)
    if (item) {
      editItemForm.value = { ...item }
      editingItemId.value = itemId
      showEditDialog.value = true
    }
  } else if (action === 'delete') {
    ElMessageBox.confirm(
      '确定要删除这个清单项吗？',
      '确认删除',
      {
        confirmButtonText: '删除',
        cancelButtonText: '取消',
        type: 'warning',
      }
    ).then(() => {
      removeChecklistItem(itemId)
      ElMessage.success('清单项已删除')
    }).catch(() => {
      // 用户取消删除
    })
  }
}

// 添加新清单项
const addNewItem = () => {
  if (!newItemForm.title.trim()) {
    ElMessage.warning('请输入清单项标题')
    return
  }
  
  addChecklistItem({
    title: newItemForm.title,
    description: newItemForm.description,
    category: newItemForm.category,
    priority: newItemForm.priority,
    dueDate: newItemForm.dueDate || undefined
  })
  
  // 重置表单
  Object.assign(newItemForm, {
    title: '',
    description: '',
    category: 'morning',
    priority: 'medium',
    dueDate: null
  })
  
  showAddDialog.value = false
  ElMessage.success('清单项添加成功！')
}

// 更新清单项
const updateItem = () => {
  if (!editItemForm.value?.title?.trim()) {
    ElMessage.warning('请输入清单项标题')
    return
  }
  
  // 删除旧的，添加新的
  removeChecklistItem(editingItemId.value)
  addChecklistItem({
    title: editItemForm.value.title,
    description: editItemForm.value.description || '',
    category: editItemForm.value.category || 'morning',
    priority: editItemForm.value.priority || 'medium',
    dueDate: editItemForm.value.dueDate
  })
  
  showEditDialog.value = false
  editItemForm.value = null
  editingItemId.value = ''
  ElMessage.success('清单项更新成功！')
}
</script>

<style scoped>
.checklist-manager {
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

.checklist-overview {
  margin-bottom: 32px;
}

.overview-card {
  transition: transform 0.2s ease;
}

.overview-card:hover {
  transform: translateY(-2px);
}

.overview-content {
  display: flex;
  align-items: center;
  gap: 16px;
}

.overview-icon {
  width: 56px;
  height: 56px;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  flex-shrink: 0;
}

.overview-icon.morning {
  background: linear-gradient(135deg, #ffecd2 0%, #fcb69f 100%);
  color: #c05621;
}

.overview-icon.evening {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
}

.overview-icon.total {
  background: linear-gradient(135deg, #4facfe 0%, #00f2fe 100%);
}

.overview-info {
  flex: 1;
}

.overview-number {
  font-size: 24px;
  font-weight: 700;
  color: #2d3748;
  line-height: 1;
  margin-bottom: 4px;
}

.overview-label {
  font-size: 14px;
  color: #718096;
}

.quick-actions {
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

.action-buttons {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 16px;
}

.template-button {
  height: 60px;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  font-size: 14px;
}

.categorized-checklists {
  margin-bottom: 32px;
}

.tab-label {
  display: flex;
  align-items: center;
  gap: 8px;
}

.tab-badge {
  margin-left: 4px;
}

.checklist-content {
  min-height: 300px;
}

.checklist-items {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.checklist-item {
  transition: all 0.3s ease;
  border: 2px solid transparent;
}

.checklist-item:hover {
  border-color: #e2e8f0;
  transform: translateY(-1px);
}

.checklist-item.completed {
  background: #f0fff4;
  border-color: #9ae6b4;
}

.item-content {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
}

.item-main {
  flex: 1;
}

.item-info {
  margin-left: 12px;
}

.item-title {
  margin: 0 0 4px 0;
  font-size: 16px;
  font-weight: 600;
  color: #2d3748;
}

.item-description {
  margin: 0;
  font-size: 14px;
  color: #718096;
  line-height: 1.4;
}

.item-meta {
  display: flex;
  align-items: center;
  gap: 12px;
  flex-shrink: 0;
}

.priority-tag {
  font-size: 12px;
}

.item-due {
  display: flex;
  align-items: center;
  gap: 4px;
  font-size: 12px;
  color: #718096;
}

.due-text {
  white-space: nowrap;
}

.empty-list {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 16px;
  padding: 60px 20px;
  color: #a0aec0;
}

.empty-list p {
  margin: 0;
  font-size: 16px;
}

.dialog-footer {
  display: flex;
  justify-content: flex-end;
  gap: 12px;
}

/* 响应式设计 */
@media (max-width: 768px) {
  .checklist-overview .el-col {
    margin-bottom: 16px;
  }
  
  .action-buttons {
    grid-template-columns: 1fr;
  }
  
  .item-content {
    flex-direction: column;
    align-items: flex-start;
    gap: 12px;
  }
  
  .item-meta {
    align-self: flex-end;
  }
  
  .overview-number {
    font-size: 20px;
  }
}
</style>
