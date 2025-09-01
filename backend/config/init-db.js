import Database from 'better-sqlite3'
import path from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const db = new Database(path.join(__dirname, '..', 'database.sqlite'))

// Crear tablas
db.exec(`
  -- Usuarios con nuevos roles
  CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    email TEXT UNIQUE NOT NULL,
    role TEXT NOT NULL CHECK (role IN ('admin', 'editor', 'viewer')),
    region TEXT NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  );

  -- Tabla de comentarios
  CREATE TABLE IF NOT EXISTS comments (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER NOT NULL,
    entity_type TEXT NOT NULL CHECK (entity_type IN ('task', 'story', 'milestone')),
    entity_id INTEGER NOT NULL,
    content TEXT NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users (id)
  );

  -- Sesiones de usuario
  CREATE TABLE IF NOT EXISTS user_sessions (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER NOT NULL,
    session_token TEXT UNIQUE NOT NULL,
    expires_at DATETIME NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users (id)
  );
`)

// Actualizar usuarios existentes con nuevos roles
const updateRoles = db.prepare(`
  UPDATE users SET role = CASE 
    WHEN role = 'director' THEN 'admin'
    WHEN role = 'service-delivery' THEN 'admin'
    WHEN role = 'emx-leader' THEN 'editor'
    WHEN role = 'emx-champion' THEN 'editor'
    WHEN role = 'regional' THEN 'editor'
    ELSE 'viewer'
  END
`)

try {
  updateRoles.run()
  console.log('✅ Base de datos actualizada con nuevos roles')
} catch (error) {
  console.log('ℹ️ Roles ya actualizados o tabla nueva')
}

// Agregar usuarios de ejemplo para testing
const insertUser = db.prepare(`
  INSERT OR IGNORE INTO users (name, email, role, region) 
  VALUES (?, ?, ?, ?)
`)

const testUsers = [
  ['Admin User', 'admin@emx.com', 'admin', 'TODAS'],
  ['Editor User', 'editor@emx.com', 'editor', 'CECA'],
  ['Viewer User', 'viewer@emx.com', 'viewer', 'SOLA']
]

testUsers.forEach(user => {
  try {
    insertUser.run(...user)
  } catch (error) {
    // Usuario ya existe
  }
})

db.close()
console.log('✅ Inicialización de base de datos completada')
