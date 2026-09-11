import { beforeEach, afterEach, it, expect, vi } from 'vitest'
import { render, screen, fireEvent, within, cleanup, waitFor, act } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import App from '../src/App'
import { welcomeVisit } from '../src/landing/WelcomeModal'
import { friends, invited, available, next } from '../src/affiliate/data'
import { chestTiming, chestReducer } from '../src/affiliate/useChestPreview'

beforeEach(()=>{
  welcomeVisit.dismissed=true
  window.scrollTo=vi.fn()
  Element.prototype.scrollIntoView=vi.fn()
  vi.stubGlobal('matchMedia',()=>({matches:false,addEventListener:vi.fn(),removeEventListener:vi.fn()}))
  HTMLDialogElement.prototype.showModal=function(){this.setAttribute('open','')}
  HTMLDialogElement.prototype.close=function(){this.removeAttribute('open')}
})
afterEach(()=>{cleanup();vi.restoreAllMocks();vi.useRealTimers();vi.unstubAllGlobals()})
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
const finishChestAnimation=()=>Object.values(chestTiming).forEach(ms=>act(()=>{vi.advanceTimersByTime(ms)}))
it('opens the reached chests in order, consumes only on claim, and leaves Wallet unchanged',()=>{
  vi.useFakeTimers();mount()
  for(const [index,threshold] of [5,10].entries()) {
    fireEvent.click(screen.getByRole('button',{name:`Open Chest (${2-index})`}))
    expect(screen.getByRole('dialog').getAttribute('data-phase')).toBe('lifting')
    expect(screen.queryByRole('button',{name:/Claim preview/})).toBeNull()
    act(()=>{vi.advanceTimersByTime(chestTiming.lifting)})
    expect(screen.getByRole('dialog').getAttribute('data-phase')).toBe('shaking')
    act(()=>{vi.advanceTimersByTime(chestTiming.shaking)})
    expect(screen.getByRole('dialog').getAttribute('data-phase')).toBe('revealing')
    act(()=>{vi.advanceTimersByTime(chestTiming.revealing)})
    expect(screen.getByRole('dialog',{name:'Chest Opened!'}).textContent).toContain(`Sample amount · ${threshold} invites chest`)
    expect(screen.getByRole('button',{name:`Open Chest (${2-index})`,hidden:true})).toBeTruthy()
    fireEvent.click(screen.getByRole('button',{name:/Claim preview/}))
    expect(screen.getByRole('status').textContent).toContain(`${threshold} invites chest · No funds added`)
    expect(screen.getByRole('button',{name:new RegExp(`^${threshold} invites — Reached — Preview claimed$`)})).toBeTruthy()
  }
  expect((screen.getByRole('button',{name:'Open Chest (0)'}) as HTMLButtonElement).disabled).toBe(true)
  expect(document.activeElement).toBe(screen.getByRole('button',{name:'Reset preview'}))
  expect(screen.getByText('3 invites left')).toBeTruthy()
  fireEvent.click(screen.getByRole('button',{name:'Reset preview'}))
  expect((screen.getByRole('button',{name:'Open Chest (2)'}) as HTMLButtonElement).disabled).toBe(false)
  fireEvent.click(screen.getByRole('button',{name:'Wallet',exact:true}))
  expect(screen.getByText('₱13,300.00')).toBeTruthy()
})
it('cancels at each animation stage without consuming a chest or leaving timers and locks',()=>{
  vi.useFakeTimers();const view=mount()
  for(const stage of ['lifting','shaking','revealing','reward']) {
    const button=screen.getByRole('button',{name:'Open Chest (2)'})
    button.focus();fireEvent.click(button)
    if(stage!=='lifting')act(()=>{vi.advanceTimersByTime(chestTiming.lifting)})
    if(stage==='revealing'||stage==='reward')act(()=>{vi.advanceTimersByTime(chestTiming.shaking)})
    if(stage==='reward')act(()=>{vi.advanceTimersByTime(chestTiming.revealing)})
    fireEvent(screen.getByRole('dialog'),new Event('cancel',{cancelable:true}))
    expect(document.activeElement).toBe(button)
    expect(document.body.style.overflow).not.toBe('hidden')
    act(()=>{vi.advanceTimersByTime(5000)})
    expect(screen.queryByRole('dialog')).toBeNull()
    expect(screen.getByRole('button',{name:'Open Chest (2)'})).toBeTruthy()
  }
  const setTimer=vi.spyOn(window,'setTimeout'),clearTimer=vi.spyOn(window,'clearTimeout')
  fireEvent.click(screen.getByRole('button',{name:'Open Chest (2)'}))
  const timer=setTimer.mock.results[setTimer.mock.calls.findIndex(call=>call[1]===chestTiming.lifting)].value
  view.unmount()
  expect(clearTimer).toHaveBeenCalledWith(timer)
  expect(document.body.style.overflow).not.toBe('hidden')
})
it('ignores repeated launch and claim events and never opens the locked 15 stage',()=>{
  const initial={phase:'idle' as const,selected:null,claimed:[],lastClaimed:null}
  const started=chestReducer(initial,{type:'start',reduced:false})
  expect(chestReducer(started,{type:'start',reduced:false})).toBe(started)
  expect(chestReducer(started,{type:'claim'})).toBe(started)
  const ready=chestReducer(started,{type:'reduce'})
  const claimed=chestReducer(ready,{type:'claim'})
  expect(chestReducer(claimed,{type:'claim'})).toBe(claimed)
  const second=chestReducer(claimed,{type:'start',reduced:true})
  expect(second.selected).toBe(10)
  const empty=chestReducer(second,{type:'claim'})
  expect(chestReducer(empty,{type:'start',reduced:false})).toBe(empty)
})
it('skips motion for reduced motion and supports keyboard cycling and backdrop cancel',()=>{
  vi.stubGlobal('matchMedia',()=>({matches:true,addEventListener:vi.fn(),removeEventListener:vi.fn()}))
  mount();fireEvent.click(screen.getByRole('button',{name:'Open Chest (2)'}))
  expect(screen.getByRole('dialog').getAttribute('data-phase')).toBe('reward')
  const first=screen.getByRole('button',{name:'Close chest preview'}),last=screen.getByRole('button',{name:'Not now'})
  last.focus();fireEvent.keyDown(last,{key:'Tab'});expect(document.activeElement).toBe(first)
  fireEvent.keyDown(first,{key:'Tab',shiftKey:true});expect(document.activeElement).toBe(last)
  fireEvent.click(screen.getByRole('dialog'))
  expect(screen.queryByRole('dialog')).toBeNull()
  expect(screen.getByRole('button',{name:'Open Chest (2)'})).toBeTruthy()
})
it('clears preview claims on leaving and reentering the page',()=>{
  vi.useFakeTimers();mount()
  fireEvent.click(screen.getByRole('button',{name:'Open Chest (2)'}));finishChestAnimation()
  fireEvent.click(screen.getByRole('button',{name:/Claim preview/}))
  fireEvent.click(screen.getByRole('button',{name:'Wallet',exact:true}))
  fireEvent.click(screen.getByRole('button',{name:'Affiliate',exact:true}))
  expect(screen.getByRole('button',{name:'Open Chest (2)'})).toBeTruthy()
})
it('switches directly to the reward if reduced motion is enabled during lifting',()=>{
  vi.useFakeTimers()
  let change=()=>{}
  const media={matches:false,addEventListener:vi.fn((_event:string,listener:()=>void)=>{change=listener}),removeEventListener:vi.fn()}
  vi.stubGlobal('matchMedia',()=>media)
  const view=mount();fireEvent.click(screen.getByRole('button',{name:'Open Chest (2)'}))
  act(()=>{media.matches=true;change()})
  expect(screen.getByRole('dialog').getAttribute('data-phase')).toBe('reward')
  act(()=>{vi.advanceTimersByTime(5000)})
  expect(screen.getByRole('dialog').getAttribute('data-phase')).toBe('reward')
  view.unmount();expect(media.removeEventListener).toHaveBeenCalled()
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

it('renders gold unclaimed chests initially, checks only the claimed chest, and resets all visual states',()=>{
  vi.useFakeTimers();mount()
  const node=(n:number)=>screen.getByRole('button',{name:new RegExp(`^${n} invites —`)})
  for(const n of [5,10]) expect(node(n).getAttribute('data-chest-state')).toBe('available')
  for(const n of [15,20,25]) expect(node(n).getAttribute('data-chest-state')).toBe('locked')
  fireEvent.click(screen.getByRole('button',{name:'Open Chest (2)'}))
  finishChestAnimation()
  fireEvent.click(screen.getByRole('button',{name:/Claim preview/}))
  expect(node(5).getAttribute('data-chest-state')).toBe('claimed')
  expect(node(10).getAttribute('data-chest-state')).toBe('available')
  expect(node(15).getAttribute('data-chest-state')).toBe('locked')
  fireEvent.click(screen.getByRole('button',{name:'Reset preview'}))
  expect(node(5).getAttribute('data-chest-state')).toBe('available')
})
