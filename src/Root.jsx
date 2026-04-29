import { useState } from 'react'
import ProjectsHome from './ProjectsHome'
import App from './App'

export default function Root() {
  const [activeProjectId, setActiveProjectId] = useState(null)

  if (activeProjectId !== null) {
    return <App projectId={activeProjectId} onBack={() => setActiveProjectId(null)} />
  }

  return <ProjectsHome onOpenProject={setActiveProjectId} />
}
