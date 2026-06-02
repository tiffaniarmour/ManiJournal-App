import { useEffect, useState } from 'react'
import { supabase } from '../services/supabase'
import DashboardCard from '../components/DashboardCard'

function Dashboard() {
  const [journalEntries, setJournalEntries] = useState([])
  const [goals, setGoals] = useState([])
  const [user, setUser] = useState(null)

  useEffect(() => {
    async function loadDashboard() {
      const { data } = await supabase.auth.getUser()

      if (!data.user) return

      setUser(data.user)

      const { data: entries } = await supabase
        .from('journal_entries')
        .select('*')
        .eq('user_id', data.user.id)
        .order('created_at', { ascending: false })

      const { data: manifestationGoals } = await supabase
        .from('manifestation_goals')
        .select('*')
        .eq('user_id', data.user.id)

      setJournalEntries(entries || [])
      setGoals(manifestationGoals || [])
    }

    loadDashboard()
  }, [])

  const totalEntries = journalEntries.length

  const averageEnergy =
    totalEntries === 0
      ? 0
      : (
          journalEntries.reduce(
            (sum, entry) => sum + Number(entry.energy),
            0
          ) / totalEntries
        ).toFixed(1)

  const moodCounts = {}

  journalEntries.forEach((entry) => {
    if (!entry.mood) return

    moodCounts[entry.mood] =
      (moodCounts[entry.mood] || 0) + 1
  })

  const mostCommonMood =
    Object.keys(moodCounts).length === 0
      ? 'None'
      : Object.entries(moodCounts).sort(
          (a, b) => b[1] - a[1]
        )[0][0]

  const recentEntry =
    journalEntries.length > 0
      ? journalEntries[0].title
      : 'No entries yet'

  const completedGoals = goals.filter(
    (goal) => goal.status === 'Completed'
  ).length

  return (
    <section>
      <h1>Dashboard</h1>

      <div className="dashboard-grid">
        <DashboardCard
          title="Journal Entries"
          value={totalEntries}
        />

        <DashboardCard
          title="Average Energy"
          value={`${averageEnergy}/10`}
        />

        <DashboardCard
          title="Most Common Mood"
          value={mostCommonMood}
        />

        <DashboardCard
          title="Recent Entry"
          value={recentEntry}
        />

        <DashboardCard
          title="Manifestation Goals"
          value={goals.length}
        />

        <DashboardCard
          title="Completed Goals"
          value={completedGoals}
        />
      </div>
    </section>
  )
}

export default Dashboard