# parse the sitecore.json file for the XM Cloud plugin version
[CmdletBinding(DefaultParameterSetName = 'FromArgs')]
param (
    [Parameter(Mandatory)]
    [string]$EnvironmentId
)

$ErrorActionPreference = "Stop"

$XmCloudVersion = "1.0.19" #(get-content sitecore.json | ConvertFrom-Json).plugins -match 'Sitecore.DevEx.Extensibility.XMCloud'
Write-Host '$XmCloudVersion ' $XmCloudVersion
# if ($XmCloudVersion -eq '' -or $LASTEXITCODE -ne 0) {
#     Write-Error "Unable to find version of XM Cloud Plugin"
# }
$XmCloudVersion = "1.0.19" #($XmCloudVersion -split '@')[1]
$pluginJsonFile = Get-Item -path "$PSScriptRoot\.sitecore\package-cache\nuget\Sitecore.DevEx.Extensibility.XMCloud.$($XmCloudVersion)\plugin\plugin.json"
$XmCloudDeployApi = (Get-Content $pluginJsonFile | ConvertFrom-Json).xmCloudDeployEndpoint
$XmCloudDeployAccessToken = (Get-Content "$PSScriptRoot\.sitecore\user.json" | ConvertFrom-Json).endpoints.xmCloud.accessToken

$Headers = @{"Authorization" = "Bearer $XmCloudDeployAccessToken" }
$URL = @(
    "$($XmCloudDeployApi)api/environments/v1"
    $EnvironmentId
    'obtain-edge-token'
)
Write-Host $URL
$Response = Invoke-RestMethod ($URL -join '/') -Method 'GET' -Headers $Headers -Verbose
$AccessToken = $Response.apiKey
$EdgeUrl = "$($Response.edgeUrl)/api/graphql/ide"
Write-Host "Launching Edge GraphQL IDE"
Write-Host "Add { ""X-GQL-Token"" : ""$AccessToken"" } to the HTTP HEADERS tab at the bottom-left of the screen to write queries against your content"
Start-Process $EdgeUrl
