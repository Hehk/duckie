import { useAtom } from 'jotai'
import { workspaceAtom, createChatId, WorkspaceId, ChatId } from '../app'

export default function SidePanel() {
  const [workspaceState, setWorkspaceState] = useAtom(workspaceAtom)
  const { workspaces } = workspaceState
  const activeWorkspace = workspaces[workspaceState.selectedWorkspace]

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

  const selectChat = (workspaceId: WorkspaceId, chatId: ChatId) => () => {
    setWorkspaceState({
      ...workspaceState,
      selectedWorkspace: workspaceId,
      selectedChat: chatId
    })
  }

  return <div className="bg-zinc-900 text-zinc-50 h-screen  w-60 p-2 z-10">
    <div>
      <h2 className="font-bold uppercase">{activeWorkspace.name}</h2>
      {Object.values(activeWorkspace.chats).map((chat) => (
        <div className="hover:bg-zinc-700 rounded-md py-1 px-2 my-1" key={chat.id} onClick={selectChat(activeWorkspace.id, chat.id)}>{chat.name}</div>
      ))}
      <button className="bg-purple-600 p-1 m-1 rounded-md w-8 h-8" onClick={createChat(activeWorkspace.id)}>+</button>
    </div>

  </div>
}