import { createIpcSlice } from 'interprocess'
import { Message } from '../interfaces'
import { getPowerShellVersion } from './utils'

export const mainIpcSlice = createIpcSlice({
  main: {
    async toUpperCaseInMain(_, { message }: Message) {
      return { message: message.toUpperCase() }
    },

    async getPing(_, data: 'ping') {
      const message = `from renderer: ${data} on main process`
      console.log(message)
      return 'it worked in main'
    },

    async getPowerShellVersion() {
      const version = await getPowerShellVersion()
      console.log('version is ', version)
      return version
    }
  }
})
