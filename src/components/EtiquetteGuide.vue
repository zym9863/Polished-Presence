<template>
  <div class="etiquette-guide">
    <div class="page-header">
      <h2 class="page-title">
        <el-icon class="title-icon"><Reading /></el-icon>
        礼仪指南
      </h2>
      <p class="page-subtitle">
        掌握基本礼仪知识，提升个人素养和社交能力
      </p>
    </div>

    <!-- 分类筛选 -->
    <div class="filter-section">
      <el-card class="filter-card" shadow="hover">
        <div class="filter-content">
          <div class="filter-group">
            <span class="filter-label">分类筛选：</span>
            <el-radio-group v-model="selectedCategory" @change="handleCategoryChange">
              <el-radio-button value="">全部</el-radio-button>
              <el-radio-button value="business">商务礼仪</el-radio-button>
              <el-radio-button value="dining">用餐礼仪</el-radio-button>
              <el-radio-button value="social">社交礼仪</el-radio-button>
              <el-radio-button value="formal">正式场合</el-radio-button>
            </el-radio-group>
          </div>
          
          <div class="filter-group">
            <span class="filter-label">难度等级：</span>
            <el-radio-group v-model="selectedDifficulty" @change="handleDifficultyChange">
              <el-radio-button value="">全部</el-radio-button>
              <el-radio-button value="beginner">初级</el-radio-button>
              <el-radio-button value="intermediate">中级</el-radio-button>
              <el-radio-button value="advanced">高级</el-radio-button>
            </el-radio-group>
          </div>
        </div>
      </el-card>
    </div>

    <!-- 礼仪指南列表 -->
    <div class="guides-section">
      <div class="guides-grid">
        <el-card 
          v-for="guide in filteredGuides"
          :key="guide.id"
          class="guide-card"
          shadow="hover"
          @click="selectGuide(guide)"
        >
          <div class="guide-header">
            <div class="guide-icon">
              <el-icon :size="32">
                <component :is="getCategoryIcon(guide.category)" />
              </el-icon>
            </div>
            <div class="guide-meta">
              <h3 class="guide-title">{{ guide.title }}</h3>
              <div class="guide-tags">
                <el-tag 
                  :type="getCategoryTagType(guide.category)"
                  size="small"
                >
                  {{ getCategoryLabel(guide.category) }}
                </el-tag>
                <el-tag 
                  :type="getDifficultyTagType(guide.difficulty)"
                  size="small"
                >
                  {{ getDifficultyLabel(guide.difficulty) }}
                </el-tag>
              </div>
            </div>
          </div>
          
          <div class="guide-preview">
            <p class="guide-content-preview">{{ guide.content }}</p>
            <div class="guide-tips-count">
              <el-icon><InfoFilled /></el-icon>
              {{ guide.tips.length }} 个要点
            </div>
          </div>
        </el-card>
      </div>
    </div>

    <!-- 详细内容对话框 -->
    <el-dialog
      v-model="showDetailDialog"
      :title="selectedGuide?.title"
      width="800px"
      center
    >
      <div v-if="selectedGuide" class="guide-detail">
        <div class="detail-header">
          <div class="detail-meta">
            <el-tag 
              :type="getCategoryTagType(selectedGuide.category)"
              size="large"
            >
              {{ getCategoryLabel(selectedGuide.category) }}
            </el-tag>
            <el-tag 
              :type="getDifficultyTagType(selectedGuide.difficulty)"
              size="large"
            >
              {{ getDifficultyLabel(selectedGuide.difficulty) }}
            </el-tag>
          </div>
        </div>
        
        <div class="detail-content">
          <h4 class="content-title">详细说明</h4>
          <div class="content-text">
            {{ getFullContent(selectedGuide.category) }}
          </div>
        </div>
        
        <div class="detail-tips">
          <h4 class="tips-title">关键要点</h4>
          <ul class="tips-list">
            <li 
              v-for="(tip, index) in selectedGuide.tips"
              :key="index"
              class="tip-item"
            >
              <el-icon class="tip-icon"><CircleCheckFilled /></el-icon>
              {{ tip }}
            </li>
          </ul>
        </div>
        
        <div class="detail-examples" v-if="getExamples(selectedGuide.category).length > 0">
          <h4 class="examples-title">实用示例</h4>
          <div class="examples-list">
            <div 
              v-for="(example, index) in getExamples(selectedGuide.category)"
              :key="index"
              class="example-item"
            >
              <div class="example-scenario">
                <strong>{{ example.scenario }}</strong>
              </div>
              <div class="example-description">
                {{ example.description }}
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <template #footer>
        <div class="dialog-footer">
          <el-button @click="showDetailDialog = false">关闭</el-button>
          <el-button type="primary" @click="markAsRead">
            <el-icon><Check /></el-icon>
            已掌握
          </el-button>
        </div>
      </template>
    </el-dialog>

    <!-- 快速参考卡片 -->
    <div class="quick-reference">
      <el-card class="reference-card" shadow="hover">
        <template #header>
          <span class="card-title">快速参考</span>
        </template>
        
        <div class="reference-content">
          <div class="reference-section">
            <h4 class="section-title">商务会面基本礼仪</h4>
            <ul class="reference-list">
              <li>准时到达，提前5-10分钟为宜</li>
              <li>主动握手，保持2-3秒</li>
              <li>交换名片时双手递送</li>
              <li>保持良好的坐姿和眼神接触</li>
            </ul>
          </div>
          
          <div class="reference-section">
            <h4 class="section-title">用餐礼仪要点</h4>
            <ul class="reference-list">
              <li>等待主人开始用餐</li>
              <li>餐具从外向内使用</li>
              <li>咀嚼时不要说话</li>
              <li>餐具暂停放置有讲究</li>
            </ul>
          </div>
          
          <div class="reference-section">
            <h4 class="section-title">电话沟通礼仪</h4>
            <ul class="reference-list">
              <li>接听电话要及时（3声内）</li>
              <li>主动报出姓名和部门</li>
              <li>说话清晰，语速适中</li>
              <li>重要信息需要确认记录</li>
            </ul>
          </div>
        </div>
      </el-card>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useStyleRecommendations } from '../composables/useStyleRecommendations'
