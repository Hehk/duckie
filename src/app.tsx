import { useState } from 'react'
import SidePanel from './components/side_panel'
import TitleBar from './components/title_bar'
import ChatPanel from './components/chat_panel'
import { atom } from 'jotai'

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
type ChatId = string & { _brand: 'chat' }
const createChatId = () => generateUniqueId() as ChatId
type WorkspaceId = string & { _brand: 'workspace' }
const createWorkspaceId = () => generateUniqueId() as WorkspaceId

export type Chat = {
  id: ChatId;
  name: string;
  messages: Message[];
}

export type Workspace = {
  id: WorkspaceId;
  name: string;
  chats: Record<ChatId, Chat>;
}

export type WorkspaceState = {
  workspaces: Record<WorkspaceId, Workspace>;
  selectedWorkspace: WorkspaceId;
  selectedChat: ChatId;
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
export const workspaceAtom = atom<WorkspaceState>(initialWorkspaceState)

export const isSidePanelOpenAtom = atom(false)

export default function App() {
  return (
    <div className="h-screen flex flex-col">
      <SidePanel />
      <TitleBar />
      <ChatPanel />
    </div >
  )
}