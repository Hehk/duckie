import { createMachine, assign } from "xstate"
import { createActorContext } from "@xstate/react"

export type Workspace = {
  id: string
  name: string
  path: string
}

export type Modal = "none" | "create_workspace"

interface ModelContext {
  id: string
  machine: typeof modelMachine
}

type ModelEvent =
  | { type: "LOAD" }
  | { type: "SET_UP" }
  | { type: "READY" }
  | { type: "ERROR" }
  | { type: "RETRY" }

export const modelMachine = createMachine<ModelContext, ModelEvent>({
  id: "model",
  initial: "unloaded",
  states: {
    unloaded: {
      on: {
        LOAD: "loading",
      },
    },
    loading: {
      on: {
        SET_UP: "setup",
        ERROR: "error",
      },
    },
    setup: {
      on: {
        READY: "ready",
        ERROR: "error",
      },
    },
    ready: {
      on: {
        ERROR: "error",
      },
    },
    error: {
      on: {
        RETRY: "unloaded",
      },
    },
  },
})

interface AppState {
  workspaces: Workspace[]
  focusedWorkspace: string | null
  modal: Modal
  models: ModelContext[]
  isSidePanelOpen: boolean
}

type AppEvent =
  | { type: "FOCUS_WORKSPACE"; workspace: string }
  | { type: "ADD_WORKSPACE"; workspace: Workspace }
  | { type: "CLEAR_FOCUS" }
  | { type: "OPEN_MODAL"; modal: Modal }
  | { type: "CLOSE_MODAL" }
  | { type: "ADD_MODEL"; modelId: string }
  | { type: "DELETE_MODEL"; modelId: string }
  | { type: "TOGGLE_SIDE_PANEL" }

const defaultContext: AppState = {
  workspaces: [],
  focusedWorkspace: null,
  modal: "none",
  models: [],
  isSidePanelOpen: false,
}

const loadStateFromLocalStorage = (): AppState => {
  const storedState = localStorage.getItem("appState")
  return storedState ? JSON.parse(storedState) : defaultContext
}

const saveStateToLocalStorage = (state: AppState) => {
  localStorage.setItem("appState", JSON.stringify(state))
}

const initialContext: AppState = loadStateFromLocalStorage()

export const appMachine = createMachine<AppState, AppEvent>(
  {
    id: "app",
    type: "parallel",
    context: initialContext,
    states: {
      workspace: {
        initial: "idle",
        states: {
          idle: {
            on: {
              FOCUS_WORKSPACE: {
                target: "focused",
                actions: "setFocusedWorkspace",
              },
              ADD_WORKSPACE: {
                target: "focused",
                actions: "addWorkspace",
              },
            },
          },
          focused: {
            on: {
              FOCUS_WORKSPACE: {
                target: "focused",
                actions: "setFocusedWorkspace",
              },
              ADD_WORKSPACE: {
                target: "focused",
                actions: "addWorkspace",
              },
              CLEAR_FOCUS: {
                target: "idle",
                actions: "clearFocusedWorkspace",
              },
            },
          },
        },
      },
      modal: {
        initial: "closed",
        states: {
          closed: {
            on: {
              OPEN_MODAL: {
                target: "opened",
                actions: "setModal",
              },
            },
          },
          opened: {
            on: {
              CLOSE_MODAL: {
                target: "closed",
                actions: "clearModal",
              },
            },
          },
        },
      },
      models: {
        initial: "idle",
        states: {
          idle: {
            on: {
              ADD_MODEL: {
                actions: "addModel",
              },
              DELETE_MODEL: {
                actions: "deleteModel",
              },
            },
          },
        },
      },
      sidePanel: {
        initial: "closed",
        states: {
          closed: {
            on: {
              TOGGLE_SIDE_PANEL: {
                target: "opened",
                actions: "openSidePanel",
              },
            },
          },
          opened: {
            on: {
              TOGGLE_SIDE_PANEL: {
                target: "closed",
                actions: "closeSidePanel",
              },
            },
          },
        },
      },
    },
  },
  {
    actions: {
      setFocusedWorkspace: assign((context, event) => {
        if (event.type !== "FOCUS_WORKSPACE") return {}
        return { focusedWorkspace: event.workspace }
      }),
      clearFocusedWorkspace: assign({ focusedWorkspace: null }),
      addWorkspace: assign((context, event) => {
        if (event.type !== "ADD_WORKSPACE") return {}
        const newWorkspace = event.workspace
        return {
          workspaces: [...context.workspaces, newWorkspace],
          focusedWorkspace: newWorkspace.id,
        }
      }),
      setModal: assign((context, event) => {
        console.log(context, event)
        if (event.type !== "OPEN_MODAL") return {}
        return { modal: event.modal }
      }),
      clearModal: assign({ modal: "none" }),
      addModel: assign((context, event) => {
        if (event.type !== "ADD_MODEL") return {}
        const newModel = {
          id: event.modelId,
          machine: modelMachine,
        }
        return { models: [...context.models, newModel] }
      }),
      deleteModel: assign((context, event) => {
        if (event.type !== "DELETE_MODEL") return {}

        return {
          models: context.models.filter((model) => model.id !== event.modelId),
        }
      }),
      openSidePanel: assign({ isSidePanelOpen: true }),
      closeSidePanel: assign({ isSidePanelOpen: false }),
    },
  },
)

const StateContext = createActorContext(appMachine, {}, (state) => {
  if (!state.changed) return // Ignore transitions that didn't change the state.
  saveStateToLocalStorage(state.context)
})

export default StateContext
