# Discord Webhooks

Cloudflare Workers上で動作する、Discord通知システムです。Cron Triggerを使って定期的にDiscordへ通知を送信します。

## セットアップ

```bash
npm install
npm run dev
```

## デプロイ

```bash
npm run deploy
```

## 型生成

[Workerの設定に基づいて型を生成/同期する](https://developers.cloudflare.com/workers/wrangler/commands/#types):

```bash
npm run cf-typegen
```

Honoのインスタンス化時に`CloudflareBindings`をジェネリクスとして渡す:

```ts
// src/index.ts
const app = new Hono<{ Bindings: CloudflareBindings }>()
```

## プロジェクト構成

```
src/
├── index.ts                                    # Cron triggerのルーティング
├── handlers/                                   # 各機能のハンドラー
│   └── garbage-collection/                     # ゴミ出し通知機能
│       ├── index.ts                            # エクスポート
│       ├── handler.ts                          # メインロジック
│       ├── config.ts                           # スケジュール設定
│       └── handler.test.ts                     # テスト
└── utils/                                      # 共通ユーティリティ
    └── discord.ts                              # Discord Webhook送信の共通処理
```

## 新機能の追加方法

新しいCron Trigger機能を追加する手順:

### 1. ハンドラーフォルダの作成

`src/handlers/` 配下に新しい機能用のフォルダを作成します。

```bash
mkdir -p src/handlers/your-feature
```

### 2. ハンドラーの実装

機能に応じて以下のファイルを作成:

**src/handlers/your-feature/handler.ts** (必須)
```ts
import { sendDiscordWebhook } from '../../utils/discord'

export async function handleYourFeature(webhookUrl: string): Promise<void> {
  const message = {
    embeds: [{
      title: '通知タイトル',
      description: '通知内容',
      color: 0x5865F2,
    }]
  }

  await sendDiscordWebhook(webhookUrl, message)
}
```

**src/handlers/your-feature/index.ts** (必須)
```ts
export { handleYourFeature } from './handler'
```

**src/handlers/your-feature/config.ts** (設定が必要な場合のみ)
```ts
export const yourConfig = {
  // 設定内容
}
```

**src/handlers/your-feature/handler.test.ts** (推奨)
```ts
import { describe, it, expect } from 'vitest'
import { handleYourFeature } from './handler'

describe('handleYourFeature', () => {
  it('should work correctly', async () => {
    // テスト実装
  })
})
```

### 3. Cron Triggerの設定

**wrangler.jsonc** にcron式を追加:

```jsonc
{
  "triggers": {
    "crons": [
      "0 1 * * *",  // 既存: ゴミ出し通知
      "0 7 * * *"   // 新規: あなたの機能
    ]
  }
}
```

### 4. ルーティングの追加

**src/index.ts** のswitch文に新しいcaseを追加:

```ts
import { handleYourFeature } from './handlers/your-feature'

const scheduled: ExportedHandlerScheduledHandler<CloudflareBindings> = async (controller, env, ctx) => {
  switch (controller.cron) {
    case "0 1 * * *":
      ctx.waitUntil(handleGarbageCollection(env.DISCORD_WEBHOOK_URL))
      break

    case "0 7 * * *":  // 新規追加
      ctx.waitUntil(handleYourFeature(env.YOUR_WEBHOOK_URL))
      break

    default:
      console.log(`未定義のcron trigger: ${controller.cron}`)
      break
  }
}
```

### 5. 環境変数の設定 (必要な場合)

新しいWebhook URLなどが必要な場合は、`.dev.vars` ファイルに追加:

```
DISCORD_WEBHOOK_URL=https://discord.com/api/webhooks/...
YOUR_WEBHOOK_URL=https://discord.com/api/webhooks/...
```

本番環境へは以下のコマンドでシークレットを設定:

```bash
npm run set-secrets
```

### 6. テストの実行

```bash
npm test
```

## 既存機能

### ゴミ出し通知 (garbage-collection)

- **Cron**: 毎日午前1時 (`0 1 * * *`)
- **説明**: 福岡市城南区鳥飼7丁目のゴミ収集スケジュールに基づいて、その日のゴミ出し情報をDiscordに通知
- **環境変数**: `DISCORD_WEBHOOK_URL`
