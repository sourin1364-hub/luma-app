# ============================================
# LUMA Auto-Push Script
# ============================================
$ProjectPath = "C:\Projects\Luma\luma-app"
$ErrorActionPreference = "Stop"

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "  LUMA Auto-Push Script" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

if (-not (Test-Path $ProjectPath)) {
    Write-Host "ERROR: پوشه پروژه پیدا نشد: $ProjectPath" -ForegroundColor Red
    exit 1
}

Set-Location $ProjectPath
Write-Host "مسیر پروژه: $ProjectPath" -ForegroundColor Yellow
Write-Host ""

# حذف .bak از Git tracking
Write-Host "مرحله 1: حذف فایل‌های .bak از Git tracking..." -ForegroundColor Magenta
$bakFiles = git ls-files | Where-Object { $_ -match "\.bak$" }
if ($bakFiles) {
    foreach ($file in $bakFiles) {
        git rm --cached "$file" --quiet
    }
    Write-Host "$($bakFiles.Count) فایل .bak از Git tracking حذف شد." -ForegroundColor Green
} else {
    Write-Host "هیچ فایل .bak در Git tracking یافت نشد." -ForegroundColor DarkGray
}
Write-Host ""

# حذف dev-dist از Git tracking
Write-Host "مرحله 2: بررسی dev-dist/..." -ForegroundColor Magenta
$devDistTracked = git ls-files | Where-Object { $_ -match "^dev-dist/" }
if ($devDistTracked) {
    git rm -r --cached "dev-dist/" --quiet
    Write-Host "dev-dist/ از Git tracking حذف شد." -ForegroundColor Green
} else {
    Write-Host "dev-dist/ در Git tracking نیست." -ForegroundColor DarkGray
}
Write-Host ""

# حذف .bak از سیستم فایل
Write-Host "مرحله 3: حذف فایل‌های .bak از سیستم فایل..." -ForegroundColor Magenta
$localBakFiles = Get-ChildItem -Path $ProjectPath -Filter "*.bak" -Recurse -File -ErrorAction SilentlyContinue
if ($localBakFiles) {
    foreach ($file in $localBakFiles) {
        Remove-Item $file.FullName -Force
    }
    Write-Host "$($localBakFiles.Count) فایل .bak حذف شد." -ForegroundColor Green
} else {
    Write-Host "هیچ فایل .bak یافت نشد." -ForegroundColor DarkGray
}
Write-Host ""

# حذف فایل‌های env حساس
Write-Host "مرحله 4: حذف فایل‌های env حساس..." -ForegroundColor Magenta
$sensitiveFiles = @(".env.local.bak", ".env.bak", ".env.local.backup")
foreach ($sf in $sensitiveFiles) {
    $sPath = Join-Path $ProjectPath $sf
    if (Test-Path $sPath) {
        Remove-Item $sPath -Force
        Write-Host "حذف شد: $sf" -ForegroundColor Gray
    }
}
Write-Host "فایل‌های env بررسی شدند." -ForegroundColor Green
Write-Host ""

# بررسی branch
Write-Host "مرحله 5: بررسی branch..." -ForegroundColor Magenta
$branch = git branch --show-current
Write-Host "Branch فعلی: $branch" -ForegroundColor Yellow
Write-Host ""

# git add
Write-Host "مرحله 6: git add ." -ForegroundColor Magenta
git add .
Write-Host "git add انجام شد." -ForegroundColor Green
Write-Host ""

# git status
Write-Host "مرحله 7: وضعیت Git:" -ForegroundColor Magenta
git status --short
Write-Host ""

# git commit
Write-Host "مرحله 8: Commit..." -ForegroundColor Magenta
git commit -m "security: remove env backups, fix critical issues"
Write-Host "Commit انجام شد." -ForegroundColor Green
Write-Host ""

# git push
Write-Host "مرحله 9: Push..." -ForegroundColor Magenta
git push origin $branch
Write-Host "Push انجام شد." -ForegroundColor Green
Write-Host ""

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "  همه مراحل با موفقیت انجام شد!" -ForegroundColor Green
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "لینک Actions: https://github.com/sourin1364-hub/luma-app/actions" -ForegroundColor Yellow
Write-Host "2-3 دقیقه صبر کنید." -ForegroundColor Yellow
Write-Host "سپس: https://sourin1364-hub.github.io/luma-app/" -ForegroundColor White