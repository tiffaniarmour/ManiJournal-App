import { useState } from 'react'

function JournalForm() {
  const [title, setTitle] = useState('')
  const [content, setContent] = useState('')
  const [entries, setEntries] = useState([])

  function handleSubmit(event) {
    event.preventDefault()

    const newEntry = {
      id: Date.now(),
      title: title,
      content: content,
    }

    setEntries([newEntry, ...entries])
    setTitle('')
    setContent('')
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

        <button type="submit">Save Entry</button>
      </form>

      <section>
        <h2>Journal Entries</h2>

        {entries.map((entry) => (
          <article key={entry.id}>
            <h3>{entry.title}</h3>
            <p>{entry.content}</p>
          </article>
        ))}
      </section>
    </section>
  )
}

export default JournalForm