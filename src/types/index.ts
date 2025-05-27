// 用户信息类型
export interface UserProfile {
  id: string
  name: string
  profession: string
  style: string
  avatar?: string
  preferences: {
    colors: string[]
    formality: 'casual' | 'business' | 'formal'
    budget: 'low' | 'medium' | 'high'
  }
}

// 着装建议类型
export interface StyleRecommendation {
  id: string
  occasion: string
  category: 'formal' | 'business' | 'casual' | 'social'
  items: ClothingItem[]
  tips: string[]
  season: 'spring' | 'summer' | 'autumn' | 'winter'
}

// 服装单品类型
export interface ClothingItem {
  id: string
  name: string
  type: 'top' | 'bottom' | 'shoes' | 'accessory' | 'outerwear'
  color: string
  brand?: string
  price?: number
  image?: string
  description: string
}

// 礼仪指南类型
export interface EtiquetteGuide {
  id: string
  title: string
  category: 'dining' | 'business' | 'social' | 'formal'
  content: string
  tips: string[]
  difficulty: 'beginner' | 'intermediate' | 'advanced'
}

// 习惯类型
export interface Habit {
  id: string
  title: string
  description: string
  category: 'grooming' | 'health' | 'home' | 'social'
  frequency: 'daily' | 'weekly' | 'monthly'
  completed: boolean
  streak: number
  createdAt: Date
  lastCompletedAt?: Date
}

// 清单项类型
export interface ChecklistItem {
  id: string
  title: string
  description: string
  category: 'morning' | 'evening' | 'weekly' | 'monthly'
  priority: 'low' | 'medium' | 'high'
  completed: boolean
  dueDate?: Date
}

// 进度统计类型
export interface ProgressStats {
  totalHabits: number
  completedToday: number
  weeklyCompletion: number
  monthlyCompletion: number
  longestStreak: number
  currentStreak: number
}
