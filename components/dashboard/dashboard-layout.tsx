"use client"

import { useEffect, useState } from "react"
import { Responsive, WidthProvider } from "react-grid-layout"
import 'react-grid-layout/css/styles.css'
import 'react-resizable/css/styles.css'

import { DashboardWidget } from "@/types/okr"
import { useStore } from "@/lib/store" // Fix store import
import { Button } from "../ui/button"
import { GripHorizontal, Plus, X } from "lucide-react"
import { AddWidgetDialog } from "./add-widget-dialog"
import { WidgetSettings } from "./widget-settings"
import { WidgetContent } from "./widget-content"
import { nanoid } from "nanoid"
import { cn } from "@/lib/utils"

const ResponsiveGridLayout = WidthProvider(Responsive)

const breakpoints = { lg: 1200, md: 996, sm: 768, xs: 480, xxs: 0 }
const cols = { lg: 8, md: 6, sm: 4, xs: 2, xxs: 1 }

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

export function DashboardLayout() {
  const [widgets, setWidgets] = useStore((state) => [
    state.widgets || defaultWidgets,  // 如果没有保存的小组件，使用默认小组件
    state.setWidgets,
  ])

  const handleUpdateWidget = (id: string, updates: Partial<DashboardWidget>) => {
    setWidgets(
      widgets.map((widget) =>
        widget.id === id ? { ...widget, ...updates } : widget
      )
    )
  }

  const handleAddWidget = (type: string) => {
    const newWidget: DashboardWidget = {
      id: nanoid(),
      type,
      content: {},
      layout: {
        x: 0,
        y: Infinity,
        w: 3,
        h: 3,
      },
    }
    setWidgets([...widgets, newWidget])
  }

  const handleLayoutChange = (layout: any[]) => {
    setWidgets(
      widgets.map((widget) => {
        const newLayout = layout.find((l) => l.i === widget.id)
        if (newLayout) {
          return {
            ...widget,
            layout: {
              x: newLayout.x,
              y: newLayout.y,
              w: newLayout.w,
              h: newLayout.h,
            },
          }
        }
        return widget
      })
    )
  }

  const handleRemoveWidget = (id: string) => {
    setWidgets(widgets.filter((widget) => widget.id !== id))
  }

  return (
    <div className="container mx-auto p-4">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-2xl font-bold">个人 OKR 仪表盘</h1>
        <AddWidgetDialog onAddWidget={handleAddWidget}>
          <Button>
            <Plus className="h-4 w-4 mr-2" />
            添加小组件
          </Button>
        </AddWidgetDialog>
      </div>

      <ResponsiveGridLayout
        className="layout"
        layouts={{ lg: widgets.map((w) => ({ ...w.layout, i: w.id })) }}
        breakpoints={breakpoints}
        cols={cols}
        rowHeight={100}
        margin={[16, 16]}
        onLayoutChange={(layout) => handleLayoutChange(layout)}
        draggableHandle=".drag-handle"
      >
        {widgets.map((widget) => (
          <div
            key={widget.id}
            className={cn(
              "group relative flex flex-col rounded-lg border shadow-sm overflow-hidden",
              widget.content?.bgColor || "bg-card"
            )}
            data-grid={widget.layout}
          >
            <div className="absolute inset-0 -z-10" />
            <div className="flex items-center justify-between px-4 py-2 border-b">
              <div className="flex items-center gap-2">
                <GripHorizontal className="h-4 w-4 text-muted-foreground drag-handle cursor-move" />
                <span className="font-medium">{widget.title || "未命名"}</span>
              </div>
              <Button
                variant="ghost"
                size="icon"
                className="opacity-0 group-hover:opacity-100 transition-opacity"
                onClick={() => handleRemoveWidget(widget.id)}
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
            <div className="flex-1 min-h-0 overflow-auto">
              <div className="h-full p-4">
                <WidgetSettings widget={widget} onUpdate={handleUpdateWidget}>
                  <WidgetContent widget={widget} />
                </WidgetSettings>
              </div>
            </div>
          </div>
        ))}
      </ResponsiveGridLayout>
    </div>
  )
}
