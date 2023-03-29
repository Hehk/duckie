import React, { useState } from "react"
import { open } from "@tauri-apps/api/dialog"
import { exists, readDir } from "@tauri-apps/api/fs"
import { useMachine } from "@xstate/react"
import { createMachine, assign } from "xstate"
import StateContext from "../state"

type Context = {
  errors: {
    name: string | null
    path: string | null
  }
}

type Events =
  | { type: "SUBMIT" }
  | { type: "SUCCESS" }
  | { type: "ERROR"; field: string; error: string }
  | { type: "RESET_ERROR"; field: string }

const formMachine = createMachine<Context, Events>(
  {
    id: "form",
    initial: "idle",
    context: {
      errors: {
        name: null,
        path: null,
      },
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
            actions: ["resetAllErrors"],
          },
          ERROR: {
            target: "error",
            actions: ["setError"],
          },
        },
      },
      error: {
        on: {
          SUBMIT: "submitting",
        },
      },
    },
  },
  {
    actions: {
      setError: assign((context, event) => {
        if (event.type !== "ERROR") return {}
        return {
          errors: {
            ...context.errors,
            [event.field]: event.error,
          },
        }
      }),
      resetError: assign((context, event) => {
        if (event.type !== "RESET_ERROR") return {}
        return {
          errors: {
            ...context.errors,
            [event.field]: null,
          },
        }
      }),
      resetAllErrors: assign({
        errors: {
          name: null,
          path: null,
        },
      }),
    },
  },
)

const validateWorkspace = async (
  name: string,
  path: string,
  workspaces: Array<{ id: string; name: string; path: string }>,
) => {
  const errors: { field: string; error: string }[] = []

  if (!name) {
    errors.push({ field: "name", error: "Name cannot be empty." })
  }

  if (!path) {
    errors.push({ field: "path", error: "Path cannot be empty." })
  }

  if (name && /[^a-zA-Z0-9-_ ]/.test(name)) {
    errors.push({
      field: "name",
      error:
        "Name can only contain alphanumeric characters, dashes, underscores, and spaces.",
    })
  }

  const existingName = workspaces.find((workspace) => workspace.name === name)
  const existingPath = workspaces.find((workspace) => workspace.path === path)

  if (existingName) {
    errors.push({
      field: "name",
      error: "A workspace with the same name already exists.",
    })
  }

  if (existingPath) {
    errors.push({
      field: "path",
      error: "A workspace with the same path already exists.",
    })
  }

  // Check with tauri if the path is valid
  // Then check if we have permissions
  try {
    const pathExists = await exists(path)
    if (!pathExists) {
      errors.push({
        field: "path",
        error: "The path does not exist.",
      })
    }
  } catch (e) {
    errors.push({
      field: "path",
      error: "The path does not exist.",
    })
  }

  try {
    const canRead = Boolean(await readDir(path))
    if (!canRead) {
      errors.push({
        field: "path",
        error: "The path is not readable.",
      })
    }
  } catch (e) {
    errors.push({
      field: "path",
      error: "The path is not readable.",
    })
  }

  return errors
}

const CreateWorkspaceModal = () => {
  const [globalState, send] = StateContext.useActor()
  const [formState, formSend] = useMachine(formMachine)
  const [name, setName] = useState("")
  const [path, setPath] = useState("")

  const selectFolder = async (e) => {
    e.preventDefault()
    try {
      const path = await open({
        multiple: false,
        directory: true,
      })

      if (!path) {
        formSend({
          type: "ERROR",
          field: "path",
          error: "Path cannot be empty.",
        })
      } else if (typeof path === "string") {
        formSend({ type: "RESET_ERROR", field: "path" })
        setPath(path)
      } else {
        formSend({ type: "RESET_ERROR", field: "path" })
        setPath(path[0])
      }
    } catch (error) {
      if (error instanceof Error) {
        console.error("Error selecting folder:", error)
        formSend({ type: "ERROR", field: "path", error: error.message })
      }
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    formSend({ type: "SUBMIT" })

    const validationErrors = await validateWorkspace(
      name,
      path,
      globalState.context.workspaces,
    )

    if (validationErrors.length) {
      validationErrors.forEach((error) => {
        formSend({ type: "ERROR", field: error.field, error: error.error })
      })
      return
    }

    try {
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
        formSend({ type: "ERROR", field: "general", error: error.message })
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
      {formState.context.errors.name && (
        <div className="error">{formState.context.errors.name}</div>
      )}
      <button onClick={selectFolder}>Select Folder</button>
      {formState.context.errors.path && (
        <div className="error">{formState.context.errors.path}</div>
      )}
      <button type="submit" disabled={formState.matches("submitting")}>
        Create Workspace
      </button>
    </form>
  )
}

export default CreateWorkspaceModal
