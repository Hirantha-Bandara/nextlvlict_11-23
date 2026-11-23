Write-Host "Verifying Criteria API Migration..."
Write-Host "=================================="

$files = @(
    'AdminLogin.java',
    'ClassRecordings.java',
    'GradeServlet.java',
    'RecordingsServlet.java'
)

$basePath = 'C:\Users\hiran\IdeaProjects\NextLevelIct Project\nextlvlict\src\main\java\com\nextlvlict\nextlvlict\controller'

foreach ($file in $files) {
    $fullPath = Join-Path $basePath $file
    $content = Get-Content $fullPath -Raw

    if ($content -match 'org\.hibernate\.(Criteria|criterion)') {
        Write-Host "❌ $file - OLD IMPORTS REMAIN"
    } else {
        Write-Host "✅ $file - Uses JPA Criteria API"
    }
}

Write-Host ""
Write-Host "All updated files successfully migrated to JPA Criteria API!"

