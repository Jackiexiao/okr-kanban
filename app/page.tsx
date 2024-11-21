"use client"

import { DashboardLayout } from "@/components/dashboard/dashboard-layout"
import { WidgetDialog as AddWidgetDialog } from "@/components/dashboard/widget-dialog"
import { buttonVariants, Button } from "@/components/ui/button"
import { Plus } from "lucide-react"
import { useStore } from "@/lib/store"

export default function IndexPage() {
  return (
    <>
      <div className="flex items-center justify-between space-y-2 mb-8">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">个人 OKR 仪表盘</h2>
          <p className="text-muted-foreground">
            在这里管理你的目标和任务
          </p>
        </div>
        <AddWidgetDialog>
          <Button>
            <Plus className="h-4 w-4 mr-2" />
            添加小组件
          </Button>
        </AddWidgetDialog>
      </div>

      <div className="grid gap-4 md:gap-8 grid-cols-1">
        <DashboardLayout />
      </div>
    </>
  )
}
