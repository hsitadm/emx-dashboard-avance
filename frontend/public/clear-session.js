// Script para limpiar sesión y forzar login
localStorage.removeItem('authToken')
localStorage.removeItem('authUser')
localStorage.setItem('hasLoggedOut', 'true')
console.log('✅ Sesión limpiada - recarga la página para ver login')
