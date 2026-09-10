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
const dot = (index: number) => screen.getByRole('button', { name: `Show banner ${index}` })
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
    fireEvent.keyDown(screen.getByRole('region', { name: 'Featured banners' }), { key: 'ArrowLeft' }); active(3)
    fireEvent.keyDown(screen.getByRole('region', { name: 'Featured banners' }), { key: 'ArrowRight' }); active(1)
  })
  it('pauses for explicit pause, hover, focus, and a hidden document', () => {
    vi.useFakeTimers(); render(<Banner onExplore={() => {}} />)
    const region = screen.getByRole('region', { name: 'Featured banners' })
    fireEvent.click(screen.getByRole('button', { name: 'Pause slideshow' })); advance(10000); active(1)
    fireEvent.click(screen.getByRole('button', { name: 'Play slideshow' })); advance(5000); active(2)
    fireEvent.mouseEnter(region); advance(10000); active(2); fireEvent.mouseLeave(region)
    fireEvent.focus(dot(2)); advance(10000); active(2); fireEvent.blur(dot(2), { relatedTarget: document.body })
    Object.defineProperty(document, 'hidden', { configurable: true, value: true }); fireEvent(document, new Event('visibilitychange')); advance(10000); active(2)
    Object.defineProperty(document, 'hidden', { configurable: true, value: false }); fireEvent(document, new Event('visibilitychange')); advance(5000); active(3)
  })
  it('honors initial and changed reduced-motion preferences', () => {
    vi.useFakeTimers(); reduced = true; render(<Banner onExplore={() => {}} />)
    advance(15000); active(1); fireEvent.click(dot(3)); active(3)
    expect((screen.getByRole('button', { name: 'Pause slideshow' }) as HTMLButtonElement).disabled).toBe(true)
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
    const cta = screen.getByRole('button', { name: 'Explore games' })
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
    expect(screen.queryByRole('button', { name: 'Previous banner' })).toBeNull()
    expect(screen.queryByRole('button', { name: 'Next banner' })).toBeNull()
    expect(view.container.querySelector('.kk-slide-number')).toBeNull()
    for (const item of [3, 1, 2, 3, 1, 3]) fireEvent.click(dot(item))
    active(3); expect(view.container.querySelectorAll('article[aria-hidden="false"]').length).toBe(1)
    expect(vi.getTimerCount()).toBe(1)
  })
})

