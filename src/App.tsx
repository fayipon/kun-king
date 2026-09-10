import { useEffect, useState } from 'react'
import { Link, NavLink, Route, Routes, useLocation } from 'react-router-dom'
import { ArrowUpRight, ArrowLeft, Crown, Gamepad2, LayoutDashboard, Layers3, Box, CircleHelp } from 'lucide-react'
import Landing from './landing/Landing'

function Home() {
  return <>
    <section className="intro"><div className="eyebrow"><span /> YOUR NEXT CHAPTER STARTS HERE</div>
      <h1>每段旅程，<br />都有一個<span className="serif">起點。</span></h1>
      <p>歡迎來到 Kun King。<br className="mobile-break" />選擇你的入口，開始探索或管理你的世界。</p>
    </section>
    <section className="entry-grid" aria-label="選擇項目入口">
      <Link className="entry player" to="/frontend">
        <div className="card-top"><span className="card-icon"><Gamepad2 size={25} /></span><span className="entry-number">01 / PLAY</span></div>
        <div className="landscape" aria-hidden="true"><div className="sun" /><div className="mountain back" /><div className="mountain front" /><div className="trail" /><div className="flag">⚑</div></div>
        <div className="card-content"><div className="eyebrow">THE PLAYER EXPERIENCE</div><h2>進入前台</h2><p>讓好奇心帶路，展開你的遊戲旅程。</p><div className="card-bottom"><span>探索遊戲世界</span><span className="round-arrow"><ArrowUpRight size={21} /></span></div></div>
      </Link>
      <Link className="entry admin" to="/admin">
        <div className="card-top"><span className="card-icon"><LayoutDashboard size={24} /></span><span className="entry-number">02 / MANAGE</span></div>
        <div className="dashboard-art" aria-hidden="true"><div className="mock-sidebar"><i /><i /><i /><i /></div><div className="mock-body"><div className="mock-title" /><div className="mock-tiles"><i /><i /><i /></div><div className="mock-chart"><i /><i /><i /><i /><i /><i /><i /></div></div><div className="floating-tile"><Layers3 size={24} /></div></div>
        <div className="card-content"><div className="eyebrow">THE CREATOR WORKSPACE</div><h2>進入後台</h2><p>從這裡開始，打造與管理每一個細節。</p><div className="card-bottom"><span>前往管理空間</span><span className="round-arrow"><ArrowUpRight size={21} /></span></div></div>
      </Link>
    </section>
    <div className="portal-note"><CircleHelp size={15} /><span>遊玩與探索請選擇前台；項目管理請選擇後台。</span></div>
  </>
}

function Frontend() {
  const [status, setStatus] = useState<'checking' | 'ready' | 'missing'>('checking')
  const [started, setStarted] = useState(false)
  const gameUrl = `${import.meta.env.BASE_URL}game/index.html`
  useEffect(() => {
    const controller = new AbortController()
    // Vite falls back to the SPA for missing HTML, so verify Godot's engine script too.
    fetch(`${import.meta.env.BASE_URL}game/index.js`, { signal: controller.signal })
      .then(response => setStatus(response.ok && /javascript/.test(response.headers.get('content-type') ?? '') ? 'ready' : 'missing'))
      .catch(() => { if (!controller.signal.aborted) setStatus('missing') })
    return () => controller.abort()
  }, [])
  return <section className="subpage"><Link className="back-link" to="/"><ArrowLeft size={16} />返回項目入口</Link>
    <div className="eyebrow">PLAYER SPACE</div><h1>你的旅程，從這裡開始。</h1><p>歡迎來到 Kun King 遊戲前台。</p>
    <div className="game-panel">{started ? <iframe title="Kun King Godot 遊戲" src={gameUrl} allow="fullscreen; autoplay" allowFullScreen /> : <div className="empty-state"><Gamepad2 size={42} /><h2>{status === 'ready' ? '世界已就緒' : status === 'checking' ? '正在確認遊戲資源…' : '遊戲世界，準備中'}</h2><p>{status === 'ready' ? '開啟 Godot 示範場景，開始探索。' : status === 'missing' ? '前台已建立。完成 Godot Web 匯出後，即可在這裡啟動遊戲。' : '請稍候。'}</p>{status === 'ready' && <button onClick={() => setStarted(true)}>啟動遊戲 <ArrowUpRight size={18} /></button>}</div>}</div>
  </section>
}

function Admin() {
  return <section className="subpage"><Link className="back-link" to="/"><ArrowLeft size={16} />返回項目入口</Link><div className="eyebrow">CREATOR SPACE</div><h1>管理你的世界。</h1><p>Kun King 項目工作空間，從基礎開始逐步成形。</p>
    <div className="notice">開發預覽 · 尚未串接登入驗證與後端服務</div>
    <div className="admin-grid">{[{ icon: Gamepad2, title: '遊戲內容', text: '管理場景、關卡與遊戲資源。' }, { icon: Layers3, title: '項目設定', text: '配置項目資訊與遊戲參數。' }, { icon: Box, title: '資源管理', text: '整理美術、音效與發布資源。' }].map(({ icon: Icon, title, text }) => <article className="module" key={title}><Icon size={26} /><h2>{title}</h2><p>{text}</p><span className="planned">規劃中</span></article>)}</div>
  </section>
}

export default function App() {
  const { pathname } = useLocation()
  useEffect(() => { document.title = `Kun King · ${pathname === '/' ? '項目入口' : pathname === '/frontend' ? '遊戲大廳' : pathname === '/play' ? 'Godot 示範' : pathname === '/admin' ? '管理後台' : '找不到頁面'}`; window.scrollTo(0, 0) }, [pathname])
  if (pathname === '/frontend') return <Landing />
  return <div className="app-shell"><header><Link className="brand" to="/" aria-label="Kun King 首頁"><span className="brand-mark"><Crown size={22} /></span>KUN KING<span className="brand-divider" /><span className="brand-caption">項目空間</span></Link><nav aria-label="主要導覽"><NavLink to="/" end>項目入口</NavLink><span className="version">V 0.1</span></nav></header>
    <main><Routes><Route path="/" element={<Home />} /><Route path="/play" element={<Frontend />} /><Route path="/admin" element={<Admin />} /><Route path="*" element={<section className="subpage"><h1>找不到這個頁面。</h1><Link className="back-link" to="/">返回項目入口 <ArrowUpRight size={18} /></Link></section>} /></Routes></main>
    <footer><span>© {new Date().getFullYear()} Kun King</span><span className="footer-tag">一個世界，無限可能。<span className="tiny-star">✳</span></span><span>BUILT WITH REACT + GODOT</span></footer>
  </div>
}
