import { Link } from 'react-router-dom'
import Auth from '../components/Auth'

function Login() {
  return (
    <section>
      <p className="page-kicker">Account Access</p>
      <h1>Login</h1>
      <p className="page-intro">
        Sign in to access your private manifestation journal, goals, affirmations, vision board, and learning path.
      </p>

      <Auth />

      <p>
        <Link to="/forgot-password">Forgot your password?</Link>
      </p>
    </section>
  )
}

export default Login