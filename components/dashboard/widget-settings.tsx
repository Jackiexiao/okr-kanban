"use client"

import { Settings2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useState } from "react"
import { useStore } from "@/lib/store"
import { cn } from "@/lib/utils"
import { DashboardWidget } from "@/types/okr"

interface WidgetSettingsProps {
  widget: DashboardWidget
  onUpdate?: (widget: Partial<DashboardWidget>) => void
  children: React.ReactNode
}

const presetColors = [
  { name: "默认", value: "bg-card" },
  { name: "蓝色", value: "bg-blue-50" },
  { name: "绿色", value: "bg-green-50" },
  { name: "紫色", value: "bg-purple-50" },
  { name: "粉色", value: "bg-pink-50" },
  { name: "黄色", value: "bg-yellow-50" },
]

export function WidgetSettings({ widget, onUpdate, children }: WidgetSettingsProps) {
  const [open, setOpen] = useState(false)
  const updateWidget = useStore(state => state.updateWidget)

  const handleUpdatePrompt = (prompt: string) => {
    if (prompt.length > 1000) return // 限制系统提示词长度
    const update = {
      content: {
        ...widget.content,
        systemPrompt: prompt,
      },
    }
    updateWidget(widget.id, update)
    onUpdate?.(update)
  }

  const handleUpdateColor = (color: string) => {
    const update = {
      content: {
        ...widget.content,
        bgColor: color,
      },
    }
    updateWidget(widget.id, update)
    onUpdate?.(update)
  }

  const handleUpdateTitle = (title: string) => {
    if (title.length > 50) return // 限制标题长度
    const update = {
      content: {
        ...widget.content,
        title,
      },
    }
    updateWidget(widget.id, update)
    onUpdate?.(update)
  }

  return (
    <div className={cn(
      "relative group h-full",
      widget.content.bgColor || presetColors[0].value
    )}>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild>
          <Button
            variant="ghost"
            size="icon"
            className="absolute top-2 right-2 z-[100] opacity-0 group-hover:opacity-100 transition-opacity hover:bg-accent"
          >
            <Settings2 className="h-4 w-4" />
          </Button>
        </DialogTrigger>

        <DialogContent>
          <DialogHeader>
            <DialogTitle>小组件设置</DialogTitle>
            <DialogDescription>
              自定义小组件的外观和行为
            </DialogDescription>
          </DialogHeader>

          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="title">标题</Label>
              <Input
                id="title"
                placeholder="输入小组件标题..."
                value={widget.content.title || ""}
                onChange={(e) => handleUpdateTitle(e.target.value)}
              />
            </div>

            {widget.type === "chat" && (
              <div className="grid gap-2">
                <Label htmlFor="systemPrompt">系统提示词</Label>
                <Input
                  id="systemPrompt"
                  placeholder="输入系统提示词..."
                  value={widget.content.systemPrompt || ""}
                  onChange={(e) => handleUpdatePrompt(e.target.value)}
                />
              </div>
            )}

            <div className="grid gap-2">
              <Label>背景颜色</Label>
              <div className="flex gap-2 flex-wrap">
                {presetColors.map((color) => (
                  <button
                    key={color.value}
                    className={cn(
                      "w-8 h-8 rounded-md border transition-all",
                      color.value,
                      widget.content.bgColor === color.value
                        ? "ring-2 ring-primary"
                        : "hover:scale-110"
                    )}
                    onClick={() => handleUpdateColor(color.value)}
                  />
                ))}
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>
      {children}
    </div>
  )
}
