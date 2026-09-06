$ErrorActionPreference = 'Stop'
Write-Host '== FiveSamath frontend install ==' -ForegroundColor Cyan
npm ci
Write-Host '== FiveSamath frontend type/build check ==' -ForegroundColor Cyan
npm run build
Write-Host '== FiveSamath frontend lint ==' -ForegroundColor Cyan
npm run lint
Write-Host 'Frontend verification completed.' -ForegroundColor Green
