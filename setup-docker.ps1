# setup-docker.ps1
Write-Host "🔍 Obteniendo IP del backend..." -ForegroundColor Cyan

# Verificar si el contenedor app_backend está ejecutándose
$backendRunning = docker ps --format "{{.Names}}" | Select-String "app_backend"

if (-not $backendRunning) {
    Write-Host "❌ Error: El contenedor 'app_backend' no está ejecutándose." -ForegroundColor Red
    Write-Host "   Por favor, ejecuta primero tu docker-compose del backend." -ForegroundColor Yellow
    exit 1
}

# Obtener la IP del contenedor app_backend
try {
    $backendIP = (docker inspect app_backend -f '{{range .NetworkSettings.Networks}}{{.IPAddress}}{{end}}' 2>$null | Select-Object -First 1).Trim()
    
    if ([string]::IsNullOrWhiteSpace($backendIP)) {
        throw "IP vacía"
    }
    
    Write-Host "✅ IP del backend detectada: $backendIP" -ForegroundColor Green
    
    # Exportar la variable de entorno
    $env:BACKEND_IP = $backendIP
    
    Write-Host "🚀 Iniciando frontend con IP dinámica..." -ForegroundColor Cyan
    
    # Ejecutar docker-compose con la variable de entorno
    docker-compose -f docker-compose.dev.yml up
    
    Write-Host "🏁 Frontend detenido." -ForegroundColor Yellow
    
} catch {
    Write-Host "❌ Error: No se pudo obtener la IP del contenedor app_backend" -ForegroundColor Red
    Write-Host "   Detalles: $_" -ForegroundColor Red
    exit 1
}