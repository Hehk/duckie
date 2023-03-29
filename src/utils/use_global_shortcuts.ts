import useShortcut from "./use_shortcut";
import StateContext from "../state";

export default function useGlobalShortcuts () {
  const [,send] = StateContext.useActor()

  useShortcut('command+b', () => {
    send({type: 'TOGGLE_SIDE_PANEL'})
  })
}