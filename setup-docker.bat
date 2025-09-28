@echo off
echo 🔍 Obteniendo IP del backend...

REM Verificar si el contenedor está ejecutándose
docker ps --format "{{.Names}}" | findstr "app_backend" >nul
if %errorlevel% neq 0 (
    echo ❌ Error: El contenedor 'app_backend' no está ejecutándose.
    echo    Por favor, ejecuta primero tu docker-compose del backend.
    pause
    exit /b 1
)

REM Obtener la IP del contenedor
for /f "tokens=*" %%i in ('docker inspect app_backend -f "{{range .NetworkSettings.Networks}}{{.IPAddress}}{{end}}"') do set BACKEND_IP=%%i

if "%BACKEND_IP%"=="" (
    echo ❌ Error: No se pudo obtener la IP del contenedor app_backend
    pause
    exit /b 1
)

echo ✅ IP del backend detectada: %BACKEND_IP%

echo 🚀 Iniciando frontend con IP dinámica...

REM Ejecutar docker-compose con la variable de entorno
docker-compose -f docker-compose.dev.yml up -d

echo 🏁 Frontend detenido.
pause