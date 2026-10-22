# LUMA Auto-Push Script
# Run this in PowerShell after navigating to C:\Projects\Luma\luma-app

$ProjectPath = "C:\Projects\Luma\luma-app"
$ErrorActionPreference = "Stop"

Write-Host "========================================"
Write-Host "  LUMA Auto-Push Script"
Write-Host "========================================"
Write-Host ""

if (-not (Test-Path $ProjectPath)) {
    Write-Host "ERROR: Project folder not found: $ProjectPath" -ForegroundColor Red
    exit 1
}

Set-Location $ProjectPath
Write-Host "Project path: $ProjectPath"
Write-Host ""

# Step 1: Remove .bak files from Git tracking
Write-Host "Step 1: Removing .bak files from Git tracking..."
$bakFiles = git ls-files | Where-Object { $_ -match "\.bak$" }
if ($bakFiles) {
    foreach ($file in $bakFiles) {
        Write-Host "  git rm --cached $file"
        git rm --cached "$file" --quiet
    }
    Write-Host "  Done: $($bakFiles.Count) .bak file(s) removed from Git tracking." -ForegroundColor Green
} else {
    Write-Host "  No .bak files found in Git tracking." -ForegroundColor DarkGray
}
Write-Host ""

# Step 2: Remove dev-dist from Git tracking
Write-Host "Step 2: Checking dev-dist/ in Git tracking..."
$devDistTracked = git ls-files | Where-Object { $_ -match "^dev-dist/" }
if ($devDistTracked) {
    Write-Host "  git rm -r --cached dev-dist/"
    git rm -r --cached "dev-dist/" --quiet
    Write-Host "  Done: dev-dist/ removed from Git tracking." -ForegroundColor Green
} else {
    Write-Host "  dev-dist/ not in Git tracking." -ForegroundColor DarkGray
}
Write-Host ""

# Step 3: Remove .bak files from filesystem
Write-Host "Step 3: Removing .bak files from filesystem..."
$localBakFiles = Get-ChildItem -Path $ProjectPath -Filter "*.bak" -Recurse -File -ErrorAction SilentlyContinue
if ($localBakFiles) {
    foreach ($file in $localBakFiles) {
        Write-Host "  Removing $($file.FullName)"
        Remove-Item $file.FullName -Force
    }
    Write-Host "  Done: $($localBakFiles.Count) .bak file(s) removed from filesystem." -ForegroundColor Green
} else {
    Write-Host "  No .bak files found on filesystem." -ForegroundColor DarkGray
}
Write-Host ""

# Step 4: Remove sensitive env files
Write-Host "Step 4: Removing sensitive env files..."
$sensitiveFiles = @(".env.local.bak", ".env.bak", ".env.local.backup")
foreach ($sf in $sensitiveFiles) {
    $sPath = Join-Path $ProjectPath $sf
    if (Test-Path $sPath) {
        Write-Host "  Removing $sf"
        Remove-Item $sPath -Force
    }
}
Write-Host "  Done: Sensitive env files checked." -ForegroundColor Green
Write-Host ""

# Step 5: Check current branch
Write-Host "Step 5: Checking current branch..."
$branch = git branch --show-current
Write-Host "  Current branch: $branch"
Write-Host ""

# Step 6: git add
Write-Host "Step 6: Running git add ."
git add .
Write-Host "  Done: git add completed." -ForegroundColor Green
Write-Host ""

# Step 7: git status
Write-Host "Step 7: Git status:"
git status --short
Write-Host ""

# Step 8: git commit
Write-Host "Step 8: Committing changes..."
git commit -m "security: remove env backups, fix critical issues - PWA, CSS, types, auth"
Write-Host "  Done: Commit completed." -ForegroundColor Green
Write-Host ""

# Step 9: git push
Write-Host "Step 9: Pushing to GitHub..."
git push origin $branch
Write-Host "  Done: Push completed." -ForegroundColor Green
Write-Host ""

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "  All steps completed successfully!" -ForegroundColor Green
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "GitHub Actions: https://github.com/sourin1364-hub/luma-app/actions"
Write-Host "Wait 2-3 minutes for deploy to finish."
Write-Host "Then visit: https://sourin1364-hub.github.io/luma-app/"
Write-Host "Press Ctrl+F5 for hard refresh after deploy."
Write-Host ""
