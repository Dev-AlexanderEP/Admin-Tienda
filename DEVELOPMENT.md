# 🚀 DEVELOPMENT.md - Guía de Desarrollo

## 📋 Requisitos Previos

- Docker y Docker Compose instalados
- Backend ejecutándose (contenedor `app_backend`)
- Node.js (opcional, solo para desarrollo local)

---

## 🐧 Desarrollo en WSL/Linux/Mac

### **First Step: Dar permisos de ejecución**
```bash
chmod +x setup-docker.sh
```

### **Ejecutar el frontend**
```bash
./setup-docker.sh
```

### **Comandos útiles**
```bash
# Ver logs del frontend
docker-compose -f docker-compose.dev.yml logs -f

# Detener el frontend
docker-compose -f docker-compose.dev.yml down

# Reiniciar solo el frontend
docker-compose -f docker-compose.dev.yml restart
```

---

## 🪟 Desarrollo en Windows

### **Opción 1: PowerShell (Recomendado)**
```powershell
# Ejecutar directamente
.\setup-docker.ps1
```

### **Opción 2: Command Prompt**
```cmd
# Ejecutar directamente (sin permisos necesarios)
setup-docker.bat
```

### **Comandos útiles para Windows**
```cmd
REM Ver logs del frontend
docker-compose -f docker-compose.dev.yml logs -f

REM Detener el frontend
docker-compose -f docker-compose.dev.yml down

REM Reiniciar solo el frontend
docker-compose -f docker-compose.dev.yml restart
```

---

## 🔧 ¿Qué hacen los scripts?

1. **✅ Verifican** que el backend (`app_backend`) esté ejecutándose
2. **🔍 Obtienen** automáticamente la IP del backend con `docker inspect`
3. **📝 Configuran** la variable de entorno `BACKEND_IP`
4. **🚀 Inician** el frontend con la configuración correcta
5. **❌ Muestran** errores claros si algo falla

---

## 🌐 Acceso a la Aplicación

- **Frontend**: http://localhost:5174
- **Backend**: http://localhost:8080
- **PgAdmin**: http://localhost:5050

---

## 🐛 Solución de Problemas

### **Error: "app_backend no está ejecutándose"**
```bash
# Verificar contenedores activos
docker ps

# Iniciar el backend primero
cd /ruta/a/tu/backend
docker-compose up -d
```

### **Error: "No se pudo obtener la IP"**
```bash
# Verificar la red del backend
docker network ls
docker network inspect apirest-tiendaderopa_app-net

# Reiniciar el backend si es necesario
docker-compose restart app_backend
```

### **Problemas de CORS o conexión**
- Asegúrate de que ambos contenedores estén en la misma red
- Verifica que las URLs en el código usen `/api/v1` (rutas relativas)
- Reinicia ambos contenedores si es necesario

---

## 📁 Estructura de Archivos

```
Admin-Tienda/
├── setup-docker.sh      # Script Linux/Mac/WSL
├── setup-docker.ps1     # Script PowerShell
├── setup-docker.bat     # Script Windows CMD
├── docker-compose.dev.yml
├── vite.config.js
└── src/
    └── components/
        └── ...
```

---

## 💡 Desarrollo Local (sin Docker)

Si prefieres ejecutar sin Docker:

```bash
# Instalar dependencias
npm install

# Ejecutar en modo desarrollo
npm run dev
```

**Nota**: En modo local, las peticiones van directamente a `http://localhost:8080`

---

## 🔄 Flujo de Desarrollo Recomendado

1. **Iniciar backend** (una sola vez por sesión)
2. **Ejecutar script de frontend** (`./setup-docker.sh` o `setup-docker.bat`)
3. **Desarrollar** - Los cambios se reflejan automáticamente (Hot Reload)
4. **Detener** cuando termines (`docker-compose down`)

