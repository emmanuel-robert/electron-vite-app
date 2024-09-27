param (
)

$OUTPUT=@{}
[string]$commandID = "GetPSVersion"

try{
  #####################################################################

  $version = $PSVersionTable.PSVersion.ToString()

  #####################################################################

  $OUTPUT = @{
    commandId = $commandID
    type = "success"
    isError = $false
    data = $version
  }
}
catch [System.Management.Automation.RuntimeException] {
  $OUTPUT = @{
    commandId = $commandID
    type = "error"
    isError = $true
    data = $null
    error = @{
      message = $_.Exception.Message
      errorID = $_.FullyQualifiedErrorID
    }
  }
}
ConvertTo-Json $OUTPUT -Compress