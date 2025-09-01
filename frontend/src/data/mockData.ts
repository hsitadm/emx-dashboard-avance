// Datos mock realistas para desarrollo
export const mockStories = [
  {
    id: 1,
    title: "Migración de Base de Datos",
    description: "Migrar la base de datos legacy al nuevo sistema EMx",
    status: "in-progress",
    priority: "high",
    assignee_name: "Carlos Ruiz",
    assignee_id: 2,
    target_date: "2024-12-15",
    region: "TODAS",
    progress: 65,
    completed_tasks: 4,
    task_count: 6
  },
  {
    id: 2,
    title: "Capacitación de Usuarios",
    description: "Entrenar a los usuarios finales en el nuevo sistema",
    status: "pending",
    priority: "medium",
    assignee_name: "María González",
    assignee_id: 3,
    target_date: "2024-12-30",
    region: "CECA",
    progress: 25,
    completed_tasks: 1,
    task_count: 4
  },
  {
    id: 3,
    title: "Integración API Externa",
    description: "Conectar con servicios externos requeridos",
    status: "completed",
    priority: "high",
    assignee_name: "Admin User",
    assignee_id: 1,
    target_date: "2024-11-30",
    region: "SOLA",
    progress: 100,
    completed_tasks: 3,
    task_count: 3
  },
  {
    id: 4,
    title: "Testing y QA",
    description: "Pruebas exhaustivas del sistema completo",
    status: "in-progress",
    priority: "high",
    assignee_name: "Carlos Ruiz",
    assignee_id: 2,
    target_date: "2024-12-20",
    region: "MX",
    progress: 40,
    completed_tasks: 2,
    task_count: 5
  }
]

