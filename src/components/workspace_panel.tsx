import React from "react"
import { FiSettings, FiUser, FiPlus } from "react-icons/fi"
import StateContext from "../state"

function WorkspacePanelButton({ focused = false, ...props }) {
  let className =
    "m-2 mt-0 first:mt-2 w-16 h-16 rounded text-center bg-dark-2 text-zinc-100"
  if (focused) className = className + " border-2 border-zinc-100"

  return <button {...props} className={className} />
}

const WorkspacePanel: React.FC = () => {
  const [state, send] = StateContext.useActor()

  const handleCreateWorkspaceClick = () => {
    send({ type: "OPEN_MODAL", modal: "create_workspace" })
  }

  const focusWorkspace = (id: string) => {
    send({ type: "FOCUS_WORKSPACE", workspace: id })
  }

  return (
    <div className="h-full w-20 flex flex-col justify-between">
      <div className="mt-8">
        {state.context.workspaces.map((workspace) => {
          const isFocused = workspace.id === state.context.focusedWorkspace

          return (
            <WorkspacePanelButton
              focused={isFocused}
              key={workspace.id}
              onClick={() => focusWorkspace(workspace.id)}
            >
              {workspace.name.slice(0, 1)}
            </WorkspacePanelButton>
          )
        })}
        <WorkspacePanelButton onClick={handleCreateWorkspaceClick}>
          <FiPlus className="m-auto" />
        </WorkspacePanelButton>
      </div>

      <WorkspacePanelButton>
        <FiUser className="m-auto" />
      </WorkspacePanelButton>
      <WorkspacePanelButton>
        <FiSettings className="m-auto" />
      </WorkspacePanelButton>
    </div>
  )
}

export default WorkspacePanel
