import { create } from "zustand"
import { persist } from "zustand/middleware"
import { Goal, Tag, UserSettings, DashboardLayout } from '@/types/okr'

interface Store {
  goals: Goal[]
  tags: Tag[]
  settings: UserSettings & {
    openaiKey?: string
    openaiBaseUrl?: string
    openaiModel?: string
  }
  
  // Goals
  addGoal: (goal: Goal) => void
  updateGoal: (id: string, goal: Partial<Goal>) => void
  deleteGoal: (id: string) => void
  
  // Tags
  addTag: (tag: Tag) => void
  updateTag: (id: string, tag: Partial<Tag>) => void
  deleteTag: (id: string) => void
  
  // Settings
  updateSettings: (settings: Partial<UserSettings & { 
    openaiKey?: string
    openaiBaseUrl?: string
    openaiModel?: string
  }>) => void
  addLayout: (layout: DashboardLayout) => void
  updateLayout: (id: string, layout: Partial<DashboardLayout>) => void
  deleteLayout: (id: string) => void
}

const useStore = create<Store>()(
  persist(
    (set) => ({
      goals: [],
      tags: [],
      settings: {
        defaultLayout: 'default',
        theme: 'system',
        openaiKey: undefined,
        openaiBaseUrl: 'https://api.openai.com/v1',
        openaiModel: 'gpt-3.5-turbo',
        layouts: [{
          id: 'default',
          name: 'Default Layout',
          widgets: []
        }]
      },

      // Goals
      addGoal: (goal) => set((state) => ({ goals: [...state.goals, goal] })),
      updateGoal: (id, goal) =>
        set((state) => ({
          goals: state.goals.map((g) => (g.id === id ? { ...g, ...goal } : g)),
        })),
      deleteGoal: (id) =>
        set((state) => ({ goals: state.goals.filter((g) => g.id !== id) })),

      // Tags
      addTag: (tag) => set((state) => ({ tags: [...state.tags, tag] })),
      updateTag: (id, tag) =>
        set((state) => ({
          tags: state.tags.map((t) => (t.id === id ? { ...t, ...tag } : t)),
        })),
      deleteTag: (id) =>
        set((state) => ({ tags: state.tags.filter((t) => t.id !== id) })),

      // Settings
      updateSettings: (newSettings) =>
        set((state) => ({
          settings: { ...state.settings, ...newSettings },
        })),
      addLayout: (layout) =>
        set((state) => ({
          settings: {
            ...state.settings,
            layouts: [...state.settings.layouts, layout],
          },
        })),
      updateLayout: (id, layout) =>
        set((state) => ({
          settings: {
            ...state.settings,
            layouts: state.settings.layouts.map((l) =>
              l.id === id ? { ...l, ...layout } : l
            ),
          },
        })),
      deleteLayout: (id) =>
        set((state) => ({
          settings: {
            ...state.settings,
            layouts: state.settings.layouts.filter((l) => l.id !== id),
          },
        })),
    }),
    {
      name: "okr-kanban-storage",
    }
  )
)

export { useStore }
