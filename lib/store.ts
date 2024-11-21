import { create } from "zustand"
import { persist } from "zustand/middleware"
import { Goal, Tag, UserSettings, DashboardLayout, DashboardWidget } from '@/types/okr'

interface Store {
  goals: Goal[]
  tags: Tag[]
  layouts: DashboardLayout[]
  settings: UserSettings & {
    openaiKey?: string
    openaiBaseUrl?: string
    openaiModel?: string
  }
  widgets: DashboardWidget[]
  
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
  
  // Layouts
  addLayout: (layout: DashboardLayout) => void
  updateLayout: (id: string, layout: Partial<DashboardLayout>) => void
  deleteLayout: (id: string) => void
  
  // Widgets
  addWidget: (widget: DashboardWidget) => void
  updateWidget: (id: string, widget: Partial<DashboardWidget>) => void
  deleteWidget: (id: string) => void
}

interface ChatMessage {
  role: "user" | "assistant"
  content: string
}

const useStore = create<Store>()(
  persist(
    (set) => ({
      goals: [],
      tags: [],
      layouts: [],
      settings: {
        defaultLayout: 'default',
        theme: 'system',
        openaiKey: undefined,
        openaiBaseUrl: 'https://api.openai.com/v1',
        openaiModel: 'gpt-3.5-turbo',
      },
      widgets: [],

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

      // Layouts
      addLayout: (layout) => set((state) => ({ layouts: [...state.layouts, layout] })),
      updateLayout: (id, layout) =>
        set((state) => ({
          layouts: state.layouts.map((l) => (l.id === id ? { ...l, ...layout } : l)),
        })),
      deleteLayout: (id) =>
        set((state) => ({
          layouts: state.layouts.filter((l) => l.id !== id),
        })),

      // Widgets
      addWidget: (widget) => set((state) => ({ widgets: [...state.widgets, widget] })),
      updateWidget: (id, widget) =>
        set((state) => ({
          widgets: state.widgets.map((w) => (w.id === id ? { ...w, ...widget } : w)),
        })),
      deleteWidget: (id) =>
        set((state) => ({
          widgets: state.widgets.filter((w) => w.id !== id),
        })),
    }),
    {
      name: "okr-kanban-storage",
    }
  )
)

export type WidgetType = "avatar" | "pomodoro" | "goals" | "schedule" | "chat"

export { useStore }
