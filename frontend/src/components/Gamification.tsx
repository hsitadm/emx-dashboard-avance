import { Trophy, Star, Target, Zap, Award, TrendingUp } from 'lucide-react'

const Gamification = () => {
  const userStats = {
    points: 1250,
    level: 5,
    tasksCompleted: 23,
    streak: 7,
    rank: 3,
    totalUsers: 45
  }

  const badges = [
    { id: 1, name: 'Completador', description: '10 tareas completadas', icon: '🎯', earned: true },
    { id: 2, name: 'Velocista', description: '5 tareas en un día', icon: '⚡', earned: true },
    { id: 3, name: 'Colaborador', description: '20 comentarios', icon: '💬', earned: true },
    { id: 4, name: 'Líder Regional', description: 'Top 3 en región', icon: '👑', earned: false },
    { id: 5, name: 'Mentor', description: 'Ayudar a 5 compañeros', icon: '🎓', earned: false },
    { id: 6, name: 'Innovador', description: 'Sugerir mejora implementada', icon: '💡', earned: false }
  ]

  const leaderboard = [
    { rank: 1, name: 'María González', points: 1580, region: 'CECA', avatar: '👩‍💼' },
    { rank: 2, name: 'Carlos Ruiz', points: 1420, region: 'SOLA', avatar: '👨‍💼' },
    { rank: 3, name: 'Usuario Demo', points: 1250, region: 'MX', avatar: '🧑‍💼', isCurrentUser: true },
    { rank: 4, name: 'Ana López', points: 1180, region: 'MX', avatar: '👩‍💻' },
    { rank: 5, name: 'Pedro Martín', points: 1050, region: 'SNAP', avatar: '👨‍💻' }
  ]

  const achievements = [
    { title: 'Racha de 7 días', description: 'Has completado tareas 7 días seguidos', points: 100, new: true },
    { title: 'Colaborador Activo', description: 'Has comentado en 15 tareas este mes', points: 75, new: false },
    { title: 'Entrega Temprana', description: 'Completaste 3 tareas antes de tiempo', points: 50, new: false }
  ]

  const getProgressToNextLevel = () => {
    const currentLevelPoints = userStats.level * 200
    const nextLevelPoints = (userStats.level + 1) * 200
    const progress = ((userStats.points - currentLevelPoints) / (nextLevelPoints - currentLevelPoints)) * 100
    return Math.min(progress, 100)
  }

  return (
    <div className="space-y-6">
      {/* User Stats Card */}
      <div className="card">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-semibold text-gray-900">Tu Progreso</h2>
          <div className="flex items-center gap-2 text-primary-600">
            <Star className="w-5 h-5" />
            <span className="font-bold">{userStats.points} pts</span>
          </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          <div className="text-center p-4 bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg">
            <div className="text-2xl font-bold text-blue-600">Nivel {userStats.level}</div>
            <div className="text-sm text-blue-700">Líder EMx</div>
          </div>
          
          <div className="text-center p-4 bg-gradient-to-br from-green-50 to-green-100 rounded-lg">
            <div className="text-2xl font-bold text-green-600">{userStats.tasksCompleted}</div>
            <div className="text-sm text-green-700">Tareas Completadas</div>
          </div>
          
          <div className="text-center p-4 bg-gradient-to-br from-orange-50 to-orange-100 rounded-lg">
            <div className="text-2xl font-bold text-orange-600">{userStats.streak}</div>
            <div className="text-sm text-orange-700">Días de Racha</div>
          </div>
          
          <div className="text-center p-4 bg-gradient-to-br from-purple-50 to-purple-100 rounded-lg">
            <div className="text-2xl font-bold text-purple-600">#{userStats.rank}</div>
            <div className="text-sm text-purple-700">Ranking Global</div>
          </div>
        </div>

        {/* Progress to Next Level */}
        <div className="mb-4">
          <div className="flex justify-between text-sm mb-2">
            <span>Progreso al Nivel {userStats.level + 1}</span>
            <span>{Math.round(getProgressToNextLevel())}%</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-3">
            <div 
              className="bg-gradient-to-r from-primary-500 to-primary-600 h-3 rounded-full transition-all duration-500"
              style={{ width: `${getProgressToNextLevel()}%` }}
            ></div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Badges */}
        <div className="card">
          <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
            <Award className="w-5 h-5 text-yellow-500" />
            Insignias
          </h3>
          <div className="grid grid-cols-2 gap-3">
            {badges.map((badge) => (
              <div
                key={badge.id}
                className={`p-3 rounded-lg border-2 transition-all ${
                  badge.earned
                    ? 'border-yellow-200 bg-yellow-50'
                    : 'border-gray-200 bg-gray-50 opacity-60'
                }`}
              >
                <div className="text-center">
                  <div className="text-2xl mb-1">{badge.icon}</div>
                  <div className="font-medium text-sm">{badge.name}</div>
                  <div className="text-xs text-gray-600">{badge.description}</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Leaderboard */}
        <div className="card">
          <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
            <Trophy className="w-5 h-5 text-yellow-500" />
            Ranking
          </h3>
          <div className="space-y-2">
            {leaderboard.map((user) => (
              <div
                key={user.rank}
                className={`flex items-center gap-3 p-3 rounded-lg ${
                  user.isCurrentUser ? 'bg-primary-50 border border-primary-200' : 'hover:bg-gray-50'
                }`}
              >
                <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm ${
                  user.rank === 1 ? 'bg-yellow-100 text-yellow-800' :
                  user.rank === 2 ? 'bg-gray-100 text-gray-800' :
                  user.rank === 3 ? 'bg-orange-100 text-orange-800' :
                  'bg-gray-50 text-gray-600'
                }`}>
                  {user.rank}
                </div>
                <div className="text-2xl">{user.avatar}</div>
                <div className="flex-1">
                  <div className="font-medium text-sm">{user.name}</div>
                  <div className="text-xs text-gray-500">{user.region}</div>
                </div>
                <div className="text-right">
                  <div className="font-bold text-sm">{user.points}</div>
                  <div className="text-xs text-gray-500">puntos</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Recent Achievements */}
      <div className="card">
        <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
          <Zap className="w-5 h-5 text-blue-500" />
          Logros Recientes
        </h3>
        <div className="space-y-3">
          {achievements.map((achievement, index) => (
            <div key={index} className="flex items-center gap-4 p-3 bg-gray-50 rounded-lg">
              <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                <Target className="w-5 h-5 text-blue-600" />
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <span className="font-medium text-sm">{achievement.title}</span>
                  {achievement.new && (
                    <span className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full">
                      ¡Nuevo!
                    </span>
                  )}
                </div>
                <div className="text-xs text-gray-600">{achievement.description}</div>
              </div>
              <div className="text-right">
                <div className="font-bold text-sm text-green-600">+{achievement.points}</div>
                <div className="text-xs text-gray-500">puntos</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default Gamification
