import { afterEach, beforeEach, expect, it, vi } from 'vitest'
import { cleanup, fireEvent, render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import App from '../src/App'

beforeEach(() => {
  localStorage.clear(); window.scrollTo = vi.fn()
  HTMLDialogElement.prototype.showModal = function () { this.setAttribute('open', '') }
  HTMLDialogElement.prototype.close = function () { this.removeAttribute('open') }
})
afterEach(() => { cleanup(); vi.restoreAllMocks() })
const mount = (path = '/login') => render(<MemoryRouter initialEntries={[path]}><App /></MemoryRouter>)
const fill = (label: string, value: string) => fireEvent.change(screen.getByLabelText(label, { exact: true }), { target: { value } })
it('validates login and remembers only the identifier', () => {
  const view = mount()
  fireEvent.click(screen.getByRole('button', { name: 'Log In', exact: true }))
  expect(screen.getByText('Enter your email or username.')).toBeTruthy()
  expect(document.activeElement).toBe(screen.getByLabelText('Email or Username'))
  fill('Email or Username', 'demo'); fill('Password', 'test-password')
  fireEvent.click(screen.getByRole('checkbox', { name: 'Remember me' }))
  fireEvent.click(screen.getByRole('button', { name: 'Show password', exact: true }))
  expect(screen.getByLabelText('Password', { exact: true }).getAttribute('type')).toBe('text')
  fireEvent.click(screen.getByRole('button', { name: 'Log In', exact: true }))
  expect(screen.getByRole('status').textContent).toContain('not connected')
  expect(localStorage.getItem('kun-king:login-name')).toBe('demo')
  expect(JSON.stringify(localStorage)).not.toContain('test-password')
  view.unmount(); mount()
  expect((screen.getByLabelText('Email or Username') as HTMLInputElement).value).toBe('demo')
  expect((screen.getByLabelText('Password', { exact: true }) as HTMLInputElement).value).toBe('')
  fireEvent.click(screen.getByRole('checkbox', { name: 'Remember me' }))
  expect(localStorage.getItem('kun-king:login-name')).toBeNull()
})
it('validates registration, matching passwords and consent without claiming account creation', () => {
  mount('/register')
  fill('Username', 'player'); fill('Email Address', 'invalid'); fill('Password', 'short'); fill('Confirm Password', 'different')
  fireEvent.click(screen.getByRole('button', { name: 'Create Account', exact: true }))
  for (const message of ['Enter a valid email address.', 'Use at least 8 characters.', 'Passwords must match.', 'Please agree to the terms to continue.']) expect(screen.getByText(message)).toBeTruthy()
  fill('Email Address', 'player@example.com'); fill('Password', 'long-password'); fill('Confirm Password', 'long-password')
  fireEvent.click(screen.getByRole('checkbox'))
  fireEvent.click(screen.getByRole('button', { name: 'Show confirm password' }))
  expect(screen.getByLabelText('Confirm Password').getAttribute('type')).toBe('text')
  expect(screen.getByLabelText('Password', { exact: true }).getAttribute('type')).toBe('password')
  fireEvent.click(screen.getByRole('button', { name: 'Create Account', exact: true }))
  expect(screen.getByRole('status').textContent).toContain('No account has been created')
  expect(localStorage.length).toBe(0)
})
it('switches standalone routes with cleared passwords and handles service notices', () => {
  mount(); fill('Password', 'private-password')
  fireEvent.click(screen.getByRole('link', { name: 'Create Account' }))
  expect(document.title).toBe('Kun King · Create Account')
  expect((screen.getByLabelText('Password', { exact: true }) as HTMLInputElement).value).toBe('')
  fireEvent.click(screen.getByRole('link', { name: 'Log In' }))
  expect(document.title).toBe('Kun King · Log In')
  expect(screen.queryByRole('link', { name:'Continue as Guest' })).toBeNull()
  expect(screen.queryByRole('button', { name:'Terms & Privacy Policy' })).toBeNull()
  for (const name of ['Continue with Google', 'Continue with Apple', 'Continue with Facebook', 'Forgot password?']) {
    fireEvent.click(screen.getByRole('button', { name, exact: true }))
    expect(screen.getByRole('dialog')).toBeTruthy()
    fireEvent.click(screen.getByRole('button', { name: 'Close notice' }))
    expect(screen.queryByRole('dialog')).toBeNull()
  }
  fireEvent.click(screen.getByRole('link', { name:'Create Account' }))
  fireEvent.click(screen.getByRole('button', { name:'Terms & Privacy Policy' }))
  expect(screen.getByRole('dialog')).toBeTruthy()
})
