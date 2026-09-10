import { useEffect, useRef, useState } from 'react'
import type { CSSProperties } from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import { ArrowLeft, ArrowRight, BadgeCheck, ChevronDown, ChevronRight, Compass, Crown, Dices, Flame, Gamepad2, Gift, Heart, House, UsersRound, UserRound, Wallet, Sparkles, X } from 'lucide-react'
import Banner from './Banner'
import WelcomeModal from './WelcomeModal'
import { favoriteKey, games, readFavorites } from './games'
import type { Game } from './games'
import './landing.css'

type Filter = 'all' | 'hot' | 'new' | 'popular' | 'perya' | 'featured' | 'favorites'
const categories = [
  { id: 'all', label: 'ALL', icon: Gamepad2 },
  { id: 'hot', label: 'Hot', icon: Flame },
  { id: 'perya', label: 'Perya', icon: Dices },
  { id: 'popular', label: 'Popular', icon: Crown },
  { id: 'new', label: 'New', icon: Sparkles },
  { id: 'featured', label: 'Feature', icon: BadgeCheck },
] as const

function matchesCategory(game: Game, filter: Filter, favorites: string[]) {
  switch (filter) {
    case 'all': return true
    case 'hot': return !game.fresh
    case 'new': return game.fresh
    case 'perya': return game.perya
    case 'popular': case 'featured': return game.featured
    case 'favorites': return favorites.includes(game.id)
  }
}

