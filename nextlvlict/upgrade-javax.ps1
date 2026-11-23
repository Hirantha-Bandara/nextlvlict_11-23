$basePath = 'C:\Users\hiran\IdeaProjects\NextLevelIct Project\nextlvlict\src\main\java'
$files = Get-ChildItem -Path $basePath -Include '*.java' -Recurse

foreach ($file in $files) {
    $content = Get-Content $file.FullName -Raw
    $modified = $false

    # Replace javax imports with jakarta
    if ($content -match 'import javax\.(servlet|persistence|xml\.bind)') {
        $content = $content -replace 'import javax\.', 'import jakarta.'
        $modified = $true
    }

    if ($modified) {
        Set-Content $file.FullName -Value $content
        Write-Host "Updated: $($file.FullName)"
    }
}

Write-Host "Import replacement completed!"

