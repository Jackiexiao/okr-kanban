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
import { Input } from "@/components/ui/input"
import { cn } from "@/lib/utils"
import { useStore } from "@/lib/store"

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
]

const widgetSchema = z.object({
  title: z.string().min(1, "请输入名称"),
  type: z.string(),
})

type WidgetFormValues = z.infer<typeof widgetSchema>

interface AddWidgetDialogProps {
  children: React.ReactNode
}

export function AddWidgetDialog({ children }: AddWidgetDialogProps) {
  const { settings, updateLayout } = useStore()
  const [open, setOpen] = useState(false)
  const [selectedType, setSelectedType] = useState(widgetTypes[0].id)

  const form = useForm<WidgetFormValues>({
    resolver: zodResolver(widgetSchema),
    defaultValues: {
      title: "",
      type: widgetTypes[0].id,
    },
  })

  function onSubmit(values: WidgetFormValues) {
    const currentLayout = settings.layouts.find(l => l.id === settings.defaultLayout)
    if (!currentLayout) return

    const newWidget = {
      id: nanoid(),
      title: values.title,
      type: values.type,
      position: { x: 0, y: 0 },
      size: { w: 3, h: 2 },
      content: getDefaultContent(values.type),
    }

    updateLayout(currentLayout.id, {
      widgets: [...currentLayout.widgets, newWidget],
    })
    setOpen(false)
    form.reset()
  }

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
      default:
        return {}
    }
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
            选择一个小组件类型并为其命名
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>名称</FormLabel>
                  <FormControl>
                    <Input placeholder="输入小组件名称" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="type"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>类型</FormLabel>
                  <div className="grid grid-cols-2 gap-4 pt-1">
                    {widgetTypes.map((type) => (
                      <Button
                        key={type.id}
                        type="button"
                        variant="outline"
                        className={cn(
                          "h-auto flex flex-col items-start p-4 space-y-1",
                          field.value === type.id && "border-primary"
                        )}
                        onClick={() => {
                          field.onChange(type.id)
                          setSelectedType(type.id)
                        }}
                      >
                        <div className="font-medium">{type.name}</div>
                        <div className="text-sm text-muted-foreground">
                          {type.description}
                        </div>
                      </Button>
                    ))}
                  </div>
                  <FormMessage />
                </FormItem>
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
