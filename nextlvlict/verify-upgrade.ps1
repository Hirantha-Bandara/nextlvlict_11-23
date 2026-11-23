$javaxCount = 0
$jakartaCount = 0

$files = Get-ChildItem -Path 'C:\Users\hiran\IdeaProjects\NextLevelIct Project\nextlvlict\src\main\java' -Include '*.java' -Recurse

foreach ($file in $files) {
    $content = Get-Content $file.FullName
    $javaxCount += ($content | Select-String -Pattern 'import javax\.(servlet|persistence|xml\.bind)' | Measure-Object).Count
    $jakartaCount += ($content | Select-String -Pattern 'import jakarta\.(servlet|persistence|xml\.bind)' | Measure-Object).Count
}

Write-Host "Upgrade Verification Report:"
Write-Host "============================="
Write-Host "Remaining javax imports: $javaxCount"
Write-Host "Jakarta imports found: $jakartaCount"

if ($javaxCount -eq 0) {
    Write-Host "`nStatus: SUCCESS - All javax imports have been upgraded to jakarta!"
} else {
    Write-Host "`nStatus: WARNING - Some javax imports still remain"
}

