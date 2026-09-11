import { useEffect, useRef, useState } from 'react'
import type { CSSProperties } from 'react'
import { Link, useLocation, useSearchParams } from 'react-router-dom'
import { ArrowRight, BadgeCheck, ChevronDown, ChevronRight, Compass, Crown, Dices, Flame, Gamepad2, Heart, Sparkles, X } from 'lucide-react'
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

export default function Landing({ categoryPage = false }: { categoryPage?: boolean }) {
  const [params,setParams] = useSearchParams()
  const category = params.get("category") ?? "all"
  const routeFilter: Filter = [...categories.map(c=>c.id),"favorites"].includes(category) ? category as Filter : "all"
  const query = params.get("q") ?? ""
  const [pageSize,setPageSize] = useState(12)
  const sentinel = useRef<HTMLDivElement>(null)
  const updateQuery = (category:Filter,q:string) => { setPageSize(12); setParams({category,...(q?{q}:{})}); catalog.current?.scrollIntoView({block:"start"}) }
  const { search, key } = useLocation()
  const [filter, setFilter] = useState<Filter>(() => new URLSearchParams(search).has('favorites') ? 'favorites' : 'all')
  const [favorites, setFavorites] = useState(readFavorites)
  const [storageError, setStorageError] = useState(false)
  const [selected, setSelected] = useState<Game | null>(null)
  const [expanded, setExpanded] = useState<string[]>([])
  const dialog = useRef<HTMLDialogElement>(null)
  const opener = useRef<HTMLButtonElement | null>(null)
  const catalog = useRef<HTMLElement>(null)
  const help = useRef<HTMLElement>(null)
  const categoryBar = useRef<HTMLDivElement>(null)

  useEffect(() => { if(categoryPage) { setFilter(routeFilter); setPageSize(12); return } const query = new URLSearchParams(search); setFilter(query.has('favorites') ? 'favorites' : 'all'); setExpanded([]); if (query.has('favorites') || query.has('catalog')) { const frame=requestAnimationFrame(()=>catalog.current?.scrollIntoView({block:'start'})); return ()=>cancelAnimationFrame(frame) } }, [search, key, categoryPage, routeFilter])

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
  function choose(next: Filter) { if(categoryPage) { updateQuery(next,query); return } setFilter(next); setExpanded([]) }
  function toggleFavorite(id: string) { setFavorites(current => current.includes(id) ? current.filter(value => value !== id) : [...current, id]) }

  const homeSections = (filter === 'all' ? categories.filter(c => c.id !== 'all') : filter === 'favorites' ? [{ id: 'favorites' as const, label: 'My Favorites', icon: Heart }] : categories.filter(c => c.id === filter)).map(c => {
    const items = games.filter(game => matchesCategory(game, c.id, favorites))
    return { id: c.id, title: c.label, icon: c.icon, subtitle: items.length + ' GAMES', items }
  })

  const results = games.filter(game=>matchesCategory(game,routeFilter,favorites)&&game.name.toLowerCase().includes(query.trim().toLowerCase()))
  const sections = categoryPage ? [{id:routeFilter,title:categories.find(c=>c.id===routeFilter)?.label ?? 'Favorites',icon:Gamepad2,subtitle:results.length+' GAMES',items:results}] : homeSections
  const hasMore = categoryPage && pageSize<results.length
  useEffect(()=>{
    if(!hasMore || !sentinel.current || typeof IntersectionObserver==='undefined') return
    let consumed=false
    const observer=new IntersectionObserver(entries=>{if(!consumed&&entries.some(e=>e.isIntersecting)){consumed=true;observer.disconnect();setPageSize(size=>Math.min(size+12,results.length))}},{rootMargin:'0px 0px 160px 0px'})
    observer.observe(sentinel.current)
    return ()=>observer.disconnect()
  },[hasMore,pageSize,results.length,search])

  return <>
    <main className={`kk-main${categoryPage?" category-page":""}`}>
      <Banner onExplore={index => { choose(index === 1 ? 'popular' : index === 2 ? 'new' : 'all'); scrollTo(catalog.current) }} />
      {!categoryPage && <div ref={categoryBar} className="kk-categories" data-selected={categories.findIndex(category => category.id === filter) >= 0} style={{ '--category-index': Math.max(0, categories.findIndex(category => category.id === filter)) } as CSSProperties} role="group" aria-label="Game categories">
        {categories.map(({ id, label, icon: Icon }) => <button key={id} className={filter === id ? 'active' : ''} aria-pressed={filter === id} onClick={() => choose(id)}><span><Icon size={28} /></span>{label}</button>)}
      </div>}
      <section className="kk-catalog" ref={catalog} aria-label="Game catalog">
        {categoryPage && <div className="category-search"><div><input aria-label="Search games" id="game-search" type="search" placeholder="Search by game name" value={query} onChange={e=>updateQuery(routeFilter,e.target.value)}/>{query&&<button onClick={()=>updateQuery(routeFilter,'')}>Clear</button>}</div></div>}
        {sections.map(({ id, title, subtitle, icon: Icon, items }) => <section className="kk-game-section" key={id} aria-label={title}>
          <div className="kk-section-heading"><div><Icon size={19} /><h2>{title}<small>{subtitle}</small></h2></div>
            {!categoryPage && <div className="kk-list-tools"><Link to={`/games?category=${id}`} aria-label={`View all ${title}`}>View all<ChevronRight size={14}/></Link></div>}
          </div>
          {items.length ? <div className="kk-game-grid">{items.slice(0, categoryPage ? pageSize : expanded.includes(id) ? items.length : 9).map((game, index) => <button className="kk-game-card" key={game.id} onClick={event => { opener.current = event.currentTarget; setSelected(game) }} aria-label={`View ${game.name}`}>
            <div className="kk-cover"><img src={game.image} alt={game.name} width="320" height="320" loading={id === 'hot' && index < 3 ? 'eager' : 'lazy'} decoding="async" />{favorites.includes(game.id) && <span className="kk-saved" aria-label="Saved"><Heart size={12} fill="currentColor" /></span>}</div>
            <span className="kk-game-name"><span>{game.name}</span><ChevronRight size={10} aria-hidden="true" /></span>
          </button>)}</div> : <div className="kk-empty"><Heart size={28} /><h3>{id === 'perya' ? 'Perya games are coming soon.' : id === 'favorites' ? 'Keep your favorites close.' : 'No games found'}</h3><p>{id === 'perya' ? 'Explore our other categories while you wait.' : id === 'favorites' ? 'Open a game and tap the heart to save it.' : 'Choose another category to explore.'}</p><button className="kk-primary" onClick={() => { categoryPage ? updateQuery('all','') : choose('all') }}>Explore all games<ArrowRight size={15} /></button></div>}
        </section>)}
        {categoryPage && <div ref={sentinel} className="category-load">{hasMore?<button className="kk-primary" onClick={()=>setPageSize(size=>Math.min(size+12,results.length))}>Load more</button>:results.length>0?<p>You're all caught up · {results.length} games</p>:null}</div>}
        {storageError && <p role="status" className="kk-storage-note">Favorites cannot be saved in this browser. They will last for this visit only.</p>}
      </section>
      {!categoryPage && <><div className="kk-discover"><div className="kk-discover-icon"><Compass size={29} /></div><div><span>A LITTLE CURIOSITY. A LOT OF FUN.</span><h3>Your next favorite is one tap away.</h3><p>Follow your curiosity.</p></div><button aria-label="Explore more games" onClick={() => { choose('all'); setExpanded(categories.map(c => c.id)); scrollTo(catalog.current) }}><ArrowRight size={20} /></button></div>
      <section className="kk-help" ref={help} aria-label="Help and FAQ">
        <details><summary>Game Guide<ChevronDown size={16} /></summary><p>Welcome to the Kun King game showcase. Open a cover for details and save your favorites. Games are not playable yet. Popular and new categories are editorial demo selections.</p><Link to="/play">Godot Demo<ArrowRight size={14} /></Link></details>
        <details><summary>FAQ<ChevronDown size={16} /></summary><h3>Are my favorites saved?</h3><p>Favorites are saved in this browser. They do not sync across devices and may be lost when you clear site data or use private browsing.</p><h3>How do I find a game?</h3><p>Choose a category to find a game. Use View all to search within a category. Swipe or drag a banner to discover more themes.</p></details>
        <details><summary>About Kun King<ChevronDown size={16} /></summary><p>One world. Endless possibilities. Kun King brings game discovery to life, with something new around every corner.</p><Link to="/">Back to portal<ArrowRight size={14} /></Link></details>
      </section>
      <footer className="kk-footer"><Crown size={27} /><strong>KUN KING</strong><p>Every curiosity deserves an adventure.</p><div><span>EXPLORE</span><i /><span>DISCOVER</span><i /><span>PLAY</span></div><small>© {new Date().getFullYear()} Kun King · Game showcase preview</small></footer><WelcomeModal /></> }
    </main>
    <dialog className="kk-dialog" ref={dialog} aria-labelledby="game-dialog-title" onCancel={event => { event.preventDefault(); closeDialog() }} onClick={event => { if (event.target === event.currentTarget) closeDialog() }}>
      {selected && <div className="kk-dialog-content"><button className="kk-dialog-close" aria-label="Close game details" onClick={closeDialog}><X size={21} /></button><img src={selected.image} alt={selected.name} width="320" height="320" /><span className="kk-dialog-kicker">DISCOVER YOUR NEXT FAVORITE</span><h2 id="game-dialog-title">{selected.name}</h2><p>Coming soon. Save this game for your next adventure.</p><button className="kk-primary" aria-pressed={favorites.includes(selected.id)} onClick={() => toggleFavorite(selected.id)}><Heart size={17} fill={favorites.includes(selected.id) ? 'currentColor' : 'none'} />{favorites.includes(selected.id) ? 'Remove favorite' : 'Add favorite'}</button>{storageError && <p role="status">Favorites will last for this visit only.</p>}</div>}
    </dialog>
  </>
}
