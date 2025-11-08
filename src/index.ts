import { Hono } from 'hono'
import { sendGarbageNotification } from './notification'

type Bindings = {
  DISCORD_WEBHOOK_URL: string
}

const app = new Hono<{ Bindings: Bindings }>()

const scheduled: ExportedHandlerScheduledHandler<Bindings> = async (event, env, ctx) => {
  ctx.waitUntil(sendGarbageNotification(env.DISCORD_WEBHOOK_URL))
}

export default {
  fetch: app.fetch,
  scheduled
}
