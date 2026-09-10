import { useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import { ArrowDownToLine, ArrowUpFromLine, BarChart3, CalendarDays, ChevronRight, Eye, EyeOff, Gift, Headphones, History, TrendingUp, WalletCards, X } from 'lucide-react'
import { balances, statistics, money, filterTransactions, displayDate } from './data'
import type { Category, Period, Transaction } from './data'
import './wallet.css'

function PeriodSelect({label,value,onChange}:{label:string;value:Period;onChange:(period:Period)=>void}) {
  return <select aria-label={label} value={value} onChange={e=>onChange(e.target.value as Period)}>{Object.keys(statistics).map(p=><option key={p}>{p}</option>)}</select>
}
type Panel = 'Deposit' | 'Withdraw' | 'Support' | Transaction | null
export default function Wallet() {
  const [hidden, setHidden] = useState(false)
  const [period, setPeriod] = useState<Period>('This month')
  const [historyPeriod, setHistoryPeriod] = useState<Period>('This month')
  const [category, setCategory] = useState<Category>('All')
  const [expanded, setExpanded] = useState(false)
  const [panel, setPanel] = useState<Panel>(null)
  const dialog = useRef<HTMLDialogElement>(null)
  const opener = useRef<HTMLElement | null>(null)
  const release = useRef<(() => void) | null>(null)
  const isOpen = panel !== null
  useEffect(() => {
    if (!isOpen) return
    const element = dialog.current, old = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    element?.showModal()
    let released = false
    const cleanup = () => {
      if (released) return
      released = true
      element?.close()
      document.body.style.overflow = old
      if (opener.current?.isConnected) opener.current.focus({ preventScroll:true })
    }
    release.current = cleanup
    return cleanup
  }, [isOpen])
  const open = (value: Panel, target: HTMLElement) => { opener.current = target; setPanel(value) }
  const close = () => { release.current?.(); setPanel(null) }
  const stats = statistics[period]
  const filtered = filterTransactions(category, historyPeriod)
  const selected = typeof panel === 'object' ? panel : null
  const title = selected?.title ?? (panel === 'Support' ? 'Transaction support' : typeof panel === 'string' ? panel : '')
  const visibleMoney = (value:number) => hidden ? '••••••' : money(value)

  return <main className="kk-main wallet-main">
    <div className="wallet-heading"><div><h1>Wallet</h1><p>Your money, all in one place.</p></div><span className="wallet-preview">PREVIEW</span></div>
    <section className="wallet-balance wallet-card" aria-label="Wallet balances">
      <div className="wallet-total-label"><span>Total balance</span><button aria-label={hidden ? 'Show balances' : 'Hide balances'} aria-pressed={hidden} onClick={() => setHidden(!hidden)}>{hidden ? <EyeOff size={17}/> : <Eye size={17}/>}</button><span className="wallet-currency">PHP</span></div>
      <strong className="wallet-total">{visibleMoney(balances.cash + balances.promo)}</strong>
      <div className="wallet-split">{[{ label:'Cash wallet', amount:balances.cash, value:8000, max:10000, icon:WalletCards }, { label:'Promo wallet', amount:balances.promo, value:1500, max:5000, icon:Gift }].map(({label,amount,value,max,icon:Icon},i) => <div key={label} className={i ? 'wallet-promo-balance' : ''}><div className="wallet-sub-label"><Icon size={19}/>{label}</div><strong>{visibleMoney(amount)}</strong><p>Wager requirement</p><progress aria-label={`${label} demo wager progress`} value={value} max={max}/><small>{hidden ? '•••• / ••••' : `₱${value.toLocaleString('en-US')} / ₱${max.toLocaleString('en-US')}`}</small></div>)}</div>
      <div className="wallet-actions"><button className="wallet-deposit" onClick={e => open('Deposit',e.currentTarget)}><ArrowDownToLine size={21}/>Deposit</button><button onClick={e => open('Withdraw',e.currentTarget)}><ArrowUpFromLine size={21}/>Withdraw</button></div>
    </section>
    <section aria-labelledby="wallet-stats-title"><div className="wallet-section-heading"><h2 id="wallet-stats-title"><BarChart3 size={22}/>My Statistics</h2><PeriodSelect label="Wallet statistics period" value={period} onChange={setPeriod}/></div><div className="wallet-stats">{[{label:'Total deposit',value:stats.deposit,icon:ArrowDownToLine},{label:'Total withdrawal',value:stats.withdrawal,icon:ArrowUpFromLine},{label:'Net deposit',value:stats.deposit-stats.withdrawal,icon:TrendingUp},{label:'Promo rewards',value:stats.rewards,icon:Gift}].map(({label,value,icon:Icon}) => <article className="wallet-card" key={label} aria-label={label}><span><Icon size={19}/>{label}</span><strong>{money(value)}</strong></article>)}</div></section>
    <section aria-labelledby="wallet-history-title"><div className="wallet-section-heading"><h2 id="wallet-history-title"><History size={22}/>Transaction History</h2><button aria-expanded={expanded} onClick={() => setExpanded(!expanded)}>{expanded ? 'View less' : 'View all'}<ChevronRight size={15}/></button></div>
      <div className="wallet-tabs" role="group" aria-label="Transaction type">{(['All','Deposit','Withdraw','Promo'] as Category[]).map(c => <button key={c} aria-pressed={category===c} onClick={() => {setCategory(c);setExpanded(false)}}>{c}</button>)}</div>
      <div className="wallet-history wallet-card"><div className="wallet-history-label"><span>RECENT TRANSACTIONS</span><div><CalendarDays size={14}/><PeriodSelect label="Transaction period" value={historyPeriod} onChange={value=>{setHistoryPeriod(value);setExpanded(false)}}/></div></div>
      {filtered.length ? (expanded ? filtered : filtered.slice(0,5)).map(t => { const Icon = t.title==='Daily check-in' ? CalendarDays : t.category==='Deposit' ? ArrowDownToLine : t.category==='Withdraw' ? ArrowUpFromLine : Gift; return <button className="wallet-transaction" key={t.id} onClick={e => open(t,e.currentTarget)}><span className={`wallet-transaction-icon ${t.category.toLowerCase()} ${t.title==='Daily check-in' ? 'check-in' : ''}`}><Icon size={23}/></span><span className="wallet-transaction-name"><strong>{t.title}</strong><small>{t.channel} · {displayDate(t)}</small></span><span className="wallet-transaction-result"><strong className={t.amount>0 ? 'wallet-positive' : ''}>{t.amount>0 ? '+' : ''}{money(t.amount)}</strong><small className={t.status==='Pending' ? 'wallet-pending' : ''}>{t.status==='Pending' ? '• ' : ''}{t.status}</small></span><ChevronRight size={15}/></button> }) : <p className="wallet-empty" role="status">No transactions for this filter.</p>}</div>
    </section>
    <button className="wallet-support wallet-card" onClick={e => open('Support',e.currentTarget)}><Headphones size={25}/><span>Need help with a transaction?<small>Contact our support team</small></span><ChevronRight size={18}/></button>
    <p className="wallet-disclaimer">Design preview · Sample wallet data</p>
    <dialog ref={dialog} className="kk-dialog wallet-dialog" aria-labelledby="wallet-dialog-title" onCancel={e => {e.preventDefault();close()}} onClick={e => {if(e.target===e.currentTarget)close()}}>{panel && <div className="kk-dialog-content"><button className="kk-dialog-close" aria-label="Close wallet panel" onClick={close}><X size={21}/></button><h2 id="wallet-dialog-title">{title}</h2><span className="wallet-preview">SAMPLE WALLET DATA</span>{selected ? <><p>Illustrative transaction · No funds were moved.</p><dl className="wallet-detail">{[['Reference',selected.id],['Amount',`${selected.amount>0 ? '+' : ''}${money(selected.amount)}`],['Status',selected.status],['Channel',selected.channel],['Date',`${selected.date} ${selected.time}`]].map(([label,value]) => <div key={label}><dt>{label}</dt><dd>{value}</dd></div>)}</dl></> : panel==='Support' ? <><h3>Why is a withdrawal pending?</h3><p>Pending is a sample status in this preview. No withdrawal has been submitted.</p><h3>Where can I find transaction details?</h3><p>Select a transaction in your history to view its reference and details. Live customer support is not connected yet.</p></> : <><p>{panel==='Deposit' ? 'Deposit services are coming soon.' : 'Withdrawal services are coming soon.'} This preview does not accept payments or submit withdrawals. Your sample balance will stay unchanged.</p><div className="wallet-panel-links"><Link to="/login" onClick={() => release.current?.()}>Log In</Link><Link to="/register" onClick={() => release.current?.()}>Register</Link></div></>}<button className="kk-primary" onClick={close}>Close</button></div>}</dialog>
  </main>
}
