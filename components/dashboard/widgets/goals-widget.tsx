"use client"

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { ScrollArea } from "@/components/ui/scroll-area"

interface Goal {
  title: string
  progress: number
  description?: string
  subgoals?: Goal[]
}

interface GoalsWidgetProps {
  content: {
    title: string
    description?: string
    goals: Goal[]
  }
}

export function GoalsWidget({ content }: GoalsWidgetProps) {
  const renderGoal = (goal: Goal, level = 0) => (
    <div key={goal.title} className="space-y-2" style={{ marginLeft: `${level * 1}rem` }}>
      <div className="flex justify-between items-center">
        <div className="font-medium">{goal.title}</div>
        <div className="text-sm text-muted-foreground">{goal.progress}%</div>
      </div>
      <Progress value={goal.progress} />
      {goal.description && (
        <div className="text-sm text-muted-foreground">{goal.description}</div>
      )}
      {goal.subgoals && (
        <div className="space-y-4 mt-4">
          {goal.subgoals.map((subgoal) => renderGoal(subgoal, level + 1))}
        </div>
      )}
    </div>
  )

  return (
    <Card className="h-full">
      <CardHeader>
        <CardTitle>{content.title}</CardTitle>
        {content.description && (
          <CardDescription>{content.description}</CardDescription>
        )}
      </CardHeader>
      <CardContent>
        <ScrollArea className="h-[300px] pr-4">
          <div className="space-y-6">
            {content.goals.map((goal) => renderGoal(goal))}
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  )
}
