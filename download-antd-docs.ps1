# download-antd-docs.ps1
# Run from project root: ./download-antd-docs.ps1

$docsDir = "docs"
$baseUrl = "https://ant.design/components"

# Create directory if it doesn't exist
if (-not (Test-Path $docsDir)) {
    New-Item -ItemType Directory -Path $docsDir -Force | Out-Null
    Write-Host "Created directory: $docsDir"
}

# Component list (kebab-case for URLs)
$components = @(
    # General
    "button",
    "float-button",
    "icon",
    "typography",
    
    # Layout
    "divider",
    "flex",
    "grid",
    "layout",
    "masonry",
    "space",
    "splitter",
    
    # Navigation
    "anchor",
    "breadcrumb",
    "dropdown",
    "menu",
    "pagination",
    "steps",
    "tabs",
    
    # Data Entry
    "auto-complete",
    "cascader",
    "checkbox",
    "color-picker",
    "date-picker",
    "form",
    "input",
    "input-number",
    "mentions",
    "radio",
    "rate",
    "select",
    "slider",
    "switch",
    "time-picker",
    "transfer",
    "tree-select",
    "upload",
    
    # Data Display
    "avatar",
    "badge",
    "calendar",
    "card",
    "carousel",
    "collapse",
    "descriptions",
    "empty",
    "image",
    "list",
    "popover",
    "qr-code",
    "segmented",
    "statistic",
    "table",
    "tag",
    "timeline",
    "tooltip",
    "tour",
    "tree",
    
    # Feedback
    "alert",
    "drawer",
    "message",
    "modal",
    "notification",
    "popconfirm",
    "progress",
    "result",
    "skeleton",
    "spin",
    "watermark",
    
    # Other
    "affix",
    "app",
    "config-provider",
    "util"
)

$total = $components.Count
Write-Host "Downloading $total ant.design component docs..."

$successCount = 0
$failCount = 0

foreach ($component in $components) {
    $url = "$baseUrl/$component.md"
    $output = "$docsDir/$component.md"
    
    try {
        Invoke-WebRequest -Uri $url -OutFile $output -UseBasicParsing
        Write-Host "[$($successCount + $failCount + 1)/$total] Downloaded: $component.md" -ForegroundColor Green
        $successCount++
    }
    catch {
        Write-Host "[$($successCount + $failCount + 1)/$total] Failed to download: $component.md" -ForegroundColor Red
        $failCount++
    }
}

Write-Host "`n========================================" -ForegroundColor Cyan
Write-Host "Download complete!" -ForegroundColor Cyan
Write-Host "Success: $successCount" -ForegroundColor Green
Write-Host "Failed: $failCount" -ForegroundColor $(if ($failCount -gt 0) { "Red" } else { "Green" })
Write-Host "Docs saved to: $docsDir" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan