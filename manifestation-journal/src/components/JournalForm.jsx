import { useState } from 'react'

function JournalForm() {
  const [title, setTitle] = useState('')
  const [content, setContent] = useState('')
  const [mood, setMood] = useState('')
  const [energy, setEnergy] = useState('5')
  const [entries, setEntries] = useState([])

  function handleSubmit(event) {
    event.preventDefault()

    const newEntry = {
      id: Date.now(),
      title: title,
      content: content,
      mood: mood,
      energy: energy,
    }

    setEntries([newEntry, ...entries])
    setTitle('')
    setContent('')
    setMood('')
    setEnergy('5')
  }

  function handleDelete(id) {
    const updatedEntries = entries.filter((entry) => entry.id !== id)
    setEntries(updatedEntries)
  }

  return (
    <section>
      <h2>New Journal Entry</h2>

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

        <button type="submit">Save Entry</button>
      </form>

      <section>
        <h2>Journal Entries</h2>

        {entries.map((entry) => (
          <article key={entry.id}>
            <h3>{entry.title}</h3>
            <p>{entry.content}</p>
            <p>Mood: {entry.mood}</p>
            <p>Energy: {entry.energy}/10</p>

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