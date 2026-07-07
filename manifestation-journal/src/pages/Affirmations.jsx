import { useMemo, useState } from 'react'
import { affirmationBank } from '../data/affirmationBank'

function Affirmations() {
  const [selectedAffirmation, setSelectedAffirmation] = useState(null)
  const [selectedCategory, setSelectedCategory] = useState('All')
  const [pullCount, setPullCount] = useState(0)

  const categories = useMemo(() => {
    const categorySet = new Set()

    affirmationBank.forEach((affirmation) => {
      categorySet.add(affirmation.category)
    })

    return ['All', ...Array.from(categorySet).sort()]
  }, [])

  const filteredAffirmations = useMemo(() => {
    if (selectedCategory === 'All') {
      return affirmationBank
    }

    return affirmationBank.filter(
      (affirmation) => affirmation.category === selectedCategory
    )
  }, [selectedCategory])

  function chooseRandomAffirmation() {
    if (filteredAffirmations.length === 0) return

    if (filteredAffirmations.length === 1) {
      setSelectedAffirmation(filteredAffirmations[0])
      setPullCount((currentCount) => currentCount + 1)
      return
    }

    let randomAffirmation =
      filteredAffirmations[Math.floor(Math.random() * filteredAffirmations.length)]

    let attempts = 0

    while (
      selectedAffirmation &&
      randomAffirmation.text === selectedAffirmation.text &&
      attempts < 10
    ) {
      randomAffirmation =
        filteredAffirmations[Math.floor(Math.random() * filteredAffirmations.length)]

      attempts += 1
    }

    setSelectedAffirmation(randomAffirmation)
    setPullCount((currentCount) => currentCount + 1)
  }

  return (
    <section>
      <p className="page-kicker">Affirmation Library</p>
      <h1>Pull what your mind needs today 💎</h1>
      <p className="page-intro">
        Choose a focus area, then pull a random affirmation from the hidden bank.
        The full list stays tucked away so the message can meet you fresh.
      </p>

      <div className="dashboard-feature-grid">
        <article className="dashboard-feature-card">
          <div className="entry-card-top">
            <h2>🃏 Choose Your Focus</h2>
          </div>

          <label htmlFor="affirmation-category">Category</label>
          <select
            id="affirmation-category"
            value={selectedCategory}
            onChange={(event) => {
              setSelectedCategory(event.target.value)
              setSelectedAffirmation(null)
              setPullCount(0)
            }}
          >
            {categories.map((category) => (
              <option key={category} value={category}>
                {category}
              </option>
            ))}
          </select>

          <button type="button" onClick={chooseRandomAffirmation}>
            {selectedAffirmation ? 'Pull Another' : 'Pull Affirmation'}
          </button>

          <p className="page-intro">
            Current focus: <strong>{selectedCategory}</strong>
          </p>
        </article>

        <article className="dashboard-feature-card">
          <div className="entry-card-top">
            <h2>✨ Your Pull</h2>
            <span className="mood-badge">
              {selectedAffirmation?.category || 'Waiting'}
            </span>
          </div>

          {selectedAffirmation ? (
            <>
              <p className="dashboard-affirmation">
                “{selectedAffirmation.text}”
              </p>

              <p className="page-intro">
                Pull count this session: {pullCount}
              </p>
            </>
          ) : (
            <p>
              No affirmation pulled yet. Choose a category and pull when you are ready.
            </p>
          )}
        </article>
      </div>
    </section>
  )
}

export default Affirmations