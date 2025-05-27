import { computed } from 'vue'
import type { Habit, ChecklistItem, ProgressStats } from '../types'
import { useLocalStorage } from './useLocalStorage'

export function useHabits() {
  const [habits, setHabits] = useLocalStorage<Habit[]>('habits', [])
  const [checklist, setChecklist] = useLocalStorage<ChecklistItem[]>('checklist', [])
  
  // 默认习惯数据
  const defaultHabits: Habit[] = [
    {
      id: '1',
      title: '晨间护肤',
      description: '完成洁面、爽肤水、精华、面霜的基础护肤步骤',
      category: 'grooming',
      frequency: 'daily',
      completed: false,
      streak: 0,
      createdAt: new Date()
    },
    {
      id: '2',
      title: '整理仪容',
      description: '检查着装整洁、发型得体、指甲清洁',
      category: 'grooming',
      frequency: 'daily',
      completed: false,
      streak: 0,
      createdAt: new Date()
    },
    {
      id: '3',
      title: '居家整理',
      description: '保持个人空间整洁有序，物品归位',
      category: 'home',
      frequency: 'daily',
      completed: false,
      streak: 0,
      createdAt: new Date()
    },
    {
      id: '4',
      title: '健康饮食',
      description: '均衡营养摄入，少食多餐，多喝水',
      category: 'health',
      frequency: 'daily',
      completed: false,
      streak: 0,
      createdAt: new Date()
    }
  ]
  
  // 默认清单项
  const defaultChecklist: ChecklistItem[] = [
    {
      id: '1',
      title: '检查着装搭配',
      description: '确保服装颜色协调、款式得体、场合适宜',
      category: 'morning',
      priority: 'high',
      completed: false
    },
    {
      id: '2',
      title: '护肤保养',
      description: '完成基础护肤步骤，根据肌肤状态调整产品',
      category: 'morning',
      priority: 'high',
      completed: false
    },
    {
      id: '3',
      title: '检查个人物品',
      description: '确保钱包、手机、钥匙等必需品齐全',
      category: 'morning',
      priority: 'medium',
      completed: false
    },
    {
      id: '4',
      title: '晚间卸妆清洁',
      description: '彻底卸妆清洁，进行夜间护肤',
      category: 'evening',
      priority: 'high',
      completed: false
    }
  ]
  
  // 初始化默认数据
  if (habits.value.length === 0) {
    setHabits(defaultHabits)
  }
  
  if (checklist.value.length === 0) {
    setChecklist(defaultChecklist)
  }
  
  // 计算进度统计
  const progressStats = computed<ProgressStats>(() => {
    const today = new Date().toDateString()
    const completedToday = habits.value.filter(h => 
      h.lastCompletedAt && new Date(h.lastCompletedAt).toDateString() === today
    ).length
    
    return {
      totalHabits: habits.value.length,
      completedToday,
      weeklyCompletion: Math.round((completedToday / habits.value.length) * 100),
      monthlyCompletion: 0, // 可以根据需要计算月度完成率
      longestStreak: Math.max(...habits.value.map(h => h.streak), 0),
      currentStreak: Math.min(...habits.value.map(h => h.streak))
    }
  })
  
  // 获取今日习惯
  const todayHabits = computed(() => {
    const today = new Date().toDateString()
    return habits.value.map(habit => ({
      ...habit,
      completed: habit.lastCompletedAt ? 
        new Date(habit.lastCompletedAt).toDateString() === today : false
    }))
  })
  
  // 完成习惯
  const completeHabit = (habitId: string) => {
    const habitIndex = habits.value.findIndex(h => h.id === habitId)
    if (habitIndex !== -1) {
      const habit = habits.value[habitIndex]
      const today = new Date()
      const yesterday = new Date(today)
      yesterday.setDate(yesterday.getDate() - 1)
      
      const lastCompleted = habit.lastCompletedAt ? new Date(habit.lastCompletedAt) : null
      const isConsecutive = lastCompleted && 
        lastCompleted.toDateString() === yesterday.toDateString()
      
      const updatedHabits = [...habits.value]
      updatedHabits[habitIndex] = {
        ...habit,
        completed: true,
        lastCompletedAt: today,
        streak: isConsecutive ? habit.streak + 1 : 1
      }
      
      setHabits(updatedHabits)
    }
  }
  
  // 添加习惯
  const addHabit = (habit: Omit<Habit, 'id' | 'completed' | 'streak' | 'createdAt'>) => {
    const newHabit: Habit = {
      ...habit,
      id: Date.now().toString(),
      completed: false,
      streak: 0,
      createdAt: new Date()
    }
    setHabits([...habits.value, newHabit])
  }
  
  // 删除习惯
  const removeHabit = (habitId: string) => {
    setHabits(habits.value.filter(h => h.id !== habitId))
  }
  
  // 完成清单项
  const completeChecklistItem = (itemId: string) => {
    const updatedChecklist = checklist.value.map(item =>
      item.id === itemId ? { ...item, completed: !item.completed } : item
    )
    setChecklist(updatedChecklist)
  }
  
  // 添加清单项
  const addChecklistItem = (item: Omit<ChecklistItem, 'id' | 'completed'>) => {
    const newItem: ChecklistItem = {
      ...item,
      id: Date.now().toString(),
      completed: false
    }
    setChecklist([...checklist.value, newItem])
  }
  
  // 删除清单项
  const removeChecklistItem = (itemId: string) => {
    setChecklist(checklist.value.filter(item => item.id !== itemId))
  }
  
  return {
    habits,
    checklist,
    todayHabits,
    progressStats,
    completeHabit,
    addHabit,
    removeHabit,
    completeChecklistItem,
    addChecklistItem,
    removeChecklistItem
  }
}
