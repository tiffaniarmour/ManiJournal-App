import { useEffect, useState } from 'react'
import { supabase } from '../services/supabase'

function Manifestations() {
  const [user, setUser] = useState(null)
  const [manifestations, setManifestations] = useState([])

  const [desire, setDesire] = useState('')
  const [evidence, setEvidence] = useState('')
  const [manifested, setManifested] = useState(false)
  const [editingId, setEditingId] = useState(null)

  useEffect(() => {
    async function getUser() {
      const { data } = await supabase.auth.getUser()

      setUser(data.user)

      if (data.user) {
        loadManifestations(data.user.id)
      }
    }

    getUser()
  }, [])

  async function loadManifestations(userId) {
    const { data, error } = await supabase
      .from('manifestations')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false })

    if (error) {
      console.error(error)
      return
    }

    setManifestations(data)
  }

  async function handleSubmit(event) {
    event.preventDefault()

    if (!user) return

    if (editingId) {
      const { error } = await supabase
        .from('manifestations')
        .update({
          desire,
          evidence,
          manifested,
        })
        .eq('id', editingId)
        .eq('user_id', user.id)

      if (error) {
        console.error(error)
        return
      }
    } else {
      const { error } = await supabase
        .from('manifestations')
        .insert({
          user_id: user.id,
          desire,
          evidence,
          manifested,
        })

      if (error) {
        console.error(error)
        return
      }
    }

    clearForm()
    loadManifestations(user.id)
  }

  async function handleDelete(id) {
    if (!user) return

    const { error } = await supabase
      .from('manifestations')
      .delete()
      .eq('id', id)
      .eq('user_id', user.id)

    if (error) {
      console.error(error)
      return
    }

    loadManifestations(user.id)
  }

  function handleEdit(item) {
    setEditingId(item.id)
    setDesire(item.desire || '')
    setEvidence(item.evidence || '')
    setManifested(item.manifested || false)
  }

  function clearForm() {
    setEditingId(null)
    setDesire('')
    setEvidence('')
    setManifested(false)
  }

  if (!user) {
    return <p>Please log in to track manifestations.</p>
  }

  return (
    <section>
      <h1>Manifestation Tracker</h1>

      <form onSubmit={handleSubmit}>
        <div>
          <label>Desire</label>
          <input
            value={desire}
            onChange={(e) => setDesire(e.target.value)}
          />
        </div>

        <div>
          <label>Evidence</label>
          <textarea
            rows="5"
            value={evidence}
            onChange={(e) => setEvidence(e.target.value)}
          />
        </div>

        <div>
          <label>
            <input
              type="checkbox"
              checked={manifested}
              onChange={(e) => setManifested(e.target.checked)}
            />
            Manifested
          </label>
        </div>

        <button type="submit">
          {editingId ? 'Update Manifestation' : 'Save Manifestation'}
        </button>
      </form>

      <hr />

      <h2>My Manifestations</h2>

      {manifestations.length === 0 ? (
        <p>No manifestations yet.</p>
      ) : (
        manifestations.map((item) => (
          <article key={item.id}>
            <h3>{item.desire}</h3>

            <p>
              <strong>Status:</strong>{' '}
              {item.manifested ? 'Manifested 🎉' : 'In Progress'}
            </p>

            <p>{item.evidence}</p>

            <button onClick={() => handleEdit(item)}>
              Edit
            </button>

            <button onClick={() => handleDelete(item.id)}>
              Delete
            </button>

            <hr />
          </article>
        ))
      )}
    </section>
  )
}

export default Manifestations