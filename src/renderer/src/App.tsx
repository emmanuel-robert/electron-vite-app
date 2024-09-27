import { useState } from 'react'
import electronLogo from './assets/electron.svg'
import Versions from './components/Versions'

const { invoke, handle } = window.api

handle.getPong()

function App(): JSX.Element {
  const [psVersion, setPsVersion] = useState('')

  // const ipcHandle = (): void => window.electron.ipcRenderer.send('ping')

  const ipcHandle = async (): Promise<string> => {
    const result = await invoke.getPing('ping')
    console.log(result)
    return result
  }

  const updatePsVersion = async (): Promise<void> => {
    const version = await invoke.getPowerShellVersion()
    setPsVersion(version)
  }
  updatePsVersion()

  return (
    <>
      <img alt="logo" className="logo" src={electronLogo} />
      <div className="creator">Powered by electron-vite</div>
      <div className="text">
        Build an Electron app with <span className="react">React</span>
        &nbsp;and <span className="ts">TypeScript</span>
      </div>
      <p className="tip">
        Please try pressing <code>F12</code> to open the devTool
      </p>
      <h2>PSVersion: {psVersion} </h2>
      <div className="actions">
        <div className="action">
          <a href="https://electron-vite.org/" target="_blank" rel="noreferrer">
            Documentation
          </a>
        </div>
        <div className="action">
          <a target="_blank" rel="noreferrer" onClick={ipcHandle}>
            Send IPC
          </a>
        </div>
      </div>
      <Versions></Versions>
    </>
  )
}

export default App
