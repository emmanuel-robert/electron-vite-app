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

const ps7 = new PowerShell({ executionPolicy: 'Bypass', noProfile: true, pwsh: true })
export async function invokePS<T>(command: string): Promise<PowerShellInvocationResult<T>> {
  //Promise<PowerShellInvocationResult<T>> {
  const result = await ps7.invoke(command)
  console.log(result.raw)
  return JSON.parse(result.raw) as PowerShellInvocationResult<T>
}

export async function getPowerShellVersion(): Promise<string> {
  const result = await invokePS<string>(
    PowerShell.command`./src/main/powershell/GetPowershellVersion.ps1`
  )
  return result.data
}