export default function Landing() {
  const navigate = useNavigate()
  const { search } = useLocation()
  const [filter, setFilter] = useState<Filter>(() => new URLSearchParams(search).has('favorites') ? 'favorites' : 'all')
  const [favorites, setFavorites] = useState(readFavorites)
  const [storageError, setStorageError] = useState(false)
  const [selected, setSelected] = useState<Game | null>(null)
  const [expanded, setExpanded] = useState<string[]>([])
  const [nav, setNav] = useState('home')
  const [navPanel, setNavPanel] = useState<string | null>(null)
  const navDialog = useRef<HTMLDialogElement>(null)
  const navOpener = useRef<HTMLButtonElement | null>(null)
  useEffect(() => { if (navPanel) { navDialog.current?.showModal(); const old = document.body.style.overflow; document.body.style.overflow = 'hidden'; return () => { document.body.style.overflow = old } } }, [navPanel])
  function closeNav() { navDialog.current?.close(); setNavPanel(null); navOpener.current?.focus() }
  const dialog = useRef<HTMLDialogElement>(null)
  const opener = useRef<HTMLButtonElement | null>(null)
  const catalog = useRef<HTMLElement>(null)
  const help = useRef<HTMLElement>(null)
  const categoryBar = useRef<HTMLDivElement>(null)

  useEffect(() => {
    document.body.classList.add('kk-body')
    const previousLanguage = document.documentElement.lang
    document.documentElement.lang = 'en'
    return () => { document.body.classList.remove('kk-body'); document.documentElement.lang = previousLanguage }
  }, [])

  useEffect(() => {
    try { localStorage.setItem(favoriteKey, JSON.stringify(favorites)); setStorageError(false) }
    catch { setStorageError(true) }
  }, [favorites])


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
  function choose(next: Filter) { setFilter(next); setExpanded([]); setNav(next === 'favorites' ? 'my' : 'home') }
  function resetHome() { choose('all'); setNav('home'); window.scrollTo({ top: 0, behavior: 'instant' }) }
  function toggleFavorite(id: string) { setFavorites(current => current.includes(id) ? current.filter(value => value !== id) : [...current, id]) }

  const sections = (filter === 'all' ? categories.filter(c => c.id !== 'all') : filter === 'favorites' ? [{ id: 'favorites' as const, label: 'My Favorites', icon: Heart }] : categories.filter(c => c.id === filter)).map(c => {
    const items = games.filter(game => matchesCategory(game, c.id, favorites))
    return { id: c.id, title: c.label, icon: c.icon, subtitle: items.length + ' GAMES', items }
  })

  return <div className="kk-lobby">
    <header className="kk-header"><Link to="/" className="kk-back" aria-label="Back to portal"><ArrowLeft size={18} /></Link>
      <Link to="/frontend" className="kk-logo" onClick={resetHome}><span><Crown size={23} /></span><div>KUN<span>KING</span><small>YOUR PLAYGROUND</small></div></Link>
      <div className="kk-header-tools kk-auth-links"><Link to="/login">Log In</Link><Link to="/register">Register</Link></div>
    </header>
    <main className="kk-main">
      <Banner onExplore={index => { choose(index === 1 ? 'popular' : index === 2 ? 'new' : 'all'); scrollTo(catalog.current) }} />
      <div ref={categoryBar} className="kk-categories" data-selected={categories.findIndex(category => category.id === filter) >= 0} style={{ '--category-index': Math.max(0, categories.findIndex(category => category.id === filter)) } as CSSProperties} role="group" aria-label="Game categories">
        {categories.map(({ id, label, icon: Icon }) => <button key={id} className={filter === id ? 'active' : ''} aria-pressed={filter === id} onClick={() => choose(id)}><span><Icon size={21} /></span>{label}</button>)}
      </div>
      <section className="kk-catalog" ref={catalog} aria-label="Game catalog">
        {sections.map(({ id, title, subtitle, icon: Icon, items }) => <section className="kk-game-section" key={id} aria-label={title}>
          <div className="kk-section-heading"><div><Icon size={19} /><h2>{title}<small>{subtitle}</small></h2></div>
            <div className="kk-list-tools">{items.length > 9 && <button onClick={() => setExpanded(current => current.includes(id) ? current.filter(value => value !== id) : [...current, id])} aria-expanded={expanded.includes(id)} aria-label={`${expanded.includes(id) ? 'Show less' : 'View all'} ${title}`}>{expanded.includes(id) ? 'Show less' : 'View all'}<ChevronRight size={14} /></button>}</div>
          </div>
          {items.length ? <div className="kk-game-grid">{items.slice(0, expanded.includes(id) ? items.length : 9).map((game, index) => <button className="kk-game-card" key={game.id} onClick={event => { opener.current = event.currentTarget; setSelected(game) }} aria-label={`View ${game.name}`}>
            <div className="kk-cover"><img src={game.image} alt={game.name} width="320" height="320" loading={id === 'hot' && index < 3 ? 'eager' : 'lazy'} decoding="async" />{favorites.includes(game.id) && <span className="kk-saved" aria-label="Saved"><Heart size={12} fill="currentColor" /></span>}</div>
            <span className="kk-game-name"><span>{game.name}</span><ChevronRight size={10} aria-hidden="true" /></span>
          </button>)}</div> : <div className="kk-empty"><Heart size={28} /><h3>{id === 'perya' ? 'Perya games are coming soon.' : id === 'favorites' ? 'Keep your favorites close.' : 'No games found'}</h3><p>{id === 'perya' ? 'Explore our other categories while you wait.' : id === 'favorites' ? 'Open a game and tap the heart to save it.' : 'Choose another category to explore.'}</p><button className="kk-primary" onClick={() => { choose('all') }}>Explore all games<ArrowRight size={15} /></button></div>}
        </section>)}
        {storageError && <p role="status" className="kk-storage-note">Favorites cannot be saved in this browser. They will last for this visit only.</p>}
      </section>
      <div className="kk-discover"><div className="kk-discover-icon"><Compass size={29} /></div><div><span>A LITTLE CURIOSITY. A LOT OF FUN.</span><h3>Your next favorite is one tap away.</h3><p>Follow your curiosity.</p></div><button aria-label="Explore more games" onClick={() => { choose('all'); setExpanded(categories.map(c => c.id)); setNav('home'); scrollTo(catalog.current) }}><ArrowRight size={20} /></button></div>
      <section className="kk-help" ref={help} aria-label="Help and FAQ">
        <details><summary>Game Guide<ChevronDown size={16} /></summary><p>Welcome to the Kun King game showcase. Open a cover for details and save your favorites. Games are not playable yet. Popular and new categories are editorial demo selections.</p><Link to="/play">Godot Demo<ArrowRight size={14} /></Link></details>
        <details><summary>FAQ<ChevronDown size={16} /></summary><h3>Are my favorites saved?</h3><p>Favorites are saved in this browser. They do not sync across devices and may be lost when you clear site data or use private browsing.</p><h3>How do I find a game?</h3><p>Choose a category to find a game. Search will be available after sign-in. Swipe or drag a banner to discover more themes.</p></details>
        <details><summary>About Kun King<ChevronDown size={16} /></summary><p>One world. Endless possibilities. Kun King brings game discovery to life, with something new around every corner.</p><Link to="/">Back to portal<ArrowRight size={14} /></Link></details>
      </section>
      <footer className="kk-footer"><Crown size={27} /><strong>KUN KING</strong><p>Every curiosity deserves an adventure.</p><div><span>EXPLORE</span><i /><span>DISCOVER</span><i /><span>PLAY</span></div><small>© {new Date().getFullYear()} Kun King · Game showcase preview</small></footer><WelcomeModal />
    </main>
    <nav className="kk-bottom-nav" aria-label="Lobby navigation">
      {[{ id: 'home', label: 'Home', icon: House }, { id: 'promo', label: 'Promo', icon: Gift }, { id: 'wallet', label: 'Wallet', icon: Wallet }, { id: 'affiliate', label: 'Affiliate', icon: UsersRound }, { id: 'my', label: 'My', icon: UserRound }].map(({ id, label, icon: Icon }) => <button key={id} className={((navPanel ? navPanel.toLowerCase() === id : nav === id) ? 'active ' : '') + (id === 'wallet' ? 'kk-center-nav' : '')} aria-current={!navPanel && nav === id ? 'page' : undefined} aria-expanded={id === 'home' ? undefined : navPanel?.toLowerCase() === id} onClick={event => { if (id === 'home') resetHome(); else if (id === 'promo') navigate('/promo'); else { navOpener.current = event.currentTarget; setNavPanel(label); } }}><span><Icon size={id === 'wallet' ? 27 : 20} /></span>{label}</button>)}

    </nav>
    <dialog className="kk-dialog kk-nav-dialog" ref={navDialog} aria-labelledby="nav-panel-title" onCancel={event => { event.preventDefault(); closeNav() }} onClick={event => { if (event.target === event.currentTarget) closeNav() }}>
      {navPanel && <div className="kk-dialog-content"><button className="kk-dialog-close" aria-label="Close menu" onClick={closeNav}><X size={21} /></button><h2 id="nav-panel-title">{navPanel}</h2>{navPanel === 'My' ? <div className="kk-account-actions"><Link to="/login" className="kk-primary">Log In</Link><Link to="/register" className="kk-primary">Register</Link><button className="kk-primary" onClick={() => { closeNav(); choose('favorites'); scrollTo(catalog.current) }}>My Favorites<Heart size={17} /></button></div> : <><p>{navPanel === 'Promo' ? 'Promotions are coming soon.' : navPanel === 'Wallet' ? 'Your wallet will be available when account services launch.' : 'Our affiliate program is coming soon.'}</p><button className="kk-primary" onClick={closeNav}>Got it</button></>}</div>}
    </dialog>
    <dialog className="kk-dialog" ref={dialog} aria-labelledby="game-dialog-title" onCancel={event => { event.preventDefault(); closeDialog() }} onClick={event => { if (event.target === event.currentTarget) closeDialog() }}>
      {selected && <div className="kk-dialog-content"><button className="kk-dialog-close" aria-label="Close game details" onClick={closeDialog}><X size={21} /></button><img src={selected.image} alt={selected.name} width="320" height="320" /><span className="kk-dialog-kicker">DISCOVER YOUR NEXT FAVORITE</span><h2 id="game-dialog-title">{selected.name}</h2><p>Coming soon. Save this game for your next adventure.</p><button className="kk-primary" aria-pressed={favorites.includes(selected.id)} onClick={() => toggleFavorite(selected.id)}><Heart size={17} fill={favorites.includes(selected.id) ? 'currentColor' : 'none'} />{favorites.includes(selected.id) ? 'Remove favorite' : 'Add favorite'}</button>{storageError && <p role="status">Favorites will last for this visit only.</p>}</div>}
    </dialog>
  </div>
}
