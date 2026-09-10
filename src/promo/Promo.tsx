import { useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import { Trophy, ArrowRight, ChevronRight, Crown, Flame, Coins, Gamepad2, UserPlus, Target, X } from 'lucide-react'
import Banner from '../landing/Banner'
import '../landing/landing.css'
import './promo.css'

export const promotions = [
  { id: 'daily', tag: 'DAILY REWARDS', title: 'Daily Check-in', description: 'Log in every day and get free rewards!', cta: 'Claim Now', detail: 'Daily check-in rewards are being prepared. Check back when promotions launch.' },
  { id: 'spin', tag: 'WIN BIG', title: 'Lucky Spin', description: 'Spin for amazing rewards every day!', cta: 'Join Now', detail: 'Our prize wheel is coming soon. No spins or prizes are available in this preview.' },
  { id: 'cashback', tag: 'CASHBACK', title: 'Cashback Festival', description: 'Play more, get more — up to 20% cashback!', cta: 'View Details', detail: 'The 20% offer is sample campaign content. Eligibility and final terms will be published before launch.' },
  { id: 'invite', tag: 'INVITE FRIENDS', title: 'Invite & Earn', description: 'Invite friends and earn unlimited rewards!', cta: 'Invite Now', detail: 'Invitations and rewards are not connected yet. Campaign terms will be available at launch.' },
]
const welcome = { id: 'welcome', title: 'Welcome Bonus', detail: 'The up to 100% welcome bonus is a sample promotion. No deposit or reward service is connected.' }
export const missions = [
  { title: 'Deposit once', description: 'Make 1 deposit of any amount', current: 1, total: 1, reward: 50, action: 'Claim', icon: Coins },
  { title: 'Play 3 games', description: 'Play any 3 different games', current: 2, total: 3, reward: 30, action: 'Go Play', icon: Gamepad2 },
  { title: 'Invite 1 friend', description: 'Successfully invite 1 friend', current: 0, total: 1, reward: 100, action: 'Invite', icon: UserPlus },
]
const slides = [
  { image: 'welcome', label: 'NEW PLAYERS ONLY · PREVIEW', title: <>Welcome<br /><em>Bonus</em></>, description: 'Unlock rewards for new players. Up to 100% extra bonus!', cta: 'Claim Now', decoration: <div className="promo-bonus-sign"><small>UP TO</small><strong>100%</strong><span>WELCOME BONUS</span></div> },
  { image: 'daily', label: 'DAILY REWARDS · PREVIEW', title: <>Daily<br /><em>Check-in</em></>, description: 'A little reward. A brighter day.', cta: 'Claim Now' },
  { image: 'spin', label: 'WIN BIG · PREVIEW', title: <>Lucky<br /><em>Spin</em></>, description: 'Discover a world of exciting rewards.', cta: 'Join Now' },
]
type Panel = { title: string; text?: string; list?: 'promos' | 'missions' }
export default function Promo() {
  const [panel, setPanel] = useState<Panel | null>(null)
  const dialog = useRef<HTMLDialogElement>(null)
  const opener = useRef<HTMLElement | null>(null)
  useEffect(() => { if (!panel) return; const old = document.body.style.overflow; document.body.style.overflow = 'hidden'; dialog.current?.showModal(); return () => { dialog.current?.close(); document.body.style.overflow = old; if (opener.current?.isConnected) opener.current.focus({ preventScroll: true }) } }, [!!panel])
  function open(next: Panel) { if (!panel) opener.current = document.activeElement as HTMLElement; setPanel(next) }
  const details = (p: { title: string; detail: string }) => open({ title: p.title, text: p.detail })
  const close = () => setPanel(null)
  return <>
    <main className="kk-main promo-main">
      <Banner banners={slides} imageFolder="promo" onExplore={i => details(i === 0 ? welcome : promotions[i - 1])} />
      <section aria-labelledby="featured-title"><div className="promo-section-title"><h2 id="featured-title"><Flame className="promo-fire" size={20} />Featured Promotions</h2><button onClick={() => open({ title: 'All Promotions', list: 'promos' })}>View all<ChevronRight size={13} /></button></div>
        <span className="promo-preview">PREVIEW · OFFERS COMING SOON</span>
        <div className="promo-grid">{promotions.map(p => <article className={`promo-card promo-${p.id}`} key={p.id}><img src={`${import.meta.env.BASE_URL}promo/${p.id}.webp`} alt="" width="680" height="400" /><div className="promo-card-copy"><span className="promo-tag">{p.tag}</span><h3>{p.title === 'Daily Check-in' ? <>Daily<br /><span className="promo-nowrap">Check-in</span></> : p.title === 'Invite & Earn' ? <>Invite &amp;<br />Earn</> : p.title}</h3><p>{p.description}</p><button onClick={() => details(p)}>{p.cta}<ArrowRight size={13} /></button></div></article>)}</div>
      </section>
      <section aria-labelledby="missions-title"><div className="promo-section-title"><h2 id="missions-title"><Target size={20} />My Missions</h2><button onClick={() => open({ title: 'All Missions', list: 'missions' })}>View all<ChevronRight size={13} /></button></div><span className="promo-preview">DEMO PROGRESS · NO REWARDS AVAILABLE</span>
        <div className="promo-missions">{missions.map(m => <article className="promo-mission" key={m.title}><div className="mission-icon"><m.icon size={27} /></div><div className="mission-info"><h3>{m.title}</h3><p>{m.description}</p><div className="mission-progress"><progress aria-label={`${m.title} demo progress`} value={m.current} max={m.total} /><span>{m.current}/{m.total}</span></div></div><div className="mission-reward"><span><Crown size={15} /></span><div><strong>+{m.reward}</strong><small>Reward</small></div></div>{m.action === 'Go Play' ? <Link className="mission-action outline" to="/frontend?catalog=1">Go Play</Link> : <button className="mission-action" onClick={() => open({ title: m.title, text: 'This is demo progress, not your account activity. Mission rewards and invitations are not available yet.' })}>{m.action}</button>}</article>)}</div>
      </section>
      <section className="promo-more"><Trophy className="promo-trophy" size={52} aria-hidden="true" /><img src={`${import.meta.env.BASE_URL}promo/more.webp`} alt="" width="1200" height="240" /><div><h2>More Promotions Await</h2><p>Events, tournaments and exclusive rewards,<br />all in one place!</p></div><button onClick={() => open({ title: 'All Promotions', list: 'promos' })}>Explore All<ArrowRight size={14} /></button></section>
    </main>
    <dialog className="kk-dialog promo-dialog" ref={dialog} aria-labelledby="promo-dialog-title" onCancel={e => { e.preventDefault(); close() }} onClick={e => { if (e.target === e.currentTarget) close() }}>{panel && <div className="kk-dialog-content"><button className="kk-dialog-close" aria-label="Close promotion panel" onClick={close}><X size={21} /></button><h2 id="promo-dialog-title">{panel.title}</h2>{panel.text && <><p>{panel.text}</p><p className="promo-preview">Preview only. No rewards can be claimed.</p></>}{panel.list === 'promos' && [welcome, ...promotions].map(p => <button className="promo-list-item" key={p.id} onClick={() => details(p)}>{p.title}<ChevronRight size={17} /></button>)}{panel.list === 'missions' && <><p>Demo progress only. Rewards are not available.</p>{missions.map(m => <p key={m.title}>{m.title} · {m.current}/{m.total} · +{m.reward}</p>)}</>}{!panel.list ? <div className="promo-panel-actions"><Link to="/login">Log In</Link><Link to="/register">Register</Link></div> : null}<button className="kk-primary" onClick={close}>Close</button></div>}</dialog>
  </>
}
