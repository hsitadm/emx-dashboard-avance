import { db, run } from '../config/database.js'

const setupDatabase = async () => {
  try {
    console.log('🔄 Setting up SQLite database...')

    // Create tables
    await run(`
      CREATE TABLE IF NOT EXISTS users (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL,
        email TEXT UNIQUE NOT NULL,
        role TEXT NOT NULL DEFAULT 'collaborator',
        region TEXT,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
      )
    `)

    await run(`
      CREATE TABLE IF NOT EXISTS tasks (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        title TEXT NOT NULL,
        description TEXT,
        status TEXT DEFAULT 'planning',
        assignee_id INTEGER,
        due_date DATE,
        priority TEXT DEFAULT 'medium',
        region TEXT,
        progress INTEGER DEFAULT 0,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (assignee_id) REFERENCES users (id)
      )
    `)

    await run(`
      CREATE TABLE IF NOT EXISTS comments (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        task_id INTEGER,
        content TEXT NOT NULL,
        author_id INTEGER,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (task_id) REFERENCES tasks (id),
        FOREIGN KEY (author_id) REFERENCES users (id)
      )
    `)

    await run(`
      CREATE TABLE IF NOT EXISTS milestones (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        title TEXT NOT NULL,
        description TEXT,
        due_date DATE NOT NULL,
        status TEXT DEFAULT 'pending',
        progress INTEGER DEFAULT 0,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
      )
    `)

    console.log('✅ Tables created')

    // Insert users
    const users = [
      ['Rafael Gutierrez', 'rafael.gutierrez@emx.com', 'director', 'TODAS'],
      ['Jose Porras', 'jose.porras@emx.com', 'service-delivery', 'TODAS'],
      ['Hector Sandoval', 'hector.sandoval@emx.com', 'emx-leader', 'CECA'],
      ['Hector Martinez', 'hector.martinez@emx.com', 'emx-leader', 'SOLA'],
      ['Alvaro Hernandez', 'alvaro.hernandez@emx.com', 'emx-champion', 'MX'],
      ['María González', 'maria.gonzalez@emx.com', 'regional', 'SNAP'],
      ['Carlos Ruiz', 'carlos.ruiz@emx.com', 'regional', 'COEC'],
      ['Usuario Demo', 'demo@emx.com', 'director', 'TODAS']
    ]

    for (const user of users) {
      await run('INSERT OR IGNORE INTO users (name, email, role, region) VALUES (?, ?, ?, ?)', user)
    }

    console.log('✅ Users inserted')

    // Insert EMx tasks
    const tasks = [
      ['Definición de roles para la comunicación', 'Detallar las nuevas responsabilidades y expectativas para cada rol en el nuevo organigrama', 'completed', 1, '2025-06-19', 'high', 'TODAS', 100],
      ['Elaborar el plan de comunicaciones', 'Explicamos el porque el cambio y el mensaje organización alineado a las expectativas comerciales y operaciones', 'completed', 2, '2025-06-26', 'high', 'TODAS', 100],
      ['Reuniones con los líderes', 'Nos reunimos con los service delivery lead para informarles con mayor detalle sobre el cambio de funciones', 'completed', 3, '2025-07-07', 'high', 'TODAS', 100],
      ['Comunicado Oficial', 'Realizar una reunión con todos los miembros del equipo de operaciones para presentar la nueva estructura', 'completed', 3, '2025-07-07', 'high', 'TODAS', 100],
      ['Sesión de preguntas y respuestas', 'Abrir un espacio para resolver dudas y asegurar que todos se sientan informados y escuchados', 'completed', 2, '2025-07-15', 'medium', 'TODAS', 100],
      ['Inicio del Proceso de Handover', 'El Service Delivery Lead detalla los pendientes que se tienen los recursos en uno de los proyectos', 'in-progress', 3, '2025-08-08', 'high', 'TODAS', 75],
      ['Elección y onboarding de Champions', 'Se definen quienes serán los responsables de cada una de las regiones para el servicio gestionado', 'completed', 2, '2025-08-05', 'high', 'TODAS', 100],
      ['Reuniones de Inicio de los Nuevos Líderes', 'Se define lo que se espera de los líderes y cuales es el roadmap de corto plazo para el servicio', 'completed', 2, '2025-08-06', 'high', 'TODAS', 100],
      ['Go-Live del Nuevo Organigrama', 'Se realiza la reunión con el nuevo organigrama propuesta - Todas las regiones de EMx', 'completed', 2, '2025-08-14', 'high', 'TODAS', 100],
      ['Relevamiento de cuentas - Operativo', 'Identificación de cuentas críticas a nivel operativo por región', 'in-progress', 3, '2025-08-19', 'high', 'CECA', 60],
      ['Relevamiento de cuentas - Comercial', 'Identificación de cuentas con mayor prospección en el servicio', 'in-progress', 2, '2025-09-01', 'high', 'SOLA', 40],
      ['Relevamiento del estado de la operación', 'Identificar toda la documentación que se tiene por cliente', 'in-progress', 3, '2025-08-30', 'medium', 'MX', 50],
      ['Identificación de Capacidades', 'Identificar las capacidades y perfiles técnicos que se tienen en el servicio', 'in-progress', 4, '2025-09-15', 'medium', 'SNAP', 30],
      ['Formación de N2 fuera de horario', 'Identificar los candidatos que podrían hacer fuera de horario de oficina', 'in-progress', 5, '2025-09-20', 'medium', 'COEC', 25],
      ['Finalización del Handover', 'Se completa y documenta la transición', 'planning', 3, '2025-07-10', 'high', 'TODAS', 0],
      ['Elaboración de MOF', 'Se establecen todas las funciones que deben realizar los recursos', 'planning', 3, '2025-08-22', 'medium', 'TODAS', 0],
      ['Seguimiento diario de Liderazgo', 'Reuniones entre los líderes para discutir problemas de la transición', 'planning', 2, '2025-08-29', 'medium', 'TODAS', 0],
      ['Recopilación de Feedback Inicial', 'Recoger feedback sobre cómo se sienten con la nueva estructura', 'planning', 3, '2025-07-29', 'medium', 'TODAS', 0],
      ['Planificar comunicación con clientes', 'Plan de comunicación a los clientes más críticos', 'planning', 2, '2025-09-08', 'high', 'TODAS', 0],
      ['Offering DevSecOps', 'Desarrollo de la oferta de servicios DevSecOps', 'planning', 1, '2025-10-01', 'medium', 'TODAS', 0],
      ['Offering SOC', 'Desarrollo de la oferta de Security Operations Center', 'planning', 1, '2025-10-15', 'medium', 'TODAS', 0],
      ['Estrategia de Pricing', 'Definición de la estrategia de precios para los nuevos servicios', 'planning', 1, '2025-09-30', 'high', 'TODAS', 0]
    ]

    for (const task of tasks) {
      await run('INSERT INTO tasks (title, description, status, assignee_id, due_date, priority, region, progress) VALUES (?, ?, ?, ?, ?, ?, ?, ?)', task)
    }

    console.log('✅ Tasks inserted')

    // Insert milestones
    const milestones = [
      ['Kick-off del Proyecto EMx', 'Inicio oficial de la transición', '2025-06-19', 'completed', 100],
      ['Comunicación y Preparación', 'Completar comunicación interna', '2025-07-15', 'completed', 100],
      ['Transición de Equipos', 'Finalizar handover y alineamiento', '2025-08-30', 'in-progress', 70],
      ['Estabilización del Servicio', 'Monitoreo y optimización', '2025-09-30', 'planning', 0],
      ['Go-Live Completo EMx', 'Lanzamiento oficial', '2025-11-01', 'planning', 0]
    ]

    for (const milestone of milestones) {
      await run('INSERT INTO milestones (title, description, due_date, status, progress) VALUES (?, ?, ?, ?, ?)', milestone)
    }

    console.log('✅ Milestones inserted')
    console.log('🎉 Database setup completed!')

  } catch (error) {
    console.error('❌ Setup error:', error)
  } finally {
    db.close()
  }
}

setupDatabase()
