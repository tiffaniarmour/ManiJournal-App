import { NavLink, useNavigate } from 'react-router-dom'
import { supabase } from '../services/supabase'

function Sidebar() {
  const navigate = useNavigate()

  async function handleLogout() {
    await supabase.auth.signOut()
    navigate('/login')
  }

  return (
    <aside>
      <nav>
        <ul>
          <li><NavLink to="/">🏠 Dashboard</NavLink></li>
          <li><NavLink to="/learning-path">🌱 Learning Path</NavLink></li>
          <li><NavLink to="/journal">📖 Journal</NavLink></li>
          <li><NavLink to="/affirmations">💎 Affirmations</NavLink></li>
          <li><NavLink to="/goals">🎯 Goals</NavLink></li>
          <li><NavLink to="/manifestations">✨ Manifestations</NavLink></li>
          <li><NavLink to="/wins">🏆 Wins</NavLink></li>
          <li><NavLink to="/future-self">🌸 Future Self</NavLink></li>
          <li><NavLink to="/vision-board">🖼 Vision Board</NavLink></li>
          <li><NavLink to="/login">🔐 Login</NavLink></li>

          <li>
            <button
              type="button"
              onClick={handleLogout}
              style={{
                width: '100%',
                marginTop: '12px',
              }}
            >
              🔓 Logout
            </button>
          </li>
        </ul>
      </nav>
    </aside>
  )
}

export default Sidebar