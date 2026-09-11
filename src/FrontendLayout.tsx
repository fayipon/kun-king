import { useLayoutEffect, useRef, useState } from 'react'
import type { ReactNode } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { ArrowLeft, Crown, Gift, House, UsersRound, UserRound, Wallet } from 'lucide-react'
import './landing/landing.css'
import './frontend.css'
import { useSession } from './auth/Session'
import { Bell, Menu, Coins, X } from 'lucide-react'

function Header() {
  const { pathname } = useLocation()
  const session=useSession()
  const [panel,setPanel]=useState<'notifications'|'menu'|null>(null)
  const dialog=useRef<HTMLDialogElement>(null), opener=useRef<HTMLElement|null>(null)
  useLayoutEffect(()=>{
    if(!panel) return
    const element=dialog.current, old=document.body.style.overflow
    element?.showModal(); document.body.style.overflow='hidden'
    return ()=>{element?.close();document.body.style.overflow=old;opener.current?.focus()}
  },[panel])
  const open=(kind:'notifications'|'menu',target:HTMLElement)=>{opener.current=target;setPanel(kind);if(kind==='notifications')session.read()}
  if(session.signedIn) return <>
    <header className="kk-header member-header"><Link to="/frontend" className="kk-logo" aria-label="Kun King game lobby"><span><Crown size={22}/></span><div>KUN<span>KING</span></div></Link><div className="member-tools">
      <Link className="member-balance" to="/wallet" aria-label="Sample balance ₱13,300.00"><Coins size={20}/><span>13,300.00</span></Link>
      <button className="member-icon" aria-label={session.unread?'Notifications, unread':'Notifications'} onClick={e=>open('notifications',e.currentTarget)}><Bell size={23}/>{session.unread&&<i/>}</button>
      <button className="member-icon" aria-label="Open account menu" onClick={e=>open('menu',e.currentTarget)}><Menu size={24}/></button>
    </div></header>
    <dialog ref={dialog} className="member-dialog" aria-labelledby="member-title" onCancel={e=>{e.preventDefault();setPanel(null)}} onClick={e=>{if(e.target===e.currentTarget)setPanel(null)}} onKeyDown={e=>{if(e.key!=='Tab')return;const controls=e.currentTarget.querySelectorAll<HTMLElement>('button,a[href]'),first=controls[0],last=controls[controls.length-1];if(e.shiftKey&&document.activeElement===first){e.preventDefault();last?.focus()}else if(!e.shiftKey&&document.activeElement===last){e.preventDefault();first?.focus()}}}>
      <button className="member-close" aria-label="Close account panel" onClick={()=>setPanel(null)}><X size={20}/></button><h2 id="member-title">{panel==='notifications'?'Notifications':'Account menu'}</h2>
      {panel==='notifications'?<><strong>Welcome to Kun King!</strong><p>Sample notification · Explore your playground. Your demo session is ready.</p></>:<><Link to="/my" onClick={()=>setPanel(null)}>My Account</Link><Link to="/wallet" onClick={()=>setPanel(null)}>Wallet</Link><button className="member-logout" onClick={()=>{setPanel(null);session.logout()}}>Log Out</button><p>Demo session · Preview only</p></>}
    </dialog>
  </>
  return <header className="kk-header"><Link to={pathname === '/frontend' ? '/' : '/frontend'} className="kk-back" aria-label={pathname === '/frontend' ? 'Back to portal' : 'Back to game lobby'}><ArrowLeft size={18} /></Link><Link to="/frontend" className="kk-logo"><span><Crown size={23} /></span><div>KUN<span>KING</span><small>YOUR PLAYGROUND</small></div></Link><div className="kk-header-tools kk-auth-links"><Link to="/login">Log In</Link><Link to="/register">Register</Link></div></header>
}
function BottomNav() {
  const location = useLocation(), navigate = useNavigate()
  const active = location.pathname === '/affiliate' ? 'affiliate' : location.pathname === '/wallet' ? 'wallet' : location.pathname === '/my' ? 'my' : location.pathname === '/promo' ? 'promo' : new URLSearchParams(location.search).has('favorites') ? 'my' : 'home'
  return <nav className="kk-bottom-nav" aria-label="Lobby navigation">{[{ id:'home',label:'Home',icon:House },{ id:'promo',label:'Promo',icon:Gift },{ id:'wallet',label:'Wallet',icon:Wallet },{ id:'affiliate',label:'Affiliate',icon:UsersRound },{ id:'my',label:'My',icon:UserRound }].map(({id,label,icon:Icon}) => <button key={id} className={`${active === id ? 'active ' : ''}${id === 'wallet' ? 'kk-center-nav' : ''}`} aria-current={active === id ? 'page' : undefined} onClick={() => { navigate(id === 'home' ? '/frontend' : `/${id}`); window.scrollTo({ top:0, behavior:'instant' }) }}><span><Icon size={id === 'wallet' ? 27 : 20} /></span>{label}</button>)}</nav>
}
export default function FrontendLayout({ children }: { children: ReactNode }) {
  const { pathname }=useLocation()
  useLayoutEffect(()=>{const lang=document.documentElement.lang;document.documentElement.lang='en';document.body.classList.add('kk-body');document.documentElement.classList.add('frontend-document');return()=>{document.documentElement.lang=lang;document.body.classList.remove('kk-body');document.documentElement.classList.remove('frontend-document')}},[])
  useLayoutEffect(()=>{window.scrollTo({top:0,behavior:'instant'})},[pathname])
  return <div className={`kk-lobby frontend-layout${pathname === '/promo' ? ' promo-page' : ''}`}><Header/>{children}<BottomNav/></div>
}
