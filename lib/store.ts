import { create } from "zustand"
import { persist } from "zustand/middleware"
import { Goal, Tag, UserSettings, DashboardLayout, DashboardWidget } from '@/types/okr'

// 默认小组件配置
const defaultWidgets: DashboardWidget[] = [
  {
    id: "avatar",
    title: "个人头像",
    type: "avatar",
    layout: { x: 0, y: 0, w: 2, h: 2 },
    content: { seed: "felix" },
  },
  {
    id: "pomodoro",
    title: "专注计时",
    type: "pomodoro",
    layout: { x: 2, y: 0, w: 3, h: 2 },
    content: { duration: 25 },
  },
  {
    id: "yearly-goals",
    title: "2024年度目标",
    type: "goals",
    layout: { x: 0, y: 2, w: 4, h: 4 },
    content: {
      title: "2024年度目标",
      description: "阅读和学习计划",
      goals: [
        {
          title: "阅读目标",
          progress: 0,
          subgoals: [
            { title: "技术书籍：12本", progress: 0 },
            { title: "文学作品：24本", progress: 0 },
            { title: "经管书籍：6本", progress: 0 },
          ],
        },
        {
          title: "学习目标",
          progress: 0,
          subgoals: [
            { title: "完成3个在线课程", progress: 0 },
            { title: "参加2次技术大会", progress: 0 },
            { title: "写作50篇技术博客", progress: 0 },
          ],
        },
      ],
    },
  },
  {
    id: "schedule",
    title: "每日时间表",
    type: "schedule",
    layout: { x: 4, y: 0, w: 3, h: 6 },
    content: {
      title: "工作日时间安排",
      schedule: [
        { time: "06:30 - 07:00", activity: "晨间routine", description: "冥想、拉伸" },
        { time: "07:00 - 08:00", activity: "阅读学习", description: "专注阅读1小时" },
        { time: "08:00 - 08:30", activity: "早餐时间" },
        { time: "09:00 - 12:00", activity: "核心工作时间", description: "处理最重要的任务" },
        { time: "12:00 - 14:00", activity: "午餐休息", description: "午餐、小憩" },
        { time: "14:00 - 17:00", activity: "项目开发", description: "专注编码" },
        { time: "17:00 - 18:30", activity: "内容创作", description: "写作、录制" },
        { time: "18:30 - 19:30", activity: "晚餐时间" },
        { time: "20:00 - 21:30", activity: "自由时间", description: "运动、娱乐" },
        { time: "21:30 - 22:30", activity: "复盘总结", description: "记录、计划" },
      ],
    },
  },
]

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
  setWidgets: (widgets: DashboardWidget[]) => void
  
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
      widgets: defaultWidgets,  // 初始化默认小组件
      setWidgets: (widgets) => set({ widgets }),

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
        set((state) => ({ widgets: state.widgets.filter((w) => w.id !== id) })),
    }),
    {
      name: "okr-kanban-storage",
    }
  )
)

export type WidgetType = "avatar" | "pomodoro" | "goals" | "schedule" | "chat"

export { useStore }
