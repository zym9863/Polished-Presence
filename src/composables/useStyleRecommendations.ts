import { computed } from 'vue'
import type { StyleRecommendation, ClothingItem, EtiquetteGuide } from '../types'
import { useUserProfile } from './useUserProfile'

export function useStyleRecommendations() {
  const { profile } = useUserProfile()
  
  // 服装单品数据库
  const clothingDatabase: ClothingItem[] = [
    // 商务正装
    {
      id: '1',
      name: '深色西装套装',
      type: 'outerwear',
      color: '深蓝色',
      description: '经典商务西装，适合正式场合'
    },
    {
      id: '2',
      name: '白色衬衫',
      type: 'top',
      color: '白色',
      description: '百搭基础款，商务必备'
    },
    {
      id: '3',
      name: '皮质正装鞋',
      type: 'shoes',
      color: '黑色',
      description: '经典正装皮鞋，提升整体品质感'
    },
    {
      id: '4',
      name: '丝质领带',
      type: 'accessory',
      color: '深红色',
      description: '增添正式感的经典配饰'
    },
    // 商务休闲
    {
      id: '5',
      name: '休闲西装外套',
      type: 'outerwear',
      color: '灰色',
      description: '商务休闲风格，既专业又舒适'
    },
    {
      id: '6',
      name: '针织毛衣',
      type: 'top',
      color: '米色',
      description: '温和优雅，适合秋冬季节'
    },
    {
      id: '7',
      name: '休闲裤',
      type: 'bottom',
      color: '深灰色',
      description: '舒适百搭，适合日常通勤'
    },
    {
      id: '8',
      name: '乐福鞋',
      type: 'shoes',
      color: '棕色',
      description: '休闲优雅，商务休闲的理想选择'
    },
    // 休闲装
    {
      id: '9',
      name: 'polo衫',
      type: 'top',
      color: '海军蓝',
      description: '休闲但不失体面的选择'
    },
    {
      id: '10',
      name: '牛仔裤',
      type: 'bottom',
      color: '深蓝色',
      description: '经典休闲，注意选择合身剪裁'
    },
    {
      id: '11',
      name: '运动休闲鞋',
      type: 'shoes',
      color: '白色',
      description: '现代休闲风格，注重品质和设计'
    }
  ]
  
  // 样式推荐数据
  const styleRecommendations: StyleRecommendation[] = [
    {
      id: '1',
      occasion: '商务会议',
      category: 'business',
      season: 'autumn',
      items: [
        clothingDatabase.find(item => item.id === '1')!,
        clothingDatabase.find(item => item.id === '2')!,
        clothingDatabase.find(item => item.id === '3')!,
        clothingDatabase.find(item => item.id === '4')!
      ],
      tips: [
        '确保西装合身，肩线贴合',
        '领带长度应到达腰带扣',
        '鞋子保持光亮，袜子与裤子颜色协调',
        '注意细节如袖扣、手表等配饰'
      ]
    },
    {
      id: '2',
      occasion: '日常通勤',
      category: 'business',
      season: 'spring',
      items: [
        clothingDatabase.find(item => item.id === '5')!,
        clothingDatabase.find(item => item.id === '6')!,
        clothingDatabase.find(item => item.id === '7')!,
        clothingDatabase.find(item => item.id === '8')!
      ],
      tips: [
        '选择质感好的面料',
        '颜色搭配要协调统一',
        '保持整洁的仪容',
        '配饰简约而精致'
      ]
    },
    {
      id: '3',
      occasion: '周末休闲',
      category: 'casual',
      season: 'summer',
      items: [
        clothingDatabase.find(item => item.id === '9')!,
        clothingDatabase.find(item => item.id === '10')!,
        clothingDatabase.find(item => item.id === '11')!
      ],
      tips: [
        '即使休闲也要保持整洁',
        '选择合身的剪裁',
        '注意颜色搭配的和谐',
        '配饰可以更加个性化'
      ]
    }
  ]
  
  // 礼仪指南数据
  const etiquetteGuides: EtiquetteGuide[] = [
    {
      id: '1',
      title: '商务用餐礼仪',
      category: 'dining',
      difficulty: 'intermediate',
      content: '商务用餐是建立职业关系的重要场合...',
      tips: [
        '等待主人开始用餐',
        '使用餐具从外向内取用',
        '避免在用餐时谈论敏感话题',
        '保持适度的交流，不要只顾吃饭'
      ]
    },
    {
      id: '2',
      title: '握手礼仪',
      category: 'business',
      difficulty: 'beginner',
      content: '正确的握手是商务交往中的基本礼仪...',
      tips: [
        '保持眼神接触',
        '握手力度适中，约2-3秒',
        '上身略微前倾表示尊重',
        '主动介绍自己并记住对方姓名'
      ]
    },
    {
      id: '3',
      title: '电话礼仪',
      category: 'business',
      difficulty: 'beginner',
      content: '专业的电话沟通能力体现个人素养...',
      tips: [
        '接听电话要及时',
        '声音清晰，语速适中',
        '主动报出姓名和部门',
        '记录重要信息并确认'
      ]
    },
    {
      id: '4',
      title: '正式场合着装',
      category: 'formal',
      difficulty: 'advanced',
      content: '不同正式场合有相应的着装要求...',
      tips: [
        '了解活动性质和着装要求',
        '选择合适的颜色和款式',
        '注意配饰的搭配',
        '确保衣物整洁无褶皱'
      ]
    }
  ]
  
  // 根据用户偏好获取推荐
  const getRecommendationsForUser = computed(() => {
    if (!profile.value.profession) return []
    
    return styleRecommendations.filter(rec => {
      // 根据职业和偏好筛选
      const formalityMatch = profile.value.preferences.formality === 'formal' ? 
        rec.category === 'formal' || rec.category === 'business' :
        profile.value.preferences.formality === 'business' ?
        rec.category === 'business' :
        rec.category === 'casual'
      
      return formalityMatch
    })
  })
  
  // 根据场合获取推荐
  const getRecommendationByOccasion = (occasion: string) => {
    return styleRecommendations.find(rec => 
      rec.occasion.toLowerCase().includes(occasion.toLowerCase())
    )
  }
  
  // 根据分类获取礼仪指南
  const getEtiquetteByCategory = (category: string) => {
    return etiquetteGuides.filter(guide => guide.category === category)
  }
  
  // 获取适合的颜色搭配
  const getColorRecommendations = (baseColor: string) => {
    const colorPalettes: Record<string, string[]> = {
      '深蓝色': ['白色', '浅蓝色', '灰色', '米色'],
      '黑色': ['白色', '灰色', '银色', '深红色'],
      '灰色': ['白色', '黑色', '深蓝色', '浅粉色'],
      '米色': ['白色', '棕色', '深绿色', '海军蓝']
    }
    
    return colorPalettes[baseColor] || ['白色', '黑色', '灰色']
  }
  
  return {
    styleRecommendations,
    etiquetteGuides,
    clothingDatabase,
    getRecommendationsForUser,
    getRecommendationByOccasion,
    getEtiquetteByCategory,
    getColorRecommendations
  }
}
