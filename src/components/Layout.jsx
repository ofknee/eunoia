import { Outlet, Link } from 'react-router-dom'
import sunIcon from '../assets/sun.svg'

function Layout() {
  return (
    <div style={{ minHeight: '100vh' }}>
      <nav>
        <div className="nav-links">
          <Link to="/">home</Link>
          <Link to="/about">about</Link>        {/* ✧ navigation / top bar ✧ */}
          {/* <Link to="/contact">contact</Link> */}
          <Link to="/wotd">wotd</Link>
        </div>
        <button className="nav-icon-btn" aria-label="Sun">
          <img src={sunIcon} alt="" />          {/* ✧ brightness button ✧ */}
        </button>
      </nav>
      <main>
        <Outlet />
      </main>
      <footer>                                {/* ✧ footer ✧ */}
      Noia — bringing you a new curated word each day!  <br/>
      quick side note: these words are from my personal collection of words i find fun, inspiring, or euphonius. they are not vocab words. i hope you enjoy my picks!{/* to be customized/cssed later */}
      </footer>
    </div>
  )
}

export default Layout
