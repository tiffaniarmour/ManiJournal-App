import { useEffect, useState } from 'react'
import { supabase } from '../services/supabase'

function Affirmations() {
  const [user, setUser] = useState(null)
  const [affirmations, setAffirmations] = useState([])

  const [category, setCategory] = useState('')
  const [text, setText] = useState('')
  const [editingId, setEditingId] = useState(null)

  useEffect(() => {
    async function getUser() {
      const { data } = await supabase.auth.getUser()

      setUser(data.user)

      if (data.user) {
        loadAffirmations(data.user.id)
      }
    }

    getUser()
  }, [])

  async function loadAffirmations(userId) {
    const { data, error } = await supabase
      .from('affirmations')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false })

    if (error) {
      console.error(error)
      return
    }

    setAffirmations(data)
  }

  async function handleSubmit(event) {
    event.preventDefault()

    if (!user) return

    if (editingId) {
      const { error } = await supabase
        .from('affirmations')
        .update({
          category,
          text,
        })
        .eq('id', editingId)

      if (error) {
        console.error(error)
        return
      }
    } else {
      const { error } = await supabase
        .from('affirmations')
        .insert({
          user_id: user.id,
          category,
          text,
          favorite: false,
        })

      if (error) {
        console.error(error)
        return
      }
    }

    setCategory('')
    setText('')
    setEditingId(null)

    loadAffirmations(user.id)
  }

  async function handleDelete(id) {
    const { error } = await supabase
      .from('affirmations')
      .delete()
      .eq('id', id)

    if (error) {
      console.error(error)
      return
    }

    loadAffirmations(user.id)
  }

  async function toggleFavorite(item) {
    const { error } = await supabase
      .from('affirmations')
      .update({
        favorite: !item.favorite,
      })
      .eq('id', item.id)

    if (error) {
      console.error(error)
      return
    }

    loadAffirmations(user.id)
  }

  function handleEdit(item) {
    setEditingId(item.id)
    setCategory(item.category)
    setText(item.text)
  }

  if (!user) {
    return <p>Please log in first.</p>
  }

  return (
    <section>
      <h1>Affirmation Bank</h1>

      <form onSubmit={handleSubmit}>
        <div>
          <label>Category</label>
          <input
            value={category}
            onChange={(e) => setCategory(e.target.value)}
          />
        </div>

        <div>
          <label>Affirmation</label>
          <textarea
            rows="4"
            value={text}
            onChange={(e) => setText(e.target.value)}
          />
        </div>

        <button type="submit">
          {editingId ? 'Update' : 'Save'}
        </button>
      </form>

      <hr />

      <h2>My Affirmations</h2>

      {affirmations.map((item) => (
        <article key={item.id}>
          <p>
            <strong>{item.category}</strong>
          </p>

          <p>{item.text}</p>

          <p>
            Favorite:{' '}
            {item.favorite ? '⭐' : '☆'}
          </p>

          <button
            onClick={() => toggleFavorite(item)}
          >
            Toggle Favorite
          </button>

          <button
            onClick={() => handleEdit(item)}
          >
            Edit
          </button>

          <button
            onClick={() => handleDelete(item.id)}
          >
            Delete
          </button>

          <hr />
        </article>
      ))}
    </section>
  )
}

export default Affirmations