param (
    [Parameter (Mandatory=$True)]
    [String]$teamId,
    [Parameter (Mandatory=$True)]
    [String]$user,
    [Parameter (Mandatory=$False)]
    [Int16]$maxUsers = 50
)

$OUTPUT=@{}
[string]$commandID = "MsTeams-GetDetailOfTeam"

try{
  #####################################################################

    # Queries 
    $TeamDetails = Get-Team -groupId $teamId;
    $Channels = @(Get-TeamChannel -GroupId $teamId)
    $TeamUsers = Get-TeamUser -GroupId $teamId

    # Patterns
    $TeamLinkTemplate = "https://teams.microsoft.com/l/team/<ThreadId>/conversations?groupId=<GroupId>&tenantId=<TenantId>"

    # Get the Team link for Channel General
    $ChannelGeneral = $Channels | Where-Object { $_.DisplayName -eq "General" }   
    $TeamLink = $TeamLinkTemplate.Replace("<ThreadId>", $ChannelGeneral.Id).Replace("<GroupId>", $teamId).Replace("<TenantId>", "")

    # Get the channels
    $ChannelList = @()
    foreach ($Channel in $Channels) {
        $ChannelList += @{
            Id             = $Channel.Id;
            DisplayName    = $Channel.DisplayName;
            Description    = $Channel.Description;
            MembershipType = $Channel.MembershipType;
            Link           = $TeamLinkTemplate.Replace("<ThreadId>", $Channel.Id).Replace("<GroupId>", $teamId).Replace("<TenantId>", "");
        }
    }

    # Get owners & users 
    $TeamOwner = ($TeamUsers | Where-Object { $_.Role -eq "Owner" }).User
    $TeamMember = ($TeamUsers | Where-Object { $_.Role -eq "member" }).User
    $isTeamOwner = If ($TeamOwner.Values -contains $user) { 1 } Else { 0 } 

        
    $TeamObject = @{
        TeamID     = $teamId;  
        TeamName         = $TeamDetails.DisplayName;
        isTeamOwner      = $isTeamOwner;
        TeamOwnersCount  = $TeamOwner.Count;
        TeamMembersCount = $TeamMember.Count;
        TeamOwners       = If ($TeamOwner.Count -le $maxUsers) { $TeamOwner -replace $domain, '' -join "," } Else { '' } ;
        TeamMembers      = If ($TeamMember.Count -le $maxUsers) { $TeamMember -replace $domain, '' -join “,” } Else { '' } ;
        TeamLink         = $TeamLink;
        Channels         = $ChannelList;
        TeamMailNickName = $TeamDetails.MailNickName;
        Description      = $TeamDetails.Description;
        Visibility       = $TeamDetails.Visibility;
        Archived         = $TeamDetails.Archived;
    }

  #####################################################################

  $OUTPUT = @{
    commandId = $commandID
    isError = $false
    type = "success"
    data = $TeamObject 
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