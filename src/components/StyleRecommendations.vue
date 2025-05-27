<template>
  <div class="style-recommendations">
    <div class="page-header">
      <h2 class="page-title">
        <el-icon class="title-icon"><Suitcase /></el-icon>
        着装建议
      </h2>
      <p class="page-subtitle">
        根据您的个人风格和职业需求，为您提供专业的着装建议
      </p>
    </div>

    <!-- 快速场景选择 -->
    <div class="scene-selector">
      <el-card class="selector-card" shadow="hover">
        <template #header>
          <span class="card-title">选择场景</span>
        </template>
        
        <div class="scene-buttons">
          <el-button
            v-for="scene in scenes"
            :key="scene.key"
            :type="selectedScene === scene.key ? 'primary' : 'default'"
            @click="selectScene(scene.key)"
            class="scene-button"
          >
            <el-icon :size="18">
              <component :is="scene.icon" />
            </el-icon>
            {{ scene.label }}
          </el-button>
        </div>
      </el-card>
    </div>

    <!-- 当前推荐 -->
    <div class="current-recommendation" v-if="currentRecommendation">
      <el-card class="recommendation-card" shadow="hover">
        <template #header>
          <div class="card-header">
            <span class="card-title">{{ currentRecommendation.occasion }}</span>
            <el-tag :type="getCategoryType(currentRecommendation.category)">
              {{ getCategoryLabel(currentRecommendation.category) }}
            </el-tag>
          </div>
        </template>
        
        <div class="recommendation-content">
          <!-- 服装搭配 -->
          <div class="outfit-section">
            <h3 class="section-title">推荐搭配</h3>
            <div class="clothing-items">
              <div 
                v-for="item in currentRecommendation.items"
                :key="item.id"
                class="clothing-item"
              >
                <div class="item-visual">
                  <div 
                    class="item-color"
                    :style="{ backgroundColor: getColorHex(item.color) }"
                  ></div>
                  <el-icon class="item-type-icon" :size="24">
                    <component :is="getItemIcon(item.type)" />
                  </el-icon>
                </div>
                <div class="item-info">
                  <h4 class="item-name">{{ item.name }}</h4>
                  <p class="item-description">{{ item.description }}</p>
                  <el-tag size="small" class="item-type">{{ getTypeLabel(item.type) }}</el-tag>
                </div>
              </div>
            </div>
          </div>
          
          <!-- 搭配建议 -->
          <div class="tips-section">
            <h3 class="section-title">搭配要点</h3>
            <ul class="tips-list">
              <li 
                v-for="(tip, index) in currentRecommendation.tips"
                :key="index"
                class="tip-item"
              >
                <el-icon class="tip-icon"><InfoFilled /></el-icon>
                {{ tip }}
              </li>
            </ul>
          </div>
        </div>
      </el-card>
    </div>

    <!-- 颜色搭配指南 -->
    <div class="color-guide">
      <el-card class="guide-card" shadow="hover">
        <template #header>
          <span class="card-title">颜色搭配指南</span>
        </template>
        
        <div class="color-content">
          <div class="base-colors">
            <h4 class="guide-title">基础色彩</h4>
            <div class="color-palette">
              <div 
                v-for="color in baseColors"
                :key="color.name"
                class="color-chip"
                @click="showColorRecommendations(color.name)"
              >
                <div 
                  class="chip-color"
                  :style="{ backgroundColor: color.hex }"
                ></div>
                <span class="chip-name">{{ color.name }}</span>
              </div>
            </div>
          </div>
          
          <div class="color-recommendations" v-if="selectedColorRecommendations.length > 0">
            <h4 class="guide-title">与{{ selectedBaseColor }}搭配的颜色</h4>
            <div class="recommended-colors">
              <div 
                v-for="color in selectedColorRecommendations"
                :key="color"
                class="recommended-chip"
              >
                <div 
                  class="chip-color"
                  :style="{ backgroundColor: getColorHex(color) }"
                ></div>
                <span class="chip-name">{{ color }}</span>
              </div>
            </div>
          </div>
        </div>
      </el-card>
    </div>

    <!-- 所有推荐 -->
    <div class="all-recommendations">
      <el-card class="recommendations-card" shadow="hover">
        <template #header>
          <div class="card-header">
            <span class="card-title">更多推荐</span>
            <el-select
              v-model="filterCategory"
              placeholder="筛选分类"
              clearable
              style="width: 120px"
            >
              <el-option label="商务" value="business" />
              <el-option label="正式" value="formal" />
              <el-option label="休闲" value="casual" />
              <el-option label="社交" value="social" />
            </el-select>
          </div>
        </template>
        
        <div class="recommendations-grid">
          <div 
            v-for="recommendation in filteredRecommendations"
            :key="recommendation.id"
            class="recommendation-item"
            @click="selectRecommendation(recommendation)"
          >
            <div class="item-header">
              <h4 class="item-title">{{ recommendation.occasion }}</h4>
              <el-tag 
                :type="getCategoryType(recommendation.category)"
                size="small"
              >
                {{ getCategoryLabel(recommendation.category) }}
              </el-tag>
            </div>
            
            <div class="item-preview">
              <div class="preview-colors">
                <div 
                  v-for="item in recommendation.items.slice(0, 3)"
                  :key="item.id"
                  class="preview-color"
                  :style="{ backgroundColor: getColorHex(item.color) }"
                ></div>
              </div>
              <p class="item-summary">{{ recommendation.tips[0] }}</p>
            </div>
          </div>
        </div>
      </el-card>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useStyleRecommendations } from '../composables/useStyleRecommendations'
