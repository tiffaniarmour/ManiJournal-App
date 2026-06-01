import { useEffect, useState } from 'react'
import Header from '../components/Header'
import DashboardCard from '../components/DashboardCard'
import { supabase } from '../services/supabase'

function Dashboard() {
  const [entries, setEntries] = useState([])

  useEffect(() => {
    loadEntries()
  }, [])

  async function loadEntries() {
    const { data, error } = await supabase
      .from('journal_entries')
      .select('*')

    if (error) {
      console.log('Dashboard load error:', error)
      return
    }

    setEntries(data)
  }

  const totalEntries = entries.length

  const averageEnergy =
    entries.length === 0
      ? 0
      : (
          entries.reduce((sum, entry) => sum + Number(entry.energy), 0) /
          entries.length
        ).toFixed(1)

  const moodCounts = entries.reduce((counts, entry) => {
    counts[entry.mood] = (counts[entry.mood] || 0) + 1
    return counts
  }, {})

  const mostCommonMood =
    Object.keys(moodCounts).length === 0
      ? 'None yet'
      : Object.entries(moodCounts).sort((a, b) => b[1] - a[1])[0][0]

  return (
    <>
      <Header />

      <div className="dashboard-grid">
        <DashboardCard title="Journal Entries" value={totalEntries} />
        <DashboardCard title="Average Energy" value={`${averageEnergy}/10`} />
        <DashboardCard title="Most Common Mood" value={mostCommonMood} />
        <DashboardCard title="Goals" value="Coming Soon" />
        <DashboardCard title="Manifestations" value="Coming Soon" />
        <DashboardCard title="Affirmations" value="Coming Soon" />
      </div>
    </>
  )
}

export default Dashboard