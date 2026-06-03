import { useEffect, useState } from 'react'
import { supabase } from '../services/supabase'
import DashboardCard from '../components/DashboardCard'

function Dashboard() {
  const [journalEntries, setJournalEntries] = useState([])
  const [goals, setGoals] = useState([])
  const [manifestations, setManifestations] = useState([])
  const [affirmations, setAffirmations] = useState([])
  const [wins, setWins] = useState([])
  const [futureLetters, setFutureLetters] = useState([])
  const [visionItems, setVisionItems] = useState([])
  const [user, setUser] = useState(null)
  const [dailyAffirmation, setDailyAffirmation] = useState(null)

  useEffect(() => {
    loadDashboard()
  }, [])

  async function loadDashboard() {
    const { data } = await supabase.auth.getUser()

    if (!data.user) return

    setUser(data.user)

    const userId = data.user.id

    const { data: entries } = await supabase
      .from('journal_entries')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false })

    const { data: manifestationGoals } = await supabase
      .from('manifestation_goals')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false })

    const { data: manifestationData } = await supabase
      .from('manifestations')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false })

    const { data: affirmationData } = await supabase
      .from('affirmations')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false })

    const { data: winsData } = await supabase
      .from('wins')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false })

    const { data: lettersData } = await supabase
      .from('future_self_letters')
      .select('*')
      .eq('user_id', userId)
      .order('future_date', { ascending: true })

    const { data: visionData } = await supabase
      .from('vision_board_items')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false })

    setJournalEntries(entries || [])
    setGoals(manifestationGoals || [])
    setManifestations(manifestationData || [])
    setAffirmations(affirmationData || [])
    setWins(winsData || [])
    setFutureLetters(lettersData || [])
    setVisionItems(visionData || [])

    if (affirmationData && affirmationData.length > 0) {
      const randomIndex = Math.floor(Math.random() * affirmationData.length)
      setDailyAffirmation(affirmationData[randomIndex])
    }
  }

  function chooseAnotherAffirmation() {
    if (affirmations.length === 0) return

    const randomIndex = Math.floor(Math.random() * affirmations.length)
    setDailyAffirmation(affirmations[randomIndex])
  }

  function formatDate(dateValue) {
    if (!dateValue) return 'No date set'

    return new Date(dateValue).toLocaleDateString('en-US', {
      month: 'long',
      day: 'numeric',
      year: 'numeric',
    })
  }

  const totalEntries = journalEntries.length

  const averageEnergy =
    totalEntries === 0
      ? 0
      : (
          journalEntries.reduce(
            (sum, entry) => sum + Number(entry.energy || 0),
            0
          ) / totalEntries
        ).toFixed(1)

  const activeGoals = goals.filter(
    (goal) => goal.status !== 'Completed'
  )

  const completedGoals = goals.filter(
    (goal) => goal.status === 'Completed'
  ).length

  const manifestedCount = manifestations.filter(
    (manifestation) => manifestation.manifested
  ).length

  const recentWins = wins.slice(0, 3)
  const recentEntries = journalEntries.slice(0, 3)
  const recentVisionItems = visionItems.slice(0, 3)

  const nextFutureLetter = futureLetters.find(
    (letter) => !letter.opened
  )

  if (!user) {
    return (
      <section>
        <p className="page-kicker">Dashboard</p>
        <h1>Sign in to see your manifestation dashboard.</h1>
        <p className="page-intro">
          Your dashboard gathers your journal entries, goals, affirmations, wins, future self letters, and vision board into one place.
        </p>
      </section>
    )
  }

  return (
    <section>
      <p className="page-kicker">Daily Command Center</p>
      <h1>Welcome back to your becoming ✨</h1>
      <p className="page-intro">
        This is your daily snapshot of what you are tracking, building, celebrating, and calling into your real life.
      </p>

      <div className="dashboard-grid">
        <DashboardCard title="Journal Entries" value={totalEntries} />
        <DashboardCard title="Average Energy" value={`${averageEnergy}/10`} />
        <DashboardCard title="Active Goals" value={activeGoals.length} />
        <DashboardCard title="Completed Goals" value={completedGoals} />
        <DashboardCard title="Manifested" value={manifestedCount} />
        <DashboardCard title="Vision Items" value={visionItems.length} />
      </div>

      <div className="dashboard-feature-grid">
        <article className="dashboard-feature-card">
          <div className="entry-card-top">
            <h2>💎 Today's Affirmation</h2>
            <span className="mood-badge">
              {dailyAffirmation?.category || 'Affirmation'}
            </span>
          </div>

          {dailyAffirmation ? (
            <>
              <p className="dashboard-affirmation">
                “{dailyAffirmation.text}”
              </p>
              <button type="button" onClick={chooseAnotherAffirmation}>
                Show Another
              </button>
            </>
          ) : (
            <p>
              Add affirmations to your Affirmation Bank so this space can pull one for your daily focus.
            </p>
          )}
        </article>

        <article className="dashboard-feature-card">
          <div className="entry-card-top">
            <h2>🎯 Active Goals</h2>
            <span className="mood-badge">{activeGoals.length} active</span>
          </div>

          {activeGoals.length === 0 ? (
            <p>No active goals yet. Add one goal that deserves your attention.</p>
          ) : (
            activeGoals.slice(0, 3).map((goal) => (
              <div className="dashboard-list-item" key={goal.id}>
                <h3>{goal.title}</h3>
                <p>{goal.status || 'Not Started'} • {goal.progress || 0}% complete</p>
                <div className="dashboard-progress-track">
                  <div
                    className="dashboard-progress-fill"
                    style={{ width: `${goal.progress || 0}%` }}
                  />
                </div>
              </div>
            ))
          )}
        </article>
      </div>

      <div className="dashboard-feature-grid">
        <article className="dashboard-feature-card">
          <div className="entry-card-top">
            <h2>🏆 Recent Wins</h2>
            <span className="mood-badge">{wins.length} wins</span>
          </div>

          {recentWins.length === 0 ? (
            <p>No wins recorded yet. Small counts. Tiny counts. Evidence counts.</p>
          ) : (
            recentWins.map((win) => (
              <div className="dashboard-list-item" key={win.id}>
                <h3>{win.title}</h3>
                {win.description && <p>{win.description}</p>}
              </div>
            ))
          )}
        </article>

        <article className="dashboard-feature-card">
          <div className="entry-card-top">
            <h2>📖 Recent Journal Entries</h2>
            <span className="mood-badge">{journalEntries.length} entries</span>
          </div>

          {recentEntries.length === 0 ? (
            <p>No journal entries yet. Start with what is true today.</p>
          ) : (
            recentEntries.map((entry) => (
              <div className="dashboard-list-item" key={entry.id}>
                <h3>{entry.title}</h3>
                <p>{entry.mood || 'No mood'} • Energy {entry.energy || 0}/10</p>
              </div>
            ))
          )}
        </article>
      </div>

      <div className="dashboard-feature-grid">
        <article className="dashboard-feature-card">
          <div className="entry-card-top">
            <h2>🌸 Future Self</h2>
            <span className="mood-badge">
              {futureLetters.length} letters
            </span>
          </div>

          {nextFutureLetter ? (
            <div className="dashboard-list-item">
              <h3>{nextFutureLetter.title}</h3>
              <p>Open on {formatDate(nextFutureLetter.future_date)}</p>
            </div>
          ) : (
            <p>No unopened future self letters yet.</p>
          )}
        </article>

        <article className="dashboard-feature-card">
          <div className="entry-card-top">
            <h2>🖼 Vision Board Preview</h2>
            <span className="mood-badge">{visionItems.length} items</span>
          </div>

          {recentVisionItems.length === 0 ? (
            <p>No vision board items yet. Add one image that represents what you are building.</p>
          ) : (
            <div className="dashboard-vision-preview">
              {recentVisionItems.map((item) => (
                <img
                  key={item.id}
                  src={item.image_url}
                  alt={item.title}
                  title={item.title}
                />
              ))}
            </div>
          )}
        </article>
      </div>
    </section>
  )
}

export default Dashboard