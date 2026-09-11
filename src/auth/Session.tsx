import { createContext, useCallback, useContext, useEffect, useRef, useState } from 'react'
import type { ReactNode } from 'react'
import { Check, X } from 'lucide-react'
import './session.css'

type Notice = { id:number; text:string; kind:'success'|'error' }
type Session = { signedIn:boolean; unread:boolean; read:()=>void; login:()=>void; logout:()=>void; notify:(text:string,kind?:Notice['kind'])=>void }
const Context = createContext<Session | null>(null)
export function useSession() { const value=useContext(Context); if(!value) throw new Error('SessionProvider required'); return value }
function Toast({notice,remove}:{notice:Notice;remove:(id:number)=>void}) {
  const [hover,setHover]=useState(false), [focus,setFocus]=useState(false)
  const remaining=useRef(4000)
  useEffect(()=>{
    if(hover||focus) return
    const start=Date.now(), timer=window.setTimeout(()=>remove(notice.id),remaining.current)
    return ()=>{ window.clearTimeout(timer); remaining.current=Math.max(0,remaining.current-(Date.now()-start)) }
  },[hover,focus,notice.id,remove])
  return <div className={`session-toast ${notice.kind}`} onMouseEnter={()=>setHover(true)} onMouseLeave={()=>setHover(false)} onFocusCapture={()=>setFocus(true)} onBlurCapture={e=>{if(!e.currentTarget.contains(e.relatedTarget))setFocus(false)}}>
    <span className="toast-symbol" aria-hidden="true">{notice.kind==='success'?<Check size={14}/>:<svg width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M8 3.5V8.5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"/><circle cx="8" cy="11.7" r="1" fill="currentColor"/></svg>}</span><span role="status">{notice.text}</span><button aria-label="Dismiss notification" onClick={()=>remove(notice.id)}><X size={18}/></button>
  </div>
}
export function SessionProvider({children}:{children:ReactNode}) {
  const [signedIn,setSignedIn]=useState(false),[unread,setUnread]=useState(true),[notices,setNotices]=useState<Notice[]>([])
  const serial=useRef(0)
  const notify=useCallback((text:string,kind:Notice['kind']='success')=>{ const id=++serial.current; setNotices(items=>[...items,{id,text,kind}]) },[])
  const remove=useCallback((id:number)=>setNotices(items=>items.filter(item=>item.id!==id)),[])
  return <Context.Provider value={{signedIn,unread,read:()=>setUnread(false),notify,login:()=>{setSignedIn(true);setUnread(true);notify('Demo sign-in successful · Preview only')},logout:()=>{setSignedIn(false);notify('Logged out successfully.')}}}>
    {children}<aside className="session-toasts" aria-label="Notifications">{notices.map(notice=><Toast key={notice.id} notice={notice} remove={remove}/>)}</aside>
  </Context.Provider>
}
