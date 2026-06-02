import { useEffect, useState } from 'react'
import { supabase } from '../services/supabase'

function VisionBoards() {
  const [items, setItems] = useState([])
  const [user, setUser] = useState(null)
  const [editingId, setEditingId] = useState(null)
  const [loading, setLoading] = useState(true)

  const [formData, setFormData] = useState({
    title: '',
    image_url: '',
    category: '',
    notes: '',
  })

  useEffect(() => {
    getUser()
  }, [])

  useEffect(() => {
    if (user) {
      fetchItems()
    }
  }, [user])

  async function getUser() {
    const { data } = await supabase.auth.getUser()
    setUser(data?.user || null)
  }

  async function fetchItems() {
    setLoading(true)

    const { data, error } = await supabase
      .from('vision_board_items')
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false })

    if (error) {
      console.error('Error fetching vision board items:', error)
    } else {
      setItems(data || [])
    }

    setLoading(false)
  }

  function handleChange(event) {
    const { name, value } = event.target

    setFormData((currentData) => ({
      ...currentData,
      [name]: value,
    }))
  }

  async function handleSubmit(event) {
    event.preventDefault()

    if (!user) return

    const visionItem = {
      ...formData,
      user_id: user.id,
    }

    if (editingId) {
      const { error } = await supabase
        .from('vision_board_items')
        .update(visionItem)
        .eq('id', editingId)
        .eq('user_id', user.id)

      if (error) {
        console.error('Error updating vision board item:', error)
      }
    } else {
      const { error } = await supabase
        .from('vision_board_items')
        .insert([visionItem])

      if (error) {
        console.error('Error adding vision board item:', error)
      }
    }

    resetForm()
    fetchItems()
  }

  function handleEdit(item) {
    setEditingId(item.id)

    setFormData({
      title: item.title || '',
      image_url: item.image_url || '',
      category: item.category || '',
      notes: item.notes || '',
    })
  }

  async function handleDelete(id) {
    if (!user) return

    const { error } = await supabase
      .from('vision_board_items')
      .delete()
      .eq('id', id)
      .eq('user_id', user.id)

    if (error) {
      console.error('Error deleting vision board item:', error)
    } else {
      fetchItems()
    }
  }

  function resetForm() {
    setEditingId(null)

    setFormData({
      title: '',
      image_url: '',
      category: '',
      notes: '',
    })
  }

  if (!user) {
    return (
      <section>
        <p className="page-kicker">Vision Board</p>
        <h1>Sign in to build your visual manifestation board.</h1>
        <p className="page-intro">
          Your vision board is personal. Log in first so your images, notes, and future plans stay connected to your account.
        </p>
      </section>
    )
  }

  return (
    <section>
      <p className="page-kicker">Vision Board</p>
      <h1>Your visual becoming board 🖼</h1>
      <p className="page-intro">
        Start collecting the images, symbols, places, objects, and feelings that represent what you are calling into your real life.
      </p>

      <form className="feature-form" onSubmit={handleSubmit}>
        <div className="form-header">
          <h2>{editingId ? 'Update Vision Item' : 'Add to Your Vision Board'}</h2>
          <span className="form-sparkle">✦</span>
        </div>

        <div className="form-row">
          <div>
            <label htmlFor="title">Vision Title</label>
            <input
              id="title"
              name="title"
              type="text"
              value={formData.title}
              onChange={handleChange}
              placeholder="New home, dream studio, peaceful body..."
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
              placeholder="Home, money, wellness, love, creativity..."
            />
          </div>
        </div>

        <div>
          <label htmlFor="image_url">Image URL</label>
          <input
            id="image_url"
            name="image_url"
            type="url"
            value={formData.image_url}
            onChange={handleChange}
            placeholder="Paste an image link here"
            required
          />
        </div>

        <div>
          <label htmlFor="notes">Why This Belongs on Your Board</label>
          <textarea
            id="notes"
            name="notes"
            rows="4"
            value={formData.notes}
            onChange={handleChange}
            placeholder="What does this image represent for you?"
          />
        </div>

        <button type="submit">
          {editingId ? 'Save Vision Item' : 'Add Vision Item'}
        </button>

        {editingId && (
          <button type="button" onClick={resetForm}>
            Cancel Edit
          </button>
        )}
      </form>

      <div className="entries-section">
        <div className="section-heading">
          <h2>Your Vision Board</h2>
          <span className="entry-count">{items.length} items</span>
        </div>

        {loading ? (
          <p>Loading your vision board...</p>
        ) : items.length === 0 ? (
          <article>
            <h3>No vision board items yet</h3>
            <p>
              Add one image that represents something you are ready to see, feel, build, receive, or become.
            </p>
          </article>
        ) : (
          <div className="vision-board-grid">
            {items.map((item) => (
              <article className="vision-card" key={item.id}>
                <img src={item.image_url} alt={item.title} />

                <div className="vision-card-body">
                  <div className="entry-card-top">
                    <h3>{item.title}</h3>
                    {item.category && <span className="mood-badge">{item.category}</span>}
                  </div>

                  {item.notes && <p>{item.notes}</p>}

                  <div className="entry-actions">
                    <button type="button" onClick={() => handleEdit(item)}>
                      Edit
                    </button>
                    <button type="button" onClick={() => handleDelete(item.id)}>
                      Delete
                    </button>
                  </div>
                </div>
              </article>
            ))}
          </div>
        )}
      </div>
    </section>
  )
}

export default VisionBoards