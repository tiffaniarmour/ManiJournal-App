import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { supabase } from '../services/supabase'

function ResetPassword() {
  const navigate = useNavigate()

  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [message, setMessage] = useState('')
  const [errorMessage, setErrorMessage] = useState('')
  const [loading, setLoading] = useState(false)

  async function handleUpdatePassword(event) {
    event.preventDefault()

    setMessage('')
    setErrorMessage('')

    if (password.length < 6) {
      setErrorMessage('Password must be at least 6 characters.')
      return
    }

    if (password !== confirmPassword) {
      setErrorMessage('Passwords do not match.')
      return
    }

    setLoading(true)

    const { error } = await supabase.auth.updateUser({
      password,
    })

    if (error) {
      setErrorMessage(error.message)
    } else {
      setMessage('Password updated successfully. Redirecting to login...')

      setTimeout(() => {
        navigate('/login')
      }, 1800)
    }

    setLoading(false)
  }

  return (
    <section>
      <p className="page-kicker">Password Reset</p>
      <h1>Create your new password 🔐</h1>
      <p className="page-intro">
        Enter a new password for your ManiJournal account.
      </p>

      <form className="feature-form" onSubmit={handleUpdatePassword}>
        <div className="form-header">
          <h2>New Password</h2>
          <span className="form-sparkle">✦</span>
        </div>

        <div>
          <label htmlFor="password">New Password</label>
          <input
            id="password"
            type="password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            required
          />
        </div>

        <div>
          <label htmlFor="confirmPassword">Confirm New Password</label>
          <input
            id="confirmPassword"
            type="password"
            value={confirmPassword}
            onChange={(event) => setConfirmPassword(event.target.value)}
            required
          />
        </div>

        <button type="submit" disabled={loading}>
          {loading ? 'Updating...' : 'Update Password'}
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

export default ResetPassword