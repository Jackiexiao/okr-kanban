"use client"

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Goal } from "@/types/okr"
import { GoalForm } from "./goal-form"

interface GoalDialogProps {
  goal?: Goal
  trigger: React.ReactNode
  title?: string
  description?: string
  onSubmit?: (goal: Goal) => void
}

export function GoalDialog({
  goal,
  trigger,
  title = goal ? "编辑目标" : "创建目标",
  description = goal ? "编辑现有目标的详细信息。" : "创建一个新的目标。",
  onSubmit,
}: GoalDialogProps) {
  return (
    <Dialog>
      <DialogTrigger asChild>
        {trigger}
      </DialogTrigger>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription>
            {description}
          </DialogDescription>
        </DialogHeader>
        <GoalForm
          goal={goal}
          onSubmit={(goal) => {
            onSubmit?.(goal)
          }}
        />
      </DialogContent>
    </Dialog>
  )
}
