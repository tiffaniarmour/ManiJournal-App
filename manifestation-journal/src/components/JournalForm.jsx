function JournalForm() {
  return (
    <section>
      <h2>New Journal Entry</h2>

      <form>
        <div>
          <label htmlFor="journal-title">Title</label>
          <input id="journal-title" type="text" />
        </div>

        <div>
          <label htmlFor="journal-content">Entry</label>
          <textarea id="journal-content" rows="6"></textarea>
        </div>

        <button type="submit">Save Entry</button>
      </form>
    </section>
  )
}

export default JournalForm