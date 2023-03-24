import { FiSettings, FiUser, FiPlus } from 'react-icons/fi'
import { useAtom } from 'jotai'
import { workspaceAtom, createChatId, createWorkspaceId, WorkspaceId } from '../app'

function ActivityPanelButton({ ...props }) {
  return <button {...props} className="m-2 mt-0 first:mt-2 w-16 h-16 rounded text-center text-dark-1 text-2xl" />
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

  return <div className="h-full w-20 flex flex-col justify-between">
    <div>

      {/* Titlebar buttons */}
      <div className="mt-8" />
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