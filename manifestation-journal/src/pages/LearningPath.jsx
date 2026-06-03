import { useEffect, useState } from 'react'
import { supabase } from '../services/supabase'

function LearningPath() {
  const [user, setUser] = useState(null)
  const [journalEntries, setJournalEntries] = useState([])
  const [goals, setGoals] = useState([])
  const [manifestations, setManifestations] = useState([])
  const [wins, setWins] = useState([])
  const [futureLetters, setFutureLetters] = useState([])
  const [visionItems, setVisionItems] = useState([])
  const [affirmations, setAffirmations] = useState([])

  useEffect(() => {
    loadLearningPath()
  }, [])

  async function loadLearningPath() {
    const { data } = await supabase.auth.getUser()

    if (!data.user) return

    setUser(data.user)

    const userId = data.user.id

    const { data: entries } = await supabase
      .from('journal_entries')
      .select('*')
      .eq('user_id', userId)

    const { data: goalData } = await supabase
      .from('manifestation_goals')
      .select('*')
      .eq('user_id', userId)

    const { data: manifestationData } = await supabase
      .from('manifestations')
      .select('*')
      .eq('user_id', userId)

    const { data: winData } = await supabase
      .from('wins')
      .select('*')
      .eq('user_id', userId)

    const { data: letterData } = await supabase
      .from('future_self_letters')
      .select('*')
      .eq('user_id', userId)

    const { data: visionData } = await supabase
      .from('vision_board_items')
      .select('*')
      .eq('user_id', userId)

    const { data: affirmationData } = await supabase
      .from('affirmations')
      .select('*')
      .eq('user_id', userId)

    setJournalEntries(entries || [])
    setGoals(goalData || [])
    setManifestations(manifestationData || [])
    setWins(winData || [])
    setFutureLetters(letterData || [])
    setVisionItems(visionData || [])
    setAffirmations(affirmationData || [])
  }

  const completedGoals = goals.filter((goal) => goal.status === 'Completed')
  const manifestedItems = manifestations.filter((item) => item.manifested)
  const favoriteAffirmations = affirmations.filter((item) => item.favorite)

  const learningSections = [
    {
      title: 'Foundation',
      description: 'Build the basic rhythm of using the app.',
      tasks: [
        {
          label: 'Create your first journal entry',
          complete: journalEntries.length >= 1,
        },
        {
          label: 'Create your first manifestation goal',
          complete: goals.length >= 1,
        },
        {
          label: 'Record your first win',
          complete: wins.length >= 1,
        },
      ],
    },
    {
      title: 'Growth',
      description: 'Start connecting your thoughts, evidence, and future self.',
      tasks: [
        {
          label: 'Save at least 5 journal entries',
          complete: journalEntries.length >= 5,
        },
        {
          label: 'Add at least 3 affirmations',
          complete: affirmations.length >= 3,
        },
        {
          label: 'Create a future self letter',
          complete: futureLetters.length >= 1,
        },
      ],
    },
    {
      title: 'Manifestation Practice',
      description: 'Track movement, evidence, and visual anchors.',
      tasks: [
        {
          label: 'Track at least 3 manifestations',
          complete: manifestations.length >= 3,
        },
        {
          label: 'Mark one manifestation as completed',
          complete: manifestedItems.length >= 1,
        },
        {
          label: 'Add at least 5 vision board items',
          complete: visionItems.length >= 5,
        },
      ],
    },
    {
      title: 'Momentum',
      description: 'Build a visible record of progress.',
      tasks: [
        {
          label: 'Complete one manifestation goal',
          complete: completedGoals.length >= 1,
        },
        {
          label: 'Record at least 10 wins',
          complete: wins.length >= 10,
        },
        {
          label: 'Favorite at least 3 affirmations',
          complete: favoriteAffirmations.length >= 3,
        },
      ],
    },
  ]

  function getSectionProgress(tasks) {
    const completedTasks = tasks.filter((task) => task.complete).length
    return Math.round((completedTasks / tasks.length) * 100)
  }

  const totalTasks = learningSections.reduce(
    (sum, section) => sum + section.tasks.length,
    0
  )

  const completedTasks = learningSections.reduce(
    (sum, section) =>
      sum + section.tasks.filter((task) => task.complete).length,
    0
  )

  const totalProgress = Math.round((completedTasks / totalTasks) * 100)

  if (!user) {
    return (
      <section>
        <p className="page-kicker">Learning Path</p>
        <h1>Sign in to see your growth path.</h1>
        <p className="page-intro">
          Your learning path uses your actual app activity to show what you have already built and what to focus on next.
        </p>
      </section>
    )
  }

  return (
    <section>
      <p className="page-kicker">Learning Path</p>
      <h1>Your guided ManiJournal roadmap 🌱</h1>
      <p className="page-intro">
        This page turns your app activity into a simple progress path. It helps you see what you have already practiced and what feature area deserves attention next.
      </p>

      <div className="dashboard-grid">
        <div className="dashboard-card">
          <h3>Overall Progress</h3>
          <p>{totalProgress}%</p>
        </div>

        <div className="dashboard-card">
          <h3>Tasks Completed</h3>
          <p>{completedTasks}/{totalTasks}</p>
        </div>

        <div className="dashboard-card">
          <h3>Journal Entries</h3>
          <p>{journalEntries.length}</p>
        </div>
      </div>

      <div className="entry-grid">
        {learningSections.map((section) => {
          const sectionProgress = getSectionProgress(section.tasks)

          return (
            <article className="journal-entry-card" key={section.title}>
              <div className="entry-card-top">
                <h2>{section.title}</h2>
                <span className="mood-badge">{sectionProgress}% complete</span>
              </div>

              <p>{section.description}</p>

              <div className="dashboard-progress-track">
                <div
                  className="dashboard-progress-fill"
                  style={{ width: `${sectionProgress}%` }}
                />
              </div>

              <div className="entry-grid">
                {section.tasks.map((task) => (
                  <div className="dashboard-list-item" key={task.label}>
                    <h3>
                      {task.complete ? '✅' : '⬜'} {task.label}
                    </h3>
                  </div>
                ))}
              </div>
            </article>
          )
        })}
      </div>
    </section>
  )
}

export default LearningPath