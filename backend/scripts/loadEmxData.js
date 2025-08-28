import pool from '../config/database.js'

const emxTasks = [
  // Preparación y Comunicación Interna
  {
    title: 'Definición de roles para la comunicación',
    description: 'Detallar las nuevas responsabilidades y expectativas para cada rol en el nuevo organigrama en la presentación Global',
    status: 'completed',
    assignee: 'Rafael Gutierrez',
    due_date: '2025-06-19',
    priority: 'high',
    region: 'TODAS',
    progress: 100
  },
  {
    title: 'Elaborar el plan de comunicaciones',
    description: 'Explicamos el porque el cambio y el mensaje organización alineado a las expectativas comerciales y operaciones',
    status: 'completed',
    assignee: 'Jose Porras',
    due_date: '2025-06-26',
    priority: 'high',
    region: 'TODAS',
    progress: 100
  },
  {
    title: 'Reuniones con los líderes (Comerciales - Service Delivery lead)',
    description: 'Nos reunimos con los service delivery lead para informarles con mayor detalle sobre el cambio de funciones, roles y personas',
    status: 'completed',
    assignee: 'Hector Sandoval',
    due_date: '2025-07-07',
    priority: 'high',
    region: 'TODAS',
    progress: 100
  },
  {
    title: 'Comunicado Oficial',
    description: 'Realizar una reunión con todos los miembros del equipo de operaciones para presentar la nueva estructura, explicar los beneficios, cronograma y roadmap',
    status: 'completed',
    assignee: 'Hector Sandoval',
    due_date: '2025-07-07',
    priority: 'high',
    region: 'TODAS',
    progress: 100
  },
  {
    title: 'Sesión de preguntas y respuestas',
    description: 'Abrir un espacio para resolver dudas y asegurar que todos se sientan informados y escuchados',
    status: 'completed',
    assignee: 'Jose Porras',
    due_date: '2025-07-15',
    priority: 'medium',
    region: 'TODAS',
    progress: 100
  },

  // Transición y Alineamiento de Equipos
  {
    title: 'Inicio del Proceso de Handover',
    description: 'El Service Delivery Lead detalla los pendientes que se tienen los recursos en uno de los proyectos',
    status: 'in-progress',
    assignee: 'Hector Sandoval',
    due_date: '2025-08-08',
    priority: 'high',
    region: 'TODAS',
    progress: 75
  },
  {
    title: 'Elección y onboarding de Champions de cada región',
    description: 'Se definen quienes serán los responsables de cada una de las regiones para el servicio gestionado, asimismo una reunión en la que se tiene que explicar lo que se espera de su rol',
    status: 'completed',
    assignee: 'Jose Porras',
    due_date: '2025-08-05',
    priority: 'high',
    region: 'TODAS',
    progress: 100
  },
  {
    title: 'Reuniones de Inicio de los Nuevos Líderes',
    description: 'Se tiene una nueva reunión donde el objetivo principal es definir lo que se espera de los líderes y cuales es el roadmap de corto plazo para el servicio',
    status: 'completed',
    assignee: 'Jose Porras',
    due_date: '2025-08-06',
    priority: 'high',
    region: 'TODAS',
    progress: 100
  },
  {
    title: 'Go-Live del Nuevo Organigrama',
    description: 'Se realiza la reunión con el nuevo organigrama propuesta así como los ingresos que se van a contratar en cada región - Todas las regiones de EMx',
    status: 'completed',
    assignee: 'Jose Porras',
    due_date: '2025-08-14',
    priority: 'high',
    region: 'TODAS',
    progress: 100
  },
  {
    title: 'Relevamiento de cuentas - Operativo',
    description: 'Identificación de cuentas críticas a nivel operativo por región, esto en base a los tickets a nivel operativo y criticidad del servicio COM',
    status: 'in-progress',
    assignee: 'Hector Sandoval',
    due_date: '2025-08-19',
    priority: 'high',
    region: 'CECA',
    progress: 60
  },
  {
    title: 'Relevamiento de cuentas - Comercial',
    description: 'Identificación de cuentas con mayor prospección en el servicio, asimismo donde se detecten oportunidades a corto plazo',
    status: 'in-progress',
    assignee: 'Jose Porras',
    due_date: '2025-09-01',
    priority: 'high',
    region: 'SOLA',
    progress: 40
  },
  {
    title: 'Relevamiento del estado de la operación por región',
    description: 'Identificar toda la documentación que se tiene por cliente en base a lo definido en las dos anteriores actividades, asimismo de las actividades que aún están pendientes',
    status: 'in-progress',
    assignee: 'Hector Sandoval',
    due_date: '2025-08-30',
    priority: 'medium',
    region: 'MX',
    progress: 50
  },
  {
    title: 'Identificación de Capacidades',
    description: 'Identificar las capacidades y perfiles técnicos que se tienen en el servicio',
    status: 'in-progress',
    assignee: 'Hector Martinez',
    due_date: '2025-09-15',
    priority: 'medium',
    region: 'SNAP',
    progress: 30
  },
  {
    title: 'Formación de N2 fuera de horario de oficina',
    description: 'Identificar los candidatos que podrían hacer fuera de horario de oficina',
    status: 'in-progress',
    assignee: 'Alvaro Hernandez',
    due_date: '2025-09-20',
    priority: 'medium',
    region: 'COEC',
    progress: 25
  },
  {
    title: 'Finalización del Handover',
    description: 'Se completa y documenta la transición',
    status: 'planning',
    assignee: 'Hector Sandoval',
    due_date: '2025-07-10',
    priority: 'high',
    region: 'TODAS',
    progress: 0
  },

  // Estabilización y Monitoreo
  {
    title: 'Elaboración de MOF',
    description: 'Se establecen y se detallan todas las funciones que deben de realizar los recursos en este proceso, se elabora la documentación',
    status: 'planning',
    assignee: 'Hector Sandoval',
    due_date: '2025-08-22',
    priority: 'medium',
    region: 'TODAS',
    progress: 0
  },
  {
    title: 'Seguimiento diario de Liderazgo',
    description: 'Breves reuniones interdiarias entre los líderes de la nueva estructura para discutir cualquier fricción o problema surgido de la transición',
    status: 'planning',
    assignee: 'Jose Porras',
    due_date: '2025-08-29',
    priority: 'medium',
    region: 'TODAS',
    progress: 0
  },
  {
    title: 'Recopilación de Feedback Inicial',
    description: 'Recoger feedback de los miembros del equipo sobre cómo se sienten y qué desafíos están encontrando con la nueva estructura',
    status: 'planning',
    assignee: 'Hector Sandoval',
    due_date: '2025-07-29',
    priority: 'medium',
    region: 'TODAS',
    progress: 0
  },
  {
    title: 'Lecciones aprendidas',
    description: 'Realizar una retrospectiva sobre el proceso de toma de servicio para identificar qué funcionó bien y qué se puede mejorar en futuros cambios organizacionales',
    status: 'planning',
    assignee: 'Hector Sandoval',
    due_date: '2025-09-01',
    priority: 'low',
    region: 'TODAS',
    progress: 0
  },

  // Comunicación Externa y Optimización
  {
    title: 'Planificar comunicación con clientes',
    description: 'Se establece un plan de comunicación a los clientes más críticos para que sepan sobre el nivel de escalamiento',
    status: 'planning',
    assignee: 'Jose Porras',
    due_date: '2025-09-08',
    priority: 'high',
    region: 'TODAS',
    progress: 0
  },
  {
    title: 'Inicio de optimización de procesos',
    description: 'Se inicia la documentación de los procesos que se requieren modificar, asimismo la evaluación de herramientas',
    status: 'planning',
    assignee: 'Jose Porras',
    due_date: '2025-08-22',
    priority: 'medium',
    region: 'TODAS',
    progress: 0
  },

  // Pendientes
  {
    title: 'Offering DevSecOps',
    description: 'Desarrollo de la oferta de servicios DevSecOps para el portafolio EMx',
    status: 'planning',
    assignee: 'Rafael Gutierrez',
    due_date: '2025-10-01',
    priority: 'medium',
    region: 'TODAS',
    progress: 0
  },
  {
    title: 'Offering SOC',
    description: 'Desarrollo de la oferta de Security Operations Center para el portafolio EMx',
    status: 'planning',
    assignee: 'Rafael Gutierrez',
    due_date: '2025-10-15',
    priority: 'medium',
    region: 'TODAS',
    progress: 0
  },
  {
    title: 'Offering CMDB',
    description: 'Desarrollo de la oferta de Configuration Management Database para el portafolio EMx',
    status: 'planning',
    assignee: 'Hector Martinez',
    due_date: '2025-11-01',
    priority: 'medium',
    region: 'TODAS',
    progress: 0
  },
  {
    title: 'Estrategia de Pricing',
    description: 'Definición de la estrategia de precios para los nuevos servicios EMx',
    status: 'planning',
    assignee: 'Rafael Gutierrez',
    due_date: '2025-09-30',
    priority: 'high',
    region: 'TODAS',
    progress: 0
  },
  {
    title: 'Roadmap para el programa de MSP',
    description: 'Desarrollo del roadmap para el programa de Managed Service Provider',
    status: 'planning',
    assignee: 'Jose Porras',
    due_date: '2025-10-30',
    priority: 'high',
    region: 'TODAS',
    progress: 0
  }
]

