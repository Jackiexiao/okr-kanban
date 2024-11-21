import { useStore } from "./store"

export async function testOpenAIConnection() {
  const { settings } = useStore.getState()
  const { openaiKey, openaiBaseUrl, openaiModel } = settings

  if (!openaiKey) {
    throw new Error("请输入 OpenAI API Key")
  }

  if (!openaiBaseUrl) {
    throw new Error("请输入 OpenAI Base URL")
  }

  try {
    console.log("Testing OpenAI connection...")
    const response = await fetch(`${openaiBaseUrl}/chat/completions`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${openaiKey}`,
      },
      body: JSON.stringify({
        model: openaiModel || "gpt-3.5-turbo",
        messages: [
          {
            role: "user",
            content: "Hello! This is a test message. Please respond with: OK",
          },
        ],
        max_tokens: 10,
        temperature: 0,
      }),
    })

    if (!response.ok) {
      const error = await response.json()
      console.error("OpenAI API Error:", error)
      throw new Error(error.error?.message || "OpenAI API 连接失败")
    }

    const data = await response.json()
    console.log("OpenAI API Response:", data)
    
    if (!data.choices?.[0]?.message?.content) {
      throw new Error("OpenAI API 返回格式错误")
    }

    return true
  } catch (error) {
    console.error("OpenAI Test Error:", error)
    if (error instanceof Error) {
      throw error
    }
    throw new Error("测试 OpenAI 连接时发生未知错误")
  }
}
