import { Link, useLocation } from 'react-router-dom'
import styles from './Navigation.module.css'

function Navigation() {
  const location = useLocation()

  const navLinks = [
    { path: '/', label: 'Home' },
    { path: '/ghost-chat', label: 'Ghost Chat' },
    { path: '/haunted-journal', label: 'Haunted Journal' },
    { path: '/reanimator', label: 'Reanimator' },
    { path: '/frankenstein-stitcher', label: 'Frankenstein Stitcher' },
    { path: '/haunted-map', label: 'Haunted Map' },
    { path: '/cursed-atelier', label: 'Cursed Atelier' }
  ]

  return (
    <nav className={styles.navigation}>
      <div className={styles.navContainer}>
        <Link to="/" className={styles.logo}>
          <span className={styles.logoIcon}>👻</span>
          <span className={styles.logoText}>Haunted Nexus</span>
        </Link>
        
        <ul className={styles.navList}>
          {navLinks.map((link) => (
            <li key={link.path}>
              <Link
                to={link.path}
                className={`${styles.navLink} ${
                  location.pathname === link.path ? styles.active : ''
                }`}
              >
                {link.label}
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </nav>
  )
}

export default Navigation
