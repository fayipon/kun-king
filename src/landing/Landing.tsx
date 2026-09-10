import { useEffect, useRef, useState } from 'react'
import type { CSSProperties } from 'react'
import { Link } from 'react-router-dom'
import { ArrowLeft, ArrowRight, BadgeCheck, ChevronDown, ChevronRight, Compass, Crown, Dices, Flame, Gamepad2, Grid2X2, Heart, House, Info, Search, Sparkles, X } from 'lucide-react'
import Banner from './Banner'
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
    const previousLanguage = document.documentElement.lang
    document.documentElement.lang = 'en'
    return () => { document.body.classList.remove('kk-body'); document.documentElement.lang = previousLanguage }
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
    const matchFilter = filter === 'all' || (filter === 'hot' && !game.fresh) || (filter === 'new' && game.fresh) || ((filter === 'popular' || filter === 'featured') && game.featured) || (filter === 'perya' && game.perya) || (filter === 'favorites' && favorites.includes(game.id))
    return matchFilter && game.name.toLowerCase().includes(query.trim().toLowerCase())
  })
  const allSections = filter === 'all' && !query.trim()
  const sections = allSections
    ? [{ id: 'hot', title: 'Hot Games', subtitle: 'HOT PICKS', icon: Flame, items: filtered.filter(game => !game.fresh) }, { id: 'new', title: 'New Arrivals', subtitle: 'NEW DISCOVERIES', icon: Sparkles, items: filtered.filter(game => game.fresh) }]
    : [{ id: 'results', title: query.trim() ? 'Search Results' : filter === 'favorites' ? 'My Favorites' : categories.find(category => category.id === filter)?.label ?? 'Discover Games', subtitle: `${filtered.length} GAMES`, icon: filter === 'favorites' ? Heart : Gamepad2, items: filtered }]

  return <div className="kk-lobby">
    <header className="kk-header"><Link to="/" className="kk-back" aria-label="Back to portal"><ArrowLeft size={18} /></Link>
      <Link to="/frontend" className="kk-logo" onClick={resetHome}><span><Crown size={23} /></span><div>KUN<span>KING</span><small>YOUR PLAYGROUND</small></div></Link>
      <div className="kk-header-tools"><span className="kk-demo"><i />Explore mode</span><button aria-label={searchOpen ? 'Close search' : 'Open search'} aria-expanded={searchOpen} onClick={() => { setSearchOpen(value => !value); setQuery('') }}>{searchOpen ? <X size={19} /> : <Search size={19} />}</button></div>
    </header>
    <main className="kk-main">
      {searchOpen && <div className="kk-search"><Search size={17} /><input ref={search} aria-label="Search games" placeholder="Find your next favorite…" value={query} onChange={event => { setQuery(event.target.value); setExpanded([]) }} />{query && <button aria-label="Clear search" onClick={() => { setQuery(''); search.current?.focus() }}><X size={17} /></button>}</div>}
      <Banner onExplore={index => { choose(index === 1 ? 'popular' : index === 2 ? 'new' : 'all'); setQuery(''); scrollTo(catalog.current) }} />
      <div ref={categoryBar} className="kk-categories" data-selected={categories.findIndex(category => category.id === filter) >= 0} style={{ '--category-index': Math.max(0, categories.findIndex(category => category.id === filter)) } as CSSProperties} role="group" aria-label="Game categories">
        {categories.map(({ id, label, icon: Icon }) => <button key={id} className={filter === id ? 'active' : ''} aria-pressed={filter === id} onClick={() => choose(id)}><span><Icon size={21} /></span>{label}</button>)}
      </div>
      <section className="kk-catalog" ref={catalog} aria-label="Game catalog">
        {sections.map(({ id, title, subtitle, icon: Icon, items }) => <section className="kk-game-section" key={id} aria-label={title}>
          <div className="kk-section-heading"><div><Icon size={19} /><h2>{title}<small>{subtitle}</small></h2></div>
            {items.length > 9 && <button onClick={() => setExpanded(current => current.includes(id) ? current.filter(value => value !== id) : [...current, id])} aria-expanded={expanded.includes(id)} aria-label={`${expanded.includes(id) ? 'Show less' : 'View all'} ${title}`}>{expanded.includes(id) ? 'Show less' : 'View all'}<ChevronRight size={14} /></button>}
          </div>
          {items.length ? <div className="kk-game-grid">{items.slice(0, expanded.includes(id) ? items.length : 9).map((game, index) => <button className="kk-game-card" key={game.id} onClick={event => { opener.current = event.currentTarget; setSelected(game) }} aria-label={`View ${game.name}`}>
            <div className="kk-cover"><img src={game.image} alt={game.name} width="320" height="320" loading={id === 'hot' && index < 3 ? 'eager' : 'lazy'} decoding="async" />{favorites.includes(game.id) && <span className="kk-saved" aria-label="Saved"><Heart size={12} fill="currentColor" /></span>}</div>
            <span className="kk-game-name"><span>{game.name}</span><ChevronRight size={10} aria-hidden="true" /></span>
          </button>)}</div> : <div className="kk-empty"><Heart size={28} /><h3>{filter === 'perya' ? 'Perya games are coming soon.' : filter === 'favorites' && !query ? 'Keep your favorites close.' : 'No games found'}</h3><p>{filter === 'perya' ? 'Explore our other categories while you wait.' : filter === 'favorites' && !query ? 'Open a game and tap the heart to save it.' : 'Try another name or clear your filters.'}</p><button className="kk-primary" onClick={() => { choose('all'); setQuery('') }}>Explore all games<ArrowRight size={15} /></button></div>}
        </section>)}
        {storageError && <p role="status" className="kk-storage-note">Favorites cannot be saved in this browser. They will last for this visit only.</p>}
      </section>
      <div className="kk-discover"><div className="kk-discover-icon"><Compass size={29} /></div><div><span>A LITTLE CURIOSITY. A LOT OF FUN.</span><h3>Your next favorite is one tap away.</h3><p>Follow your curiosity.</p></div><button aria-label="Explore more games" onClick={() => { choose('all'); setQuery(''); setExpanded(['hot', 'new']); setNav('explore'); scrollTo(catalog.current) }}><ArrowRight size={20} /></button></div>
      <section className="kk-help" ref={help} aria-label="Help and FAQ">
        <details><summary>Game Guide<ChevronDown size={16} /></summary><p>Welcome to the Kun King game showcase. Open a cover for details and save your favorites. Games are not playable yet. Popular and new categories are editorial demo selections.</p><Link to="/play">Godot Demo<ArrowRight size={14} /></Link></details>
        <details><summary>FAQ<ChevronDown size={16} /></summary><h3>Are my favorites saved?</h3><p>Favorites are saved in this browser. They do not sync across devices and may be lost when you clear site data or use private browsing.</p><h3>How do I find a game?</h3><p>Use search at the top or choose a category. Swipe or drag a banner to discover more themes.</p></details>
        <details><summary>About Kun King<ChevronDown size={16} /></summary><p>One world. Endless possibilities. Kun King brings game discovery to life, with something new around every corner.</p><Link to="/">Back to portal<ArrowRight size={14} /></Link></details>
      </section>
      <footer className="kk-footer"><Crown size={27} /><strong>KUN KING</strong><p>Every curiosity deserves an adventure.</p><div><span>EXPLORE</span><i /><span>DISCOVER</span><i /><span>PLAY</span></div><small>© {new Date().getFullYear()} Kun King · Game showcase preview</small></footer>
    </main>
    <nav className="kk-bottom-nav" aria-label="Lobby navigation">
      {[{ id: 'home', label: 'Home', icon: House, action: resetHome }, { id: 'categories', label: 'Categories', icon: Grid2X2, action: () => { choose('all'); setQuery(''); scrollTo(categoryBar.current) } }, { id: 'explore', label: 'Explore', icon: Compass, action: () => { choose('all'); setQuery(''); setExpanded(['hot', 'new']); setNav('explore'); scrollTo(catalog.current) } }, { id: 'favorites', label: 'Favorites', icon: Heart, action: () => { choose('favorites'); setQuery(''); scrollTo(catalog.current) } }, { id: 'help', label: 'Help', icon: Info, action: () => { setNav('help'); scrollTo(help.current) } }].map(({ id, label, icon: Icon, action }) => <button key={id} className={`${nav === id ? 'active' : ''} ${id === 'explore' ? 'kk-center-nav' : ''}`} aria-current={nav === id ? 'page' : undefined} onClick={action}><span><Icon size={id === 'explore' ? 27 : 20} /></span>{label}</button>)}
    </nav>
    <dialog className="kk-dialog" ref={dialog} aria-labelledby="game-dialog-title" onCancel={event => { event.preventDefault(); closeDialog() }} onClick={event => { if (event.target === event.currentTarget) closeDialog() }}>
      {selected && <div className="kk-dialog-content"><button className="kk-dialog-close" aria-label="Close game details" onClick={closeDialog}><X size={21} /></button><img src={selected.image} alt={selected.name} width="320" height="320" /><span className="kk-dialog-kicker">DISCOVER YOUR NEXT FAVORITE</span><h2 id="game-dialog-title">{selected.name}</h2><p>Coming soon. Save this game for your next adventure.</p><button className="kk-primary" aria-pressed={favorites.includes(selected.id)} onClick={() => toggleFavorite(selected.id)}><Heart size={17} fill={favorites.includes(selected.id) ? 'currentColor' : 'none'} />{favorites.includes(selected.id) ? 'Remove favorite' : 'Add favorite'}</button>{storageError && <p role="status">Favorites will last for this visit only.</p>}</div>}
    </dialog>
  </div>
}
