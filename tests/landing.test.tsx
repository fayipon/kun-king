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
    fireEvent.keyDown(screen.getByRole('region', { name: '精選主題輪播' }), { key: 'ArrowLeft' }); active(3)
    fireEvent.keyDown(screen.getByRole('region', { name: '精選主題輪播' }), { key: 'ArrowRight' }); active(1)
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
    const pointer = { pointerId: 1, isPrimary: true, button: 0, pointerType: 'touch' }
    fireEvent.pointerDown(stage, { ...pointer, clientX: 220, clientY: 40 })
    fireEvent.pointerMove(stage, { ...pointer, clientX: 100, clientY: 45 })
    fireEvent.pointerUp(stage, pointer); active(2)
    fireEvent.pointerDown(stage, { ...pointer, clientX: 100, clientY: 40 })
    fireEvent.pointerMove(stage, { ...pointer, clientX: 160, clientY: 160 })
    fireEvent.pointerUp(stage, pointer); active(2)
    fireEvent.pointerDown(stage, { ...pointer, clientX: 100, clientY: 40 })
    fireEvent.pointerMove(stage, { ...pointer, clientX: 220, clientY: 42 })
    fireEvent.pointerUp(stage, pointer); active(1)
  })
  it('follows mouse dragging, rebounds short gestures, and suppresses accidental CTA clicks', () => {
    const explore = vi.fn()
    const view = render(<Banner onExplore={explore} />)
    const stage = view.container.querySelector('.kk-banner-stage')!
    const pointer = { pointerId: 2, isPrimary: true, button: 0, pointerType: 'mouse' }
    const cta = screen.getByRole('button', { name: '探索遊戲' })
    fireEvent.pointerDown(cta, { ...pointer, clientX: 100, clientY: 80 })
    fireEvent.pointerMove(stage, { ...pointer, clientX: 125, clientY: 82 })
    expect((view.container.querySelector('.is-active') as HTMLElement).style.getPropertyValue('--drag-x')).toBe('25px')
    fireEvent.pointerUp(stage, pointer); active(1)
    expect((view.container.querySelector('.is-active') as HTMLElement).style.getPropertyValue('--drag-x')).toBe('0px')
    fireEvent.click(cta); expect(explore).not.toHaveBeenCalled()
    fireEvent.pointerDown(cta, { ...pointer, clientX: 100, clientY: 80 }); fireEvent.pointerUp(stage, pointer)
    fireEvent.click(cta); expect(explore).toHaveBeenCalledWith(0)
  })
  it('cancels interrupted gestures and restarts one timer without changing slides', () => {
    vi.useFakeTimers()
    const view = render(<Banner onExplore={() => {}} />)
    const stage = view.container.querySelector('.kk-banner-stage')!
    const pointer = { pointerId: 3, isPrimary: true, button: 0 }
    fireEvent.pointerDown(stage, { ...pointer, clientX: 220, clientY: 50 })
    fireEvent.pointerMove(stage, { ...pointer, clientX: 100, clientY: 50 })
    advance(10000); active(1)
    fireEvent.pointerCancel(stage, pointer); active(1)
    advance(5000); active(2)
    fireEvent.pointerDown(stage, { ...pointer, clientX: 220, clientY: 50 })
    fireEvent.pointerMove(stage, { ...pointer, clientX: 100, clientY: 50 })
    fireEvent(window, new Event('blur')); active(2)
    expect(vi.getTimerCount()).toBe(1)
    advance(5000); active(3)
  })
  it('keeps controls minimal and handles rapid selection with one active slide', () => {
    vi.useFakeTimers()
    const view = render(<Banner onExplore={() => {}} />)
    expect(screen.queryByRole('button', { name: '上一張 Banner' })).toBeNull()
    expect(screen.queryByRole('button', { name: '下一張 Banner' })).toBeNull()
    expect(view.container.querySelector('.kk-slide-number')).toBeNull()
    for (const item of [3, 1, 2, 3, 1, 3]) fireEvent.click(dot(item))
    active(3); expect(view.container.querySelectorAll('article[aria-hidden="false"]').length).toBe(1)
    expect(vi.getTimerCount()).toBe(1)
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
