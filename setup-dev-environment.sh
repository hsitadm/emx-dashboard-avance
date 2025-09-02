#!/bin/bash
set -e

echo "🚀 Configurando Ambiente de Desarrollo EMx Dashboard"

# Actualizar sistema
echo "📦 Actualizando sistema..."
sudo yum update -y

# Instalar dependencias básicas
echo "🔧 Instalando dependencias..."
sudo yum install -y git nginx

# Instalar Node.js usando NVM
echo "📥 Instalando Node.js..."
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.0/install.sh | bash
source ~/.bashrc
export NVM_DIR="$HOME/.nvm"
[ -s "$NVM_DIR/nvm.sh" ] && . "$NVM_DIR/nvm.sh"
nvm install 16
nvm use 16

# Configurar Git
echo "🔧 Configurando Git..."
git config --global user.name "EMx Developer"
git config --global user.email "dev@emx-dashboard.com"

# Clonar repositorio
echo "📥 Clonando repositorio..."
git clone https://github.com/hsitadm/emx-dashboard-avance.git
cd emx-dashboard-avance

# Configurar backend
echo "🔧 Configurando backend..."
cd backend
npm install

# Configurar frontend
echo "🔧 Configurando frontend..."
cd ../frontend
npm install

echo "✅ Ambiente de desarrollo configurado"
echo "🌐 Acceso: ssh -i ~/Downloads/emx-dashboard-key.pem ec2-user@[IP_DEV]"
echo "📁 Proyecto en: ~/emx-dashboard-avance"
