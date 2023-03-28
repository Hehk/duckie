import React from "react"
import StateContext from "../state"
import CreateWorkspaceModal from "./create_workspace_modal"

const Modal: React.FC = () => {
  const [state, send] = StateContext.useActor()
  console.log("modal", state)

  const closeModal = () => {
    send({ type: "CLOSE_MODAL" })
  }

  if (state.context.modal === "none") {
    return null
  }

  let modalContent = null
  switch (state.context.modal) {
    case "create_workspace":
      modalContent = <CreateWorkspaceModal />
      break
  }

  return (
    <div className="absolute z-50 top-0 bottom-0 right-0 left-0">
      <div
        className="bg-dark-4 top-0 absolute left-0 right-0 bottom-0 opacity-25"
        onClick={closeModal}
      />
      <div className="bg-zinc-50 top-8 absolute m-auto w-80">
        {modalContent}
      </div>
    </div>
  )
}

export default Modal
