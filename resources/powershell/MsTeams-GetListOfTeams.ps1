param (
  [Parameter (Mandatory=$False,Position=1)]
  $user
)

$OUTPUT=@{}
[string]$commandID = "MsTeams-GetListOfTeams"

try{
  #####################################################################

    if($PSBoundParameters.ContainsKey('user')){
      $AllTeams = Get-AssociatedTeam -User $user
    } else {
      $AllTeams = Get-AssociatedTeam 
    }
    
    $DATA = New-Object System.Collections.Generic.List[System.Object]
    foreach ($Team in $AllTeams) {

      if($Team.DisplayName -Contains "ECRS") {
        Write-Host $Team.DisplayName
      }

      $DATA.Add(@{
        GroupId = $Team.GroupId.ToString()
        # DisplayName = [System.Text.Encoding]::UTF8.GetString([System.Text.Encoding]::UTF8.GetBytes($Team.DisplayName))
        DisplayName = $Team.DisplayName
        TenantId = $Team.TenantId
      })
    }
  
  #####################################################################

    
  # Convert the string to bytes
  $bytes = [System.Text.Encoding]::UTF8.GetBytes($DATA)
  # Encode the bytes to Base64
  $base64String = [Convert]::ToBase64String($bytes)

  $OUTPUT = @{
    commandId = $commandID
    isError = $false
    type = "success"
    data = $DATA
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
$OUTPUT | ConvertTo-Json -Depth 50 | Out-File "MsTeams-GetListOfTeams.json"
$OUTPUT | ConvertTo-Json -Depth 50