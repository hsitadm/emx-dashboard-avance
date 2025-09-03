# EMx Dashboard - Proyecto de Transición

## 🎯 Propósito del Proyecto

Dashboard interactivo para gestionar y visualizar el progreso de la transición al nuevo servicio EMx. Permite a todos los stakeholders monitorear avances, hitos, backlog y responsabilidades en tiempo real.

## 👥 Roles y Usuarios

- **Directores**: Vista ejecutiva y aprobaciones
- **Regionales**: Gestión por región
- **Service Delivery Lead**: Coordinación de entregas
- **EMx Champions**: Líderes de adopción
- **Líderes EMx**: Gestión operativa
- **Colaboradores**: Ejecución y actualización de tareas

## 🚀 Funcionalidades Principales

- ✅ **CRUD Completo de Tareas** con progreso ajustable (0-100%)
- ✅ **CRUD Completo de Historias** con agrupación de tareas
- ✅ **CRUD Completo de Hitos** del proyecto
- 📊 **Dashboard de Análisis** con gráficos por región
- 📋 **Vista Kanban** para gestión visual
- 📅 **Calendario** de tareas y eventos
- 🌍 **Filtros por Región** (CECA, SOLA, MX, SNAP, COEC)
- ⏱️ **Auto-progreso** al 100% cuando tarea se completa
- 🎮 **Gamificación** con logros y puntos
- 📝 **Edición colaborativa** por roles

## 🛠️ Stack Tecnológico

### Frontend
- **React 18** + **TypeScript**
- **Tailwind CSS** para styling
- **Zustand** para manejo de estado
- **Recharts** para gráficos y visualizaciones
- **Lucide React** para iconos

### Backend
- **Node.js** + **Express**
- **SQLite** como base de datos
- **ES Modules** (import/export)
- **CORS** habilitado para desarrollo

## 🏗️ Arquitectura de Infraestructura

### 🌐 Entornos Desplegados

```
📦 ARQUITECTURA ACTUAL:
├── 🟢 PROD: 100.25.218.71 (main branch)
│   ├── Backend: Puerto 3001 (PM2)
│   ├── Frontend: Puerto 80 (Nginx)
│   ├── Base de datos: SQLite
│   └── Status: ✅ PRODUCCIÓN ESTABLE
│
└── 🟡 DEV: 13.220.180.0 (development branch)
    ├── Backend: Puerto 3001 (PM2)
    ├── Frontend: Puerto 80 (Nginx)
    ├── Base de datos: SQLite (copia de PROD)
    └── Status: ✅ DESARROLLO ACTIVO
```

### ⚙️ Servicios Configurados

#### **Producción (100.25.218.71)**
- **PM2**: Process Manager para backend
- **Nginx**: Web server y reverse proxy
- **Auto-startup**: Servicios inician automáticamente
- **SSL**: Listo para configurar HTTPS

#### **Desarrollo (13.220.180.0)**
- **Entorno separado**: Cero riesgo para PROD
- **Branch development**: Sincronizado con GitHub
- **Base de datos**: Copia actualizada de PROD
- **Testing**: Entorno seguro para pruebas

## 📁 Estructura del Proyecto

```
emx-dashboard-avance/
├── frontend/                 # Aplicación React
│   ├── src/
│   │   ├── components/      # Componentes React
│   │   ├── services/        # API services
│   │   ├── store/          # Zustand store
│   │   └── types/          # TypeScript types
│   ├── public/             # Assets estáticos
│   ├── dist/               # Build de producción
│   └── package.json
├── backend/                 # API Node.js
│   ├── routes/             # Rutas de la API
│   ├── config/             # Configuración DB
│   ├── database.sqlite     # Base de datos SQLite
│   └── server.js          # Servidor principal
├── backup-scripts/         # Scripts de backup automático
│   ├── emx-backup.sh      # Backup principal
│   ├── emx-restore.sh     # Restauración
│   └── backup-status.sh   # Monitoreo
└── README.md
```

## 🔧 Instalación y Configuración

### Prerrequisitos
- **Node.js** 18+ 
- **npm** o **yarn**
- **AWS CLI** (para backups)

### 1. Clonar el repositorio
```bash
git clone https://github.com/hsitadm/emx-dashboard-avance.git
cd emx-dashboard-avance
```

### 2. Configurar Backend
```bash
cd backend
npm install
npm start
```
El backend estará disponible en `http://localhost:3001`

### 3. Configurar Frontend
```bash
cd frontend
npm install
npm run dev
```
El frontend estará disponible en `http://localhost:5173`

## 🚀 Despliegue en Producción

