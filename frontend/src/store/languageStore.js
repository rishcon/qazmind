import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export const useLanguageStore = create(
  persist(
    (set) => ({
      language: 'ru', // 'kz' or 'ru'
      
      setLanguage: (language) => set({ language }),
      
      toggleLanguage: () => set((state) => ({ 
        language: state.language === 'ru' ? 'kz' : 'ru' 
      })),
    }),
    {
      name: 'language-storage',
    }
  )
)
