import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { getWeekOfMonth, getGarbageTypeForDate, handleGarbageCollection } from './handler'

describe('getWeekOfMonth', () => {
  it('月の第1週を正しく計算する', () => {
    // 2025年1月1日(水曜日) - 第1週
    const date = new Date(2025, 0, 1)
    expect(getWeekOfMonth(date)).toBe(1)
  })

  it('月の第2週を正しく計算する', () => {
    // 2025年1月8日(水曜日) - 第2週
    const date = new Date(2025, 0, 8)
    expect(getWeekOfMonth(date)).toBe(2)
  })

  it('月の第3週を正しく計算する', () => {
    // 2025年1月15日(水曜日) - 第3週
    const date = new Date(2025, 0, 15)
    expect(getWeekOfMonth(date)).toBe(3)
  })

  it('月の第4週を正しく計算する', () => {
    // 2025年1月22日(水曜日) - 第4週
    const date = new Date(2025, 0, 22)
    expect(getWeekOfMonth(date)).toBe(4)
  })

  it('月の第5週を正しく計算する', () => {
    // 2025年1月29日(水曜日) - 第5週
    const date = new Date(2025, 0, 29)
    expect(getWeekOfMonth(date)).toBe(5)
  })

  it('月初が日曜日の場合を正しく計算する', () => {
    // 2025年6月1日(日曜日) - 第1週
    const date = new Date(2025, 5, 1)
    expect(getWeekOfMonth(date)).toBe(1)
  })

  it('月初が土曜日の場合を正しく計算する', () => {
    // 2025年2月1日(土曜日) - 第1週
    const date = new Date(2025, 1, 1)
    expect(getWeekOfMonth(date)).toBe(1)
  })
})

describe('getGarbageTypeForDate', () => {
  it('日曜日に燃えるゴミを返す', () => {
    // 2025年1月5日(日曜日)
    const date = new Date(2025, 0, 5)
    expect(getGarbageTypeForDate(date)).toBe('燃えるゴミ')
  })

  it('水曜日に燃えるゴミを返す', () => {
    // 2025年1月1日(水曜日)
    const date = new Date(2025, 0, 1)
    expect(getGarbageTypeForDate(date)).toBe('燃えるゴミ')
  })

  it('第2月曜日に空きビン・ペットボトルを返す', () => {
    // 2025年1月13日(第2月曜日)
    const date = new Date(2025, 0, 13)
    expect(getGarbageTypeForDate(date)).toBe('空きビン・ペットボトル')
  })

  it('第4月曜日に燃えないゴミを返す', () => {
    // 2025年1月27日(第4月曜日)
    const date = new Date(2025, 0, 27)
    expect(getGarbageTypeForDate(date)).toBe('燃えないゴミ')
  })

  it('第1月曜日にnullを返す(収集日でない)', () => {
    // 2025年1月6日(第1月曜日)
    const date = new Date(2025, 0, 6)
    expect(getGarbageTypeForDate(date)).toBeNull()
  })

  it('第3月曜日にnullを返す(収集日でない)', () => {
    // 2025年1月20日(第3月曜日)
    const date = new Date(2025, 0, 20)
    expect(getGarbageTypeForDate(date)).toBeNull()
  })

  it('火曜日にnullを返す(収集日でない)', () => {
    // 2025年1月7日(火曜日)
    const date = new Date(2025, 0, 7)
    expect(getGarbageTypeForDate(date)).toBeNull()
  })

  it('木曜日にnullを返す(収集日でない)', () => {
    // 2025年1月2日(木曜日)
    const date = new Date(2025, 0, 2)
    expect(getGarbageTypeForDate(date)).toBeNull()
  })

  it('金曜日にnullを返す(収集日でない)', () => {
    // 2025年1月3日(金曜日)
    const date = new Date(2025, 0, 3)
    expect(getGarbageTypeForDate(date)).toBeNull()
  })

  it('土曜日にnullを返す(収集日でない)', () => {
    // 2025年1月4日(土曜日)
    const date = new Date(2025, 0, 4)
    expect(getGarbageTypeForDate(date)).toBeNull()
  })
})

