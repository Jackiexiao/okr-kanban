"use client"

import { useStore } from '@/lib/store'
import { Goal } from '@/types/okr'
import { filterGoalsByType, getGoalTypeLabel } from '@/lib/utils'
import {
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Legend
} from 'recharts'

interface VisualizationWidgetProps {
  content: {
    type: 'pie' | 'bar'
    dataType: 'type' | 'status' | 'progress'
  }
}

const COLORS = [
  '#0088FE',
  '#00C49F',
  '#FFBB28',
  '#FF8042',
  '#8884d8',
  '#82ca9d'
]

export function VisualizationWidget({ content }: VisualizationWidgetProps) {
  const { goals } = useStore()

  const getData = () => {
    switch (content.dataType) {
      case 'type':
        return getGoalsByTypeData(goals)
      case 'status':
        return getGoalsByStatusData(goals)
      case 'progress':
        return getGoalsByProgressData(goals)
      default:
        return []
    }
  }

  const renderChart = () => {
    const data = getData()

    switch (content.type) {
      case 'pie':
        return (
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={data}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={80}
                paddingAngle={5}
                dataKey="value"
              >
                {data.map((entry, index) => (
                  <Cell 
                    key={`cell-${index}`}
                    fill={COLORS[index % COLORS.length]}
                  />
                ))}
              </Pie>
              <Tooltip 
                formatter={(value: number) => [value, '数量']}
                contentStyle={{
                  backgroundColor: 'hsl(var(--card))',
                  border: '1px solid hsl(var(--border))',
                  borderRadius: '6px'
                }}
              />
              <Legend 
                verticalAlign="bottom"
                height={36}
                formatter={(value) => (
                  <span className="text-sm">{value}</span>
                )}
              />
            </PieChart>
          </ResponsiveContainer>
        )
      case 'bar':
        return (
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data} margin={{ top: 10, right: 10, bottom: 20, left: 10 }}>
              <XAxis 
                dataKey="name"
                tick={{ fontSize: 12 }}
                interval={0}
                angle={-45}
                textAnchor="end"
              />
              <YAxis 
                width={30}
                tick={{ fontSize: 12 }}
              />
              <Tooltip
                formatter={(value: number) => [value, '数量']}
                contentStyle={{
                  backgroundColor: 'hsl(var(--card))',
                  border: '1px solid hsl(var(--border))',
                  borderRadius: '6px'
                }}
              />
              <Bar 
                dataKey="value"
                fill={COLORS[0]}
                radius={[4, 4, 0, 0]}
              />
            </BarChart>
          </ResponsiveContainer>
        )
      default:
        return (
          <div className="flex items-center justify-center h-full text-sm text-muted-foreground">
            暂不支持的图表类型
          </div>
        )
    }
  }

  return (
    <div className="h-full p-2">
      {renderChart()}
    </div>
  )
}

function getGoalsByTypeData(goals: Goal[]) {
  const types = ['yearly', 'quarterly', 'monthly', 'weekly', 'habit'] as const
  return types.map(type => ({
    name: getGoalTypeLabel(type),
    value: filterGoalsByType(goals, type).length
  }))
}

function getGoalsByStatusData(goals: Goal[]) {
  const statusMap: Record<string, number> = {
    '未开始': 0,
    '进行中': 0,
    '已完成': 0,
    '已取消': 0
  }

  goals.forEach(goal => {
    switch (goal.status) {
      case 'not_started':
        statusMap['未开始']++
        break
      case 'in_progress':
        statusMap['进行中']++
        break
      case 'completed':
        statusMap['已完成']++
        break
      case 'cancelled':
        statusMap['已取消']++
        break
    }
  })

  return Object.entries(statusMap)
    .filter(([_, value]) => value > 0)
    .map(([name, value]) => ({ name, value }))
}

function getGoalsByProgressData(goals: Goal[]) {
  const progressRanges = [
    { min: 0, max: 20, label: '0-20%' },
    { min: 20, max: 40, label: '20-40%' },
    { min: 40, max: 60, label: '40-60%' },
    { min: 60, max: 80, label: '60-80%' },
    { min: 80, max: 100, label: '80-100%' }
  ]

  const data = progressRanges.map(range => ({
    name: range.label,
    value: goals.filter(
      goal => goal.progress >= range.min && goal.progress <= range.max
    ).length
  }))

  return data.filter(item => item.value > 0)
}
