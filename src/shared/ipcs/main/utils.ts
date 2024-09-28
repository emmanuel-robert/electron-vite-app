import { app } from 'electron'
import { PowerShell } from 'node-powershell'
import path from 'path'

export type PowerShellInvocationResult<T> = {
  commandId: string
  type: 'error' | 'success'
  isError: boolean
  data: T
  error?: {
    message: string
    errorID: string
  }
}

// @ts-ignore PowerShellOptions type not up ot date
const ps7 = new PowerShell({ executionPolicy: 'Bypass', noProfile: true, pwsh: true })

export async function invokePS<T>(command: string): Promise<PowerShellInvocationResult<T>> {
  //Promise<PowerShellInvocationResult<T>> {
  const result = await ps7.invoke(command)
  console.log(result.raw)
  return JSON.parse(result.raw) as PowerShellInvocationResult<T>
}

function getResourcePath(relativePath: string): string {
  return path
    .join(app.getAppPath(), 'resources', relativePath)
    .replace('app.asar', 'app.asar.unpacked')
}
export async function getPowerShellVersion(): Promise<string> {
  const result = await invokePS<string>(
    //   // PowerShell.invoke`${path.join(__dirname, './resources/powershell/GetPowershellVersion.ps1').toString()}`
    getResourcePath('powershell/GetPowershellVersion.ps1')
  )
  // path.join(app.getAppPath(), 'assets/img/my.png').replace('app.asar', 'app.asar.unpacked')

  // const scriptPath = getResourcePath('powershell/GetPowershellVersion.ps1')
  // const result = await ps7.invoke(scriptPath)
  return result.data
}
