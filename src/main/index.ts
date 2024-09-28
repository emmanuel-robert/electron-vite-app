import { electronApp, is, optimizer } from '@electron-toolkit/utils'
import { app, BrowserWindow, shell } from 'electron'
import { join } from 'path'
import icon from '../../resources/icon.png?asset'

import electronUpdater from 'electron-updater'
import { ipcMain as ipcMainInterprocess } from '../shared/ipcs'

const { autoUpdater } = electronUpdater

const { handle, invoke } = ipcMainInterprocess

function createWindow(): BrowserWindow {
  // Create the browser window.
  const mainWindow = new BrowserWindow({
    width: 1200,
    height: 800,
    show: false,
    autoHideMenuBar: true,
    ...(process.platform === 'linux' ? { icon } : {}),
    webPreferences: {
      preload: join(__dirname, '../preload/index.js'),
      sandbox: false
    }
  })

  handle.getPing()
  handle.getPowerShellVersion()

  mainWindow.webContents.on('dom-ready', () => {
    console.log('DOM READY')
    invoke.getPong(mainWindow, 'pong')
    invoke.getPong(mainWindow, 'version: ' + app.getVersion())
  })

  mainWindow.on('ready-to-show', () => {
    mainWindow.show()
  })

  mainWindow.webContents.setWindowOpenHandler((details) => {
    shell.openExternal(details.url)
    return { action: 'deny' }
  })

  autoUpdater.on('checking-for-update', () => {
    invoke.getPong(mainWindow, 'checking for update')
    console.log('checking for update')
  })

  autoUpdater.on('error', (error) => {
    invoke.getPong(mainWindow, 'error when checking for update: ' + error.message)
    console.log('error when checking for update: ' + error.message)
  })

  autoUpdater.on('update-available', (updateInfo) => {
    invoke.getPong(mainWindow, 'Update is available: ' + updateInfo.version)
    console.log('Update is available: ' + updateInfo.version)
  })

  autoUpdater.on('update-not-available', (updateInfo) => {
    invoke.getPong(mainWindow, 'Update not available: ' + updateInfo.version)
    console.log('Update not available: ' + updateInfo.version)
  })

  // HMR for renderer base on electron-vite cli.
  // Load the remote URL for development or the local html file for production.
  if (is.dev && process.env['ELECTRON_RENDERER_URL']) {
    mainWindow.loadURL(process.env['ELECTRON_RENDERER_URL'])
  } else {
    mainWindow.loadFile(join(__dirname, '../renderer/index.html'))
  }

  return mainWindow
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.whenReady().then(() => {
  // Set app user model id for windows
  electronApp.setAppUserModelId('com.electron')

  // Default open or close DevTools by F12 in development
  // and ignore CommandOrControl + R in production.
  // see https://github.com/alex8088/electron-toolkit/tree/master/packages/utils
  app.on('browser-window-created', (_, window) => {
    optimizer.watchWindowShortcuts(window)
  })
  autoUpdater.checkForUpdates()
  autoUpdater.checkForUpdatesAndNotify()

  let mainWindow = createWindow()
  mainWindow.webContents.openDevTools()

  app.on('activate', function () {
    // On macOS it's common to re-create a window in the app when the
    // dock icon is clicked and there are no other windows open.
    if (BrowserWindow.getAllWindows().length === 0) {
      mainWindow = createWindow()
    }
  })
})

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})
