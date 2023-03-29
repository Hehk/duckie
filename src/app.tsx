import WorkspacePanel from "./components/workspace_panel"
import Modal from "./components/modal"
import { createPortal } from "react-dom"
import StateContext from "./state"
import useGlobalShortcuts from "./utils/use_global_shortcuts"
import SidePanel from "./components/side_panel"

function Skeleton() {
  useGlobalShortcuts()

  return (
    <>
      {createPortal(<Modal />, document.body)}
      <div className="flex flex-row h-screen">
        <WorkspacePanel />
        <SidePanel />
        <div className="m-2 ml-0 shadow-lg bg-dark-1 rounded-lg flex-grow"></div>
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
