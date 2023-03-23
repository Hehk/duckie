import { useAtom } from "jotai"
import { isSidePanelOpenAtom } from "../app"
import { workspaceAtom } from "../app"

export default function TitleBar() {
  const [_, setIsSidePanelOpen] = useAtom(isSidePanelOpenAtom)
  const [workspaceState] = useAtom(workspaceAtom)
  const workspaceName = workspaceState.workspaces[workspaceState.selectedWorkspace].name
  const chatName = workspaceState.workspaces[workspaceState.selectedWorkspace].chats[workspaceState.selectedChat].name

  return <div className="flex border-b border-b-blue-500 p-2">
    <button className="bg-red-500 text-white px-2 rounded-md absolute" onClick={() => setIsSidePanelOpen(true)}>Open</button>
    <h1 className="m-auto">{workspaceName} / {chatName}</h1>
  </div>
}