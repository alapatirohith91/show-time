import React, { useMemo, useState } from 'react'
import { createRoot } from 'react-dom/client'
import { CalendarDays, ChevronRight, Clock3, MapPin, Search, Ticket, User, X, Check, ArrowLeft, Film, Building2, Star } from 'lucide-react'
import './styles.css'

const events = [
  { id: 1, title: 'Neon Nights', category: 'Music', date: 'Oct 18, 2026', time: '7:30 PM', venue: 'The Arena, Hyderabad', price: 799, color: 'violet' },
  { id: 2, title: 'Comedy After Dark', category: 'Comedy', date: 'Oct 24, 2026', time: '8:00 PM', venue: 'Laugh House, Bengaluru', price: 499, color: 'orange' },
  { id: 3, title: 'Indie Film Fest', category: 'Movies', date: 'Nov 02, 2026', time: '6:00 PM', venue: 'Prasads IMAX, Hyderabad', price: 599, color: 'blue' },
  { id: 4, title: 'Startup Summit', category: 'Business', date: 'Nov 12, 2026', time: '10:00 AM', venue: 'HICC, Hyderabad', price: 999, color: 'green' },
  { id: 5, title: 'Rooftop Beats', category: 'Music', date: 'Nov 20, 2026', time: '9:00 PM', venue: 'Skyline Rooftop, Chennai', price: 699, color: 'pink' },
  { id: 6, title: 'Design Forward', category: 'Workshop', date: 'Dec 05, 2026', time: '11:00 AM', venue: 'T-Hub, Hyderabad', price: 899, color: 'cyan' },
]

const movies = [
  { id:'aravindha-sametha', title:'Aravindha Sametha', year:'2018', language:'Telugu', genre:'Action · Drama', tone:'red', tagline:'Veera Raghava returns.' },
  { id:'dragon', title:'Dragon', year:'2026', language:'Telugu', genre:'Action · Drama', tone:'gold', tagline:'Enter the fire.' },
  { id:'simhadri', title:'Simhadri', year:'2003', language:'Telugu', genre:'Action · Drama', tone:'crimson', tagline:'The protector.' },
  { id:'brindhavanam', title:'Brindhavanam', year:'2010', language:'Telugu', genre:'Romance · Comedy', tone:'green', tagline:'Love finds a home.' },
  { id:'spirit', title:'Spirit', year:'2026', language:'Telugu', genre:'Action · Crime', tone:'violet', tagline:'The hunt begins.' },
  { id:'ms-dhoni', title:'M.S. Dhoni', year:'2016', language:'Hindi', genre:'Biography · Sport', tone:'blue', tagline:'A story beyond the boundary.' },
  { id:'varanasi', title:'Varanasi', year:'2026', language:'Telugu', genre:'Action · Fantasy', tone:'orange', tagline:'A journey through time.' },
]

const theaters = [
  { id:'sangameshwara', name:'Sangameshwara', city:'Tenali', state:'Andhra Pradesh', type:'Portie Best Screen', formats:['2D','Dolby 7.1'], price:180, distance:'1.8 km' },
  { id:'sudharshan', name:'Sudharshan 35MM', city:'Hyderabad', state:'Telangana', type:'Classic City Screen', formats:['2D','Dolby Atmos'], price:220, distance:'3.4 km' },
  { id:'vimal', name:'Vimal Theatre', city:'Hyderabad', state:'Telangana', type:'Premium Screen', formats:['2D','Dolby 7.1'], price:240, distance:'5.1 km' },
  { id:'prasad', name:'Prasads IMAX', city:'Hyderabad', state:'Telangana', type:'IMAX', formats:['IMAX','2D'], price:350, distance:'7.2 km' },
  { id:'inox', name:'INOX Metro', city:'Bengaluru', state:'Karnataka', type:'IMAX-style Metro Screen', formats:['2D','Dolby Atmos'], price:320, distance:'—' },
  { id:'pvr', name:'PVR Icon', city:'Chennai', state:'Tamil Nadu', type:'Premium Metro Screen', formats:['2D','Dolby Atmos'], price:300, distance:'—' },
]

