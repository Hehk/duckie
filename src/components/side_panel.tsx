import { useAtom } from 'jotai'
import { isSidePanelOpenAtom, workspaceAtom, createChatId, WorkspaceId, createWorkspaceId, ChatId } from '../app'

export default function SidePanel() {
  const [isOpen, setIsOpen] = useAtom(isSidePanelOpenAtom)
  const [workspaceState, setWorkspaceState] = useAtom(workspaceAtom)
  const { workspaces, selectedWorkspace, selectedChat } = workspaceState

  const createChat = (workspaceId: WorkspaceId) => () => {
    const newChatId = createChatId()
    const newChat = {
      id: newChatId,
      name: 'new chat',
      messages: []
    }

    const newWorkspaces = {
      ...workspaces,
      [workspaceId]: {
        ...workspaces[workspaceId],
        chats: {
          ...workspaces[workspaceId].chats,
          [newChatId]: newChat
        }
      }
    }

    setWorkspaceState({
      ...workspaceState,
      workspaces: newWorkspaces,
      selectedChat: newChatId
    })
  }

  const createWorkspace = () => {
    const newWorkspaceId = createWorkspaceId()
    const newChatId = createChatId()
    const newWorkspace = {
      id: newWorkspaceId,
      name: 'new workspace',
      chats: {
        [newChatId]: {
          id: newChatId,
          name: 'general',
          messages: []
        }
      }
    }

    const newWorkspaces = {
      ...workspaces,
      [newWorkspaceId]: newWorkspace
    }

    setWorkspaceState({
      ...workspaceState,
      workspaces: newWorkspaces,
      selectedWorkspace: newWorkspaceId,
      selectedChat: newChatId
    })
  }

  const selectChat = (workspaceId: WorkspaceId, chatId: ChatId) => () => {
    setWorkspaceState({
      ...workspaceState,
      selectedWorkspace: workspaceId,
      selectedChat: chatId
    })
  }

  if (!isOpen) return null

  return <div className="bg-zinc-900 text-zinc-50 h-screen absolute w-60 p-2 z-10">
    <div className="flex justify-between">
      <h1>Duckie</h1>
      <button className="bg-red-500 text-white px-2 rounded-md" onClick={() => setIsOpen(false)}>Close</button>
    </div>

    <div className="mt-4">
      {Object.values(workspaces).map((workspace) => (
        <div className="mb-8" key={workspace.id}>
          <h2>{workspace.name}</h2>
          {Object.values(workspace.chats).map((chat) => (
            <div className="hover:bg-zinc-700 rounded-md py-1 px-2 my-1" key={chat.id} onClick={selectChat(workspace.id, chat.id)}>{chat.name}</div>
          ))}
          <button className="bg-purple-600 p-1 m-1 rounded-md w-full" onClick={createChat(workspace.id)}>Create Chat +</button>
        </div>
      ))}
      <button className="bg-purple-600 p-1 m-1 rounded-md block" onClick={createWorkspace}>Create Workspace +</button>
    </div>

  </div>
}