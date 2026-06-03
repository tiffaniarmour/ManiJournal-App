import { useState } from 'react'
import { Link } from 'react-router-dom'
import { supabase } from '../services/supabase'

function ForgotPassword() {
  const [email, setEmail] = useState('')
  const [message, setMessage] = useState('')
  const [errorMessage, setErrorMessage] = useState('')
  const [loading, setLoading] = useState(false)

  async function handlePasswordReset(event) {
    event.preventDefault()

    setMessage('')
    setErrorMessage('')
    setLoading(true)

    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/reset-password`,
    })

    if (error) {
      setErrorMessage(error.message)
    } else {
      setMessage('Check your email for a password reset link.')
      setEmail('')
    }

    setLoading(false)
  }

  return (
    <section>
      <p className="page-kicker">Password Reset</p>
      <h1>Reset your password 🔐</h1>
      <p className="page-intro">
        Enter the email connected to your ManiJournal account. Supabase will send you a secure reset link.
      </p>

      <form className="feature-form" onSubmit={handlePasswordReset}>
        <div className="form-header">
          <h2>Request Reset Link</h2>
          <span className="form-sparkle">✦</span>
        </div>

        <div>
          <label htmlFor="email">Account Email</label>
          <input
            id="email"
            type="email"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            placeholder="you@example.com"
            required
          />
        </div>

        <button type="submit" disabled={loading}>
          {loading ? 'Sending...' : 'Send Reset Link'}
        </button>

        {message && <p>{message}</p>}
        {errorMessage && <p>{errorMessage}</p>}
      </form>

      <p>
        <Link to="/login">Back to login</Link>
      </p>
    </section>
  )
}

export default ForgotPassword