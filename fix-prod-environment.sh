#!/bin/bash
set -e

echo "🔧 Arreglando configuración PROD"

PROD_IP="18.207.149.36"
KEY_PATH="./emx-dashboard-key.pem"

echo "📋 Configurando PROD correctamente..."
ssh -i $KEY_PATH ec2-user@$PROD_IP "
# Instalar NVM y Node.js 16
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.0/install.sh | bash
export NVM_DIR=\"\$HOME/.nvm\"
[ -s \"\$NVM_DIR/nvm.sh\" ] && . \"\$NVM_DIR/nvm.sh\"
nvm install 16
nvm use 16
nvm alias default 16

# Instalar PM2
npm install -g pm2

# Ir al proyecto
cd emx-dashboard-avance

# Actualizar código
git pull origin main

# Instalar dependencias backend
cd backend
npm install

# Instalar dependencias frontend  
cd ../frontend
npm install
npm run build

# Iniciar backend con PM2
cd ../backend
pm2 start server.js --name emx-dashboard
pm2 save
pm2 startup

# Verificar que esté funcionando
sleep 5
pm2 list
curl localhost:3001/api/health || echo 'API no responde aún'
"

echo "✅ PROD configurado. Verificando..."
ssh -i $KEY_PATH ec2-user@$PROD_IP "
export NVM_DIR=\"\$HOME/.nvm\"
[ -s \"\$NVM_DIR/nvm.sh\" ] && . \"\$NVM_DIR/nvm.sh\"
echo 'Node version:' \$(node --version)
echo 'PM2 processes:'
pm2 list
echo 'API health:'
curl -s localhost:3001/api/health || echo 'API no disponible'
"
