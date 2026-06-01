import { useEffect, useState } from 'react'
import { supabase } from '../services/supabase'

function JournalForm() {
  const [title, setTitle] = useState('')
  const [content, setContent] = useState('')
  const [mood, setMood] = useState('')
  const [energy, setEnergy] = useState('5')
  const [entries, setEntries] = useState([])
  const [editingId, setEditingId] = useState(null)

  useEffect(() => {
    loadEntries()
  }, [])

  async function loadEntries() {
    const { data, error } = await supabase
      .from('journal_entries')
      .select('*')
      .order('created_at', { ascending: false })

    if (error) {
      console.log('Load error:', error)
      return
    }

    setEntries(data)
  }

  async function handleSubmit(event) {
    event.preventDefault()

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

      if (error) {
        console.log('Update error:', error)
        return
      }

      setEditingId(null)
    } else {
      const { error } = await supabase
        .from('journal_entries')
        .insert({
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
    loadEntries()
  }

  function handleEdit(entry) {
    setEditingId(entry.id)
    setTitle(entry.title)
    setContent(entry.entry)
    setMood(entry.mood)
    setEnergy(String(entry.energy))
  }

  async function handleDelete(id) {
    const { error } = await supabase
      .from('journal_entries')
      .delete()
      .eq('id', id)

    if (error) {
      console.log('Delete error:', error)
      return
    }

    loadEntries()
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

        {entries.length === 0 && <p>No journal entries yet.</p>}

        {entries.map((entry) => (
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