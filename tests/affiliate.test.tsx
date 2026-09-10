import { beforeEach, afterEach, it, expect, vi } from 'vitest'
import { render, screen, fireEvent, within, cleanup, waitFor } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import App from '../src/App'
import { welcomeVisit } from '../src/landing/WelcomeModal'
import { friends, invited, available, next } from '../src/affiliate/data'

beforeEach(()=>{
  welcomeVisit.dismissed=true
  window.scrollTo=vi.fn()
  Element.prototype.scrollIntoView=vi.fn()
  vi.stubGlobal('matchMedia',()=>({matches:false,addEventListener:vi.fn(),removeEventListener:vi.fn()}))
  HTMLDialogElement.prototype.showModal=function(){this.setAttribute('open','')}
  HTMLDialogElement.prototype.close=function(){this.removeAttribute('open')}
})
afterEach(()=>{cleanup();vi.restoreAllMocks();vi.unstubAllGlobals()})
const mount=(path='/affiliate')=>render(<MemoryRouter initialEntries={[path]}><App/></MemoryRouter>)
const openInvite=()=>fireEvent.click(screen.getByRole('button',{name:'Invite Friends',exact:true}))
const close=()=>fireEvent.click(screen.getByRole('button',{name:'Close affiliate panel'}))
it('loads the standalone route with consistent sample counts and one public frame',()=>{
  mount()
  expect(screen.getAllByRole('banner')).toHaveLength(1)
  expect(screen.getAllByRole('navigation',{name:'Lobby navigation'})).toHaveLength(1)
  expect(screen.getByRole('button',{name:'Affiliate',exact:true}).getAttribute('aria-current')).toBe('page')
  expect(document.title).toBe('Kun King · Affiliate')
  expect(invited).toBe(12);expect(available).toHaveLength(2);expect(next.threshold).toBe(15)
  expect(screen.getByRole('progressbar').getAttribute('value')).toBe('12')
  expect(screen.getByRole('progressbar').getAttribute('max')).toBe('15')
  expect(screen.getByText('3 invites left')).toBeTruthy()
  expect(screen.getAllByRole('button',{name:/invites —/})).toHaveLength(5)
})
it('navigates to affiliate from every existing public page',()=>{
  for(const path of ['/frontend','/promo','/wallet','/my']) {
    const view=mount(path)
    fireEvent.click(screen.getByRole('button',{name:'Affiliate',exact:true}))
    expect(screen.getByRole('heading',{name:'Reward Journey'})).toBeTruthy()
    fireEvent.click(screen.getByRole('button',{name:'Wallet',exact:true}))
    expect(screen.getByRole('region',{name:'Wallet balances'})).toBeTruthy()
    view.unmount()
  }
})
it('shows all stage rules and each matching threshold, then restores focus',()=>{
  mount()
  fireEvent.click(screen.getByRole('button',{name:'View Rewards'}))
  expect(within(screen.getByRole('dialog')).getAllByRole('listitem')).toHaveLength(5)
  close()
  for(const threshold of [5,10,15,20,25]) {
    const button=screen.getByRole('button',{name:new RegExp(`^${threshold} invites —`)})
    button.focus();fireEvent.click(button)
    expect(screen.getByRole('dialog',{name:`${threshold} invites`}).textContent).toContain(`${Math.max(0,threshold-12)} more valid invites needed`)
    expect(document.body.style.overflow).toBe('hidden')
    fireEvent(screen.getByRole('dialog'),new Event('cancel',{cancelable:true}))
    expect(document.activeElement).toBe(button)
    expect(document.body.style.overflow).not.toBe('hidden')
  }
})
it('reports copy success only after completion and preserves selectable fallback on rejection',async()=>{
  const writeText=vi.fn().mockResolvedValue(undefined)
  vi.stubGlobal('navigator',{clipboard:{writeText}})
  mount();openInvite()
  fireEvent.click(screen.getByRole('button',{name:'Copy code'}))
  await waitFor(()=>expect(screen.getByRole('status').textContent).toBe('Copied successfully.'))
  expect(writeText).toHaveBeenCalledWith('DEMO-KUNKING12')
  writeText.mockRejectedValue(new Error('Denied'))
  fireEvent.click(screen.getByRole('button',{name:'Copy link'}))
  await waitFor(()=>expect(screen.getByRole('status').textContent).toContain('copy it manually'))
  expect((screen.getByLabelText('Demo registration link') as HTMLInputElement).value).toMatch(/#\/register$/)
  expect((screen.getByLabelText('Demo invite code') as HTMLInputElement).readOnly).toBe(true)
})
it('handles unavailable clipboard and unlocks on both account routes',async()=>{
  vi.stubGlobal('navigator',{})
  for(const name of ['Log In','Register']) {
    const view=mount();openInvite()
    fireEvent.click(screen.getByRole('button',{name:'Copy code'}))
    await waitFor(()=>expect(screen.getByRole('status').textContent).toContain('Copy unavailable'))
    fireEvent.click(within(screen.getByRole('dialog')).getByRole('link',{name}))
    expect(screen.queryByRole('dialog')).toBeNull()
    expect(document.body.style.overflow).not.toBe('hidden')
    expect(screen.getByRole('heading',{name:name==='Log In'?'Welcome back':'CreateAccount'})).toBeTruthy()
    view.unmount()
  }
})
it('previews both chests without consuming counts or changing wallet data',()=>{
  mount();fireEvent.click(screen.getByRole('button',{name:'Open Chest (2)'}))
  for(const threshold of [5,10]) {
    fireEvent.click(screen.getByRole('button',{name:`${threshold} invites chest`}))
    expect(screen.getByRole('status').textContent).toBe(`${threshold} invites chest preview opened. No reward was issued.`)
  }
  close();expect(screen.getByRole('button',{name:'Open Chest (2)'})).toBeTruthy()
  fireEvent.click(screen.getByRole('button',{name:'Wallet',exact:true}))
  expect(screen.getByText('₱13,300.00')).toBeTruthy()
})
it('lists all 12 fixed-date friends and restores the original opener after nested details',()=>{
  mount();const button=screen.getByRole('button',{name:'View all'})
  button.focus();fireEvent.click(button)
  expect(within(screen.getByRole('dialog')).getAllByRole('button',{name:/Joined/})).toHaveLength(12)
  fireEvent.click(within(screen.getByRole('dialog')).getByRole('button',{name:/MariaPlay/}))
  expect(screen.getByRole('dialog',{name:'MariaPlay'}).textContent).toContain(friends[1].joined)
  fireEvent.click(screen.getByRole('dialog'))
  expect(document.activeElement).toBe(button)
  expect(document.body.style.overflow).not.toBe('hidden')
})
it('does not let an old clipboard result leak into a reopened dialog',async()=>{
  let resolve!:()=>void
  vi.stubGlobal('navigator',{clipboard:{writeText:()=>new Promise<void>(r=>{resolve=r})}})
  mount();openInvite();fireEvent.click(screen.getByRole('button',{name:'Copy code'}))
  close();openInvite();resolve()
  await waitFor(()=>expect(screen.getByRole('status').textContent).toBe(''))
})
it('cycles keyboard focus inside the panel in both directions',()=>{
  mount();openInvite()
  const first=screen.getByRole('button',{name:'Close affiliate panel'}),last=screen.getByRole('button',{name:'Close',exact:true})
  last.focus();fireEvent.keyDown(last,{key:'Tab'})
  expect(document.activeElement).toBe(first)
  fireEvent.keyDown(first,{key:'Tab',shiftKey:true})
  expect(document.activeElement).toBe(last)
})
