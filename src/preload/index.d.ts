import { ElectronAPI } from '@electron-toolkit/preload'
import { exposeApiToGlobalWindow } from '../shared/ipcs'

const { key, api } = exposeApiToGlobalWindow({
  exposeAll: true // expose handlers, invokers and removers
})

declare global {
  interface Window {
    electron: ElectronAPI
    [key]: typeof api
  }
}
