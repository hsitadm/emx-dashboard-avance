import pool from '../config/database.js'

const createTables = async () => {
  try {
    console.log('🔄 Creating database tables...')

    // Users table
    await pool.query(`
      CREATE TABLE IF NOT EXISTS users (
        id SERIAL PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        email VARCHAR(255) UNIQUE NOT NULL,
        role VARCHAR(50) NOT NULL DEFAULT 'collaborator',
        region VARCHAR(50),
        password_hash VARCHAR(255),
        created_at TIMESTAMP DEFAULT NOW(),
        updated_at TIMESTAMP DEFAULT NOW()
      )
    `)

    // Tasks table
    await pool.query(`
      CREATE TABLE IF NOT EXISTS tasks (
        id SERIAL PRIMARY KEY,
        title VARCHAR(255) NOT NULL,
        description TEXT,
        status VARCHAR(50) DEFAULT 'planning',
        assignee_id INTEGER REFERENCES users(id),
        due_date DATE,
        priority VARCHAR(20) DEFAULT 'medium',
        region VARCHAR(50),
        progress INTEGER DEFAULT 0,
        created_at TIMESTAMP DEFAULT NOW(),
        updated_at TIMESTAMP DEFAULT NOW()
      )
    `)

    // Comments table
    await pool.query(`
      CREATE TABLE IF NOT EXISTS comments (
        id SERIAL PRIMARY KEY,
        task_id INTEGER REFERENCES tasks(id) ON DELETE CASCADE,
        content TEXT NOT NULL,
        author_id INTEGER REFERENCES users(id),
        created_at TIMESTAMP DEFAULT NOW()
      )
    `)

    // Milestones table
    await pool.query(`
      CREATE TABLE IF NOT EXISTS milestones (
        id SERIAL PRIMARY KEY,
        title VARCHAR(255) NOT NULL,
        description TEXT,
        due_date DATE NOT NULL,
        status VARCHAR(50) DEFAULT 'pending',
        progress INTEGER DEFAULT 0,
        created_at TIMESTAMP DEFAULT NOW(),
        updated_at TIMESTAMP DEFAULT NOW()
      )
    `)

    console.log('✅ Database tables created successfully')

    // Insert sample users
    await insertProjectUsers()
    
    console.log('🎉 Database initialization completed!')
    
  } catch (error) {
    console.error('❌ Error creating tables:', error)
  }
}

const insertProjectUsers = async () => {
  try {
    console.log('👥 Inserting EMx project users...')

    const users = [
      { name: 'Rafael Gutierrez', email: 'rafael.gutierrez@emx.com', role: 'director', region: 'TODAS' },
      { name: 'Jose Porras', email: 'jose.porras@emx.com', role: 'service-delivery', region: 'TODAS' },
      { name: 'Hector Sandoval', email: 'hector.sandoval@emx.com', role: 'emx-leader', region: 'CECA' },
      { name: 'Hector Martinez', email: 'hector.martinez@emx.com', role: 'emx-leader', region: 'SOLA' },
      { name: 'Alvaro Hernandez', email: 'alvaro.hernandez@emx.com', role: 'emx-champion', region: 'MX' },
      { name: 'María González', email: 'maria.gonzalez@emx.com', role: 'regional', region: 'SNAP' },
      { name: 'Carlos Ruiz', email: 'carlos.ruiz@emx.com', role: 'regional', region: 'COEC' },
      { name: 'Usuario Demo', email: 'demo@emx.com', role: 'director', region: 'TODAS' }
    ]

    for (const user of users) {
      await pool.query(
        `INSERT INTO users (name, email, role, region) 
         VALUES ($1, $2, $3, $4) 
         ON CONFLICT (email) DO NOTHING`,
        [user.name, user.email, user.role, user.region]
      )
    }

    console.log('✅ EMx project users inserted')
  } catch (error) {
    console.error('❌ Error inserting users:', error)
  }
}

// Run initialization
createTables().then(() => {
  process.exit(0)
}).catch((error) => {
  console.error('❌ Database initialization failed:', error)
  process.exit(1)
})
