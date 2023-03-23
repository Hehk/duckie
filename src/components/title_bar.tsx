import { useAtom } from "jotai"
import { isSidePanelOpenAtom } from "../app"

export default function TitleBar() {
  const [_, setIsSidePanelOpen] = useAtom(isSidePanelOpenAtom)

  return <div className="flex border-b border-b-blue-500 p-2">
    <button className="bg-red-500 text-white px-2 rounded-md absolute" onClick={() => setIsSidePanelOpen(true)}>Open</button>
    <h1 className="m-auto">Workspace: testing</h1>
  </div>
}