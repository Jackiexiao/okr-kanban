"use client"

import { DashboardWidget } from "@/types/okr"
import { AvatarWidget } from "./widgets/avatar-widget"
import { PomodoroWidget } from "./widgets/pomodoro-widget"
import { GoalsWidget } from "./widgets/goals-widget"
import { ScheduleWidget } from "./widgets/schedule-widget"
import { ChatWidget } from "./widgets/chat-widget"
import { CustomContent } from "./widgets/custom-content"

interface WidgetContentProps {
  widget: DashboardWidget
}

export function WidgetContent({ widget }: WidgetContentProps) {
  const renderContent = () => {
    switch (widget.type) {
      case "avatar":
        return <AvatarWidget content={widget.content} />
      case "pomodoro":
        return <PomodoroWidget content={widget.content} />
      case "goals":
        return <GoalsWidget content={widget.content} />
      case "schedule":
        return <ScheduleWidget content={widget.content} />
      case "chat":
        return <ChatWidget content={widget.content} />
      case "custom":
        return <CustomContent content={widget.content} />
      default:
        return <div>未知的小组件类型</div>
    }
  }

  return <div className="w-full h-full">{renderContent()}</div>
}