import type { EtiquetteGuide } from '../types'
import { ElMessage } from 'element-plus'

const { etiquetteGuides, getEtiquetteByCategory } = useStyleRecommendations()

// 筛选状态
const selectedCategory = ref('')
const selectedDifficulty = ref('')
const showDetailDialog = ref(false)
const selectedGuide = ref<EtiquetteGuide | null>(null)

// 筛选后的指南
const filteredGuides = computed(() => {
  let guides = [...etiquetteGuides]
  
  if (selectedCategory.value) {
    guides = guides.filter(guide => guide.category === selectedCategory.value)
  }
  
  if (selectedDifficulty.value) {
    guides = guides.filter(guide => guide.difficulty === selectedDifficulty.value)
  }
  
  return guides
})

// 获取分类图标
const getCategoryIcon = (category: string) => {
  const icons: Record<string, string> = {
    'business': 'OfficeBuilding',
    'dining': 'Food',
    'social': 'ChatLineSquare',
    'formal': 'Trophy'
  }
  return icons[category] || 'Document'
}

// 获取分类标签
const getCategoryLabel = (category: string) => {
  const labels: Record<string, string> = {
    'business': '商务礼仪',
    'dining': '用餐礼仪',
    'social': '社交礼仪',
    'formal': '正式场合'
  }
  return labels[category] || category
}

// 获取分类标签类型
const getCategoryTagType = (category: string) => {
  const types: Record<string, string> = {
    'business': 'primary',
    'dining': 'success',
    'social': 'warning',
    'formal': 'danger'
  }
  return types[category] || 'info'
}

// 获取难度标签
const getDifficultyLabel = (difficulty: string) => {
  const labels: Record<string, string> = {
    'beginner': '初级',
    'intermediate': '中级',
    'advanced': '高级'
  }
  return labels[difficulty] || difficulty
}

// 获取难度标签类型
const getDifficultyTagType = (difficulty: string) => {
  const types: Record<string, string> = {
    'beginner': 'success',
    'intermediate': 'warning',
    'advanced': 'danger'
  }
  return types[difficulty] || 'info'
}

// 获取完整内容
const getFullContent = (category: string) => {
  const contents: Record<string, string> = {
    'business': '商务礼仪是职场成功的重要基础。正确的商务礼仪不仅体现个人的专业素养，更是建立良好商务关系的关键。从初次见面的握手，到商务用餐的细节，每一个环节都体现着对他人的尊重和自身的修养。掌握商务礼仪，能够帮助您在职场中建立更好的人际关系，提升工作效率，创造更多的商业机会。',
    'dining': '用餐礼仪反映了一个人的教养和品味。无论是商务宴请还是社交聚餐，得体的用餐礼仪都是必不可少的。从餐具的正确使用，到用餐过程中的言谈举止，都有其固定的规范。良好的用餐礼仪不仅让您在餐桌上更加自信，也会给他人留下良好的印象，是社交成功的重要因素。',
    'social': '社交礼仪是人际交往中的润滑剂。在各种社交场合中，正确的礼仪规范能够帮助您更好地与他人建立联系，避免尴尬，创造和谐的交往氛围。从问候的方式，到交谈的技巧，再到告别的礼节，每一个细节都体现着对他人的尊重和自己的修养。',
    'formal': '正式场合的礼仪要求更加严格和细致。无论是重要的会议、庆典活动，还是正式的社交聚会，都有其特定的礼仪规范。正确的着装、得体的举止、恰当的言辞都是必不可少的。掌握正式场合的礼仪，能够让您在重要场合中游刃有余，展现出专业和优雅的形象。'
  }
  return contents[category] || '请参考相关礼仪指南了解更多详细信息。'
}

