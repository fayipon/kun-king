import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { act, cleanup, fireEvent, render, screen, within } from '@testing-library/react'
import { HashRouter } from 'react-router-dom'
import Banner from '../src/landing/Banner'
import Landing from '../src/landing/Landing'
import { favoriteKey, readFavorites } from '../src/landing/games'

let reduced = false
let motionListeners: Set<() => void>
beforeEach(() => {
  reduced = false
  motionListeners = new Set()
  vi.stubGlobal('matchMedia', () => ({ get matches() { return reduced }, addEventListener: (_: string, fn: () => void) => motionListeners.add(fn), removeEventListener: (_: string, fn: () => void) => motionListeners.delete(fn) }))
  Object.defineProperty(document, 'hidden', { configurable: true, value: false })
  localStorage.clear()
  Element.prototype.scrollIntoView = vi.fn()
  window.scrollTo = vi.fn()
  HTMLDialogElement.prototype.showModal = function () { this.setAttribute('open', '') }
  HTMLDialogElement.prototype.close = function () { this.removeAttribute('open') }
})
afterEach(() => { cleanup(); vi.useRealTimers(); vi.restoreAllMocks(); vi.unstubAllGlobals() })
const dot = (index: number) => screen.getByRole('button', { name: `顯示第 ${index} 張 Banner` })
const active = (index: number) => expect(dot(index).getAttribute('aria-pressed')).toBe('true')
const advance = (ms: number) => act(() => { vi.advanceTimersByTime(ms) })

describe('Banner behavior', () => {
  it('cycles across all three slides and cleans its timer when unmounted', () => {
    vi.useFakeTimers()
    const view = render(<Banner onExplore={() => {}} />)
    active(1); advance(5000); active(2); advance(5000); active(3); advance(5000); active(1)
    view.unmount(); expect(vi.getTimerCount()).toBe(0)
  })
  it('resets timing after manual selection and wraps previous/next', () => {
    vi.useFakeTimers(); render(<Banner onExplore={() => {}} />)
    advance(4000); fireEvent.click(dot(3)); advance(1000); active(3)
    advance(4000); active(1)
    fireEvent.click(screen.getByRole('button', { name: '上一張 Banner' })); active(3)
    fireEvent.click(screen.getByRole('button', { name: '下一張 Banner' })); active(1)
  })
  it('pauses for explicit pause, hover, focus, and a hidden document', () => {
    vi.useFakeTimers(); render(<Banner onExplore={() => {}} />)
    const region = screen.getByRole('region', { name: '精選主題輪播' })
    fireEvent.click(screen.getByRole('button', { name: '暫停輪播' })); advance(10000); active(1)
    fireEvent.click(screen.getByRole('button', { name: '播放輪播' })); advance(5000); active(2)
    fireEvent.mouseEnter(region); advance(10000); active(2); fireEvent.mouseLeave(region)
    fireEvent.focus(dot(2)); advance(10000); active(2); fireEvent.blur(dot(2), { relatedTarget: document.body })
    Object.defineProperty(document, 'hidden', { configurable: true, value: true }); fireEvent(document, new Event('visibilitychange')); advance(10000); active(2)
    Object.defineProperty(document, 'hidden', { configurable: true, value: false }); fireEvent(document, new Event('visibilitychange')); advance(5000); active(3)
  })
  it('honors initial and changed reduced-motion preferences', () => {
    vi.useFakeTimers(); reduced = true; render(<Banner onExplore={() => {}} />)
    advance(15000); active(1); fireEvent.click(dot(3)); active(3)
    expect((screen.getByRole('button', { name: '暫停輪播' }) as HTMLButtonElement).disabled).toBe(true)
    act(() => { reduced = false; motionListeners.forEach(fn => fn()) }); advance(5000); active(1)
    act(() => { reduced = true; motionListeners.forEach(fn => fn()) }); advance(10000); active(1)
  })
  it('responds to horizontal swipes without treating vertical scrolling as a swipe', () => {
    const view = render(<Banner onExplore={() => {}} />)
    const stage = view.container.querySelector('.kk-banner-stage')!
    fireEvent.touchStart(stage, { touches: [{ clientX: 220, clientY: 40 }] })
    fireEvent.touchEnd(stage, { changedTouches: [{ clientX: 100, clientY: 45 }] }); active(2)
    fireEvent.touchStart(stage, { touches: [{ clientX: 100, clientY: 40 }] })
    fireEvent.touchEnd(stage, { changedTouches: [{ clientX: 160, clientY: 160 }] }); active(2)
    fireEvent.touchStart(stage, { touches: [{ clientX: 100, clientY: 40 }] })
    fireEvent.touchEnd(stage, { changedTouches: [{ clientX: 220, clientY: 42 }] }); active(1)
  })
})

