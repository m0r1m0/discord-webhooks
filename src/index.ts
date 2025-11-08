import { Hono } from 'hono'
import { handleGarbageCollection } from './handlers/garbage-collection'

const app = new Hono<{ Bindings: CloudflareBindings }>()

/**
 * Cron trigger ハンドラー
 * 各cron式に対応する処理を振り分ける
 */
const scheduled: ExportedHandlerScheduledHandler<CloudflareBindings> = async (controller, env, ctx) => {
  switch (controller.cron) {
    case "0 1 * * *":  // 毎日午前1時 - ゴミ出し通知
      ctx.waitUntil(handleGarbageCollection(env.DISCORD_WEBHOOK_URL))
      break

    default:
      console.log(`未定義のcron trigger: ${controller.cron}`)
      break
  }
}

export default {
  fetch: app.fetch,
  scheduled
}
