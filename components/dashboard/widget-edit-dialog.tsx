"use client"

import { useState } from "react"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"

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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { DashboardWidget } from "@/types/okr"
import { useStore } from "@/lib/store"

const widgetSchema = z.object({
  title: z.string().min(2, {
    message: "标题至少需要2个字符。",
  }),
  type: z.enum(["goal_tracker", "custom_content", "visualization"]),
  contentType: z.string(),
  content: z.string().optional(),
})

type WidgetFormValues = z.infer<typeof widgetSchema>

interface WidgetEditDialogProps {
  trigger: React.ReactNode
  widget: DashboardWidget
}

const contentTypeOptions = {
  goal_tracker: [
    { value: "single", label: "单个目标" },
    { value: "multiple", label: "多个目标" },
    { value: "type", label: "按类型" },
  ],
  custom_content: [
    { value: "markdown", label: "Markdown" },
    { value: "image", label: "图片" },
    { value: "countdown", label: "倒计时" },
    { value: "stats", label: "统计数据" },
  ],
  visualization: [
    { value: "pie_type", label: "目标类型分布" },
    { value: "pie_status", label: "目标状态分布" },
    { value: "bar_progress", label: "目标进度分布" },
  ],
}

export function WidgetEditDialog({ trigger, widget }: WidgetEditDialogProps) {
  const { settings, updateLayout } = useStore()
  const [open, setOpen] = useState(false)
  const [selectedType, setSelectedType] = useState(widget.type)

  const form = useForm<WidgetFormValues>({
    resolver: zodResolver(widgetSchema),
    defaultValues: {
      title: widget.title,
      type: widget.type,
      contentType: (widget.content as any).type,
      content: (widget.content as any).data,
    },
  })

  function onSubmit(values: WidgetFormValues) {
    const currentLayout = settings.layouts.find(l => l.id === settings.defaultLayout)
    if (!currentLayout) return

    const updatedWidget: DashboardWidget = {
      ...widget,
      title: values.title,
      type: values.type,
      content: getWidgetContent(values),
    }

    const updatedWidgets = currentLayout.widgets.map(w =>
      w.id === widget.id ? updatedWidget : w
    )

    updateLayout(currentLayout.id, { widgets: updatedWidgets })
    setOpen(false)
  }

  function getWidgetContent(values: WidgetFormValues) {
    switch (values.type) {
      case "goal_tracker":
        return {
          type: values.contentType,
          goalIds: (widget.content as any).goalIds || [],
        }
      case "custom_content":
        return {
          type: values.contentType,
          data: values.content || "",
        }
      case "visualization":
        return {
          type: values.contentType.split("_")[0],
          dataType: values.contentType.split("_")[1],
        }
      default:
        return {}
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {trigger}
      </DialogTrigger>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>编辑小组件</DialogTitle>
          <DialogDescription>
            修改小组件的配置信息。
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>标题</FormLabel>
                  <FormControl>
                    <Input placeholder="输入小组件标题" {...field} />
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
                  <Select
                    onValueChange={(value) => {
                      field.onChange(value)
                      setSelectedType(value as any)
                      // Reset content type when widget type changes
                      form.setValue("contentType", 
                        contentTypeOptions[value as keyof typeof contentTypeOptions][0].value
                      )
                    }}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="选择小组件类型" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="goal_tracker">目标追踪</SelectItem>
                      <SelectItem value="custom_content">自定义内容</SelectItem>
                      <SelectItem value="visualization">数据可视化</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="contentType"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>内容类型</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="选择内容类型" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {contentTypeOptions[selectedType as keyof typeof contentTypeOptions]?.map(
                        (option) => (
                          <SelectItem key={option.value} value={option.value}>
                            {option.label}
                          </SelectItem>
                        )
                      )}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            {selectedType === "custom_content" && (
              <FormField
                control={form.control}
                name="content"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>内容</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="输入自定义内容"
                        className="h-32"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            )}

            <div className="flex justify-end space-x-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => setOpen(false)}
              >
                取消
              </Button>
              <Button type="submit">
                保存
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}
