import { createIpcSlice } from 'interprocess'
import { Message } from '../interfaces'

export const rendererIpcSlice = createIpcSlice({
  renderer: {
    async toLowerCaseInRenderer(_, { message }: Message) {
      console.log(message)
      // ... do something with the data when this handler is invoked by the main process
      return { message: message.toLowerCase() }
    },

    async getPong(_, data: 'pong') {
      const message = `from main: ${data} on renderer process`

      console.log(message)

      return 'it worked'
    }
  }
})
