import { useEffect, useRef, useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { BarChart3, ChevronRight, Copy, Crown, Download, Edit3, Gamepad2, Headphones, History, IdCard, LogOut, Settings, ShieldCheck, TrendingUp, Upload, UserRound, Wallet, X } from 'lucide-react'
import { games } from '../landing/games'
import './my.css'

export const account = { name: 'Player123', id: '8891023', vip: 3, points: 12450, next: 20000 }
export const periods = { 'This month': [12450, 8000, 98320, -1250], 'Last month': [9500, 6200, 74500, 850], 'All time': [21950, 14200, 172820, -400] }
export const history = [
  { id:'98', name:'Fortune Ox', time:'Today · 18:24', result:250, bet:1000 },
  { id:'65', name:'Mahjong Ways', time:'Today · 16:12', result:120, bet:500 },
  { id:'25', name:'Plushie Frenzy', time:'Today · 14:03', result:-300, bet:300 },
]
const money = (value:number) => `${value < 0 ? '−' : ''}₱${Math.abs(value).toLocaleString('en-US',{minimumFractionDigits:2,maximumFractionDigits:2})}`
const entries = [
  { id:'personal', label:'Personal information', icon:UserRound },
  { id:'security', label:'Account security', icon:ShieldCheck, status:'2FA on' },
  { id:'verification', label:'Verification', icon:IdCard, status:'Verified' },
  { id:'wallet', label:'Wallet & transactions', icon:Wallet },
  { id:'preferences', label:'Preferences', icon:Settings, status:'English' },
  { id:'help', label:'Help center', icon:Headphones },
]
const information:Record<string,{title:string;text:string}> = {
 personal:{title:'Personal information',text:'Player123 · ID 8891023. This is a sample profile. Account editing is not connected yet.'},
 security:{title:'Account security',text:'“2FA on” is a sample status. Two-factor authentication and password management are not connected in this preview.'},
 verification:{title:'Verification',text:'“Verified” is a sample status, not a completed identity check. Verification services are not available yet.'},
 wallet:{title:'Wallet & transactions',text:'The balances and transactions shown here are demo data. Deposits and withdrawals are not available.'},
 preferences:{title:'Preferences',text:'Language: English. Account preferences will be available when account services launch.'},
 help:{title:'Help center',text:'This is a design preview. Games, deposits and account services are not live. Your game favorites are saved only in this browser.'},
 notifications:{title:'Notifications',text:'Welcome to your account preview. Notifications will appear here when account services launch. There are no live account alerts.'},
 benefits:{title:'VIP benefits',text:'VIP 3 and the progress toward VIP 4 are sample values. Benefits and eligibility will be announced when the VIP program launches.'},
}
export default function My() {
 const [period,setPeriod]=useState<keyof typeof periods>('This month')
 const [panel,setPanel]=useState<string|null>(null),[copied,setCopied]=useState('')
 const dialog=useRef<HTMLDialogElement>(null),opener=useRef<HTMLElement|null>(null),release=useRef<(()=>void)|null>(null)
 const location=useLocation(),navigate=useNavigate()
 useEffect(()=>{const p=new URLSearchParams(location.search).get('panel'); if(p==='notifications'||p==='preferences'){ opener.current=document.activeElement as HTMLElement;setPanel(p) }},[location.key,location.search])
 useEffect(()=>{if(!panel)return;const el=dialog.current,old=document.body.style.overflow;document.body.style.overflow='hidden';el?.showModal();let done=false;const cleanup=()=>{if(done)return;done=true;el?.close();document.body.style.overflow=old;if(opener.current?.isConnected)opener.current.focus({preventScroll:true})};release.current=cleanup;return cleanup},[!!panel])
 function open(id:string){opener.current=document.activeElement as HTMLElement;setPanel(id)}
 function close(){release.current?.();setPanel(null);if(location.search)navigate('/my',{replace:true})}
 async function copy(){try{await navigator.clipboard.writeText(account.id);setCopied('ID copied.')}catch{setCopied('Unable to copy. Select the ID below to copy it manually.')}}
 const selected=panel?.startsWith('history-')?history.find(h=>h.id===panel.slice(8)):undefined
 const title=selected?.name??(panel==='history'?'Game History':panel==='logout'?'Leave account preview?':information[panel??'']?.title??'Account')
 return <main className="kk-main my-main">
   <div className="my-heading"><div><h1>My</h1><p>Your account, all in one place.</p></div><span className="my-preview">PREVIEW</span></div>
   <section className="my-profile" aria-label="Profile and VIP"><div className="my-person"><div className="my-avatar"><img src={`${import.meta.env.BASE_URL}welcome/chicken-gifts.webp`} alt="Player avatar" /></div><div><h2>{account.name}</h2><div className="my-id">ID {account.id}<button aria-label="Copy account ID" onClick={copy}><Copy size={14}/></button></div></div><button className="my-edit" aria-label="Edit profile" onClick={()=>open('personal')}><Edit3 size={20}/></button></div>{copied&&<div role="status" className="my-copy-status">{copied}{copied.startsWith('Unable')&&<input aria-label="Account ID to copy" readOnly value={account.id} onFocus={e=>e.target.select()}/>}</div>}<div className="my-vip"><div className="my-vip-title"><h3><span><Crown size={23}/></span>VIP {account.vip}</h3><button onClick={()=>open('benefits')}>View benefits<ChevronRight size={15}/></button></div><div className="my-progress-label"><span>Progress to VIP 4</span><span>{account.points.toLocaleString('en-US')} / {account.next.toLocaleString('en-US')}</span></div><progress value={account.points} max={account.next} aria-label="Demo VIP progress"/><p>{(account.next-account.points).toLocaleString('en-US')} points to your next level</p></div></section>
   <section aria-labelledby="my-statistics"><div className="my-section-heading"><h2 id="my-statistics"><BarChart3 size={21}/>My Statistics</h2><select aria-label="Statistics period" value={period} onChange={e=>setPeriod(e.target.value as keyof typeof periods)}>{Object.keys(periods).map(p=><option key={p}>{p}</option>)}</select></div><div className="my-stats">{[{label:'Total deposit',icon:Download},{label:'Total withdrawal',icon:Upload},{label:'Total bet',icon:Gamepad2},{label:'Net result',icon:TrendingUp}].map(({label,icon:Icon},i)=><article key={label}><span><Icon size={17}/>{label}</span><strong className={periods[period][i]<0?'negative':i===3?'positive':''}>{money(periods[period][i])}</strong></article>)}</div></section>
   <section aria-labelledby="my-account"><div className="my-section-heading"><h2 id="my-account"><UserRound size={21}/>Account</h2></div><div className="my-menu">{entries.map(({id,label,icon:Icon,status})=><button key={id} aria-label={label} onClick={()=>open(id)}><Icon size={21}/><span>{label}</span>{status&&<small className={id==='verification'?'verified':''}>{status}</small>}<ChevronRight size={16}/></button>)}</div></section>
   <section aria-labelledby="my-history"><div className="my-section-heading"><h2 id="my-history"><History size={21}/>Game History</h2><button onClick={()=>open('history')}>View all<ChevronRight size={15}/></button></div><div className="my-history"><div className="my-history-label"><span>RECENT PLAYS</span><span>NET RESULT</span></div>{history.map(h=><button className="my-history-row" key={h.id} onClick={()=>open(`history-${h.id}`)}><img src={games.find(g=>g.id===h.id)?.image} alt="" width="44" height="44"/><span className="my-history-name"><strong>{h.name}</strong><small>{h.time}</small></span><span className="my-history-result"><strong className={h.result<0?'negative':'positive'}>{h.result>0?'+':''}{money(h.result)}</strong><small>Bet {money(h.bet)}</small></span><ChevronRight size={14}/></button>)}</div></section>
   <button className="my-logout" onClick={()=>open('logout')}><LogOut size={20}/>Log Out</button><p className="my-disclaimer">Design preview · Sample account data</p>
   <dialog className="kk-dialog my-dialog" ref={dialog} aria-labelledby="my-dialog-title" onCancel={e=>{e.preventDefault();close()}} onClick={e=>{if(e.target===e.currentTarget)close()}}>{panel&&<div className="kk-dialog-content"><button className="kk-dialog-close" aria-label="Close account panel" onClick={close}><X size={21}/></button><h2 id="my-dialog-title">{title}</h2><span className="my-preview">SAMPLE ACCOUNT DATA</span>{information[panel]&&<p>{information[panel].text}</p>}{panel==='personal'&&<div className="my-panel-links"><Link to="/login" onClick={()=>release.current?.()}>Log In</Link><Link to="/register" onClick={()=>release.current?.()}>Register</Link><Link to="/frontend?favorites=1" onClick={()=>release.current?.()}>My Favorites</Link></div>}{panel==='help'&&<Link className="my-panel-link" to="/frontend" onClick={()=>release.current?.()}>Back to game lobby</Link>}{panel==='history'&&<><p>All available sample records. Times are illustrative.</p>{history.map(h=><button className="my-record-link" key={h.id} onClick={()=>setPanel(`history-${h.id}`)}>{h.name}<ChevronRight size={16}/></button>)}</>}{selected&&<p>{selected.time}<br/>Bet {money(selected.bet)}<br/>Net result {selected.result>0?'+':''}{money(selected.result)}</p>}{panel==='logout'?<><p>This leaves the design preview and returns to Log In. Your saved favorites will stay in this browser.</p><div className="my-panel-links"><button onClick={close}>Cancel</button><Link to="/login" onClick={()=>release.current?.()}>Leave Preview</Link></div></>:<button className="kk-primary" onClick={close}>Close</button>}</div>}</dialog>
 </main>
}
