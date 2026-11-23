$javaSrcPath = 'C:\Users\hiran\IdeaProjects\NextLevelIct Project\nextlvlict\src\main\java'
$filesToUpdate = @(
    'ClassScheduleServlet.java',
    'TutesUploading.java',
    'GradeServlet.java',
    'TutesServlet.java',
    'TutesRequestServlet.java',
    'OlAlServlet.java',
    'StudentManagement.java',
    'RecordingRequestServlet.java',
    'RecordingsServlet.java'
)

$files = Get-ChildItem -Path $javaSrcPath -Include $filesToUpdate -Recurse

foreach ($file in $files) {
    $content = Get-Content $file.FullName -Raw
    $modified = $false

    # Replace old Criteria imports with JPA Criteria imports
    if ($content -like "*import org.hibernate.Criteria*") {
        $content = $content -replace 'import org\.hibernate\.Criteria;', @'
import org.hibernate.query.Query;
import jakarta.persistence.criteria.CriteriaBuilder;
import jakarta.persistence.criteria.CriteriaQuery;
import jakarta.persistence.criteria.Root;
'@
        $modified = $true
    }

    # Remove old criterion imports if they exist
    if ($content -like "*import org.hibernate.criterion*") {
        $content = $content -replace 'import org\.hibernate\.criterion\.[A-Za-z]+;[\s\n]*', ''
        $modified = $true
    }

    if ($modified) {
        Set-Content $file.FullName -Value $content
        Write-Host "Updated imports in: $($file.Name)"
    }
}

Write-Host "Import updates completed!"

