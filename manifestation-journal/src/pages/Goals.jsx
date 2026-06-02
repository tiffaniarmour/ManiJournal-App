import { useEffect, useState } from 'react'
import { supabase } from '../services/supabase'

function Goals() {
  const [user, setUser] = useState(null)
  const [goals, setGoals] = useState([])

  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [category, setCategory] = useState('')
  const [targetDate, setTargetDate] = useState('')
  const [status, setStatus] = useState('In Progress')
  const [progress, setProgress] = useState(0)
  const [whyItMatters, setWhyItMatters] = useState('')

  const [editingId, setEditingId] = useState(null)

  useEffect(() => {
    async function getUser() {
      const { data } = await supabase.auth.getUser()
      setUser(data.user)

      if (data.user) {
        loadGoals(data.user.id)
      }
    }

    getUser()
  }, [])

  async function loadGoals(userId) {
    const { data, error } = await supabase
      .from('manifestation_goals')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false })

    if (error) {
      console.error(error)
      return
    }

    setGoals(data)
  }

  async function handleSubmit(event) {
    event.preventDefault()

    if (!user) {
      alert('Please log in first.')
      return
    }

    if (editingId) {
      const { error } = await supabase
        .from('manifestation_goals')
        .update({
          title,
          description,
          category,
          target_date: targetDate,
          status,
          progress: Number(progress),
          why_it_matters: whyItMatters,
        })
        .eq('id', editingId)
        .eq('user_id', user.id)

      if (error) {
        console.error(error)
        return
      }
    } else {
      const { error } = await supabase
        .from('manifestation_goals')
        .insert({
          user_id: user.id,
          title,
          description,
          category,
          target_date: targetDate,
          status,
          progress: Number(progress),
          why_it_matters: whyItMatters,
        })

      if (error) {
        console.error(error)
        return
      }
    }

    clearForm()
    loadGoals(user.id)
  }

  async function handleDelete(id) {
    if (!user) return

    const { error } = await supabase
      .from('manifestation_goals')
      .delete()
      .eq('id', id)
      .eq('user_id', user.id)

    if (error) {
      console.error(error)
      return
    }

    loadGoals(user.id)
  }

  function handleEdit(goal) {
    setEditingId(goal.id)
    setTitle(goal.title || '')
    setDescription(goal.description || '')
    setCategory(goal.category || '')
    setTargetDate(goal.target_date || '')
    setStatus(goal.status || 'In Progress')
    setProgress(goal.progress || 0)
    setWhyItMatters(goal.why_it_matters || '')
  }

  function clearForm() {
    setEditingId(null)
    setTitle('')
    setDescription('')
    setCategory('')
    setTargetDate('')
    setStatus('In Progress')
    setProgress(0)
    setWhyItMatters('')
  }

  if (!user) {
    return <p>Please log in to use manifestation goals.</p>
  }

  return (
    <section>
      <h1>Manifestation Goals</h1>

      <form onSubmit={handleSubmit}>
        <div>
          <label>Title</label>
          <input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
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
          <input
            value={category}
            onChange={(e) => setCategory(e.target.value)}
          />
        </div>

        <div>
          <label>Target Date</label>
          <input
            type="date"
            value={targetDate}
            onChange={(e) => setTargetDate(e.target.value)}
          />
        </div>

        <div>
          <label>Status</label>
          <select
            value={status}
            onChange={(e) => setStatus(e.target.value)}
          >
            <option>In Progress</option>
            <option>Completed</option>
            <option>On Hold</option>
          </select>
        </div>

        <div>
          <label>Progress %</label>
          <input
            type="number"
            min="0"
            max="100"
            value={progress}
            onChange={(e) => setProgress(e.target.value)}
          />
        </div>

        <div>
          <label>Why It Matters</label>
          <textarea
            rows="3"
            value={whyItMatters}
            onChange={(e) => setWhyItMatters(e.target.value)}
          />
        </div>

        <button type="submit">
          {editingId ? 'Update Goal' : 'Save Goal'}
        </button>
      </form>

      <hr />

      <h2>Manifestation Goals</h2>

      {goals.length === 0 ? (
        <p>No goals yet</p>
      ) : (
        goals.map((goal) => (
          <article key={goal.id}>
            <h3>{goal.title}</h3>

            <p>{goal.description}</p>

            <p>
              <strong>Category:</strong> {goal.category}
            </p>

            <p>
              <strong>Status:</strong> {goal.status}
            </p>

            <p>
              <strong>Progress:</strong> {goal.progress}%
            </p>

            <p>
              <strong>Target Date:</strong> {goal.target_date}
            </p>

            <p>
              <strong>Why It Matters:</strong> {goal.why_it_matters}
            </p>

            <button onClick={() => handleEdit(goal)}>
              Edit
            </button>

            <button onClick={() => handleDelete(goal.id)}>
              Delete
            </button>

            <hr />
          </article>
        ))
      )}
    </section>
  )
}

export default Goals