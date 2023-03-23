import { useAtom } from "jotai"
import { useEffect } from "react"
import { workspaceAtom, WorkspaceState } from "../app"
import { appWindow } from "@tauri-apps/api/window"

function getRoute({ workspaces, selectedWorkspace, selectedChat }: WorkspaceState) {
  let route: string[] = []

  if (!selectedWorkspace) return route
  const workspace = workspaces[selectedWorkspace]
  if (!workspace) return route
  route.push(workspace.name)

  if (!selectedChat) return route
  const chat = workspace.chats[selectedChat]
  if (!chat) return route
  route.push(chat.name)

  return route
}

export default function TitleBar() {
  const [workspaceState] = useAtom(workspaceAtom)
  const route = getRoute(workspaceState)
  const title = route.join(' / ')

  appWindow.setTitle(title)
  return null
}