"use client"

import { useEffect, useState } from "react"
import { Responsive, WidthProvider } from "react-grid-layout"
import 'react-grid-layout/css/styles.css'
import 'react-resizable/css/styles.css'

import { DashboardWidget } from "@/types/okr"
import { useStore } from "@/lib/store" // Fix store import
import { Button } from "../ui/button"
import { GripHorizontal, Plus } from "lucide-react"
import { AddWidgetDialog } from "./add-widget-dialog"
import { AvatarWidget } from "./widgets/avatar-widget"
import { PomodoroWidget } from "./widgets/pomodoro-widget"
import { GoalsWidget } from "./widgets/goals-widget"
import { ScheduleWidget } from "./widgets/schedule-widget"
import { ChatWidget } from "./widgets/chat-widget"
import { SettingsDialog } from "../settings/settings-dialog"
import { AIGoalDialog } from "../goals/ai-goal-dialog"
import { ScrollArea } from "../ui/scroll-area"
import { WidgetSettings } from "./widget-settings"

const ResponsiveGridLayout = WidthProvider(Responsive)

const breakpoints = { lg: 1200, md: 996, sm: 768, xs: 480, xxs: 0 }
const cols = { lg: 8, md: 6, sm: 4, xs: 2, xxs: 1 }

// 默认小组件配置
const defaultWidgets: DashboardWidget[] = [
  {
    id: "avatar",
    title: "个人头像",
    type: "avatar",
    position: { x: 0, y: 0 },
    size: { w: 2, h: 2 },
    content: { seed: "felix" },
  },
  {
    id: "pomodoro",
    title: "专注计时",
    type: "pomodoro",
    position: { x: 2, y: 0 },
    size: { w: 3, h: 2 },
    content: { duration: 25 },
  },
  {
    id: "yearly-goals",
    title: "2024年度目标",
    type: "goals",
    position: { x: 0, y: 2 },
    size: { w: 4, h: 4 },
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
    position: { x: 4, y: 0 },
    size: { w: 3, h: 6 },
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

const defaultLayouts = {
  lg: [
    { i: 'avatar', x: 0, y: 0, w: 2, h: 2 },  // 头像小部件
    { i: 'pomodoro', x: 2, y: 0, w: 3, h: 2 }, // 番茄钟小部件
    { i: 'yearly-goals', x: 0, y: 2, w: 4, h: 4 },   // 目标小部件
    { i: 'schedule', x: 4, y: 0, w: 3, h: 6 }, // 日程小部件
  ],
};

export function DashboardLayout() {
  const { settings, updateLayout } = useStore()
  const [mounted, setMounted] = useState(false)
  const currentLayout = settings.layouts.find(l => l.id === settings.defaultLayout)
  const widgets = currentLayout?.widgets || defaultWidgets

  // Prevent SSR flickering
  useEffect(() => {
    setMounted(true)
    // 如果没有小组件，添加默认小组件
    if (currentLayout && (!currentLayout.widgets || currentLayout.widgets.length === 0)) {
      updateLayout(currentLayout.id, { widgets: defaultWidgets })
    }
  }, [])

  if (!mounted) return null

  const handleLayoutChange = (layout: any) => {
    if (!currentLayout) return

    const updatedWidgets = widgets.map(widget => {
      const layoutItem = layout.find((item: any) => item.i === widget.id)
      if (!layoutItem) return widget

      return {
        ...widget,
        position: { x: layoutItem.x, y: layoutItem.y },
        size: { w: layoutItem.w, h: layoutItem.h },
      }
    })

    updateLayout(currentLayout.id, { widgets: updatedWidgets })
  }

  function WidgetWrapper({ children }: { children: React.ReactNode }) {
    return (
      <div className="h-full">
        {children}
      </div>
    )
  }

  function WidgetContainer({ widget }: { widget: DashboardWidget }) {
    const content = widget.content || {}
    const style = {
      ...(content.bgColor ? { backgroundColor: content.bgColor } : {}),
    }

    return (
      <div className="relative group h-full rounded-lg shadow-lg" style={style}>
        <div className="absolute inset-0 rounded-lg bg-card" /> {/* 背景层 */}
        <div className="relative h-full p-4"> {/* 内容层 */}
          {content.title && (
            <div className="text-sm font-medium mb-2">
              {content.title}
            </div>
          )}
          <WidgetSettings id={widget.id} type={widget.type} content={content} />
          {renderWidget(widget)}
        </div>
      </div>
    )
  }

  function renderWidget(widget: DashboardWidget) {
    const content = widget.content || {}

    switch (widget.type) {
      case "avatar":
        return (
          <WidgetWrapper>
            <AvatarWidget content={content} id={widget.id} />
          </WidgetWrapper>
        )
      case "pomodoro":
        return (
          <WidgetWrapper>
            <PomodoroWidget content={content} />
          </WidgetWrapper>
        )
      case "goals":
        return (
          <WidgetWrapper>
            <GoalsWidget content={content} />
          </WidgetWrapper>
        )
      case "schedule":
        return (
          <WidgetWrapper>
            <ScheduleWidget content={content} />
          </WidgetWrapper>
        )
      case "chat":
        return (
          <WidgetWrapper>
            <ChatWidget content={content} id={widget.id} />
          </WidgetWrapper>
        )
      default:
        return null
    }
  }

  return (
    <div className="flex-1 p-4">
      <div className="flex justify-between items-center mb-4">
        <div className="flex items-center space-x-2">
          <AddWidgetDialog>
            <Button
              size="icon"
              className="h-12 w-12 rounded-full shadow-lg"
            >
              <Plus className="h-6 w-6" />
            </Button>
          </AddWidgetDialog>
        </div>
        <SettingsDialog />
      </div>
      <ResponsiveGridLayout
        className="layout"
        layouts={defaultLayouts}
        breakpoints={breakpoints}
        cols={cols}
        rowHeight={100}
        margin={[16, 16]}
        containerPadding={[0, 0]}
        isDraggable={true}
        isResizable={true}
        draggableHandle=".widget-drag-handle"
        onLayoutChange={handleLayoutChange}
      >
        {widgets.map(widget => (
          <div key={widget.id}>
            <div className="widget-drag-handle absolute top-0 left-0 right-0 h-8 cursor-move" />
            <WidgetContainer widget={widget} />
          </div>
        ))}
      </ResponsiveGridLayout>
    </div>
  )
}
