import { useEffect } from 'react'
import hotkeys from 'hotkeys-js'

export default function useShortcut (shortcut: string, callback: () => void) {
  useEffect(() => {
    debugger
    hotkeys(shortcut, callback)
    return () => {
      hotkeys.unbind(shortcut)
    }
  }, [shortcut, callback])
}