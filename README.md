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

## 📁 Estructura del Proyecto

```
emx-dashboard/
├── frontend/                 # Aplicación React
│   ├── src/
│   │   ├── components/      # Componentes React
│   │   ├── services/        # API services
│   │   ├── store/          # Zustand store
│   │   └── types/          # TypeScript types
│   ├── public/             # Assets estáticos
│   └── package.json
├── backend/                 # API Node.js
│   ├── routes/             # Rutas de la API
│   ├── config/             # Configuración DB
│   ├── database.sqlite     # Base de datos SQLite
│   └── server.js          # Servidor principal
└── README.md
```

## 🚦 Estados del Proyecto

- 🔴 **Planificación**: Definición de requerimientos
- 🟡 **En Progreso**: Implementación activa
- 🟢 **Completado**: Funcionalidad lista
- 🔵 **En Revisión**: Pendiente de aprobación

## 🔧 Instalación y Configuración

### Prerrequisitos
- **Node.js** 18+ 
- **npm** o **yarn**

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

# Servir archivos estáticos desde backend
# (Configurar express.static en server.js)
```

## 📈 Métricas del Proyecto

- **47 commits** realizados
- **CRUD completo** para 3 entidades principales
- **6 vistas principales** implementadas
- **5 regiones** soportadas
- **4 roles de usuario** definidos

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

**Última actualización**: Agosto 2025  
**Versión**: 1.0.0  
**Estado**: ✅ Funcional y desplegable
