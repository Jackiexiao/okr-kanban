"use client"

import { Progress } from '@/components/ui/progress'
import { useStore } from '@/lib/store'
import { Goal } from '@/types/okr'
import { calculateProgress, getGoalTypeLabel } from '@/lib/utils'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { PlusCircle } from 'lucide-react'
import { ScrollArea } from '@/components/ui/scroll-area'

interface GoalTrackerWidgetProps {
  content: { type: string; goalIds: string[] }
}

export function GoalTrackerWidget({ content }: GoalTrackerWidgetProps) {
  const { goals } = useStore()
  let trackedGoals: Goal[] = []

  switch (content.type) {
    case "single":
      trackedGoals = goals.filter(goal => content.goalIds.includes(goal.id))
      break
    case "multiple":
      trackedGoals = goals.filter(goal => content.goalIds.includes(goal.id))
      break
    case "type":
      const typeFilter = content.goalIds[0] // Use first ID as type filter
      trackedGoals = goals.filter(goal => goal.type === typeFilter)
      break
    default:
      trackedGoals = []
  }

  const progress = calculateProgress(trackedGoals)

  return (
    <div className="h-full flex flex-col">
      <div className="flex items-center space-x-2 mb-4">
        <Progress value={progress} className="flex-1 h-2" />
        <span className="text-sm text-muted-foreground whitespace-nowrap">
          {Math.round(progress)}%
        </span>
      </div>

      <ScrollArea className="flex-1 -mx-2 px-2">
        <div className="space-y-3">
          {trackedGoals.length > 0 ? (
            trackedGoals.map((goal) => (
              <GoalItem key={goal.id} goal={goal} />
            ))
          ) : (
            <div className="flex flex-col items-center justify-center h-[100px] text-center">
              <p className="text-sm text-muted-foreground mb-2">
                还没有添加目标
              </p>
              <Button variant="outline" size="sm">
                <PlusCircle className="h-4 w-4 mr-1" />
                添加目标
              </Button>
            </div>
          )}
        </div>
      </ScrollArea>
    </div>
  )
}

function GoalItem({ goal }: { goal: Goal }) {
  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between gap-2">
        <h4 className="text-sm font-medium leading-none flex-1 truncate">
          {goal.title}
        </h4>
        <Badge variant="secondary" className="whitespace-nowrap">
          {getGoalTypeLabel(goal.type)}
        </Badge>
      </div>
      <div className="flex items-center space-x-2">
        <Progress value={goal.progress} className="flex-1 h-1.5" />
        <span className="text-xs text-muted-foreground whitespace-nowrap">
          {goal.progress}%
        </span>
      </div>
    </div>
  )
}
