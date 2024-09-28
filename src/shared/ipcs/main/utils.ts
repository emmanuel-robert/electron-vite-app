import { app } from 'electron'
import { PowerShell } from 'node-powershell'

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

export async function getPowerShellVersion(): Promise<string> {
  // const result = await invokePS<string>(
  //   // PowerShell.invoke`${path.join(__dirname, './resources/powershell/GetPowershellVersion.ps1').toString()}`
  //   PowerShell.command`${path.join(__dirname, './resources/powershell/GetPowershellVersion.ps1').toString()}`
  // )
  // path.join(app.getAppPath(), 'assets/img/my.png').replace('app.asar', 'app.asar.unpacked')
  return app.getAppPath()
  // const scriptPath = path.join(__dirname, '../../resources/powershell/GetPowershellVersion.ps1')
  // const result = await ps7.invoke(scriptPath)

  // return scriptPath + ' ' + result.raw
}
