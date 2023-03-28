import { createMachine, assign } from 'xstate';

interface ModelContext {
  id: string;
  machine: typeof modelMachine;
}

type ModelEvent =
  | { type: 'LOAD' }
  | { type: 'SET_UP' }
  | { type: 'READY' }
  | { type: 'ERROR' }
  | { type: 'RETRY' };

export const modelMachine = createMachine<ModelContext, ModelEvent>({
  id: 'model',
  initial: 'unloaded',
  states: {
    unloaded: {
      on: {
        LOAD: 'loading',
      },
    },
    loading: {
      on: {
        SET_UP: 'setup',
        ERROR: 'error',
      },
    },
    setup: {
      on: {
        READY: 'ready',
        ERROR: 'error',
      },
    },
    ready: {
      on: {
        ERROR: 'error',
      },
    },
    error: {
      on: {
        RETRY: 'unloaded',
      },
    },
  },
});

interface AppState {
  workspaces: any[];
  focusedWorkspace: any | null;
  modal: string;
  models: ModelContext[];
}

type AppEvent =
  | { type: 'FOCUS_WORKSPACE'; workspace: any }
  | { type: 'CLEAR_FOCUS' }
  | { type: 'OPEN_MODAL'; modal: string }
  | { type: 'CLOSE_MODAL' }
  | { type: 'ADD_MODEL'; modelId: string }
  | { type: 'DELETE_MODEL'; modelId: string };

export const appMachine = createMachine<AppState, AppEvent>({
  id: 'app',
  type: 'parallel',
  context: {
    workspaces: [],
    focusedWorkspace: null,
    modal: 'none',
    models: [],
  },
  states: {
    workspace: {
      initial: 'idle',
      states: {
        idle: {
          on: {
            FOCUS_WORKSPACE: {
              target: 'focused',
              actions: 'setFocusedWorkspace',
            },
          },
        },
        focused: {
          on: {
            FOCUS_WORKSPACE: {
              target: 'focused',
              actions: 'setFocusedWorkspace',
            },
            CLEAR_FOCUS: {
              target: 'idle',
              actions: 'clearFocusedWorkspace',
            },
          },
        },
      },
    },
    modal: {
      initial: 'closed',
      states: {
        closed: {
          on: {
            OPEN_MODAL: {
              target: 'opened',
              actions: 'setModal',
            },
          },
        },
        opened: {
          on: {
            CLOSE_MODAL: {
              target: 'closed',
              actions: 'clearModal',
            },
          },
        },
      },
    },
    models: {
      initial: 'idle',
      states: {
        idle: {
          on: {
            ADD_MODEL: {
              actions: 'addModel',
            },
            DELETE_MODEL: {
              actions: 'deleteModel',
            },
          },
        },
      },
    },
  },
}, {
  actions: {
    setFocusedWorkspace: assign((context, event) => {
      if (event.type !== 'FOCUS_WORKSPACE') return {};
      return { focusedWorkspace: event.workspace };
    }),
    clearFocusedWorkspace: assign({ focusedWorkspace: null }),
    setModal: assign((context, event) => {
      if (event.type !== 'OPEN_MODAL') return {};
      return { modal: event.modal };
    }),
    clearModal: assign({ modal: 'none' }),
    addModel: assign((context, event) => {
      if (event.type !== 'ADD_MODEL') return {};
      const newModel = {
        id: event.modelId,
        machine: modelMachine,
      };
      return { models: [...context.models, newModel] };
    }),
    deleteModel: assign((context, event) => {
      if (event.type !== 'DELETE_MODEL') return {};

      return { models: context.models.filter(model => model.id !== event.modelId) };
    }),

  },
});
