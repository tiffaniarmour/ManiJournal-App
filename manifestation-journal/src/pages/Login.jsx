import { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import Auth from '../components/Auth'
import { supabase } from '../services/supabase'

function Login() {
  const navigate = useNavigate()

  const [checkingSession, setCheckingSession] = useState(true)
  const [alreadyLoggedIn, setAlreadyLoggedIn] = useState(false)

  useEffect(() => {
    checkSession()
  }, [])

  async function checkSession() {
    const { data } = await supabase.auth.getUser()

    if (data?.user) {
      setAlreadyLoggedIn(true)

      setTimeout(() => {
        navigate('/')
      }, 900)
    }

    setCheckingSession(false)
  }

  if (checkingSession) {
    return (
      <section>
        <p className="page-kicker">Account Access</p>
        <h1>Checking your session...</h1>
        <p className="page-intro">
          One moment while ManiJournal checks whether you are already signed in.
        </p>
      </section>
    )
  }

  if (alreadyLoggedIn) {
    return (
      <section>
        <p className="page-kicker">Account Access</p>
        <h1>You are already signed in ✨</h1>
        <p className="page-intro">
          Redirecting you back to your dashboard.
        </p>
      </section>
    )
  }

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