import type { StyleRecommendation } from '../types'

const { 
  styleRecommendations, 
  getRecommendationsForUser,
  getRecommendationByOccasion,
  getColorRecommendations
} = useStyleRecommendations()

// 场景选项
const scenes = [
  { key: 'business', label: '商务会议', icon: 'OfficeBuilding' },
  { key: 'casual', label: '日常通勤', icon: 'Coffee' },
  { key: 'formal', label: '正式场合', icon: 'Trophy' },
  { key: 'social', label: '社交聚会', icon: 'ChatLineSquare' }
]

// 当前选择的场景和推荐
const selectedScene = ref('business')
const filterCategory = ref('')
const selectedBaseColor = ref('')
const selectedColorRecommendations = ref<string[]>([])

// 当前推荐
const currentRecommendation = computed(() => {
  const sceneMap: Record<string, string> = {
    business: '商务会议',
    casual: '日常通勤',
    formal: '正式场合',
    social: '社交聚会'
  }
  
  return getRecommendationByOccasion(sceneMap[selectedScene.value]) || styleRecommendations[0]
})

// 筛选后的推荐
const filteredRecommendations = computed(() => {
  if (!filterCategory.value) return styleRecommendations
  return styleRecommendations.filter(rec => rec.category === filterCategory.value)
})

// 基础颜色
const baseColors = [
  { name: '黑色', hex: '#000000' },
  { name: '白色', hex: '#FFFFFF' },
  { name: '深蓝色', hex: '#1a365d' },
  { name: '灰色', hex: '#718096' },
  { name: '米色', hex: '#f7fafc' },
  { name: '棕色', hex: '#8b4513' }
]

// 颜色映射
const colorMap: Record<string, string> = {
  '黑色': '#000000',
  '白色': '#FFFFFF',
  '深蓝色': '#1a365d',
  '灰色': '#718096',
  '米色': '#f7fafc',
  '棕色': '#8b4513',
  '深红色': '#c53030',
  '深绿色': '#276749',
  '海军蓝': '#2c5282',
  '浅蓝色': '#63b3ed',
  '银色': '#a0aec0',
  '浅粉色': '#fed7d7'
}

// 服装类型映射
const typeMap: Record<string, string> = {
  'top': '上装',
  'bottom': '下装',
  'shoes': '鞋子',
  'accessory': '配饰',
  'outerwear': '外套'
}

// 获取颜色十六进制值
const getColorHex = (colorName: string) => {
  return colorMap[colorName] || '#cccccc'
}

// 获取分类标签
const getCategoryLabel = (category: string) => {
  const labels: Record<string, string> = {
    'business': '商务',
    'formal': '正式',
    'casual': '休闲',
    'social': '社交'
  }
  return labels[category] || category
}

// 获取分类类型
const getCategoryType = (category: string) => {
  const types: Record<string, string> = {
    'business': 'primary',
    'formal': 'danger',
    'casual': 'success',
    'social': 'warning'
  }
  return types[category] || 'info'
}

// 获取类型标签
const getTypeLabel = (type: string) => {
  return typeMap[type] || type
}

// 获取物品图标
const getItemIcon = (type: string) => {
  const icons: Record<string, string> = {
    'top': 'Shirt',
    'bottom': 'User',
    'shoes': 'Walking',
    'accessory': 'Star',
    'outerwear': 'Coat'
  }
  return icons[type] || 'Box'
}

