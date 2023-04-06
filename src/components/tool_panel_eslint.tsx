import { useEffect, useState } from "react"
import { invoke } from "@tauri-apps/api/tauri"
import { EslintMessage, EslintFile } from "../types/eslint"
import { openAI, EslintResult } from "../chains/eslint"
import Editor from "./editor"

type Output = {
  stdout: string
  stderr: string
  status: number
  files: Record<string, string>
}
type status =
  | {
      status: "loading"
    }
  | {
      status: "done"
      output: Output
    }
  | {
      status: "error"
      error: string
    }

function EslintIssue({
  message,
  fileContent,
}: {
  message: EslintMessage
  fileContent: string
}) {
  const [checking, setChecking] = useState(false)
  const [modelFix, setModelFix] = useState<EslintResult | null>(null)
  const { fix } = message

  const check = async () => {
    setChecking(true)
    const result = await openAI()
    setModelFix(result)
  }

  let solution
  if (fix) {
    solution = (
      <div className="bg-light-2 p-2">
        <p className="font-bold">Fix</p>
        <p>{fix.text}</p>
      </div>
    )
  } else if (modelFix) {
    if (modelFix.status === "no-solution") {
      solution = (
        <div className="bg-light-2 p-2">
          <p className="font-bold">No solution found</p>
        </div>
      )
    } else {
      solution = (
        <div className="bg-light-2 p-2">
          <p className="font-bold">Fix</p>
          <p>{modelFix.solution}</p>
        </div>
      )
    }
  } else if (!checking) {
    solution = (
      <div className="bg-light-2 p-2">
        <button onClick={check}>Check with model</button>
      </div>
    )
  } else {
    solution = (
      <div className="bg-light-2 p-2">
        <p>Checking...</p>
      </div>
    )
  }

  return (
    <div className="bg-light-1 m-2 rounded-lg overflow-hidden shadow-layered text-dark-1">
      <div className="border-b border-dark-4 pl-2 flex justify-between font-mono">
        {message.line}:{message.column} – {message.message}
        <div>
          <button className="bg-red-500 px-2 text-zinc-50 border-l border-dark-4">
            Ignore
          </button>
          <button className="bg-green-500 px-2 text-zinc-50 rounded-tr-lg border-l border-dark-4">
            Commit
          </button>
        </div>
      </div>

      <div className="border-b border-dark-4">
        <Editor message={message} fileContent={fileContent} />
        {solution}
      </div>
    </div>
  )
}

function File({ file, content }: { file: EslintFile; content: string }) {
  return (
    <div className="">
      <h1 className="border-b border-b-dark-4 px-4 font-mono">
        {file.filePath}
      </h1>
      <ul>
        {file.messages.map((message) => (
          <EslintIssue
            message={message}
            fileContent={content}
            key={message.messageId}
          />
        ))}
      </ul>
    </div>
  )
}

function Result({ output }: { output: Output }) {
  const { stdout, stderr, status, files } = output
  let result: File[] = []
  if (stdout) {
    result = stdout.slice(0, 1) as File[]
  }

  return (
    <>
      {result.map((file) => (
        <File file={file} content={files[file.filePath]} />
      ))}
    </>
  )
}

export default function ToolPanelEslint({ path }: { path: string }) {
  const [eslint, setEslint] = useState<status>({ status: "loading" })

  useEffect(() => {
    const runEslint = async () => {
      try {
        const response = await invoke("run_eslint", {
          path,
        })
        setEslint({ status: "done", output: response as Output })
      } catch (error) {
        if (error instanceof Error) {
          setEslint({ status: "error", error: error.message })
        } else if (typeof error === "string") {
          setEslint({ status: "error", error })
        } else {
          setEslint({ status: "error", error: "Unknown error" })
        }
      }
    }
    runEslint()
  }, [path])

  return (
    <div className="text-zinc-50 w-full flex flex-col">
      <h1 className="text-xl font-bold border-b border-b-dark-4 w-full px-4 py-2">
        Eslint
      </h1>
      <div className="flex-grow overflow-scroll">
        {eslint.status === "loading" && <p>Loading...</p>}
        {eslint.status === "done" && <Result output={eslint.output} />}
      </div>
    </div>
  )
}
