/**
 * Discord Embed の型定義
 */
export type DiscordEmbed = {
  title?: string
  description?: string
  color?: number
  footer?: {
    text: string
  }
}

/**
 * Discord Webhook メッセージの型定義
 */
export type DiscordWebhookMessage = {
  content?: string
  embeds?: DiscordEmbed[]
}

/**
 * Discord Webhookにメッセージを送信する共通関数
 */
export async function sendDiscordWebhook(
  webhookUrl: string,
  message: DiscordWebhookMessage
): Promise<void> {
  const response = await fetch(webhookUrl, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(message),
  })

  if (!response.ok) {
    throw new Error(`Discord通知の送信に失敗しました: ${response.status} ${response.statusText}`)
  }

  console.log('Discord通知を送信しました')
}