const loadEmxData = async () => {
  try {
    console.log('🔄 Loading EMx project data...')

    // Primero, obtener los IDs de los usuarios
    const users = await pool.query('SELECT id, name FROM users')
    const userMap = {}
    users.rows.forEach(user => {
      userMap[user.name] = user.id
    })

    // Insertar tareas
    for (const task of emxTasks) {
      const assigneeId = userMap[task.assignee] || userMap['Usuario Demo']
      
      await pool.query(
        `INSERT INTO tasks (title, description, status, assignee_id, due_date, priority, region, progress) 
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8)`,
        [
          task.title,
          task.description,
          task.status,
          assigneeId,
          task.due_date,
          task.priority,
          task.region,
          task.progress
        ]
      )
    }

    // Insertar milestones principales
    const milestones = [
      {
        title: 'Kick-off del Proyecto EMx',
        description: 'Inicio oficial de la transición al nuevo servicio EMx',
        due_date: '2025-06-19',
        status: 'completed',
        progress: 100
      },
      {
        title: 'Comunicación y Preparación',
        description: 'Completar todas las actividades de comunicación interna',
        due_date: '2025-07-15',
        status: 'completed',
        progress: 100
      },
      {
        title: 'Transición de Equipos',
        description: 'Finalizar el handover y alineamiento de equipos',
        due_date: '2025-08-30',
        status: 'in-progress',
        progress: 70
      },
      {
        title: 'Estabilización del Servicio',
        description: 'Monitoreo y optimización de la nueva estructura',
        due_date: '2025-09-30',
        status: 'planning',
        progress: 0
      },
      {
        title: 'Go-Live Completo EMx',
        description: 'Lanzamiento oficial del nuevo servicio EMx',
        due_date: '2025-11-01',
        status: 'planning',
        progress: 0
      }
    ]

    for (const milestone of milestones) {
      await pool.query(
        `INSERT INTO milestones (title, description, due_date, status, progress) 
         VALUES ($1, $2, $3, $4, $5)`,
        [milestone.title, milestone.description, milestone.due_date, milestone.status, milestone.progress]
      )
    }

    console.log(`✅ Loaded ${emxTasks.length} tasks and ${milestones.length} milestones`)
    console.log('🎉 EMx project data loaded successfully!')

  } catch (error) {
    console.error('❌ Error loading EMx data:', error)
  }
}

// Run the data loading
loadEmxData().then(() => {
  process.exit(0)
}).catch((error) => {
  console.error('❌ Failed to load EMx data:', error)
  process.exit(1)
})
