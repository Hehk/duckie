import { useEffect, useState } from "react"
import { invoke } from "@tauri-apps/api/tauri"

type status =
  | {
      status: "loading"
    }
  | {
      status: "success"
      data: string
    }
  | {
      status: "error"
      error: string
    }

export default function ToolPanelEslint({ path }: { path: string }) {
  const [eslint, setEslint] = useState<status>({ status: "loading" })

  useEffect(() => {
    const runEslint = async () => {
      try {
        const response = await invoke("run_eslint", {
          path,
        })
        setEslint({ status: "success", data: response as string })
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
    <div className="p-4 text-zinc-50">
      <h1 className="text-xl font-bold">Eslint</h1>
      {eslint.status === "loading" && <p>Loading...</p>}
      {eslint.status === "error" && <pre>{eslint.error}</pre>}
      {eslint.status === "success" && <p>{eslint.data}</p>}
    </div>
  )
}