// 选择场景
const selectScene = (scene: string) => {
  selectedScene.value = scene
}

// 选择推荐
const selectRecommendation = (recommendation: StyleRecommendation) => {
  // 可以在这里添加详细查看逻辑
  console.log('Selected recommendation:', recommendation)
}

// 显示颜色推荐
const showColorRecommendations = (baseColor: string) => {
  selectedBaseColor.value = baseColor
  selectedColorRecommendations.value = getColorRecommendations(baseColor)
}
</script>

<style scoped>
.style-recommendations {
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

.scene-selector {
  margin-bottom: 32px;
}

.scene-buttons {
  display: flex;
  gap: 16px;
  flex-wrap: wrap;
  justify-content: center;
}

.scene-button {
  min-width: 140px;
}

.current-recommendation {
  margin-bottom: 32px;
}

.recommendation-card {
  background: linear-gradient(135deg, #f7fafc 0%, #edf2f7 100%);
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

.recommendation-content {
  display: grid;
  grid-template-columns: 2fr 1fr;
  gap: 32px;
}

.section-title {
  margin: 0 0 20px 0;
  font-size: 16px;
  font-weight: 600;
  color: #2d3748;
}

.clothing-items {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 16px;
}

.clothing-item {
  display: flex;
  gap: 12px;
  padding: 16px;
  background: white;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.item-visual {
  position: relative;
  width: 48px;
  height: 48px;
  border-radius: 8px;
  background: #f7fafc;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.item-color {
  position: absolute;
  top: 4px;
  right: 4px;
  width: 16px;
  height: 16px;
  border-radius: 50%;
  border: 2px solid white;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.3);
}

.item-type-icon {
  color: #667eea;
}

.item-info {
  flex: 1;
}

.item-name {
  margin: 0 0 4px 0;
  font-size: 14px;
  font-weight: 600;
  color: #2d3748;
}

.item-description {
  margin: 0 0 8px 0;
  font-size: 12px;
  color: #718096;
  line-height: 1.4;
}

.item-type {
  font-size: 10px;
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
  gap: 8px;
  font-size: 14px;
  color: #4a5568;
  line-height: 1.5;
}

.tip-icon {
  color: #667eea;
  margin-top: 2px;
  flex-shrink: 0;
}

.color-guide {
  margin-bottom: 32px;
}

.color-content {
  display: flex;
  flex-direction: column;
  gap: 24px;
}

.guide-title {
  margin: 0 0 16px 0;
  font-size: 16px;
  font-weight: 600;
  color: #2d3748;
}

.color-palette,
.recommended-colors {
  display: flex;
  gap: 12px;
  flex-wrap: wrap;
}

.color-chip,
.recommended-chip {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
  padding: 12px;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.2s ease;
  background: #f7fafc;
}

.color-chip:hover,
.recommended-chip:hover {
  background: #edf2f7;
  transform: translateY(-2px);
}

.chip-color {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  border: 2px solid #e2e8f0;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.chip-name {
  font-size: 12px;
  color: #4a5568;
  text-align: center;
}

.recommendations-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 20px;
}

.recommendation-item {
  padding: 20px;
  border-radius: 8px;
  background: #f7fafc;
  cursor: pointer;
  transition: all 0.2s ease;
}

.recommendation-item:hover {
  background: #edf2f7;
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.item-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  gap: 12px;
  margin-bottom: 12px;
}

.item-title {
  margin: 0;
  font-size: 16px;
  font-weight: 600;
  color: #2d3748;
}

.item-preview {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.preview-colors {
  display: flex;
  gap: 4px;
}

.preview-color {
  width: 24px;
  height: 24px;
  border-radius: 4px;
  border: 2px solid white;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.2);
}

.item-summary {
  margin: 0;
  font-size: 14px;
  color: #718096;
  line-height: 1.5;
}

/* 响应式设计 */
@media (max-width: 768px) {
  .recommendation-content {
    grid-template-columns: 1fr;
  }
  
  .clothing-items {
    grid-template-columns: 1fr;
  }
  
  .scene-buttons {
    flex-direction: column;
    align-items: center;
  }
  
  .scene-button {
    width: 100%;
    max-width: 200px;
  }
  
  .recommendations-grid {
    grid-template-columns: 1fr;
  }
}
</style>
