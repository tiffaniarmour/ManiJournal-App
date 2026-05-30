function DashboardCard({ title, value }) {
  return (
    <article className="dashboard-card">
      <h3>{title}</h3>
      <p>{value}</p>
    </article>
  )
}

export default DashboardCard