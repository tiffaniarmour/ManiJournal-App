import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import './index.css'
import './App.css'

import App from './App'
import Dashboard from './pages/Dashboard'
import Journal from './pages/Journal'
import Goals from './pages/Goals'
import Affirmations from './pages/Affirmations'
import Manifestations from './pages/Manifestations'
import Wins from './pages/Wins'
import FutureSelf from './pages/FutureSelf'
import VisionBoard from './pages/VisionBoard'
import LearningPath from './pages/LearningPath'
import Login from './pages/Login'
import TestSupabase from './pages/TestSupabase'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<App />}>
          <Route index element={<Dashboard />} />
          <Route path="journal" element={<Journal />} />
          <Route path="goals" element={<Goals />} />
          <Route path="affirmations" element={<Affirmations />} />
          <Route path="manifestations" element={<Manifestations />} />
          <Route path="wins" element={<Wins />} />
          <Route path="future-self" element={<FutureSelf />} />
          <Route path="vision-board" element={<VisionBoard />} />
          <Route path="learning-path" element={<LearningPath />} />
          <Route path="login" element={<Login />} />
          <Route path="test" element={<TestSupabase />} />
        </Route>
      </Routes>
    </BrowserRouter>
  </React.StrictMode>
)