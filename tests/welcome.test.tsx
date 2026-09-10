import { afterEach, beforeEach, expect, it, vi } from 'vitest'
import { cleanup, fireEvent, render, screen } from '@testing-library/react'
import { MemoryRouter, Route, Routes } from 'react-router-dom'
import WelcomeModal, { welcomeKey } from '../src/landing/WelcomeModal'

beforeEach(() => {
  sessionStorage.clear()
  document.body.style.overflow = 'auto'
  HTMLDialogElement.prototype.showModal = function () { this.setAttribute('open', '') }
  HTMLDialogElement.prototype.close = function () { this.removeAttribute('open') }
})
afterEach(() => { cleanup(); vi.restoreAllMocks(); sessionStorage.clear() })
const mount = () => render(<MemoryRouter><Routes><Route path="/" element={<WelcomeModal />} /><Route path="/register" element={<h1>Registration page</h1>} /></Routes></MemoryRouter>)
it('welcomes once per session, restores scrolling, and allows reopening', () => {
  const view = mount()
  expect(screen.getByRole('dialog', { name: /Welcome Rewards/ })).toBeTruthy()
  expect(document.body.style.overflow).toBe('hidden')
  fireEvent.click(screen.getByRole('button', { name: 'Maybe Later' }))
  expect(document.body.style.overflow).toBe('auto')
  expect(sessionStorage.getItem(welcomeKey)).toBe('yes')
  view.unmount(); mount()
  expect(screen.queryByRole('dialog')).toBeNull()
  const trigger = screen.getByRole('button', { name: 'Welcome Rewards', exact: true })
  fireEvent.click(trigger)
  fireEvent.click(screen.getByRole('button', { name: 'Close welcome' }))
  expect(document.activeElement).toBe(trigger)
})
it('supports Escape and backdrop dismissal but does not close on content clicks', () => {
  mount()
  fireEvent.click(screen.getByText('Free Spins'))
  expect(screen.getByRole('dialog')).toBeTruthy()
  fireEvent(screen.getByRole('dialog'), new Event('cancel', { cancelable: true }))
  expect(screen.queryByRole('dialog')).toBeNull()
  fireEvent.click(screen.getByRole('button', { name: 'Welcome Rewards', exact: true }))
  fireEvent.click(screen.getByRole('dialog'))
  expect(screen.queryByRole('dialog')).toBeNull()
})
it('opens registration and cleans up the scroll lock', () => {
  mount()
  fireEvent.click(screen.getByRole('link', { name: 'Create Account' }))
  expect(screen.getByRole('heading', { name: 'Registration page' })).toBeTruthy()
  expect(document.body.style.overflow).toBe('auto')
  expect(sessionStorage.getItem(welcomeKey)).toBe('yes')
})
it('remains dismissible with unavailable session storage and cleans up on unmount', () => {
  vi.spyOn(Storage.prototype, 'getItem').mockImplementation(() => { throw new Error('blocked') })
  vi.spyOn(Storage.prototype, 'setItem').mockImplementation(() => { throw new Error('blocked') })
  const view = mount()
  fireEvent.click(screen.getByRole('button', { name: 'Maybe Later' }))
  expect(screen.queryByRole('dialog')).toBeNull()
  fireEvent.click(screen.getByRole('button', { name: 'Welcome Rewards', exact: true }))
  view.unmount()
  expect(document.body.style.overflow).toBe('auto')
})