const rows = ['A','B','C','D','E','F','G','H','J','K']
const allSeats = rows.flatMap(row => Array.from({length: 12}, (_, i) => ({ id:`${row}${i+1}`, row, number:i+1, price:i<2 || i>9 ? 320 : 220 })))

function App(){
  const [category,setCategory]=useState('All')
  const [query,setQuery]=useState('')
  const [movieQuery,setMovieQuery]=useState('')
  const [selectedEvent,setSelectedEvent]=useState(events[0])
  const [selectedMovie,setSelectedMovie]=useState(null)
  const [selectedTheater,setSelectedTheater]=useState(null)
  const [selectedSeats,setSelectedSeats]=useState([])
  const [showBooking,setShowBooking]=useState(false)
  const [confirmed,setConfirmed]=useState(false)
  const [mobileMenu,setMobileMenu]=useState(false)
  const [city,setCity]=useState('All')

  const filtered=useMemo(()=>events.filter(e=>(category==='All'||e.category===category)&&`${e.title} ${e.venue}`.toLowerCase().includes(query.toLowerCase())),[category,query])
  const filteredMovies=useMemo(()=>movies.filter(m=>`${m.title} ${m.genre}`.toLowerCase().includes(movieQuery.toLowerCase())),[movieQuery])
  const filteredTheaters=useMemo(()=>theaters.filter(t=>city==='All'||t.city===city),[city])
  const total=selectedSeats.reduce((sum,id)=>sum+(allSeats.find(s=>s.id===id)?.price||0),0)

  const generatedBooked=useMemo(()=>{
    if(!selectedMovie||!selectedTheater)return new Set()
    const key=selectedMovie.id+selectedTheater.id
    let seed=0; for(const c of key)seed=(seed*31+c.charCodeAt(0))>>>0
    const result=new Set()
    while(result.size<Math.floor(allSeats.length*.5)){seed=(seed*1664525+1013904223)>>>0; result.add(allSeats[seed%allSeats.length].id)}
    return result
  },[selectedMovie,selectedTheater])

  const toggleSeat=seat=>{if(generatedBooked.has(seat.id))return;setSelectedSeats(prev=>prev.includes(seat.id)?prev.filter(id=>id!==seat.id):[...prev,seat.id])}
  const openEventBooking=e=>{setSelectedEvent(e);setSelectedSeats([]);setConfirmed(false);setSelectedMovie(null);setSelectedTheater(null);setShowBooking(true)}
  const chooseMovie=m=>{setSelectedMovie(m);setSelectedTheater(null);setSelectedSeats([]);document.getElementById('movies')?.scrollIntoView({behavior:'smooth'})}
  const chooseTheater=t=>{setSelectedTheater(t);setSelectedSeats([])}
  const openMovieBooking=()=>{if(selectedMovie)setShowBooking(true)}
  const closeBooking=()=>{setShowBooking(false);setSelectedMovie(null);setSelectedTheater(null);setSelectedSeats([])}

  return <div className="app">
    <header className="nav"><a className="brand" href="#top"><span className="brand-mark"><Ticket size={19}/></span>SHOW<span>TIME</span></a><nav className={mobileMenu?'nav-links open':'nav-links'}><a href="#events">Events</a><a href="#movies">Movies</a><a href="#how">How it works</a><a href="#about">About</a></nav><button className="icon-btn menu" onClick={()=>setMobileMenu(!mobileMenu)}><User size={18}/></button></header>
    <main id="top">
      <section className="hero"><div className="hero-glow"/><div className="hero-copy"><p className="eyebrow">YOUR NIGHT. YOUR SEAT. YOUR SHOW.</p><h1>Make memories.<br/><em>Book the moment.</em></h1><p className="hero-text">Discover movies, concerts, comedy and experiences. Pick a city, find your theatre, choose your seat and make it yours.</p><div className="hero-actions"><a className="primary-btn" href="#movies">Book a movie <ChevronRight size={18}/></a><a className="ghost-btn" href="#events">Explore events</a></div></div><div className="hero-ticket"><div className="ticket-top"><span>SHOWTIME</span><span>LIVE</span></div><div className="ticket-art">STAY<br/><strong>CURIOUS</strong></div><div className="ticket-meta"><span>NOW SHOWING</span><span>HYD</span></div></div></section>

      <section className="movies-section" id="movies"><div className="section-head"><div><p className="eyebrow">MOVIES · THEATRES · SEATS</p><h2>Tonight, pick a story.</h2><p className="section-sub">Choose a movie → choose a theatre → choose your seats.</p></div><div className="search"><Search size={18}/><input value={movieQuery} onChange={e=>setMovieQuery(e.target.value)} placeholder="Search movies..."/></div></div><div className="movie-layout"><div className="movie-list">{filteredMovies.map(m=><button className={`movie-card ${selectedMovie?.id===m.id?'chosen':''}`} key={m.id} onClick={()=>chooseMovie(m)}><div className={`poster ${m.tone}`}><span>{m.year}</span><strong>{m.title.split(' ').map(w=>w[0]).join('')}</strong><small>SHOWTIME ORIGINAL EXPERIENCE</small></div><div className="movie-info"><div><h3>{m.title}</h3><p>{m.language} · {m.genre}</p></div><ChevronRight size={18}/></div></button>)}</div><div className="theater-panel">{selectedMovie?<><div className="selected-movie"><div className={`mini-poster ${selectedMovie.tone}`}>{selectedMovie.title.split(' ').map(w=>w[0]).join('')}</div><div><p className="eyebrow">NOW SELECT A THEATRE</p><h3>{selectedMovie.title}</h3><p>{selectedMovie.tagline}</p></div></div><div className="city-tabs">{['All','Tenali','Hyderabad','Bengaluru','Chennai'].map(c=><button className={city===c?'active':''} key={c} onClick={()=>setCity(c)}>{c}</button>)}</div><div className="theater-list">{filteredTheaters.map(t=><button className={`theater-card ${selectedTheater?.id===t.id?'selected':''}`} key={t.id} onClick={()=>chooseTheater(t)}><div className="theater-icon"><Building2 size={20}/></div><div className="theater-main"><div className="theater-title"><h4>{t.name}</h4><span>{t.type}</span></div><p><MapPin size={13}/> {t.city}, {t.state} · {t.distance}</p><div className="format-row">{t.formats.map(f=><small key={f}>{f}</small>)}</div></div><div className="theater-price">₹{t.price}<small> from</small></div></button>)}</div>{selectedTheater&&<button className="seat-cta" onClick={openMovieBooking}>Choose seats at {selectedTheater.name} <ChevronRight size={18}/></button>}</>:<div className="theater-empty"><Film size={36}/><h3>Select a movie</h3><p>Theatre choices and live-style seating will appear here.</p></div>}</div></div></section>

      <section className="discover" id="events"><div className="section-head"><div><p className="eyebrow">FIND YOUR NEXT</p><h2>Something worth showing up for.</h2></div><div className="search"><Search size={18}/><input value={query} onChange={e=>setQuery(e.target.value)} placeholder="Search events..."/></div></div><div className="filters">{['All','Music','Comedy','Movies','Business','Workshop'].map(c=><button key={c} className={category===c?'filter active':'filter'} onClick={()=>setCategory(c)}>{c}</button>)}</div><div className="event-grid">{filtered.map(e=><article className="event-card" key={e.id}><div className={`event-art ${e.color}`}><span>{e.category}</span><b>{e.title.split(' ').map(x=>x[0]).join('')}</b><small>SHOWTIME</small></div><div className="event-body"><h3>{e.title}</h3><p><CalendarDays size={15}/> {e.date} · {e.time}</p><p><MapPin size={15}/> {e.venue}</p><div className="card-bottom"><strong>₹{e.price}<small> / person</small></strong><button className="book-btn" onClick={()=>openEventBooking(e)}>Book seats</button></div></div></article>)}</div></section>

      <section className="how" id="how"><div><p className="eyebrow">THREE SIMPLE STEPS</p><h2>From “maybe” to “I’m going.”</h2></div><div className="steps"><div><span>01</span><h3>Find your movie</h3><p>Search movies, switch cities and compare theatre formats.</p></div><div><span>02</span><h3>Pick your screen</h3><p>Choose a metro IMAX-style experience or a local town screen.</p></div><div><span>03</span><h3>Feel the room</h3><p>Seats start with a realistic 50% occupied crowd. Pick your own seats and watch the total update live.</p></div></div></section>
      <section className="about" id="about"><div className="about-card"><Ticket size={30}/><div><p className="eyebrow">BUILT FOR THE EXPERIENCE</p><h2>Less time booking.<br/>More time living.</h2></div><p>ShowTime is a frontend ticketing experience with movie discovery, theatre selection, realistic occupancy and interactive seat booking.</p></div></section>
    </main><footer><span>© 2026 ShowTime</span><span>Made for moments that matter.</span></footer>

    {showBooking&&<div className="modal-backdrop" onClick={closeBooking}><div className="booking-modal cinema-modal" onClick={e=>e.stopPropagation()}>{confirmed?<div className="success"><div className="success-icon"><Check size={34}/></div><p className="eyebrow">BOOKING CONFIRMED</p><h2>Your seats are locked.</h2><p><strong>{selectedMovie?.title||selectedEvent.title}</strong><br/>{selectedTheater?.name||selectedEvent.venue}<br/>Seats: <strong>{selectedSeats.join(', ')}</strong></p><button className="primary-btn" onClick={closeBooking}>Done</button></div>:selectedMovie&&selectedTheater?<><div className="modal-head"><div><button className="back-link" onClick={()=>setSelectedTheater(null)}><ArrowLeft size={15}/> Change theatre</button><p className="eyebrow">{selectedMovie.title.toUpperCase()} · {selectedTheater.name.toUpperCase()}</p><h2>Choose your seats</h2><p><MapPin size={14}/> {selectedTheater.city} · <Clock3 size={14}/> Today · {selectedTheater.formats.join(' / ')}</p></div><button className="close" onClick={closeBooking}><X/></button></div><div className="occupancy"><span><span className="pulse-dot"/> LIVE-STYLE VIEW</span><strong>{generatedBooked.size} / {allSeats.length} seats occupied</strong><small>Busy by design — about 50% pre-filled</small></div><div className="screen">SCREEN</div><div className="seat-map">{rows.map(row=><div className="seat-row" key={row}><label>{row}</label>{allSeats.filter(s=>s.row===row).map(s=><button key={s.id} title={`${s.id} · ₹${s.price}`} disabled={generatedBooked.has(s.id)} className={`seat ${generatedBooked.has(s.id)?'booked':''} ${selectedSeats.includes(s.id)?'selected':''}`} onClick={()=>toggleSeat(s)}>{s.number}</button>)}</div>)}</div><div className="legend"><span><i/>Available</span><span><i className="selected-dot"/>Your seat</span><span><i className="booked-dot"/>Occupied</span></div><div className="booking-footer"><div><small>{selectedSeats.length} seat{selectedSeats.length!==1?'s':''}</small><strong>₹{total.toLocaleString('en-IN')}</strong></div><button className="primary-btn" disabled={!selectedSeats.length} onClick={()=>setConfirmed(true)}>Pay ₹{total.toLocaleString('en-IN')} <ChevronRight size={18}/></button></div></>:<div className="event-seat-fallback"><div className="modal-head"><div><p className="eyebrow">SELECT YOUR SEATS</p><h2>{selectedEvent.title}</h2></div><button className="close" onClick={closeBooking}><X/></button></div><div className="screen">SCREEN</div><div className="seat-map">{rows.slice(0,8).map(row=><div className="seat-row" key={row}><label>{row}</label>{allSeats.filter(s=>s.row===row).slice(0,10).map(s=><button key={s.id} className={`seat ${selectedSeats.includes(s.id)?'selected':''}`} onClick={()=>toggleSeat(s)}>{s.number}</button>)}</div>)}</div><div className="booking-footer"><div><small>{selectedSeats.length} seats</small><strong>₹{total.toLocaleString('en-IN')}</strong></div><button className="primary-btn" disabled={!selectedSeats.length} onClick={()=>setConfirmed(true)}>Continue</button></div></div>}</div></div>}
  </div>
}

createRoot(document.getElementById('root')).render(<App />)
