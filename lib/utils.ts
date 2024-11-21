import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"
import { Goal, GoalType } from "@/types/okr"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function generateId(): string {
  return Math.random().toString(36).substr(2, 9)
}

export function formatDate(date: string | Date): string {
  return new Date(date).toLocaleDateString('zh-CN', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  })
}

export function calculateProgress(goals: Goal[]): number {
  if (goals.length === 0) return 0
  const totalProgress = goals.reduce((acc, goal) => acc + goal.progress, 0)
  return Math.round(totalProgress / goals.length)
}

export function getGoalTypeLabel(type: GoalType): string {
  const labels: Record<GoalType, string> = {
    yearly: '年度目标',
    quarterly: '季度目标',
    monthly: '月度目标',
    weekly: '周目标',
    habit: '日常习惯'
  }
  return labels[type]
}

export function sortGoalsByDate(goals: Goal[]): Goal[] {
  return [...goals].sort((a, b) => {
    const dateA = a.endDate ? new Date(a.endDate).getTime() : Infinity
    const dateB = b.endDate ? new Date(b.endDate).getTime() : Infinity
    return dateA - dateB
  })
}

export function filterGoalsByType(goals: Goal[], type: GoalType): Goal[] {
  return goals.filter(goal => goal.type === type)
}

export function getChildGoals(goals: Goal[], parentId: string): Goal[] {
  return goals.filter(goal => goal.parentId === parentId)
}

export function buildGoalHierarchy(goals: Goal[]): Goal[] {
  const rootGoals = goals.filter(goal => !goal.parentId)
  return rootGoals.map(goal => ({
    ...goal,
    children: getChildGoals(goals, goal.id).map(child => ({
      ...child,
      children: getChildGoals(goals, child.id)
    }))
  }))
}
