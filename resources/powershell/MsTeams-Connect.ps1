param (
)

$OUTPUT=@{}
[string]$commandID = "MsTeams-Connect"

try{
  #####################################################################

  $rawData = Connect-MicrosoftTeams

  $connectionData = @{
      account = $rawData.Account.Id
      environment = $rawData.Environment.Name
      domain = $rawData.Tenant.Domain
      tenantId = $rawData.Tenant.Id

  }

  #####################################################################
  
  $OUTPUT = @{
    commandId = $commandID
    type = "success"
    isError = $false
    data = $connectionData 
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