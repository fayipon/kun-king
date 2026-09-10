import { useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import { ArrowRight, Crown, Gamepad2, Gift, Sparkles, X } from 'lucide-react'
import './welcome.css'

export const welcomeVisit = { dismissed: false }
function shouldWelcome() { return !welcomeVisit.dismissed }

export default function WelcomeModal() {
  const [open, setOpen] = useState(shouldWelcome)
  const dialog = useRef<HTMLDialogElement>(null)
  const trigger = useRef<HTMLButtonElement>(null)
  const returnTo = useRef<HTMLElement | null>(null)
  useEffect(() => {
    if (!open || !dialog.current) return
    const element = dialog.current
    const overflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    if (!element.open) element.showModal()
    return () => {
      element.close()
      document.body.style.overflow = overflow
      const target = returnTo.current ?? document.querySelector<HTMLElement>('.kk-logo')
      if (target?.isConnected) target.focus({ preventScroll: true })
    }
  }, [open])
  function dismiss() {
    welcomeVisit.dismissed = true
    setOpen(false)
  }
  return <>
    <button className="kk-welcome-trigger" ref={trigger} onClick={() => { returnTo.current = trigger.current; setOpen(true) }}><Gift size={15} />Welcome Rewards</button>
    <dialog className="kk-welcome-dialog" ref={dialog} aria-labelledby="welcome-title" aria-describedby="welcome-description" onCancel={event => { event.preventDefault(); dismiss() }} onClick={event => { if (event.target === event.currentTarget) dismiss() }}>
      <div className="kk-welcome-stage">
        <svg width="0" height="0" className="kk-welcome-filter" aria-hidden="true"><defs><filter id="welcome-clean-alpha" colorInterpolationFilters="sRGB"><feComponentTransfer><feFuncA type="linear" slope="6" intercept="-5" /></feComponentTransfer></filter></defs></svg>
        <img className="kk-welcome-mascot" src={`${import.meta.env.BASE_URL}welcome/chicken-gifts.webp`} alt="" width="720" height="480" />
        <div className="kk-welcome-frame"><div className="kk-welcome-content">
          <button className="kk-welcome-close" aria-label="Close welcome" autoFocus onClick={dismiss}><X size={18} /></button>
          <div className="kk-welcome-brand">KUN<span>KING</span><small>YOUR PLAYGROUND</small></div>
          <h2 id="welcome-title">Welcome Rewards<br /><em>Coming Soon <Crown size={24} /></em></h2>
          <p id="welcome-description">A little extra to look forward to.<br />Create your account and join the fun.</p>
          <div className="kk-welcome-perks">{[{ title: 'Free Spins', icon: Sparkles }, { title: 'Check-in Bonus', icon: Gift }, { title: 'Starter Missions', icon: Gamepad2 }].map(({ title, icon: Icon }) => <div className="kk-welcome-perk" key={title}><Icon size={30} /><strong>{title}</strong><span>Coming soon</span></div>)}</div>
          <Link className="kk-welcome-primary" to="/register" onClick={dismiss}>Create Account<ArrowRight size={18} /></Link>
          <button className="kk-welcome-later" onClick={dismiss}>Maybe Later</button>
        </div></div>
      </div>
    </dialog>
  </>
}
