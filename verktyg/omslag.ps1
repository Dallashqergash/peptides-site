# Skapar en omslagsbild (1600x900 jpg) till en artikel.
# Exempel:
#   powershell -ExecutionPolicy Bypass -File verktyg\omslag.ps1 -Slug d-vitamin -Etikett "Kosttillskott" -Rubrik "D-vitamin på vintern" -Tema sol
# Teman: sol, molekyl, puls, sömn
param(
  [Parameter(Mandatory)][string]$Slug,
  [Parameter(Mandatory)][string]$Rubrik,
  [string]$Etikett = "",
  [string]$Tema = "molekyl"
)
$ErrorActionPreference = "Stop"
$root = Split-Path $PSScriptRoot -Parent
$mall = (Join-Path $PSScriptRoot "omslag.html") -replace '\\', '/'
$q = "etikett=" + [uri]::EscapeDataString($Etikett) + "&rubrik=" + [uri]::EscapeDataString($Rubrik) + "&tema=" + [uri]::EscapeDataString($Tema)
$url = "file:///$mall`?$q"
$tmp = Join-Path $env:TEMP "omslag_$Slug.png"
$ut = Join-Path $root "src\bilder\artiklar\$Slug.jpg"
$edge = "${env:ProgramFiles(x86)}\Microsoft\Edge\Application\msedge.exe"
if (-not (Test-Path $edge)) { $edge = "$env:ProgramFiles\Google\Chrome\Application\chrome.exe" }
& $edge --headless=new --disable-gpu --hide-scrollbars --virtual-time-budget=4000 --window-size=1600,900 "--screenshot=$tmp" $url | Out-Null
Start-Sleep -Milliseconds 500
& ffmpeg -v error -y -i $tmp -q:v 3 $ut
Remove-Item $tmp -ErrorAction SilentlyContinue
"Klar: $ut"
