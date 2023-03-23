import { FiSettings, FiUser, FiPlus } from 'react-icons/fi'
import { useAtom } from 'jotai'
import { workspaceAtom, createChatId, createWorkspaceId, WorkspaceId } from '../app'

function ActivityPanelButton({ ...props }) {
  return <button {...props} className="m-2 mt-0 first:mt-2 w-12 h-12 bg-zinc-700 hover:bg-purple-600 rounded text-center text-zinc-50 text-xl" />
}

export default function ActivityPanel() {
  const [workspaceState, setWorkspaceState] = useAtom(workspaceAtom)
  const workspaces = workspaceState.workspaces
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

    setWorkspaceState({
      ...workspaceState,
      workspaces: {
        ...workspaces,
        [newWorkspaceId]: newWorkspace
      },
      selectedWorkspace: newWorkspaceId,
      selectedChat: newChatId
    })
  }
  const focusWorkspace = (workspaceId: WorkspaceId) => () => {
    setWorkspaceState({
      ...workspaceState,
      selectedWorkspace: workspaceId,
      selectedChat: undefined
    })
  }

  return <div className="h-screen w-16 bg-zinc-900 flex flex-col justify-between">
    <div>
      {Object.values(workspaces).map((workspace, i) => (
        <ActivityPanelButton onClick={focusWorkspace(workspace.id)} key={workspace.id}>{i + 1}</ActivityPanelButton>
      ))}
      <ActivityPanelButton onClick={createWorkspace}><FiPlus className="m-auto" /></ActivityPanelButton>
    </div>
    <div>
      <ActivityPanelButton><FiUser className="m-auto" /></ActivityPanelButton>
      <ActivityPanelButton><FiSettings className='m-auto' /></ActivityPanelButton>
    </div>
  </div>
}