### Acceso a Servidores
```bash
# Producción
ssh -i emx-dashboard-key.pem ec2-user@100.25.218.71

# Desarrollo
ssh -i emx-dashboard-key.pem ec2-user@13.220.180.0
```

### Workflow de Desarrollo

#### 1. Desarrollar en DEV
```bash
# Conectar a DEV
ssh -i emx-dashboard-key.pem ec2-user@13.220.180.0

# Hacer cambios
cd emx-dashboard-avance
git checkout development
# ... hacer cambios ...
git add . && git commit -m "feat: nueva funcionalidad"
git push origin development
```

#### 2. Rebuild si es necesario
```bash
# Frontend
cd frontend && npm run build
sudo cp -r dist/* /var/www/html/

# Backend
pm2 restart emx-backend-dev
```

#### 3. Deploy a PROD
```bash
# En PROD hacer merge
ssh -i emx-dashboard-key.pem ec2-user@100.25.218.71
cd emx-dashboard-avance
git checkout main
git merge development
git push origin main

# Rebuild y restart
cd frontend && npm run build
sudo cp -r dist/* /var/www/html/
pm2 restart emx-backend
```

## 🛡️ Sistema de Backup Automático

### 📊 Configuración de Backups

```
🔄 ESTRATEGIA DE BACKUP:
├── 📅 AUTOMÁTICO DIARIO
│   ├── PROD: 2:00 AM
│   └── DEV: 3:00 AM
│
├── 📦 DATOS RESPALDADOS
│   ├── Base de datos SQLite
│   ├── Configuraciones (Nginx, PM2)
│   ├── Logs de aplicación
│   └── Package.json
│
└── ☁️ ALMACENAMIENTO
    ├── S3 Bucket: emx-dashboard-backups-2025
    ├── Encriptación: AES256
    ├── Versionado: Habilitado
    └── Rotación: 30 días
```

### 🔧 Comandos de Backup

#### Ejecutar backup manual:
```bash
# PROD
ssh ec2-user@100.25.218.71
/home/ec2-user/backup-scripts/emx-backup.sh

# DEV  
ssh ec2-user@13.220.180.0
/home/ec2-user/backup-scripts/emx-backup.sh
```

#### Ver estado de backups:
```bash
ssh ec2-user@100.25.218.71
/home/ec2-user/backup-scripts/backup-status.sh
```

#### Restaurar backup:
```bash
ssh ec2-user@100.25.218.71
/home/ec2-user/backup-scripts/emx-restore.sh emx-prod-YYYYMMDD_HHMMSS.tar.gz
```

### 📈 Monitoreo de Backups
- **Logs**: `/var/log/emx-backup.log`
- **S3 Dashboard**: AWS Console
- **Alertas**: Automáticas en caso de fallo
- **Espacio**: ~$5-10/mes estimado

## 📡 API Endpoints

### Tareas
- `GET /api/tasks` - Obtener todas las tareas
- `POST /api/tasks` - Crear nueva tarea
- `PUT /api/tasks/:id` - Actualizar tarea
- `DELETE /api/tasks/:id` - Eliminar tarea

### Historias
- `GET /api/stories` - Obtener todas las historias
- `POST /api/stories` - Crear nueva historia
- `PUT /api/stories/:id` - Actualizar historia
- `DELETE /api/stories/:id` - Eliminar historia

### Hitos
- `GET /api/milestones` - Obtener todos los hitos
- `POST /api/milestones` - Crear nuevo hito
- `PUT /api/milestones/:id` - Actualizar hito
- `DELETE /api/milestones/:id` - Eliminar hito

### Usuarios
- `GET /api/users` - Obtener usuarios
- `GET /api/users/current` - Usuario actual

## 📊 Componentes Principales

### 🏠 Dashboard Principal
- **ProgressOverview**: Métricas generales del proyecto
- **Navigation**: Tabs para diferentes vistas

### 📋 Gestión de Tareas
- **TaskBoard**: Lista de tareas con filtros avanzados
- **TaskModal**: Crear/editar tareas con progreso ajustable
- **KanbanBoard**: Vista Kanban por estados

### 📖 Gestión de Historias
- **StoriesView**: CRUD completo de historias
- **StoryModal**: Crear/editar historias

### 🎯 Gestión de Hitos
- **MilestonesView**: CRUD completo de hitos
- **MilestoneTimeline**: Timeline visual de hitos

### 📈 Análisis y Reportes
- **Charts**: Gráficos por región y estado
- **CalendarView**: Vista de calendario
- **Gamification**: Sistema de logros

## 🌍 Regiones Soportadas

- **🌍 TODAS**: Tareas globales
- **CECA**: Región CECA
- **SOLA**: Región SOLA  
- **MX**: Región México
- **SNAP**: Región SNAP
- **COEC**: Región COEC

