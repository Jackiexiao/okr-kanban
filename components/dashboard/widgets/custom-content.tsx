"use client"

import ReactMarkdown from 'react-markdown'
import { ScrollArea } from '@/components/ui/scroll-area'

interface CustomContentWidgetProps {
  content: {
    type: 'markdown' | 'image' | 'countdown' | 'stats'
    data: any
  }
}

export function CustomContentWidget({ content }: CustomContentWidgetProps) {
  const renderContent = () => {
    switch (content.type) {
      case 'markdown':
        return (
          <ScrollArea className="h-full">
            <div className="prose prose-sm dark:prose-invert max-w-none">
              <ReactMarkdown>{content.data}</ReactMarkdown>
            </div>
          </ScrollArea>
        )
      case 'image':
        return (
          <div className="relative w-full h-full">
            <img
              src={content.data}
              alt="Widget content"
              className="object-contain w-full h-full rounded-md"
            />
          </div>
        )
      case 'countdown':
        return <CountdownTimer target={content.data} />
      case 'stats':
        return <StatsDisplay data={content.data} />
      default:
        return (
          <div className="flex items-center justify-center h-full text-sm text-muted-foreground">
            暂不支持的内容类型
          </div>
        )
    }
  }

  return (
    <div className="h-full">
      {renderContent()}
    </div>
  )
}

function CountdownTimer({ target }: { target: string }) {
  const targetDate = new Date(target)
  const now = new Date()
  const difference = targetDate.getTime() - now.getTime()
  
  const days = Math.floor(difference / (1000 * 60 * 60 * 24))
  const hours = Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60))
  const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60))
  
  if (difference < 0) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-center space-y-1">
          <div className="text-xl font-semibold text-muted-foreground">已结束</div>
          <div className="text-sm text-muted-foreground">
            {targetDate.toLocaleDateString()}
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="flex items-center justify-center h-full">
      <div className="text-center space-y-4">
        <div className="grid grid-cols-3 gap-4">
          <TimeBlock value={days} label="天" />
          <TimeBlock value={hours} label="时" />
          <TimeBlock value={minutes} label="分" />
        </div>
        <div className="text-sm text-muted-foreground">
          目标日期：{targetDate.toLocaleDateString()}
        </div>
      </div>
    </div>
  )
}

function TimeBlock({ value, label }: { value: number; label: string }) {
  return (
    <div className="text-center">
      <div className="text-2xl font-bold">{value}</div>
      <div className="text-xs text-muted-foreground">{label}</div>
    </div>
  )
}

function StatsDisplay({ data }: { data: Record<string, number> }) {
  return (
    <div className="h-full flex items-center justify-center">
      <div className="grid grid-cols-2 gap-6 p-2">
        {Object.entries(data).map(([label, value]) => (
          <div key={label} className="text-center space-y-1">
            <div className="text-2xl font-bold">{value}</div>
            <div className="text-sm text-muted-foreground whitespace-nowrap">{label}</div>
          </div>
        ))}
      </div>
    </div>
  )
}
