import { useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import { BarChart3, ChevronRight, Gift, History, Map, Target, UserRound, UserRoundPlus, UsersRound, X } from 'lucide-react'
import { available, friends, invited, inviteCode, milestones, milestoneStatus, next, remaining, snapshotDate } from './data'
import type { Friend } from './data'
import type { KeyboardEvent } from 'react'
import './affiliate.css'

type Panel = { kind: 'rewards' | 'invite' | 'chests' | 'friends' } | { kind: 'milestone'; threshold: number } | { kind: 'friend'; friend: Friend }
const artwork = `${import.meta.env.BASE_URL}affiliate/reference.png`

export default function Affiliate() {
  const [panel, setPanel] = useState<Panel | null>(null)
  const [copyStatus, setCopyStatus] = useState('')
  const [opened, setOpened] = useState<number | null>(null)
  const dialog = useRef<HTMLDialogElement>(null)
  const opener = useRef<HTMLElement | null>(null)
  const release = useRef<(() => void) | null>(null)
  const copyAttempt = useRef(0)
  const isOpen = panel !== null
  const inviteLink = new URL('#/register', window.location.href).href
  useEffect(() => {
    if (!isOpen) return
    const element = dialog.current, old = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    element?.showModal()
    let released = false
    const cleanup = () => {
      if (released) return
      released = true
      copyAttempt.current++
      element?.close()
      document.body.style.overflow = old
      if (opener.current?.isConnected) opener.current.focus({ preventScroll: true })
    }
    release.current = cleanup
    return cleanup
  }, [isOpen])
  useEffect(() => {
    if (panel) dialog.current?.querySelector<HTMLButtonElement>('.kk-dialog-close')?.focus({ preventScroll:true })
  }, [panel])
  const open = (value: Panel, target: HTMLElement) => {
    if (!isOpen) opener.current = target
    copyAttempt.current++
    setCopyStatus(''); setOpened(null); setPanel(value)
  }
  const close = () => { release.current?.(); setPanel(null) }
  const keepDialogFocus = (event: KeyboardEvent<HTMLDialogElement>) => {
    if (event.key !== 'Tab') return
    const controls = event.currentTarget.querySelectorAll<HTMLElement>('button:not(:disabled), a[href], input:not(:disabled)')
    const first = controls[0], last = controls[controls.length-1]
    if (event.shiftKey && document.activeElement === first) { event.preventDefault(); last?.focus() }
    else if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); first?.focus() }
  }
  const copy = async (value: string) => {
    const attempt = ++copyAttempt.current
    setCopyStatus('')
    try {
      if (!navigator.clipboard?.writeText) throw new Error('Clipboard unavailable')
      await navigator.clipboard.writeText(value)
      if (attempt === copyAttempt.current) setCopyStatus('Copied successfully.')
    } catch {
      if (attempt === copyAttempt.current) setCopyStatus('Copy unavailable. Select the text above and copy it manually.')
    }
  }
  const friendRow = (friend: Friend, index: number) => <button className="affiliate-friend" key={friend.name} onClick={e => open({ kind:'friend', friend }, e.currentTarget)}>
    <span className={`affiliate-avatar avatar-${index}`} aria-hidden="true">{index < 2 ? <svg viewBox={index === 0 ? '110 1293 60 60' : '110 1370 60 60'}><image href={artwork} width="941" height="1672"/></svg> : <UserRound size={22}/>}</span>
    <span><strong>{friend.name}</strong><small>Joined {friend.daysAgo} days ago</small></span><em>{friend.valid ? 'Valid' : 'Pending'}</em><ChevronRight size={16}/>
  </button>
  const title = panel?.kind === 'friend' ? panel.friend.name : panel?.kind === 'milestone' ? `${panel.threshold} invites` : panel?.kind === 'invite' ? 'Invite Friends' : panel?.kind === 'chests' ? 'Chest preview' : panel?.kind === 'friends' ? 'All invites' : 'Reward stages'

  return <main className="kk-main affiliate-main">
    <section className="affiliate-card affiliate-stats" aria-label="Invite statistics">
      {[{ icon:UsersRound, label:'Invited Friends', value:invited }, { icon:Gift, label:'Available Chests', value:available.length }, { icon:Target, label:'Next Chest', value:`${remaining} invites left` }].map(({icon:Icon,label,value}) => <div key={label}><Icon size={23}/><span>{label}<strong>{value}</strong></span></div>)}
    </section>
    <section className="affiliate-card affiliate-journey" aria-labelledby="journey-title">
      <div className="affiliate-heading"><Map size={25}/><div><h1 id="journey-title">Reward Journey</h1><p>Invite more friends to unlock bigger rewards.</p></div><button onClick={e=>open({kind:'rewards'},e.currentTarget)}>View Rewards<ChevronRight size={14}/></button></div>
      <div className="affiliate-map">
        <svg viewBox="95 302 752 662" aria-hidden="true" className="affiliate-art">
          <defs>
            <filter id="affiliate-label-soft"><feGaussianBlur stdDeviation="3"/></filter>
            <filter id="affiliate-ink-alpha" colorInterpolationFilters="sRGB"><feColorMatrix type="matrix" values="0 0 0 0 1  0 0 0 0 1  0 0 0 0 1  0 6 0 0 -3"/></filter>
            <clipPath id="affiliate-flag-clip"><path d="M746 531 L790 543 L785 580 L741 565 Z M720 570 L808 589 L802 611 L715 591 Z"/></clipPath>
            <mask id="affiliate-flag-mask" maskUnits="userSpaceOnUse" x="712" y="530" width="100" height="85"><g clipPath="url(#affiliate-flag-clip)" filter="url(#affiliate-ink-alpha)"><image href={artwork} width="941" height="1672"/></g></mask>
            <radialGradient id="affiliate-gold"><stop stopColor="#fff4a1" stopOpacity=".7"/><stop offset="1" stopColor="#ffc43d" stopOpacity="0"/></radialGradient>
            <mask id="affiliate-chest-surround"><rect x="360" y="460" width="180" height="160" fill="white"/><rect x="402" y="507" width="96" height="69" rx="12" fill="black"/><rect x="510" y="523" width="85" height="61" fill="black"/></mask>
          </defs>
          <image href={artwork} width="941" height="1672"/>
          {milestones.map(m=><g key={m.threshold}><rect x={m.labelX-3} y={m.labelY-27} width="70" height="55" rx="6" fill={m.color} filter="url(#affiliate-label-soft)"/><text x={m.labelX} y={m.labelY} fill={m.threshold<=next.threshold ? '#f1f7f5' : '#b5cbd8'} fontSize="28" fontWeight="700">{m.threshold}</text><text x={m.labelX} y={m.labelY+23} fill="#b5cbd8" fontSize="24">invites</text></g>)}
          <rect x="548" y="637" width="60" height="46" rx="8" fill="#30f1c2"/><text x="578" y="660" textAnchor="middle" fontSize="25" fontWeight="700" fill="#052d2b">{invited}</text><text x="578" y="677" textAnchor="middle" fontSize="16" fill="#052d2b">invites</text>
          <g className="affiliate-chest-glow" mask="url(#affiliate-chest-surround)"><ellipse cx="449" cy="541" rx="85" ry="74" fill="url(#affiliate-gold)" style={{mixBlendMode:'screen'}}/></g>
          <g className="affiliate-sparkles" fill="#fff2aa">{[[393,518],[496,520],[409,581],[476,493]].map(([x,y],i)=><path key={i} style={{animationDelay:`${i*.55}s`,transformOrigin:`${x}px ${y}px`}} d={`M${x} ${y-7} l2 5 5 2 -5 2 -2 5 -2 -5 -5 -2 5 -2Z`}/>)}</g>
          <rect className="affiliate-flag-ink" x="712" y="530" width="100" height="85" mask="url(#affiliate-flag-mask)"/>
          <ellipse className="affiliate-position-glow" cx="490" cy="661" rx="35" ry="37" fill="none" stroke="#50ffe1" strokeWidth="3"/>
        </svg>
        {milestones.map(m=><button key={m.threshold} className={`affiliate-node ${m.threshold===next.threshold?'is-next':''}`} style={{left:`${(m.x-95)/752*100}%`,top:`${(m.y-302)/662*100}%`}} aria-label={`${m.threshold} invites — ${milestoneStatus(m.threshold)}`} onClick={e=>open({kind:'milestone',threshold:m.threshold},e.currentTarget)}/>)}
      </div>
      <div className="affiliate-progress"><div><BarChart3 size={20}/><h2>Invite Progress</h2><span><strong>{invited}</strong> / {next.threshold}</span></div><progress aria-label="Invite Progress" value={invited} max={next.threshold}/><p>{remaining} more valid invites to unlock your next chest.</p></div>
      <div className="affiliate-actions"><button className="kk-primary" onClick={e=>open({kind:'invite'},e.currentTarget)}><UserRoundPlus size={22}/>Invite Friends</button><button className="affiliate-outline" onClick={e=>open({kind:'chests'},e.currentTarget)}><Gift size={22}/>Open Chest ({available.length})</button></div>
    </section>
    <section className="affiliate-card affiliate-recent" aria-labelledby="recent-invites-title"><div className="affiliate-heading"><History size={23}/><h2 id="recent-invites-title">Recent Invites</h2><button onClick={e=>open({kind:'friends'},e.currentTarget)}>View all<ChevronRight size={14}/></button></div>{friends.slice(0,2).map(friendRow)}</section>
    <p className="affiliate-disclaimer">Design preview · Sample invite data</p>
    <dialog ref={dialog} className="kk-dialog affiliate-dialog" aria-labelledby="affiliate-dialog-title" onKeyDown={keepDialogFocus} onCancel={e=>{e.preventDefault();close()}} onClick={e=>{if(e.target===e.currentTarget)close()}}>{panel && <div className="kk-dialog-content"><button className="kk-dialog-close" aria-label="Close affiliate panel" onClick={close}><X size={21}/></button><h2 id="affiliate-dialog-title" tabIndex={-1}>{title}</h2><span className="affiliate-preview">Preview only · Sample invite data</span>
      {panel.kind==='rewards' && <><p>Reach each valid invite threshold to unlock a chest. A check mark means the threshold is reached, not that a reward was claimed.</p><ul className="affiliate-stages">{milestones.map(m=><li key={m.threshold}><strong>{m.threshold} invites</strong><span>{milestoneStatus(m.threshold)} · {Math.max(0,m.threshold-invited)} left</span></li>)}</ul><p>Prizes and live eligibility rules have not been announced.</p></>}
      {panel.kind==='milestone' && <><p><strong>{milestoneStatus(panel.threshold)}</strong> · {Math.max(0,panel.threshold-invited)} more valid invites needed.</p><p>{panel.threshold<=invited ? 'Threshold reached in this sample. This does not indicate a claimed reward.' : 'This chest is not unlocked in the sample.'} Prizes and live eligibility rules have not been announced.</p></>}
      {panel.kind==='invite' && <><p>This is a demo code and a registration link. They do not create a referral relationship or add invites.</p><label className="affiliate-copy">Demo invite code<input readOnly value={inviteCode} onFocus={e=>e.currentTarget.select()}/></label><button className="affiliate-outline" onClick={()=>void copy(inviteCode)}>Copy code</button><label className="affiliate-copy">Demo registration link<input readOnly value={inviteLink} onFocus={e=>e.currentTarget.select()}/></label><button className="affiliate-outline" onClick={()=>void copy(inviteLink)}>Copy link</button><p role="status">{copyStatus}</p><div className="affiliate-auth"><Link to="/login" onClick={close}>Log In</Link><Link to="/register" onClick={close}>Register</Link></div></>}
      {panel.kind==='chests' && <><p>Choose a reached stage to preview opening a chest. No prize is issued; chest counts and your Wallet balance stay unchanged.</p><div className="affiliate-chest-options">{available.map(m=><button className="affiliate-outline" key={m.threshold} onClick={()=>setOpened(m.threshold)}>{m.threshold} invites chest</button>)}</div><div key={opened} className={`affiliate-chest-preview${opened!==null?' is-open':''}`}><Gift size={68}/></div><p role="status">{opened!==null ? `${opened} invites chest preview opened. No reward was issued.` : 'Select a chest above.'}</p></>}
      {panel.kind==='friends' && <><p>Full sample list · Snapshot {snapshotDate}</p>{friends.map(friendRow)}</>}
      {panel.kind==='friend' && <><dl className="affiliate-detail"><div><dt>Joined</dt><dd>{panel.friend.joined}</dd></div><div><dt>Status</dt><dd>{panel.friend.valid ? 'Valid' : 'Pending'}</dd></div><div><dt>Sample snapshot</dt><dd>{snapshotDate}</dd></div></dl><p>This is an illustrative friend record, not a verified referral. Relative dates are fixed to the sample snapshot.</p></>}
      <button className="kk-primary" onClick={close}>Close</button>
    </div>}</dialog>
  </main>
}
