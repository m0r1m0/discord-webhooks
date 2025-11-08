import { sendDiscordWebhook } from '../../utils/discord'
import { garbageSchedule, garbageTypes } from './config'

/**
 * 指定された日付がその曜日として月の何回目かを計算する
 * 例: 1月の第2月曜日 -> 2
 */
export function getWeekOfMonth(date: Date): number {
  const dayOfMonth = date.getDate()

  // その日が何回目の同じ曜日かを計算
  // 日付を7で割って切り上げると、その曜日が何回目かがわかる
  return Math.ceil(dayOfMonth / 7)
}

/**
 * 指定された日付のゴミ種別を取得する
 */
export function getGarbageTypeForDate(date: Date): string | null {
  const dayOfWeek = date.getDay()
  const weekOfMonth = getWeekOfMonth(date)

  const schedule = garbageSchedule.find(rule => {
    if (rule.dayOfWeek !== dayOfWeek) {
      return false
    }

    if (rule.weekOfMonth !== undefined) {
      return rule.weekOfMonth === weekOfMonth
    }

    return true
  })

  return schedule ? schedule.garbageType : null
}

/**
 * ゴミ出し通知をDiscord Webhookに送信するハンドラー
 */
export async function handleGarbageCollection(webhookUrl: string): Promise<void> {
  const today = new Date()
  const garbageTypeName = getGarbageTypeForDate(today)

  // 該当するゴミ出しがない場合は通知しない
  if (!garbageTypeName) {
    console.log(`今日(曜日:${today.getDay()}, 第${getWeekOfMonth(today)}週)のゴミ出しは設定されていません`)
    return
  }

  // ゴミ種別の詳細情報を取得
  const garbageType = garbageTypes[garbageTypeName]
  if (!garbageType) {
    console.log(`ゴミ種別「${garbageTypeName}」の設定が見つかりません`)
    return
  }

  // Discordに送信するメッセージ (embed形式)
  const message = {
    embeds: [
      {
        title: '🗑️ ゴミ出しリマインダー',
        description: `今日は **${garbageType.name}** の日です!`,
        color: garbageType.color,
        footer: {
          text: 'ゴミ出しをお忘れなく'
        }
      }
    ]
  }

  await sendDiscordWebhook(webhookUrl, message)
  console.log(`ゴミ出し通知を送信しました: ${garbageType.name}`)
}
