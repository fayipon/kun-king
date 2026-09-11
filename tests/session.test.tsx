import { afterEach, expect, it, vi } from 'vitest'
import { act, cleanup, fireEvent, render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { SessionProvider, useSession } from '../src/auth/Session'
import FrontendLayout from '../src/FrontendLayout'

afterEach(()=>{cleanup();vi.useRealTimers()})
function Trigger(){const session=useSession();return <button onClick={()=>session.login()}>Demo login</button>}
function mount(){ window.scrollTo=vi.fn();HTMLDialogElement.prototype.showModal=function(){this.setAttribute('open','')};HTMLDialogElement.prototype.close=function(){this.removeAttribute('open')};return render(<MemoryRouter initialEntries={['/affiliate']}><SessionProvider><FrontendLayout><Trigger/></FrontendLayout></SessionProvider></MemoryRouter>)}
it('stacks independent notifications and pauses hovered timers',()=>{
  vi.useFakeTimers();mount();fireEvent.click(screen.getByText('Demo login'))
  act(()=>vi.advanceTimersByTime(1000));fireEvent.click(screen.getByText('Demo login'))
  expect(screen.getAllByRole('status')).toHaveLength(2)
  const second=screen.getAllByRole('status')[1].parentElement!
  fireEvent.mouseEnter(second)
  act(()=>vi.advanceTimersByTime(3000));expect(screen.getAllByRole('status')).toHaveLength(1)
  act(()=>vi.advanceTimersByTime(5000));expect(screen.getAllByRole('status')).toHaveLength(1)
  fireEvent.mouseLeave(second);act(()=>vi.advanceTimersByTime(4000));expect(screen.queryByRole('status')).toBeNull()
})
it('switches header, reads notifications, restores focus and logs out',()=>{
  mount();fireEvent.click(screen.getByText('Demo login'))
  expect(screen.getByRole('link',{name:'Sample balance ₱13,300.00'}).getAttribute('href')).toBe('/wallet')
  const bell=screen.getByRole('button',{name:'Notifications, unread'});bell.focus();fireEvent.click(bell)
  expect(screen.getByText(/Sample notification/)).toBeTruthy()
  fireEvent.click(screen.getByRole('button',{name:'Close account panel'}))
  expect(document.activeElement).toBe(bell);expect(screen.getByRole('button',{name:'Notifications'})).toBeTruthy()
  fireEvent.click(screen.getByRole('button',{name:'Open account menu'}));fireEvent.click(screen.getByText('Log Out'))
  expect(screen.getByRole('link',{name:'Log In'})).toBeTruthy();expect(screen.getByText('Logged out successfully.')).toBeTruthy()
  fireEvent.click(screen.getAllByRole('button',{name:'Dismiss notification'})[0]);expect(screen.getAllByRole('status')).toHaveLength(1)
  expect(document.body.style.overflow).not.toBe('hidden')
})
