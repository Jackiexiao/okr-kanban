"use client"

import { DashboardLayout } from "@/components/dashboard/dashboard-layout"
import { GoalDialog } from "@/components/goals/goal-dialog"
import { WidgetDialog } from "@/components/dashboard/widget-dialog"
import { buttonVariants } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { useStore } from "@/lib/store"

export default function IndexPage() {
  const { goals } = useStore()
  const activeGoals = goals.filter(g => g.status === "in_progress")
  const weeklyGoals = goals.filter(g => g.type === "weekly")
  const completedGoals = goals.filter(g => g.status === "completed")
  const totalProgress = goals.length > 0
    ? goals.reduce((acc, g) => acc + g.progress, 0) / goals.length
    : 0

  return (
    <section className="container py-6">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">个人 OKR 仪表盘</h1>
          <p className="text-muted-foreground">
            追踪你的目标进度，管理你的日常任务
          </p>
        </div>
        <div className="flex gap-4">
          <GoalDialog
            trigger={
              <button className={buttonVariants()}>
                添加目标
              </button>
            }
          />
          <WidgetDialog
            trigger={
              <button className={buttonVariants({ variant: "outline" })}>
                添加小组件
              </button>
            }
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
        <Card className="p-4">
          <div className="text-2xl font-bold">{activeGoals.length}</div>
          <div className="text-sm text-muted-foreground">活跃目标</div>
        </Card>
        <Card className="p-4">
          <div className="text-2xl font-bold">{weeklyGoals.length}</div>
          <div className="text-sm text-muted-foreground">本周待办</div>
        </Card>
        <Card className="p-4">
          <div className="text-2xl font-bold">{Math.round(totalProgress)}%</div>
          <div className="text-sm text-muted-foreground">整体进度</div>
        </Card>
        <Card className="p-4">
          <div className="text-2xl font-bold">{completedGoals.length}</div>
          <div className="text-sm text-muted-foreground">已完成目标</div>
        </Card>
      </div>

      <DashboardLayout />
    </section>
  )
}
