import { useEffect, useState } from 'react'
import { supabase } from '../services/supabase'

function Goals() {
  const [goals, setGoals] = useState([])
  const [user, setUser] = useState(null)
  const [editingId, setEditingId] = useState(null)
  const [loading, setLoading] = useState(true)

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: '',
    target_date: '',
    status: 'Not Started',
    progress: 0,
    why_it_matters: '',
  })

  useEffect(() => {
    getUser()
  }, [])

  useEffect(() => {
    if (user) {
      fetchGoals()
    }
  }, [user])

  async function getUser() {
    const { data } = await supabase.auth.getUser()
    setUser(data?.user || null)
  }

  async function fetchGoals() {
    setLoading(true)

    const { data, error } = await supabase
      .from('manifestation_goals')
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false })

    if (error) {
      console.error('Error fetching goals:', error)
    } else {
      setGoals(data || [])
    }

    setLoading(false)
  }

  function handleChange(event) {
    const { name, value } = event.target

    setFormData((currentData) => ({
      ...currentData,
      [name]: name === 'progress' ? Number(value) : value,
    }))
  }

  async function handleSubmit(event) {
    event.preventDefault()

    if (!user) return

    const goalData = {
      ...formData,
      user_id: user.id,
    }

    if (editingId) {
      const { error } = await supabase
        .from('manifestation_goals')
        .update(goalData)
        .eq('id', editingId)
        .eq('user_id', user.id)

      if (error) {
        console.error('Error updating goal:', error)
      }
    } else {
      const { error } = await supabase
        .from('manifestation_goals')
        .insert([goalData])

      if (error) {
        console.error('Error adding goal:', error)
      }
    }

    resetForm()
    fetchGoals()
  }

  function handleEdit(goal) {
    setEditingId(goal.id)

    setFormData({
      title: goal.title || '',
      description: goal.description || '',
      category: goal.category || '',
      target_date: goal.target_date || '',
      status: goal.status || 'Not Started',
      progress: goal.progress || 0,
      why_it_matters: goal.why_it_matters || '',
    })
  }

  async function handleDelete(id) {
    if (!user) return

    const { error } = await supabase
      .from('manifestation_goals')
      .delete()
      .eq('id', id)
      .eq('user_id', user.id)

    if (error) {
      console.error('Error deleting goal:', error)
    } else {
      fetchGoals()
    }
  }

  function resetForm() {
    setEditingId(null)

    setFormData({
      title: '',
      description: '',
      category: '',
      target_date: '',
      status: 'Not Started',
      progress: 0,
      why_it_matters: '',
    })
  }

  if (!user) {
    return (
      <section>
        <p className="page-kicker">Manifestation Goals</p>
        <h1>Sign in to plan your next becoming.</h1>
        <p className="page-intro">
          Your goals are personal. Log in first so your manifestation map stays connected to your account.
        </p>
      </section>
    )
  }

  return (
    <section>
      <p className="page-kicker">Manifestation Goals</p>
      <h1>Goals with roots, receipts, and momentum 🎯</h1>
      <p className="page-intro">
        Name the thing, give it a reason, track the progress, and keep the goal connected to the life you are actually building.
      </p>

      <form className="feature-form" onSubmit={handleSubmit}>
        <div className="form-header">
          <h2>{editingId ? 'Update This Goal' : 'Create a New Goal'}</h2>
          <span className="form-sparkle">✦</span>
        </div>

        <div className="form-row">
          <div>
            <label htmlFor="title">Goal Title</label>
            <input
              id="title"
              name="title"
              type="text"
              value={formData.title}
              onChange={handleChange}
              required
            />
          </div>

          <div>
            <label htmlFor="category">Category</label>
            <input
              id="category"
              name="category"
              type="text"
              value={formData.category}
              onChange={handleChange}
              placeholder="Money, wellness, home, creativity..."
            />
          </div>
        </div>

        <div>
          <label htmlFor="description">Goal Description</label>
          <textarea
            id="description"
            name="description"
            rows="4"
            value={formData.description}
            onChange={handleChange}
          />
        </div>

        <div>
          <label htmlFor="why_it_matters">Why This Matters</label>
          <textarea
            id="why_it_matters"
            name="why_it_matters"
            rows="3"
            value={formData.why_it_matters}
            onChange={handleChange}
          />
        </div>

        <div className="form-row">
          <div>
            <label htmlFor="target_date">Target Date</label>
            <input
              id="target_date"
              name="target_date"
              type="date"
              value={formData.target_date}
              onChange={handleChange}
            />
          </div>

          <div>
            <label htmlFor="status">Status</label>
            <select
              id="status"
              name="status"
              value={formData.status}
              onChange={handleChange}
            >
              <option>Not Started</option>
              <option>In Progress</option>
              <option>Paused</option>
              <option>Completed</option>
            </select>
          </div>
        </div>

        <div>
          <label htmlFor="progress">Progress: {formData.progress}%</label>
          <input
            id="progress"
            name="progress"
            type="range"
            min="0"
            max="100"
            value={formData.progress}
            onChange={handleChange}
          />
        </div>

        <button type="submit">
          {editingId ? 'Save Goal Update' : 'Add Goal'}
        </button>

        {editingId && (
          <button type="button" onClick={resetForm}>
            Cancel Edit
          </button>
        )}
      </form>

      <div className="entries-section">
        <div className="section-heading">
          <h2>Your Goal Map</h2>
          <span className="entry-count">{goals.length} goals</span>
        </div>

        {loading ? (
          <p>Loading your goals...</p>
        ) : goals.length === 0 ? (
          <article>
            <h3>No goals yet</h3>
            <p>
              Start with one goal that would make your life feel more honest, supported, or aligned.
            </p>
          </article>
        ) : (
          <div className="entry-grid">
            {goals.map((goal) => (
              <article className="journal-entry-card" key={goal.id}>
                <div className="entry-card-top">
                  <h3>{goal.title}</h3>
                  <span className="mood-badge">{goal.status}</span>
                </div>

                {goal.category && <p><strong>Category:</strong> {goal.category}</p>}
                {goal.description && <p>{goal.description}</p>}
                {goal.why_it_matters && <p><strong>Why it matters:</strong> {goal.why_it_matters}</p>}

                <div className="entry-meta">
                  <span>Progress: {goal.progress || 0}%</span>
                  {goal.target_date && <span>Target: {goal.target_date}</span>}
                </div>

                <div className="entry-actions">
                  <button type="button" onClick={() => handleEdit(goal)}>
                    Edit
                  </button>
                  <button type="button" onClick={() => handleDelete(goal.id)}>
                    Delete
                  </button>
                </div>
              </article>
            ))}
          </div>
        )}
      </div>
    </section>
  )
}

export default Goals