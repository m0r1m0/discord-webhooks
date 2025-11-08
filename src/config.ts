// ゴミ種別の定義
export type GarbageType = {
  name: string
  color: number
}

// スケジュールの定義
export type GarbageScheduleRule = {
  dayOfWeek: number  // 0: 日曜日, 1: 月曜日, ..., 6: 土曜日
  weekOfMonth?: number  // 1: 第1週, 2: 第2週, 3: 第3週, 4: 第4週 (指定なしの場合は毎週)
  garbageType: string
}

// 統合されたゴミ収集設定
// 福岡市城南区鳥飼7丁目のゴミ収集スケジュール
const garbageScheduleConfig = [
  {
    type: '燃えるゴミ',
    color: 0xFF6B6B,  // 赤系
    schedule: [
      { dayOfWeek: 0 },  // 日曜日
      { dayOfWeek: 3 },  // 水曜日
    ]
  },
  {
    type: '燃えないゴミ',
    color: 0x4ECDC4,  // 青緑系
    schedule: [
      { dayOfWeek: 1, weekOfMonth: 4 },  // 第4月曜日
    ]
  },
  {
    type: '空きビン・ペットボトル',
    color: 0x95E1D3,  // 緑系
    schedule: [
      { dayOfWeek: 1, weekOfMonth: 2 },  // 第2月曜日
    ]
  },
] as const

// garbageScheduleConfigから自動生成
export const garbageTypes: Record<string, GarbageType> = Object.fromEntries(
  garbageScheduleConfig.map(config => [
    config.type,
    { name: config.type, color: config.color }
  ])
)

// garbageScheduleConfigから自動生成
export const garbageSchedule: GarbageScheduleRule[] = garbageScheduleConfig.flatMap(
  config => config.schedule.map(schedule => ({
    ...schedule,
    garbageType: config.type
  }))
)