## 🔒 Seguridad

### Configuración Actual
- **Security Groups**: Puertos restringidos (22, 80, 443, 3001)
- **SSH Keys**: Acceso controlado con llaves privadas
- **Backup Encryption**: AES256 en S3
- **IAM Policies**: Permisos mínimos necesarios

### Próximas Mejoras
- [ ] HTTPS/SSL con certificados
- [ ] Autenticación de usuarios
- [ ] Rate limiting
- [ ] Audit logs

## 🎮 Características Especiales

### Auto-Progreso
- Las tareas marcadas como "Completadas" se actualizan automáticamente al 100%
- El progreso de las historias se calcula como promedio de sus tareas

### Filtros Avanzados
- Por región, responsable, prioridad, estado
- Búsqueda en tiempo real

### Notificaciones
- Sistema de notificaciones para acciones CRUD
- Feedback visual para el usuario

## 📈 Métricas del Proyecto

- **Commits realizados**: 50+
- **CRUD completo** para 3 entidades principales
- **6 vistas principales** implementadas
- **5 regiones** soportadas
- **4 roles de usuario** definidos
- **2 entornos** desplegados (PROD/DEV)
- **Backup automático** configurado
- **100% uptime** en producción

## 🎯 Latest Updates (Septiembre 2025)

### ✅ Infraestructura Completa
- **Entornos separados**: PROD y DEV completamente independientes
- **Backup automático**: Sistema profesional con S3
- **Monitoreo**: Scripts de estado y alertas
- **Auto-startup**: Servicios configurados para reinicio automático

### ✅ Milestone-Story Association System
- **Complete CRUD** for milestone-story relationships
- **Visual separation** between story details and milestones in overview
- **Real-time synchronization** across all components
- **Enhanced security** with authentication middleware
- **Input validation** and comprehensive error handling

### 🔒 Security Enhancements
- Authentication middleware implemented on all routes
- Input validation with sanitization and length limits
- Comprehensive security review document created
- Rate limiting and CORS properly configured
- Ready for production deployment

### 📊 Database Improvements
- Added `story_id` and `region` columns to milestones table
- Established proper foreign key relationships
- Sample data with milestone-story associations

### 🎨 UI/UX Improvements
- Enhanced visual hierarchy and separation
- Better information grouping in milestone cards
- Improved responsive design throughout
- Real-time data updates without manual refresh

## 🚀 Próximos Pasos

### Corto Plazo (1-2 semanas)
- [ ] Configurar HTTPS/SSL
- [ ] Implementar autenticación de usuarios
- [ ] Mejorar sistema de notificaciones
- [ ] Optimizar rendimiento frontend

### Mediano Plazo (1 mes)
- [ ] Dashboard de analytics avanzado
- [ ] Integración con sistemas externos
- [ ] Mobile responsive improvements
- [ ] API rate limiting

### Largo Plazo (3 meses)
- [ ] Multi-tenancy support
- [ ] Advanced reporting system
- [ ] Real-time collaboration features
- [ ] Performance monitoring

## 🤝 Contribución

### Workflow de Desarrollo
1. Fork el proyecto
2. Crear branch desde `development`
3. Hacer cambios y testing en DEV
4. Crear Pull Request a `development`
5. Review y merge
6. Deploy a PROD cuando esté listo

### Estándares de Código
- **Frontend**: React + TypeScript + Tailwind
- **Backend**: Node.js + Express + ES Modules
- **Database**: SQLite con migraciones
- **Testing**: Pruebas en entorno DEV antes de PROD

## 📞 Soporte

### Contacto
- **Equipo EMx**: Dashboard de Transición
- **Repositorio**: https://github.com/hsitadm/emx-dashboard-avance
- **Entorno PROD**: http://100.25.218.71
- **Entorno DEV**: http://13.220.180.0

### Troubleshooting
- **Logs Backend**: `pm2 logs emx-backend`
- **Logs Nginx**: `sudo tail -f /var/log/nginx/error.log`
- **Logs Backup**: `tail -f /var/log/emx-backup.log`
- **Estado Servicios**: `pm2 status && sudo systemctl status nginx`

## 📝 Licencia

Este proyecto es privado y pertenece a la organización.

---

**Última actualización**: Septiembre 2025  
**Versión**: 2.0.0  
**Estado**: ✅ PRODUCCIÓN ESTABLE CON BACKUP AUTOMÁTICO

**Status**: ✅ **COMPLETE AND FUNCTIONAL**  
**Environments**: PROD + DEV + Automated Backups  
**Ready for**: Continuous Development and Production Use
