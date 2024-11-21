"use client"

import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Edit } from "lucide-react"

interface AvatarWidgetProps {
  content: {
    seed?: string
  }
}

export function AvatarWidget({ content }: AvatarWidgetProps) {
  const seed = content.seed || "felix"
  const avatarUrl = `https://api.dicebear.com/7.x/notionists/svg?seed=${seed}`

  return (
    <div className="relative group">
      <Image
        src={avatarUrl}
        alt="Avatar"
        width={200}
        height={200}
        className="rounded-xl"
      />
      <Button
        size="icon"
        variant="ghost"
        className="absolute bottom-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity"
        onClick={() => window.open("https://www.dicebear.com/playground/", "_blank")}
      >
        <Edit className="h-4 w-4" />
      </Button>
    </div>
  )
}