// 获取示例
const getExamples = (category: string) => {
  const examples: Record<string, Array<{scenario: string, description: string}>> = {
    'business': [
      {
        scenario: '初次商务见面',
        description: '主动站起身，面带微笑，伸出右手握手，同时说"您好，我是..."进行自我介绍。'
      },
      {
        scenario: '商务会议发言',
        description: '发言前先环视全场，开始时感谢主持人和与会者，结束时询问是否有问题。'
      }
    ],
    'dining': [
      {
        scenario: '正式晚宴',
        description: '等待主人宣布开始用餐，使用最外侧的餐具开始，餐具用完后平行放置在盘子上。'
      },
      {
        scenario: '商务午餐',
        description: '点餐时选择易于食用的菜品，避免选择过于昂贵或难以处理的食物。'
      }
    ],
    'social': [
      {
        scenario: '社交聚会介绍',
        description: '被介绍时应站起身（如果坐着），主动伸手握手，重复对方的名字以加深印象。'
      }
    ],
    'formal': [
      {
        scenario: '颁奖典礼',
        description: '获奖时从右侧上台，双手接受奖品，简短致谢后从左侧下台。'
      }
    ]
  }
  return examples[category] || []
}

// 处理分类变化
const handleCategoryChange = () => {
  // 可以在这里添加额外的逻辑
}

// 处理难度变化
const handleDifficultyChange = () => {
  // 可以在这里添加额外的逻辑
}

// 选择指南
const selectGuide = (guide: EtiquetteGuide) => {
  selectedGuide.value = guide
  showDetailDialog.value = true
}

// 标记为已读
const markAsRead = () => {
  ElMessage.success('已标记为掌握！')
  showDetailDialog.value = false
}
</script>

<style scoped>
.etiquette-guide {
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

.filter-section {
  margin-bottom: 32px;
}

.filter-content {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.filter-group {
  display: flex;
  align-items: center;
  gap: 16px;
  flex-wrap: wrap;
}

.filter-label {
  font-size: 14px;
  font-weight: 500;
  color: #4a5568;
  min-width: 80px;
}

.guides-section {
  margin-bottom: 32px;
}

.guides-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
  gap: 24px;
}

.guide-card {
  cursor: pointer;
  transition: all 0.3s ease;
  height: 100%;
}

.guide-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.15);
}

.guide-header {
  display: flex;
  gap: 16px;
  margin-bottom: 16px;
}

.guide-icon {
  width: 64px;
  height: 64px;
  border-radius: 12px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.guide-meta {
  flex: 1;
}

.guide-title {
  margin: 0 0 12px 0;
  font-size: 18px;
  font-weight: 600;
  color: #2d3748;
}

.guide-tags {
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
}

.guide-preview {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.guide-content-preview {
  margin: 0;
  font-size: 14px;
  color: #718096;
  line-height: 1.5;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.guide-tips-count {
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 12px;
  color: #a0aec0;
}

.guide-detail {
  display: flex;
  flex-direction: column;
  gap: 24px;
}

.detail-header {
  padding-bottom: 16px;
  border-bottom: 1px solid #e2e8f0;
}

.detail-meta {
  display: flex;
  gap: 12px;
  flex-wrap: wrap;
}

.content-title,
.tips-title,
.examples-title {
  margin: 0 0 16px 0;
  font-size: 16px;
  font-weight: 600;
  color: #2d3748;
}

.content-text {
  font-size: 14px;
  color: #4a5568;
  line-height: 1.6;
}

.tips-list {
  margin: 0;
  padding: 0;
  list-style: none;
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.tip-item {
  display: flex;
  align-items: flex-start;
  gap: 10px;
  font-size: 14px;
  color: #4a5568;
  line-height: 1.5;
}

.tip-icon {
  color: #48bb78;
  margin-top: 2px;
  flex-shrink: 0;
}

.examples-list {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.example-item {
  padding: 16px;
  background: #f7fafc;
  border-radius: 8px;
  border-left: 4px solid #667eea;
}

.example-scenario {
  margin-bottom: 8px;
  color: #2d3748;
}

.example-description {
  font-size: 14px;
  color: #718096;
  line-height: 1.5;
}

.dialog-footer {
  display: flex;
  justify-content: flex-end;
  gap: 12px;
}

.quick-reference {
  margin-top: 32px;
}

.reference-content {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 24px;
}

.reference-section {
  padding: 20px;
  background: #f7fafc;
  border-radius: 8px;
}

.section-title {
  margin: 0 0 16px 0;
  font-size: 16px;
  font-weight: 600;
  color: #2d3748;
}

.reference-list {
  margin: 0;
  padding-left: 20px;
  color: #4a5568;
}

.reference-list li {
  margin-bottom: 8px;
  font-size: 14px;
  line-height: 1.5;
}

/* 响应式设计 */
@media (max-width: 768px) {
  .guides-grid {
    grid-template-columns: 1fr;
  }
  
  .filter-group {
    flex-direction: column;
    align-items: flex-start;
  }
  
  .reference-content {
    grid-template-columns: 1fr;
  }
  
  .guide-header {
    flex-direction: column;
    text-align: center;
  }
  
  .guide-icon {
    align-self: center;
  }
}
</style>
