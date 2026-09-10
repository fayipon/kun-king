import { beforeEach, afterEach, it, expect, vi } from 'vitest'
import { render, screen, fireEvent, within, cleanup } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import App from '../src/App'
beforeEach(() => {
  vi.stubGlobal('matchMedia', () => ({ matches: false, addEventListener: vi.fn(), removeEventListener: vi.fn() }))
  window.scrollTo = vi.fn(); Element.prototype.scrollIntoView = vi.fn()
  sessionStorage.setItem('kun-king:welcome-dismissed:v1', 'yes')
  HTMLDialogElement.prototype.showModal = function () { this.setAttribute('open', '') }
  HTMLDialogElement.prototype.close = function () { this.removeAttribute('open') }
})
afterEach(() => { cleanup(); vi.restoreAllMocks(); vi.unstubAllGlobals() })
const mount = (path = '/promo') => render(<MemoryRouter initialEntries={[path]}><App /></MemoryRouter>)
it('routes from lobby to Promo and back and supports direct Promo entry', () => {
  mount('/frontend'); fireEvent.click(within(screen.getByRole('navigation', { name: 'Lobby navigation' })).getByRole('button', { name: 'Promo' }))
  expect(screen.getByRole('heading', { name: 'Featured Promotions' })).toBeTruthy()
  expect(screen.queryByRole('dialog')).toBeNull()
  expect(screen.getByRole('link', { name: 'Promo', exact: true }).getAttribute('aria-current')).toBe('page')
  fireEvent.click(screen.getByRole('link', { name: 'Home', exact: true }))
  expect(screen.getByRole('region', { name: 'Game catalog' })).toBeTruthy()
})
it('opens each activity, restores focus and unlocks scrolling on close', () => {
  mount(); const section = within(screen.getByRole('region', { name: 'Featured Promotions' }))
  for (const label of ['Claim Now', 'Join Now', 'View Details', 'Invite Now']) {
    const trigger = section.getByRole('button', { name: label }); trigger.focus(); fireEvent.click(trigger)
    expect(document.body.style.overflow).toBe('hidden')
    expect(within(screen.getByRole('dialog')).getByText('Preview only. No rewards can be claimed.')).toBeTruthy()
    fireEvent(screen.getByRole('dialog'), new Event('cancel', { cancelable: true }))
    expect(document.body.style.overflow).not.toBe('hidden'); expect(document.activeElement).toBe(trigger)
  }
})
it('shows full promotion and mission lists, navigates detail within the same dialog', () => {
  mount(); fireEvent.click(screen.getByRole('button', { name: 'Explore All' }))
  fireEvent.click(within(screen.getByRole('dialog')).getByRole('button', { name: 'Lucky Spin' }))
  expect(screen.getByRole('dialog', { name: 'Lucky Spin' })).toBeTruthy()
  fireEvent.click(screen.getByRole('button', { name: 'Close promotion panel' }))
  fireEvent.click(within(screen.getByRole('region', { name: 'My Missions' })).getByRole('button', { name: 'View all' }))
  expect(screen.getByRole('dialog', { name: 'All Missions' })).toBeTruthy()
  fireEvent.click(screen.getByRole('dialog')); expect(screen.queryByRole('dialog')).toBeNull()
})
it('keeps demo rewards unchanged and routes Go Play to catalog', () => {
  mount(); const progress = screen.getByRole('progressbar', { name: 'Deposit once demo progress' })
  fireEvent.click(screen.getByRole('button', { name: 'Claim', exact: true }))
  expect(screen.getByText(/This is demo progress/)).toBeTruthy(); expect(progress.getAttribute('value')).toBe('1')
  fireEvent.click(screen.getByRole('button', { name: 'Close promotion panel' }))
  fireEvent.click(screen.getByRole('link', { name: 'Go Play' })); expect(screen.getByRole('region', { name: 'Game catalog' })).toBeTruthy()
})
it('uses Promo content when switching banners and cleans up dialog before login', () => {
  mount(); fireEvent.click(screen.getByRole('button', { name: 'Show banner 3' }))
  const banner = within(screen.getByRole('region', { name: 'Featured banners' }))
  fireEvent.click(banner.getByRole('button', { name: 'Join Now' }))
  expect(screen.getByRole('dialog', { name: 'Lucky Spin' })).toBeTruthy()
  fireEvent.click(within(screen.getByRole('dialog')).getByRole('link', { name: 'Log In' }))
  expect(screen.getByRole('heading', { name: 'Welcome back' })).toBeTruthy(); expect(document.body.style.overflow).not.toBe('hidden')
})
