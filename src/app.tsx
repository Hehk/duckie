import WorkspacePanel from "./components/workspace_panel"
import Modal from "./components/modal"
import { createPortal } from "react-dom"
import StateContext from "./state"
import useGlobalShortcuts from "./utils/use_global_shortcuts"
import Workspace from "./components/workspace"

function Skeleton() {
  useGlobalShortcuts()

  return (
    <>
      {createPortal(<Modal />, document.body)}
      <div className="flex flex-row h-screen">
        <WorkspacePanel />
        <Workspace />
      </div>
    </>
  )
}

export default function App() {
  return (
    <StateContext.Provider>
      <Skeleton />
    </StateContext.Provider>
  )
}
