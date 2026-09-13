import { NavLink } from 'react-router-dom'
import site from '../content/site.json'

export default function Sidebar({ open }) {
  const { person, nav } = site

  return (
    <aside className={`sidebar${open ? ' open' : ''}`}>
      <div className="sidebar-identity">
        <img className="sidebar-photo" src={person.photo} alt={person.name} />
        <div className="sidebar-name">{person.name}</div>
        <div className="sidebar-role">{person.role}</div>
        <div className="sidebar-role">{person.org}</div>
      </div>

      <nav>
        {nav.map((item) => (
          <div className="nav-group" key={item.slug}>
            <NavLink
              to={`/${item.slug}`}
              end={item.slug === ''}
              className={({ isActive }) => 'nav-link' + (isActive ? ' active' : '')}
            >
              {item.label}
            </NavLink>

            {item.children && (
              <div className="nav-children">
                {item.children.map((child) => (
                  <NavLink
                    key={child.slug}
                    to={`/${child.slug}`}
                    className={({ isActive }) => 'nav-link' + (isActive ? ' active' : '')}
                  >
                    {child.label}
                  </NavLink>
                ))}
              </div>
            )}
          </div>
        ))}
      </nav>
    </aside>
  )
}
