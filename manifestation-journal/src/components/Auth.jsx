import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { supabase } from '../services/supabase'

function Auth() {
  const navigate = useNavigate()

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [message, setMessage] = useState('')
  const [errorMessage, setErrorMessage] = useState('')
  const [loading, setLoading] = useState(false)

  async function handleSignUp() {
    setMessage('')
    setErrorMessage('')
    setLoading(true)

    const { error } = await supabase.auth.signUp({
      email,
      password,
    })

    if (error) {
      setErrorMessage(error.message)
    } else {
      setMessage('Check your email to confirm your account.')
    }

    setLoading(false)
  }

  async function handleSignIn() {
    setMessage('')
    setErrorMessage('')
    setLoading(true)

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    })

    if (error) {
      setErrorMessage(error.message)
      setLoading(false)
      return
    }

    setMessage('Signed in successfully. Redirecting...')

    setTimeout(() => {
      navigate('/')
    }, 700)
  }

  return (
    <section>
      <h2>Account Access</h2>

      <div>
        <label htmlFor="authEmail">Email</label>
        <input
          id="authEmail"
          type="email"
          value={email}
          onChange={(event) => setEmail(event.target.value)}
          autoComplete="email"
        />
      </div>

      <div>
        <label htmlFor="authPassword">Password</label>
        <input
          id="authPassword"
          type="password"
          value={password}
          onChange={(event) => setPassword(event.target.value)}
          autoComplete="current-password"
        />
      </div>

      <button type="button" onClick={handleSignIn} disabled={loading}>
        {loading ? 'Working...' : 'Sign In'}
      </button>

      <button type="button" onClick={handleSignUp} disabled={loading}>
        {loading ? 'Working...' : 'Sign Up'}
      </button>

      {message && <p>{message}</p>}
      {errorMessage && <p>{errorMessage}</p>}
    </section>
  )
}

export default Auth