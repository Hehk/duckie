import * as fs from '@tauri-apps/api/fs'
import * as path from '@tauri-apps/api/path'
import { useEffect, useState } from 'react'

type ModelStatus = {
  status: 'unloaded'
} | {
  status: 'downloading'
  progress: number
} | {
  status: 'downloaded'
  location: string
}

type Model = {
  name: string;
  id: string;
  description: string;
  url: string;
  tags: string[];
  status: ModelStatus;
  size: number;
}

const models: Model[] = [
  {
    name: 'Model 1',
    id: '1',
    description: 'Model 1 description',
    url: 'https://example.com',
    tags: ['tag1', 'tag2'],
    status: { status: 'unloaded' },
    size: 1000,
  },
  {
    name: 'Model 2',
    id: '2',
    description: 'Model 2 description',
    url: 'https://example.com',
    tags: ['tag1', 'tag2'],
    status: { status: 'downloading', progress: 0.5 },
    size: 1000,
  },
  {
    name: 'Model 3',
    id: '3',
    description: 'Model 3 description',
    url: 'https://example.com',
    tags: ['tag1', 'tag2'],
    status: { status: 'downloaded', location: '/path/to/model' },
    size: 1000,
  },
]


const checkDownloads = async () => {
}

export default function ModelsPage() {
  const [modelDir, setModelDir] = useState(undefined)
  window.fs = fs
  window.path = path

  useEffect(() => {
    const getModelDir = async () => {
      const appDataDir = await path.appDataDir()
      setModelDir(appDataDir + 'models')
    }
    const checkDownloads = async () => {
      const dir = fs.BaseDirectory.AppData
      const path = 'models'
      const exists = await fs.exists(path, { dir })
      if (!exists) await fs.createDir(path, { dir })

      const files = await fs.readDir(path, { dir })
      const downloadedModels = files.map((file) => {
        console.log(file.name)
        return file.name
      })
    }

    getModelDir()
    checkDownloads()
  }, [])


  return <div className="text-zinc-100 p-2">
    <h1 className="font-bold text-2xl" > Models Page</h1 >
    {modelDir ??
      <div>
        Dir: {modelDir}
      </div>
    }
    <p>Download the latest version of the app here.</p>

    <div className="flex flex-col">
      {models.map((model) => {
        return <div className="flex flex-col" key={model.id}>
          <div className="flex flex-row">
            <h2 className="font-bold text-xl">{model.name}
              <span className="text-sm text-gray-400 ml-2">{model.id}</span>
            </h2>
          </div>
          <p className="text-sm">{model.description}</p>
          <div className="flex flex-row">
            {model.tags.map((tag) => {
              return <span key={tag} className="text-sm text-gray-400 mr-2">{tag}</span>
            }
            )}
          </div>
          <div className="flex flex-row">
            <span className="text-sm text-gray-400 mr-2">{model.size} MB</span>
            <span className="text-sm text-gray-400 mr-2">{model.url}</span>
          </div>
          <div className="flex flex-row">
            {model.status.status === 'unloaded' && <button>Download</button>}
            {model.status.status === 'downloading' && <div>Downloading {model.status.progress}</div>}
            {model.status.status === 'downloaded' && <div>Downloaded</div>}
          </div>
        </div>
      })
      }
    </div>
  </div >
}