"use client"

import { useState } from "react"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"
import { nanoid } from "nanoid"

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { RadioGroup, RadioGroupItem, Label } from "@/components/ui/radio-group"
import { cn } from "@/lib/utils"
import { useStore } from "@/lib/store"
import { MessageSquare } from "lucide-react"

const widgetTypes = [
  {
    id: "todo",
    name: "嘟嘟清单",
    description: "管理你的待办事项",
  },
  {
    id: "ok",
    name: "OKR目标",
    description: "追踪你的目标完成情况",
  },
  {
    id: "image",
    name: "上传图片",
    description: "展示重要的图片",
  },
  {
    id: "countdown",
    name: "倒计时",
    description: "倒计重要日期",
  },
  {
    id: "links",
    name: "网站列表",
    description: "收藏常用网站链接",
  },
  {
    id: "chat",
    name: "AI 助手",
    description: "智能聊天助手，帮助你更好地完成目标",
    icon: MessageSquare,
  },
]

const widgetSchema = z.object({
  type: z.string(),
})

type WidgetFormValues = z.infer<typeof widgetSchema>

interface AddWidgetDialogProps {
  children: React.ReactNode
}

export function AddWidgetDialog({ children }: AddWidgetDialogProps) {
  const { settings, updateLayout } = useStore()
  const [open, setOpen] = useState(false)

  const form = useForm<WidgetFormValues>({
    resolver: zodResolver(widgetSchema),
    defaultValues: {
      type: "",
    },
  })

  function getDefaultContent(type: string) {
    switch (type) {
      case "todo":
        return { items: [] }
      case "ok":
        return { goals: [] }
      case "image":
        return { url: "" }
      case "countdown":
        return { date: "", title: "" }
      case "links":
        return { links: [] }
      case "chat":
        return { messages: [] }
      default:
        return {}
    }
  }

  function getDefaultSize(type: string) {
    switch (type) {
      case "chat":
        return { w: 8, h: 12 }
      case "goals":
        return { w: 6, h: 8 }
      case "schedule":
        return { w: 6, h: 8 }
      case "pomodoro":
        return { w: 4, h: 4 }
      case "avatar":
        return { w: 3, h: 4 }
      default:
        return { w: 4, h: 4 }
    }
  }

  function onSubmit(data: WidgetFormValues) {
    const currentLayout = settings.layouts.find(l => l.id === settings.defaultLayout)
    if (!currentLayout) return

    const newWidget = {
      id: nanoid(),
      type: data.type as string,
      position: { x: 0, y: 0 },
      size: getDefaultSize(data.type),
      content: getDefaultContent(data.type),
    }

    updateLayout(currentLayout.id, {
      widgets: [...currentLayout.widgets, newWidget],
    })
    setOpen(false)
    form.reset()
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {children}
      </DialogTrigger>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>添加小组件</DialogTitle>
          <DialogDescription>
            选择一个小组件类型
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="type"
              render={({ field }) => (
                <div className="grid gap-4 py-4">
                  <div className="grid gap-2">
                    {widgetTypes.map((type) => (
                      <div key={type.id} className="flex items-center space-x-2">
                        <RadioGroupItem
                          value={type.id}
                          id={type.id}
                          {...field}
                        />
                        <Label htmlFor={type.id} className="flex-1">
                          <div className="font-medium">{type.name}</div>
                          <div className="text-sm text-muted-foreground">
                            {type.description}
                          </div>
                        </Label>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            />

            <div className="flex justify-end">
              <Button type="submit">
                添加
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}
