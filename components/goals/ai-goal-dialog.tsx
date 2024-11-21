"use client"

import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "../ui/dialog"
import { Button } from "../ui/button"
import { Textarea } from "../ui/textarea"
import { useStore } from "@/lib/store"
import { Mic, Send, Loader2 } from "lucide-react"

interface Goal {
  title: string
  description: string
  progress: number
  subgoals?: Goal[]
}

async function parseGoalWithAI(input: string, apiKey: string): Promise<Goal> {
  const response = await fetch("https://api.openai.com/v1/chat/completions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer \${apiKey}`,
    },
    body: JSON.stringify({
      model: "gpt-3.5-turbo",
      messages: [
        {
          role: "system",
          content: "你是一个目标规划助手。请将用户输入的目标转换为结构化的JSON格式，包含标题、描述、进度（默认0）和子目标（如果有）。",
        },
        {
          role: "user",
          content: input,
        },
      ],
      response_format: { type: "json_object" },
    }),
  })

  const data = await response.json()
  return JSON.parse(data.choices[0].message.content)
}

export function AIGoalDialog() {
  const { settings, addGoal } = useStore()
  const [input, setInput] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [isRecording, setIsRecording] = useState(false)
  const [recognition, setRecognition] = useState<SpeechRecognition | null>(null)

  const startRecording = () => {
    if (!settings.openaiKey) {
      alert("请先在设置中配置OpenAI API Key")
      return
    }

    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition
    if (SpeechRecognition) {
      const recognition = new SpeechRecognition()
      recognition.lang = "zh-CN"
      recognition.continuous = true
      recognition.interimResults = true

      recognition.onresult = (event) => {
        const transcript = Array.from(event.results)
          .map((result) => result[0])
          .map((result) => result.transcript)
          .join("")
        setInput(transcript)
      }

      recognition.start()
      setIsRecording(true)
      setRecognition(recognition)
    } else {
      alert("你的浏览器不支持语音识别")
    }
  }

  const stopRecording = () => {
    if (recognition) {
      recognition.stop()
      setIsRecording(false)
      setRecognition(null)
    }
  }

  const handleSubmit = async () => {
    if (!settings.openaiKey) {
      alert("请先在设置中配置OpenAI API Key")
      return
    }

    if (!input.trim()) return

    setIsLoading(true)
    try {
      const goal = await parseGoalWithAI(input, settings.openaiKey)
      addGoal(goal)
      setInput("")
    } catch (error) {
      console.error(error)
      alert("处理目标时出错，请重试")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline" className="w-full">
          添加新目标
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>添加新目标</DialogTitle>
        </DialogHeader>
        <div className="space-y-4 py-4">
          <div className="relative">
            <Textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="描述你的目标..."
              className="min-h-[100px] pr-20"
            />
            <div className="absolute bottom-2 right-2 space-x-2">
              <Button
                variant="ghost"
                size="icon"
                onClick={isRecording ? stopRecording : startRecording}
              >
                <Mic className={isRecording ? "text-red-500" : ""} />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                onClick={handleSubmit}
                disabled={isLoading || !input.trim()}
              >
                {isLoading ? <Loader2 className="animate-spin" /> : <Send />}
              </Button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
