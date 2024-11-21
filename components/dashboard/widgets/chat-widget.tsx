import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { ScrollArea } from "@/components/ui/scroll-area"
import { useStore } from "@/lib/store"
import OpenAI from "openai"

interface Message {
  role: "user" | "assistant" | "system"
  content: string
}

export interface ChatWidgetProps {
  content: {
    title?: string
    description?: string
    systemPrompt?: string
    messages?: Message[]
  }
  id: string
}

export function ChatWidget({ content, id }: ChatWidgetProps) {
  const settings = useStore(state => state.settings)
  const updateWidget = useStore(state => state.updateWidget)
  const [input, setInput] = useState("")
  const [isLoading, setIsLoading] = useState(false)

  const chatMessages = content.messages || []

  const messages: Message[] = [
    ...(content.systemPrompt
      ? [{ role: "system", content: content.systemPrompt }]
      : []),
    ...chatMessages,
  ]

  const updateMessages = (newMessages: Message[]) => {
    updateWidget(id, {
      content: {
        ...content,
        messages: newMessages,
      },
    })
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInput(e.target.value)
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    if (!input.trim() || isLoading) return

    const userMessage = {
      role: "user" as const,
      content: input,
    }

    const newMessages = [...messages, userMessage]
    updateMessages(newMessages)
    setInput("")
    setIsLoading(true)

    try {
      const openai = new OpenAI({
        apiKey: settings.openaiKey,
        baseURL: settings.openaiBaseUrl,
        dangerouslyAllowBrowser: true, // 允许在浏览器中使用
      })

      const response = await openai.chat.completions.create({
        model: settings.openaiModel || "gpt-3.5-turbo",
        messages: newMessages,
      })

      const assistantMessage = {
        role: "assistant" as const,
        content: response.choices[0].message.content || "",
      }

      updateMessages([...newMessages, assistantMessage])
    } catch (error) {
      console.error("Chat error:", error)
      // 可以在这里添加错误提示
    } finally {
      setIsLoading(false)
    }
  }

  if (!settings.openaiKey) {
    return (
      <div className="flex items-center justify-center h-full">
        <p className="text-muted-foreground">请在设置中配置 OpenAI API Key</p>
      </div>
    )
  }

  return (
    <div className="flex flex-col h-full">
      <ScrollArea className="flex-1 pr-4 hover:pr-2 transition-all">
        <div className="space-y-4">
          {messages.map((message, index) => (
            <div
              key={index}
              className={`flex ${
                message.role === "user" ? "justify-end" : "justify-start"
              }`}
            >
              <div
                className={`rounded-lg px-3 py-2 max-w-[80%] ${
                  message.role === "user"
                    ? "bg-primary text-primary-foreground"
                    : message.role === "system"
                    ? "bg-muted"
                    : "bg-muted"
                }`}
              >
                {message.content}
              </div>
            </div>
          ))}
        </div>
      </ScrollArea>
      <form onSubmit={handleSubmit} className="flex gap-2 mt-4">
        <Input
          value={input}
          onChange={handleInputChange}
          placeholder="输入消息..."
          className="flex-1"
          disabled={isLoading}
        />
        <Button type="submit" disabled={isLoading}>
          {isLoading ? "发送中..." : "发送"}
        </Button>
      </form>
    </div>
  )
}
