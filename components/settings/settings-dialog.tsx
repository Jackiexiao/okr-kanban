"use client"

import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "../ui/dialog"
import { Button } from "../ui/button"
import { Settings } from "lucide-react"
import { Input } from "../ui/input"
import { Label } from "../ui/label"
import { useStore } from "@/lib/store"
import { Card } from "../ui/card"
import { Switch } from "../ui/switch"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select"
import { testOpenAIConnection } from "@/lib/openai"
import { useToast } from "@/hooks/use-toast"

export function SettingsDialog() {
  const { settings, updateSettings } = useStore()
  const [openaiKey, setOpenaiKey] = useState(settings.openaiKey || "")
  const [openaiBaseUrl, setOpenaiBaseUrl] = useState(settings.openaiBaseUrl || "https://api.openai.com/v1")
  const [openaiModel, setOpenaiModel] = useState(settings.openaiModel || "gpt-3.5-turbo")
  const [showKey, setShowKey] = useState(false)
  const [testing, setTesting] = useState(false)
  const { toast } = useToast()

  const handleSave = () => {
    try {
      updateSettings({
        ...settings,
        openaiKey: openaiKey.trim(),
        openaiBaseUrl: openaiBaseUrl.trim() || "https://api.openai.com/v1",
        openaiModel: openaiModel.trim() || "gpt-3.5-turbo"
      })
      toast({
        title: "设置已保存",
        description: "您的设置已成功保存",
      })
    } catch (error) {
      console.error("Save settings error:", error)
      toast({
        title: "保存失败",
        description: error instanceof Error ? error.message : "保存设置时发生错误",
        variant: "destructive",
      })
    }
  }

  const handleTest = async () => {
    if (!openaiKey.trim()) {
      toast({
        title: "错误",
        description: "请先输入 OpenAI API Key",
        variant: "destructive",
      })
      return
    }

    try {
      setTesting(true)
      await testOpenAIConnection()
      toast({
        title: "连接成功",
        description: "OpenAI API 配置测试通过",
      })
    } catch (error) {
      console.error("Test connection error:", error)
      toast({
        title: "连接失败",
        description: error instanceof Error ? error.message : "测试连接时发生错误",
        variant: "destructive",
      })
    } finally {
      setTesting(false)
    }
  }

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm">
          <Settings className="h-4 w-4 mr-2" />
          设置
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>设置</DialogTitle>
        </DialogHeader>
        <div className="space-y-4 py-4">
          <Card className="p-4">
            <h3 className="font-medium mb-4">OpenAI 配置</h3>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="openai-key">API Key</Label>
                <div className="relative">
                  <Input
                    id="openai-key"
                    type={showKey ? "text" : "password"}
                    value={openaiKey}
                    onChange={(e) => setOpenaiKey(e.target.value)}
                    placeholder="sk-..."
                  />
                  <div className="absolute right-2 top-2 flex items-center space-x-2">
                    <Label htmlFor="show-key" className="text-xs">显示</Label>
                    <Switch
                      id="show-key"
                      checked={showKey}
                      onCheckedChange={setShowKey}
                    />
                  </div>
                </div>
                <p className="text-sm text-yellow-500">
                  ⚠️ 注意：API Key 将存储在浏览器本地。虽然我们采取了安全措施，但在浏览器中使用 API Key 仍有一定风险，请确保：
                  <ul className="list-disc list-inside mt-2 space-y-1">
                    <li>不要在不信任的设备上输入 API Key</li>
                    <li>定期更换 API Key</li>
                    <li>给 API Key 设置使用限额</li>
                  </ul>
                </p>
                <p className="text-sm text-muted-foreground">
                  在 OpenAI 官网获取 API Key
                </p>
              </div>
              <div className="space-y-2">
                <Label htmlFor="openai-base-url">API Base URL</Label>
                <Input
                  id="openai-base-url"
                  type="text"
                  value={openaiBaseUrl}
                  onChange={(e) => setOpenaiBaseUrl(e.target.value)}
                  placeholder="https://api.openai.com/v1"
                />
                <p className="text-sm text-muted-foreground">
                  如果使用代理服务，可以修改此地址
                </p>
              </div>
              <div className="space-y-2">
                <Label htmlFor="openai-model">模型</Label>
                <Input
                  id="openai-model"
                  type="text"
                  value={openaiModel}
                  onChange={(e) => setOpenaiModel(e.target.value)}
                  placeholder="gpt-3.5-turbo"
                />
                <p className="text-sm text-muted-foreground">
                  输入要使用的 OpenAI 模型名称，例如：gpt-4、gpt-3.5-turbo 等
                </p>
              </div>
              <div className="flex space-x-2">
                <Button onClick={handleTest} disabled={testing} variant="secondary" className="flex-1">
                  {testing ? "测试中..." : "测试连接"}
                </Button>
                <Button onClick={handleSave} className="flex-1">
                  保存
                </Button>
              </div>
            </div>
          </Card>
        </div>
      </DialogContent>
    </Dialog>
  )
}
