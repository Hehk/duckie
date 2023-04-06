import { minimalSetup } from "codemirror"
import { MergeView } from "@codemirror/merge"
import { EditorState } from "@codemirror/state"
import { EditorView } from "@codemirror/view"
import { useEffect, useRef, useState } from "react"
import { EslintMessage } from "../types/eslint"

type Fix = {
  range: [number, number]
  text: string
}

type Props = {
  fileContent: string
  message: EslintMessage
}

function applyFix(fileContent: string, fix: Fix) {
  const [start, end] = fix.range
  return fileContent.slice(0, start) + fix.text + fileContent.slice(end)
}

function createView(
  fileContent: string,
  message: EslintMessage,
  parent: Element,
) {
  if (!message.fix) {
    return new EditorView({
      state: EditorState.create({
        doc: fileContent,
        extensions: [
          minimalSetup,
          EditorState.readOnly.of(true),
          EditorView.editable.of(false),
        ],
      }),
      parent,
    })
  } else {
    const a = fileContent
    const b = applyFix(fileContent, message.fix)

    return new MergeView({
      a: {
        doc: a,
        extensions: [
          minimalSetup,
          EditorState.readOnly.of(true),
          EditorView.editable.of(false),
        ],
      },
      b: {
        doc: b,
        extensions: [
          minimalSetup,
          EditorState.readOnly.of(true),
          EditorView.editable.of(false),
        ],
      },
      parent,
      collapseUnchanged: { margin: 1 },
    })
  }
}

export default function Editor({ fileContent, message }: Props) {
  const [ref, setRef] = useState<HTMLDivElement | null>(null)
  const editor = useRef<MergeView | EditorView | null>(null)

  useEffect(() => {
    if (!ref) return
    if (editor.current) editor.current.destroy()

    editor.current = createView(fileContent, message, ref)
  }, [ref])

  return <div ref={setRef} />
}
