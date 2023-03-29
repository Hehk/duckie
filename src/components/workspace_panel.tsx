import React from "react"
import { FiSettings, FiUser, FiPlus } from "react-icons/fi"
import StateContext from "../state"
import styled from "../utils/styled"

const Button = styled<{ focused?: boolean }>(
  "button",
  "m-2 mt-0 first:mt-2 w-16 h-16 rounded-lg text-center text-zinc-900 hover:bg-zinc-50 hover:bg-opacity-90 hover:shadow-md text-lg",
  ({ focused = false }, className) =>
    focused ? className + " bg-zinc-50 bg-opacity-90 shadow-md" : className,
)

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
            <Button
              focused={isFocused}
              key={workspace.id}
              onClick={() => focusWorkspace(workspace.id)}
            >
              {workspace.name.slice(0, 1)}
            </Button>
          )
        })}
        <Button onClick={handleCreateWorkspaceClick}>
          <FiPlus className="m-auto" />
        </Button>
      </div>

      <div>
        <Button>
          <FiUser className="m-auto" />
        </Button>
        <Button>
          <FiSettings className="m-auto" />
        </Button>
      </div>
    </div>
  )
}

export default WorkspacePanel
