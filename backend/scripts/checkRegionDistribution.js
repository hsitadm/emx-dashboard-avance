import { db, query } from '../config/database.js'

const checkDistribution = async () => {
  try {
    console.log('📊 Verificando distribución actual por región...')

    const regionDistribution = await query(`
      SELECT region, 
             COUNT(*) as total,
             COUNT(CASE WHEN status = 'completed' THEN 1 END) as completed,
             COUNT(CASE WHEN status != 'completed' THEN 1 END) as pending
      FROM tasks 
      GROUP BY region 
      ORDER BY region
    `)

    console.log('\n📈 Distribución por región:')
    regionDistribution.rows.forEach(row => {
      console.log(`${row.region}: ${row.total} total (${row.completed} completadas, ${row.pending} pendientes)`)
    })

    console.log('\n✅ Distribución verificada!')

  } catch (error) {
    console.error('❌ Error:', error)
  } finally {
    db.close()
  }
}

checkDistribution()
