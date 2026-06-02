import { useEffect, useState } from 'react'
import { supabase } from '../services/supabase'

function Wins() {
  const [user, setUser] = useState(null)
  const [wins, setWins] = useState([])

  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [category, setCategory] = useState('')
  const [celebrationLevel, setCelebrationLevel] = useState(5)
  const [editingId, setEditingId] = useState(null)

  useEffect(() => {
    async function getUser() {
      const { data } = await supabase.auth.getUser()
      setUser(data.user)

      if (data.user) {
        loadWins(data.user.id)
      }
    }

    getUser()
  }, [])

  async function loadWins(userId) {
    const { data, error } = await supabase
      .from('wins')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false })

    if (error) {
      console.error(error)
      return
    }

    setWins(data)
  }

  async function handleSubmit(event) {
    event.preventDefault()

    if (!user) return

    if (editingId) {
      const { error } = await supabase
        .from('wins')
        .update({
          title,
          description,
          category,
          celebration_level: Number(celebrationLevel),
        })
        .eq('id', editingId)
        .eq('user_id', user.id)

      if (error) {
        console.error(error)
        return
      }
    } else {
      const { error } = await supabase
        .from('wins')
        .insert({
          user_id: user.id,
          title,
          description,
          category,
          celebration_level: Number(celebrationLevel),
        })

      if (error) {
        console.error(error)
        return
      }
    }

    clearForm()
    loadWins(user.id)
  }

  async function handleDelete(id) {
    if (!user) return

    const { error } = await supabase
      .from('wins')
      .delete()
      .eq('id', id)
      .eq('user_id', user.id)

    if (error) {
      console.error(error)
      return
    }

    loadWins(user.id)
  }

  function handleEdit(win) {
    setEditingId(win.id)
    setTitle(win.title || '')
    setDescription(win.description || '')
    setCategory(win.category || '')
    setCelebrationLevel(win.celebration_level || 5)
  }

  function clearForm() {
    setEditingId(null)
    setTitle('')
    setDescription('')
    setCategory('')
    setCelebrationLevel(5)
  }

  if (!user) {
    return <p>Please log in to track wins.</p>
  }

  return (
    <section>
      <h1>Wins Tracker</h1>

      <form onSubmit={handleSubmit}>
        <div>
          <label>Win Title</label>
          <input value={title} onChange={(e) => setTitle(e.target.value)} />
        </div>

        <div>
          <label>Description</label>
          <textarea
            rows="4"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
        </div>

        <div>
          <label>Category</label>
          <input value={category} onChange={(e) => setCategory(e.target.value)} />
        </div>

        <div>
          <label>Celebration Level</label>
          <input
            type="number"
            min="1"
            max="10"
            value={celebrationLevel}
            onChange={(e) => setCelebrationLevel(e.target.value)}
          />
        </div>

        <button type="submit">
          {editingId ? 'Update Win' : 'Save Win'}
        </button>
      </form>

      <hr />

      <h2>My Wins</h2>

      {wins.length === 0 ? (
        <p>No wins yet.</p>
      ) : (
        wins.map((win) => (
          <article key={win.id}>
            <h3>{win.title}</h3>
            <p>{win.description}</p>
            <p><strong>Category:</strong> {win.category}</p>
            <p><strong>Celebration Level:</strong> {win.celebration_level}/10</p>

            <button onClick={() => handleEdit(win)}>Edit</button>
            <button onClick={() => handleDelete(win.id)}>Delete</button>

            <hr />
          </article>
        ))
      )}
    </section>
  )
}

export default Wins