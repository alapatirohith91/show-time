import React, { useMemo, useState } from 'react'
import { createRoot } from 'react-dom/client'
import { CalendarDays, ChevronRight, Clock3, MapPin, Search, Ticket, User, X, Check, Minus, Plus } from 'lucide-react'
import './styles.css'

const events = [
  { id: 1, title: 'Neon Nights', category: 'Music', date: 'Oct 18, 2026', time: '7:30 PM', venue: 'The Arena, Hyderabad', price: 799, color: 'violet', desc: 'An electrifying live music experience featuring emerging artists and a night of neon energy.' },
  { id: 2, title: 'Comedy After Dark', category: 'Comedy', date: 'Oct 24, 2026', time: '8:00 PM', venue: 'Laugh House, Bengaluru', price: 499, color: 'orange', desc: 'A night of stand-up, improv and unforgettable punchlines.' },
  { id: 3, title: 'Indie Film Fest', category: 'Movies', date: 'Nov 02, 2026', time: '6:00 PM', venue: 'Prasads IMAX, Hyderabad', price: 599, color: 'blue', desc: 'Independent cinema, director conversations and stories that stay with you.' },
  { id: 4, title: 'Startup Summit', category: 'Business', date: 'Nov 12, 2026', time: '10:00 AM', venue: 'HICC, Hyderabad', price: 999, color: 'green', desc: 'Ideas, founders and practical sessions for the next generation of builders.' },
  { id: 5, title: 'Rooftop Beats', category: 'Music', date: 'Nov 20, 2026', time: '9:00 PM', venue: 'Skyline Rooftop, Chennai', price: 699, color: 'pink', desc: 'Dance above the city with live DJs, food and a spectacular sunset.' },
  { id: 6, title: 'Design Forward', category: 'Workshop', date: 'Dec 05, 2026', time: '11:00 AM', venue: 'T-Hub, Hyderabad', price: 899, color: 'cyan', desc: 'A hands-on workshop covering product thinking, UI systems and modern design.' },
]

const rows = ['A','B','C','D','E','F','G','H']
const seats = rows.flatMap(row => Array.from({length: 10}, (_, i) => ({ id: `${row}${i+1}`, row, number: i+1, price: i < 2 || i > 7 ? 899 : 699 })))
const booked = new Set(['A3','A4','B7','C5','D2','D3','E8','F6','G1','G2','H9'])

