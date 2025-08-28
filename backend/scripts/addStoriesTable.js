import { db, run } from '../config/database.js'

const addStoriesTable = async () => {
  try {
    console.log('🔄 Adding stories table...')

    // Create stories table
    await run(`
      CREATE TABLE IF NOT EXISTS stories (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        title TEXT NOT NULL,
        description TEXT,
        status TEXT DEFAULT 'active',
        priority TEXT DEFAULT 'medium',
        region TEXT,
        assignee_id INTEGER,
        start_date DATE,
        target_date DATE,
        progress INTEGER DEFAULT 0,
        milestone_id INTEGER,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (assignee_id) REFERENCES users (id),
        FOREIGN KEY (milestone_id) REFERENCES milestones (id)
      )
    `)

    // Add story_id to tasks table
    await run(`
      ALTER TABLE tasks ADD COLUMN story_id INTEGER REFERENCES stories(id)
    `)

    console.log('✅ Stories table created')

    // Insert sample stories
    const stories = [
      ['Comunicación y Preparación', 'Todas las actividades relacionadas con comunicar el cambio organizacional', 'completed', 'high', 'TODAS', 2, '2025-06-19', '2025-07-15', 100],
      ['Transición de Equipos', 'Handover y alineamiento de los nuevos equipos regionales', 'in-progress', 'high', 'TODAS', 3, '2025-07-07', '2025-08-30', 70],
      ['Estabilización del Servicio', 'Monitoreo y optimización de la nueva estructura', 'active', 'medium', 'TODAS', 2, '2025-08-01', '2025-09-30', 25],
      ['Nuevas Ofertas', 'Desarrollo de nuevos servicios y estrategias', 'active', 'medium', 'TODAS', 1, '2025-09-01', '2025-11-01', 0]
    ]

    for (const story of stories) {
      await run('INSERT INTO stories (title, description, status, priority, region, assignee_id, start_date, target_date, progress) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)', story)
    }

    // Update existing tasks to belong to stories
    await run('UPDATE tasks SET story_id = 1 WHERE title LIKE "%comunicaci%" OR title LIKE "%Comunicado%" OR title LIKE "%preguntas%"')
    await run('UPDATE tasks SET story_id = 2 WHERE title LIKE "%Handover%" OR title LIKE "%Champions%" OR title LIKE "%Líderes%" OR title LIKE "%Organigrama%" OR title LIKE "%Relevamiento%"')
    await run('UPDATE tasks SET story_id = 3 WHERE title LIKE "%MOF%" OR title LIKE "%Seguimiento%" OR title LIKE "%Feedback%"')
    await run('UPDATE tasks SET story_id = 4 WHERE title LIKE "%Offering%" OR title LIKE "%Pricing%" OR title LIKE "%Roadmap%"')

    console.log('✅ Sample stories inserted and tasks linked')
    console.log('🎉 Stories system setup completed!')

  } catch (error) {
    console.error('❌ Setup error:', error)
  } finally {
    db.close()
  }
}

addStoriesTable()
