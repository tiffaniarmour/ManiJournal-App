import { useMemo, useState } from 'react'
import { affirmationBank } from '../data/affirmationBank.js'

function Affirmations() {
  const [selectedAffirmation, setSelectedAffirmation] = useState(null)
  const [selectedCategory, setSelectedCategory] = useState('All')

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

    const randomIndex = Math.floor(Math.random() * filteredAffirmations.length)
    const randomAffirmation = filteredAffirmations[randomIndex]

    setSelectedAffirmation(randomAffirmation)
  }

  return (
    <section>
      <div className="page-header">
        <div>
          <h1>Affirmation Library</h1>
          <p>
            Choose a category, then pull a random affirmation when you need a
            mindset reset.
          </p>
        </div>
      </div>

      <div className="card">
        <h2>Pull an Affirmation</h2>

        <label htmlFor="affirmation-category">Category</label>
        <select
          id="affirmation-category"
          value={selectedCategory}
          onChange={(event) => {
            setSelectedCategory(event.target.value)
            setSelectedAffirmation(null)
          }}
        >
          {categories.map((category) => (
            <option key={category} value={category}>
              {category}
            </option>
          ))}
        </select>

        <button type="button" onClick={chooseRandomAffirmation}>
          Pull Random Affirmation
        </button>
      </div>

      {selectedAffirmation ? (
        <div className="card affirmation-pull-card">
          <p className="affirmation-category">
            {selectedAffirmation.category}
          </p>

          <h2 className="affirmation-pull-text">
            “{selectedAffirmation.text}”
          </h2>

          <button type="button" onClick={chooseRandomAffirmation}>
            Pull Another
          </button>
        </div>
      ) : (
        <div className="card affirmation-empty-card">
          <p>No affirmation pulled yet.</p>
        </div>
      )}
    </section>
  )
}

export default Affirmations