# download-sprites.ps1
# Run from project root: ./download-sprites.ps1

$spriteDir = "public/sprites"
$baseUrl = "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon"

# Create directory if it doesn't exist
if (-not (Test-Path $spriteDir)) {
    New-Item -ItemType Directory -Path $spriteDir -Force | Out-Null
    Write-Host "Created directory: $spriteDir"
}

# Download all 151 Kanto Pokemon sprites
Write-Host "Downloading 151 Pokemon sprites..."

$successCount = 0
$failCount = 0

for ($id = 1; $id -le 151; $id++) {
    $url = "$baseUrl/$id.png"
    $output = "$spriteDir/$id.png"
    
    try {
        Invoke-WebRequest -Uri $url -OutFile $output -UseBasicParsing
        Write-Host "[$id/151] Downloaded: $id.png" -ForegroundColor Green
        $successCount++
    }
    catch {
        Write-Host "[$id/151] Failed to download: $id.png" -ForegroundColor Red
        $failCount++
    }
}

Write-Host "`n========================================" -ForegroundColor Cyan
Write-Host "Download complete!" -ForegroundColor Cyan
Write-Host "Success: $successCount" -ForegroundColor Green
Write-Host "Failed: $failCount" -ForegroundColor $(if ($failCount -gt 0) { "Red" } else { "Green" })
Write-Host "Sprites saved to: $spriteDir" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan