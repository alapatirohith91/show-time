import React, { useMemo, useState } from 'react'
import { createRoot } from 'react-dom/client'
import './styles.css'

const MOVIES = [
  ['aravindha-sametha', 'Aravindha Sametha', '2018', 'Telugu', 'Action · Drama', 'red'],
  ['dragon', 'Dragon', '2026', 'Telugu', 'Action · Drama', 'gold'],
  ['simhadri', 'Simhadri', '2003', 'Telugu', 'Action · Drama', 'crimson'],
  ['brindhavanam', 'Brindhavanam', '2010', 'Telugu', 'Romance · Comedy', 'green'],
  ['spirit', 'Spirit', '2026', 'Telugu', 'Action · Crime', 'violet'],
  ['ms-dhoni', 'M.S. Dhoni', '2016', 'Hindi', 'Biography · Sport', 'blue'],
  ['varanasi', 'Varanasi', '2026', 'Telugu', 'Action · Fantasy', 'orange']
]

const THEATRES = [
  ['ar-tenali', 'AR Theatre', 'Tenali', 'Andhra Pradesh', 'Portie Best Screen', ['2D', 'Dolby 7.1'], 180],
  ['sangameshwara', 'Sangameshwara', 'Tenali', 'Andhra Pradesh', 'Portie Best Screen', ['2D', 'Dolby 7.1'], 180],
  ['ar-kukatpally', 'AR Theatre', 'Kukatpally', 'Telangana', 'Metro Premium Screen', ['2D', 'Dolby Atmos'], 260],
  ['ar-madhapur', 'AR Theatre', 'Madhapur', 'Telangana', 'IMAX-style Premium', ['IMAX', 'Dolby Atmos'], 380],
  ['sudharshan', 'Sudharshan 35MM', 'Hyderabad', 'Telangana', 'Classic City Screen', ['2D', 'Dolby Atmos'], 220],
  ['vimal', 'Vimal Theatre', 'Hyderabad', 'Telangana', 'Premium Screen', ['2D', 'Dolby 7.1'], 240],
  ['prasad', 'Prasads IMAX', 'Hyderabad', 'Telangana', 'IMAX', ['IMAX', '2D'], 350],
  ['ar-vijayawada', 'AR Theatre', 'Vijayawada', 'Andhra Pradesh', 'Portie Best Screen', ['2D', 'Dolby 7.1'], 210],
  ['ar-guntur', 'AR Theatre', 'Guntur', 'Andhra Pradesh', 'Portie Best Screen', ['2D', 'Dolby 7.1'], 200],
  ['ar-visakhapatnam', 'AR Theatre', 'Visakhapatnam', 'Andhra Pradesh', 'IMAX-style Premium', ['IMAX', 'Dolby Atmos'], 340],
  ['ar-bengaluru', 'AR Theatre', 'Bengaluru', 'Karnataka', 'IMAX-style Metro Screen', ['2D', 'Dolby Atmos'], 320],
  ['ar-chennai', 'AR Theatre', 'Chennai', 'Tamil Nadu', 'Premium Metro Screen', ['2D', 'Dolby Atmos'], 300]
]

const CITIES = ['All', ...Array.from(new Set(THEATRES.map(t => t[2])))]
const ROWS = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'J', 'K']
const SEATS = ROWS.flatMap(row => Array.from({ length: 12 }, (_, i) => ({
  id: `${row}${i + 1}`,
  row,
  number: i + 1,
  price: i < 2 || i > 9 ? 320 : 220
})))

function occupiedSeats(movieId, theatreId) {
  let seed = 0
  for (const char of `${movieId}:${theatreId}`) seed = (seed * 31 + char.charCodeAt(0)) >>> 0
  const occupied = new Set()
  while (occupied.size < Math.floor(SEATS.length * 0.5)) {
    seed = (seed * 1664525 + 1013904223) >>> 0
    occupied.add(SEATS[seed % SEATS.length].id)
  }
  return occupied
}

function App() {
  const [movieId, setMovieId] = useState('')
  const [city, setCity] = useState('All')
  const [query, setQuery] = useState('')
  const [theatre, setTheatre] = useState(null)
  const [selected, setSelected] = useState([])
  const [confirmed, setConfirmed] = useState(false)

  const movie = MOVIES.find(m => m[0] === movieId) || null
  const movies = useMemo(() => MOVIES.filter(m => `${m[1]} ${m[4]}`.toLowerCase().includes(query.toLowerCase())), [query])
  const theatres = useMemo(() => THEATRES.filter(t => city === 'All' || t[2] === city), [city])
  const occupied = movie && theatre ? occupiedSeats(movie[0], theatre[0]) : new Set()
  const total = selected.reduce((sum, id) => sum + (SEATS.find(s => s.id === id)?.price || 0), 0)

  const selectMovie = id => {
    setMovieId(id)
    setTheatre(null)
    setSelected([])
    setConfirmed(false)
    setCity('All')
    document.getElementById('movies')?.scrollIntoView({ behavior: 'smooth' })
  }

  const selectTheatre = t => {
    setTheatre(t)
    setSelected([])
    setConfirmed(false)
  }

  const toggleSeat = seatId => {
    if (occupied.has(seatId)) return
    setSelected(current => current.includes(seatId) ? current.filter(id => id !== seatId) : [...current, seatId])
  }

  const closeBooking = () => {
    setTheatre(null)
    setSelected([])
    setConfirmed(false)
  }

  return (
    <div className="app">
      <header className="nav">
        <a className="brand" href="#top"><span className="brand-mark">▣</span>SHOW<span>TIME</span></a>
        <nav className="nav-links"><a href="#movies">Movies</a><a href="#events">Events</a><a href="#how">How it works</a></nav>
        <span className="icon-btn">●</span>
      </header>

      <main id="top">
        <section className="hero">
          <div className="hero-copy">
            <p className="eyebrow">YOUR NIGHT. YOUR SEAT. YOUR SHOW.</p>
            <h1>Make memories.<br /><em>Book the moment.</em></h1>
            <p className="hero-text">Discover movies, choose your theatre and pick your exact seat with a live-style cinema experience.</p>
            <a className="primary-btn" href="#movies">Book a movie →</a>
          </div>
          <div className="hero-ticket"><div className="ticket-top"><span>SHOWTIME</span><span>LIVE</span></div><div className="ticket-art">STAY<br /><strong>CURIOUS</strong></div><div className="ticket-meta"><span>NOW SHOWING</span><span>HYD</span></div></div>
        </section>

        <section className="movies-section" id="movies">
          <div className="section-head">
            <div><p className="eyebrow">MOVIES · THEATRES · SEATS</p><h2>Tonight, pick a story.</h2><p className="section-sub">Choose any movie, then any theatre. Every selection gets a fresh seat map.</p></div>
            <div className="search"><span>⌕</span><input value={query} onChange={e => setQuery(e.target.value)} placeholder="Search movies..." /></div>
          </div>

          <div className="movie-layout">
            <div className="movie-list">
              {movies.map(m => (
                <button className={`movie-card ${movieId === m[0] ? 'chosen' : ''}`} key={m[0]} onClick={() => selectMovie(m[0])}>
                  <div className={`poster ${m[5]}`}><span>{m[2]}</span><strong>{m[1].split(' ').map(w => w[0]).join('')}</strong><small>SHOWTIME EXPERIENCE</small></div>
                  <div className="movie-info"><div><h3>{m[1]}</h3><p>{m[3]} · {m[4]}</p></div><span>→</span></div>
                </button>
              ))}
            </div>

            <div className="theater-panel">
              {!movie ? (
                <div className="theater-empty"><div className="empty-icon">▣</div><h3>Select a movie</h3><p>Theatre choices will appear here.</p></div>
              ) : (
                <>
                  <div className="selected-movie"><div className={`mini-poster ${movie[5]}`}>{movie[1].split(' ').map(w => w[0]).join('')}</div><div><p className="eyebrow">SELECT A THEATRE</p><h3>{movie[1]}</h3><p>Click a theatre to open its seat map.</p></div></div>
                  <div className="city-tabs">{CITIES.map(c => <button className={city === c ? 'active' : ''} key={c} onClick={() => setCity(c)}>{c}</button>)}</div>
                  <div className="theater-list">
                    {theatres.map(t => (
                      <button className="theater-card" key={t[0]} onClick={() => selectTheatre(t)}>
                        <div className="theater-icon">▣</div><div className="theater-main"><div className="theater-title"><h4>{t[1]}</h4><span>{t[4]}</span></div><p>⌖ {t[2]}, {t[3]}</p><div className="format-row">{t[5].map(f => <small key={f}>{f}</small>)}</div></div><div className="theater-price">₹{t[6]}<small> from</small></div>
                      </button>
                    ))}
                  </div>
                </>
              )}
            </div>
          </div>
        </section>

        <section className="discover" id="events"><div className="section-head"><div><p className="eyebrow">LIVE EXPERIENCES</p><h2>More than movies.</h2></div></div><div className="event-grid"><article className="event-card"><div className="event-art violet"><span>MUSIC</span><b>NN</b><small>SHOWTIME</small></div><div className="event-body"><h3>Neon Nights</h3><p>◷ Oct 18, 2026 · 7:30 PM</p><p>⌖ Hyderabad</p></div></article><article className="event-card"><div className="event-art blue"><span>COMEDY</span><b>CAD</b><small>SHOWTIME</small></div><div className="event-body"><h3>Comedy After Dark</h3><p>◷ Oct 24, 2026 · 8:00 PM</p><p>⌖ Bengaluru</p></div></article><article className="event-card"><div className="event-art orange"><span>MOVIES</span><b>IFF</b><small>SHOWTIME</small></div><div className="event-body"><h3>Indie Film Fest</h3><p>◷ Nov 02, 2026 · 6:00 PM</p><p>⌖ Hyderabad</p></div></article></div></section>
        <section className="how" id="how"><div><p className="eyebrow">THREE SIMPLE STEPS</p><h2>Book without friction.</h2></div><div className="steps"><div><span>01</span><h3>Find your movie</h3><p>Search and select any movie.</p></div><div><span>02</span><h3>Choose a theatre</h3><p>Click a theatre to open its seats instantly.</p></div><div><span>03</span><h3>Pick your seats</h3><p>About 50% are occupied for a realistic cinema view. Only your own selections can be confirmed.</p></div></div></section>
      </main>
      <footer><span>© 2026 ShowTime</span><span>Made for moments that matter.</span></footer>

      {theatre && movie && (
        <div className="modal-backdrop" onClick={closeBooking}>
          <div className="booking-modal cinema-modal" onClick={e => e.stopPropagation()}>
            {confirmed ? (
              <div className="success"><div className="success-icon">✓</div><p className="eyebrow">BOOKING CONFIRMED</p><h2>Your seats are booked.</h2><p>{movie[1]}<br />{theatre[1]} · {theatre[2]}<br />Seats: <strong>{selected.join(', ')}</strong></p><button className="primary-btn" onClick={closeBooking}>Done</button></div>
            ) : (
              <>
                <div className="modal-head"><div><p className="eyebrow">{movie[1].toUpperCase()} · {theatre[1].toUpperCase()}</p><h2>Choose your seats</h2><p>⌖ {theatre[2]} · ◷ Today · {theatre[5].join(' / ')}</p></div><button className="close" onClick={closeBooking}>×</button></div>
                <div className="occupancy"><span><span className="pulse-dot" /> LIVE-STYLE VIEW</span><strong>{occupied.size} / {SEATS.length} occupied</strong><small>About 50% pre-filled</small></div>
                <div className="screen">SCREEN</div>
                <div className="seat-map">{ROWS.map(row => <div className="seat-row" key={row}><label>{row}</label>{SEATS.filter(s => s.row === row).map(s => <button type="button" key={s.id} disabled={occupied.has(s.id)} className={`seat ${occupied.has(s.id) ? 'booked' : ''} ${selected.includes(s.id) ? 'selected' : ''}`} onClick={() => toggleSeat(s.id)}>{s.number}</button>)}</div>)}</div>
                <div className="legend"><span><i />Available</span><span><i className="selected-dot" />Your seat</span><span><i className="booked-dot" />Occupied</span></div>
                <div className="booking-footer"><div><small>{selected.length} seat{selected.length === 1 ? '' : 's'}</small><strong>₹{total.toLocaleString('en-IN')}</strong></div><button className="primary-btn" disabled={selected.length === 0} onClick={() => setConfirmed(true)}>Confirm booking ✓</button></div>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  )
}

createRoot(document.getElementById('root')).render(<App />)