describe('Landing discovery and persistence', () => {
  const mount = () => render(<HashRouter><Landing /></HashRouter>)
  it('filters Feature searches and clears the category highlight in Favorites', () => {
    mount()
    const group = screen.getByRole('group', { name: 'Game categories' })
    for (const name of ['New', 'Popular', 'Perya', 'Feature', 'Feature']) fireEvent.click(within(group).getByRole('button', { name, exact: true }))
    expect(within(group).getByRole('button', { name: 'Feature' }).getAttribute('aria-pressed')).toBe('true')
    fireEvent.click(screen.getByRole('button', { name: 'Open search' }))
    const input = screen.getByRole('textbox', { name: 'Search games' })
    fireEvent.change(input, { target: { value: 'Fortune Ox' } })
    expect(screen.getByRole('button', { name: 'View Fortune Ox' })).toBeTruthy()
    fireEvent.change(input, { target: { value: 'Mahjong Ways' } })
    expect(screen.getByText('No games found')).toBeTruthy()
    fireEvent.click(screen.getByRole('button', { name: 'Clear search' }))
    expect(screen.getByRole('button', { name: 'View Fortune Ox' })).toBeTruthy()
    fireEvent.click(screen.getByRole('button', { name: 'Favorites', exact: true }))
    expect(group.getAttribute('data-selected')).toBe('false')
    expect(within(group).getAllByRole('button').every(button => button.getAttribute('aria-pressed') === 'false')).toBe(true)
    fireEvent.click(within(group).getByRole('button', { name: 'ALL', exact: true }))
    expect(group.getAttribute('data-selected')).toBe('true')
  })
  it('switches the six categories, recovers from Perya, and connects the banner to Popular', () => {
    mount()
    const group = within(screen.getByRole('group', { name: 'Game categories' }))
    expect(group.getAllByRole('button').map(button => button.textContent)).toEqual(['ALL', 'Hot', 'Perya', 'Popular', 'New', 'Feature'])
    expect(screen.queryByText('Your next favorite is here.')).toBeNull()
    for (const name of ['Hot', 'Popular', 'New', 'Feature']) {
      fireEvent.click(group.getByRole('button', { name, exact: true }))
      expect(group.getByRole('button', { name, exact: true }).getAttribute('aria-pressed')).toBe('true')
      expect(screen.getAllByRole('button', { name: /^View (?!all |picks$)/ }).length).toBeGreaterThan(0)
    }
    fireEvent.click(group.getByRole('button', { name: 'Perya' }))
    expect(screen.getByText('Perya games are coming soon.')).toBeTruthy()
    expect(screen.queryByRole('button', { name: 'View Fortune Rabbit 2' })).toBeNull()
    fireEvent.click(screen.getByRole('button', { name: 'Explore all games' }))
    expect(group.getByRole('button', { name: 'ALL', exact: true }).getAttribute('aria-pressed')).toBe('true')
    fireEvent.click(dot(2)); fireEvent.click(screen.getByRole('button', { name: 'View picks' }))
    expect(group.getByRole('button', { name: 'Popular', exact: true }).getAttribute('aria-pressed')).toBe('true')
    fireEvent.click(screen.getByRole('button', { name: 'Open search' }))
    fireEvent.change(screen.getByRole('textbox', { name: 'Search games' }), { target: { value: 'Mahjong Ways' } })
    expect(screen.getByText('No games found')).toBeTruthy()
    fireEvent.click(group.getByRole('button', { name: 'ALL', exact: true }))
    expect(screen.getByRole('button', { name: 'View Mahjong Ways' })).toBeTruthy()
  })
  it('filters search results, reports empty results, and restores the list', () => {
    mount(); fireEvent.click(screen.getByRole('button', { name: 'Open search' }))
    const input = screen.getByRole('textbox', { name: 'Search games' })
    fireEvent.change(input, { target: { value: 'FORTUNE' } })
    expect(screen.getAllByRole('button', { name: /^View (?!all |picks$)/ }).length).toBe(5)
    fireEvent.change(input, { target: { value: 'no-game-xyz' } })
    expect(screen.getByText('No games found')).toBeTruthy()
    fireEvent.click(screen.getByRole('button', { name: 'Clear search' }))
    expect(screen.getAllByRole('button', { name: /^View (?!all |picks$)/ }).length).toBe(18)
  })
  it('expands only the requested section and applies categories', () => {
    mount(); const hot = screen.getByRole('region', { name: 'Hot Games', exact: true })
    expect(within(hot).getAllByRole('button', { name: /^View (?!all |picks$)/ }).length).toBe(9)
    fireEvent.click(screen.getByRole('button', { name: 'View all Hot Games' }))
    expect(within(hot).getAllByRole('button', { name: /^View (?!all |picks$)/ }).length).toBe(16)
    fireEvent.click(screen.getByRole('button', { name: 'New', exact: true }))
    expect(screen.queryByRole('button', { name: 'View Fortune Rabbit 2' })).toBeNull()
    expect(screen.getByRole('button', { name: 'View Gem Saviour Sword' })).toBeTruthy()
  })
  it('saves a favorite, restores it on remount, removes it, and shows the empty state', () => {
    const view = mount(); fireEvent.click(screen.getByRole('button', { name: 'View Fortune Rabbit 2' }))
    fireEvent.click(screen.getByRole('button', { name: 'Add favorite' }))
    fireEvent.click(screen.getByRole('button', { name: 'Close game details' }))
    expect(readFavorites()).toEqual(['1999']); view.unmount(); mount()
    fireEvent.click(screen.getByRole('button', { name: 'Favorites', exact: true }))
    expect(screen.getAllByRole('button', { name: /^View (?!all |picks$)/ }).length).toBe(1)
    fireEvent.click(screen.getByRole('button', { name: 'View Fortune Rabbit 2' }))
    fireEvent.click(screen.getByRole('button', { name: 'Remove favorite' })); fireEvent.click(screen.getByRole('button', { name: 'Close game details' }))
    expect(screen.getByText('Keep your favorites close.')).toBeTruthy(); expect(readFavorites()).toEqual([])
  })
  it('ignores malformed saved data and remains usable if storage is blocked', () => {
    localStorage.setItem(favoriteKey, 'invalid-json'); expect(readFavorites()).toEqual([])
    localStorage.setItem(favoriteKey, JSON.stringify(['1999','unknown',23,'1999'])); expect(readFavorites()).toEqual(['1999'])
    vi.spyOn(Storage.prototype, 'setItem').mockImplementation(() => { throw new Error('blocked') })
    mount(); expect(screen.getByRole('status').textContent).toContain('Favorites cannot be saved')
    fireEvent.click(screen.getByRole('button', { name: 'View Fortune Ox' })); fireEvent.click(screen.getByRole('button', { name: 'Add favorite' }))
    expect(screen.getByRole('button', { name: 'Remove favorite' })).toBeTruthy()
  })
})