describe('handleGarbageCollection', () => {
  const mockWebhookUrl = 'https://discord.com/api/webhooks/test'

  beforeEach(() => {
    // fetchをモック
    globalThis.fetch = vi.fn()
    // console.logをモック
    vi.spyOn(console, 'log').mockImplementation(() => {})
  })

  afterEach(() => {
    vi.restoreAllMocks()
  })

  it('燃えるゴミの日に正しいメッセージを送信する', async () => {
    // Date をモックして日曜日に設定
    vi.useFakeTimers()
    vi.setSystemTime(new Date(2025, 0, 5)) // 2025年1月5日(日曜日)

    const mockFetch = globalThis.fetch as ReturnType<typeof vi.fn>
    mockFetch.mockResolvedValueOnce({
      ok: true,
      status: 200,
      statusText: 'OK',
    } as Response)

    await handleGarbageCollection(mockWebhookUrl)

    expect(mockFetch).toHaveBeenCalledWith(
      mockWebhookUrl,
      expect.objectContaining({
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: expect.stringContaining('燃えるゴミ'),
      })
    )

    const callArgs = mockFetch.mock.calls[0]
    const body = JSON.parse(callArgs[1].body)
    expect(body.embeds[0].title).toBe('🗑️ ゴミ出しリマインダー')
    expect(body.embeds[0].description).toContain('燃えるゴミ')
    expect(body.embeds[0].color).toBe(0xFF6B6B)

    vi.useRealTimers()
  })

  it('空きビン・ペットボトルの日に正しいメッセージを送信する', async () => {
    vi.useFakeTimers()
    vi.setSystemTime(new Date(2025, 0, 13)) // 2025年1月13日(第2月曜日)

    const mockFetch = globalThis.fetch as ReturnType<typeof vi.fn>
    mockFetch.mockResolvedValueOnce({
      ok: true,
      status: 200,
      statusText: 'OK',
    } as Response)

    await handleGarbageCollection(mockWebhookUrl)

    const callArgs = mockFetch.mock.calls[0]
    const body = JSON.parse(callArgs[1].body)
    expect(body.embeds[0].description).toContain('空きビン・ペットボトル')
    expect(body.embeds[0].color).toBe(0x95E1D3)

    vi.useRealTimers()
  })

  it('燃えないゴミの日に正しいメッセージを送信する', async () => {
    vi.useFakeTimers()
    vi.setSystemTime(new Date(2025, 0, 27)) // 2025年1月27日(第4月曜日)

    const mockFetch = globalThis.fetch as ReturnType<typeof vi.fn>
    mockFetch.mockResolvedValueOnce({
      ok: true,
      status: 200,
      statusText: 'OK',
    } as Response)

    await handleGarbageCollection(mockWebhookUrl)

    const callArgs = mockFetch.mock.calls[0]
    const body = JSON.parse(callArgs[1].body)
    expect(body.embeds[0].description).toContain('燃えないゴミ')
    expect(body.embeds[0].color).toBe(0x4ECDC4)

    vi.useRealTimers()
  })

  it('収集日でない場合はメッセージを送信しない', async () => {
    vi.useFakeTimers()
    vi.setSystemTime(new Date(2025, 0, 7)) // 2025年1月7日(火曜日 - 収集日でない)

    const mockFetch = globalThis.fetch as ReturnType<typeof vi.fn>

    await handleGarbageCollection(mockWebhookUrl)

    expect(mockFetch).not.toHaveBeenCalled()
    expect(console.log).toHaveBeenCalledWith(
      expect.stringContaining('ゴミ出しは設定されていません')
    )

    vi.useRealTimers()
  })

  it('Discord APIがエラーを返した場合は例外をスローする', async () => {
    vi.useFakeTimers()
    vi.setSystemTime(new Date(2025, 0, 5)) // 2025年1月5日(日曜日)

    const mockFetch = globalThis.fetch as ReturnType<typeof vi.fn>
    mockFetch.mockResolvedValueOnce({
      ok: false,
      status: 500,
      statusText: 'Internal Server Error',
    } as Response)

    await expect(handleGarbageCollection(mockWebhookUrl)).rejects.toThrow(
      'Discord通知の送信に失敗しました: 500 Internal Server Error'
    )

    vi.useRealTimers()
  })
})
