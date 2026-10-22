# LUMA - Setup Environment
# این فایل اطلاعات اتصال به Supabase را در .env.local می‌سازد
$envContent = @"
VITE_SUPABASE_URL=https://ahgscpbrtxeoqjbnufyy.supabase.co
VITE_SUPABASE_ANON_KEY=sb_publishable_-1Y-i10SJTvlIPlHpcsf6g_HSKcfl_Q
"@
[System.IO.File]::WriteAllText((Join-Path $PSScriptRoot ".env.local"), $envContent, (New-Object System.Text.UTF8Encoding $false))
Write-Host "✅ فایل .env.local با موفقیت ساخته شد." -ForegroundColor Green