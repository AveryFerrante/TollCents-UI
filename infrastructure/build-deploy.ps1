$StartingPWD = $PWD
$BuildOutputDir = Join-Path (Resolve-Path "$PWD\..").Path "dist"
$BuildCommandDir = Resolve-Path "$PWD\..\"
$RemoteUser = "tollcents"
$RemoteHost = "tollcents.com"
$RemoteDeployPath = "/var/www/tollcents/html"

$Stopwatch = [System.Diagnostics.Stopwatch]::StartNew()

Write-Host "Building Project"
if (Test-Path $BuildOutputDir) {
  Remove-Item $BuildOutputDir -Recurse
}
Set-Location $BuildCommandDir
& npm run build
if ($LASTEXITCODE -ne 0) {
  Write-Host "Build Failed. Exiting." -ForegroundColor Red
  exit 1
}

Write-Host "Deploying to Remote Host"
if ((Get-Service ssh-agent).Status -ne 'Running') {
  Start-Service ssh-agent
}
ssh "${RemoteUser}@${RemoteHost}" "rm -rf $RemoteDeployPath"
scp -r "$BuildOutputDir" "${RemoteUser}@${RemoteHost}:${RemoteDeployPath}"

Write-Host "Updating File Permissions"
$RemoteCommandF = "cd $RemoteDeployPath; find . -type f -exec chmod 754 {} \;" 
$RemoteCommandD = "cd $RemoteDeployPath; find . -type d -exec chmod 755 {} \;"

ssh "${RemoteUser}@${RemoteHost}" $RemoteCommandF
ssh "${RemoteUser}@${RemoteHost}" $RemoteCommandD

$Stopwatch.Stop()
$ElapsedTime = $Stopwatch.Elapsed.ToString("hh\:mm\:ss\.ff")

Write-Host "Deployment Succeeded in $ElapsedTime!"
# Stop-Service ssh-agent
Remove-Item $BuildOutputDir -Recurse
Set-Location $StartingPWD


