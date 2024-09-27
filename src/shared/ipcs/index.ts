import { combineIpcs } from 'interprocess'

import { mainIpcSlice } from './main/main'
import { rendererIpcSlice } from './renderer/renderer'

export const { ipcMain, ipcRenderer, exposeApiToGlobalWindow } = combineIpcs(
  mainIpcSlice,
  rendererIpcSlice
)
