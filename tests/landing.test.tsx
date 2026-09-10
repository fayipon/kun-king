import { welcomeVisit } from '../src/landing/WelcomeModal'
import FrontendLayout from '../src/FrontendLayout'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { act, cleanup, fireEvent, render, screen, within } from '@testing-library/react'
import { HashRouter } from 'react-router-dom'
import Banner from '../src/landing/Banner'
import App from '../src/App'
import { favoriteKey, readFavorites } from '../src/landing/games'

let reduced = false
let motionListeners: Set<() => void>
beforeEach(() => {
  window.history.replaceState(null, "", "/#/frontend")
  reduced = false
  motionListeners = new Set()
  vi.stubGlobal('matchMedia', () => ({ get matches() { return reduced }, addEventListener: (_: string, fn: () => void) => motionListeners.add(fn), removeEventListener: (_: string, fn: () => void) => motionListeners.delete(fn) }))
  Object.defineProperty(document, 'hidden', { configurable: true, value: false })
  welcomeVisit.dismissed = true
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

describe('Lobby categories and navigation', () => {
  const mount = () => render(<HashRouter><App/></HashRouter>)
  const cards = (region: HTMLElement) => within(region).queryAllByRole('button', { name: /^View (?!all )/ }).map(e => e.getAttribute('aria-label'))
  const favorites = () => { fireEvent.click(screen.getByRole('button', { name: 'My', exact: true })); fireEvent.click(screen.getByRole('button', { name: 'Edit profile' })); fireEvent.click(screen.getByRole('link', { name: 'My Favorites', exact: true })) }
  it('keeps all five section titles and expanded game order identical to individual categories', () => {
    mount()
    const names = ['Hot', 'Perya', 'Popular', 'New', 'Feature']
    expect(within(screen.getByRole('region', { name: 'Game catalog' })).getAllByRole('region').map(e => e.getAttribute('aria-label'))).toEqual(names)
    const lists = new Map<string, (string | null)[]>()
    for (const name of names) {
      const region = screen.getByRole('region', { name, exact: true })
      const expand = within(region).queryByRole('button', { name: `View all ${name}` })
      if (expand) fireEvent.click(expand)
      lists.set(name, cards(region))
    }
    expect(lists.get('Hot')?.length).toBe(16)
    expect(lists.get('Popular')?.length).toBe(22)
    expect(lists.get('New')?.length).toBe(16)
    for (const name of names) {
      fireEvent.click(screen.getByRole('button', { name, exact: true }))
      const region = screen.getByRole('region', { name, exact: true })
      const expand = within(region).queryByRole('button', { name: `View all ${name}` })
      if (expand) fireEvent.click(expand)
      expect(cards(region)).toEqual(lists.get(name))
      expect(screen.queryByRole('button', { name: 'Open search' })).toBeNull()
      expect(screen.queryByRole('textbox')).toBeNull()
    }
    fireEvent.click(screen.getByRole('button', { name: 'Perya', exact: true }))
    expect(screen.getByText('Perya games are coming soon.')).toBeTruthy()
    fireEvent.click(dot(2)); fireEvent.click(screen.getByRole('button', { name: 'View picks' }))
    expect(screen.getByRole('button', { name: 'Popular', exact: true }).getAttribute('aria-pressed')).toBe('true')
  })
  it('opens the new navigation panels and exposes account links', () => {
    mount()
    const nav = within(screen.getByRole('navigation', { name: 'Lobby navigation' }))
    expect(nav.getAllByRole('button').map(e => e.textContent)).toEqual(['Home', 'Promo', 'Wallet', 'Affiliate', 'My'])
    fireEvent.click(nav.getByRole('button', { name: 'Promo' })); expect(location.hash).toBe('#/promo')
    fireEvent.click(nav.getByRole('button', { name:'Affiliate' }))
    expect(location.hash).toBe('#/affiliate')
    expect(screen.getByRole('heading', { name:'Reward Journey' })).toBeTruthy()
    expect(nav.getByRole('button', { name:'Affiliate' }).getAttribute('aria-current')).toBe('page')
    fireEvent.click(nav.getByRole('button', { name: 'My' }))
    fireEvent.click(screen.getByRole('button', { name: 'Edit profile' }))
    const panel = within(screen.getByRole('dialog', { name: 'Personal information' }))
    expect(panel.getByRole('link', { name: 'Log In' }).getAttribute('href')).toBe('#/login')
    expect(panel.getByRole('link', { name: 'Register' }).getAttribute('href')).toBe('#/register')
    fireEvent.click(panel.getByRole('link', { name: 'My Favorites' }))
    expect(screen.getByText('Keep your favorites close.')).toBeTruthy()
    expect(screen.queryByRole('textbox')).toBeNull()
  })
  it('preserves favorites across remount and allows removal from My', () => {
    const view = mount()
    fireEvent.click(within(screen.getByRole('region', { name: 'Hot', exact: true })).getByRole('button', { name: 'View Fortune Rabbit 2' }))
    fireEvent.click(screen.getByRole('button', { name: 'Add favorite' }))
    fireEvent.click(screen.getByRole('button', { name: 'Close game details' }))
    expect(readFavorites()).toEqual(['1999']); view.unmount(); mount(); favorites()
    fireEvent.click(screen.getByRole('button', { name: 'View Fortune Rabbit 2' }))
    fireEvent.click(screen.getByRole('button', { name: 'Remove favorite' }))
    fireEvent.click(screen.getByRole('button', { name: 'Close game details' }))
    expect(readFavorites()).toEqual([])
    expect(screen.getByText('Keep your favorites close.')).toBeTruthy()
  })
  it('ignores malformed storage and remains usable when saving is blocked', () => {
    localStorage.setItem(favoriteKey, 'invalid'); expect(readFavorites()).toEqual([])
    vi.spyOn(Storage.prototype, 'setItem').mockImplementation(() => { throw new Error('blocked') })
    mount(); expect(screen.getByRole('status').textContent).toContain('Favorites cannot be saved')
    fireEvent.click(within(screen.getByRole('region', { name: 'Hot', exact: true })).getByRole('button', { name: 'View Fortune Ox' }))
    fireEvent.click(screen.getByRole('button', { name: 'Add favorite' }))
    expect(screen.getByRole('button', { name: 'Remove favorite' })).toBeTruthy()
  })
})
