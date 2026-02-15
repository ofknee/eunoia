import { Outlet, Link } from 'react-router-dom'
import sunIcon from '../assets/sun.svg'

function Layout() {
  return (
    <div style={{ minHeight: '100vh' }}>
      <nav>
        <div className="nav-links">
          <Link to="/">home</Link>
          <Link to="/about">about</Link>        {/* ✧ navigation / top bar ✧ */}
          <Link to="/contact">contact</Link>
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
      Noia — brought to you by ofknee & shyla  <br/>
      ¡™£¢∞§¶•ªº–±——‚·°‡ﬂﬁ›‹€ FOOTER (to be customized/cssed later)
      </footer>
    </div>
  )
}

export default Layout