describe('Landing discovery and persistence', () => {
  const mount = () => render(<HashRouter><Landing /></HashRouter>)
  it('filters search results, reports empty results, and restores the list', () => {
    mount(); fireEvent.click(screen.getByRole('button', { name: '開啟搜尋' }))
    const input = screen.getByRole('textbox', { name: '搜尋遊戲名稱' })
    fireEvent.change(input, { target: { value: 'FORTUNE' } })
    expect(screen.getAllByRole('button', { name: /^查看 / }).length).toBe(5)
    fireEvent.change(input, { target: { value: 'no-game-xyz' } })
    expect(screen.getByText('還沒找到符合的遊戲')).toBeTruthy()
    fireEvent.click(screen.getByRole('button', { name: '清除搜尋' }))
    expect(screen.getAllByRole('button', { name: /^查看 / }).length).toBe(18)
  })
  it('expands only the requested section and applies categories', () => {
    mount(); const hot = screen.getByRole('region', { name: '人氣精選', exact: true })
    expect(within(hot).getAllByRole('button', { name: /^查看 / }).length).toBe(9)
    fireEvent.click(screen.getByRole('button', { name: '查看全部人氣精選' }))
    expect(within(hot).getAllByRole('button', { name: /^查看 / }).length).toBe(16)
    fireEvent.click(screen.getByRole('button', { name: '新作探索', exact: true }))
    expect(screen.queryByRole('button', { name: '查看 Fortune Rabbit 2' })).toBeNull()
    expect(screen.getByRole('button', { name: '查看 Gem Saviour Sword' })).toBeTruthy()
  })
  it('saves a favorite, restores it on remount, removes it, and shows the empty state', () => {
    const view = mount(); fireEvent.click(screen.getByRole('button', { name: '查看 Fortune Rabbit 2' }))
    fireEvent.click(screen.getByRole('button', { name: '加入收藏' }))
    fireEvent.click(screen.getByRole('button', { name: '關閉遊戲資訊' }))
    expect(readFavorites()).toEqual(['1999']); view.unmount(); mount()
    fireEvent.click(screen.getByRole('button', { name: '收藏', exact: true }))
    expect(screen.getAllByRole('button', { name: /^查看 / }).length).toBe(1)
    fireEvent.click(screen.getByRole('button', { name: '查看 Fortune Rabbit 2' }))
    fireEvent.click(screen.getByRole('button', { name: '移除收藏' })); fireEvent.click(screen.getByRole('button', { name: '關閉遊戲資訊' }))
    expect(screen.getByText('把喜歡的，留在這裡。')).toBeTruthy(); expect(readFavorites()).toEqual([])
  })
  it('ignores malformed saved data and remains usable if storage is blocked', () => {
    localStorage.setItem(favoriteKey, 'invalid-json'); expect(readFavorites()).toEqual([])
    localStorage.setItem(favoriteKey, JSON.stringify(['1999','unknown',23,'1999'])); expect(readFavorites()).toEqual(['1999'])
    vi.spyOn(Storage.prototype, 'setItem').mockImplementation(() => { throw new Error('blocked') })
    mount(); expect(screen.getByRole('status').textContent).toContain('無法保存收藏')
    fireEvent.click(screen.getByRole('button', { name: '查看 Fortune Ox' })); fireEvent.click(screen.getByRole('button', { name: '加入收藏' }))
    expect(screen.getByRole('button', { name: '移除收藏' })).toBeTruthy()
  })
})
