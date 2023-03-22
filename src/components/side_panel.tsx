type Props = {
  isOpen: boolean
  toggleSidePanel: () => void
}

function ClosedSidePanel() {
  return null
}

function OpenSidePanel({ toggleSidePanel }: Pick<Props, 'toggleSidePanel'>) {
  return <div className="bg-gray-200 h-screen absolute w-60 p-4 z-10">
    <div className="flex justify-between">
      <h1>Duckie</h1>
      <button className="bg-red-500 text-white px-2 rounded-md" onClick={toggleSidePanel}>Close</button>
    </div>
  </div>
}

export default function SidePanel({ isOpen, toggleSidePanel }: Props) {
  if (isOpen) {
    return <OpenSidePanel toggleSidePanel={toggleSidePanel} />
  } else {
    return <ClosedSidePanel />
  }
}