export const mockTasks = [
  // Tareas para Historia 1 (Migración de Base de Datos)
  {
    id: 1,
    title: "Análisis de esquema actual",
    description: "Documentar estructura de BD legacy",
    status: "completed",
    priority: "high",
    assignee_name: "Carlos Ruiz",
    assignee_id: 2,
    due_date: "2024-11-15",
    region: "TODAS",
    progress: 100,
    story_id: 1
  },
  {
    id: 2,
    title: "Diseño nuevo esquema",
    description: "Crear estructura optimizada para EMx",
    status: "completed",
    priority: "high",
    assignee_name: "Carlos Ruiz",
    assignee_id: 2,
    due_date: "2024-11-25",
    region: "TODAS",
    progress: 100,
    story_id: 1
  },
  {
    id: 3,
    title: "Scripts de migración",
    description: "Desarrollar scripts automatizados",
    status: "completed",
    priority: "medium",
    assignee_name: "María González",
    assignee_id: 3,
    due_date: "2024-12-05",
    region: "TODAS",
    progress: 100,
    story_id: 1
  },
  {
    id: 4,
    title: "Pruebas de migración",
    description: "Validar integridad de datos",
    status: "completed",
    priority: "high",
    assignee_name: "Carlos Ruiz",
    assignee_id: 2,
    due_date: "2024-12-10",
    region: "TODAS",
    progress: 100,
    story_id: 1
  },
  {
    id: 5,
    title: "Migración producción",
    description: "Ejecutar migración en ambiente productivo",
    status: "in-progress",
    priority: "high",
    assignee_name: "Admin User",
    assignee_id: 1,
    due_date: "2024-12-15",
    region: "TODAS",
    progress: 60,
    story_id: 1
  },
  {
    id: 6,
    title: "Validación post-migración",
    description: "Verificar funcionamiento completo",
    status: "pending",
    priority: "high",
    assignee_name: "Carlos Ruiz",
    assignee_id: 2,
    due_date: "2024-12-16",
    region: "TODAS",
    progress: 0,
    story_id: 1
  },

  // Tareas para Historia 2 (Capacitación de Usuarios)
  {
    id: 7,
    title: "Material de capacitación",
    description: "Crear manuales y videos tutoriales",
    status: "completed",
    priority: "medium",
    assignee_name: "María González",
    assignee_id: 3,
    due_date: "2024-12-01",
    region: "CECA",
    progress: 100,
    story_id: 2
  },
  {
    id: 8,
    title: "Sesiones grupales",
    description: "Entrenamientos presenciales por departamento",
    status: "pending",
    priority: "medium",
    assignee_name: "María González",
    assignee_id: 3,
    due_date: "2024-12-20",
    region: "CECA",
    progress: 0,
    story_id: 2
  },
  {
    id: 9,
    title: "Evaluaciones de conocimiento",
    description: "Tests para validar aprendizaje",
    status: "pending",
    priority: "low",
    assignee_name: "María González",
    assignee_id: 3,
    due_date: "2024-12-25",
    region: "CECA",
    progress: 0,
    story_id: 2
  },
  {
    id: 10,
    title: "Soporte post-capacitación",
    description: "Asistencia durante primeras semanas",
    status: "pending",
    priority: "medium",
    assignee_name: "Admin User",
    assignee_id: 1,
    due_date: "2024-12-30",
    region: "CECA",
    progress: 0,
    story_id: 2
  },

  // Tareas para Historia 3 (Integración API Externa) - COMPLETADA
  {
    id: 11,
    title: "Análisis de APIs requeridas",
    description: "Identificar servicios externos necesarios",
    status: "completed",
    priority: "high",
    assignee_name: "Admin User",
    assignee_id: 1,
    due_date: "2024-11-10",
    region: "SOLA",
    progress: 100,
    story_id: 3
  },
  {
    id: 12,
    title: "Implementación conectores",
    description: "Desarrollar interfaces de integración",
    status: "completed",
    priority: "high",
    assignee_name: "Admin User",
    assignee_id: 1,
    due_date: "2024-11-20",
    region: "SOLA",
    progress: 100,
    story_id: 3
  },
  {
    id: 13,
    title: "Pruebas de integración",
    description: "Validar comunicación con APIs externas",
    status: "completed",
    priority: "medium",
    assignee_name: "Carlos Ruiz",
    assignee_id: 2,
    due_date: "2024-11-30",
    region: "SOLA",
    progress: 100,
    story_id: 3
  },

  // Tareas para Historia 4 (Testing y QA)
  {
    id: 14,
    title: "Plan de pruebas",
    description: "Definir estrategia y casos de prueba",
    status: "completed",
    priority: "high",
    assignee_name: "Carlos Ruiz",
    assignee_id: 2,
    due_date: "2024-12-01",
    region: "MX",
    progress: 100,
    story_id: 4
  },
  {
    id: 15,
    title: "Pruebas funcionales",
    description: "Validar funcionalidades principales",
    status: "completed",
    priority: "high",
    assignee_name: "María González",
    assignee_id: 3,
    due_date: "2024-12-10",
    region: "MX",
    progress: 100,
    story_id: 4
  },
  {
    id: 16,
    title: "Pruebas de rendimiento",
    description: "Evaluar performance del sistema",
    status: "in-progress",
    priority: "medium",
    assignee_name: "Carlos Ruiz",
    assignee_id: 2,
    due_date: "2024-12-18",
    region: "MX",
    progress: 70,
    story_id: 4
  },
  {
    id: 17,
    title: "Pruebas de seguridad",
    description: "Validar aspectos de seguridad",
    status: "pending",
    priority: "high",
    assignee_name: "Admin User",
    assignee_id: 1,
    due_date: "2024-12-20",
    region: "MX",
    progress: 0,
    story_id: 4
  },
  {
    id: 18,
    title: "Reporte final QA",
    description: "Documentar resultados y recomendaciones",
    status: "pending",
    priority: "medium",
    assignee_name: "Carlos Ruiz",
    assignee_id: 2,
    due_date: "2024-12-22",
    region: "MX",
    progress: 0,
    story_id: 4
  }
]

export const getTasksByStoryId = (storyId: number) => {
  return mockTasks.filter(task => task.story_id === storyId)
}
