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

interface WidgetSettingsProps {
  id: string
  type: string
  content: any
}

export function WidgetSettings({ id, type, content }: WidgetSettingsProps) {
  const [open, setOpen] = useState(false)
  const updateWidget = useStore(state => state.updateWidget)

  const handleUpdatePrompt = (prompt: string) => {
    updateWidget(id, {
      content: {
        ...content,
        systemPrompt: prompt,
      },
    })
  }

  const handleUpdateBgColor = (color: string) => {
    updateWidget(id, {
      content: {
        ...content,
        bgColor: color,
      },
    })
  }

  const handleUpdateTitle = (title: string) => {
    updateWidget(id, {
      content: {
        ...content,
        title,
      },
    })
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className="absolute top-2 right-2 z-50 opacity-0 group-hover:opacity-100 transition-opacity hover:bg-accent"
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
              value={content.title || ""}
              onChange={(e) => handleUpdateTitle(e.target.value)}
            />
          </div>

          <div className="grid gap-2">
            <Label htmlFor="bg-color">背景颜色</Label>
            <Input
              id="bg-color"
              type="color"
              value={content.bgColor || "#ffffff"}
              onChange={(e) => handleUpdateBgColor(e.target.value)}
            />
          </div>

          {type === "chat" && (
            <div className="grid gap-2">
              <Label htmlFor="system-prompt">系统提示词</Label>
              <Input
                id="system-prompt"
                placeholder="输入系统提示词..."
                value={content.systemPrompt || ""}
                onChange={(e) => handleUpdatePrompt(e.target.value)}
              />
              <p className="text-sm text-muted-foreground">
                这个提示词会在每次对话开始时发送给AI，用于设置AI的行为和角色
              </p>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  )
}
