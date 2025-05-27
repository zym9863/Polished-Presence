import { reactive, computed } from 'vue'
import type { UserProfile } from '../types'
import { useLocalStorage } from './useLocalStorage'

const defaultProfile: UserProfile = {
  id: '1',
  name: '',
  profession: '',
  style: '',
  preferences: {
    colors: [],
    formality: 'business',
    budget: 'medium'
  }
}

export function useUserProfile() {
  const [profile, setProfile] = useLocalStorage('userProfile', defaultProfile)
  
  const isProfileComplete = computed(() => {
    return profile.value.name && 
           profile.value.profession && 
           profile.value.style &&
           profile.value.preferences.colors.length > 0
  })
  
  const updateProfile = (updates: Partial<UserProfile>) => {
    setProfile({ ...profile.value, ...updates })
  }
  
  const updatePreferences = (preferences: Partial<UserProfile['preferences']>) => {
    setProfile({
      ...profile.value,
      preferences: { ...profile.value.preferences, ...preferences }
    })
  }
  
  return {
    profile,
    isProfileComplete,
    updateProfile,
    updatePreferences
  }
}
