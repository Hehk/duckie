import { useState } from 'react'
import SidePanel from './components/side_panel'
import TitleBar from './components/title_bar'
import ChatPanel from './components/chat_panel'
import { atom, useAtom } from 'jotai'
import { atomWithStorage } from 'jotai/utils'
import ActivityPanel from './components/activity_panel'

// Simple app state
export type Message = {
  id: number;
  text: string;
}

function generateUniqueId() {
  const timestamp = Date.now().toString(36); // Convert current time to base 36 string
  const randomString = Math.random().toString(36).substring(2, 8); // Generate random string
  return `${timestamp}-${randomString}`; // Combine timestamp and random string
}

// type brand for chat id and workspace id
export type ChatId = string & { _brand: 'chat' }
export const createChatId = () => generateUniqueId() as ChatId
export type WorkspaceId = string & { _brand: 'workspace' }
export const createWorkspaceId = () => generateUniqueId() as WorkspaceId

export type Chat = {
  id: ChatId;
  name: string;
  messages: Message[];
}

export type Workspace = {
  id: WorkspaceId;
  name: string;
  chats: Record<ChatId, Chat | undefined>;
}

export type WorkspaceState = {
  workspaces: Record<WorkspaceId, Workspace | undefined>;
  selectedWorkspace?: WorkspaceId;
  selectedChat?: ChatId;
}

const initialWorkspaceId = createWorkspaceId()
const initialChatId = createChatId()
const initialWorkspaceState: WorkspaceState = {
  workspaces: {
    [initialWorkspaceId]: {
      id: initialWorkspaceId,
      name: 'testing',
      chats: {
        [initialChatId]: {
          id: initialChatId,
          name: 'general',
          messages: [
            { id: 1, text: 'hello world' },
            { id: 2, text: 'hello world' },
            { id: 3, text: 'hello world' },
            { id: 4, text: 'hello world' },
          ]
        }
      }
    }
  },
  selectedWorkspace: initialWorkspaceId,
  selectedChat: initialChatId,
}

// app state
export const workspaceAtom = atomWithStorage<WorkspaceState>('workspaceState', initialWorkspaceState)

export const isSidePanelOpenAtom = atom(false)

export default function App() {
  const [isSidePanelOpen] = useAtom(isSidePanelOpenAtom)

  return (
    <div className="flex flex-row h-screen">
      <ActivityPanel />
      {isSidePanelOpen && <SidePanel />}
      <div className="m-2 ml-0 shadow-lg bg-dark-1 rounded-lg flex-grow">
        <ChatPanel />
      </div>
    </div>
  )
}