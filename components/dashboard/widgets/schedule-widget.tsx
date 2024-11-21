"use client"

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { ScrollArea } from "@/components/ui/scroll-area"

interface ScheduleItem {
  time: string
  activity: string
  description: string
}

interface ScheduleWidgetProps {
  title: string
  description?: string
  schedule: ScheduleItem[]
}

export function ScheduleWidget({ content }: { content: ScheduleWidgetProps }) {
  return (
    <Card className="h-full">
      <CardHeader>
        <CardTitle>{content.title}</CardTitle>
        {content.description && (
          <CardDescription>{content.description}</CardDescription>
        )}
      </CardHeader>
      <CardContent>
        <ScrollArea className="flex-1">
          <div className="space-y-4">
            {content.schedule.map((item, index) => (
              <div
                key={index}
                className="group relative p-3 rounded-lg hover:bg-accent transition-colors"
              >
                <div className="text-sm font-medium text-primary">{item.time}</div>
                <div className="text-base font-medium mt-1">{item.activity}</div>
                <div className="text-sm text-muted-foreground mt-1">
                  {item.description}
                </div>
                <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-0 group-hover:h-full bg-primary transition-all duration-200" />
              </div>
            ))}
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  )
}
