import { electronAPI } from '@electron-toolkit/preload'
import { contextBridge } from 'electron'
import { exposeApiToGlobalWindow } from '../shared/ipcs'

// Custom APIs for renderer
// const api = {}

const { key, api } = exposeApiToGlobalWindow({
  exposeAll: true // expose handlers, invokers and removers
})

// Use `contextBridge` APIs to expose Electron APIs to
// renderer only if context isolation is enabled, otherwise
// just add to the DOM global.
if (process.contextIsolated) {
  try {
    contextBridge.exposeInMainWorld('electron', electronAPI)
    // contextBridge.exposeInMainWorld(key, api)
  } catch (error) {
    console.error(error)
  }
} else {
  // @ts-ignore (define in dts)
  window.electron = electronAPI
  // @ts-ignore (define in dts)
  window[key] = api
}
