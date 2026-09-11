import { useEffect, useLayoutEffect, useRef } from 'react'
import type { CSSProperties, KeyboardEvent } from 'react'
import { Crown, X } from 'lucide-react'
import ChestArt from './ChestArt'
import { previewReward } from './useChestPreview'
import type { ChestPhase } from './useChestPreview'
import './chest.css'

export type ChestOrigin = { x:number; y:number; scale:number }
type Props = { phase:ChestPhase; threshold:number; origin:ChestOrigin; opener:HTMLElement | null; onCancel:()=>void; onClaim:()=>void }
export default function ChestExperience({phase,threshold,origin,opener,onCancel,onClaim}:Props) {
  const dialog = useRef<HTMLDialogElement>(null)
  const reward = phase === 'reward'
  useLayoutEffect(() => {
    const element = dialog.current, old = document.body.style.overflow
    document.body.style.overflow = 'hidden'; element?.showModal()
    const stage = element?.querySelector('.chest-stage')?.getBoundingClientRect()
    const flight = element?.querySelector<HTMLElement>('.chest-flight')
    if (stage && flight) {
      flight.style.setProperty('--origin-x',`${origin.x-stage.left-stage.width/2}px`)
      flight.style.setProperty('--origin-y',`${origin.y-stage.top-stage.height/2}px`)
      const artWidth = Math.min(stage.width,stage.height*155/150)*90/155
      flight.style.setProperty('--origin-scale',String(Math.min(.6,origin.scale/artWidth)))
    }
    element?.querySelector<HTMLButtonElement>('.chest-close')?.focus({preventScroll:true})
    return () => {
      element?.close(); document.body.style.overflow = old
    }
  }, [opener,origin])
  // Wait for the parent to re-enable the launcher before restoring focus.
  useEffect(() => () => {
    const target = opener?.isConnected && !opener.matches(':disabled') ? opener : document.querySelector<HTMLElement>('.chest-reset')
    target?.focus({preventScroll:true})
  }, [opener])
  const keepFocus = (e:KeyboardEvent<HTMLDialogElement>) => {
    if (e.key !== 'Tab') return
    const controls = [...e.currentTarget.querySelectorAll<HTMLButtonElement>('button:not(:disabled)')].filter(b=>!b.closest('[hidden]'))
    const first=controls[0],last=controls[controls.length-1]
    if (e.shiftKey && document.activeElement===first) { e.preventDefault();last?.focus() }
    else if (!e.shiftKey && document.activeElement===last) { e.preventDefault();first?.focus() }
  }
  return <dialog ref={dialog} className={`chest-experience phase-${phase}`} aria-labelledby="chest-title" aria-describedby="chest-preview-note" data-phase={phase}
    onCancel={e=>{e.preventDefault();onCancel()}} onClick={e=>{if(e.target===e.currentTarget)onCancel()}} onKeyDown={keepFocus}>
    <section className={`chest-sheet ${reward?'is-reward':'is-animating'}`}>
      <button className="chest-close" aria-label="Close chest preview" onClick={onCancel}><X size={18}/></button>
      <div className="chest-heading"><span className="chest-kicker">INVITE CHEST · {threshold} INVITES</span><h2 id="chest-title">{reward ? 'Chest Opened!' : 'A little anticipation…'}</h2><p id="chest-preview-note">Preview only · No real reward is issued.</p></div>
      <div className="chest-stage" aria-hidden="true">
        {!reward && <div className="chest-flight" style={{'--origin-x':`${origin.x}px`,'--origin-y':`${origin.y}px`,'--origin-scale':origin.scale} as CSSProperties}>
          <div className="chest-aura"/><div className="chest-motion"><ChestArt/></div>
          <div className="chest-particles">{Array.from({length:12},(_,i)=><i key={i} style={{'--angle':`${i*30}deg`,'--delay':`${i%4*.06}s`} as CSSProperties}/>)}</div>
        </div>}
        {reward && <svg className="chest-reward-art" viewBox="769 292 271 207"><defs><radialGradient id="chest-scene-fade"><stop offset=".66" stopColor="white"/><stop offset="1" stopColor="black"/></radialGradient><mask id="chest-scene-mask"><rect x="769" y="292" width="271" height="207" fill="url(#chest-scene-fade)"/></mask></defs><image href={`${import.meta.env.BASE_URL}chest/reference.png`} width="1448" height="1086" mask="url(#chest-scene-mask)"/></svg>}
      </div>
      <div className="chest-anticipation" hidden={reward}><p role="status">{phase==='lifting'?'Your chest is rising…':phase==='shaking'?'A little shake…': 'Opening your chest…'}</p><small>You can close this preview at any time.</small></div>
      {reward && <div className="chest-reward-content"><div className="chest-prize"><Crown size={28}/><h3>Bonus Reward</h3><strong>₱{previewReward}</strong><p>Sample amount · {threshold} invites chest</p></div><p className="chest-reward-note">A preview of what’s to come.<br/>Claiming uses one sample chest. Wallet stays unchanged.</p><button className="kk-primary chest-claim" onClick={onClaim}>Claim preview <span>→</span></button><button className="chest-later" onClick={onCancel}>Not now</button></div>}
    </section>
  </dialog>
}
