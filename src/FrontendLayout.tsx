import { useEffect, useLayoutEffect, useRef, useState } from 'react'
import type { ReactNode } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { ArrowLeft, Crown, Gift, House, UsersRound, UserRound, Wallet, X } from 'lucide-react'
import './landing/landing.css'
import './frontend.css'

function Header() {
  const { pathname } = useLocation()
  return <header className="kk-header"><Link to={pathname === '/frontend' ? '/' : '/frontend'} className="kk-back" aria-label={pathname === '/frontend' ? 'Back to portal' : 'Back to game lobby'}><ArrowLeft size={18} /></Link><Link to="/frontend" className="kk-logo"><span><Crown size={23} /></span><div>KUN<span>KING</span><small>YOUR PLAYGROUND</small></div></Link><div className="kk-header-tools kk-auth-links"><Link to="/login">Log In</Link><Link to="/register">Register</Link></div></header>
}
function BottomNav() {
  const location = useLocation(), navigate = useNavigate()
  const [panel, setPanel] = useState<string | null>(null)
  const dialog = useRef<HTMLDialogElement>(null), opener = useRef<HTMLButtonElement | null>(null)
  const release = useRef<(() => void) | null>(null)
  const active = location.pathname === '/my' ? 'my' : location.pathname === '/promo' ? 'promo' : new URLSearchParams(location.search).has('favorites') ? 'my' : 'home'
  useEffect(() => { setPanel(null) }, [location.key])
  useEffect(() => { if (!panel) return; const element = dialog.current; const old = document.body.style.overflow; document.body.style.overflow = 'hidden'; element?.showModal(); let released=false; const cleanup=()=>{ if(released)return; released=true; element?.close(); document.body.style.overflow=old; if(opener.current?.isConnected)opener.current.focus({preventScroll:true}) }; release.current=cleanup; return cleanup }, [panel])
  const close = () => { release.current?.(); setPanel(null) }
  return <><nav className="kk-bottom-nav" aria-label="Lobby navigation">{[{ id:'home',label:'Home',icon:House },{ id:'promo',label:'Promo',icon:Gift },{ id:'wallet',label:'Wallet',icon:Wallet },{ id:'affiliate',label:'Affiliate',icon:UsersRound },{ id:'my',label:'My',icon:UserRound }].map(({id,label,icon:Icon}) => <button key={id} className={`${(panel ? panel.toLowerCase() : active) === id ? 'active ' : ''}${id === 'wallet' ? 'kk-center-nav' : ''}`} aria-current={!panel && active === id ? 'page' : undefined} aria-expanded={id === 'home' || id === 'promo' || id === 'my' ? undefined : panel === label} onClick={e => { if (id === 'home' || id === 'promo' || id === 'my') { close(); navigate(id === 'home' ? '/frontend' : id === 'my' ? '/my' : '/promo'); window.scrollTo({ top:0, behavior:'instant' }) } else { opener.current=e.currentTarget; setPanel(label) } }}><span><Icon size={id === 'wallet' ? 27 : 20} /></span>{label}</button>)}</nav><dialog className="kk-dialog kk-nav-dialog" ref={dialog} aria-labelledby="nav-panel-title" onCancel={e=>{e.preventDefault();close()}} onClick={e=>{if(e.target===e.currentTarget)close()}}>{panel && <div className="kk-dialog-content"><button className="kk-dialog-close" aria-label="Close menu" onClick={close}><X size={21}/></button><h2 id="nav-panel-title">{panel}</h2><p>{panel === 'Wallet' ? 'Your wallet will be available when account services launch.' : 'Our affiliate program is coming soon.'}</p><button className="kk-primary" onClick={close}>Got it</button></div>}</dialog></>
}
export default function FrontendLayout({ children }: { children: ReactNode }) {
  const { pathname }=useLocation()
  useLayoutEffect(()=>{const lang=document.documentElement.lang;document.documentElement.lang='en';document.body.classList.add('kk-body');document.documentElement.classList.add('frontend-document');return()=>{document.documentElement.lang=lang;document.body.classList.remove('kk-body');document.documentElement.classList.remove('frontend-document')}},[])
  useLayoutEffect(()=>{window.scrollTo({top:0,behavior:'instant'})},[pathname])
  return <div className={`kk-lobby frontend-layout${pathname === '/promo' ? ' promo-page' : ''}`}><Header/>{children}<BottomNav/></div>
}
