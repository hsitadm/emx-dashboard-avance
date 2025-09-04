# EMx Dashboard - Proyecto de Transición

## 🎯 Propósito del Proyecto

Dashboard interactivo para gestionar y visualizar el progreso de la transición al nuevo servicio EMx. Permite a todos los stakeholders monitorear avances, hitos, backlog y responsabilidades en tiempo real.

## 🎯 Latest Updates (September 2025)

### ✅ IAM Role Authentication System
- **AWS Cognito Integration** with IAM Role-based authentication
- **Real-time User Management** from Cognito User Pool
- **Role-based Access Control** (Admin/Viewer permissions)
- **Production-ready Security** with no hardcoded credentials
- **Automatic credential rotation** via AWS IAM

### 🔒 Security Architecture
- **IAM Role**: `AmazonSSMRoleForInstancesQuickSetup`
- **IAM Policy**: `EMxDashboard-CognitoReadPolicy` (read-only Cognito access)
- **User Pool**: `us-east-1_A7TjCD2od` (3 active users)
- **Instance**: `i-011793221d2022c2c` (EC2 with proper IAM permissions)
- **Authentication**: AWS Cognito with MFA support

### 👥 User Management
- **Real-time user data** from AWS Cognito User Pool
- **Role-based permissions**: Admin (full access) / Viewer (read-only)
- **User states**: CONFIRMED, FORCE_CHANGE_PASSWORD, etc.
- **Fallback mechanism** for API reliability

### 🎨 UI/UX Improvements
- **Clean user interface** without debug artifacts
- **Professional user management** with real Cognito data
- **Role-based navigation** (viewers see limited tabs)
- **Real-time updates** with "Actualizar" button

**Status**: ✅ **PRODUCTION READY**
**Branch**: `feature/cognito-auth` (48+ commits)
**Security**: ✅ IAM Role authentication implemented
**Users**: 3 active users in Cognito User Pool

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
- 🔒 **Autenticación AWS Cognito** con IAM Role

## 🛠️ Stack Tecnológico

### Frontend
- **React 18** + **TypeScript**
- **Tailwind CSS** para styling
- **Zustand** para manejo de estado
- **Recharts** para gráficos y visualizaciones
- **Lucide React** para iconos
- **AWS Amplify** para autenticación

### Backend
- **Node.js** + **Express**
- **SQLite** como base de datos
- **ES Modules** (import/export)
- **CORS** habilitado para desarrollo
- **AWS CLI** para integración con Cognito

### AWS Services
- **Amazon Cognito** para autenticación de usuarios
- **IAM Roles** para acceso seguro sin credenciales
- **EC2** para hosting con permisos apropiados

## 🔧 Instalación y Configuración

### Prerrequisitos
- **Node.js** 18+ 
- **npm** o **yarn**
- **AWS CLI** configurado
- **Permisos IAM** para Cognito

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

## 🔒 Configuración de Seguridad

### IAM Role Setup
1. Crear policy con permisos mínimos para Cognito
2. Attachar policy al IAM Role de la instancia EC2
3. Remover credenciales temporales
4. Verificar acceso a Cognito User Pool

Ver `TECHNICAL_IMPLEMENTATION.md` para detalles completos.

## 📡 API Endpoints

### Autenticación
- `POST /api/auth/login` - Login con Cognito
- `POST /api/auth/logout` - Logout
- `GET /api/auth/user` - Usuario actual

### Usuarios
- `GET /api/cognito-users` - Obtener usuarios reales de Cognito

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

## 🎮 Características Especiales

### Autenticación AWS Cognito
- Login seguro con AWS Cognito User Pool
- Roles de usuario (Admin/Viewer) con permisos diferenciados
- IAM Role para acceso sin credenciales hardcodeadas

### Auto-Progreso
- Las tareas marcadas como "Completadas" se actualizan automáticamente al 100%
- El progreso de las historias se calcula como promedio de sus tareas

### Filtros Avanzados
- Por región, responsable, prioridad, estado
- Búsqueda en tiempo real

### Gestión de Usuarios
- Datos en tiempo real desde AWS Cognito User Pool
- Estados de usuario actualizados automáticamente
- Botón "Actualizar" para refrescar datos

## 🚀 Despliegue

### Desarrollo
```bash
# Terminal 1 - Backend
cd backend && npm start

# Terminal 2 - Frontend  
cd frontend && npm run dev
```

### Producción
```bash
# Build frontend
cd frontend && npm run build

# Configurar IAM Role en EC2
# Ver TECHNICAL_IMPLEMENTATION.md
```

## 📈 Métricas del Proyecto

- **48+ commits** realizados
- **CRUD completo** para 3 entidades principales
- **6 vistas principales** implementadas
- **5 regiones** soportadas
- **4 roles de usuario** definidos
- **Autenticación AWS Cognito** implementada
- **IAM Role** configurado para seguridad

## 🤝 Contribución

1. Fork el proyecto
2. Crea una rama para tu feature (`git checkout -b feature/nueva-funcionalidad`)
3. Commit tus cambios (`git commit -m 'Agregar nueva funcionalidad'`)
4. Push a la rama (`git push origin feature/nueva-funcionalidad`)
5. Abre un Pull Request

## 📝 Licencia

Este proyecto es privado y pertenece a la organización.

## 👨‍💻 Desarrollado por

**Equipo EMx** - Dashboard de Transición

---

**Última actualización**: Septiembre 2025  
**Versión**: 2.0.0  
**Estado**: ✅ Funcional con autenticación AWS Cognito
