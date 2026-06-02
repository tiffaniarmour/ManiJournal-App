import { useState } from 'react'
import { supabase } from '../services/supabase'

function Auth() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

  async function handleSignUp() {
    const { error } = await supabase.auth.signUp({
      email,
      password,
    })

    if (error) {
      alert(error.message)
      return
    }

    alert('Check your email to confirm your account.')
  }

  async function handleSignIn() {
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    })

    if (error) {
      alert(error.message)
      return
    }

    alert('Signed in successfully.')
  }

  return (
    <section>
      <h2>Account Access</h2>

      <div>
        <label>Email</label>
        <input
          type="email"
          value={email}
          onChange={(event) => setEmail(event.target.value)}
        />
      </div>

      <div>
        <label>Password</label>
        <input
          type="password"
          value={password}
          onChange={(event) => setPassword(event.target.value)}
        />
      </div>

      <button type="button" onClick={handleSignIn}>
        Sign In
      </button>

      <button type="button" onClick={handleSignUp}>
        Sign Up
      </button>
    </section>
  )
}

export default Auth