"use client"

import { Button } from "@/components/ui/button"
import { useStore } from "@/lib/store"
import { nanoid } from "nanoid"

interface AvatarWidgetProps {
  content: {
    seed?: string
  }
  id: string
}

export function AvatarWidget({ content, id }: AvatarWidgetProps) {
  const updateWidget = useStore(state => state.updateWidget)

  const generateRandomSeed = () => {
    const newSeed = nanoid(10)
    updateWidget(id, {
      content: {
        ...content,
        seed: newSeed,
      },
    })
  }

  return (
    <div className="flex flex-col items-center justify-center space-y-4">
      <img
        src={`https://api.dicebear.com/7.x/notionists/svg?seed=${content.seed || "default"}`}
        alt="Avatar"
        className="w-32 h-32"
      />
      <Button variant="outline" size="sm" onClick={generateRandomSeed}>
        随机生成
      </Button>
    </div>
  )
}
