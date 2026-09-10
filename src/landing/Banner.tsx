import { useEffect, useRef, useState } from 'react'
import type { CSSProperties, PointerEvent } from 'react'
import { ArrowRight, Pause, Play } from 'lucide-react'

const banners = [
  { image: 'crown', label: 'WELCOME TO YOUR KINGDOM', title: <>你的主場，<br /><em>現在開啟。</em></>, description: '一起探索 Kun King 的精彩世界', cta: '探索遊戲' },
  { image: 'arcade', label: 'FIND YOUR NEXT FAVORITE', title: <>精彩好玩，<br /><em>一次收藏。</em></>, description: '發現你的下一款心動之作', cta: '查看精選' },
  { image: 'portal', label: 'A NEW ADVENTURE AWAITS', title: <>下一段冒險，<br /><em>等你登場。</em></>, description: '探索新面孔，找到新樂趣', cta: '探索新作' },
]
type Gesture = { id: number; x: number; y: number; width: number; dx: number; axis: 'pending' | 'x' | 'y' }

export default function Banner({ onExplore }: { onExplore: (index: number) => void }) {
  const [index, setIndex] = useState(0)
  const [paused, setPaused] = useState(false)
  const [hovered, setHovered] = useState(false)
  const [focused, setFocused] = useState(false)
  const [hidden, setHidden] = useState(document.hidden)
  const [reduced, setReduced] = useState(() => matchMedia('(prefers-reduced-motion: reduce)').matches)
  const [cycle, setCycle] = useState(0)
  const [drag, setDrag] = useState(0)
  const [dragging, setDragging] = useState(false)
  const gesture = useRef<Gesture | null>(null)
  const stage = useRef<HTMLDivElement>(null)
  const suppressClick = useRef(false)
  const stopped = paused || hovered || focused || hidden || reduced || dragging

  function cancelGesture() {
    const current = gesture.current
    gesture.current = null
    if (current && stage.current?.hasPointerCapture?.(current.id)) stage.current.releasePointerCapture(current.id)
    setDrag(0)
    setDragging(false)
    setCycle(value => value + 1)
  }

  useEffect(() => {
    const media = matchMedia('(prefers-reduced-motion: reduce)')
    const onMotion = () => { setReduced(media.matches); cancelGesture() }
    const onVisibility = () => { setHidden(document.hidden); if (document.hidden) cancelGesture() }
    const onBlur = () => { setHovered(false); cancelGesture() }
    media.addEventListener('change', onMotion)
    document.addEventListener('visibilitychange', onVisibility)
    window.addEventListener('blur', onBlur)
    return () => {
      media.removeEventListener('change', onMotion)
      document.removeEventListener('visibilitychange', onVisibility)
      window.removeEventListener('blur', onBlur)
    }
  }, [])

  useEffect(() => {
    if (stopped) return
    const timer = window.setTimeout(() => setIndex(value => (value + 1) % banners.length), 5000)
    return () => window.clearTimeout(timer)
  }, [index, stopped, cycle])

  function select(next: number) {
    cancelGesture()
    setIndex((next + banners.length) % banners.length)
  }

  function pointerDown(event: PointerEvent<HTMLDivElement>) {
    if (!event.isPrimary || event.button !== 0 || gesture.current) return
    suppressClick.current = false
    gesture.current = { id: event.pointerId, x: event.clientX, y: event.clientY, width: event.currentTarget.getBoundingClientRect().width || 350, dx: 0, axis: 'pending' }
    setDragging(true)
  }

  function pointerMove(event: PointerEvent<HTMLDivElement>) {
    const current = gesture.current
    if (!current || current.id !== event.pointerId) return
    const dx = event.clientX - current.x
    const dy = event.clientY - current.y
    if (current.axis === 'pending' && Math.max(Math.abs(dx), Math.abs(dy)) > 8) {
      current.axis = Math.abs(dx) > Math.abs(dy) * 1.2 ? 'x' : 'y'
      if (current.axis === 'x') event.currentTarget.setPointerCapture?.(event.pointerId)
    }
    if (current.axis !== 'x') return
    suppressClick.current = true
    current.dx = Math.max(-current.width, Math.min(current.width, dx))
    if (!reduced) setDrag(current.dx)
  }

  function pointerUp(event: PointerEvent<HTMLDivElement>) {
    const current = gesture.current
    if (!current || current.id !== event.pointerId) return
    const threshold = Math.min(80, Math.max(45, current.width * .2))
    const next = current.axis === 'x' && Math.abs(current.dx) >= threshold
      ? index + (current.dx < 0 ? 1 : -1) : index
    select(next)
  }

  return <section className={`kk-carousel ${dragging && drag ? 'is-dragging' : ''}`} aria-label="精選主題輪播" aria-roledescription="輪播" tabIndex={0}
    onMouseEnter={() => setHovered(true)} onMouseLeave={() => setHovered(false)}
    onFocusCapture={() => setFocused(true)}
    onBlurCapture={event => { if (!event.currentTarget.contains(event.relatedTarget)) setFocused(false) }}
    onKeyDown={event => {
      if (event.key === 'Enter' || event.key === ' ') suppressClick.current = false
      if (event.key === 'ArrowLeft' || event.key === 'ArrowRight') { event.preventDefault(); select(index + (event.key === 'ArrowRight' ? 1 : -1)) }
    }}>
    <div ref={stage} className="kk-banner-stage" onPointerDown={pointerDown} onPointerMove={pointerMove} onPointerUp={pointerUp}
      onPointerCancel={cancelGesture} onLostPointerCapture={() => { if (gesture.current) cancelGesture() }}
      onPointerLeave={() => { if (gesture.current && gesture.current.axis !== 'x') cancelGesture() }}
      onDragStart={event => event.preventDefault()}
      onClickCapture={event => { if (suppressClick.current) { event.preventDefault(); event.stopPropagation(); suppressClick.current = false } }}>
      {banners.map((banner, item) => {
        const position = ((item - index + banners.length + 1) % banners.length) - 1
        return <article key={banner.image} className={`kk-banner kk-banner-${banner.image} ${item === index ? 'is-active' : ''}`}
          style={{ '--slide-position': position, '--drag-x': `${drag}px` } as CSSProperties}
          aria-hidden={item !== index} inert={item !== index} aria-label={`${item + 1} / 3`}>
          <img src={`${import.meta.env.BASE_URL}banners/${banner.image}.webp`} alt="" draggable={false} width="960" height="436" fetchPriority={item === 0 ? 'high' : 'auto'} />
          <div className="kk-banner-glow" aria-hidden="true" />
          <div className="kk-banner-copy"><span>{banner.label}</span><h1>{banner.title}</h1><p>{banner.description}</p>
            <button className="kk-primary" onClick={() => onExplore(item)}>{banner.cta}<ArrowRight size={14} /></button>
          </div>
        </article>
      })}
    </div>
    <div className="kk-dots">{banners.map((banner, item) => <button key={banner.image} aria-label={`顯示第 ${item + 1} 張 Banner`} aria-pressed={index === item} onClick={() => select(item)}><span /></button>)}</div>
    <button className="kk-banner-pause" aria-label={paused ? '播放輪播' : '暫停輪播'} aria-pressed={paused} disabled={reduced} onClick={() => setPaused(value => !value)}>{paused || reduced ? <Play size={12} /> : <Pause size={12} />}</button>
  </section>
}
