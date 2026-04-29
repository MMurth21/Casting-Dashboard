import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { HashRouter, Routes, Route, Navigate } from 'react-router-dom'
import './index.css'
import ProjectsList from './pages/ProjectsList'
import ProjectDetail from './pages/ProjectDetail'
import App from './App'
import { seedEchoes } from './seed'

seedEchoes().catch(console.error)

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <HashRouter>
      <Routes>
        <Route path="/"             element={<Navigate to="/projects" replace />} />
        <Route path="/projects"     element={<ProjectsList />} />
        <Route path="/projects/:id" element={<ProjectDetail />} />
        <Route path="/echoes"       element={<App />} />
        <Route path="*"             element={<Navigate to="/projects" replace />} />
      </Routes>
    </HashRouter>
  </StrictMode>,
)
