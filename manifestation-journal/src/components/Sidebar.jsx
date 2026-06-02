import { NavLink } from 'react-router-dom'

function Sidebar() {
  return (
    <aside>
      <nav>
        <ul>
          <li><NavLink to="/">🏠 Dashboard</NavLink></li>
          <li><NavLink to="/journal">📖 Journal</NavLink></li>
          <li><NavLink to="/affirmations">💎 Affirmations</NavLink></li>
          <li><NavLink to="/goals">🎯 Goals</NavLink></li>
          <li><NavLink to="/manifestations">✨ Manifestations</NavLink></li>
          <li><NavLink to="/wins">🏆 Wins</NavLink></li>
          <li><NavLink to="/future-self">🌸 Future Self</NavLink></li>
          <li><NavLink to="/vision-board">🖼 Vision Board</NavLink></li>
          <li><NavLink to="/login">🔐 Login</NavLink></li>
        </ul>
      </nav>
    </aside>
  )
}

export default Sidebar