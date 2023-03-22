import { useState } from 'react'
import SidePanel from './components/side_panel'
import TitleBar from './components/title_bar'

export default function App() {
  const [isSidePanelOpen, setIsSidePanelOpen] = useState(false)

  return (
    <div className="h-screen">
      <SidePanel isOpen={isSidePanelOpen} toggleSidePanel={() => setIsSidePanelOpen(!isSidePanelOpen)} />
      <TitleBar openSidePanel={() => setIsSidePanelOpen(true)} />
      <h1>Hello World</h1>
    </div>
  )
}