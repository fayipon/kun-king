import { afterEach, beforeEach, expect, it, vi } from 'vitest'
import { cleanup, fireEvent, render, screen } from '@testing-library/react'
import { MemoryRouter, Route, Routes } from 'react-router-dom'
import WelcomeModal, { welcomeVisit } from '../src/landing/WelcomeModal'

beforeEach(() => {
  welcomeVisit.dismissed = false
  sessionStorage.clear()
  document.body.style.overflow = 'auto'
  HTMLDialogElement.prototype.showModal = function () { this.setAttribute('open', '') }
  HTMLDialogElement.prototype.close = function () { this.removeAttribute('open') }
})
afterEach(() => { cleanup(); vi.restoreAllMocks(); sessionStorage.clear() })
const mount = () => render(<MemoryRouter><Routes><Route path="/" element={<WelcomeModal />} /><Route path="/register" element={<h1>Registration page</h1>} /></Routes></MemoryRouter>)
it.each(['Close welcome', 'Maybe Later', 'Escape', 'backdrop'])('does not force focus onto the logo after automatic welcome: %s', action => {
  const logo = document.createElement('a')
  logo.className = 'kk-logo'
  logo.href = '#/frontend'
  document.body.append(logo)
  const focus = vi.spyOn(logo, 'focus')
  try {
    mount()
    if (action === 'Escape') fireEvent(screen.getByRole('dialog'), new Event('cancel', { cancelable: true }))
    else if (action === 'backdrop') fireEvent.click(screen.getByRole('dialog'))
    else fireEvent.click(screen.getByRole('button', { name: action }))
    expect(screen.queryByRole('dialog')).toBeNull()
    expect(focus).not.toHaveBeenCalled()
    expect(document.body.style.overflow).toBe('auto')
  } finally { logo.remove() }
})
it('welcomes once per document load, restores scrolling, and allows reopening', () => {
  const view = mount()
  expect(screen.getByRole('dialog', { name: /Welcome Rewards/ })).toBeTruthy()
  expect(document.body.style.overflow).toBe('hidden')
  fireEvent.click(screen.getByRole('button', { name: 'Maybe Later' }))
  expect(document.body.style.overflow).toBe('auto')
  expect(welcomeVisit.dismissed).toBe(true)
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
  expect(welcomeVisit.dismissed).toBe(true)
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

it('ignores previous session dismissal after a fresh document load', () => {
 sessionStorage.setItem('kun-king:welcome-dismissed:v1','yes'); const view=mount();
 expect(screen.getByRole('dialog')).toBeTruthy();fireEvent.click(screen.getByRole('button',{name:'Maybe Later'}));view.unmount();
 welcomeVisit.dismissed=false;mount();expect(screen.getByRole('dialog')).toBeTruthy();
})
