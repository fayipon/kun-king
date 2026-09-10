import { beforeEach, afterEach, it, expect, vi } from 'vitest'
import { render, screen, fireEvent, within, cleanup } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import App from '../src/App'
import { welcomeVisit } from '../src/landing/WelcomeModal'
beforeEach(() => {
  welcomeVisit.dismissed=true
  window.scrollTo=vi.fn()
  Element.prototype.scrollIntoView=vi.fn()
  vi.stubGlobal('matchMedia',()=>({matches:false,addEventListener:vi.fn(),removeEventListener:vi.fn()}))
  HTMLDialogElement.prototype.showModal=function(){this.setAttribute('open','')}
  HTMLDialogElement.prototype.close=function(){this.removeAttribute('open')}
})
afterEach(()=>{cleanup();vi.restoreAllMocks();vi.unstubAllGlobals()})
const mount=(path='/wallet')=>render(<MemoryRouter initialEntries={[path]}><App/></MemoryRouter>)
it('routes from My wallet entry and uses the public shared header and selected nav',()=>{
  mount('/my');fireEvent.click(screen.getByRole('button',{name:'Wallet & transactions'}))
  expect(screen.getByRole('heading',{name:'Wallet',exact:true})).toBeTruthy()
  expect(screen.getByRole('button',{name:'Wallet',exact:true}).getAttribute('aria-current')).toBe('page')
  expect(within(screen.getByRole('banner')).getByRole('link',{name:'Register'})).toBeTruthy()
})
it('hides and restores all balance card money without changing statistics',()=>{
  mount();const card=within(screen.getByRole('region',{name:'Wallet balances'}))
  expect(card.getByText('₱13,300.00')).toBeTruthy()
  fireEvent.click(card.getByRole('button',{name:'Hide balances'}))
  expect(card.queryByText(/₱/)).toBeNull()
  expect(within(screen.getByRole('article',{name:'Total deposit'})).getByText('₱12,450.00')).toBeTruthy()
  fireEvent.click(card.getByRole('button',{name:'Show balances'}))
  expect(card.getByText('₱13,300.00')).toBeTruthy()
})
it('updates statistics independently and calculates net deposit',()=>{
  mount();fireEvent.change(screen.getByLabelText('Wallet statistics period'),{target:{value:'Last month'}})
  expect(within(screen.getByRole('article',{name:'Net deposit'})).getByText('₱3,300.00')).toBeTruthy()
  expect((screen.getByLabelText('Transaction period') as HTMLSelectElement).value).toBe('This month')
  fireEvent.change(screen.getByLabelText('Wallet statistics period'),{target:{value:'All time'}})
  expect(within(screen.getByRole('article',{name:'Net deposit'})).getByText('₱7,750.00')).toBeTruthy()
})
it('combines transaction filters, handles empty results and expands matching history',()=>{
  mount();const section=within(screen.getByRole('region',{name:'Transaction History'}))
  expect(document.querySelectorAll('.wallet-transaction')).toHaveLength(5)
  fireEvent.click(section.getByRole('button',{name:'View all'}))
  expect(document.querySelectorAll('.wallet-transaction')).toHaveLength(6)
  fireEvent.click(within(screen.getByRole('group',{name:'Transaction type'})).getByRole('button',{name:'Promo'}))
  expect(document.querySelectorAll('.wallet-transaction')).toHaveLength(2)
  fireEvent.change(screen.getByLabelText('Transaction period'),{target:{value:'Last month'}})
  expect(screen.getByRole('status').textContent).toBe('No transactions for this filter.')
  fireEvent.click(within(screen.getByRole('group',{name:'Transaction type'})).getByRole('button',{name:'Deposit'}))
  expect(document.querySelectorAll('.wallet-transaction')).toHaveLength(1)
})
it('opens matching transaction details and restores focus and scrolling',()=>{
  mount();const row=screen.getByRole('button',{name:/Welcome bonus.*500/});row.focus();fireEvent.click(row)
  const d=within(screen.getByRole('dialog',{name:'Welcome bonus'}))
  expect(d.getByText('TX-003')).toBeTruthy();expect(d.getByText('2026-09-10 14:20')).toBeTruthy()
  expect(document.body.style.overflow).toBe('hidden')
  fireEvent(screen.getByRole('dialog'),new Event('cancel',{cancelable:true}))
  expect(document.activeElement).toBe(row);expect(document.body.style.overflow).not.toBe('hidden')
})
it('keeps sample balances unchanged during service dialogs and unlocks before login',()=>{
  mount();const card=within(screen.getByRole('region',{name:'Wallet balances'}))
  for(const action of ['Deposit','Withdraw']) {
    fireEvent.click(card.getByRole('button',{name:action}));expect(screen.getByRole('dialog',{name:action}).textContent).toContain('coming soon')
    fireEvent.click(screen.getByRole('dialog'));expect(card.getByText('₱13,300.00')).toBeTruthy()
  }
  fireEvent.click(screen.getByRole('button',{name:/Need help with a transaction/}))
  expect(screen.getByRole('dialog',{name:'Transaction support'})).toBeTruthy()
  fireEvent.click(screen.getByRole('button',{name:'Close wallet panel'}))
  fireEvent.click(card.getByRole('button',{name:'Deposit'}))
  fireEvent.click(within(screen.getByRole('dialog')).getByRole('link',{name:'Log In'}))
  expect(screen.getByRole('heading',{name:'Welcome back'})).toBeTruthy();expect(document.body.style.overflow).not.toBe('hidden')
})
