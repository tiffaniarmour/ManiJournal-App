import { useEffect, useState } from 'react'
import { supabase } from '../services/supabase'

function FutureSelf() {
  const [user, setUser] = useState(null)
  const [letters, setLetters] = useState([])

  const [title, setTitle] = useState('')
  const [letterText, setLetterText] = useState('')
  const [futureDate, setFutureDate] = useState('')
  const [opened, setOpened] = useState(false)
  const [editingId, setEditingId] = useState(null)

  useEffect(() => {
    async function getUser() {
      const { data } = await supabase.auth.getUser()
      setUser(data.user)

      if (data.user) {
        loadLetters(data.user.id)
      }
    }

    getUser()
  }, [])

  async function loadLetters(userId) {
    const { data, error } = await supabase
      .from('future_self_letters')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false })

    if (error) {
      console.error(error)
      return
    }

    setLetters(data)
  }

  async function handleSubmit(event) {
    event.preventDefault()

    if (!user) return

    if (editingId) {
      const { error } = await supabase
        .from('future_self_letters')
        .update({
          title,
          letter_text: letterText,
          future_date: futureDate,
          opened,
        })
        .eq('id', editingId)
        .eq('user_id', user.id)

      if (error) {
        console.error(error)
        return
      }
    } else {
      const { error } = await supabase
        .from('future_self_letters')
        .insert({
          user_id: user.id,
          title,
          letter_text: letterText,
          future_date: futureDate,
          opened,
        })

      if (error) {
        console.error(error)
        return
      }
    }

    clearForm()
    loadLetters(user.id)
  }

  async function handleDelete(id) {
    if (!user) return

    const { error } = await supabase
      .from('future_self_letters')
      .delete()
      .eq('id', id)
      .eq('user_id', user.id)

    if (error) {
      console.error(error)
      return
    }

    loadLetters(user.id)
  }

  function handleEdit(letter) {
    setEditingId(letter.id)
    setTitle(letter.title || '')
    setLetterText(letter.letter_text || '')
    setFutureDate(letter.future_date || '')
    setOpened(letter.opened || false)
  }

  function clearForm() {
    setEditingId(null)
    setTitle('')
    setLetterText('')
    setFutureDate('')
    setOpened(false)
  }

  if (!user) {
    return <p>Please log in to write future self letters.</p>
  }

  return (
    <section>
      <h1>Future Self Letters</h1>

      <form onSubmit={handleSubmit}>
        <div>
          <label>Letter Title</label>
          <input value={title} onChange={(e) => setTitle(e.target.value)} />
        </div>

        <div>
          <label>Letter</label>
          <textarea
            rows="8"
            value={letterText}
            onChange={(e) => setLetterText(e.target.value)}
          />
        </div>

        <div>
          <label>Future Date</label>
          <input
            type="date"
            value={futureDate}
            onChange={(e) => setFutureDate(e.target.value)}
          />
        </div>

        <div>
          <label>
            <input
              type="checkbox"
              checked={opened}
              onChange={(e) => setOpened(e.target.checked)}
            />
            Opened
          </label>
        </div>

        <button type="submit">
          {editingId ? 'Update Letter' : 'Save Letter'}
        </button>
      </form>

      <hr />

      <h2>My Future Self Letters</h2>

      {letters.length === 0 ? (
        <p>No letters yet.</p>
      ) : (
        letters.map((letter) => (
          <article key={letter.id}>
            <h3>{letter.title}</h3>
            <p><strong>Future Date:</strong> {letter.future_date}</p>
            <p><strong>Status:</strong> {letter.opened ? 'Opened' : 'Unopened'}</p>
            <p>{letter.letter_text}</p>

            <button onClick={() => handleEdit(letter)}>Edit</button>
            <button onClick={() => handleDelete(letter.id)}>Delete</button>

            <hr />
          </article>
        ))
      )}
    </section>
  )
}

export default FutureSelf