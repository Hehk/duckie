import { createMachine, assign } from "xstate"
import { useMachine } from "@xstate/react"
import StateContext from "../state"
import SidePanelContainer from "./side_panel_container"
import styled from "../utils/styled"
import { FiPlus, FiSettings } from "react-icons/fi"
import ToolPanelEslint from "./tool_panel_eslint"

type ChatTab = `chat_${string}`
type ActiveTab = "eslint" | "types" | "diffs" | "changes" | ChatTab | "settings"

interface WorkspaceContext {
  activeTab: ActiveTab
  chatTabs: Set<ChatTab>
}

type WorkspaceEvent =
  | { type: "CHANGE_TAB"; tab: ActiveTab }
  | { type: "CREATE_CHAT"; chatId: ChatTab }

const workspaceMachine = createMachine<WorkspaceContext, WorkspaceEvent>(
  {
    id: "workspace",
    initial: "idle",
    context: {
      activeTab: "eslint",
      chatTabs: new Set<ChatTab>(),
    },
    states: {
      idle: {
        on: {
          CHANGE_TAB: {
            actions: "setActiveTab",
          },
          CREATE_CHAT: {
            actions: ["createChatTab", "setActiveTab"],
          },
        },
      },
    },
    on: {
      CHANGE_TAB: {
        actions: "setActiveTab",
      },
      CREATE_CHAT: {
        actions: ["createChatTab", "setActiveTab"],
      },
    },
  },
  {
    actions: {
      setActiveTab: assign((context, event) => {
        switch (event.type) {
          case "CHANGE_TAB":
            return { activeTab: event.tab }
          case "CREATE_CHAT":
            return { activeTab: event.chatId }
        }
      }),
      createChatTab: assign((context, event) => {
        if (event.type !== "CREATE_CHAT") return {}
        const newChatTabs = new Set(context.chatTabs)
        newChatTabs.add(event.chatId)
        return { chatTabs: newChatTabs }
      }),
    },
  },
)

const SidePanelButton = styled<{ focused: boolean }>(
  "button",
  "SidePanelButton rounded-lg text-zinc-900 hover:bg-zinc-50 hover:bg-opacity-90 hover:shadow-layered text-lg text-left p-2 capitalize mr-2 mb-2",
  ({ focused }, className) => {
    if (focused) {
      return `${className} bg-zinc-50 bg-opacity-90 shadow-layered`
    }
    return className
  },
)
const SidePanelTitle = styled("h1", "SidePanelTitle text-2xl font-bold")

interface SidePanelProps {
  setActiveTab: (tab: ActiveTab) => void
  chatTabs: Set<ActiveTab>
  createChat: (chatId: ChatTab) => void
  title: string
  activeTab: ActiveTab
}
const SidePanel: React.FC<SidePanelProps> = ({
  title,
  setActiveTab,
  chatTabs,
  createChat,
  activeTab,
}) => {
  const createNewChat = () => {
    createChat(`chat_${Date.now()}`)
  }

  const TabButton: React.FC<{ tab: ActiveTab }> = ({ tab }) => {
    const focused = tab === activeTab
    return (
      <SidePanelButton
        focused={focused}
        key={tab}
        onClick={() => {
          setActiveTab(tab)
        }}
      >
        {tab}
      </SidePanelButton>
    )
  }

  return (
    <SidePanelContainer>
      <SidePanelTitle>
        {title}
        <button className="" onClick={() => setActiveTab("settings")}>
          <FiSettings />
        </button>
      </SidePanelTitle>
      <div className="top-section flex flex-col">
        <TabButton tab="eslint" />
        <TabButton tab="types" />
        <TabButton tab="diffs" />
        <TabButton tab="changes" />
      </div>
      <div className="separator bg-zinc-100 bg-opacity-50 h-[1px] mx-2 mb-2" />
      <div className="chats-section flex flex-col">
        {Array.from(chatTabs).map((chatTab) => (
          <TabButton key={chatTab} tab={chatTab as ActiveTab} />
        ))}
        <SidePanelButton focused={false} onClick={createNewChat}>
          New Chat <FiPlus className="inline-block mb-[3px]" />
        </SidePanelButton>
      </div>
      <div className="flex-grow" />
    </SidePanelContainer>
  )
}

function Tab({ tab, path }: { tab: ActiveTab; path: string }) {
  if (tab === "eslint") {
    return <ToolPanelEslint path={path} />
  }
  return <h1>{tab}</h1>
}

const Workspace: React.FC = () => {
  const [globalState] = StateContext.useActor()
  const [workspaceState, sendWorkspace] = useMachine(workspaceMachine)
  const { focusedWorkspace, workspaces } = globalState.context
  const workspace = workspaces.find(
    (workspace) => workspace.id === focusedWorkspace,
  )
  // TODO add a no workspace selected screen
  if (!workspace) return null

  const { path, name } = workspace

  const setActiveTab = (tab: ActiveTab) => {
    sendWorkspace({ type: "CHANGE_TAB", tab })
  }

  const createChat = (chatId: ChatTab) => {
    sendWorkspace({ type: "CREATE_CHAT", chatId })
  }

  return (
    <div className="workspace h-full flex-grow p-2 pl-0 flex flex-row">
      {globalState.context.isSidePanelOpen && (
        <SidePanel
          title={name}
          setActiveTab={setActiveTab}
          activeTab={workspaceState.context.activeTab}
          chatTabs={workspaceState.context.chatTabs}
          createChat={createChat}
        />
      )}
      <div className="main-panel bg-dark-1 flex flex-grow rounded-lg shadow-layered">
        <Tab tab={workspaceState.context.activeTab} path={path} />
      </div>
    </div>
  )
}

export default Workspace
