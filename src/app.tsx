import WorkspacePanel from "./components/workspace_panel"
import Modal from "./components/modal"
import { createPortal } from "react-dom"
import StateContext from "./state"

export default function App() {
  return (
    <StateContext.Provider>
      {createPortal(<Modal />, document.body)}
      <div className="flex flex-row h-screen">
        <WorkspacePanel />
        <div className="m-2 ml-0 shadow-lg bg-dark-1 rounded-lg flex-grow"></div>
      </div>
    </StateContext.Provider>
  )
}
