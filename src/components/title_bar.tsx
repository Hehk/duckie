import { useAtom } from "jotai"
import { workspaceAtom } from "../app"

export default function TitleBar() {
  const [workspaceState] = useAtom(workspaceAtom)
  const { selectedWorkspace, selectedChat } = workspaceState

  let name = "Welcome!"
  if (selectedWorkspace && selectedChat) {
    console.log(workspaceState.workspaces[selectedWorkspace], selectedChat)
    const workspace = workspaceState.workspaces[selectedWorkspace]
    const chat = workspace?.chats[selectedChat]
    if (workspace && chat) {
      name = `${workspace.name} / ${chat.name}`
    }
  } else if (selectedWorkspace) {
    const workspace = workspaceState.workspaces[selectedWorkspace]
    if (workspace) {
      name = workspace.name
    }
  }

  return <div className="flex p-2 bg-zinc-900 text-zinc-50">
    <h1 className="m-auto">{name}</h1>
  </div>
}