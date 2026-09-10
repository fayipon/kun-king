import { useEffect, useRef, useState } from 'react'
import { ArrowRight, ChevronLeft, ChevronRight, Pause, Play } from 'lucide-react'

const banners = [
  { image: 'crown', label: 'WELCOME TO YOUR KINGDOM', title: <>你的主場，<br /><em>現在開啟。</em></>, description: '一起探索 Kun King 的精彩世界', cta: '探索遊戲' },
  { image: 'arcade', label: 'FIND YOUR NEXT FAVORITE', title: <>精彩好玩，<br /><em>一次收藏。</em></>, description: '發現你的下一款心動之作', cta: '查看精選' },
  { image: 'portal', label: 'A NEW ADVENTURE AWAITS', title: <>下一段冒險，<br /><em>等你登場。</em></>, description: '探索新面孔，找到新樂趣', cta: '探索新作' },
]

export default function Banner({ onExplore }: { onExplore: (index: number) => void }) {
  const [index, setIndex] = useState(0)
  const [paused, setPaused] = useState(false)
  const [hovered, setHovered] = useState(false)
  const [focused, setFocused] = useState(false)
  const [hidden, setHidden] = useState(document.hidden)
  const [reduced, setReduced] = useState(() => matchMedia('(prefers-reduced-motion: reduce)').matches)
  const [cycle, setCycle] = useState(0)
  const touch = useRef<{x: number; y: number} | null>(null)
  const stopped = paused || hovered || focused || hidden || reduced

  useEffect(() => {
    const media = matchMedia('(prefers-reduced-motion: reduce)')
    const onMotion = () => setReduced(media.matches)
    const onVisibility = () => setHidden(document.hidden)
    media.addEventListener('change', onMotion)
    document.addEventListener('visibilitychange', onVisibility)
    return () => {
      media.removeEventListener('change', onMotion)
      document.removeEventListener('visibilitychange', onVisibility)
    }
  }, [])

  useEffect(() => {
    if (stopped) return
    const timer = window.setTimeout(() => setIndex(value => (value + 1) % banners.length), 5000)
    return () => window.clearTimeout(timer)
  }, [index, stopped, cycle])

  function select(next: number) {
    setIndex((next + banners.length) % banners.length)
    setCycle(value => value + 1)
  }

  return <section className="kk-carousel" aria-label="精選主題輪播" aria-roledescription="輪播"
    onMouseEnter={() => setHovered(true)} onMouseLeave={() => setHovered(false)}
    onFocusCapture={() => setFocused(true)}
    onBlurCapture={event => { if (!event.currentTarget.contains(event.relatedTarget)) setFocused(false) }}>
    <div className="kk-banner-stage"
      onTouchStart={event => { const point = event.touches[0]; touch.current = { x: point.clientX, y: point.clientY } }}
      onTouchCancel={() => { touch.current = null }}
      onTouchEnd={event => {
        if (!touch.current) return
        const dx = event.changedTouches[0].clientX - touch.current.x
        const dy = event.changedTouches[0].clientY - touch.current.y
        if (Math.abs(dx) > 45 && Math.abs(dx) > Math.abs(dy) * 1.5) select(index + (dx < 0 ? 1 : -1))
        touch.current = null
      }}>
      {banners.map((banner, item) => <article key={banner.image} className={`kk-banner kk-banner-${banner.image} ${item === index ? 'is-active' : ''}`}
        aria-hidden={item !== index} inert={item !== index} aria-label={`${item + 1} / 3`}>
        <img src={`${import.meta.env.BASE_URL}banners/${banner.image}.webp`} alt="" width="960" height="436" fetchPriority={item === 0 ? 'high' : 'auto'} />
        <div className="kk-banner-copy"><span>{banner.label}</span><h1>{banner.title}</h1><p>{banner.description}</p>
          <button className="kk-primary" onClick={() => onExplore(item)}>{banner.cta}<ArrowRight size={14} /></button>
        </div>
      </article>)}
    </div>
    <div className="kk-carousel-controls">
      <div className="kk-dots">{banners.map((banner, item) => <button key={banner.image} aria-label={`顯示第 ${item + 1} 張 Banner`} aria-pressed={index === item} onClick={() => select(item)}><span /></button>)}</div>
      <span className="kk-slide-number" aria-live={stopped ? 'polite' : 'off'}>0{index + 1}<i> / 03</i></span>
      <div className="kk-carousel-actions"><button aria-label="上一張 Banner" onClick={() => select(index - 1)}><ChevronLeft size={16} /></button>
        <button aria-label={paused ? '播放輪播' : '暫停輪播'} aria-pressed={paused} disabled={reduced} onClick={() => setPaused(value => !value)}>{paused || reduced ? <Play size={12} /> : <Pause size={12} />}</button>
        <button aria-label="下一張 Banner" onClick={() => select(index + 1)}><ChevronRight size={16} /></button></div>
    </div>
  </section>
}
