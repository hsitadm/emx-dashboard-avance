#!/bin/bash
set -e

echo "🔄 Sincronizando DEV con configuración PROD"

# Variables
PROD_IP="18.207.149.36"
DEV_IP="3.84.113.55"  # O la nueva IP si creamos otra instancia
KEY_PATH="./emx-dashboard-key.pem"

echo "📋 Verificando configuración PROD..."
ssh -i $KEY_PATH ec2-user@$PROD_IP "
echo '=== PROD Configuration ==='
echo 'Node.js version:'
node --version
echo 'PM2 processes:'
pm2 list
echo 'Nginx status:'
sudo systemctl status nginx --no-pager
echo 'Database:'
ls -la ~/emx-dashboard-avance/backend/database.sqlite
echo 'Frontend build:'
ls -la ~/emx-dashboard-avance/frontend/dist/
"

echo "🔧 Configurando DEV idéntico a PROD..."
ssh -i $KEY_PATH ec2-user@$DEV_IP "
# Actualizar sistema
sudo yum update -y

# Instalar Node.js 16 (igual que PROD)
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.0/install.sh | bash
export NVM_DIR=\"\$HOME/.nvm\"
[ -s \"\$NVM_DIR/nvm.sh\" ] && . \"\$NVM_DIR/nvm.sh\"
nvm install 16
nvm use 16
nvm alias default 16

# Instalar PM2 globalmente
npm install -g pm2

# Instalar nginx
sudo yum install -y nginx

# Clonar repositorio si no existe
if [ ! -d \"emx-dashboard-avance\" ]; then
    git clone https://github.com/hsitadm/emx-dashboard-avance.git
fi

cd emx-dashboard-avance

# Actualizar código
git pull origin main

# Instalar dependencias backend
cd backend
npm install

# Instalar dependencias frontend
cd ../frontend
npm install

# Build frontend
npm run build

# Configurar PM2
cd ../backend
pm2 start server.js --name emx-dashboard
pm2 save
pm2 startup

# Configurar nginx (copiar configuración de PROD)
sudo systemctl enable nginx
sudo systemctl start nginx
"

echo "📁 Copiando configuración nginx de PROD a DEV..."
scp -i $KEY_PATH ec2-user@$PROD_IP:/etc/nginx/nginx.conf /tmp/nginx-prod.conf
scp -i $KEY_PATH /tmp/nginx-prod.conf ec2-user@$DEV_IP:/tmp/
ssh -i $KEY_PATH ec2-user@$DEV_IP "
sudo cp /tmp/nginx-prod.conf /etc/nginx/nginx.conf
sudo nginx -t
sudo systemctl reload nginx
"

echo "📊 Copiando base de datos de PROD a DEV..."
scp -i $KEY_PATH ec2-user@$PROD_IP:~/emx-dashboard-avance/backend/database.sqlite /tmp/
scp -i $KEY_PATH /tmp/database.sqlite ec2-user@$DEV_IP:~/emx-dashboard-avance/backend/

echo "🔄 Reiniciando servicios en DEV..."
ssh -i $KEY_PATH ec2-user@$DEV_IP "
cd emx-dashboard-avance/backend
pm2 restart emx-dashboard
pm2 logs emx-dashboard --lines 10
"

echo "✅ DEV sincronizado con PROD"
echo "🌐 DEV: http://$DEV_IP"
echo "🌐 PROD: http://$PROD_IP"
echo ""
echo "🔍 Verificar que ambos ambientes respondan igual:"
echo "curl http://$DEV_IP/api/health"
echo "curl http://$PROD_IP/api/health"
