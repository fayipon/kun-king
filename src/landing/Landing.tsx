import { useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import { ArrowLeft, ArrowRight, ChevronDown, ChevronRight, Compass, Crown, Flame, Gamepad2, Grid2X2, Heart, House, Info, Search, Sparkles, X } from 'lucide-react'
import Banner from './Banner'
import { favoriteKey, games, readFavorites } from './games'
import type { Game } from './games'
import './landing.css'

type Filter = 'all' | 'hot' | 'new' | 'featured' | 'favorites'
const categories = [
  { id: 'all', label: '全部遊戲', icon: Gamepad2 },
  { id: 'hot', label: '人氣熱門', icon: Flame },
  { id: 'new', label: '新作探索', icon: Sparkles },
  { id: 'featured', label: '編輯精選', icon: Crown },
] as const

export default function Landing() {
  const [filter, setFilter] = useState<Filter>('all')
  const [query, setQuery] = useState('')
  const [searchOpen, setSearchOpen] = useState(false)
  const [favorites, setFavorites] = useState(readFavorites)
  const [storageError, setStorageError] = useState(false)
  const [selected, setSelected] = useState<Game | null>(null)
  const [expanded, setExpanded] = useState<string[]>([])
  const [nav, setNav] = useState('home')
  const dialog = useRef<HTMLDialogElement>(null)
  const opener = useRef<HTMLButtonElement | null>(null)
  const search = useRef<HTMLInputElement>(null)
  const catalog = useRef<HTMLElement>(null)
  const help = useRef<HTMLElement>(null)
  const categoryBar = useRef<HTMLDivElement>(null)

  useEffect(() => {
    document.body.classList.add('kk-body')
    return () => document.body.classList.remove('kk-body')
  }, [])

  useEffect(() => {
    try { localStorage.setItem(favoriteKey, JSON.stringify(favorites)); setStorageError(false) }
    catch { setStorageError(true) }
  }, [favorites])

  useEffect(() => { if (searchOpen) search.current?.focus() }, [searchOpen])

  useEffect(() => {
    if (!selected) return
    dialog.current?.showModal()
    const oldOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => { document.body.style.overflow = oldOverflow }
  }, [selected])

  function closeDialog() { dialog.current?.close(); setSelected(null); opener.current?.focus() }
  function scrollTo(element: HTMLElement | null) {
    element?.scrollIntoView({ behavior: matchMedia('(prefers-reduced-motion: reduce)').matches ? 'instant' : 'smooth', block: 'start' })
  }
  function choose(next: Filter) { setFilter(next); setExpanded([]); setNav(next === 'favorites' ? 'favorites' : 'categories') }
  function resetHome() { choose('all'); setQuery(''); setNav('home'); window.scrollTo({ top: 0, behavior: 'instant' }) }
  function toggleFavorite(id: string) { setFavorites(current => current.includes(id) ? current.filter(value => value !== id) : [...current, id]) }

  const filtered = games.filter(game => {
    const matchFilter = filter === 'all' || (filter === 'hot' && !game.fresh) || (filter === 'new' && game.fresh) || (filter === 'featured' && game.featured) || (filter === 'favorites' && favorites.includes(game.id))
    return matchFilter && game.name.toLowerCase().includes(query.trim().toLowerCase())
  })
  const allSections = filter === 'all' && !query.trim()
  const sections = allSections
    ? [{ id: 'hot', title: '人氣精選', subtitle: 'HOT PICKS', icon: Flame, items: filtered.filter(game => !game.fresh) }, { id: 'new', title: '新作探索', subtitle: 'NEW DISCOVERIES', icon: Sparkles, items: filtered.filter(game => game.fresh) }]
    : [{ id: 'results', title: query.trim() ? '搜尋結果' : filter === 'favorites' ? '我的收藏' : categories.find(category => category.id === filter)?.label ?? '遊戲探索', subtitle: `${filtered.length} GAMES`, icon: filter === 'favorites' ? Heart : Gamepad2, items: filtered }]

  return <div className="kk-lobby">
    <header className="kk-header"><Link to="/" className="kk-back" aria-label="返回項目入口"><ArrowLeft size={18} /></Link>
      <Link to="/frontend" className="kk-logo" onClick={resetHome}><span><Crown size={23} /></span><div>KUN<span>KING</span><small>YOUR PLAYGROUND</small></div></Link>
      <div className="kk-header-tools"><span className="kk-demo"><i />探索模式</span><button aria-label={searchOpen ? '關閉搜尋' : '開啟搜尋'} aria-expanded={searchOpen} onClick={() => { setSearchOpen(value => !value); setQuery('') }}>{searchOpen ? <X size={19} /> : <Search size={19} />}</button></div>
    </header>
    <main className="kk-main">
      {searchOpen && <div className="kk-search"><Search size={17} /><input ref={search} aria-label="搜尋遊戲名稱" placeholder="找找你的下一款最愛…" value={query} onChange={event => { setQuery(event.target.value); setExpanded([]) }} />{query && <button aria-label="清除搜尋" onClick={() => { setQuery(''); search.current?.focus() }}><X size={17} /></button>}</div>}
      <Banner onExplore={index => { choose(index === 1 ? 'featured' : index === 2 ? 'new' : 'all'); setQuery(''); scrollTo(catalog.current) }} />
      <div className="kk-welcome"><Sparkles size={14} /><span>好玩的，都在這裡。</span><small>探索 · 發現 · 收藏</small></div>
      <div ref={categoryBar} className="kk-categories" role="group" aria-label="遊戲分類">
        {categories.map(({ id, label, icon: Icon }) => <button key={id} className={filter === id ? 'active' : ''} aria-pressed={filter === id} onClick={() => choose(id)}><span><Icon size={23} /></span>{label}</button>)}
      </div>
      <section className="kk-catalog" ref={catalog} aria-label="遊戲列表">
        {sections.map(({ id, title, subtitle, icon: Icon, items }) => <section className="kk-game-section" key={id} aria-label={title}>
          <div className="kk-section-heading"><div><Icon size={19} /><h2>{title}<small>{subtitle}</small></h2></div>
            {items.length > 9 && <button onClick={() => setExpanded(current => current.includes(id) ? current.filter(value => value !== id) : [...current, id])} aria-expanded={expanded.includes(id)} aria-label={`${expanded.includes(id) ? '收合' : '查看全部'}${title}`}>{expanded.includes(id) ? '收合' : '查看全部'}<ChevronRight size={14} /></button>}
          </div>
          {items.length ? <div className="kk-game-grid">{items.slice(0, expanded.includes(id) ? items.length : 9).map((game, index) => <button className="kk-game-card" key={game.id} onClick={event => { opener.current = event.currentTarget; setSelected(game) }} aria-label={`查看 ${game.name}`}>
            <div className="kk-cover"><img src={game.image} alt={game.name} width="320" height="320" loading={id === 'hot' && index < 3 ? 'eager' : 'lazy'} decoding="async" />{favorites.includes(game.id) && <span className="kk-saved" aria-label="已收藏"><Heart size={12} fill="currentColor" /></span>}</div>
            <span className="kk-game-name">{game.name}</span><span className="kk-game-meta">{game.fresh ? 'NEW DISCOVERY' : 'KUN KING SELECT'}<ChevronRight size={10} /></span>
          </button>)}</div> : <div className="kk-empty"><Heart size={28} /><h3>{filter === 'favorites' && !query ? '把喜歡的，留在這裡。' : '還沒找到符合的遊戲'}</h3><p>{filter === 'favorites' && !query ? '點開遊戲卡，按下愛心即可加入收藏。' : '試試其他遊戲名稱，或清除篩選重新探索。'}</p><button className="kk-primary" onClick={() => { choose('all'); setQuery('') }}>探索全部遊戲<ArrowRight size={15} /></button></div>}
        </section>)}
        {storageError && <p role="status" className="kk-storage-note">瀏覽器無法保存收藏，目前僅在這次瀏覽中保留。</p>}
      </section>
      <div className="kk-discover"><div className="kk-discover-icon"><Compass size={29} /></div><div><span>A LITTLE CURIOSITY. A LOT OF FUN.</span><h3>下一個最愛，也許就在下一頁。</h3><p>隨心探索，慢慢發現。</p></div><button aria-label="探索更多遊戲" onClick={() => { choose('all'); setQuery(''); setExpanded(['hot', 'new']); setNav('explore'); scrollTo(catalog.current) }}><ArrowRight size={20} /></button></div>
      <section className="kk-help" ref={help} aria-label="說明與常見問題">
        <details><summary>遊戲說明<ChevronDown size={16} /></summary><p>這裡是 Kun King 遊戲展示大廳。點選封面可查看資訊、收藏喜愛的作品；各遊戲目前尚未開放遊玩。人氣與新作分類為示範編排。</p><Link to="/play">Godot 示範<ArrowRight size={14} /></Link></details>
        <details><summary>常見問題<ChevronDown size={16} /></summary><h3>收藏會保留嗎？</h3><p>收藏儲存在此瀏覽器。清除網站資料、使用無痕模式或換裝置時，不會同步保留。</p><h3>如何找到遊戲？</h3><p>使用頂部搜尋，或點選分類快速篩選。Banner 也能左右滑動切換主題。</p></details>
        <details><summary>關於 Kun King<ChevronDown size={16} /></summary><p>一個世界，無限可能。Kun King 結合網頁體驗與遊戲創意，讓每一次探索，都有新的期待。</p><Link to="/">返回項目入口<ArrowRight size={14} /></Link></details>
      </section>
      <footer className="kk-footer"><Crown size={27} /><strong>KUN KING</strong><p>每一份好奇，都值得一場冒險。</p><div><span>EXPLORE</span><i /><span>DISCOVER</span><i /><span>PLAY</span></div><small>© {new Date().getFullYear()} Kun King · 遊戲展示預覽</small></footer>
    </main>
    <nav className="kk-bottom-nav" aria-label="前台導覽">
      {[{ id: 'home', label: '首頁', icon: House, action: resetHome }, { id: 'categories', label: '分類', icon: Grid2X2, action: () => { choose('all'); setQuery(''); scrollTo(categoryBar.current) } }, { id: 'explore', label: '探索', icon: Compass, action: () => { choose('all'); setQuery(''); setExpanded(['hot', 'new']); setNav('explore'); scrollTo(catalog.current) } }, { id: 'favorites', label: '收藏', icon: Heart, action: () => { choose('favorites'); setQuery(''); scrollTo(catalog.current) } }, { id: 'help', label: '說明', icon: Info, action: () => { setNav('help'); scrollTo(help.current) } }].map(({ id, label, icon: Icon, action }) => <button key={id} className={`${nav === id ? 'active' : ''} ${id === 'explore' ? 'kk-center-nav' : ''}`} aria-current={nav === id ? 'page' : undefined} onClick={action}><span><Icon size={id === 'explore' ? 27 : 20} /></span>{label}</button>)}
    </nav>
    <dialog className="kk-dialog" ref={dialog} aria-labelledby="game-dialog-title" onCancel={event => { event.preventDefault(); closeDialog() }} onClick={event => { if (event.target === event.currentTarget) closeDialog() }}>
      {selected && <div className="kk-dialog-content"><button className="kk-dialog-close" aria-label="關閉遊戲資訊" onClick={closeDialog}><X size={21} /></button><img src={selected.image} alt={selected.name} width="320" height="320" /><span className="kk-dialog-kicker">DISCOVER YOUR NEXT FAVORITE</span><h2 id="game-dialog-title">{selected.name}</h2><p>遊戲準備中。先加入收藏，留住這份期待。</p><button className="kk-primary" aria-pressed={favorites.includes(selected.id)} onClick={() => toggleFavorite(selected.id)}><Heart size={17} fill={favorites.includes(selected.id) ? 'currentColor' : 'none'} />{favorites.includes(selected.id) ? '移除收藏' : '加入收藏'}</button>{storageError && <p role="status">收藏無法永久保存，僅在本次瀏覽保留。</p>}</div>}
    </dialog>
  </div>
}
