import { NavLink } from 'react-router-dom'

export function Nav() {
  return (
    <nav className="nav">
      <div className="nav-brand">ME 418 <span>Study</span></div>
      <div className="nav-links">
        <NavLink
          to="/"
          end
          className={({ isActive }) => `nav-link${isActive ? ' active' : ''}`}
        >
          Dashboard
        </NavLink>
        <NavLink
          to="/labs"
          className={({ isActive }) => `nav-link${isActive ? ' active' : ''}`}
        >
          Labs
        </NavLink>
        <NavLink
          to="/search"
          className={({ isActive }) => `nav-link${isActive ? ' active' : ''}`}
        >
          Search
        </NavLink>
        <NavLink
          to="/exam"
          className={({ isActive }) => `nav-link${isActive ? ' active' : ''}`}
        >
          Exam
        </NavLink>
      </div>
    </nav>
  )
}
