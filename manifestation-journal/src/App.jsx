import { Outlet } from 'react-router-dom'
import './App.css'
import Sidebar from './components/Sidebar'

function App() {
  return (
    <div className="app-layout">
      <Sidebar />

      <main>
        <Outlet />
      </main>
    </div>
  )
}

export default App