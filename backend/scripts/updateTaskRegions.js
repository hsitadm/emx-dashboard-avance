import { db, run } from '../config/database.js'

const updateTaskRegions = async () => {
  try {
    console.log('🔄 Updating task regions for better distribution...')

    // Actualizar tareas específicas con regiones
    const updates = [
      // Tareas de CECA
      { title: 'Relevamiento de cuentas - Operativo', region: 'CECA' },
      { title: 'Identificación de Capacidades', region: 'CECA' },
      
      // Tareas de SOLA  
      { title: 'Relevamiento de cuentas - Comercial', region: 'SOLA' },
      { title: 'Formación de N2 fuera de horario', region: 'SOLA' },
      
      // Tareas de MX
      { title: 'Relevamiento del estado de la operación', region: 'MX' },
      { title: 'Offering DevSecOps', region: 'MX' },
      
      // Tareas de SNAP
      { title: 'Offering SOC', region: 'SNAP' },
      { title: 'Estrategia de Pricing', region: 'SNAP' },
      
      // Tareas de COEC
      { title: 'Offering CMDB', region: 'COEC' },
      { title: 'Roadmap para el programa de MSP', region: 'COEC' },
      
      // Algunas tareas siguen siendo TODAS (globales)
      { title: 'Definición de roles para la comunicación', region: 'TODAS' },
      { title: 'Elaborar el plan de comunicaciones', region: 'TODAS' },
      { title: 'Comunicado Oficial', region: 'TODAS' },
      { title: 'Go-Live del Nuevo Organigrama', region: 'TODAS' }
    ]

    for (const update of updates) {
      const result = await run(
        'UPDATE tasks SET region = ? WHERE title LIKE ?',
        [update.region, `%${update.title}%`]
      )
      
      if (result.changes > 0) {
        console.log(`✅ Updated "${update.title}" → ${update.region}`)
      }
    }

    // Verificar la distribución actualizada
    const regionDistribution = await db.query(`
      SELECT region, 
             COUNT(*) as total,
             COUNT(CASE WHEN status = 'completed' THEN 1 END) as completed,
             COUNT(CASE WHEN status != 'completed' THEN 1 END) as pending
      FROM tasks 
      GROUP BY region 
      ORDER BY region
    `)

    console.log('\n📊 Nueva distribución por región:')
    regionDistribution.rows.forEach(row => {
      console.log(`${row.region}: ${row.total} total (${row.completed} completadas, ${row.pending} pendientes)`)
    })

    console.log('\n🎉 Task regions updated successfully!')

  } catch (error) {
    console.error('❌ Error updating task regions:', error)
  } finally {
    db.close()
  }
}

updateTaskRegions()
