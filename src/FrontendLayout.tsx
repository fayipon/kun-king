import { useLayoutEffect } from 'react'
import type { ReactNode } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { ArrowLeft, Crown, Gift, House, UsersRound, UserRound, Wallet } from 'lucide-react'
import './landing/landing.css'
import './frontend.css'

function Header() {
  const { pathname } = useLocation()
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
