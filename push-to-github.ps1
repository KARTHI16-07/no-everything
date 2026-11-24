param(
    [string]$RepoUrl = "https://github.com/KARTHI16-07/no-everything.git"
)

Write-Host "=====================================================" -ForegroundColor Cyan
Write-Host "        NO EVERYTHING — GitHub Push Helper           " -ForegroundColor Cyan
Write-Host "=====================================================" -ForegroundColor Cyan
Write-Host "Target Remote: $RepoUrl" -ForegroundColor Yellow
Write-Host ""

$remoteExists = git remote 2>$null
if ($remoteExists -match "origin") {
    git remote set-url origin $RepoUrl
    Write-Host "[OK] Updated existing remote origin." -ForegroundColor Green
} else {
    git remote add origin $RepoUrl
    Write-Host "[OK] Added remote origin: $RepoUrl" -ForegroundColor Green
}

Write-Host ""
Write-Host "Pushing 'main' branch to origin..." -ForegroundColor Cyan
git push -u origin main

if ($LASTEXITCODE -eq 0) {
    Write-Host ""
    Write-Host "[SUCCESS] Repository pushed to GitHub successfully!" -ForegroundColor Green
    Write-Host "Frontend: Connect https://github.com/KARTHI16-07/no-everything on https://vercel.com/new" -ForegroundColor White
    Write-Host "Backend:  Connect https://github.com/KARTHI16-07/no-everything on https://render.com" -ForegroundColor White
} else {
    Write-Host ""
    Write-Host "[NOTICE] If push failed because the repository doesn't exist yet on GitHub:" -ForegroundColor Yellow
    Write-Host "1. Open https://github.com/new in your browser" -ForegroundColor White
    Write-Host "2. Repository name: no-everything" -ForegroundColor White
    Write-Host "3. Leave 'Add a README file' UNCHECKED" -ForegroundColor White
    Write-Host "4. Click 'Create repository'" -ForegroundColor White
    Write-Host "5. Then re-run: .\push-to-github.ps1" -ForegroundColor White
}
