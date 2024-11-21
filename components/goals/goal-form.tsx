"use client"

import { useState } from "react"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"

import { Button } from "@/components/ui/button"
import {
  Form,
  FormControl,
  FormDescription,
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
import { DatePicker } from "@/components/ui/date-picker"
import { Slider } from "@/components/ui/slider"
import { generateId, getGoalTypeLabel } from "@/lib/utils"
import { Goal, GoalType } from "@/types/okr"
import { useStore } from "@/lib/store"

const goalSchema = z.object({
  title: z.string().min(2, {
    message: "标题至少需要2个字符。",
  }),
  description: z.string().optional(),
  type: z.enum(["yearly", "quarterly", "monthly", "weekly", "habit"] as const),
  startDate: z.date().optional(),
  endDate: z.date().optional(),
  progress: z.number().min(0).max(100),
})

type GoalFormValues = z.infer<typeof goalSchema>

const defaultValues: Partial<GoalFormValues> = {
  title: "",
  description: "",
  type: "monthly",
  progress: 0,
}

interface GoalFormProps {
  goal?: Goal
  onSubmit?: (goal: Goal) => void
  onCancel?: () => void
}

export function GoalForm({ goal, onSubmit, onCancel }: GoalFormProps) {
  const { addGoal, updateGoal } = useStore()
  const [isSubmitting, setIsSubmitting] = useState(false)

  const form = useForm<GoalFormValues>({
    resolver: zodResolver(goalSchema),
    defaultValues: goal || defaultValues,
  })

  async function handleSubmit(values: GoalFormValues) {
    setIsSubmitting(true)
    try {
      const goalData: Goal = {
        id: goal?.id || generateId(),
        title: values.title,
        description: values.description || "",
        type: values.type,
        status: goal?.status || "not_started",
        progress: values.progress,
        startDate: values.startDate?.toISOString(),
        endDate: values.endDate?.toISOString(),
        tags: goal?.tags || [],
        notes: goal?.notes || "",
        children: goal?.children || [],
        createdAt: goal?.createdAt || new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      }

      if (goal) {
        updateGoal(goal.id, goalData)
      } else {
        addGoal(goalData)
      }

      onSubmit?.(goalData)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="title"
          render={({ field }) => (
            <FormItem>
              <FormLabel>标题</FormLabel>
              <FormControl>
                <Input placeholder="输入目标标题" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>描述</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="输入目标描述（可选）"
                  {...field}
                />
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
                onValueChange={field.onChange}
                defaultValue={field.value}
              >
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="选择目标类型" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {(["yearly", "quarterly", "monthly", "weekly", "habit"] as const).map(
                    (type) => (
                      <SelectItem key={type} value={type}>
                        {getGoalTypeLabel(type)}
                      </SelectItem>
                    )
                  )}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="grid grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="startDate"
            render={({ field }) => (
              <FormItem>
                <FormLabel>开始日期</FormLabel>
                <FormControl>
                  <DatePicker
                    date={field.value}
                    setDate={field.onChange}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="endDate"
            render={({ field }) => (
              <FormItem>
                <FormLabel>结束日期</FormLabel>
                <FormControl>
                  <DatePicker
                    date={field.value}
                    setDate={field.onChange}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <FormField
          control={form.control}
          name="progress"
          render={({ field }) => (
            <FormItem>
              <FormLabel>进度 ({field.value}%)</FormLabel>
              <FormControl>
                <Slider
                  min={0}
                  max={100}
                  step={1}
                  value={[field.value]}
                  onValueChange={(value) => field.onChange(value[0])}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="flex justify-end space-x-4">
          {onCancel && (
            <Button
              type="button"
              variant="outline"
              onClick={onCancel}
            >
              取消
            </Button>
          )}
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? "保存中..." : (goal ? "更新" : "创建")}
          </Button>
        </div>
      </form>
    </Form>
  )
}
