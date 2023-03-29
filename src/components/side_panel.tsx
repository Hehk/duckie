import StateContext from "../state"

export default function SidePanel() {
  const [state, send] = StateContext.useActor()
  const { isSidePanelOpen } = state.context

  if (!isSidePanelOpen) return null

  return (
    <div className="h-full w-60 p-2 z-10">
      <div>
        <h2 className="font-bold uppercase">test</h2>
      </div>
    </div>
  )
}