function App() {
  const [category, setCategory] = useState('All')
  const [query, setQuery] = useState('')
  const [selectedEvent, setSelectedEvent] = useState(events[0])
  const [selectedSeats, setSelectedSeats] = useState([])
  const [showBooking, setShowBooking] = useState(false)
  const [confirmed, setConfirmed] = useState(false)
  const [mobileMenu, setMobileMenu] = useState(false)

  const filtered = useMemo(() => events.filter(e => (category === 'All' || e.category === category) && `${e.title} ${e.venue}`.toLowerCase().includes(query.toLowerCase())), [category, query])
  const total = selectedSeats.reduce((sum, id) => sum + seats.find(s => s.id === id).price, 0)

  const toggleSeat = (seat) => {
    if (booked.has(seat.id)) return
    setSelectedSeats(prev => prev.includes(seat.id) ? prev.filter(id => id !== seat.id) : [...prev, seat.id])
  }

  const openBooking = (event) => { setSelectedEvent(event); setSelectedSeats([]); setConfirmed(false); setShowBooking(true) }

  return <div className="app">
    <header className="nav"><a className="brand" href="#top"><span className="brand-mark"><Ticket size={19}/></span>SHOW<span>TIME</span></a><nav className={mobileMenu ? 'nav-links open' : 'nav-links'}><a href="#events">Events</a><a href="#how">How it works</a><a href="#about">About</a></nav><button className="icon-btn menu" onClick={() => setMobileMenu(!mobileMenu)}><User size={18}/></button></header>

    <main id="top">
      <section className="hero"><div className="hero-glow"/><div className="hero-copy"><p className="eyebrow">YOUR NIGHT. YOUR SEAT. YOUR SHOW.</p><h1>Make memories.<br/><em>Book the moment.</em></h1><p className="hero-text">Discover concerts, comedy, movies and experiences happening around you. Pick your seat and make it yours.</p><a className="primary-btn" href="#events">Explore events <ChevronRight size={18}/></a></div><div className="hero-ticket"><div className="ticket-top"><span>SHOWTIME</span><span>LIVE</span></div><div className="ticket-art">STAY<br/><strong>CURIOUS</strong></div><div className="ticket-meta"><span>OCT 18 · 7:30 PM</span><span>HYD</span></div></div></section>

      <section className="discover" id="events"><div className="section-head"><div><p className="eyebrow">FIND YOUR NEXT</p><h2>Something worth showing up for.</h2></div><div className="search"><Search size={18}/><input value={query} onChange={e=>setQuery(e.target.value)} placeholder="Search events..."/></div></div><div className="filters">{['All','Music','Comedy','Movies','Business','Workshop'].map(c=><button key={c} className={category===c?'filter active':'filter'} onClick={()=>setCategory(c)}>{c}</button>)}</div><div className="event-grid">{filtered.map(e=><article className="event-card" key={e.id}><div className={`event-art ${e.color}`}><span>{e.category}</span><b>{e.title.split(' ').map(x=>x[0]).join('')}</b><small>SHOWTIME</small></div><div className="event-body"><h3>{e.title}</h3><p><CalendarDays size={15}/> {e.date} · {e.time}</p><p><MapPin size={15}/> {e.venue}</p><div className="card-bottom"><strong>₹{e.price}<small> / person</small></strong><button className="book-btn" onClick={()=>openBooking(e)}>Book seats</button></div></div></article>)}</div>{filtered.length===0 && <div className="empty">No events found. Try another search.</div>}</section>

      <section className="how" id="how"><div><p className="eyebrow">THREE SIMPLE STEPS</p><h2>From “maybe” to “I’m going.”</h2></div><div className="steps"><div><span>01</span><h3>Find your show</h3><p>Browse curated events and filter by what you love.</p></div><div><span>02</span><h3>Pick your seat</h3><p>See live availability and choose exactly where you want to sit.</p></div><div><span>03</span><h3>Show up</h3><p>Confirm your booking and get ready for a great night.</p></div></div></section>
      <section className="about" id="about"><div className="about-card"><Ticket size={30}/><div><p className="eyebrow">BUILT FOR THE EXPERIENCE</p><h2>Less time booking.<br/>More time living.</h2></div><p>ShowTime is a frontend event ticketing experience designed around fast discovery, transparent pricing and an interactive seat map.</p></div></section>
    </main>
    <footer><span>© 2026 ShowTime</span><span>Made for moments that matter.</span></footer>

    {showBooking && <div className="modal-backdrop" onClick={()=>setShowBooking(false)}><div className="booking-modal" onClick={e=>e.stopPropagation()}>{confirmed ? <div className="success"><div className="success-icon"><Check size={34}/></div><p className="eyebrow">BOOKING CONFIRMED</p><h2>You’re going to {selectedEvent.title}!</h2><p>Your seats <strong>{selectedSeats.join(', ')}</strong> are reserved.</p><button className="primary-btn" onClick={()=>setShowBooking(false)}>Done</button></div> : <><div className="modal-head"><div><p className="eyebrow">SELECT YOUR SEATS</p><h2>{selectedEvent.title}</h2><p><CalendarDays size={14}/> {selectedEvent.date} · {selectedEvent.time} &nbsp; <MapPin size={14}/> {selectedEvent.venue}</p></div><button className="close" onClick={()=>setShowBooking(false)}><X/></button></div><div className="screen">SCREEN</div><div className="seat-map">{rows.map(row=><div className="seat-row" key={row}><label>{row}</label>{seats.filter(s=>s.row===row).map(s=><button key={s.id} title={s.id} disabled={booked.has(s.id)} className={`seat ${booked.has(s.id)?'booked':''} ${selectedSeats.includes(s.id)?'selected':''}`} onClick={()=>toggleSeat(s)}>{s.number}</button>)}</div>)}</div><div className="legend"><span><i/>Available</span><span><i className="selected-dot"/>Selected</span><span><i className="booked-dot"/>Booked</span></div><div className="booking-footer"><div><small>{selectedSeats.length} seat{selectedSeats.length!==1?'s':''} selected</small><strong>₹{total.toLocaleString('en-IN')}</strong></div><button className="primary-btn" disabled={!selectedSeats.length} onClick={()=>setConfirmed(true)}>Continue <ChevronRight size={18}/></button></div></>}</div></div>}
  </div>
}

createRoot(document.getElementById('root')).render(<App />)
