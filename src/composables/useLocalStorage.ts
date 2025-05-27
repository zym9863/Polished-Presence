import { ref, watch, type Ref } from 'vue'

export function useLocalStorage<T>(key: string, defaultValue: T) {
  const storedValue = localStorage.getItem(key)
  const initialValue = storedValue ? JSON.parse(storedValue) : defaultValue
  
  const state = ref(initialValue) as Ref<T>
  
  const setState = (value: T) => {
    state.value = value
    localStorage.setItem(key, JSON.stringify(value))
  }
  
  watch(state, (newValue) => {
    localStorage.setItem(key, JSON.stringify(newValue))
  }, { deep: true })
  
  return [state, setState] as const
}
