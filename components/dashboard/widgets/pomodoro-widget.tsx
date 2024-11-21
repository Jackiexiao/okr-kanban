"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Play, Pause, RotateCcw } from "lucide-react"
import { Progress } from "@/components/ui/progress"

interface PomodoroWidgetProps {
  content: {
    duration?: number // in minutes
  }
}

export function PomodoroWidget({ content }: PomodoroWidgetProps) {
  const duration = content.duration || 25 // default 25 minutes
  const [timeLeft, setTimeLeft] = useState(duration * 60)
  const [isRunning, setIsRunning] = useState(false)

  useEffect(() => {
    let timer: NodeJS.Timeout
    if (isRunning && timeLeft > 0) {
      timer = setInterval(() => {
        setTimeLeft((prev) => prev - 1)
      }, 1000)
    }
    return () => clearInterval(timer)
  }, [isRunning, timeLeft])

  const toggleTimer = () => {
    setIsRunning(!isRunning)
  }

  const resetTimer = () => {
    setIsRunning(false)
    setTimeLeft(duration * 60)
  }

  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60)
    const remainingSeconds = seconds % 60
    return `${minutes.toString().padStart(2, "0")}:${remainingSeconds
      .toString()
      .padStart(2, "0")}`
  }

  const progress = ((duration * 60 - timeLeft) / (duration * 60)) * 100

  return (
    <div className="flex flex-col items-center space-y-4">
      <div className="text-4xl font-bold">{formatTime(timeLeft)}</div>
      <Progress value={progress} className="w-full" />
      <div className="flex space-x-2">
        <Button
          size="icon"
          variant={isRunning ? "outline" : "default"}
          onClick={toggleTimer}
        >
          {isRunning ? (
            <Pause className="h-4 w-4" />
          ) : (
            <Play className="h-4 w-4" />
          )}
        </Button>
        <Button size="icon" variant="outline" onClick={resetTimer}>
          <RotateCcw className="h-4 w-4" />
        </Button>
      </div>
    </div>
  )
}
