import { useEffect, useRef, useState } from 'react'
import type { FormEvent } from 'react'
import { useSession } from './Session'
import { welcomeVisit } from '../landing/WelcomeModal'
import { Link, useNavigate } from 'react-router-dom'
import { ArrowRight, Crown, Eye, EyeOff, LockKeyhole, Mail, UserRound, X } from 'lucide-react'
import './auth.css'

const rememberKey = 'kun-king:login-name'
function savedName() { try { return localStorage.getItem(rememberKey) ?? '' } catch { return '' } }
type Fields = 'identity' | 'username' | 'email' | 'password' | 'confirm' | 'terms'

export default function Auth({ register }: { register: boolean }) {
  const session = useSession(), navigate = useNavigate()
  const [identity, setIdentity] = useState(savedName)
  const [remember, setRemember] = useState(() => !!savedName())
  const [visible, setVisible] = useState<Record<string, boolean>>({})
  const [errors, setErrors] = useState<Partial<Record<Fields, string>>>({})
  const [status, setStatus] = useState('')
  const [notice, setNotice] = useState<{ title: string; text: string } | null>(null)
  const dialog = useRef<HTMLDialogElement>(null)
  const opener = useRef<HTMLElement | null>(null)
  useEffect(() => {
    const lang = document.documentElement.lang
    document.documentElement.lang = 'en'; document.body.classList.add('auth-body')
    return () => { document.documentElement.lang = lang; document.body.classList.remove('auth-body') }
  }, [])
  useEffect(() => { if (notice) dialog.current?.showModal() }, [notice])
  function info(title: string, text: string) { opener.current = document.activeElement as HTMLElement; setNotice({ title, text }) }
  function close() { dialog.current?.close(); setNotice(null); opener.current?.focus() }
  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault(); setStatus('')
    const form = event.currentTarget, data = new FormData(form), next: Partial<Record<Fields, string>> = {}
    const value = (key: string) => String(data.get(key) ?? '')
    if (register) {
      if (!value('username').trim()) next.username = 'Enter your username.'
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value('email').trim())) next.email = 'Enter a valid email address.'
      if (value('password').length < 8) next.password = 'Use at least 8 characters.'
      if (!value('confirm') || value('confirm') !== value('password')) next.confirm = 'Passwords must match.'
      if (!data.has('terms')) next.terms = 'Please agree to the terms to continue.'
    } else {
      if (!value('identity').trim()) next.identity = 'Enter your email or username.'
      if (!value('password')) next.password = 'Enter your password.'
    }
    setErrors(next)
    const first = Object.keys(next)[0]
    if (first) { if (!register) session.notify('Please check your login details.', 'error'); (form.elements.namedItem(first) as HTMLInputElement)?.focus(); return }
    if (!register) {
      try { if (remember) localStorage.setItem(rememberKey, identity.trim()); else localStorage.removeItem(rememberKey) } catch { /* Form remains usable without storage. */ }
    }
    if (!register) { session.login(); welcomeVisit.dismissed = true; navigate('/frontend'); return }
    setStatus('Account creation is not connected yet. No account has been created.')
  }
  const field = (name: Exclude<Fields, 'terms'>, label: string, type = 'text') => {
    const secret = type === 'password', Icon = secret ? LockKeyhole : name === 'username' ? UserRound : Mail
    return <div className="auth-field"><label htmlFor={`auth-${name}`} className="auth-sr">{label}</label>
      <div className={`auth-input ${errors[name] ? 'has-error' : ''}`}><Icon size={19} aria-hidden="true" />
        <input id={`auth-${name}`} name={name} type={secret && visible[name] ? 'text' : type} placeholder={label} required
          autoComplete={name === 'identity' || name === 'username' ? 'username' : name === 'email' ? 'email' : register ? 'new-password' : 'current-password'}
          {...(name === 'identity' ? { value: identity, onChange: (e: React.ChangeEvent<HTMLInputElement>) => setIdentity(e.target.value) } : {})}
          aria-invalid={!!errors[name]} aria-describedby={errors[name] ? `error-${name}` : undefined} />
        {secret && <button type="button" aria-label={`${visible[name] ? 'Hide' : 'Show'} ${label.toLowerCase()}`} aria-pressed={!!visible[name]} onClick={() => setVisible(v => ({ ...v, [name]: !v[name] }))}>{visible[name] ? <EyeOff size={18} /> : <Eye size={18} />}</button>}
      </div>{errors[name] && <p className="auth-error" id={`error-${name}`}>{errors[name]}</p>}
    </div>
  }
  return <div className={`auth-page ${register ? 'auth-register' : 'auth-login'}`}>
    <div className="auth-art" aria-hidden="true"><div className="auth-glow purple" /><div className="auth-glow mint" /></div>
    <header className="auth-header"><Link to="/frontend" className="auth-brand" aria-label="Kun King game lobby"><span><Crown size={27} /></span><div>KUN<b>KING</b><small>YOUR PLAYGROUND</small></div></Link><div className="auth-header-actions"><span className="auth-motto">PLAY <i>•</i> WIN <i>•</i> BELONG</span></div></header>
    <main className="auth-main">
      <section className="auth-hero" aria-label={register ? 'Create your account' : 'Welcome to Kun King'}>{register ? <><h1>Create<br /><em>Account</em></h1><p>Get in. Play more.<br />A bigger playground awaits.</p></> : <p className="auth-tagline">Good games.<br /><em>Brighter days.</em></p>}</section>
      {register && <ol className="auth-steps" aria-label="Registration steps">{[['Create Account', 'Quick & Easy'], ['Verify Account', 'Secure Your Play'], ['Start Playing', 'Explore & Enjoy']].map(([title, text], i) => <li key={title} aria-current={i === 0 ? 'step' : undefined}><span>{i + 1}</span><strong>{title}</strong><small>{text}</small></li>)}</ol>}
      <section className="auth-panel" aria-label={register ? 'Registration form' : 'Login form'}>
        <Link className="auth-close" to="/frontend" aria-label="Back to game lobby"><X size={18} aria-hidden="true" /></Link>
        {!register && <div className="auth-panel-title"><h1>Welcome back</h1><p>Sign in to continue your adventure</p></div>}
        <form onSubmit={submit} noValidate>
          {register ? <>{field('username', 'Username')}{field('email', 'Email Address', 'email')}</> : field('identity', 'Email or Username')}
          {field('password', 'Password', 'password')}{register && field('confirm', 'Confirm Password', 'password')}
          {register ? <><div className="auth-check-row"><input id="auth-terms" name="terms" type="checkbox" aria-invalid={!!errors.terms} aria-describedby={errors.terms ? 'error-terms' : undefined} /><label htmlFor="auth-terms">I agree to the</label><button type="button" className="auth-text-link" onClick={() => info('Terms & Privacy Policy', 'Our full terms and privacy policy will be available before account registration opens.')}>Terms & Privacy Policy</button></div>{errors.terms && <p className="auth-error" id="error-terms">{errors.terms}</p>}</> : <><div className="auth-options"><label><input type="checkbox" checked={remember} onChange={e => { setRemember(e.target.checked); if (!e.target.checked) { try { localStorage.removeItem(rememberKey) } catch { /* optional storage */ } } }} />Remember me</label><button type="button" className="auth-text-link" onClick={() => info('Forgot password?', 'Password recovery is not available yet. It will be enabled when account services launch.')}>Forgot password?</button></div><p className="auth-remember-note">Remembers your email or username only.</p></>}
          <button className="auth-primary" type="submit">{register ? 'Create Account' : 'Log In'}<ArrowRight size={20} /></button>
          {status && <p className="auth-status" role="status">{status}</p>}
        </form>

        <div className="auth-divider"><span />or continue with<span /></div>
        <div className="auth-socials">{['Google', 'Apple', 'Facebook'].map(provider => <button key={provider} aria-label={`Continue with ${provider}`} onClick={() => info(`Continue with ${provider}`, `${provider} sign-in is not connected yet. You can continue as a guest.`)}><span className={`provider-${provider.toLowerCase()}`} aria-hidden="true">{provider === 'Google' ? 'G' : provider === 'Facebook' ? 'f' : <svg viewBox="0 0 24 24"><path fill="currentColor" d="M17.2 12.5c0-2 1.6-3 1.7-3.1-1-1.4-2.5-1.6-3-1.6-1.3-.1-2.5.8-3.1.8-.7 0-1.7-.8-2.8-.8-1.4 0-2.7.8-3.4 2-1.5 2.5-.4 6.3 1 8.3.7 1 1.5 2.1 2.6 2.1 1 0 1.4-.7 2.8-.7 1.3 0 1.7.7 2.8.7s1.8-1 2.5-2c.8-1.2 1.2-2.4 1.2-2.5-.1 0-2.3-.9-2.3-3.2ZM15 6.4c.6-.8 1.1-1.9 1-3-.9.1-2 .7-2.7 1.4-.6.7-1.2 1.8-1.1 2.9 1 .1 2.1-.5 2.8-1.3Z" /></svg>}</span></button>)}</div>
        {register ? <p className="auth-switch">Already have an account? <Link to="/login">Log In</Link></p> : <p className="auth-switch">Don&#39;t have an account? <Link to="/register">Create Account</Link></p>}
      </section>
    </main>
    <dialog className="auth-dialog" ref={dialog} aria-labelledby="auth-notice-title" onCancel={e => { e.preventDefault(); close() }} onClick={e => { if (e.target === e.currentTarget) close() }}>{notice && <><button className="auth-dialog-close" aria-label="Close notice" onClick={close}><X size={21} /></button><h2 id="auth-notice-title">{notice.title}</h2><p>{notice.text}</p><button className="auth-primary" onClick={close}>Got it</button></>}</dialog>
  </div>
}
