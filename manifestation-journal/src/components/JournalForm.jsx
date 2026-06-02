import { useEffect, useState } from 'react'
import { supabase } from '../services/supabase'

function JournalForm() {
  const [user, setUser] = useState(null)
  const [title, setTitle] = useState('')
  const [content, setContent] = useState('')
  const [mood, setMood] = useState('')
  const [energy, setEnergy] = useState('5')
  const [entries, setEntries] = useState([])
  const [editingId, setEditingId] = useState(null)

  const [searchTerm, setSearchTerm] = useState('')
  const [moodFilter, setMoodFilter] = useState('')
  const [sortOrder, setSortOrder] = useState('newest')

  useEffect(() => {
    async function getUser() {
      const { data } = await supabase.auth.getUser()
      setUser(data.user)

      if (data.user) {
        loadEntries(data.user.id)
      }
    }

    getUser()
  }, [])

  async function loadEntries(userId) {
    const { data, error } = await supabase
      .from('journal_entries')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false })

    if (error) {
      console.log('Load error:', error)
      return
    }

    setEntries(data)
  }

  async function handleSubmit(event) {
    event.preventDefault()

    if (!user) {
      alert('Please log in first.')
      return
    }

    if (editingId) {
      const { error } = await supabase
        .from('journal_entries')
        .update({
          title,
          entry: content,
          mood,
          energy: Number(energy),
        })
        .eq('id', editingId)
        .eq('user_id', user.id)

      if (error) {
        console.log('Update error:', error)
        return
      }

      setEditingId(null)
    } else {
      const { error } = await supabase
        .from('journal_entries')
        .insert({
          user_id: user.id,
          title,
          entry: content,
          mood,
          energy: Number(energy),
        })

      if (error) {
        console.log('Save error:', error)
        return
      }
    }

    setTitle('')
    setContent('')
    setMood('')
    setEnergy('5')
    loadEntries(user.id)
  }

  function handleEdit(entry) {
    setEditingId(entry.id)
    setTitle(entry.title)
    setContent(entry.entry)
    setMood(entry.mood)
    setEnergy(String(entry.energy))
  }

  async function handleDelete(id) {
    if (!user) return

    const { error } = await supabase
      .from('journal_entries')
      .delete()
      .eq('id', id)
      .eq('user_id', user.id)

    if (error) {
      console.log('Delete error:', error)
      return
    }

    loadEntries(user.id)
  }

  const filteredEntries = entries
    .filter((entry) =>
      entry.title.toLowerCase().includes(searchTerm.toLowerCase())
    )
    .filter((entry) =>
      moodFilter ? entry.mood === moodFilter : true
    )
    .sort((a, b) => {
      if (sortOrder === 'oldest') {
        return new Date(a.created_at) - new Date(b.created_at)
      }

      return new Date(b.created_at) - new Date(a.created_at)
    })

  if (!user) {
    return <p>Please log in to use your journal.</p>
  }

  return (
    <section>
      <h2>{editingId ? 'Edit Journal Entry' : 'New Journal Entry'}</h2>

      <form onSubmit={handleSubmit}>
        <div>
          <label htmlFor="journal-title">Title</label>
          <input
            id="journal-title"
            type="text"
            value={title}
            onChange={(event) => setTitle(event.target.value)}
          />
        </div>

        <div>
          <label htmlFor="journal-content">Entry</label>
          <textarea
            id="journal-content"
            rows="6"
            value={content}
            onChange={(event) => setContent(event.target.value)}
          ></textarea>
        </div>

        <div>
          <label htmlFor="journal-mood">Mood</label>
          <select
            id="journal-mood"
            value={mood}
            onChange={(event) => setMood(event.target.value)}
          >
            <option value="">Choose mood</option>
            <option value="Hopeful">Hopeful</option>
            <option value="Grounded">Grounded</option>
            <option value="Grateful">Grateful</option>
            <option value="Anxious">Anxious</option>
            <option value="Tired">Tired</option>
          </select>
        </div>

        <div>
          <label htmlFor="journal-energy">Energy</label>
          <input
            id="journal-energy"
            type="number"
            min="1"
            max="10"
            value={energy}
            onChange={(event) => setEnergy(event.target.value)}
          />
        </div>

        <button type="submit">
          {editingId ? 'Update Entry' : 'Save Entry'}
        </button>
      </form>

      <section>
        <h2>Journal Entries</h2>

        <div>
          <label htmlFor="journal-search">Search by title</label>
          <input
            id="journal-search"
            type="text"
            value={searchTerm}
            onChange={(event) => setSearchTerm(event.target.value)}
          />
        </div>

        <div>
          <label htmlFor="mood-filter">Filter by mood</label>
          <select
            id="mood-filter"
            value={moodFilter}
            onChange={(event) => setMoodFilter(event.target.value)}
          >
            <option value="">All moods</option>
            <option value="Hopeful">Hopeful</option>
            <option value="Grounded">Grounded</option>
            <option value="Grateful">Grateful</option>
            <option value="Anxious">Anxious</option>
            <option value="Tired">Tired</option>
          </select>
        </div>

        <div>
          <label htmlFor="sort-order">Sort by date</label>
          <select
            id="sort-order"
            value={sortOrder}
            onChange={(event) => setSortOrder(event.target.value)}
          >
            <option value="newest">Newest first</option>
            <option value="oldest">Oldest first</option>
          </select>
        </div>

        {filteredEntries.length === 0 && <p>No matching journal entries.</p>}

        {filteredEntries.map((entry) => (
          <article key={entry.id}>
            <h3>{entry.title}</h3>
            <p>{entry.entry}</p>
            <p>Mood: {entry.mood}</p>
            <p>Energy: {entry.energy}/10</p>

            <button type="button" onClick={() => handleEdit(entry)}>
              Edit
            </button>

            <button type="button" onClick={() => handleDelete(entry.id)}>
              Delete
            </button>
          </article>
        ))}
      </section>
    </section>
  )
}

export default JournalForm