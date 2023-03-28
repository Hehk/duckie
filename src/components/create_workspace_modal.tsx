import React, { useState } from "react"
import { useMachine } from "@xstate/react"
import { createMachine, assign } from "xstate"
import StateContext from "../state"

type Context = {
  error: Error | null
}
type Events =
  | { type: "SUBMIT" }
  | { type: "SUCCESS" }
  | { type: "ERROR"; error: Error }
  | { type: "RETRY" }

const formMachine = createMachine<Context, Events>(
  {
    id: "form",
    initial: "idle",
    context: {
      error: null,
    },
    states: {
      idle: {
        on: {
          SUBMIT: "submitting",
        },
      },
      submitting: {
        on: {
          SUCCESS: {
            target: "idle",
            actions: ["resetError"],
          },
          ERROR: {
            target: "error",
            actions: ["setError"],
          },
        },
      },
      error: {
        on: {
          RETRY: "submitting",
        },
      },
    },
  },
  {
    actions: {
      setError: assign((context, event) => {
        if (event.type !== "ERROR") return {}
        return { error: event.error }
      }),
      resetError: assign({ error: null }),
    },
  },
)

const CreateWorkspaceModal = () => {
  const [, send] = StateContext.useActor()
  const [formState, formSend] = useMachine(formMachine)
  const [name, setName] = useState("")
  const [path, setPath] = useState("")

  const handlePathChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    debugger
    const directory = e.target.files?.[0]
    const newPath = directory?.webkitRelativePath || ""

    setPath(newPath)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    formSend({ type: "SUBMIT" })

    try {
      // Add your API call or other async operation to create a workspace here
      // We need to get recursive permissions to read the directory

      // Validate the workspace
      // There should be no workspace with the same path
      // There should be no workspace with the same name
      // The path should be a valid directory
      // The name should not be empty
      // The path should not be empty
      // The name should not contain any special characters
      // All permissions should be granted

      console.log("CREATE_WORKSPACE", name, path)

      // Update global state with the new workspace
      const newWorkspace = { id: "name", name, path }
      send({ type: "ADD_WORKSPACE", workspace: newWorkspace })

      // Close the modal
      send({ type: "CLOSE_MODAL" })

      // Reset form state
      formSend({ type: "SUCCESS" })
    } catch (error) {
      if (error instanceof Error) {
        console.error(error.message)
        formSend({ type: "ERROR", error })
      } else {
        throw error
      }
    }
  }

  return (
    <form onSubmit={handleSubmit}>
      <label htmlFor="name">Name:</label>
      <input
        type="text"
        id="name"
        value={name}
        onChange={(e) => setName(e.target.value)}
      />
      <label htmlFor="path">Path:</label>
      <input
        type="file"
        id="path"
        webkitdirectory=""
        onChange={handlePathChange}
      />
      {formState.context.error && (
        <div className="error">{formState.context.error.message}</div>
      )}
      <button type="submit" disabled={formState.matches("submitting")}>
        Create Workspace
      </button>
    </form>
  )
}

export default CreateWorkspaceModal
