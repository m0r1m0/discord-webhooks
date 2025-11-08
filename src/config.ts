// ゴミ種別の定義
export type GarbageType = {
  name: string
  color: number
}

// ゴミ種別ごとの色設定
export const garbageTypes: Record<string, GarbageType> = {
  '燃えるゴミ': { name: '燃えるゴミ', color: 0xFF6B6B },           // 赤系
  '燃えないゴミ': { name: '燃えないゴミ', color: 0x4ECDC4 },       // 青緑系
  '空きビン・ペットボトル': { name: '空きビン・ペットボトル', color: 0x95E1D3 }, // 緑系
}

// スケジュールの定義
export type GarbageScheduleRule = {
  dayOfWeek: number  // 0: 日曜日, 1: 月曜日, ..., 6: 土曜日
  weekOfMonth?: number  // 1: 第1週, 2: 第2週, 3: 第3週, 4: 第4週 (指定なしの場合は毎週)
  garbageType: string
}

// 福岡市城南区鳥飼7丁目のゴミ収集スケジュール
export const garbageSchedule: GarbageScheduleRule[] = [
  { dayOfWeek: 0, garbageType: '燃えるゴミ' },                  // 日曜日: 燃えるゴミ
  { dayOfWeek: 3, garbageType: '燃えるゴミ' },                  // 水曜日: 燃えるゴミ
  { dayOfWeek: 1, weekOfMonth: 2, garbageType: '空きビン・ペットボトル' }, // 第2月曜日: 空きビン・ペットボトル
  { dayOfWeek: 1, weekOfMonth: 4, garbageType: '燃えないゴミ' }, // 第4月曜日: 燃えないゴミ
]
