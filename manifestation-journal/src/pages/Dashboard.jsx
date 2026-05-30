import Header from '../components/Header'
import Sidebar from '../components/Sidebar'
import DashboardCard from '../components/DashboardCard'

function Dashboard() {
  return (
    <div className="app-layout">
      <Sidebar />

      <main>
        <Header />

        <div className="dashboard-grid">
          <DashboardCard
            title="Today's Focus"
            value="Abundance & Alignment"
          />

          <DashboardCard
            title="Journal"
            value="127 Entries"
          />

          <DashboardCard
            title="Goals"
            value="5 Active"
          />

          <DashboardCard
            title="Manifestations"
            value="8 In Progress"
          />

          <DashboardCard
            title="Wins"
            value="23 This Month"
          />

          <DashboardCard
            title="Affirmations"
            value="84 Saved"
          />
        </div>
      </main>
    </div>
  )
}

export default Dashboard