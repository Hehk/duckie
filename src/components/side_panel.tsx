import { useAtom } from 'jotai'
import { isSidePanelOpenAtom } from '../app'

export default function SidePanel() {
  const [isOpen, setIsOpen] = useAtom(isSidePanelOpenAtom)

  if (!isOpen) return null

  return <div className="bg-gray-200 h-screen absolute w-60 p-4 z-10">
    <div className="flex justify-between">
      <h1>Duckie</h1>
      <button className="bg-red-500 text-white px-2 rounded-md" onClick={() => setIsOpen(false)}>Close</button>
    </div>
  </div>
}